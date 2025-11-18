import { Instagram, ExternalLink, Mail, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-eco-primary flex items-center justify-center">
              <span className="text-white font-bold">EM</span>
            </div>
            <div>
              <div className="font-bold text-foreground">Recyclage Maria</div>
              <div className="text-xs text-muted-foreground">{t("footer.school")}</div>
            </div>
          </div>

          {/* Social Links & Email */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">{t("footer.followUs")}</p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex justify-center gap-4">
                <a
                  href="https://www.instagram.com/recyclage_projet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://ecolemaria.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="text-sm font-medium">ecolemaria.com</span>
                </a>
              </div>
              <a
                href="mailto:recyclagemaria@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">recyclagemaria@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Copyright & Credits */}
          <div className="text-center md:text-right space-y-2">
            <div className="text-sm text-muted-foreground">
              © 2025 École Maria. {t("footer.rights")}.
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  <Info className="w-3 h-3 mr-1" />
                  {t("footer.credits")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-primary">{t("footer.creditsTitle")}</DialogTitle>
                  <DialogDescription className="space-y-3 pt-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="font-medium text-foreground">{t("footer.creator")}:</span>
                        <span className="text-foreground">Yahia Ikni</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="font-medium text-foreground">{t("footer.organization")}:</span>
                        <span className="text-foreground">École Maria</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-2">
                        <span className="font-medium text-foreground">{t("footer.created")}:</span>
                        <span className="text-foreground">{t("footer.date")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{t("footer.project")}:</span>
                        <span className="text-foreground">Recyclage Maria</span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  );
}
