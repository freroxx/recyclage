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
  Truck
} from "lucide-react";

// Performance optimization: Lazy load framer-motion only when needed
const useLazyFramerMotion = () => {
  const [motionComponents, setMotionComponents] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadFramerMotion = async () => {
      try {
        const [motion, AnimatePresence] = await Promise.all([
          import('framer-motion').then(mod => mod.motion),
          import('framer-motion').then(mod => mod.AnimatePresence)
        ]);
        setMotionComponents({ motion, AnimatePresence });
      } catch (err) {
        console.warn('Framer Motion failed to load, falling back to CSS animations');
        setError(true);
      }
    };

    // Only load on user interaction or when needed
    const handleInteraction = () => {
      loadFramerMotion();
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };

    window.addEventListener('scroll', handleInteraction, { passive: true, once: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true, once: true });
    window.addEventListener('click', handleInteraction, { once: true });

    // Load anyway after 3 seconds if no interaction
    const timeout = setTimeout(loadFramerMotion, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  return { ...motionComponents, error };
};

// Custom optimized scroll hook with throttling
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

// Memoized components to prevent unnecessary re-renders
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
    <div
      className={`cursor-pointer transition-all duration-300 ${
        isActive ? 'transform -translate-y-2' : ''
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
      <Card className={`h-full border-2 ${bin.borderColor} overflow-hidden transition-all duration-300 ${
        isActive ? 'shadow-lg ring-2 ring-primary/20' : 'hover:shadow-md'
      }`}>
        <CardContent className="p-6 text-center">
          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${bin.bg} flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
            isActive ? 'scale-110' : ''
          }`}>
            <BinIcon className={`w-10 h-10 md:w-12 md:h-12 ${bin.color}`} />
          </div>
          <h3 className="font-bold text-lg mb-2">{bin.label}</h3>
          <p className="text-sm text-muted-foreground">{bin.description}</p>
        </CardContent>
      </Card>
    </div>
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
    <div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="h-full"
    >
      <Card className="h-full border hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-lg ${action.bg} flex items-center justify-center flex-shrink-0`}>
              <ActionIcon className={`w-6 h-6 ${action.color}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </div>
          {action.stats && (
            <div className="flex gap-3 pt-4 border-t">
              {action.stats.map((stat: any, i: number) => (
                <div key={i} className="text-center flex-1">
                  <div className="font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

ActionCard.displayName = 'ActionCard';

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

  // Memoized data - using only translations, no fake stats
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-amber-50", 
      borderColor: "border-amber-200", 
      label: t("project.bins.paper"),
      description: language === "fr" ? "Papier, carton, journaux" : "Paper, cardboard, newspapers"
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      borderColor: "border-blue-200", 
      label: t("project.bins.plastic"),
      description: language === "fr" ? "Plastiques recyclables" : "Recyclable plastics"
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gray-50", 
      borderColor: "border-gray-200", 
      label: t("project.bins.metal"),
      description: language === "fr" ? "Métaux et cannettes" : "Metals and cans"
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-green-50", 
      borderColor: "border-green-200", 
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
      bg: "bg-blue-50",
      stats: [
        { value: t("project.stats.collection") || "Collection", label: language === "fr" ? "Collecte" : "Collection" },
        { value: t("project.stats.sorting") || "Sorting", label: language === "fr" ? "Tri" : "Sorting" }
      ]
    },
    {
      icon: Lightbulb,
      title: t("project.campaigns.title"),
      description: t("project.campaigns.text"),
      color: "text-amber-600",
      bg: "bg-amber-50",
      stats: [
        { value: t("project.stats.awareness") || "Awareness", label: language === "fr" ? "Sensibilisation" : "Awareness" },
        { value: t("project.stats.participation") || "Participation", label: language === "fr" ? "Participation" : "Participation" }
      ]
    },
    {
      icon: Users,
      title: t("project.workshops.title"),
      description: t("project.workshops.text"),
      color: "text-purple-600",
      bg: "bg-purple-50",
      stats: [
        { value: t("project.stats.learning") || "Learning", label: language === "fr" ? "Apprentissage" : "Learning" },
        { value: t("project.stats.community") || "Community", label: language === "fr" ? "Communauté" : "Community" }
      ]
    },
    {
      icon: TrendingUp,
      title: t("project.monitoring.title"),
      description: t("project.monitoring.text"),
      color: "text-green-600",
      bg: "bg-green-50",
      stats: [
        { value: t("project.stats.progress") || "Progress", label: language === "fr" ? "Progrès" : "Progress" },
        { value: t("project.stats.impact") || "Impact", label: language === "fr" ? "Impact" : "Impact" }
      ]
    }
  ], [t, language]);

  const impacts = useMemo(() => [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ].filter(Boolean), [t]);

  // Safe auto-rotation with proper cleanup
  useEffect(() => {
    mountedRef.current = true;
    
    const rotateBins = () => {
      if (mountedRef.current && isAutoRotating && !hasInteracted) {
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      }
    };

    // Clear any existing interval
    if (autoRotationInterval.current) {
      clearInterval(autoRotationInterval.current);
    }

    // Set new interval
    autoRotationInterval.current = setInterval(rotateBins, 4000);

    // Cleanup function
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

    // Resume auto-rotation after 8 seconds of inactivity
    const timeout = setTimeout(() => {
      if (mountedRef.current) {
        setIsAutoRotating(true);
      }
    }, 8000);

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

  // Safe text translations with fallbacks
  const getText = useCallback((key: string, fallbackEN: string, fallbackFR: string) => {
    const text = t(key);
    return text && text !== key ? text : (language === "fr" ? fallbackFR : fallbackEN);
  }, [t, language]);

  // Scroll to section safely
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

  // Progress bar component
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
        setWidth(calculateProgress());
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div 
          className="h-full bg-gradient-to-r from-primary to-green-600 transition-all duration-300 ease-out"
          style={{ width }}
          aria-hidden="true"
        />
      </div>
    );
  });
  ProgressBar.displayName = 'ProgressBar';

  // Render fallback if framer-motion fails
  if (framerMotionError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
        <ProgressBar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">{t("project.title")}</h1>
            <p className="text-lg text-muted-foreground mb-8">{t("project.intro")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use motion components if available
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <ProgressBar />
      
      {/* Simplified background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>{getText("project.initiative", "Ecological Initiative", "Initiative Écologique")}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {t("project.title")}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
            {t("project.intro")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/guide" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                {getText("project.discover", "Discover the project", "Découvrir le projet")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/resources" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                size="lg" 
                className="w-full sm:w-auto px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                {getText("project.resources", "View resources", "Voir les ressources")}
              </Button>
            </Link>
          </div>

          <button
            onClick={() => scrollToSection('goal-section')}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors duration-300"
            aria-label={language === "fr" ? "Défiler vers le bas" : "Scroll down"}
          >
            <ChevronDown className="w-6 h-6 text-primary" />
          </button>
        </section>

        {/* Goal Section */}
        <MotionSection
          initial={motion ? { opacity: 0, y: 20 } : undefined}
          whileInView={motion ? { opacity: 1, y: 0 } : undefined}
          viewport={motion ? { once: true } : undefined}
          id="goal-section"
          className="max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <Card className="border-2 border-primary/20 shadow-lg overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{t("project.goal.title")}</h2>
                  <p className="text-muted-foreground">
                    {getText("project.mission", "Our main mission", "Notre mission principale")}
                  </p>
                </div>
              </div>
              <p className="text-lg text-foreground/90 leading-relaxed">
                {t("project.goal.text")}
              </p>
            </div>
          </Card>
        </MotionSection>

        {/* Sorting Bins */}
        <section className="max-w-6xl mx-auto mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {getText("project.bins.title", "Sorting System", "Système de Tri")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {getText("project.bins.subtitle", "Proper waste categorization", "Catégorisation des déchets")}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bins.map((bin, index) => (
              <BinCard
                key={bin.label}
                bin={bin}
                index={index}
                isActive={activeBinIndex === index}
                onMouseEnter={handleBinInteraction}
                onTouchStart={handleTouchStart}
              />
            ))}
          </div>
          
          {/* Navigation indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {bins.map((_, index) => (
              <button
                key={index}
                onClick={() => handleBinInteraction(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeBinIndex 
                    ? 'bg-primary w-4' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Go to ${bins[index].label}`}
              />
            ))}
          </div>
        </section>

        {/* Actions Section */}
        <section className="max-w-6xl mx-auto mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("project.actions.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {getText("project.actions.subtitle", "Our approach to sustainability", "Notre approche durable")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {actions.map((action, index) => (
              <ActionCard
                key={action.title}
                action={action}
                index={index}
                onHover={handleActionHover}
              />
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <MotionSection
          initial={motion ? { opacity: 0 } : undefined}
          whileInView={motion ? { opacity: 1 } : undefined}
          viewport={motion ? { once: true } : undefined}
          className="max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <Card className="border-2 border-green-200 overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{t("project.impact.title")}</h2>
                  <p className="text-muted-foreground">
                    {t("project.impact.subtitle") || getText("project.impact.subtitle", "Positive changes", "Changements positifs")}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {impacts.map((impact, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-green-50">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-foreground/90 pt-1">{impact}</p>
                  </div>
                ))}
              </div>
              
              {/* Real impact indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t">
                <div className="text-center p-4 rounded-lg bg-background">
                  <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-lg">Sustainability</div>
                  <div className="text-sm text-muted-foreground">{language === "fr" ? "Durabilité" : "Sustainability"}</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">Community</div>
                  <div className="text-sm text-muted-foreground">{language === "fr" ? "Communauté" : "Community"}</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Battery className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">Efficiency</div>
                  <div className="text-sm text-muted-foreground">{language === "fr" ? "Efficacité" : "Efficiency"}</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-background">
                  <Truck className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="font-bold text-lg">Reduction</div>
                  <div className="text-sm text-muted-foreground">{language === "fr" ? "Réduction" : "Reduction"}</div>
                </div>
              </div>
            </div>
          </Card>
        </MotionSection>

        {/* Call to Action */}
        <section className="max-w-3xl mx-auto text-center">
          <Card className="border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-10 md:p-12">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t("project.why.title")}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t("project.why.text")}
              </p>
              
              <div className="bg-primary/5 rounded-xl p-6 mb-8">
                <p className="text-xl font-bold text-primary mb-2">
                  {getText("project.why.join", "Join us today", "Rejoignez-nous aujourd'hui")}
                </p>
                <p className="text-muted-foreground">
                  {getText("project.why.invite", 
                    "Be part of the change for a better tomorrow",
                    "Faites partie du changement pour un avenir meilleur"
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/guide" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-10 py-6 text-lg"
                  >
                    <Sparkles className="w-6 h-6 mr-2" />
                    {getText("project.startLearning", "Start learning", "Commencer à apprendre")}
                  </Button>
                </Link>
                
                <Link to="/activities" className="w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    size="lg" 
                    className="w-full sm:w-auto px-10 py-6 text-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {getText("project.playGames", "Explore activities", "Explorer les activités")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Performance optimized styles */}
      <style>{`
        /* Hardware accelerated animations */
        .performance-optimize {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000;
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
        }
        
        /* Smooth scrolling for the whole page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Performance focus styles */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        
        /* Optimize image rendering */
        img {
          content-visibility: auto;
        }
      `}</style>
    </div>
  );
}
