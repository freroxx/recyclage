import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Mail, Send, MessageCircle, User, AtSign, Sparkles, Loader2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t, language } = useLanguage();
  const { playSuccessSound, playErrorSound } = useSoundEffects();
  useScrollReveal();

  const turnstileRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // Disable complex animations on mobile for better performance
        document.documentElement.classList.add('mobile-device');
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setMounted(true);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.documentElement.classList.remove('mobile-device');
    };
  }, []);

  // Load Cloudflare Turnstile with better error handling
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
              },
              "refresh-expired": "auto",
              "retry": "auto",
              "retry-interval": 3000,
              "appearance": "interaction-only"
            });
          }
        }, 100);
      };
      
      script.onerror = () => {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(loadTurnstile, 1000 * attempts);
        } else {
          toast.error("Could not load security check. Please refresh the page.");
          playErrorSound();
        }
      };

      document.body.appendChild(script);
    };

    loadTurnstile();

    return () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      setTurnstileLoaded(false);
    };
  }, [playSuccessSound, playErrorSound]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      playErrorSound();
      toast.error(t("contact.fillAllFields"), {
        duration: 3000,
        position: "top-center",
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      playErrorSound();
      toast.error(t("contact.validEmail"), {
        duration: 3000,
        position: "top-center",
      });
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      playErrorSound();
      toast.error(t("contact.completeCaptcha"), {
        duration: 3000,
        position: "top-center",
        action: {
          label: "Retry",
          onClick: () => {
            if ((window as any).turnstile && turnstileRef.current) {
              (window as any).turnstile.reset(turnstileRef.current);
            }
          }
        }
      });
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
        }),
      });

      if (!response.ok) throw new Error("Formspree submission failed");

      playSuccessSound();
      toast.dismiss(loadingToast);
      toast.success(t("contact.sentSuccessfully"), {
        duration: 5000,
        position: "top-center",
        description: language === "fr" 
          ? "Nous vous répondrons dans les plus brefs délais." 
          : "We'll get back to you as soon as possible.",
        action: {
          label: "OK",
          onClick: () => {},
        },
      });

      setFormData({ name: "", email: "", message: "" });
      setTurnstileToken("");
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileRef.current);
      }
    } catch (error) {
      playErrorSound();
      toast.dismiss(loadingToast);
      toast.error(t("contact.tryLater"), {
        duration: 5000,
        position: "top-center",
        description: language === "fr"
          ? "Veuillez réessayer dans quelques minutes."
          : "Please try again in a few minutes.",
        action: {
          label: "Retry",
          onClick: () => {
            handleSubmit(e);
          },
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const parent = e.target.parentElement;
    if (parent) {
      parent.classList.add('input-focused');
    }
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const parent = e.target.parentElement;
    if (parent) {
      parent.classList.remove('input-focused');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Optimized Animated background */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle floating blobs with optimized animations */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-blob-float-slow" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob-float-medium" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-green-400/5 rounded-full blur-2xl animate-blob-float-fast" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-blob-float-slow" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header with optimized animations */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20 transition-all duration-300 hover:scale-105 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="relative w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-primary/30 group">
              <Mail className="w-10 h-10 text-primary transition-transform duration-500 group-hover:rotate-12" />
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-slide-up-delayed">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Form with optimized animations */}
          <Card 
            className="border-2 border-primary/20 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-primary/30 animate-fade-in-up"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 opacity-30 transition-opacity duration-500",
              isHovering && "opacity-50"
            )} />
            <CardContent className="p-6 md:p-8 relative">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2 animate-slide-in-left">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base group">
                    <User className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
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
                      placeholder={t("contact.name")}
                      className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 transition-all duration-300" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2 animate-slide-in-left-delayed">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base group">
                    <AtSign className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
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
                      placeholder={t("contact.email")}
                      className="h-12 border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 transition-all duration-300" />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base group">
                    <MessageCircle className="w-4 h-4 text-primary transition-transform duration-300 group-hover:scale-125" />
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
                      placeholder={t("contact.message")}
                      rows={5}
                      className="border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/40 resize-none min-h-[120px]"
                      required
                      disabled={isSubmitting}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 transition-all duration-300" />
                  </div>
                </div>

                {/* Enhanced Cloudflare Turnstile Widget */}
                <div className="flex justify-center my-6 animate-fade-in">
                  <div className="relative">
                    <div
                      ref={turnstileRef}
                      className={cn(
                        "turnstile p-3 rounded-lg transition-all duration-500",
                        turnstileLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
                        "hover:scale-[1.02] hover:shadow-lg"
                      )}
                      style={{
                        background: "white",
                        boxShadow: "0 0 0 1px rgba(255, 165, 0, 0.2)",
                      }}
                    />
                    {!turnstileLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button with enhanced feedback */}
                <Button
                  type="submit"
                  size="lg"
                  className={cn(
                    "w-full py-6 text-lg shadow-lg transition-all duration-500",
                    "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
                    "animate-slide-up-delayed",
                    isSubmitting && "opacity-80 cursor-not-allowed"
                  )}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span className="animate-pulse">
                        {language === "fr" ? "Envoi en cours..." : "Sending..."}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
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

          {/* Direct Contact Info */}
          <div className="mt-8 text-center animate-fade-in-up-delayed">
            <Card className="border border-muted/50 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Vous pouvez aussi nous contacter directement à"
                    : "You can also contact us directly at"}{" "}
                  <a
                    href="mailto:recyclagemaria@gmail.com"
                    className="text-primary font-medium hover:underline transition-all duration-300 hover:text-primary/80 group"
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText('recyclagemaria@gmail.com');
                      playSuccessSound();
                      toast.success(
                        language === "fr" 
                          ? "Adresse e-mail copiée !" 
                          : "Email address copied!",
                        { duration: 2000 }
                      );
                    }}
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

      {/* Add global styles for animations */}
      <style jsx global>{`
        @keyframes blob-float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        
        @keyframes blob-float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 10px) scale(1.03); }
          66% { transform: translate(15px, -15px) scale(0.97); }
        }
        
        @keyframes blob-float-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -10px) scale(1.02); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-blob-float-slow {
          animation: blob-float-slow 20s ease-in-out infinite;
        }
        
        .animate-blob-float-medium {
          animation: blob-float-medium 15s ease-in-out infinite;
        }
        
        .animate-blob-float-fast {
          animation: blob-float-fast 10s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in-up-delayed {
          animation: fade-in-up 0.6s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-slide-up-delayed {
          animation: slide-up 0.5s ease-out 0.2s both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.4s ease-out;
        }
        
        .animate-slide-in-left-delayed {
          animation: slide-in-left 0.4s ease-out 0.1s both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out 0.2s both;
        }
        
        /* Cloudflare widget enhancements */
        .turnstile {
          position: relative;
          overflow: hidden;
        }
        
        .turnstile::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #ff6b35, #ffa500, #ffd700);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .turnstile:hover::before {
          opacity: 0.2;
          animation: turnstile-glow 2s ease-in-out infinite;
        }
        
        @keyframes turnstile-glow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        /* Form input focus effect */
        .input-focused .absolute.bottom-0 {
          background: linear-gradient(90deg, #ff6b35, #ffa500);
          height: 2px;
        }
        
        /* Mobile optimizations */
        .mobile-device .animate-blob-float-slow,
        .mobile-device .animate-blob-float-medium,
        .mobile-device .animate-blob-float-fast {
          animation: none;
        }
        
        @media (max-width: 768px) {
          .animate-blob-float-slow,
          .animate-blob-float-medium,
          .animate-blob-float-fast {
            animation: none;
          }
          
          .turnstile:hover::before {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
