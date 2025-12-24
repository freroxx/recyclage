import { useState } from "react";
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // honeypot anti-bot
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Anti-bot
    if (formData.company) return;

    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        variant: "destructive",
        title: t("contact.error"),
        description: t("contact.fillAll"),
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/mkowrblv", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Server error");
      }

      toast({
        title: t("contact.success"),
        description: t("contact.sent"),
      });

      setFormData({ name: "", email: "", message: "", company: "" });
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("contact.error"),
        description: t("contact.retry"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-primary/10">
      {/* Animated background (restored & improved) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-14 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-6 py-2 text-sm font-medium text-primary mb-6">
              <MessageCircle className="w-4 h-4" />
              {language === "fr" ? "Contactez-nous" : "Contact Us"}
            </div>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 shadow-xl">
              <Mail className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("contact.title")}
              </span>
            </h1>

            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Form */}
          <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl scroll-reveal">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5" />
            <CardContent className="relative p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />

                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="inline w-4 h-4 mr-2 text-primary" />
                    {t("contact.name")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <AtSign className="inline w-4 h-4 mr-2 text-primary" />
                    {t("contact.email")}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    <MessageCircle className="inline w-4 h-4 mr-2 text-primary" />
                    {t("contact.message")}
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full py-6 text-lg transition-all hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <span>{language === "fr" ? "Envoi..." : "Sending..."}</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {t("contact.send")}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
