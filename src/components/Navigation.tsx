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
  const [isHoveredLogo, setIsHoveredLogo] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.project", path: "/project" },
    { key: "nav.resources", path: "/resources" },
    { key: "nav.contact", path: "/contact" },
  ];

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Détection du scroll pour l'effet de fond - optimized for mobile
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Use passive listener for better mobile performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  // Optimized mobile menu close handler
  const closeMobileMenu = () => {
    setIsOpen(false);
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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
          ? 'bg-background/95 dark:bg-background/90 border-border shadow-lg' 
          : 'bg-background/90 dark:bg-background/80 border-transparent'
        }
        backdrop-blur-md border-b transition-all duration-300 ease-out
        theme-transition
      `}
      style={{ 
        // Hardware acceleration for mobile
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with conditional animations */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg px-2 -mx-2"
            onMouseEnter={() => !isMobile && setIsHoveredLogo(true)}
            onMouseLeave={() => !isMobile && setIsHoveredLogo(false)}
            onClick={() => isOpen && setIsOpen(false)}
          >
            <motion.div
              whileHover={!isMobile ? { rotate: 360, scale: 1.1 } : undefined}
              whileTap={{ scale: 0.95 }}
              animate={!isMobile ? { 
                rotate: isHoveredLogo ? 360 : 0,
                scale: isHoveredLogo ? 1.1 : 1
              } : undefined}
              transition={!isMobile ? { 
                rotate: { duration: 0.6, ease: "easeInOut" },
                scale: { type: "spring", stiffness: 300, damping: 10 }
              } : { duration: 0.15 }}
              className="relative"
            >
              {/* Only show complex glow effects on desktop */}
              {!isMobile && (
                <motion.div
                  className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 blur-sm"
                  animate={{ 
                    scale: isHoveredLogo ? [1, 1.2, 1] : 1,
                    opacity: isHoveredLogo ? [0, 0.4, 0] : 0
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 dark:from-primary/30 dark:via-accent/20 dark:to-primary/30" />
                </motion.div>
              )}
              
              {/* Optimized for mobile: simpler effects */}
              {!isMobile && (
                <motion.div
                  className="absolute -inset-3 rounded-full opacity-0"
                  animate={{ 
                    scale: isHoveredLogo ? 1.1 : 1,
                    opacity: isHoveredLogo ? 0.2 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/10 blur-lg" />
                </motion.div>
              )}
              
              {/* Logo with conditional shine effect */}
              <div className="relative overflow-hidden rounded-lg">
                {!isMobile && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ 
                      x: isHoveredLogo ? ["-100%", "100%"] : "-100%"
                    }}
                    transition={{ 
                      duration: 1,
                      ease: "easeInOut",
                      repeat: isHoveredLogo ? Infinity : 0,
                      repeatDelay: 2
                    }}
                  />
                )}
                <img 
                  src={logo} 
                  alt="Recyclage Maria Logo" 
                  className="relative w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110 z-10"
                  loading="eager"
                  draggable="false"
                />
              </div>
            </motion.div>
            
            <motion.span 
              className="font-bold text-base sm:text-lg text-foreground transition-colors duration-300 group-hover:text-primary whitespace-nowrap"
              animate={!isMobile ? { 
                scale: isHoveredLogo ? 1.05 : 1,
                x: isHoveredLogo ? [0, 2, 0] : 0
              } : undefined}
              transition={!isMobile ? { 
                scale: { type: "spring", stiffness: 300 },
                x: { duration: 0.3, ease: "easeInOut" }
              } : { duration: 0.15 }}
            >
              Recyclage Maria
            </motion.span>
          </NavLink>

          {/* Desktop Navigation - Enhanced animations */}
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
                whileHover={{ y: -2 }}
              >
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className="relative px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group hover-lift"
                  activeClassName="text-primary bg-primary/10"
                >
                  {t(item.key)}
                  
                  <motion.span 
                    className="absolute bottom-0 left-1/2 h-0.5 bg-primary"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{ width: "75%", transition: { duration: 0.3 } }}
                    whileFocus={{ width: "75%", transition: { duration: 0.3 } }}
                  />
                  
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0, 0.1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-sm" />
                  </motion.div>
                </NavLink>
              </motion.div>
            ))}
            
            {/* Desktop Controls - Enhanced */}
            <motion.div 
              className="flex items-center gap-1 ml-2 pl-2 border-l border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: navItems.length * 0.1 + 0.1,
                type: "spring"
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative hover-glow"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiChatOpen(true)}
                  className="gap-2 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-primary relative group/ai hover-scale-smooth"
                  aria-label="Assistant IA"
                >
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
                    <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -inset-2 rounded-full opacity-0"
                    whileHover={{ opacity: 0.3, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 blur-md" />
                  </motion.div>
                  
                  <Bot className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/ai:scale-110 group-hover/ai:rotate-12" />
                  <span className="hidden lg:inline relative z-10 text-sm font-medium transition-all duration-300 group-hover/ai:tracking-wider">
                    IA
                  </span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="hover-rotate-smooth"
              >
                <ThemeToggle />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative hover-glow"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="gap-2 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background hover-scale-smooth group/lang"
                  aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
                >
                  <motion.div
                    className="absolute -inset-2 rounded-full opacity-0"
                    whileHover={{ opacity: 0.2, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 blur-md" />
                  </motion.div>
                  
                  <Languages className="w-4 h-4 transition-transform duration-300 group-hover/lang:scale-110 group-hover/lang:rotate-3" />
                  <motion.span 
                    key={language}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                    className="hidden lg:inline text-sm font-medium whitespace-nowrap transition-all duration-300 group-hover/lang:tracking-wider"
                  >
                    {language.toUpperCase()}
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu Button - OPTIMIZED for mobile */}
          <div className="flex md:hidden items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAiChatOpen(true)}
              className="min-h-10 min-w-10 p-2 hover:bg-primary/5 active:scale-95 transition-transform duration-150"
              aria-label="Assistant IA"
            >
              <Bot className="w-4 h-4" />
            </Button>
            
            <div className="scale-75">
              <ThemeToggle />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="min-h-10 min-w-10 p-2 hover:bg-primary/5 active:scale-95 transition-transform duration-150"
              aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
            >
              <Languages className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-10 min-w-10 p-2 hover:bg-primary/5 active:scale-95 transition-transform duration-150"
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu - OPTIMIZED for mobile performance */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: "auto" 
              }}
              exit={{ 
                opacity: 0, 
                height: 0 
              }}
              transition={{ 
                duration: 0.25,
                ease: "easeInOut"
              }}
              className="md:hidden overflow-hidden theme-transition"
              style={{
                // Force hardware acceleration
                transform: 'translateZ(0)',
                willChange: 'height, opacity'
              }}
            >
              <div className="py-4 border-t border-border">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.2
                    }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-primary active:text-primary active:bg-primary/5 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                      activeClassName="text-primary bg-primary/10"
                      onClick={closeMobileMenu}
                    >
                      <span className="block active:scale-95 transition-transform duration-150">
                        {t(item.key)}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
                
                <div className="pt-4 px-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("nav.quickActions") || "Actions rapides:"}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsOpen(false);
                          setAiChatOpen(true);
                        }}
                        className="p-2 hover:bg-primary/5 active:scale-95 transition-transform duration-150"
                        aria-label="Ouvrir l'assistant IA"
                      >
                        <Bot className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toggleLanguage();
                          setIsOpen(false);
                        }}
                        className="p-2 hover:bg-primary/5 active:scale-95 transition-transform duration-150"
                        aria-label="Changer la langue"
                      >
                        <Languages className="w-4 h-4" />
                        <span className="ml-1 text-xs font-medium">
                          {language.toUpperCase()}
                        </span>
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
