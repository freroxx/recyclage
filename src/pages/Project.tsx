import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Trash2, 
  FileText, 
  Apple, 
  Package, 
  Target, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Leaf, 
  Recycle, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  ExternalLink,
  ChevronDown,
  Globe,
  Zap,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return scrollY;
};

// Enhanced scroll reveal hook
const useEnhancedScrollReveal = () => {
  const refs = useRef<HTMLElement[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in-view');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => observer.disconnect();
  }, []);
  
  return (el: HTMLElement | null) => {
    if (el && !refs.current.includes(el)) {
      refs.current.push(el);
    }
  };
};

interface BinItem {
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  borderColor: string;
  label: string;
  description?: string;
}

interface ActionItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
  delay: number;
}

// Animation variants for Framer Motion
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Project() {
  const { t, language } = useLanguage();
  const scrollY = useScrollAnimation();
  const registerScrollRef = useEnhancedScrollReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Enhanced bins data with descriptions
  const bins: BinItem[] = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-500", 
      bg: "bg-gradient-to-br from-amber-400/20 to-amber-600/20", 
      borderColor: "border-amber-500/30", 
      label: t("project.bins.paper"),
      description: language === "fr" ? "Journaux, magazines, cartons" : "Newspapers, magazines, cardboard"
    },
    { 
      icon: Package, 
      color: "text-blue-500", 
      bg: "bg-gradient-to-br from-blue-400/20 to-blue-600/20", 
      borderColor: "border-blue-500/30", 
      label: t("project.bins.plastic"),
      description: language === "fr" ? "Bouteilles, emballages plastiques" : "Bottles, plastic packaging"
    },
    { 
      icon: Trash2, 
      color: "text-gray-500", 
      bg: "bg-gradient-to-br from-gray-400/20 to-gray-600/20", 
      borderColor: "border-gray-500/30", 
      label: t("project.bins.metal"),
      description: language === "fr" ? "Cannettes, boîtes de conserve" : "Cans, tins"
    },
    { 
      icon: Apple, 
      color: "text-green-500", 
      bg: "bg-gradient-to-br from-green-400/20 to-green-600/20", 
      borderColor: "border-green-500/30", 
      label: t("project.bins.organic"),
      description: language === "fr" ? "Restes alimentaires, épluchures" : "Food waste, peelings"
    },
  ], [t, language]);

  // Enhanced actions with staggered delays
  const actions: ActionItem[] = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.actions.recycling.title") || t("project.bins.title"),
      description: t("project.actions.recycling.description") || t("project.bins.text"),
      gradient: "from-blue-500/20 via-cyan-500/20 to-blue-500/20",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      delay: 0
    },
    {
      icon: Lightbulb,
      title: t("project.campaigns.title"),
      description: t("project.campaigns.text"),
      gradient: "from-amber-500/20 via-orange-500/20 to-amber-500/20",
      iconColor: "text-amber-500",
      borderColor: "border-amber-500/20",
      delay: 100
    },
    {
      icon: Users,
      title: t("project.workshops.title"),
      description: t("project.workshops.text"),
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-500/20",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20",
      delay: 200
    },
    {
      icon: TrendingUp,
      title: t("project.monitoring.title"),
      description: t("project.monitoring.text"),
      gradient: "from-green-500/20 via-emerald-500/20 to-green-500/20",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20",
      delay: 300
    }
  ], [t]);

  const impacts: string[] = useMemo(() => [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ].filter(Boolean), [t]);

  // Enhanced auto-rotation with pause on hover
  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % bins.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isAutoRotating, bins.length]);

  // Parallax effect for background elements
  const parallaxStyle = useMemo(() => ({
    transform: `translateY(${scrollY * 0.05}px)`
  }), [scrollY]);

  // Event handlers
  const handleBinInteraction = useCallback((index: number) => {
    setActiveIndex(index);
    setIsAutoRotating(false);
    
    // Resume auto-rotation after 5 seconds of inactivity
    setTimeout(() => {
      setIsAutoRotating(true);
    }, 5000);
  }, []);

  const handleActionHover = useCallback((index: number | null) => {
    setHoveredAction(index);
  }, []);

  // Fallback translations
  const getText = useCallback((key: string, fallbackEN: string, fallbackFR: string) => {
    const text = t(key);
    return text !== key ? text : (language === "fr" ? fallbackFR : fallbackEN);
  }, [t, language]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden relative"
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 11) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
        
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          style={parallaxStyle}
        />
        
        <motion.div 
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          style={{ ...parallaxStyle, transform: `translateY(${scrollY * 0.03}px)` }}
        />
        
        <motion.div 
          className="absolute bottom-40 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          style={{ ...parallaxStyle, transform: `translateY(${scrollY * 0.07}px)` }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Hero Section */}
        <motion.section 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-6xl mx-auto text-center mb-20 md:mb-32"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-10 border border-primary/30 backdrop-blur-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{getText("project.initiative", "Ecological Initiative", "Initiative Écologique")}</span>
            <Zap className="w-4 h-4 ml-2 animate-ping" />
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight"
          >
            <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {t("project.title")}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-4xl mx-auto mb-12 font-light"
          >
            {t("project.intro")}
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Link to="/guide" className="group">
              <Button 
                size="lg" 
                className="px-10 py-7 text-lg bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 active:scale-95 group-hover:shadow-primary/30"
              >
                <Play className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                {getText("project.discover", "Discover the project", "Découvrir le projet")}
                <ArrowRight className="w-6 h-6 ml-3 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110" />
              </Button>
            </Link>
            
            <Link to="/resources" className="group">
              <Button 
                variant="outline"
                size="lg" 
                className="px-10 py-7 text-lg border-2 hover:bg-primary/10 backdrop-blur-sm transition-all duration-500 hover:scale-105 active:scale-95 group-hover:border-primary/50"
              >
                <ExternalLink className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-500" />
                {getText("project.resources", "View resources", "Voir les ressources")}
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-20 cursor-pointer"
            onClick={() => {
              containerRef.current?.scrollBy({ top: 600, behavior: 'smooth' });
            }}
          >
            <ChevronDown className="w-8 h-8 mx-auto text-primary/60 hover:text-primary transition-colors" />
          </motion.div>
        </motion.section>

        {/* Goal Section with 3D effect */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mb-20 md:mb-32 perspective-1000"
        >
          <div className="hover:translate-z-10 transition-transform duration-700">
            <Card className="border-2 border-primary/20 shadow-2xl hover:shadow-3xl overflow-hidden group hover:scale-[1.01] transition-all duration-500 backdrop-blur-sm bg-white/5">
              <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-10 md:p-12 relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--primary)_1px,transparent_1px)] bg-[length:40px_40px]" />
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8 relative">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-2xl ring-4 ring-primary/10"
                  >
                    <Target className="w-12 h-12 text-primary" />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                      {t("project.goal.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg mt-2">
                      {getText("project.mission", "Our main mission", "Notre mission principale")}
                    </p>
                  </div>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl leading-relaxed text-foreground/90 relative z-10"
                >
                  {t("project.goal.text")}
                </motion.p>
                
                {/* Progress indicator */}
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-1 bg-gradient-to-r from-primary via-green-500 to-primary mt-8 rounded-full"
                />
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Sorting Bins - Enhanced */}
        <section className="max-w-6xl mx-auto mb-20 md:mb-32">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {getText("project.bins.title", "Smart Sorting System", "Système de Tri Intelligent")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              {getText("project.bins.subtitle", "Interactive waste categorization", "Catégorisation interactive des déchets")}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="wait">
              {bins.map((bin, index) => {
                const BinIcon = bin.icon;
                const isActive = index === activeIndex;
                
                return (
                  <motion.div
                    key={bin.label}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    animate={isActive ? { scale: 1.05, y: -10 } : {}}
                    onMouseEnter={() => handleBinInteraction(index)}
                    onTouchStart={() => handleBinInteraction(index)}
                    className="cursor-pointer"
                  >
                    <Card 
                      className={`h-full border-3 ${bin.borderColor} overflow-hidden transition-all duration-500 ${
                        isActive 
                          ? 'shadow-2xl ring-2 ring-offset-2 ring-primary/50' 
                          : 'hover:shadow-xl'
                      }`}
                    >
                      <CardContent className="p-8 text-center relative">
                        {/* Animated background */}
                        <div className={`absolute inset-0 ${bin.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Icon container */}
                        <motion.div 
                          animate={isActive ? floatAnimation.animate : {}}
                          className={`relative z-10 w-32 h-32 rounded-full ${bin.bg} flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
                            isActive ? 'scale-110 shadow-2xl' : 'shadow-lg'
                          }`}
                        >
                          <BinIcon className={`w-16 h-16 ${bin.color} transition-all duration-500 ${
                            isActive ? 'scale-125' : ''
                          }`} />
                          
                          {/* Pulse ring when active */}
                          {isActive && (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0.7 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-full border-2 border-current"
                            />
                          )}
                        </motion.div>
                        
                        <h3 className="font-bold text-2xl mb-3 relative z-10">
                          {bin.label}
                        </h3>
                        
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: isActive ? 1 : 0,
                            height: isActive ? 'auto' : 0
                          }}
                          className="text-muted-foreground text-sm mb-4 overflow-hidden"
                        >
                          {bin.description}
                        </motion.p>
                        
                        {/* Progress indicator */}
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: isActive ? '100%' : '0%' }}
                            transition={{ duration: 3 }}
                            className={`absolute inset-y-0 left-0 ${bin.bg.replace('bg-', 'bg-').split('/')[0]}`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center gap-3 mt-10">
            {bins.map((_, index) => (
              <button
                key={index}
                onClick={() => handleBinInteraction(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Select ${bins[index].label} bin`}
              />
            ))}
          </div>
        </section>

        {/* Enhanced Actions Section */}
        <section className="max-w-6xl mx-auto mb-20 md:mb-32">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {t("project.actions.title")}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              {getText("project.actions.subtitle", "Our comprehensive approach", "Notre approche complète")}
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              const isHovered = hoveredAction === index;
              
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onMouseEnter={() => handleActionHover(index)}
                  onMouseLeave={() => handleActionHover(null)}
                  className="relative"
                >
                  <Card 
                    className={`h-full border-2 ${action.borderColor} overflow-hidden transition-all duration-500 hover:shadow-2xl backdrop-blur-sm`}
                  >
                    {/* Animated gradient background */}
                    <motion.div 
                      animate={isHovered ? {
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`absolute inset-0 bg-gradient-to-r ${action.gradient} bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    
                    <CardContent className="p-8 relative">
                      <div className="flex items-start gap-6">
                        {/* Icon with glow effect */}
                        <motion.div 
                          animate={isHovered ? { rotate: 360 } : {}}
                          transition={{ duration: 0.8 }}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500`}
                        >
                          <ActionIcon className={`w-10 h-10 ${action.iconColor}`} />
                          
                          {/* Glow effect */}
                          {isHovered && (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1.2, opacity: 0 }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="absolute inset-0 rounded-3xl bg-current blur-xl"
                            />
                          )}
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
                            {action.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Animated arrow */}
                      <motion.div 
                        animate={isHovered ? { x: 10 } : { x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <ArrowRight className={`w-6 h-6 ${action.iconColor}`} />
                      </motion.div>
                      
                      {/* Progress line */}
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, delay: 0.5 + index * 0.1 }}
                        className={`h-1 ${action.borderColor.replace('border-', 'bg-').split('/')[0]}/20 rounded-full mt-6`}
                      />
                    </CardContent>
                  </Card>
                  
                  {/* Floating badge */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute -top-3 -right-3"
                  >
                    <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center shadow-lg`}>
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Enhanced Impact Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto mb-20 md:mb-32"
        >
          <Card className="border-2 border-green-500/30 shadow-2xl hover:shadow-3xl overflow-hidden group hover:scale-[1.005] transition-all duration-500 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 p-10 md:p-12 relative overflow-hidden">
              {/* Animated leaves */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${(i * 7) % 100}%`,
                      top: `${(i * 5) % 100}%`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Leaf className="w-8 h-8 text-green-500" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 relative z-10">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center shadow-2xl ring-4 ring-green-500/10"
                >
                  <Globe className="w-14 h-14 text-green-600" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                    {t("project.impact.title")}
                  </h2>
                  <p className="text-muted-foreground text-lg mt-2">
                    {t("project.impact.subtitle") || "Making a measurable difference"}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                {impacts.map((impact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-green-500/10 transition-all duration-300 group/impact"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover/impact:shadow-lg transition-all duration-300"
                      >
                        <Shield className="w-6 h-6 text-green-600" />
                      </motion.div>
                      <p className="text-foreground/90 leading-relaxed text-lg pt-1">
                        {impact}
                      </p>
                    </div>
                    
                    {/* Progress bar */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5 + index * 0.1 }}
                      className="h-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full mt-4"
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Stats counter */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-green-500/10"
              >
                {[
                  { value: "85%", label: language === "fr" ? "Réduction déchets" : "Waste Reduction" },
                  { value: "2.5T", label: language === "fr" ? "Recyclés mensuel" : "Monthly Recycled" },
                  { value: "500+", label: language === "fr" ? "Participants" : "Participants" },
                  { value: "100%", label: language === "fr" ? "École verte" : "Green School" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: index * 0.1 }}
                      className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Card>
        </motion.section>

        {/* Enhanced Call to Action */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="border-2 border-primary/30 shadow-3xl overflow-hidden group hover:shadow-4xl transition-all duration-500 backdrop-blur-sm bg-gradient-to-br from-primary/5 via-green-500/5 to-primary/5">
            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/20"
                  style={{
                    left: `${(i * 3) % 100}%`,
                    top: `${(i * 4) % 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            
            <CardContent className="p-12 md:p-16 relative">
              <motion.div 
                animate={floatAnimation.animate}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-green-500/30 flex items-center justify-center mx-auto mb-10 shadow-2xl ring-8 ring-primary/10"
              >
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-green-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                {t("project.why.title")}
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                {t("project.why.text")}
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary/10 via-green-500/10 to-primary/10 rounded-3xl p-8 mb-10 max-w-xl mx-auto border border-primary/20 backdrop-blur-sm"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  <p className="text-2xl font-bold text-primary">
                    {getText("project.why.join", "Join the Movement!", "Rejoignez le Mouvement!")}
                  </p>
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {getText("project.why.invite", 
                    "Join thousands of students making a difference every day!",
                    "Rejoignez des milliers d'élèves qui font la différence chaque jour !"
                  )}
                </p>
              </motion.div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/guide" className="group">
                  <Button 
                    size="lg" 
                    className="px-12 py-8 text-xl bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 active:scale-95 group-hover:shadow-primary/30 min-w-[250px]"
                  >
                    <Sparkles className="w-7 h-7 mr-3 group-hover:rotate-180 transition-transform duration-700" />
                    {getText("project.startLearning", "Start Learning Now", "Commencer à Apprendre")}
                    <ArrowRight className="w-7 h-7 ml-3 transition-all duration-500 group-hover:translate-x-2 group-hover:scale-110" />
                  </Button>
                </Link>
                
                <Link to="/activities" className="group">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="px-12 py-8 text-xl border-3 hover:bg-primary/10 backdrop-blur-sm transition-all duration-500 hover:scale-105 active:scale-95 group-hover:border-primary/50 min-w-[250px]"
                  >
                    <Play className="w-7 h-7 mr-3 group-hover:scale-125 transition-transform duration-500" />
                    {getText("project.playGames", "Play Interactive Games", "Jouer aux Jeux")}
                  </Button>
                </Link>
              </div>
              
              {/* Animated separator */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
                className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mt-12 rounded-full"
              />
            </CardContent>
          </Card>
        </motion.section>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .hover\:translate-z-10:hover {
          transform: translateZ(10px);
        }
        
        .animate-in-view {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
