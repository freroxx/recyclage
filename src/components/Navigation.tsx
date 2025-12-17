"use client"

import { useState, useEffect, useCallback } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X, Languages, Bot } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AIChat } from "@/components/AIChat";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveredLogo, setIsHoveredLogo] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const logoControls = useAnimationControls();

  const navItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.project", path: "/project" },
    { key: "nav.resources", path: "/resources" },
    { key: "nav.contact", path: "/contact" },
  ];

  // Optimized mobile detection with throttling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Scroll detection with throttling for mobile performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  // Optimized logo hover effect for desktop
  const handleLogoHoverStart = useCallback(() => {
    if (!isMobile) {
      setIsHoveredLogo(true);
      logoControls.start({
        rotate: 360,
        scale: 1.1,
        transition: {
          rotate: {
            duration: 0.6,
            ease: "easeInOut"
          },
          scale: {
            type: "spring",
            stiffness: 300,
            damping: 10
          }
        }
      });
    }
  }, [isMobile, logoControls]);

  const handleLogoHoverEnd = useCallback(() => {
    if (!isMobile) {
      setIsHoveredLogo(false);
      logoControls.start({
        rotate: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 15
        }
      });
    }
  }, [isMobile, logoControls]);

  const closeMobileMenu = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isMobile && isOpen) {
      closeMobileMenu();
    }
  }, [isMobile, isOpen, closeMobileMenu]);

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
        // Optimize for mobile
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, backdrop-filter'
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo with enhanced animations */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg px-2 -mx-2 select-none"
            onMouseEnter={handleLogoHoverStart}
            onMouseLeave={handleLogoHoverEnd}
            onClick={closeMobileMenu}
            aria-label="Accueil"
          >
            <motion.div
              animate={logoControls}
              whileTap={{ scale: 0.95 }}
              className="relative"
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {/* Desktop-only glow effects */}
              {!isMobile && (
                <motion.div
                  className="absolute -inset-2 rounded-full opacity-0"
                  animate={{ 
                    scale: isHoveredLogo ? [1, 1.2, 1] : 1,
                    opacity: isHoveredLogo ? [0, 0.3, 0] : 0
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 dark:from-primary/30 dark:via-accent/20 dark:to-primary/30" />
                </motion.div>
              )}
              
              {/* Logo container with shine effect */}
              <div className="relative overflow-hidden rounded-lg">
                {!isMobile && isHoveredLogo && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <img 
                  src={logo} 
                  alt="Recyclage Maria Logo" 
                  className="relative w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110 z-10"
                  loading="eager"
                  draggable="false"
                  decoding="async"
                />
              </div>
            </motion.div>
            
            <motion.span 
              className="font-bold text-base sm:text-lg text-foreground transition-colors duration-300 group-hover:text-primary whitespace-nowrap"
              animate={!isMobile ? { 
                scale: isHoveredLogo ? 1.05 : 1,
                x: isHoveredLogo ? [0, 2, -2, 0] : 0
              } : {}}
              transition={!isMobile ? { 
                scale: { type: "spring", stiffness: 300, damping: 10 },
                x: { duration: 0.5, ease: "easeInOut" }
              } : {}}
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
                whileTap={{ y: 0, scale: 0.98 }}
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
                  
                  {/* Pulse effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0"
                    initial={false}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0, 0.15, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.5, 1]
                    }}
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20" />
                  </motion.div>
                </NavLink>
              </motion.div>
            ))}
            
            {/* Desktop Controls - Enhanced with better alignment */}
            <motion.div 
              className="flex items-center gap-1 ml-2 pl-2 border-l border-border"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: navItems.length * 0.1 + 0.1,
                type: "spring"
              }}
            >
              {/* AI Chat Button */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiChatOpen(true)}
                  className="w-10 h-10 p-0 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-primary relative group/ai"
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
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -inset-2 rounded-full opacity-0"
                    whileHover={{ opacity: 0.3, scale: 1.1 }}
                    whileTap={{ opacity: 0.2, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 blur-md" />
                  </motion.div>
                  
                  <Bot className="w-5 h-5 relative z-10" />
                </Button>
              </motion.div>
              
              {/* Theme Toggle - Wrapped for consistent size */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="relative"
              >
                <div className="w-10 h-10">
                  <ThemeToggle />
                </div>
              </motion.div>
              
              {/* Language Toggle */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95, y: 0 }}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="w-10 h-10 p-0 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group/lang"
                  aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
                >
                  <motion.div
                    className="absolute -inset-2 rounded-full opacity-0"
                    whileHover={{ opacity: 0.2, scale: 1.1 }}
                    whileTap={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 blur-md" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ rotate: language === "fr" ? 0 : 180 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  >
                    <Languages className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu Button - Optimized */}
          <div className="flex md:hidden items-center gap-1">
            {/* AI Chat Button */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiChatOpen(true)}
                className="w-10 h-10 p-2 hover:bg-primary/5 active:bg-primary/10 transition-colors"
                aria-label="Assistant IA"
              >
                <Bot className="w-5 h-5" />
              </Button>
            </motion.div>
            
            {/* Theme Toggle */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <div className="w-10 h-10">
                <ThemeToggle />
              </div>
            </motion.div>
            
            {/* Language Toggle */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="w-10 h-10 p-2 hover:bg-primary/5 active:bg-primary/10 transition-colors"
                aria-label={`Changer la langue (${language.toUpperCase()})`}
              >
                <Languages className="w-5 h-5" />
              </Button>
            </motion.div>
            
            {/* Menu Toggle */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 p-2 hover:bg-primary/5 active:bg-primary/10 transition-colors"
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
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu - Optimized for performance */}
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
              className="md:hidden overflow-hidden theme-transition bg-background"
              style={{
                transform: 'translateZ(0)',
                willChange: 'height, opacity'
              }}
            >
              <div className="py-4 border-t border-border">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.2
                    }}
                    whileTap={{ x: -5 }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="block px-6 py-4 text-base font-medium text-muted-foreground hover:text-primary active:text-primary active:bg-primary/5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg mx-2"
                      activeClassName="text-primary bg-primary/10"
                      onClick={closeMobileMenu}
                    >
                      <span className="flex items-center">
                        <motion.span 
                          className="inline-block w-1 h-4 mr-3 bg-primary rounded-full opacity-0"
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        />
                        {t(item.key)}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
                
                {/* Mobile quick actions */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-6 px-4 border-t border-border"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("Quick actions") || "Actions rapides"}
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            closeMobileMenu();
                            setTimeout(() => setAiChatOpen(true), 100);
                          }}
                          className="gap-2"
                          aria-label="Ouvrir l'assistant IA"
                        >
                          <Bot className="w-4 h-4" />
                          <span>IA</span>
                        </Button>
                      </motion.div>
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toggleLanguage();
                            closeMobileMenu();
                          }}
                          className="gap-2"
                          aria-label="Changer la langue"
                        >
                          <Languages className="w-4 h-4" />
                          <span>{language.toUpperCase()}</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AIChat open={aiChatOpen} onOpenChange={setAiChatOpen} />
    </motion.nav>
  );
}
