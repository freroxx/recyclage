import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, MessageCircle, User, AtSign, CheckCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Contact() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  useScrollReveal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // honeypot anti-spam
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Honeypot → bot détecté
    if (formData.company) return;

    setIsSubmitting(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message || message.length < 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid form data",
      });
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid email address",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("https://formspree.io/f/mkowrblv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });

      if (!res.ok) throw new Error("Formspree failed");

      setSuccess(true);
      setFormData({ name: "", email: "", message: "", company: "" });
    } catch {
      toast({
        variant: "destructive",
        title: t("contact.error"),
        description: "Server error. Try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center shadow-xl">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mt-6">
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                {t("contact.title")}
              </span>
            </h1>
            <p className="text-muted-foreground mt-3">{t("contact.subtitle")}</p>
          </div>

          {/* Success */}
          {success ? (
            <Card className="border-2 border-green-500/30 shadow-xl animate-fade-in">
              <CardContent className="p-10 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">
                  {language === "fr" ? "Message envoyé !" : "Message sent!"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "fr"
                    ? "Nous vous répondrons très bientôt."
                    : "We’ll get back to you shortly."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-primary/20 shadow-xl scroll-reveal">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <Label className="flex gap-2">
                      <User className="w-4 h-4" />
                      {t("contact.name")}
                    </Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label className="flex gap-2">
                      <AtSign className="w-4 h-4" />
                      {t("contact.email")}
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label className="flex gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {t("contact.message")}
                    </Label>
                    <Textarea
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
                    className="w-full py-6 text-lg transition-all hover:scale-[1.02]"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t("contact.send")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
