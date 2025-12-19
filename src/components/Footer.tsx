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

  return (
    <footer className="relative overflow-hidden">
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
                  alt={language === "fr" ? "Logo École Maria" : "Maria School Logo"}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain bg-white dark:bg-gray-900 border-2 border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="text-center sm:text-left lg:text-left space-y-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-eco-primary bg-clip-text text-transparent">
                    Recyclage Maria
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("footer.school")}</p>
                </div>
                <p className="text-xs text-muted-foreground/70 max-w-xs">
                  {language === "fr" 
                    ? "Initiative de développement durable pour un avenir plus vert"
                    : "Sustainable development initiative for a greener future"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                  {language === "fr" ? "Projet" : "Project"}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {language === "fr" ? "Accueil" : "Home"}
                    </Link>
                  </li>
                  <li>
                    <Link to="/project" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {language === "fr" ? "Notre Projet" : "Our Project"}
                    </Link>
                  </li>
                  <li>
                    <Link to="/resources" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {language === "fr" ? "Ressources" : "Resources"}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                  {language === "fr" ? "Support" : "Support"}
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
                      {language === "fr" ? "Soutenir le Projet" : "Support Project"}
                    </Button>
                  </li>
                  <li>
                    <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {language === "fr" ? "Contact" : "Contact"}
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 inline-flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {language === "fr" ? "FAQ" : "FAQ"}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4 text-sm tracking-wide uppercase">
                  {language === "fr" ? "Connectez-vous" : "Connect"}
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
                    <span>Site Web</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary/5 to-eco-primary/5 rounded-xl p-6 border border-primary/10">
              <h4 className="font-bold text-foreground mb-3">
                {language === "fr" ? "Faites la différence" : "Make a Difference"}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {language === "fr" 
                  ? "Chaque contribution compte. Soutenez notre initiative de recyclage."
                  : "Every contribution counts. Support our recycling initiative."}
              </p>
              <Button
                onClick={handleSupportClick}
                className="w-full group bg-gradient-to-r from-primary to-eco-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                size={isMobile ? "default" : "lg"}
              >
                <Heart className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                {language === "fr" ? "Soutenir" : "Support"}
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
              © 2025 École Maria • {language === "fr" ? "Tous droits réservés" : "All rights reserved"}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {language === "fr" ? "Agadir, Maroc" : "Agadir, Morocco"}
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
                  className="text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-200 group"
                >
                  <Code className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  {language === "fr" ? "Crédits" : "Credits"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={logo}
                      alt="Logo"
                      className="w-12 h-12 rounded-full border border-primary/20"
                    />
                    <div>
                      <DialogTitle className="text-foreground text-xl">
                        {language === "fr" ? "À propos du projet" : "About the Project"}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {language === "fr" 
                          ? "Développement et conception"
                          : "Development and design"}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Project Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">
                        {language === "fr" ? "Projet" : "Project"}
                      </span>
                      <span className="font-semibold text-foreground">Recyclage Maria</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">
                        {language === "fr" ? "Organisation" : "Organization"}
                      </span>
                      <span className="font-semibold text-foreground">École Maria</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">
                        {language === "fr" ? "Lancement" : "Launched"}
                      </span>
                      <span className="font-semibold text-foreground">Décembre 2024</span>
                    </div>
                  </div>

                  {/* Development Team */}
                  <div className="bg-gradient-to-r from-primary/5 to-eco-primary/5 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      {language === "fr" ? "Équipe de développement" : "Development Team"}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {language === "fr" ? "Développeur Web" : "Web Developer"}
                        </span>
                        <span className="font-bold text-foreground">Yahia Ikni</span>
                      </div>
                      <div className="text-xs text-muted-foreground/70">
                        {language === "fr" 
                          ? "Conception, développement et déploiement du site web"
                          : "Design, development and deployment of the website"}
                      </div>
                    </div>
                  </div>

                  {/* Project Vision */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      {language === "fr" ? "Vision du projet" : "Project Vision"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" 
                        ? "Créer une plateforme interactive pour promouvoir le recyclage et sensibiliser à l'importance du développement durable dans les écoles."
                        : "Create an interactive platform to promote recycling and raise awareness about the importance of sustainable development in schools."}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDialogOpen(false)}
                    className="text-sm"
                  >
                    {language === "fr" ? "Fermer" : "Close"}
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 text-primary" />
                    {language === "fr" ? "Développé avec passion" : "Developed with passion"}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="/privacy"
                className="hover:text-primary transition-colors duration-200"
              >
                {language === "fr" ? "Confidentialité" : "Privacy"}
              </a>
              <a
                href="/terms"
                className="hover:text-primary transition-colors duration-200"
              >
                {language === "fr" ? "Conditions" : "Terms"}
              </a>
              <span className="text-border hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground/60 hidden sm:inline">
                v1.0.0
              </span>
            </div>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground/50">
            {language === "fr" 
              ? "Projet éducatif pour un avenir durable • École Maria, Agadir • Maroc"
              : "Educational project for a sustainable future • Maria School, Agadir • Morocco"}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground/60">
              {language === "fr" ? "Projet actif" : "Active project"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
