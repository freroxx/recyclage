import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Mail, Send, MessageCircle, User, AtSign, Shield, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSoundEffects } from "@/hooks/useSoundEffects";

export default function Contact() {
  const { t, language } = useLanguage();
  const { playSuccessSound, playErrorSound } = useSoundEffects();
  useScrollReveal();

  const turnstileRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile for performance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Turnstile with better error handling
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setTurnstileLoaded(true);
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAACIP-ezbrfMoU0rB",
          callback: (token: string) => {
            setTurnstileToken(token);
            playSuccessSound();
            toast.success(
              language === "fr" 
                ? "Vérification de sécurité réussie" 
                : "Security verification successful",
              { duration: 2000 }
            );
          },
          "refresh-expired": "auto",
          "retry": "auto",
          "appearance": "always",
          theme: "light"
        });
      }
    };

    script.onerror = () => {
      toast.error(
        language === "fr"
          ? "Erreur de chargement du vérificateur de sécurité"
          : "Security checker failed to load"
      );
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [language, playSuccessSound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      playErrorSound();
      toast.error(
        t("contact.fillAllFields") || "Please fill in all fields",
        {
          description: language === "fr"
            ? "Tous les champs sont requis"
            : "All fields are required",
        }
      );
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      playErrorSound();
      toast.error(
        t("contact.validEmail") || "Please enter a valid email address",
        {
          description: language === "fr"
            ? "Veuillez entrer une adresse email valide"
            : "Please provide a valid email address",
        }
      );
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      playErrorSound();
      toast.error(
        language === "fr" ? "Vérification de sécurité requise" : "Security verification required",
        {
          description: language === "fr"
            ? "Veuillez compléter le vérificateur de sécurité"
            : "Please complete the security check",
        }
      );
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading(
      language === "fr" ? "Envoi en cours..." : "Sending message...",
      {
        duration: Infinity,
      }
    );

    try {
      const response = await fetch("https://formspree.io/f/mkowrblv", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          "cf-turnstile-response": turnstileToken,
          _language: language,
        }),
      });

      if (!response.ok) throw new Error("Formspree submission failed");

      playSuccessSound();
      toast.dismiss(loadingToast);
      toast.success(
        t("contact.success") || "Success",
        {
          description: language === "fr"
            ? "Message envoyé avec succès. Nous vous répondrons dès que possible."
            : "Message sent successfully. We'll get back to you as soon as possible.",
          duration: 5000,
          action: {
            label: language === "fr" ? "OK" : "OK",
            onClick: () => {},
          },
        }
      );

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setTurnstileToken("");
      
      // Reset Turnstile
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileRef.current);
      }
      
    } catch (error) {
      playErrorSound();
      toast.dismiss(loadingToast);
      toast.error(
        t("contact.error") || "Error",
        {
          description: language === "fr"
            ? "Une erreur est survenue. Veuillez réessayer dans quelques minutes."
            : "An error occurred. Please try again in a few minutes.",
          duration: 5000,
          action: {
            label: language === "fr" ? "Réessayer" : "Retry",
            onClick: () => handleSubmit(e),
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        
        {/* Animated orbs with optimized performance */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-orb-slow" />
        <div 
          className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-orb-medium" 
          style={{ animationDelay: "2s" }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-56 h-56 bg-green-400/5 rounded-full blur-2xl animate-float-orb-fast" 
          style={{ animationDelay: "1s" }}
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-float-orb-slow" 
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20 animate-fade-in-up hover:scale-105 hover:bg-primary/15 transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/10 animate-fade-in-up hover:scale-110 hover:shadow-2xl transition-all duration-500">
              <Mail className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent animate-gradient-flow">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-up delay-100">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Enhanced Form Card */}
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden bg-card/95 backdrop-blur-sm animate-fade-in-up delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5" />
            <CardContent className="p-6 md:p-8 relative">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2 animate-slide-in-left">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium group">
                    <User className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {t("contact.name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contact.name")}
                    className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2 animate-slide-in-left delay-100">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium group">
                    <AtSign className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {t("contact.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("contact.email")}
                    className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base font-medium group">
                    <MessageCircle className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {t("contact.message")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t("contact.message")}
                    rows={6}
                    className="border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40 resize-none min-h-[150px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    {language === "fr"
                      ? "Ce formulaire de contact est sécurisé avec Cloudflare, les faux e-mails sont détectés et considérés comme spam."
                      : "This contact form is secured with Cloudflare, fake e-mails are detected and considered spam."}
                  </p>
                </div>

                {/* Enhanced Cloudflare Widget */}
                <div className="flex flex-col items-center justify-center my-6 animate-fade-in">
                  <div className="relative group">
                    <div
                      ref={turnstileRef}
                      className="turnstile-container relative z-10 transition-all duration-500 group-hover:scale-[1.02]"
                    />
                    {!turnstileLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg z-20">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            {language === "fr" 
                              ? "Chargement de la sécurité..." 
                              : "Loading security..."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up delay-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !turnstileToken}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>{language === "fr" ? "Envoi en cours..." : "Sending..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 group">
                      <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="transition-all duration-300 group-hover:tracking-wider">
                        {t("contact.send")}
                      </span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Contact Info */}
          <div className="mt-8 text-center animate-fade-in-up delay-400">
            <Card className="border border-muted/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Vous pouvez aussi nous contacter directement à"
                    : "You can also contact us directly at"}{" "}
                  <a
                    href="mailto:recyclagemaria@gmail.com"
                    className="text-primary font-medium hover:underline transition-all duration-300 hover:text-primary/80 group"
                  >
                    recyclagemaria@gmail.com
                    <span className="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">↗</span>
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Animations CSS */}
      <style jsx global>{`
        @keyframes float-orb-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        
        @keyframes float-orb-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 10px) scale(1.03); }
          66% { transform: translate(15px, -15px) scale(0.97); }
        }
        
        @keyframes float-orb-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -10px) scale(1.02); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float-orb-slow {
          animation: float-orb-slow 20s ease-in-out infinite;
        }
        
        .animate-float-orb-medium {
          animation: float-orb-medium 15s ease-in-out infinite;
        }
        
        .animate-float-orb-fast {
          animation: float-orb-fast 10s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out both;
        }
        
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 3s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
        
        /* Cloudflare Widget Styling */
        .turnstile-container {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .turnstile-container::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, 
            rgba(255, 165, 0, 0.2),
            rgba(255, 140, 0, 0.1),
            rgba(255, 165, 0, 0.2)
          );
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .turnstile-container:hover::before {
          opacity: 1;
          animation: turnstile-glow 2s ease-in-out infinite;
        }
        
        @keyframes turnstile-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-float-orb-slow,
          .animate-float-orb-medium,
          .animate-float-orb-fast {
            animation: none;
          }
          
          .turnstile-container::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
