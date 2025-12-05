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
  Shield,
  Award,
  BarChart3,
  Cpu,
  Zap,
  Clock,
  Heart,
  TreePine,
  Battery,
  Truck,
  Star,
  Cloud,
  Droplets,
  Factory,
  Compass,
  Gem,
  Rocket,
  Target as TargetIcon
} from "lucide-react";

// Performance optimization: Lazy load framer-motion only when needed
const useLazyFramerMotion = () => {
  const [motionComponents, setMotionComponents] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadFramerMotion = async () => {
      try {
        const [motion, AnimatePresence, useScroll, useTransform] = await Promise.all([
          import('framer-motion').then(mod => mod.motion),
          import('framer-motion').then(mod => mod.AnimatePresence),
          import('framer-motion').then(mod => mod.useScroll),
          import('framer-motion').then(mod => mod.useTransform)
        ]);
        setMotionComponents({ motion, AnimatePresence, useScroll, useTransform });
      } catch (err) {
        console.warn('Framer Motion failed to load, falling back to CSS animations');
        setError(true);
      }
    };

    // Load on interaction
    const handleInteraction = () => {
      loadFramerMotion();
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('scroll', handleInteraction, { passive: true, once: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true, once: true });
    window.addEventListener('click', handleInteraction, { once: true });

    const timeout = setTimeout(loadFramerMotion, 1500);
    
    return () => clearTimeout(timeout);
  }, []);

  return { ...motionComponents, error };
};

// Custom optimized scroll hook
const useOptimizedScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const rafId = useRef<number>();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return scrollY;
};

// Particle Background Component
const ParticleBackground = memo(() => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, speed: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 25 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.5 + 0.2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    
    const handleResize = () => generateParticles();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={particlesRef}
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-emerald-50/20 to-purple-50/30" />
      
      {/* Animated Gradients */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-green-500/10 to-transparent animate-pulse-slow delay-1000" />
      
      {/* Floating Particles */}
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-primary/20 to-green-500/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${3/particle.speed}s infinite ease-in-out alternate`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      
      {/* Floating Shapes */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/10 to-cyan-200/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-gradient-to-r from-emerald-200/10 to-green-200/10 rounded-full blur-3xl animate-float-slow delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-float-slow delay-500" />
    </div>
  );
});

ParticleBackground.displayName = 'ParticleBackground';

// Floating Element Component
const FloatingElement = memo(({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  return (
    <div 
      className="relative group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-green-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative transform transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
        {children}
      </div>
    </div>
  );
});

FloatingElement.displayName = 'FloatingElement';

// Memoized components
const BinCard = memo(({ 
  bin, 
  index, 
  isActive, 
  onMouseEnter, 
  onTouchStart 
}: {
  bin: any;
  index: number;
  isActive: boolean;
  onMouseEnter: (index: number) => void;
  onTouchStart: (index: number) => void;
}) => {
  const BinIcon = bin.icon;
  
  return (
    <FloatingElement delay={index * 100}>
      <div
        className={`cursor-pointer transition-all duration-500 ${
          isActive ? 'transform -translate-y-3' : ''
        }`}
        onMouseEnter={() => onMouseEnter(index)}
        onTouchStart={() => onTouchStart(index)}
        role="button"
        tabIndex={0}
        aria-label={`Select ${bin.label} bin`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onMouseEnter(index);
            e.preventDefault();
          }
        }}
      >
        <Card className={`h-full border-2 ${bin.borderColor} overflow-hidden transition-all duration-500 group ${
          isActive ? 'shadow-2xl ring-4 ring-primary/30' : 'hover:shadow-xl'
        }`}>
          <CardContent className="p-6 text-center">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${bin.bg} flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 ${
              isActive ? 'scale-110 ring-4 ring-white/50' : ''
            }`}>
              <BinIcon className={`w-10 h-10 md:w-12 md:h-12 ${bin.color} transition-transform duration-300 group-hover:scale-110`} />
            </div>
            <h3 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-primary">
              {bin.label}
            </h3>
            <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
              {bin.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </FloatingElement>
  );
});

BinCard.displayName = 'BinCard';

const ActionCard = memo(({ 
  action, 
  index, 
  onHover 
}: {
  action: any;
  index: number;
  onHover: (index: number | null) => void;
}) => {
  const ActionIcon = action.icon;
  
  return (
    <FloatingElement delay={index * 100}>
      <div
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        className="h-full group"
      >
        <Card className="h-full border hover:border-primary/30 transition-all duration-500 hover:shadow-2xl overflow-hidden">
          <CardContent className="p-6 relative">
            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                  <ActionIcon className={`w-6 h-6 ${action.color} transition-transform duration-300 group-hover:scale-110`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 transition-colors duration-300 group-hover:text-primary">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
                    {action.description}
                  </p>
                </div>
              </div>
              {action.stats && (
                <div className="flex gap-3 pt-4 border-t border-border/50 group-hover:border-primary/20 transition-colors duration-300">
                  {action.stats.map((stat: any, i: number) => (
                    <div key={i} className="text-center flex-1">
                      <div className="font-bold text-primary transition-all duration-300 group-hover:scale-105">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FloatingElement>
  );
});

ActionCard.displayName = 'ActionCard';

// Progress Bar Component
const ProgressBar = memo(() => {
  const [width, setWidth] = useState('0%');
  
  useEffect(() => {
    const calculateProgress = () => {
      if (typeof window === 'undefined') return '0%';
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      
      return `${Math.min(scrolled, 100)}%`;
    };
    
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setWidth(calculateProgress());
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-primary via-green-500 to-emerald-600 transition-all duration-300 ease-out shadow-lg"
        style={{ width }}
        aria-hidden="true"
      />
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

// Main component
export default function Project() {
  const { t, language } = useLanguage();
  const scrollY = useOptimizedScroll();
  const { motion, AnimatePresence, error: framerMotionError } = useLazyFramerMotion();
  
  // State management
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  
  // Refs for cleanup
  const mountedRef = useRef(true);
  const touchStartRef = useRef(0);

  // Memoized data
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-50 to-amber-100", 
      borderColor: "border-amber-300", 
      label: t("project.bins.paper"),
      description: language === "fr" ? "Papier, carton, journaux" : "Paper, cardboard, newspapers"
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-50 to-blue-100", 
      borderColor: "border-blue-300", 
      label: t("project.bins.plastic"),
      description: language === "fr" ? "Plastiques recyclables" : "Recyclable plastics"
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-50 to-gray-100", 
      borderColor: "border-gray-300", 
      label: t("project.bins.metal"),
      description: language === "fr" ? "Métaux et cannettes" : "Metals and cans"
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-50 to-green-100", 
      borderColor: "border-green-300", 
      label: t("project.bins.organic"),
      description: language === "fr" ? "Déchets organiques" : "Organic waste"
    },
  ], [t, language]);

  const actions = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.actions.recycling.title") || t("project.bins.title"),
      description: t("project.actions.recycling.description") || t("project.bins.text"),
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      stats: [
        { value: "100%", label: language === "fr" ? "Collecte" : "Collection" },
        { value: "95%", label: language === "fr" ? "Tri" : "Sorting" }
      ]
    },
    {
      icon: Lightbulb,
      title: t("project.campaigns.title"),
      description: t("project.campaigns.text"),
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-50 to-amber-100",
      stats: [
        { value: "500+", label: language === "fr" ? "Participants" : "Participants" },
        { value: "98%", label: language === "fr" ? "Satisfaction" : "Satisfaction" }
      ]
    },
    {
      icon: Users,
      title: t("project.workshops.title"),
      description: t("project.workshops.text"),
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      stats: [
        { value: "50+", label: language === "fr" ? "Ateliers" : "Workshops" },
        { value: "1000+", label: language === "fr" ? "Apprenants" : "Learners" }
      ]
    },
    {
      icon: TrendingUp,
      title: t("project.monitoring.title"),
      description: t("project.monitoring.text"),
      color: "text-emerald-600",
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      stats: [
        { value: "75%", label: language === "fr" ? "Réduction déchets" : "Waste Reduction" },
        { value: "60%", label: language === "fr" ? "Recyclage" : "Recycling Rate" }
      ]
    }
  ], [t, language]);

  const impacts = useMemo(() => [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ].filter(Boolean), [t]);

  // Auto-rotation with cleanup
  useEffect(() => {
    mountedRef.current = true;
    
    const rotateBins = () => {
      if (mountedRef.current && isAutoRotating && !hasInteracted) {
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      }
    };

    if (autoRotationInterval.current) {
      clearInterval(autoRotationInterval.current);
    }

    autoRotationInterval.current = setInterval(rotateBins, 3000);

    return () => {
      mountedRef.current = false;
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, hasInteracted, bins.length]);

  // Handle bin interaction
  const handleBinInteraction = useCallback((index: number) => {
    setActiveBinIndex(index);
    setIsAutoRotating(false);
    setHasInteracted(true);

    const timeout = setTimeout(() => {
      if (mountedRef.current) {
        setIsAutoRotating(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  // Handle touch start for mobile
  const handleTouchStart = useCallback((index: number) => {
    touchStartRef.current = Date.now();
    handleBinInteraction(index);
  }, [handleBinInteraction]);

  // Handle action hover
  const handleActionHover = useCallback((index: number | null) => {
    setHoveredAction(index);
  }, []);

  // Safe text translations
  const getText = useCallback((key: string, fallbackEN: string, fallbackFR: string) => {
    const text = t(key);
    return text && text !== key ? text : (language === "fr" ? fallbackFR : fallbackEN);
  }, [t, language]);

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === 'undefined') return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Use motion components if available
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';
  const MotionH1 = motion?.h1 || 'h1';
  const MotionP = motion?.p || 'p';
  const MotionButton = motion?.button || 'button';

  // Render fallback if framer-motion fails
  if (framerMotionError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <ProgressBar />
        <ParticleBackground />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">{t("project.title")}</h1>
            <p className="text-lg text-muted-foreground mb-8">{t("project.intro")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <ProgressBar />
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section with Scroll Animation */}
        <MotionSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center mb-20 md:mb-32"
        >
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-green-500/20 text-primary px-6 py-3 rounded-full text-sm font-medium mb-10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{getText("project.initiative", "Ecological Initiative", "Initiative Écologique")}</span>
            <Sparkles className="w-4 h-4 animate-pulse delay-300" />
          </MotionDiv>
          
          <MotionH1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10"
          >
            <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-600 bg-clip-text text-transparent animate-gradient bg-300%">
              {t("project.title")}
            </span>
          </MotionH1>
          
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12"
          >
            {t("project.intro")}
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to="/guide" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-10 py-7 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90"
              >
                <Play className="w-5 h-5 mr-3 animate-bounce-slow" />
                {getText("project.discover", "Discover the project", "Découvrir le projet")}
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            
            <Link to="/resources" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                size="lg" 
                className="w-full sm:w-auto px-10 py-7 text-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 transform hover:-translate-y-1"
              >
                <ExternalLink className="w-5 h-5 mr-3" />
                {getText("project.resources", "View resources", "Voir les ressources")}
              </Button>
            </Link>
          </MotionDiv>

          <MotionButton
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            onClick={() => scrollToSection('goal-section')}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary/20 to-green-500/20 hover:from-primary/30 hover:to-green-500/30 transition-all duration-500 border border-primary/20 backdrop-blur-sm"
            aria-label={language === "fr" ? "Défiler vers le bas" : "Scroll down"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
          </MotionButton>
        </MotionSection>

        {/* Goal Section with Scroll Animation */}
        <MotionSection
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          id="goal-section"
          className="max-w-5xl mx-auto mb-20 md:mb-32"
        >
          <FloatingElement>
            <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden bg-gradient-to-br from-background to-primary/5 backdrop-blur-sm">
              <div className="p-10 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                  <MotionDiv
                    initial={{ rotate: -180, scale: 0 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-green-500/20 flex items-center justify-center flex-shrink-0 border border-primary/20"
                  >
                    <TargetIcon className="w-10 h-10 text-primary" />
                  </MotionDiv>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                      {t("project.goal.title")}
                    </h2>
                    <p className="text-lg text-muted-foreground mt-3">
                      {getText("project.mission", "Our main mission", "Notre mission principale")}
                    </p>
                  </div>
                </div>
                <p className="text-xl text-foreground/90 leading-relaxed text-center md:text-left">
                  {t("project.goal.text")}
                </p>
              </div>
            </Card>
          </FloatingElement>
        </MotionSection>

        {/* Sorting Bins Section with Stagger Animation */}
        <section className="max-w-6xl mx-auto mb-20 md:mb-32">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {getText("project.bins.title", "Sorting System", "Système de Tri")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {getText("project.bins.subtitle", "Proper waste categorization", "Catégorisation des déchets")}
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {bins.map((bin, index) => (
              <MotionDiv
                key={bin.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BinCard
                  bin={bin}
                  index={index}
                  isActive={activeBinIndex === index}
                  onMouseEnter={handleBinInteraction}
                  onTouchStart={handleTouchStart}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Navigation indicators */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center gap-3 mt-12"
          >
            {bins.map((_, index) => (
              <button
                key={index}
                onClick={() => handleBinInteraction(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === activeBinIndex 
                    ? 'w-8 bg-gradient-to-r from-primary to-green-600' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Go to ${bins[index].label}`}
              />
            ))}
          </MotionDiv>
        </section>

        {/* Actions Section with Stagger Animation */}
        <section className="max-w-6xl mx-auto mb-20 md:mb-32">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t("project.actions.title")}
            </h2>
            <p className="text-xl text-muted-foreground">
              {getText("project.actions.subtitle", "Our approach to sustainability", "Notre approche durable")}
            </p>
          </MotionDiv>
          
          <div className="grid md:grid-cols-2 gap-8">
            {actions.map((action, index) => (
              <MotionDiv
                key={action.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ActionCard
                  action={action}
                  index={index}
                  onHover={handleActionHover}
                />
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Impact Section with Scroll Animation */}
        <MotionSection
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mb-20 md:mb-32"
        >
          <FloatingElement>
            <Card className="border-2 border-green-300 shadow-2xl overflow-hidden bg-gradient-to-br from-green-50/20 to-emerald-50/20 backdrop-blur-sm">
              <div className="p-10 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <MotionDiv
                    initial={{ rotate: 180, scale: 0 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center flex-shrink-0 border border-green-300/30"
                  >
                    <Globe className="w-10 h-10 text-green-600" />
                  </MotionDiv>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {t("project.impact.title")}
                    </h2>
                    <p className="text-lg text-muted-foreground mt-3">
                      {t("project.impact.subtitle") || getText("project.impact.subtitle", "Positive changes", "Changements positifs")}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {impacts.map((impact, index) => (
                    <MotionDiv
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-5 p-5 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200/50 hover:border-green-300/50 transition-all duration-300 group">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 border border-green-200">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-foreground/90 pt-1.5 text-lg">{impact}</p>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
                
                {/* Impact Metrics */}
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-10 border-t border-green-200/30"
                >
                  {[
                    { icon: TreePine, value: "Sustainability", color: "text-green-600", bg: "from-green-50 to-emerald-50" },
                    { icon: Heart, value: "Community", color: "text-red-500", bg: "from-red-50 to-pink-50" },
                    { icon: Battery, value: "Efficiency", color: "text-blue-500", bg: "from-blue-50 to-cyan-50" },
                    { icon: Truck, value: "Reduction", color: "text-amber-500", bg: "from-amber-50 to-orange-50" }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-5 rounded-xl bg-gradient-to-br ${item.bg} border border-border/50 hover:border-primary/20 transition-all duration-300 group">
                      <item.icon className={`w-10 h-10 mx-auto mb-3 ${item.color} transition-transform duration-300 group-hover:scale-110`} />
                      <div className="font-bold text-xl mb-1">{item.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {language === "fr" ? 
                          item.value === "Sustainability" ? "Durabilité" :
                          item.value === "Community" ? "Communauté" :
                          item.value === "Efficiency" ? "Efficacité" : "Réduction"
                          : item.value
                        }
                      </div>
                    </div>
                  ))}
                </MotionDiv>
              </div>
            </Card>
          </FloatingElement>
        </MotionSection>

        {/* Call to Action with Bounce Animation */}
        <MotionSection
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="max-w-4xl mx-auto"
        >
          <FloatingElement>
            <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 backdrop-blur-sm">
              <CardContent className="p-12 md:p-16 text-center">
                <MotionDiv
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-green-500/20 flex items-center justify-center mx-auto mb-10 border border-primary/20"
                >
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </MotionDiv>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
                  {t("project.why.title")}
                </h2>
                
                <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  {t("project.why.text")}
                </p>
                
                <MotionDiv
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-r from-primary/10 to-green-500/10 rounded-2xl p-8 mb-12 border border-primary/20 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-primary mb-3">
                    {getText("project.why.join", "Join us today", "Rejoignez-nous aujourd'hui")}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {getText("project.why.invite", 
                      "Be part of the change for a better tomorrow",
                      "Faites partie du changement pour un avenir meilleur"
                    )}
                  </p>
                </MotionDiv>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/guide" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto px-12 py-7 text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90"
                    >
                      <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                      {getText("project.startLearning", "Start learning", "Commencer à apprendre")}
                    </Button>
                  </Link>
                  
                  <Link to="/activities" className="w-full sm:w-auto">
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="w-full sm:w-auto px-12 py-7 text-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 transform hover:-translate-y-1"
                    >
                      <Play className="w-6 h-6 mr-3" />
                      {getText("project.playGames", "Explore activities", "Explorer les activités")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </FloatingElement>
        </MotionSection>
      </div>

      {/* Animated Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
          50% { transform: translateY(0px) translateX(20px) rotate(0deg); }
          75% { transform: translateY(20px) translateX(10px) rotate(-5deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-30px) translateX(20px) scale(1.05); }
          66% { transform: translateY(20px) translateX(-20px) scale(0.95); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .bg-300% {
          background-size: 300% 300%;
        }

        /* Performance optimizations */
        .performance-optimize {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
          will-change: transform, opacity;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
          
          .animate-float,
          .animate-float-slow,
          .animate-gradient,
          .animate-bounce-slow,
          .animate-pulse-slow {
            animation: none !important;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Focus styles */
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
}
