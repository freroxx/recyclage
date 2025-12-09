"use client"

import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChat } from "@/components/AIChat";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.project", path: "/project" },
    { key: "nav.resources", path: "/resources" },
    { key: "nav.contact", path: "/contact" },
  ];

  // Détection du scroll pour l'effet de fond
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        mass: 0.5
      }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        ${scrolled 
          ? 'bg-background/95 border-border shadow-lg' 
          : 'bg-background/90 border-transparent'
        }
        backdrop-blur-md border-b transition-all duration-300
        theme-transition
      `}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo avec animations optimisées */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg px-2 -mx-2"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ 
                rotate: { duration: 0.6, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 300 }
              }}
              className="relative"
            >
              {/* Fond circulaire animé pour le logo */}
              <motion.div
                className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 blur-sm"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30" />
              </motion.div>
              
              {/* Logo principal */}
              <img 
                src={logo} 
                alt="Recyclage Maria Logo" 
                className="relative w-9 h-9 sm:w-10 sm:h-10 object-contain transition-all duration-300 group-hover:scale-110 z-10"
                loading="eager"
              />
            </motion.div>
            
            <motion.span 
              className="font-bold text-base sm:text-lg text-foreground transition-colors group-hover:text-primary whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Recyclage Maria
            </motion.span>
          </NavLink>

          {/* Desktop Navigation - Optimisé pour l'alignement */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                className="relative"
              >
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className="relative px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group"
                  activeClassName="text-primary bg-primary/10"
                >
                  {t(item.key)}
                  {/* Ligne animée sous le lien */}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4 group-focus:w-3/4" />
                </NavLink>
              </motion.div>
            ))}
            
            {/* Contrôles (AI, Theme, Language) - Amélioré pour l'alignement */}
            <motion.div 
              className="flex items-center gap-1 ml-2 pl-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: navItems.length * 0.1 + 0.1,
                type: "spring"
              }}
            >
              {/* Bouton AI Assistant avec animation de pulse */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiChatOpen(true)}
                  className="gap-2 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-primary"
                  aria-label="Assistant IA"
                >
                  {/* Animation de pulse subtile pour AI */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/10" />
                  </motion.div>
                  
                  <Bot className="w-4 h-4 relative z-10" />
                  <span className="hidden lg:inline relative z-10 text-sm font-medium">
                    IA
                  </span>
                </Button>
              </motion.div>
              
              {/* Theme Toggle amélioré */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThemeToggle />
              </motion.div>
              
              {/* Language Toggle avec animation */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="gap-2 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
                >
                  <Languages className="w-4 h-4" />
                  <motion.span 
                    key={language}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                    className="hidden lg:inline text-sm font-medium whitespace-nowrap"
                  >
                    {language.toUpperCase()}
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu Button - Optimisé pour le tactile */}
          <div className="flex md:hidden items-center gap-1">
            {/* Bouton AI Assistant mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="touch-manipulation"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiChatOpen(true)}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-primary min-h-10 min-w-10"
                aria-label="Assistant IA"
              >
                <Bot className="w-4 h-4" />
              </Button>
            </motion.div>
            
            {/* Theme Toggle mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="touch-manipulation"
            >
              <ThemeToggle />
            </motion.div>
            
            {/* Language Toggle mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="touch-manipulation"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background min-h-10 min-w-10"
                aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
              >
                <Languages className="w-4 h-4" />
              </Button>
            </motion.div>
            
            {/* Bouton Menu mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="touch-manipulation"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background min-h-10 min-w-10"
                aria-label="Menu"
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ type: "spring" }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ type: "spring" }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu avec animation optimisée */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeInOut",
                height: { duration: 0.2 }
              }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-95 touch-manipulation"
                      activeClassName="text-primary bg-primary/10"
                      onClick={() => {
                        setIsOpen(false);
                        // Fermeture douce pour améliorer UX mobile
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      <motion.span
                        whileTap={{ scale: 0.95 }}
                        className="block"
                      >
                        {t(item.key)}
                      </motion.span>
                    </NavLink>
                  </motion.div>
                ))}
                
                {/* Séparateur pour les boutons d'action sur mobile */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-center gap-3 px-4">
                    <span className="text-xs text-muted-foreground">
                      Actions rapides:
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsOpen(false);
                          setAiChatOpen(true);
                        }}
                        className="text-primary hover:bg-primary/5"
                      >
                        <Bot className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className="hover:bg-primary/5"
                      >
                        <Languages className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AIChat open={aiChatOpen} onOpenChange={setAiChatOpen} />
    </motion.nav>
  );
}
