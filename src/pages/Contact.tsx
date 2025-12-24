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
  CheckCircle2,
  ChevronRight
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
  const turnstileInstanceRef = useRef<any>(null);
  
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
  const [buttonHover, setButtonHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mobile detection and component mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const submitted = localStorage.getItem("hasSubmittedContact");
    if (submitted) {
      setHasSubmitted(true);
    }
    
    setMounted(true);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Subject options with icons and translations
  const subjectOptions = [
    { 
      value: "bug", 
      label: language === "fr" ? "Bug Report" : "Bug Report",
      icon: Bug,
      color: "text-red-500",
      description: language === "fr" ? "Signaler un problème" : "Report an issue"
    },
    { 
      value: "idea", 
      label: language === "fr" ? "Suggestion" : "Suggestion",
      icon: Lightbulb,
      color: "text-yellow-500",
      description: language === "fr" ? "Partager une idée" : "Share an idea"
    },
    { 
      value: "feature", 
      label: language === "fr" ? "Feature" : "Feature",
      icon: Sparkles,
      color: "text-blue-500",
      description: language === "fr" ? "Nouvelle fonctionnalité" : "New feature"
    },
    { 
      value: "collaboration", 
      label: language === "fr" ? "Collaboration" : "Collaboration",
      icon: Users,
      color: "text-green-500",
      description: language === "fr" ? "Travailler ensemble" : "Work together"
    },
    { 
      value: "other", 
      label: language === "fr" ? "Autre" : "Other",
      icon: AlertCircle,
      color: "text-purple-500",
      description: language === "fr" ? "Autre sujet" : "Other topic"
    },
  ];

  // Load Turnstile widget with proper cleanup
  useEffect(() => {
    if (!mounted || !turnstileRef.current) return;

    let cleanup = () => {};

    const initializeTurnstile = () => {
      // Clear container
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = '';
      }

      // Check if script already exists
      let script = document.querySelector('script[src*="turnstile"]');
      
      if (!script) {
        script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        
        script.onload = renderTurnstile;
        script.onerror = () => {
          console.error("Failed to load Turnstile");
          setTurnstileLoaded(true);
        };
        
        document.head.appendChild(script);
      } else {
        // If script exists but Turnstile isn't loaded yet
        if ((window as any).turnstile) {
          renderTurnstile();
        } else {
          // Wait for script to load
          script.addEventListener('load', renderTurnstile);
        }
      }

      cleanup = () => {
        if (turnstileInstanceRef.current && (window as any).turnstile) {
          try {
            (window as any).turnstile.remove(turnstileInstanceRef.current);
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      };
    };

    const renderTurnstile = () => {
      if (!turnstileRef.current || !(window as any).turnstile) {
        setTurnstileLoaded(true);
        return;
      }

      try {
        // Clear any existing widget
        if (turnstileInstanceRef.current) {
          try {
            (window as any).turnstile.remove(turnstileInstanceRef.current);
          } catch (e) {
            // Ignore
          }
        }

        turnstileInstanceRef.current = (window as any).turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAACIP-ezbrfMoU0rB",
          callback: (token: string) => {
            setTurnstileToken(token);
            playSuccessSound();
            toast.success(
              language === "fr" 
                ? "✅ Vérification réussie" 
                : "✅ Verification successful",
              { 
                duration: 2000,
                position: "top-center",
              }
            );
          },
          "refresh-expired": "auto",
          "retry": "auto",
          "appearance": "always",
          "theme": "light",
          "language": language,
          "size": isMobile ? "compact" : "normal"
        });
        setTurnstileLoaded(true);
      } catch (error) {
        console.error("Turnstile render error:", error);
        setTurnstileLoaded(true);
      }
    };

    const timer = setTimeout(initializeTurnstile, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [language, isMobile, mounted, playSuccessSound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      playErrorSound();
      toast.error(
        language === "fr" ? "❌ Champs manquants" : "❌ Missing fields",
        {
          description: language === "fr"
            ? "Veuillez remplir tous les champs"
            : "Please fill all fields",
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
      toast.error(
        language === "fr" ? "❌ Email invalide" : "❌ Invalid email",
        {
          description: language === "fr"
            ? "Veuillez entrer un email valide"
            : "Please enter a valid email",
          position: "top-center",
          duration: 3000,
        }
      );
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      playErrorSound();
      toast.error(
        language === "fr" ? "🔒 Sécurité requise" : "🔒 Security required",
        {
          description: language === "fr"
            ? "Veuillez compléter la vérification"
            : "Please complete verification",
          position: "top-center",
          duration: 3000,
        }
      );
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.custom((t) => (
      <div className="bg-white dark:bg-gray-900 border border-primary/20 rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <div>
            <p className="font-medium">
              {language === "fr" ? "📨 Envoi en cours..." : "📨 Sending..."}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "fr" ? "Patientez..." : "Please wait..."}
            </p>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "top-center",
    });

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

      if (!response.ok) throw new Error("Submission failed");

      playLevelCompleteSound();
      toast.dismiss(loadingToast);
      
      if (!hasSubmitted) {
        localStorage.setItem("hasSubmittedContact", "true");
        setHasSubmitted(true);
        
        toast.custom((t) => (
          <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === "fr" ? "🎉 Merci !" : "🎉 Thank You!"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "fr" 
                    ? "Merci pour votre message. Nous vous répondrons bientôt."
                    : "Thanks for your message. We'll respond soon."}
                </p>
              </div>
              <Button
                onClick={() => toast.dismiss(t)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {language === "fr" ? "Continuer" : "Continue"}
              </Button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.success(
          language === "fr" ? "✅ Message envoyé" : "✅ Message sent",
          {
            description: language === "fr"
              ? "Merci pour votre message."
              : "Thank you for your message.",
            position: "top-center",
            duration: 3000,
          }
        );
      }

      setFormData({ name: "", email: "", subject: "", message: "" });
      setTurnstileToken("");
      
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileInstanceRef.current);
      }
      
    } catch (error) {
      playErrorSound();
      toast.dismiss(loadingToast);
      toast.error(
        language === "fr" ? "❌ Échec" : "❌ Failed",
        {
          description: language === "fr"
            ? "Une erreur est survenue."
            : "An error occurred.",
          position: "top-center",
          duration: 5000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        {!isMobile && (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float-medium" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 md:mb-6 border border-primary/20">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Form Card */}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden bg-white dark:bg-gray-900">
            <CardContent className="p-4 md:p-6 lg:p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium">
                    <User className="w-4 h-4 text-primary" />
                    {t("contact.name")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === "fr" ? "Votre nom" : "Your name"}
                      className="h-12 pl-10 border-gray-300 dark:border-gray-700 focus:border-primary"
                      required
                      disabled={isSubmitting}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium">
                    <AtSign className="w-4 h-4 text-primary" />
                    {t("contact.email")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={language === "fr" ? "votre@email.com" : "your@email.com"}
                      className="h-12 pl-10 border-gray-300 dark:border-gray-700 focus:border-primary"
                      required
                      disabled={isSubmitting}
                    />
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Subject Field - Improved Menu */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-base font-medium">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    {language === "fr" ? "Sujet" : "Subject"}
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-12 border-gray-300 dark:border-gray-700 focus:border-primary">
                      <SelectValue 
                        placeholder={language === "fr" ? "Sélectionnez un sujet" : "Select a subject"} 
                      />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      {subjectOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center gap-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${option.color}`} />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {option.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="subject" value={formData.subject} />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base font-medium">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    {t("contact.message")}
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === "fr" ? "Votre message ici..." : "Your message here..."}
                      rows={isMobile ? 4 : 5}
                      className="border-gray-300 dark:border-gray-700 focus:border-primary resize-none min-h-[120px]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    {language === "fr"
                      ? "Sécurisé avec Cloudflare. Les faux e-mails sont détectés."
                      : "Secured with Cloudflare. Fake emails are detected."}
                  </p>
                </div>

                {/* Cloudflare Widget - Fixed Sizing */}
                <div className="flex justify-center my-6">
                  <div className={cn(
                    "relative w-full max-w-[300px] mx-auto",
                    "transition-all duration-500"
                  )}>
                    {/* Fixed container with exact Cloudflare dimensions */}
                    <div className="relative w-full h-[65px] md:h-[70px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <div
                        ref={turnstileRef}
                        className={cn(
                          "w-full h-full",
                          turnstileLoaded ? "opacity-100" : "opacity-0"
                        )}
                      />
                      
                      {/* Loading state */}
                      {!turnstileLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <p className="text-sm text-gray-500">
                              {language === "fr" ? "Chargement..." : "Loading..."}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Glow effect overlay */}
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  ref={buttonRef}
                  type="submit"
                  size={isMobile ? "default" : "lg"}
                  className={cn(
                    "w-full py-4 md:py-6 text-base md:text-lg font-medium",
                    "relative overflow-hidden transition-all duration-500",
                    "bg-primary hover:bg-primary/90 text-white",
                    "shadow-lg hover:shadow-xl",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    buttonHover && "transform -translate-y-0.5"
                  )}
                  disabled={isSubmitting || !turnstileToken}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                          {language === "fr" ? "Envoi..." : "Sending..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                        <span className="transition-all duration-500 group-hover:tracking-wide">
                          {t("contact.send")}
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0" />
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="mt-6 md:mt-8 text-center">
            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  {language === "fr"
                    ? "Contactez-nous directement :"
                    : "Contact us directly:"}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('recyclagemaria@gmail.com');
                      playSuccessSound();
                      toast.success(
                        language === "fr" 
                          ? "📧 Email copié" 
                          : "📧 Email copied",
                        { 
                          duration: 2000,
                          position: "top-center",
                        }
                      );
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    recyclagemaria@gmail.com
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translate(0, 0); 
          }
          50% { 
            transform: translate(20px, -20px); 
          }
        }
        
        @keyframes float-medium {
          0%, 100% { 
            transform: translate(0, 0); 
          }
          50% { 
            transform: translate(-30px, 10px); 
          }
        }
        
        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 30s ease-in-out infinite;
          animation-delay: 5s;
        }
        
        /* Cloudflare widget styling */
        .turnstile-widget-container {
          position: relative;
          width: 100%;
          height: 65px;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255, 165, 0, 0.2);
          background: white;
          transition: all 0.5s ease;
        }
        
        .turnstile-widget-container:hover {
          box-shadow: 0 0 20px rgba(255, 165, 0, 0.2);
          border-color: rgba(255, 165, 0, 0.4);
        }
        
        @media (max-width: 768px) {
          .animate-float-slow,
          .animate-float-medium {
            animation: none;
          }
          
          .turnstile-widget-container {
            height: 78px;
          }
        }
        
        /* Reduce motion preferences */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
