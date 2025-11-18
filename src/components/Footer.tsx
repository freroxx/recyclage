import { Instagram, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

          {/* Social Links */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">{t("footer.followUs")}</p>
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
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right text-sm text-muted-foreground">
            © 2025 École Maria. {t("footer.rights")}.
          </div>
        </div>
      </div>
    </footer>
  );
}
