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
  const [buttonState, setButtonState] = useState<"idle" | "hover" | "active" | "submitting">("idle");
  const [mounted, setMounted] = useState(false);
  const rippleTimeoutRef = useRef<NodeJS.Timeout>();

  // Mobile detection and component mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Check if user has submitted before
    const submitted = localStorage.getItem("hasSubmittedContact");
    if (submitted) {
      setHasSubmitted(true);
    }
    
    setMounted(true);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, []);

  // Subject options with icons and translations
  const subjectOptions = [
    { 
      value: "bug", 
      label: language === "fr" ? "Rapport de bug" : "Bug Report",
      icon: Bug,
      color: "text-red-500",
      description: language === "fr" ? "Signaler un problème technique" : "Report a technical issue"
    },
    { 
      value: "idea", 
      label: language === "fr" ? "Idée / Suggestion" : "Idea / Suggestion",
      icon: Lightbulb,
      color: "text-yellow-500",
      description: language === "fr" ? "Partager une idée d'amélioration" : "Share an improvement idea"
    },
    { 
      value: "feature", 
      label: language === "fr" ? "Nouvelle fonctionnalité" : "Feature Request",
      icon: Sparkles,
      color: "text-blue-500",
      description: language === "fr" ? "Demander une nouvelle fonctionnalité" : "Request a new feature"
    },
    { 
      value: "collaboration", 
      label: language === "fr" ? "Collaboration" : "Collaboration",
      icon: Users,
      color: "text-green-500",
      description: language === "fr" ? "Proposer une collaboration" : "Propose a collaboration"
    },
    { 
      value: "other", 
      label: language === "fr" ? "Autre" : "Other",
      icon: AlertCircle,
      color: "text-purple-500",
      description: language === "fr" ? "Autre sujet" : "Other subject"
    },
  ];

  // Load Turnstile widget - optimized to prevent duplication
  useEffect(() => {
    if (!mounted) return;

    const initializeTurnstile = () => {
      // Clean up any existing instance
      if (turnstileInstanceRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileInstanceRef.current);
        } catch (e) {
          console.log("Cleanup error:", e);
        }
        turnstileInstanceRef.current = null;
      }

      // Clear container
      if (turnstileRef.current) {
        turnstileRef.current.innerHTML = '';
      }

      // Load script if needed
      if (!document.querySelector('script[src*="turnstile"]')) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.defer = true;
        
        script.onload = renderTurnstile;
        script.onerror = () => {
          console.error("Failed to load Turnstile");
          setTurnstileLoaded(true); // Set to true to show error state
        };
        
        document.head.appendChild(script);
      } else {
        // Script already loaded
        setTimeout(renderTurnstile, 100);
      }
    };

    const renderTurnstile = () => {
      if (!turnstileRef.current || !(window as any).turnstile) {
        setTurnstileLoaded(true);
        return;
      }

      try {
        turnstileInstanceRef.current = (window as any).turnstile.render(turnstileRef.current, {
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

    const timer = setTimeout(initializeTurnstile, 300);

    return () => {
      clearTimeout(timer);
      if (turnstileInstanceRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileInstanceRef.current);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [language, isMobile, mounted, playSuccessSound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setButtonState("submitting");

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      playErrorSound();
      setButtonState("idle");
      toast.error(
        language === "fr" ? "❌ Champs manquants" : "❌ Missing fields",
        {
          description: language === "fr"
            ? "Veuillez remplir tous les champs"
            : "Please fill in all fields",
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
        language === "fr" ? "🔒 Sécurité requise" : "🔒 Security required",
        {
          description: language === "fr"
            ? "Veuillez compléter la vérification de sécurité"
            : "Please complete the security verification",
          position: "top-center",
          duration: 3000,
        }
      );
      setIsSubmitting(false);
      return;
    }

    const loadingToast = toast.custom((t) => (
      <div className="bg-white/95 dark:bg-gray-900/95 border border-primary/20 rounded-lg p-4 shadow-xl animate-slide-in-toast">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
          <div>
            <p className="font-medium">
              {language === "fr" ? "📨 Envoi en cours..." : "📨 Sending..."}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "fr" ? "Veuillez patienter..." : "Please wait..."}
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
      
      // First-time submission special message
      if (!hasSubmitted) {
        localStorage.setItem("hasSubmittedContact", "true");
        setHasSubmitted(true);
        
        toast.custom((t) => (
          <div className="relative bg-white/95 dark:bg-gray-900/95 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-2xl animate-slide-in-toast">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-200 dark:border-green-800">
                <Sparkles className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {language === "fr" ? "🎉 Merci !" : "🎉 Thank You!"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "fr" 
                    ? "Nous apprécions votre message et vous répondrons bientôt."
                    : "We appreciate your message and will respond soon."}
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
          duration: 8000,
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
            duration: 5000,
          }
        );
      }

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTurnstileToken("");
      
      // Reset Turnstile
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

  // Simplified input focus animation
  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const input = e.target;
    input.parentElement?.classList.add('input-focused');
    
    // Add subtle animation
    if (input.parentElement) {
      input.parentElement.style.transform = 'translateY(-2px)';
    }
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const input = e.target;
    input.parentElement?.classList.remove('input-focused');
    
    if (input.parentElement) {
      input.parentElement.style.transform = '';
    }
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Simplified Background - Performance Optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        
        {/* Minimal animated orbs - only on desktop */}
        {!isMobile && (
          <>
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
            <div 
              className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-medium" 
            />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Simplified Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 md:mb-6 border border-primary/20 hover:scale-105 transition-all duration-300">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg hover:scale-110 transition-all duration-300">
              <Mail className="w-8 h-8 md:w-12 md:h-12 text-primary" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Form Card */}
          <Card className="border border-primary/10 shadow-lg md:shadow-xl overflow-hidden bg-card/95 animate-fade-in">
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
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder={language === "fr" ? "Votre nom" : "Your name"}
                      className="h-12 border-2 border-input focus:border-primary transition-colors duration-200"
                      required
                      disabled={isSubmitting}
                    />
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
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder={language === "fr" ? "votre@email.com" : "your@email.com"}
                      className="h-12 border-2 border-input focus:border-primary transition-colors duration-200"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Subject Field */}
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
                    <SelectTrigger className="h-12 border-2 border-input focus:border-primary transition-colors duration-200">
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
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder={language === "fr" ? "Votre message ici..." : "Your message here..."}
                      rows={isMobile ? 4 : 5}
                      className="border-2 border-input focus:border-primary transition-colors duration-200 resize-none min-h-[100px] md:min-h-[120px]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p>
                    {language === "fr"
                      ? "Sécurisé avec Cloudflare. Les faux e-mails sont détectés."
                      : "Secured with Cloudflare. Fake emails are detected."}
                  </p>
                </div>

                {/* Cloudflare Widget - Fixed Sizing */}
                <div className="flex justify-center my-4 md:my-6">
                  <div className={cn(
                    "relative w-full max-w-[300px] md:max-w-[350px] mx-auto",
                    "transition-all duration-300 hover:scale-[1.02]"
                  )}>
                    <div
                      ref={turnstileRef}
                      className={cn(
                        "turnstile-container w-full",
                        turnstileLoaded ? "opacity-100" : "opacity-0 h-[78px]"
                      )}
                      style={{
                        minHeight: isMobile ? "78px" : "65px",
                      }}
                    />
                    {!turnstileLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            {language === "fr" 
                              ? "Chargement..." 
                              : "Loading..."}
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
                  size={isMobile ? "default" : "lg"}
                  className={cn(
                    "w-full py-4 md:py-6 text-base md:text-lg font-medium transition-all duration-300 relative overflow-hidden group",
                    "bg-primary hover:bg-primary/90 text-primary-foreground",
                    "shadow-lg hover:shadow-xl",
                    buttonState === "hover" && "transform -translate-y-0.5",
                    buttonState === "active" && "transform scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  disabled={isSubmitting || !turnstileToken}
                  onMouseEnter={handleButtonMouseEnter}
                  onMouseLeave={handleButtonMouseLeave}
                  onMouseDown={handleButtonMouseDown}
                  onMouseUp={handleButtonMouseUp}
                >
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-2 md:gap-3">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                        <span className="font-medium">
                          {language === "fr" ? "Envoi..." : "Sending..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        <span className="font-medium transition-all duration-300 group-hover:tracking-wide">
                          {t("contact.send")}
                        </span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" />
                      </>
                    )}
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="mt-6 md:mt-8 text-center">
            <Card className="border border-muted/50 bg-card/50 hover:border-primary/20 transition-colors duration-300">
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-muted-foreground">
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
                    className="text-primary font-medium hover:underline transition-colors duration-200"
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
        
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-toast {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 25s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-in-toast {
          animation: slide-in-toast 0.3s ease-out;
        }
        
        /* Cloudflare widget styling */
        .turnstile-container {
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .turnstile-container:hover {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 165, 0, 0.3);
        }
        
        /* Input focus effect */
        .input-focused {
          position: relative;
        }
        
        .input-focused input,
        .input-focused textarea {
          border-color: hsl(var(--primary)) !important;
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-float-slow,
          .animate-float-medium {
            animation: none;
          }
          
          .turnstile-container {
            max-width: 280px !important;
          }
          
          .turnstile-container:hover {
            transform: none;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-float-medium,
          .animate-fade-in,
          .animate-slide-in-toast {
            animation: none;
          }
          
          .turnstile-container:hover,
          button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
