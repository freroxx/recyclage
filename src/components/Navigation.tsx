"use client"

import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useThemeToggleStyles } from "@/components/ThemeToggle"; // Import des styles globaux
import { AIChat } from "@/components/AIChat";
import logo from "@/assets/logo-optimized.webp";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react"; // Import de l'icône Leaf

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Ajouter les styles globaux pour les transitions de thème
  useThemeToggleStyles();

  const navItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.project", path: "/project" },
    { key: "nav.resources", path: "/resources" },
    { key: "nav.contact", path: "/contact" },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm theme-transition"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo avec animation */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group focus-ring rounded-lg px-2 -mx-2"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Fond circulaire animé pour le logo */}
              <motion.div
                className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 blur-sm"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-emerald-500/30" />
              </motion.div>
              
              {/* Logo principal */}
              <img 
                src={logo} 
                alt="Recyclage Maria Logo" 
                className="relative w-9 h-9 sm:w-10 sm:h-10 object-contain transition-all duration-300 group-hover:scale-110 z-10"
              />
            </motion.div>
            
            <motion.span 
              className="font-bold text-base sm:text-lg text-foreground transition-colors group-hover:text-primary"
              whileHover={{ scale: 1.05 }}
            >
              Recyclage Maria
            </motion.span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className="relative px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring group"
                  activeClassName="text-primary bg-primary/10"
                >
                  {t(item.key)}
                  {/* Ligne animée sous le lien */}
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-3/4" />
                </NavLink>
              </motion.div>
            ))}
            
            {/* Contrôles (AI, Theme, Language) */}
            <motion.div 
              className="flex items-center gap-1 ml-2 border-l border-border pl-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: navItems.length * 0.1 + 0.1 }}
            >
              {/* Bouton AI Assistant avec animation de pulse */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiChatOpen(true)}
                  className="gap-2 hover:bg-primary/5 focus-ring text-primary relative group/ai"
                >
                  {/* Animation de halo pour AI */}
                  <motion.div
                    className="absolute -inset-1 rounded-full opacity-0 group-hover/ai:opacity-100 blur-sm"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
                  </motion.div>
                  
                  <Bot className="w-4 h-4 relative z-10" />
                  <span className="hidden lg:inline relative z-10">IA</span>
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
                  className="gap-2 hover:bg-primary/5 focus-ring relative group/lang"
                >
                  {/* Animation de halo pour langue */}
                  <motion.div
                    className="absolute -inset-1 rounded-full opacity-0 group-hover/lang:opacity-100 blur-sm"
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
                  </motion.div>
                  
                  <Languages className="w-4 h-4 relative z-10" />
                  <motion.span 
                    key={language}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="hidden lg:inline relative z-10"
                  >
                    {language.toUpperCase()}
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            {/* Bouton AI Assistant mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiChatOpen(true)}
                className="gap-1 focus-ring text-primary"
                aria-label="AI Assistant"
              >
                <Bot className="w-4 h-4" />
              </Button>
            </motion.div>
            
            {/* Theme Toggle mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeToggle />
            </motion.div>
            
            {/* Language Toggle mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="gap-1 focus-ring"
                aria-label="Toggle language"
              >
                <Languages className="w-4 h-4" />
              </Button>
            </motion.div>
            
            {/* Bouton Menu mobile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="focus-ring"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu avec animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus-ring"
                      activeClassName="text-primary bg-primary/10"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AIChat open={aiChatOpen} onOpenChange={setAiChatOpen} />
      
      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .focus-ring {
          @apply focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background;
        }
        
        .theme-transition {
          transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </motion.nav>
  );
}
