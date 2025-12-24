import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, MessageCircle, User, AtSign, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  useScrollReveal();

  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setMounted(true);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Cloudflare Turnstile
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAACIP-ezbrfMoU0rB",
          callback: (token: string) => setTurnstileToken(token),
          "refresh-expired": "auto",
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ 
        variant: "destructive", 
        title: t("contact.error"), 
        description: t("contact.fillAllFields") 
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ 
        variant: "destructive", 
        title: t("contact.error"), 
        description: t("contact.validEmail") 
      });
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      toast({ 
        variant: "destructive", 
        title: t("contact.error"), 
        description: t("contact.completeCaptcha") 
      });
      setIsSubmitting(false);
      return;
    }

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

      toast({ 
        title: t("contact.success"), 
        description: t("contact.sentSuccessfully"),
        className: "bg-green-500 text-white border-green-600" 
      });

      setFormData({ name: "", email: "", message: "" });
      setTurnstileToken("");
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.reset(turnstileRef.current);
      }
    } catch {
      toast({ 
        variant: "destructive", 
        title: t("contact.error"), 
        description: t("contact.tryLater") 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Enhanced Animated background with floating particles */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Main floating blobs with improved animations */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-green-400/10 rounded-full blur-2xl animate-float-fast" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl animate-float-slow" />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float-particles" />
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-green-400/30 rounded-full animate-float-particles-delayed" />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-float-particles" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Enhanced Header with better animations */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20 hover:scale-105 hover:bg-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 animate-fade-in">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="relative w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-primary/30 hover:shadow-2xl group">
              <Mail className="w-10 h-10 text-primary transition-transform duration-500 group-hover:rotate-12" />
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-pulse" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent animate-gradient-x">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-slide-up-delayed">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Enhanced Form with better animations */}
          <Card 
            className="border-2 border-primary/20 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.005] animate-fade-in-up"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 opacity-50 transition-opacity duration-500",
              isHovering && "opacity-70"
            )} />
            <CardContent className="p-8 md:p-10 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2 animate-slide-in-left">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base group">
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
                    className="h-12 border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 hover:border-primary/50"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 animate-slide-in-left-delayed">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base group">
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
                    className="h-12 border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 hover:border-primary/50"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2 animate-slide-in-right">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base group">
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
                    className="border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20 hover:border-primary/50 resize-none"
                    required
                  />
                </div>

                {/* Enhanced Turnstile Widget */}
                <div className="flex justify-center my-4 animate-fade-in">
                  <div
                    ref={turnstileRef}
                    className="turnstile p-2 rounded-md transition-all duration-500 hover:scale-105 hover:shadow-orange-glow"
                    style={{
                      background: "white",
                    }}
                  ></div>
                </div>

                {/* Enhanced Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] group animate-slide-up-delayed"
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

          {/* Enhanced Direct Contact Info */}
          <div className="mt-8 text-center animate-fade-in-up-delayed">
            <Card className="border border-muted transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-[1.01]">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Vous pouvez aussi nous contacter directement à"
                    : "You can also contact us directly at"}{" "}
                  <a
                    href="mailto:recyclagemaria@gmail.com"
                    className="text-primary font-medium hover:underline transition-all duration-300 hover:tracking-wider group"
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

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-particles {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(10px, -10px) scale(1.1); opacity: 0.5; }
          50% { transform: translate(20px, 5px) scale(0.9); opacity: 0.3; }
          75% { transform: translate(-10px, 15px) scale(1.05); opacity: 0.4; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-float-particles {
          animation: float-particles 15s ease-in-out infinite;
        }
        .animate-float-particles-delayed {
          animation: float-particles 15s ease-in-out infinite 2s;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fade-in-up-delayed {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .animate-slide-up-delayed {
          animation: slideUp 0.6s ease-out 0.2s both;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.5s ease-out;
        }
        .animate-slide-in-left-delayed {
          animation: slideInLeft 0.5s ease-out 0.1s both;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
        
        .hover\\:shadow-orange-glow:hover {
          box-shadow: 
            0 0 20px rgba(255, 165, 0, 0.6),
            0 0 40px rgba(255, 140, 0, 0.4),
            0 0 60px rgba(255, 120, 0, 0.2);
        }
        
        /* Cloudflare widget styling */
        .turnstile {
          box-shadow: 0 0 0 1px rgba(255, 165, 0, 0.2), 0 0 10px rgba(255, 165, 0, 0.1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .animate-float-slow,
          .animate-float-medium,
          .animate-float-fast,
          .animate-float-particles,
          .animate-shimmer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
