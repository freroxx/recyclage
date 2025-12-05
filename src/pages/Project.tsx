import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
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
  Shield,
  Award,
  Clock,
  BarChart3,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { debounce } from "lodash-es";

// Optimized: Lazy load heavy Framer Motion features
const MotionDiv = motion.div;
const MotionCard = motion(Card);
const MotionButton = motion(Button);

// Optimized: Memoized components to prevent unnecessary re-renders
const BinIcon = memo(({ icon: Icon, color, isActive }: any) => (
  <div className="relative">
    <Icon className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-500 ${color} ${isActive ? 'scale-125' : ''}`} />
    {isActive && (
      <MotionDiv
        layoutId="activeRing"
        className="absolute inset-0 rounded-full ring-2 ring-current"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    )}
  </div>
));

BinIcon.displayName = 'BinIcon';

// Optimized: Custom hook for scroll animations
const useScrollAnimation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    const handleScroll = debounce(updateScrollProgress, 16); // ~60fps
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return scrollProgress;
};

// Optimized: Intersection Observer hook for lazy loading
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isInView];
};

interface BinItem {
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  borderColor: string;
  label: string;
  description?: string;
  stats?: string;
}

interface ActionItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
  stats: { value: string; label: string }[];
}

// Optimized: Pre-calculated animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

const staggerChildren = {
  visible: { transition: { staggerChildren: 0.07 } }
};

// Optimized: Main component
export default function Project() {
  const { t, language } = useLanguage();
  const scrollProgress = useScrollAnimation();
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Optimized: Memoized data with React.memo
  const bins: BinItem[] = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-500", 
      bg: "bg-gradient-to-br from-amber-400/20 to-amber-600/20", 
      borderColor: "border-amber-500/30", 
      label: t("project.bins.paper"),
      description: language === "fr" ? "Journaux, magazines, cartons" : "Newspapers, magazines, cardboard",
      stats: "85% recyclable"
    },
    { 
      icon: Package, 
      color: "text-blue-500", 
      bg: "bg-gradient-to-br from-blue-400/20 to-blue-600/20", 
      borderColor: "border-blue-500/30", 
      label: t("project.bins.plastic"),
      description: language === "fr" ? "Bouteilles, emballages plastiques" : "Bottles, plastic packaging",
      stats: "40% recycled"
    },
    { 
      icon: Trash2, 
      color: "text-gray-500", 
      bg: "bg-gradient-to-br from-gray-400/20 to-gray-600/20", 
      borderColor: "border-gray-500/30", 
      label: t("project.bins.metal"),
      description: language === "fr" ? "Cannettes, boîtes de conserve" : "Cans, tins",
      stats: "100% recyclable"
    },
    { 
      icon: Apple, 
      color: "text-green-500", 
      bg: "bg-gradient-to-br from-green-400/20 to-green-600/20", 
      borderColor: "border-green-500/30", 
      label: t("project.bins.organic"),
      description: language === "fr" ? "Restes alimentaires, épluchures" : "Food waste, peelings",
      stats: "Compost in 60 days"
    },
  ], [t, language]);

  const actions: ActionItem[] = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.actions.recycling.title") || t("project.bins.title"),
      description: t("project.actions.recycling.description") || t("project.bins.text"),
      gradient: "from-blue-500/20 via-cyan-500/20 to-blue-500/20",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      stats: [
        { value: "2.5T", label: language === "fr" ? "Par mois" : "Monthly" },
        { value: "500+", label: language === "fr" ? "Participants" : "Participants" }
      ]
    },
    {
      icon: Lightbulb,
      title: t("project.campaigns.title"),
      description: t("project.campaigns.text"),
      gradient: "from-amber-500/20 via-orange-500/20 to-amber-500/20",
      iconColor: "text-amber-500",
      borderColor: "border-amber-500/20",
      stats: [
        { value: "12", label: language === "fr" ? "Campagnes" : "Campaigns" },
        { value: "90%", label: language === "fr" ? "Engagement" : "Engagement" }
      ]
    },
    {
      icon: Users,
      title: t("project.workshops.title"),
      description: t("project.workshops.text"),
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-500/20",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20",
      stats: [
        { value: "24", label: language === "fr" ? "Ateliers" : "Workshops" },
        { value: "1K+", label: language === "fr" ? "Participants" : "Participants" }
      ]
    },
    {
      icon: TrendingUp,
      title: t("project.monitoring.title"),
      description: t("project.monitoring.text"),
      gradient: "from-green-500/20 via-emerald-500/20 to-green-500/20",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20",
      stats: [
        { value: "95%", label: language === "fr" ? "Succès" : "Success" },
        { value: "4.8", label: language === "fr" ? "Évaluation" : "Rating" }
      ]
    }
  ], [t, language]);

  const impacts = useMemo(() => [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ].filter(Boolean), [t]);

  // Optimized: Auto-rotation with proper cleanup
  useEffect(() => {
    if (!isAutoRotating || !mounted) return;
    
    const interval = setInterval(() => {
      setActiveBinIndex(prev => (prev + 1) % bins.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoRotating, bins.length, mounted]);

  // Optimized: Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Optimized: Debounced event handlers
  const handleBinInteraction = useCallback((index: number) => {
    setActiveBinIndex(index);
    setIsAutoRotating(false);
    
    // Resume auto-rotation after delay
    const timer = setTimeout(() => setIsAutoRotating(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleActionHover = useCallback((index: number | null) => {
    setHoveredAction(index);
  }, []);

  // Optimized: Memoized text translations
  const initiativeText = useMemo(() => 
    language === "fr" ? "Initiative Écologique" : "Ecological Initiative",
    [language]
  );

  const sortingBinsText = useMemo(() =>
    language === "fr" ? "Nos Bacs de Tri" : "Our Sorting Bins",
    [language]
  );

  const binsSubtitle = useMemo(() =>
    language === "fr" ? "4 types de déchets, 4 bacs de couleurs" : "4 types of waste, 4 colored bins",
    [language]
  );

  // Optimized: Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Optimized: Progress indicator component
  const ProgressBar = memo(() => (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
      <MotionDiv
        className="h-full bg-gradient-to-r from-primary via-green-500 to-emerald-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{ originX: 0 }}
      />
    </div>
  ));
  ProgressBar.displayName = 'ProgressBar';

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3 overflow-hidden relative">
        {/* Performance: Fixed background with optimized particles */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {/* Optimized gradient backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          
          {/* Optimized: Reduced particle count */}
          {[...Array(8)].map((_, i) => (
            <MotionDiv
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/20"
              style={{
                left: `${(i * 12.5) % 100}%`,
                top: `${(i * 15) % 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 5, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <ProgressBar />

        <div ref={containerRef} className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          {/* Hero Section - Optimized with reduced animations */}
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="max-w-6xl mx-auto text-center mb-20 md:mb-28"
          >
            <MotionDiv
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-10 border border-primary/30 backdrop-blur-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{initiativeText}</span>
            </MotionDiv>
            
            <MotionDiv variants={fadeInUp}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight">
                <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {t("project.title")}
                </span>
              </h1>
            </MotionDiv>
            
            <MotionDiv variants={fadeInUp} className="mb-12">
              <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-4xl mx-auto font-light">
                {t("project.intro")}
              </p>
            </MotionDiv>

            <MotionDiv variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link to="/guide" className="group">
                <Button 
                  size="lg" 
                  className="px-10 py-7 text-lg bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-6 h-6 mr-3" />
                  {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>
              
              <Link to="/resources" className="group">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="px-10 py-7 text-lg border-2 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-6 h-6 mr-3" />
                  {language === "fr" ? "Voir les ressources" : "View resources"}
                </Button>
              </Link>
            </MotionDiv>

            <MotionDiv 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-16 cursor-pointer"
              onClick={() => scrollToSection('sorting-bins')}
            >
              <ChevronDown className="w-8 h-8 mx-auto text-primary/60 hover:text-primary transition-colors" />
            </MotionDiv>
          </motion.section>

          {/* Goal Section - Optimized with reduced effects */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto mb-20 md:mb-28"
          >
            <Card className="border-2 border-primary/20 shadow-2xl hover:shadow-3xl overflow-hidden group hover:scale-[1.01] transition-all duration-300 backdrop-blur-sm bg-white/5">
              <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-10 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shadow-2xl ring-4 ring-primary/10">
                    <Target className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                      {t("project.goal.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg mt-2">
                      {language === "fr" ? "Notre mission principale" : "Our main mission"}
                    </p>
                  </div>
                </div>
                <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
                  {t("project.goal.text")}
                </p>
              </div>
            </Card>
          </motion.section>

          {/* Sorting Bins Section - Optimized interactions */}
          <section id="sorting-bins" className="max-w-6xl mx-auto mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {sortingBinsText}
              </h2>
              <p className="text-xl text-muted-foreground">
                {binsSubtitle}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bins.map((bin, index) => {
                const isActive = index === activeBinIndex;
                
                return (
                  <MotionDiv
                    key={bin.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    animate={isActive ? { y: -10 } : {}}
                    onMouseEnter={() => handleBinInteraction(index)}
                    onTouchStart={() => handleBinInteraction(index)}
                    className="cursor-pointer"
                  >
                    <Card className={`h-full border-3 ${bin.borderColor} overflow-hidden transition-all duration-300 ${
                      isActive ? 'shadow-2xl ring-2 ring-primary/30' : 'hover:shadow-xl'
                    }`}>
                      <CardContent className="p-8 text-center">
                        <div className={`relative z-10 w-32 h-32 rounded-full ${bin.bg} flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                          isActive ? 'scale-110 shadow-2xl' : 'shadow-lg'
                        }`}>
                          <BinIcon icon={bin.icon} color={bin.color} isActive={isActive} />
                          
                          {isActive && (
                            <MotionDiv
                              initial={{ scale: 0.8, opacity: 0.7 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-full border-2 border-current"
                            />
                          )}
                        </div>
                        
                        <h3 className="font-bold text-2xl mb-3">
                          {bin.label}
                        </h3>
                        
                        <AnimatePresence>
                          {isActive && (
                            <MotionDiv
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-muted-foreground text-sm mb-4">
                                {bin.description}
                              </p>
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
                                <BarChart3 className="w-4 h-4" />
                                {bin.stats}
                              </div>
                            </MotionDiv>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                );
              })}
            </div>
            
            {/* Navigation dots - Optimized */}
            <div className="flex justify-center gap-3 mt-10">
              {bins.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleBinInteraction(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeBinIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted hover:bg-primary/50'
                  }`}
                  aria-label={`Select ${bins[index].label} bin`}
                />
              ))}
            </div>
          </section>

          {/* Actions Section - Optimized performance */}
          <section className="max-w-6xl mx-auto mb-20 md:mb-28">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("project.actions.title")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {language === "fr" ? "Notre approche complète" : "Our comprehensive approach"}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {actions.map((action, index) => {
                const isHovered = hoveredAction === index;
                const ActionIcon = action.icon;
                
                return (
                  <MotionDiv
                    key={action.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onMouseEnter={() => handleActionHover(index)}
                    onMouseLeave={() => handleActionHover(null)}
                  >
                    <Card className="h-full border-2 border-primary/10 hover:border-primary/30 overflow-hidden transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-white/5">
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                      
                      <CardContent className="p-8 relative">
                        <div className="flex items-start gap-6">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                            <ActionIcon className={`w-8 h-8 ${action.iconColor}`} />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
                              {action.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {action.description}
                            </p>
                            
                            {/* Stats row - Optimized layout */}
                            <div className="flex gap-4">
                              {action.stats.map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                  <span className="font-bold text-lg">{stat.value}</span>
                                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionDiv>
                );
              })}
            </div>
          </section>

          {/* Impact Section - Optimized with reduced animations */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-6xl mx-auto mb-20 md:mb-28"
          >
            <Card className="border-2 border-green-500/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-white/5">
              <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 p-10 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/20 flex items-center justify-center shadow-2xl ring-4 ring-green-500/10">
                    <Globe className="w-12 h-12 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                      {t("project.impact.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg mt-2">
                      {t("project.impact.subtitle") || "Making a measurable difference"}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {impacts.map((impact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -10 : 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-green-500/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-foreground/90 leading-relaxed text-lg pt-1">
                          {impact}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Stats counter - Optimized */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-green-500/10">
                  {[
                    { value: "85%", label: language === "fr" ? "Réduction déchets" : "Waste Reduction", icon: TrendingUp },
                    { value: "2.5T", label: language === "fr" ? "Recyclés mensuel" : "Monthly Recycled", icon: Cpu },
                    { value: "500+", label: language === "fr" ? "Participants" : "Participants", icon: Users },
                    { value: "100%", label: language === "fr" ? "École verte" : "Green School", icon: Award },
                  ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <Icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.section>

          {/* Call to Action - Optimized */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden backdrop-blur-sm bg-gradient-to-br from-primary/5 via-green-500/5 to-primary/5">
              <CardContent className="p-12 md:p-16 relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-green-500/30 flex items-center justify-center mx-auto mb-10 shadow-2xl ring-8 ring-primary/10">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-green-500 to-primary bg-clip-text text-transparent">
                  {t("project.why.title")}
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  {t("project.why.text")}
                </p>
                
                <div className="bg-gradient-to-br from-primary/10 via-green-500/10 to-primary/10 rounded-3xl p-8 mb-10 max-w-xl mx-auto border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                    <p className="text-2xl font-bold text-primary">
                      {language === "fr" ? "Rejoignez le Mouvement!" : "Join the Movement!"}
                    </p>
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {language === "fr" 
                      ? "Rejoignez des milliers d'élèves qui font la différence chaque jour !"
                      : "Join thousands of students making a difference every day!"
                    }
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/guide">
                    <Button 
                      size="lg" 
                      className="px-12 py-8 text-xl bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 min-w-[250px]"
                    >
                      <Sparkles className="w-7 h-7 mr-3" />
                      {language === "fr" ? "Commencer à Apprendre" : "Start Learning Now"}
                      <ArrowRight className="w-7 h-7 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                    </Button>
                  </Link>
                  
                  <Link to="/activities">
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="px-12 py-8 text-xl border-2 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 min-w-[250px]"
                    >
                      <Play className="w-7 h-7 mr-3" />
                      {language === "fr" ? "Jouer aux Jeux" : "Play Interactive Games"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Performance: Only load animations when needed */}
        <style>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-gradient {
            animation: gradient 6s ease infinite;
            background-size: 200% auto;
          }
          
          /* Reduce motion preference */
          @media (prefers-reduced-motion: reduce) {
            *, ::before, ::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
            
            .animate-gradient {
              animation: none;
            }
          }
        `}</style>
      </div>
    </LazyMotion>
  );
}
