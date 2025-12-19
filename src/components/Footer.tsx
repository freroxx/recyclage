import { Instagram, ExternalLink, Mail, Info, Heart, Users, MapPin, Calendar } from "lucide-react";
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
import { useState } from "react";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t, language } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <footer className="bg-secondary/50 backdrop-blur-sm border-t border-border mt-16 sm:mt-20 min-h-[180px]">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo & Name with enhanced design */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-eco-primary/20 rounded-full blur-md group-hover:blur-lg transition-all duration-500" />
              <img
                src={logo}
                alt={language === "fr" ? "Logo École Maria" : "Maria School Logo"}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white dark:bg-gray-900 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-foreground text-xl sm:text-2xl bg-gradient-to-r from-primary to-eco-primary bg-clip-text text-transparent">
                Recyclage Maria
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{t("footer.school")}</p>
              <p className="text-xs text-muted-foreground/70 mt-2 max-w-xs">
                {language === "fr" 
                  ? "Projet de développement durable pour une école plus verte"
                  : "Sustainable development project for a greener school"}
              </p>
            </div>
          </div>

          {/* Social Links & Contact Info */}
          <div className="text-center md:text-left space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-center md:justify-start gap-2">
                <Users className="w-4 h-4 text-primary" />
                {t("footer.connect")}
              </h4>
              <div className="space-y-2">
                <a
                  href="https://www.instagram.com/recyclage_projet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring group"
                >
                  <div className="relative">
                    <Instagram className="w-5 h-5" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300" />
                  </div>
                  <span className="text-sm font-medium">@recyclage_projet</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
                <a
                  href="https://ecolemaria.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring group"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span className="text-sm font-medium">ecolemaria.com</span>
                </a>
                <a
                  href="mailto:recyclagemaria@gmail.com"
                  className="inline-flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring group"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">recyclagemaria@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright, Credits & Additional Info */}
          <div className="text-center md:text-right space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                © 2025 École Maria Agadir. {t("footer.rights")}.
              </div>
              <div className="flex items-center justify-center md:justify-end gap-2 text-xs text-muted-foreground/70">
                <MapPin className="w-3 h-3" />
                {language === "fr" ? "Agadir, Maroc" : "Agadir, Morocco"}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-3">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 group"
                  >
                    <Info className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    {t("footer.credits")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg animate-scale-in">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-12 h-12 rounded-full border border-primary/20"
                      />
                      <DialogTitle className="text-primary text-2xl">
                        {t("footer.creditsTitle")}
                      </DialogTitle>
                    </div>
                    <DialogDescription className="space-y-4 pt-4">
                      <p className="text-foreground/80 text-sm">
                        {language === "fr" 
                          ? "Ce projet est réalisé dans le cadre d'une initiative de développement durable à l'École Maria d'Agadir."
                          : "This project is carried out as part of a sustainable development initiative at Maria School in Agadir."}
                      </p>
                      
                      <div className="space-y-4">
                        {/* Project Team Section */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            {language === "fr" ? "Équipe du Projet" : "Project Team"}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-primary/5 rounded-lg p-3">
                              <div className="font-medium text-foreground text-sm">
                                {t("footer.creator")}
                              </div>
                              <div className="text-foreground/80 text-sm font-semibold mt-1">
                                Yahia Ikni
                              </div>
                              <div className="text-muted-foreground text-xs mt-1">
                                {language === "fr" ? "Conception & Développement" : "Design & Development"}
                              </div>
                            </div>
                            <div className="bg-primary/5 rounded-lg p-3">
                              <div className="font-medium text-foreground text-sm">
                                {language === "fr" ? "Coordination" : "Coordination"}
                              </div>
                              <div className="text-foreground/80 text-sm font-semibold mt-1">
                                École Maria
                              </div>
                              <div className="text-muted-foreground text-xs mt-1">
                                {language === "fr" ? "Organisation & Suivi" : "Organization & Monitoring"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <Calendar className="w-4 h-4" />
                              {t("footer.created")}
                            </div>
                            <span className="font-semibold text-foreground">{t("footer.date")}</span>
                          </div>
                          
                          <div className="flex items-center justify-between border-b border-border/50 pb-2">
                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <MapPin className="w-4 h-4" />
                              {language === "fr" ? "Localisation" : "Location"}
                            </div>
                            <span className="font-semibold text-foreground">
                              {language === "fr" ? "Agadir, Maroc" : "Agadir, Morocco"}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <Heart className="w-4 h-4 text-red-500" />
                              {language === "fr" ? "Statut" : "Status"}
                            </div>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {language === "fr" ? "Actif • En cours" : "Active • Ongoing"}
                            </span>
                          </div>
                        </div>

                        {/* Acknowledgments */}
                        <div className="bg-gradient-to-r from-primary/10 to-eco-primary/10 rounded-lg p-4 mt-4">
                          <h5 className="font-medium text-foreground text-sm mb-2">
                            {language === "fr" ? "Remerciements" : "Acknowledgments"}
                          </h5>
                          <p className="text-xs text-foreground/70">
                            {language === "fr" 
                              ? "Nous remercions tous les élèves, enseignants et personnel administratif de l'École Maria pour leur engagement dans ce projet de développement durable."
                              : "We thank all the students, teachers, and administrative staff of Maria School for their commitment to this sustainable development project."}
                          </p>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDialogOpen(false)}
                      className="text-sm"
                    >
                      {language === "fr" ? "Fermer" : "Close"}
                    </Button>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                      {language === "fr" ? "Fait avec passion" : "Made with passion"}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Additional Links */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <a
                  href="/privacy"
                  className="hover:text-primary transition-colors duration-200"
                >
                  {language === "fr" ? "Confidentialité" : "Privacy"}
                </a>
                <span className="text-border">•</span>
                <a
                  href="/terms"
                  className="hover:text-primary transition-colors duration-200"
                >
                  {language === "fr" ? "Conditions" : "Terms"}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/60 text-center sm:text-left">
              {language === "fr" 
                ? "Projet éducatif de recyclage et développement durable • École Maria, Agadir"
                : "Educational recycling and sustainable development project • Maria School, Agadir"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              {language === "fr" ? "Soutenez le projet" : "Support the project"}
              <Heart className="w-3 h-3 fill-red-500/20 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
