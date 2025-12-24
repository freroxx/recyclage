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
  ChevronRight,
  ArrowRight
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
  const [fieldFocus, setFieldFocus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mobile detection and component mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
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
      label: language === "fr" ? "Rapport de bug" : "Bug Report",
      icon: Bug,
      color: "text-red-500",
      gradient: "from-red-500 to-orange-500"
    },
    { 
      value: "idea", 
      label: language === "fr" ? "Idée / Suggestion" : "Idea / Suggestion",
      icon: Lightbulb,
      color: "text-yellow-500",
      gradient: "from-yellow-500 to-amber-500"
    },
    { 
      value: "feature", 
      label: language === "fr" ? "Nouvelle fonctionnalité" : "Feature Request",
      icon: Sparkles,
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      value: "collaboration", 
      label: language === "fr" ? "Collaboration" : "Collaboration",
      icon: Users,
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      value: "other", 
      label: language === "fr" ? "Autre" : "Other",
      icon: AlertCircle,
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500"
    },
  ];

  // Load Turnstile widget
  useEffect(() => {
    if (!mounted) return;

    const initializeTurnstile = () => {
      // Clean up any existing instance
      if (turnstileInstanceRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileInstanceRef.current);
        } catch (e) {
          // Ignore cleanup errors
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
          setTurnstileLoaded(true);
        };
        
        document.head.appendChild(script);
      } else {
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

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      playErrorSound();
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
      <div className="bg-white/95 dark:bg-gray-900/95 border border-primary/20 rounded-lg p-4 shadow-xl animate-slide-in-toast backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center animate-spin-slow">
            <Loader2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium animate-pulse-slow">
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
      
      if (!hasSubmitted) {
        localStorage.setItem("hasSubmittedContact", "true");
        setHasSubmitted(true);
        
        toast.custom((t) => (
          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-2xl animate-slide-in-toast backdrop-blur-sm">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pulse-gentle">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-green-300/30 animate-ping-slow" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent animate-gradient-flow">
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
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-105"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/50 rounded-full animate-spin-slow" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary/20 rounded-full animate-float-particle-1" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-float-particle-2" />
        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400/20 rounded-full animate-float-particle-3" />
        
        {/* Subtle gradient orbs */}
        {!isMobile && (
          <>
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-orb-float-1" />
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-orb-float-2" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Animated Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 md:mb-6 border border-primary/20 hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 group">
              <MessageCircle className="w-4 h-4 animate-pulse-slow group-hover:animate-bounce" />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {language === "fr" ? "Contactez-nous" : "Contact Us"}
              </span>
            </div>

            <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 blur-xl animate-pulse-gentle" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-xl border border-primary/10 hover:scale-110 transition-all duration-500 group hover:shadow-2xl hover:shadow-primary/30">
                <Mail className="w-8 h-8 md:w-12 md:h-12 text-primary transition-transform duration-500 group-hover:rotate-12" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 animate-fade-in-up">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient-shift">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-up-delayed">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Animated Form Card */}
          <Card className="border border-primary/10 shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm animate-fade-in-up-delayed hover:shadow-2xl transition-all duration-500 group/card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-4 md:p-6 lg:p-8 relative">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Name Field */}
                <div className="space-y-2 animate-slide-in-left">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium group/label">
                    <div className="relative">
                      <User className="w-4 h-4 text-primary transition-all duration-300 group-hover/label:scale-125" />
                      <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover/label:opacity-100 transition-opacity duration-300" />
                    </div>
                    {t("contact.name")}
                  </Label>
                  <div className="relative group/input">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFieldFocus("name")}
                      onBlur={() => setFieldFocus(null)}
                      placeholder={language === "fr" ? "Votre nom" : "Your name"}
                      className="h-12 border-2 border-input bg-white/50 dark:bg-gray-900/50 focus:border-primary transition-all duration-300 group-hover/input:border-primary/50 pl-10"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="w-4 h-4 text-primary/50 transition-all duration-300 group-hover/input:text-primary" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover/input:from-primary/50 group-hover/input:via-primary group-hover/input:to-primary/50 transition-all duration-500" />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2 animate-slide-in-left-delayed">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium group/label">
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-primary transition-all duration-300 group-hover/label:scale-125" />
                      <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover/label:opacity-100 transition-opacity duration-300" />
                    </div>
                    {t("contact.email")}
                  </Label>
                  <div className="relative group/input">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setFieldFocus("email")}
                      onBlur={() => setFieldFocus(null)}
                      placeholder={language === "fr" ? "votre@email.com" : "your@email.com"}
                      className="h-12 border-2 border-input bg-white/50 dark:bg-gray-900/50 focus:border-primary transition-all duration-300 group-hover/input:border-primary/50 pl-10"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <AtSign className="w-4 h-4 text-primary/50 transition-all duration-300 group-hover/input:text-primary" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover/input:from-primary/50 group-hover/input:via-primary group-hover/input:to-primary/50 transition-all duration-500" />
                  </div>
                </div>

                {/* Subject Field with Enhanced Menu */}
                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-base font-medium group/label">
                    <div className="relative">
                      <AlertCircle className="w-4 h-4 text-primary transition-all duration-300 group-hover/label:scale-125" />
                      <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover/label:opacity-100 transition-opacity duration-300" />
                    </div>
                    {language === "fr" ? "Sujet" : "Subject"}
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="h-12 border-2 border-input bg-white/50 dark:bg-gray-900/50 focus:border-primary transition-all duration-300 hover:border-primary/50 group/select">
                      <SelectValue 
                        placeholder={language === "fr" ? "Sélectionnez un sujet" : "Select a subject"} 
                      />
                    </SelectTrigger>
                    <SelectContent className="border-primary/20 backdrop-blur-sm animate-dropdown-fade">
                      {subjectOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="flex items-center gap-3 py-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer group/item"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${option.gradient}/10 group-hover/item:${option.gradient}/20 transition-all duration-300`}>
                                <Icon className={`w-4 h-4 ${option.color}`} />
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{option.label}</div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover/item:opacity-100 transition-all duration-300 translate-x-2 group-hover/item:translate-x-0" />
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="subject" value={formData.subject} />
                </div>

                {/* Message Field */}
                <div className="space-y-2 animate-slide-in-right-delayed">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base font-medium group/label">
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-primary transition-all duration-300 group-hover/label:scale-125" />
                      <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover/label:opacity-100 transition-opacity duration-300" />
                    </div>
                    {t("contact.message")}
                  </Label>
                  <div className="relative group/input">
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFieldFocus("message")}
                      onBlur={() => setFieldFocus(null)}
                      placeholder={language === "fr" ? "Votre message ici..." : "Your message here..."}
                      rows={isMobile ? 4 : 5}
                      className="border-2 border-input bg-white/50 dark:bg-gray-900/50 focus:border-primary transition-all duration-300 group-hover/input:border-primary/50 resize-none min-h-[100px] md:min-h-[120px]"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover/input:from-primary/50 group-hover/input:via-primary group-hover/input:to-primary/50 transition-all duration-500" />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10 animate-fade-in hover:bg-primary/10 transition-all duration-300 group/security">
                  <div className="relative">
                    <Shield className="w-4 h-4 text-primary mt-0.5 transition-transform duration-300 group-hover/security:scale-110" />
                    <div className="absolute -inset-1 bg-primary/10 rounded-full opacity-0 group-hover/security:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="transition-all duration-300 group-hover/security:translate-x-1">
                    {language === "fr"
                      ? "Sécurisé avec Cloudflare. Les faux e-mails sont détectés."
                      : "Secured with Cloudflare. Fake emails are detected."}
                  </p>
                </div>

                {/* Enhanced Cloudflare Widget */}
                <div className="flex justify-center my-4 md:my-6">
                  <div 
                    className={cn(
                      "relative w-full max-w-[300px] md:max-w-[350px] mx-auto",
                      "transition-all duration-500 group/turnstile"
                    )}
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                  >
                    <div
                      ref={turnstileRef}
                      className={cn(
                        "turnstile-widget w-full h-[65px] md:h-[70px] rounded-lg overflow-hidden",
                        "transition-all duration-500 group-hover/turnstile:scale-[1.02]",
                        turnstileLoaded ? "opacity-100" : "opacity-0"
                      )}
                    />
                    
                    {/* Glow effect */}
                    <div className={cn(
                      "absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-500/20 via-orange-400/10 to-orange-500/20",
                      "opacity-0 transition-all duration-500 group-hover/turnstile:opacity-100",
                      buttonHover && "animate-turnstile-glow"
                    )} />
                    
                    {/* Border glow */}
                    <div className={cn(
                      "absolute -inset-0.5 rounded-lg border border-orange-500/0",
                      "transition-all duration-500 group-hover/turnstile:border-orange-500/30",
                      buttonHover && "animate-turnstile-border-glow"
                    )} />
                    
                    {!turnstileLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-lg backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            <div className="absolute inset-0 w-5 h-5 border-2 border-primary/20 border-t-primary/50 rounded-full animate-spin-slow" />
                          </div>
                          <p className="text-sm text-muted-foreground animate-pulse-slow">
                            {language === "fr" ? "Chargement..." : "Loading..."}
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
                    "w-full py-4 md:py-6 text-base md:text-lg font-medium transition-all duration-500",
                    "relative overflow-hidden group",
                    "bg-gradient-to-r from-primary via-primary/90 to-primary",
                    "hover:from-primary hover:via-primary/80 hover:to-primary",
                    "shadow-xl hover:shadow-2xl hover:shadow-primary/30",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    buttonHover && "transform -translate-y-1"
                  )}
                  disabled={isSubmitting || !turnstileToken}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-float-button-1" />
                    <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-float-button-2" />
                  </div>
                  
                  {/* Button content with enhanced animations */}
                  <div className="relative flex items-center justify-center gap-2 md:gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="relative">
                          <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
                          <div className="absolute inset-0 w-4 h-4 md:w-5 md:h-5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin-slow" />
                        </div>
                        <span className="font-medium animate-pulse-slow">
                          {language === "fr" ? "Envoi..." : "Sending..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="relative group/icon">
                          <Send className="w-4 h-4 md:w-5 md:h-5 text-white transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                          <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="font-medium transition-all duration-500 group-hover:tracking-wider bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                          {t("contact.send")}
                        </span>
                        <div className="relative group/arrow">
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0" />
                          <div className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover/arrow:opacity-100 transition-opacity duration-300" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-active:translate-x-full transition-transform duration-300" />
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="mt-6 md:mt-8 text-center animate-fade-in-up-delayed-2">
            <Card className="border border-muted/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-500 hover:shadow-xl group/contact">
              <CardContent className="p-4 md:p-6">
                <p className="text-sm md:text-base text-muted-foreground transition-all duration-500 group-hover/contact:scale-105">
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
                    className="text-primary font-medium hover:underline transition-all duration-300 group/link"
                  >
                    <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      recyclagemaria@gmail.com
                    </span>
                    <span className="inline-block ml-1 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1">↗</span>
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Styles with Enhanced Animations */}
      <style jsx global>{`
        @keyframes orb-float-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
          }
          25% { 
            transform: translate(40px, -30px) scale(1.1) rotate(90deg); 
          }
          50% { 
            transform: translate(-20px, 40px) scale(0.9) rotate(180deg); 
          }
          75% { 
            transform: translate(-40px, -20px) scale(1.05) rotate(270deg); 
          }
        }
        
        @keyframes orb-float-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg); 
          }
          33% { 
            transform: translate(-50px, 20px) scale(1.15) rotate(-120deg); 
          }
          66% { 
            transform: translate(30px, -40px) scale(0.85) rotate(-240deg); 
          }
        }
        
        @keyframes float-particle-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(20px, -30px) scale(1.5); 
            opacity: 1;
          }
        }
        
        @keyframes float-particle-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(-30px, 15px) scale(1.3); 
            opacity: 0.8;
          }
        }
        
        @keyframes float-particle-3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 0.3;
          }
          50% { 
            transform: translate(15px, 25px) scale(1.2); 
            opacity: 0.6;
          }
        }
        
        @keyframes float-button-1 {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0;
          }
          10%, 90% { 
            opacity: 0.5;
          }
          50% { 
            transform: translate(100px, -20px); 
            opacity: 0;
          }
        }
        
        @keyframes float-button-2 {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0;
          }
          20%, 80% { 
            opacity: 0.5;
          }
          50% { 
            transform: translate(-80px, 30px); 
            opacity: 0;
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
            transform: translateX(-20px) skewX(-5deg); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) skewX(0); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(20px) skewX(5deg); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) skewX(0); 
          }
        }
        
        @keyframes dropdown-fade {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes slide-in-toast {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes gradient-shift {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        @keyframes gradient-flow {
          0% { 
            background-position: 0% 0%; 
          }
          50% { 
            background-position: 100% 100%; 
          }
          100% { 
            background-position: 0% 0%; 
          }
        }
        
        @keyframes spin-slow {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 1; 
          }
          50% { 
            opacity: 0.7; 
          }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.05); 
          }
        }
        
        @keyframes ping-slow {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }
        
        @keyframes turnstile-glow {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.02); 
          }
        }
        
        @keyframes turnstile-border-glow {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 20px 5px rgba(255, 165, 0, 0.6);
          }
        }
        
        @keyframes bounce {
          0%, 100% { 
            transform: translateY(0); 
          }
          50% { 
            transform: translateY(-5px); 
          }
        }
        
        /* Animation classes */
        .animate-orb-float-1 {
          animation: orb-float-1 30s ease-in-out infinite;
        }
        
        .animate-orb-float-2 {
          animation: orb-float-2 35s ease-in-out infinite;
          animation-delay: 5s;
        }
        
        .animate-float-particle-1 {
          animation: float-particle-1 20s ease-in-out infinite;
        }
        
        .animate-float-particle-2 {
          animation: float-particle-2 25s ease-in-out infinite;
          animation-delay: 3s;
        }
        
        .animate-float-particle-3 {
          animation: float-particle-3 22s ease-in-out infinite;
          animation-delay: 7s;
        }
        
        .animate-float-button-1 {
          animation: float-button-1 3s ease-in-out infinite;
        }
        
        .animate-float-button-2 {
          animation: float-button-2 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
        }
        
        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in-left-delayed {
          animation: slide-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in-right-delayed {
          animation: slide-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s both;
        }
        
        .animate-dropdown-fade {
          animation: dropdown-fade 0.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-slide-in-toast {
          animation: slide-in-toast 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .animate-gradient-shift {
          background-size: 200% auto;
          animation: gradient-shift 3s ease-in-out infinite;
        }
        
        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 4s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-turnstile-glow {
          animation: turnstile-glow 2s ease-in-out infinite;
        }
        
        .animate-turnstile-border-glow {
          animation: turnstile-border-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 0.5s ease-in-out infinite;
        }
        
        /* Cloudflare widget styling */
        .turnstile-widget {
          position: relative;
          z-index: 10;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 165, 0, 0.1);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .turnstile-widget:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 30px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 165, 0, 0.3);
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-orb-float-1,
          .animate-orb-float-2,
          .animate-float-particle-1,
          .animate-float-particle-2,
          .animate-float-particle-3,
          .animate-float-button-1,
          .animate-float-button-2 {
            animation: none;
          }
          
          .turnstile-widget:hover {
            transform: none;
          }
          
          .animate-turnstile-glow,
          .animate-turnstile-border-glow {
            animation: none;
          }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
