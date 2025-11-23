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
    <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border mt-16 sm:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start md:items-center">
          {/* Logo & Name */}
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-eco-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">EM</span>
            </div>
            <div>
              <div className="font-bold text-foreground text-lg">Recyclage Maria</div>
              <div className="text-sm text-muted-foreground">{t("footer.school")}</div>
            </div>
          </div>

          {/* Social Links & Email */}
          <div className="text-center sm:col-span-2 md:col-span-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm font-medium text-muted-foreground mb-4">{t("footer.followUs")}</p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <a
                  href="https://www.instagram.com/recyclage_projet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://ecolemaria.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-primary hover:text-primary/80 hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="text-sm font-medium">ecolemaria.com</span>
                </a>
              </div>
              <a
                href="mailto:recyclagemaria@gmail.com"
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">recyclagemaria@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Copyright & Credits */}
          <div className="text-center sm:col-span-2 md:col-span-1 md:text-right space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-sm text-muted-foreground">
              © 2025 École Maria. {t("footer.rights")}.
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 focus-ring"
                >
                  <Info className="w-4 h-4 mr-2" />
                  {t("footer.credits")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md animate-scale-in">
                <DialogHeader>
                  <DialogTitle className="text-primary text-xl">{t("footer.creditsTitle")}</DialogTitle>
                  <DialogDescription className="space-y-3 pt-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-border pb-3">
                        <span className="font-medium text-foreground">{t("footer.creator")}:</span>
                        <span className="text-foreground font-semibold">Yahia Ikni</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-3">
                        <span className="font-medium text-foreground">{t("footer.organization")}:</span>
                        <span className="text-foreground font-semibold">École Maria</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border pb-3">
                        <span className="font-medium text-foreground">{t("footer.created")}:</span>
                        <span className="text-foreground font-semibold">{t("footer.date")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{t("footer.project")}:</span>
                        <span className="text-foreground font-semibold">Recyclage Maria</span>
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
