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

// Hook to detect mobile devices
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Hook to reduce motion based on user preference
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
};

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHoveredLogo, setIsHoveredLogo] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
  const isMobile = useMobile();
  const prefersReducedMotion = useReducedMotion();

  const navItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.project", path: "/project" },
    { key: "nav.resources", path: "/resources" },
    { key: "nav.contact", path: "/contact" },
  ];

  // Optimized scroll detection with throttle
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

  // Conditional animation props based on device and user preference
  const getAnimationProps = (desktopProps: any, mobileProps: any = {}) => {
    if (prefersReducedMotion) return {};
    if (isMobile) return mobileProps;
    return desktopProps;
  };

  return (
    <motion.nav 
      initial={getAnimationProps({ y: -100 }, {})}
      animate={getAnimationProps({ y: 0 }, {})}
      transition={getAnimationProps({ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        mass: 0.5
      }, {})}
      className={`
        fixed top-0 left-0 right-0 z-50 
        ${scrolled 
          ? 'bg-background/95 dark:bg-background/90 border-border shadow-lg' 
          : 'bg-background/90 dark:bg-background/80 border-transparent'
        }
        backdrop-blur-md border-b transition-all duration-300 ease-out
        theme-transition
        will-change-transform
      `}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Optimized Logo - Simpler animations on mobile */}
          <NavLink 
            to="/" 
            className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg px-2 -mx-2 touch-manipulation"
            onMouseEnter={() => !isMobile && setIsHoveredLogo(true)}
            onMouseLeave={() => !isMobile && setIsHoveredLogo(false)}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <motion.div
              {...getAnimationProps(
                {
                  whileHover: { rotate: 360, scale: 1.1 },
                  whileTap: { scale: 0.95 },
                  animate: { 
                    rotate: isHoveredLogo ? 360 : 0,
                    scale: isHoveredLogo ? 1.1 : 1
                  },
                  transition: { 
                    rotate: { duration: 0.6, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 300, damping: 10 }
                  }
                },
                {
                  whileTap: { scale: 0.95 }
                }
              )}
              className="relative"
            >
              {/* Reduced glow effect on mobile */}
              {!isMobile && (
                <motion.div
                  className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 blur-sm"
                  animate={getAnimationProps({ 
                    scale: isHoveredLogo ? [1, 1.2, 1] : 1,
                    opacity: isHoveredLogo ? [0, 0.4, 0] : 0
                  }, {})}
                  transition={getAnimationProps({ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.5, 1]
                  }, {})}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 dark:from-primary/30 dark:via-accent/20 dark:to-primary/30" />
                </motion.div>
              )}
              
              {/* Simplified pulse animation on mobile */}
              <motion.div
                className="absolute -inset-3 rounded-full opacity-0"
                animate={getAnimationProps({ 
                  scale: isHoveredLogo ? 1.1 : 1,
                  opacity: isHoveredLogo ? 0.2 : 0
                }, {})}
                transition={getAnimationProps({ duration: 0.3 }, {})}
              >
                <div className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/10 blur-lg" />
              </motion.div>
              
              {/* Logo image with optimized loading */}
              <div className="relative overflow-hidden rounded-lg">
                {!isMobile && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={getAnimationProps({ 
                      x: isHoveredLogo ? ["-100%", "100%"] : "-100%"
                    }, {})}
                    transition={getAnimationProps({ 
                      duration: 1,
                      ease: "easeInOut",
                      repeat: isHoveredLogo ? Infinity : 0,
                      repeatDelay: 2
                    }, {})}
                  />
                )}
                <img 
                  src={logo} 
                  alt="Recyclage Maria Logo" 
                  className="relative w-9 h-9 sm:w-10 sm:h-10 object-contain transition-transform duration-300 group-hover:scale-110 z-10"
                  loading="eager"
                  width={40}
                  height={40}
                  decoding="async"
                />
              </div>
            </motion.div>
            
            <motion.span 
              className="font-bold text-base sm:text-lg text-foreground transition-colors duration-300 group-hover:text-primary whitespace-nowrap"
              {...getAnimationProps(
                {
                  animate: { 
                    scale: isHoveredLogo ? 1.05 : 1,
                    x: isHoveredLogo ? [0, 2, 0] : 0
                  },
                  transition: { 
                    scale: { type: "spring", stiffness: 300 },
                    x: { duration: 0.3, ease: "easeInOut" }
                  }
                },
                {}
              )}
            >
              Recyclage Maria
            </motion.span>
          </NavLink>

          {/* Desktop Navigation - Optimized and aligned */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={getAnimationProps({ opacity: 0, y: -20 }, {})}
                animate={getAnimationProps({ opacity: 1, y: 0 }, {})}
                transition={getAnimationProps({ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }, {})}
                className="relative"
                whileHover={getAnimationProps({ y: -2 }, {})}
              >
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className="relative px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group"
                  activeClassName="text-primary bg-primary/10"
                >
                  {t(item.key)}
                  
                  {/* Simplified hover animation */}
                  <motion.span 
                    className="absolute bottom-0 left-1/2 h-0.5 bg-primary"
                    initial={{ width: 0, x: "-50%" }}
                    whileHover={{ width: "75%" }}
                    transition={{ duration: 0.2 }}
                  />
                </NavLink>
              </motion.div>
            ))}
            
            {/* Desktop Controls - Better alignment */}
            <motion.div 
              className="flex items-center gap-1 ml-2 pl-2 border-l border-border"
              initial={getAnimationProps({ opacity: 0, scale: 0.9 }, {})}
              animate={getAnimationProps({ opacity: 1, scale: 1 }, {})}
              transition={getAnimationProps({ 
                delay: navItems.length * 0.1 + 0.1,
                type: "spring"
              }, {})}
            >
              {/* AI Assistant Button */}
              <motion.div
                whileHover={getAnimationProps({ scale: 1.05, y: -2 }, {})}
                whileTap={getAnimationProps({ scale: 0.95 }, {})}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiChatOpen(true)}
                  className="gap-1.5 lg:gap-2 px-2 lg:px-3 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-primary group/ai"
                  aria-label="Assistant IA"
                >
                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={getAnimationProps({
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }, {})}
                      transition={getAnimationProps({
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }, {})}
                    >
                      <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20" />
                    </motion.div>
                  )}
                  
                  <Bot className="w-4 h-4 lg:w-4.5 lg:h-4.5 transition-transform duration-200 group-hover/ai:scale-110" />
                  <span className="hidden lg:inline text-sm font-medium">
                    IA
                  </span>
                </Button>
              </motion.div>
              
              {/* Theme Toggle */}
              <motion.div
                whileHover={getAnimationProps({ scale: 1.05, y: -2 }, {})}
                whileTap={getAnimationProps({ scale: 0.95 }, {})}
              >
                <ThemeToggle />
              </motion.div>
              
              {/* Language Toggle */}
              <motion.div
                whileHover={getAnimationProps({ scale: 1.05, y: -2 }, {})}
                whileTap={getAnimationProps({ scale: 0.95 }, {})}
                className="relative"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="gap-1.5 lg:gap-2 px-2 lg:px-3 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background group/lang"
                  aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
                >
                  <Languages className="w-4 h-4 lg:w-4.5 lg:h-4.5 transition-transform duration-200 group-hover/lang:scale-110" />
                  <motion.span 
                    key={language}
                    initial={getAnimationProps({ scale: 0.8, opacity: 0 }, {})}
                    animate={getAnimationProps({ scale: 1, opacity: 1 }, {})}
                    transition={getAnimationProps({ type: "spring" }, {})}
                    className="hidden lg:inline text-sm font-medium whitespace-nowrap"
                  >
                    {language.toUpperCase()}
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu Button - Optimized for touch */}
          <div className="flex md:hidden items-center gap-0.5">
            {/* AI Assistant Button mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAiChatOpen(true)}
              className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-primary touch-manipulation active:scale-95 transition-transform"
              aria-label="Assistant IA"
            >
              <Bot className="w-4 h-4" />
            </Button>
            
            {/* Theme Toggle mobile */}
            <div className="touch-manipulation active:scale-95 transition-transform">
              <ThemeToggle />
            </div>
            
            {/* Language Toggle mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation active:scale-95 transition-transform"
              aria-label={`Changer la langue (actuelle: ${language.toUpperCase()})`}
            >
              <Languages className="w-4 h-4" />
            </Button>
            
            {/* Menu Button mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 w-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation active:scale-95 transition-transform"
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={getAnimationProps({ rotate: -90, opacity: 0, scale: 0.8 }, { opacity: 0 })}
                    animate={getAnimationProps({ rotate: 0, opacity: 1, scale: 1 }, { opacity: 1 })}
                    exit={getAnimationProps({ rotate: 90, opacity: 0, scale: 0.8 }, { opacity: 0 })}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={getAnimationProps({ rotate: 90, opacity: 0, scale: 0.8 }, { opacity: 0 })}
                    animate={getAnimationProps({ rotate: 0, opacity: 1, scale: 1 }, { opacity: 1 })}
                    exit={getAnimationProps({ rotate: -90, opacity: 0, scale: 0.8 }, { opacity: 0 })}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu - Simplified animations */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.2,
                height: { duration: 0.15 }
              }}
              className="md:hidden overflow-hidden theme-transition"
            >
              <div className="py-3 border-t border-border space-y-0.5">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.03,
                      type: "tween",
                      duration: 0.15
                    }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className="block px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-primary active:bg-primary/5 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] touch-manipulation"
                      activeClassName="text-primary bg-primary/10"
                      onClick={() => {
                        setIsOpen(false);
                        // Smooth scroll to top
                        requestAnimationFrame(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        });
                      }}
                    >
                      <span className="block transition-all duration-150">
                        {t(item.key)}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
                
                {/* Mobile action buttons */}
                <div className="pt-4 px-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Langue:' : 'Language:'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleLanguage}
                      className="h-8 px-3 text-xs font-medium touch-manipulation active:scale-95 transition-transform"
                    >
                      <Languages className="w-3 h-3 mr-1.5" />
                      {language === 'fr' ? 'Français' : 'English'} → {language === 'fr' ? 'English' : 'Français'}
                    </Button>
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
