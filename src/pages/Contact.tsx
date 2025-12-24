import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, MessageCircle, User, AtSign } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  useScrollReveal();

  const turnstileRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => setIsMobile(window.innerWidth <= 768), []);

  // Load Cloudflare Turnstile
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).turnstile && turnstileRef.current) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAACIP-ezbrfMoU0rB",
          callback: (token: string) => setTurnstileToken(token),
        });
      }
    };

    return () => document.body.removeChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ variant: "destructive", title: t("contact.error"), description: t("contact.fillAllFields") });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ variant: "destructive", title: t("contact.error"), description: t("contact.validEmail") });
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      toast({ variant: "destructive", title: t("contact.error"), description: t("contact.completeCaptcha") });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/mkowrblv", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          "cf-turnstile-response": turnstileToken,
        }),
      });

      if (!response.ok) throw new Error("Formspree submission failed");

      toast({ title: t("contact.success"), description: t("contact.sentSuccessfully") });

      setFormData({ name: "", email: "", message: "" });
      setTurnstileToken("");
      if ((window as any).turnstile && turnstileRef.current) (window as any).turnstile.reset(turnstileRef.current);
    } catch {
      toast({ variant: "destructive", title: t("contact.error"), description: t("contact.tryLater") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated background */}
      {!isMobile && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl transition-transform hover:scale-105" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transition-transform hover:scale-105" />
          <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-green-400/10 rounded-full blur-2xl transition-transform hover:scale-105" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl transition-transform hover:scale-105" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20 transition-transform hover:scale-105">
              <MessageCircle className="w-4 h-4" />
              <span>{language === "fr" ? "Contactez-nous" : "Contact Us"}</span>
            </div>

            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform hover:scale-110">
              <Mail className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("contact.title")}
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t("contact.subtitle")}</p>
          </div>

          {/* Form */}
          <Card className="border-2 border-primary/20 shadow-xl overflow-hidden transition-transform hover:shadow-2xl hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 opacity-50" />
            <CardContent className="p-8 md:p-10 relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-base">
                    <User className="w-4 h-4 text-primary" />
                    {t("contact.name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contact.name")}
                    className="h-12 border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-base">
                    <AtSign className="w-4 h-4 text-primary" />
                    {t("contact.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("contact.email")}
                    className="h-12 border-2 focus:border-primary transition-colors"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-base">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    {t("contact.message")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t("contact.message")}
                    rows={6}
                    className="border-2 focus:border-primary transition-colors resize-none"
                    required
                  />
                </div>

                {/* Turnstile */}
                <div className="flex justify-center my-4">
                  <div
                    ref={turnstileRef}
                    className="turnstile p-2 rounded-md shadow-lg hover:shadow-2xl transition-all"
                    style={{
                      boxShadow: "0 0 15px rgba(255,165,0,0.5)",
                      background: "white",
                    }}
                  ></div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>{language === "fr" ? "Envoi..." : "Sending..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      <span>{t("contact.send")}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Direct Contact Info */}
          <div className="mt-8 text-center">
            <Card className="border border-muted hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Vous pouvez aussi nous contacter directement à"
                    : "You can also contact us directly at"}{" "}
                  <a
                    href="mailto:recyclagemaria@gmail.com"
                    className="text-primary font-medium hover:underline"
                  >
                    recyclagemaria@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
