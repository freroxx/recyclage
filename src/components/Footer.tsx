import { Instagram, Mail, Heart, Globe, Code, Sparkles, ExternalLink, ChevronRight } from "lucide-react";
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
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSupportClick = () => {
    navigate("/support");
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/50 mt-16 sm:mt-20">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-eco-primary/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-start gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-eco-primary rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
                <img
                  src={logo}
                  alt={t("footer.logoAlt")}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain bg-white dark:bg-gray-900 border-2 border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="text-center sm:text-left lg:text-left space-y-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-eco-primary bg-clip-text text-transparent">
                    {t("footer.projectName")}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("footer.schoolName")}</p>
                </div>
                <p className="text-xs text-muted-foreground/70 max-w-xs">
                  {t("footer.tagline")}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                  {t("footer.project")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t("footer.home")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/project" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t("footer.ourProject")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t("footer.resources")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                  {t("footer.support")}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 px-0"
                      onClick={handleSupportClick}
                    >
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      {t("footer.supportProject")}
                    </Button>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t("footer.contact")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t("footer.faq")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                  {t("footer.connect")}
                </h4>
                <div className="space-y-3">
                  <a
                    href="https://www.instagram.com/recyclage_projet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <a
                    href="mailto:recyclagemaria@gmail.com"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <span>Email</span>
                  </a>
                  <a
                    href="https://ecolemaria.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span>{t("footer.website")}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/5 to-eco-primary/5 rounded-xl p-6 border border-primary/10 dark:border-primary/20">
              <h4 className="font-bold text-foreground mb-3">
                {t("footer.makeDifference")}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {t("footer.makeDifferenceDescription")}
              </p>
              <Button
                onClick={handleSupportClick}
                className="w-full group bg-gradient-to-r from-primary to-eco-primary hover:from-primary/90 hover:to-eco-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                size={isMobile ? "default" : "lg"}
              >
                <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                {t("footer.supportButton")}
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} École Maria • {t("footer.allRightsReserved")}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {t("footer.location")}
            </p>
          </div>

          {/* Credits and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Credits Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-primary hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-200 group"
                >
                  <Code className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  {t("footer.credits")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-12 h-12 rounded-full border border-primary/20 dark:border-primary/40"
                    />
                    <div>
                      <DialogTitle className="text-foreground text-xl">
                        {t("footer.aboutProject")}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground dark:text-muted-foreground/80">
                        {t("footer.developmentDesign")}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/50 dark:border-border/30">
                      <span className="text-sm text-muted-foreground">
                        {t("footer.project")}
                      </span>
                      <span className="font-semibold text-foreground">{t("footer.projectName")}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50 dark:border-border/30">
                      <span className="text-sm text-muted-foreground">
                        {t("footer.organization")}
                      </span>
                      <span className="font-semibold text-foreground">{t("footer.schoolName")}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50 dark:border-border/30">
                      <span className="text-sm text-muted-foreground">
                        {t("footer.launched")}
                      </span>
                      <span className="font-semibold text-foreground">{t("footer.launchDate")}</span>
                    </div>
                  </div>

                  {/* Development Team */}
                  <div className="bg-gradient-to-r from-primary/5 to-eco-primary/5 dark:from-primary/10 dark:to-eco-primary/10 rounded-lg p-4 border border-primary/10 dark:border-primary/20">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {t("footer.developmentTeam")}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("footer.webDeveloper")}
                        </span>
                        <span className="font-bold text-foreground bg-gradient-to-r from-primary to-eco-primary bg-clip-text text-transparent">
                          Yahia Ikni
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground/70 dark:text-muted-foreground/60">
                        {t("footer.developerDescription")}
                      </div>
                    </div>
                  </div>

                  {/* Project Vision */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      {t("footer.projectVision")}
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                      {t("footer.projectVisionDescription")}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border dark:border-border/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDialogOpen(false)}
                    className="text-sm hover:bg-primary/10"
                  >
                    {t("footer.close")}
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-muted-foreground/70">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {t("footer.developedWithPassion")}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/50 dark:text-muted-foreground/60">
            {t("footer.educationalProject")}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground/60 dark:text-muted-foreground/70">
              {t("footer.activeProject")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
