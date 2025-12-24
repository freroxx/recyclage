import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { 
  Mail, 
  Send, 
  MessageCircle, 
  User, 
  AtSign, 
  Shield, 
  Loader2, 
  Bug, 
  Lightbulb, 
  Users, 
  Sparkles,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t, language } = useLanguage();
  const { playSuccessSound, playErrorSound, playLevelCompleteSound } = useSoundEffects();
  useScrollReveal();

  const turnstileRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isMobile, setIsMobile] = useState(false);
  const [buttonState, setButtonState] = useState<"idle" | "hover" | "active" | "submitting">("idle");

  // Check if mobile for performance
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Check if user has submitted before
    const submitted = localStorage.getItem("hasSubmittedContact");
    if (submitted) {
      setHasSubmitted(true);
    }
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Turnstile with better error handling
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    const loadTurnstile = () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }

      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setTurnstileLoaded(true);
        setTimeout(() => {
          if ((window as any).turnstile && turnstileRef.current) {
            (window as any).turnstile.render(turnstileRef.current, {
              sitekey: "0x4AAAAAACIP-ezbrfMoU0rB",
              callback: (token: string) => {
                setTurnstileToken(token);
                playSuccessSound();
                toast.success(
                  language === "fr" 
                    ? "✅ Vérification de sécurité réussie" 
                    : "✅ Security verification successful",
                  { 
                    duration: 2000,
                    position: "top-center"
                  }
                );
              },
              "refresh-expired": "auto",
              "retry": "auto",
              "appearance": "always",
              "theme": "light",
              "size": "normal"
            });
          }
        }, 100);
      };

      script.onerror = () => {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(loadTurnstile, 1000 * attempts);
        } else {
          toast.error(
            language === "fr"
              ? "❌ Échec du chargement du vérificateur de sécurité"
              : "❌ Security checker failed to load",
            { position: "top-center" }
          );
        }
      };

      document.body.appendChild(script);
    };

    loadTurnstile();

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [language, playSuccessSound]);

  // Subject options with icons and translations
  const subjectOptions = [
    { 
      value: "bug", 
      label: language === "fr" ? "Rapport de bug" : "Bug Report",
      icon: Bug,
      color: "text-red-500"
    },
    { 
      value: "idea", 
      label: language === "fr" ? "Idée / Suggestion" : "Idea / Suggestion",
      icon: Lightbulb,
      color: "text-yellow-500"
    },
    { 
      value: "feature", 
      label: language === "fr" ? "Nouvelle fonctionnalité" : "Feature Request",
      icon: Sparkles,
      color: "text-blue-500"
    },
    { 
      value: "collaboration", 
      label: language === "fr" ? "Collaboration" : "Collaboration",
      icon: Users,
      color: "text-green-500"
    },
    { 
      value: "other", 
      label: language === "fr" ? "Autre" : "Other",
      icon: AlertCircle,
      color: "text-purple-500"
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setButtonState("submitting");

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      playErrorSound();
      setButtonState("idle");
      toast.error(
        language === "fr" ? "❌ Champs requis manquants" : "❌ Missing required fields",
        {
          description: language === "fr"
            ? "Veuillez remplir tous les champs obligatoires"
            : "Please fill in all required fields",
          position: "top-center",
          duration: 3000,
        }
      );
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      playErrorSound();
      setButtonState("idle");
      toast.error(
        language === "fr" ? "❌ Email invalide" : "❌ Invalid email",
        {
          description: language === "fr"
            ? "Veuillez entrer une adresse email valide"
            : "Please enter a valid email address",
          position: "top-center",
          duration: 3000,
        }
      );
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      playErrorSound();
      setButtonState("idle");
      toast.error(
        language === "fr" ? "🔒 Vérification de sécurité requise" : "🔒 Security verification required",
        {
          description: language === "fr"
            ? "Veuillez compléter la vérification de sécurité"
            : "Please complete the security verification",
          position: "top-center",
          duration: 3000,
          action: {
            label: language === "fr" ? "OK" : "OK",
            onClick: () => {},
          },
        }
      );
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.loading(
      language === "fr" ? "📨 Envoi en cours..." : "📨 Sending message...",
      {
        duration: Infinity,
        position: "top-center",
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
          subject: formData.subject,
          message: formData.message,
          "cf-turnstile-response": turnstileToken,
          _language: language,
        }),
      });

      if (!response.ok) throw new Error("Formspree submission failed");

      playLevelCompleteSound();
      toast.dismiss(loadingToast);
      
      // First-time submission special message
      if (!hasSubmitted) {
        localStorage.setItem("hasSubmittedContact", "true");
        setHasSubmitted(true);
        toast.custom((t) => (
          <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-lg p-6 shadow-2xl">
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                {language === "fr" ? "🎉 Merci pour votre retour !" : "🎉 Thanks for your feedback!"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "fr" 
                  ? "Nous apprécions grandement votre message. Nous vous répondrons dès que possible."
                  : "We greatly appreciate your message. We'll get back to you as soon as possible."}
              </p>
              <Button
                onClick={() => toast.dismiss(t)}
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              >
                {language === "fr" ? "Continuer" : "Continue"}
              </Button>
            </div>
          </div>
        ), {
          duration: 8000,
          position: "top-center",
        });
      } else {
        // Regular success message for returning users
        toast.success(
          language === "fr" ? "✅ Message envoyé avec succès" : "✅ Message sent successfully",
          {
            description: language === "fr"
              ? "Merci pour votre message. Nous vous répondrons bientôt."
              : "Thank you for your message. We'll respond soon.",
            position: "top-center",
            duration: 5000,
            action: {
              label: language === "fr" ? "OK" : "OK",
              onClick: () => {},
            },
          }
        );
      }

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTurnstileToken("");
      
      // Reset Turnstile
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileRef.current);
      }
      
    } catch (error) {
      playErrorSound();
      toast.dismiss(loadingToast);
      toast.error(
        language === "fr" ? "❌ Échec de l'envoi" : "❌ Failed to send",
        {
          description: language === "fr"
            ? "Une erreur est survenue. Veuillez réessayer."
            : "An error occurred. Please try again.",
          position: "top-center",
          duration: 5000,
          action: {
            label: language === "fr" ? "Réessayer" : "Retry",
            onClick: () => handleSubmit(e),
          },
        }
      );
    } finally {
      setIsSubmitting(false);
      setButtonState("idle");
    }
  };

  // Button animation handlers
  const handleButtonMouseEnter = useCallback(() => {
    if (!isSubmitting && buttonState !== "submitting") {
      setButtonState("hover");
    }
  }, [isSubmitting, buttonState]);

  const handleButtonMouseLeave = useCallback(() => {
    if (!isSubmitting && buttonState !== "submitting") {
      setButtonState("idle");
    }
  }, [isSubmitting, buttonState]);

  const handleButtonMouseDown = useCallback(() => {
    if (!isSubmitting) {
      setButtonState("active");
    }
  }, [isSubmitting]);

  const handleButtonMouseUp = useCallback(() => {
    if (!isSubmitting && buttonState === "active") {
      setButtonState("hover");
    }
  }, [isSubmitting, buttonState]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-blue-500/[0.02]" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl animate-orb-float-1" />
        <div 
          className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl animate-orb-float-2" 
        />
        <div 
          className="absolute top-1/3 right-1/4 w-56 h-56 bg-green-400/[0.03] rounded-full blur-2xl animate-orb-float-3" 
        />
        <div 
          className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-400/[0.03] rounded-full blur-2xl animate-orb-float-1" 
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20 animate-fade-in-up hover:scale-105 hover:bg-primary/15 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-xl border border-primary/10 animate-fade-in-up hover:scale-110 hover:shadow-2xl transition-all duration-500 group">
              <Mail className="w-12 h-12 text-primary transition-transform duration-500 group-hover:rotate-12" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500" />
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
                    {t("contact.name")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === "fr" ? "Votre nom" : "Your name"}
                    className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2 animate-slide-in-left delay-75">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium group">
                    <AtSign className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {t("contact.email")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={language === "fr" ? "votre@email.com" : "your@email.com"}
                    className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Subject Field */}
                <div className="space-y-2 animate-slide-in-left delay-100">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-base font-medium group">
                    <AlertCircle className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {language === "fr" ? "Sujet" : "Subject"} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40">
                      <SelectValue 
                        placeholder={language === "fr" ? "Sélectionnez un sujet" : "Select a subject"} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${option.color}`} />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <input 
                    type="hidden" 
                    name="subject" 
                    value={formData.subject}
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base font-medium group">
                    <MessageCircle className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {t("contact.message")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === "fr" ? "Votre message ici..." : "Your message here..."}
                    rows={5}
                    className="border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40 resize-none min-h-[120px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground animate-fade-in bg-primary/5 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    {language === "fr"
                      ? "🔒 Ce formulaire est sécurisé avec Cloudflare. Les faux e-mails sont détectés et considérés comme spam."
                      : "🔒 This contact form is secured with Cloudflare. Fake e-mails are detected and considered spam."}
                  </p>
                </div>

                {/* Enhanced Cloudflare Widget */}
                <div className="flex flex-col items-center justify-center my-6 animate-fade-in">
                  <div className="relative group">
                    <div
                      ref={turnstileRef}
                      className={cn(
                        "turnstile-widget relative z-10 transition-all duration-500",
                        turnstileLoaded && "scale-100 opacity-100",
                        !turnstileLoaded && "scale-95 opacity-0"
                      )}
                    />
                    {!turnstileLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-lg z-20 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground animate-pulse">
                            {language === "fr" 
                              ? "Chargement de la sécurité..." 
                              : "Loading security..."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <Button
                  ref={buttonRef}
                  type="submit"
                  size="lg"
                  className={cn(
                    "w-full py-6 text-lg font-medium transition-all duration-500 relative overflow-hidden group",
                    buttonState === "idle" && "bg-gradient-to-r from-primary to-primary/90 shadow-lg",
                    buttonState === "hover" && "bg-gradient-to-r from-primary to-primary shadow-xl scale-[1.02]",
                    buttonState === "active" && "bg-gradient-to-r from-primary/90 to-primary/80 shadow-inner scale-[0.98]",
                    buttonState === "submitting" && "bg-gradient-to-r from-primary/80 to-primary/70 shadow-lg",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  )}
                  disabled={isSubmitting || !turnstileToken}
                  onMouseEnter={handleButtonMouseEnter}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={handleButtonMouseDown}
                  onMouseUp={handleButtonMouseUp}
                >
                  {/* Button background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="animate-pulse">
                          {language === "fr" ? "Envoi en cours..." : "Sending..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        <span className="transition-all duration-300 group-hover:tracking-wider">
                          {t("contact.send")}
                        </span>
                        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse" />
                      </>
                    )}
                  </div>
                  
                  {/* Button ripple effect */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Contact Info */}
          <div className="mt-8 text-center animate-fade-in-up delay-300">
            <Card className="border border-muted/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg group">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Vous pouvez aussi nous contacter directement à"
                    : "You can also contact us directly at"}{" "}
                  <a
                    href="mailto:recyclagemaria@gmail.com"
                    className="text-primary font-medium hover:underline transition-all duration-300 hover:text-primary/80 group inline-flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText('recyclagemaria@gmail.com');
                      playSuccessSound();
                      toast.success(
                        language === "fr" 
                          ? "📧 Email copié dans le presse-papier" 
                          : "📧 Email copied to clipboard",
                        { 
                          duration: 2000,
                          position: "top-center"
                        }
                      );
                    }}
                  >
                    recyclagemaria@gmail.com
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Animations CSS */}
      <style jsx global>{`
        @keyframes orb-float-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
          }
          33% { 
            transform: translate(30px, -20px) scale(1.05) rotate(120deg); 
          }
          66% { 
            transform: translate(-20px, 25px) scale(0.95) rotate(240deg); 
          }
        }
        
        @keyframes orb-float-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
          }
          33% { 
            transform: translate(-35px, 15px) scale(1.03) rotate(-120deg); 
          }
          66% { 
            transform: translate(25px, -30px) scale(0.97) rotate(-240deg); 
          }
        }
        
        @keyframes orb-float-3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          25% { 
            transform: translate(15px, -10px) scale(1.02); 
          }
          50% { 
            transform: translate(-10px, 20px) scale(0.98); 
          }
          75% { 
            transform: translate(-20px, -15px) scale(1.01); 
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes gradient-flow {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        @keyframes turnstile-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.4); 
          }
          70% { 
            box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); 
          }
        }
        
        @keyframes turnstile-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 5px rgba(255, 165, 0, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 15px rgba(255, 165, 0, 0.6));
          }
        }
        
        .animate-orb-float-1 {
          animation: orb-float-1 25s ease-in-out infinite;
        }
        
        .animate-orb-float-2 {
          animation: orb-float-2 20s ease-in-out infinite;
          animation-delay: 5s;
        }
        
        .animate-orb-float-3 {
          animation: orb-float-3 15s ease-in-out infinite;
          animation-delay: 10s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 3s ease-in-out infinite;
        }
        
        .delay-75 {
          animation-delay: 75ms;
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
        
        /* Cloudflare Widget Enhanced Styling */
        .turnstile-widget {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 
            0 0 0 1px rgba(255, 165, 0, 0.2),
            0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .turnstile-widget::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, 
            rgba(255, 165, 0, 0.3),
            rgba(255, 140, 0, 0.2),
            rgba(255, 165, 0, 0.3)
          );
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        
        .turnstile-widget:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .turnstile-widget:hover::before {
          opacity: 1;
          animation: turnstile-pulse 2s ease-in-out infinite, turnstile-glow 1.5s ease-in-out infinite;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-orb-float-1,
          .animate-orb-float-2,
          .animate-orb-float-3 {
            animation: none;
          }
          
          .turnstile-widget:hover {
            transform: none;
          }
          
          .turnstile-widget:hover::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
