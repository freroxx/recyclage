import { 
  useState, 
  useEffect, 
  useMemo, 
  useCallback, 
  useRef,
  Suspense
} from "react";
import { Link } from "react-router-dom";
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
  LucideIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet-async";

// Types
interface BinItem {
  icon: LucideIcon;
  color: string;
  bg: string;
  borderColor: string;
  label: string;
}

interface ActionItem {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
}

// Constants
const BIN_ROTATION_INTERVAL = 2500;
const ANIMATION_DELAY_INCREMENT = 100;

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error; 
  resetErrorBoundary: () => void 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading Skeleton
function ProjectSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section Skeleton */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto mb-8 animate-pulse" />
          <div className="h-16 bg-gray-200 rounded-lg mb-8 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded mb-10 max-w-3xl mx-auto animate-pulse" />
          <div className="flex gap-4 justify-center">
            <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Background Decorations with cleanup
const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div 
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" 
        aria-hidden="true"
      />
      <div 
        className="absolute top-40 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-40 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" 
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />
    </div>
  );
};

// Bin Card Component with keyboard support
const BinCard = ({ 
  bin, 
  index, 
  isActive, 
  onSelect 
}: { 
  bin: BinItem;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}) => {
  const Icon = bin.icon;
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(index);
    }
  }, [index, onSelect]);

  return (
    <Card
      className={`scroll-reveal transition-all duration-300 border-2 ${bin.borderColor} cursor-pointer bg-card ${
        isActive 
          ? 'shadow-xl scale-105 -translate-y-2 border-primary/40 ring-2 ring-primary/20' 
          : 'hover:shadow-xl hover:scale-105 hover:-translate-y-2'
      }`}
      style={{ animationDelay: `${index * ANIMATION_DELAY_INCREMENT}ms` }}
      onClick={() => onSelect(index)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Select ${bin.label} bin`}
      aria-pressed={isActive}
    >
      <CardContent className="pt-6 pb-6 md:pt-8 md:pb-8 text-center relative z-10">
        <div className={`
          w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
          rounded-2xl md:rounded-3xl ${bin.bg} 
          flex items-center justify-center mx-auto mb-4 md:mb-5 
          transition-transform duration-300 ${isActive ? 'scale-110' : 'hover:scale-110'}
        `}>
          <Icon 
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${bin.color}`}
            aria-hidden="true"
          />
        </div>
        <h3 className="font-bold text-sm md:text-base lg:text-lg text-foreground">
          {bin.label}
        </h3>
        <div className={`
          h-1 w-10 md:w-12 mx-auto mt-3 rounded-full 
          transition-all duration-300 ${bin.bg} 
          ${isActive ? 'w-14 md:w-16' : ''}
        `} />
      </CardContent>
    </Card>
  );
};

// Action Card Component
const ActionCard = ({ action, index }: { action: ActionItem; index: number }) => {
  const Icon = action.icon;
  
  return (
    <Card
      className={`scroll-reveal hover:shadow-xl transition-all duration-300 
        border-2 ${action.borderColor} overflow-hidden 
        group hover:-translate-y-2 cursor-pointer focus-within:ring-2 focus-within:ring-primary/20`}
      style={{ animationDelay: `${index * ANIMATION_DELAY_INCREMENT}ms` }}
      role="article"
      tabIndex={0}
    >
      <div className={`
        absolute inset-0 bg-gradient-to-br ${action.gradient} 
        opacity-30 group-hover:opacity-50 transition-opacity duration-300
      `} 
        aria-hidden="true"
      />
      <CardContent className="p-7 md:p-8 relative">
        <div className="flex items-start gap-5">
          <div className={`
            w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} 
            flex items-center justify-center flex-shrink-0 
            transition-transform duration-300 group-hover:scale-110 shadow-lg
          `}>
            <Icon 
              className={`w-7 h-7 ${action.iconColor}`}
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">
              {action.title}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>
        <div 
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
          aria-hidden="true"
        >
          <ArrowRight className={`w-5 h-5 ${action.iconColor}`} />
        </div>
      </CardContent>
    </Card>
  );
};

// Section Header Component
const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <header className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold scroll-reveal mb-3">
      {title}
    </h2>
    <p className="text-muted-foreground scroll-reveal text-lg">
      {subtitle}
    </p>
  </header>
);

// Main Project Component
function ProjectContent() {
  const { t, language } = useLanguage();
  const scrollRevealRef = useScrollReveal();
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Performance tracking
  useEffect(() => {
    if (!isLoading) {
      const loadTime = Date.now() - startTimeRef.current;
      console.log(`Project component loaded in ${loadTime}ms`);
    }
  }, [isLoading]);

  // Safe translation function with fallback
  const safeT = useCallback((key: string, fallback?: string) => {
    try {
      const translation = t(key);
      // Check if translation exists (not the key itself)
      return translation && translation !== key ? translation : (fallback || key);
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error);
      return fallback || key;
    }
  }, [t]);

  // Memoized data
  const bins = useMemo((): BinItem[] => [
    { 
      icon: FileText, 
      color: "text-amber-500 dark:text-amber-400", 
      bg: "bg-amber-500/10 dark:bg-amber-400/10", 
      borderColor: "border-amber-500/30 dark:border-amber-400/30", 
      label: safeT("project.bins.paper", "Paper") 
    },
    { 
      icon: Package, 
      color: "text-blue-500 dark:text-blue-400", 
      bg: "bg-blue-500/10 dark:bg-blue-400/10", 
      borderColor: "border-blue-500/30 dark:border-blue-400/30", 
      label: safeT("project.bins.plastic", "Plastic") 
    },
    { 
      icon: Trash2, 
      color: "text-gray-500 dark:text-gray-400", 
      bg: "bg-gray-500/10 dark:bg-gray-400/10", 
      borderColor: "border-gray-500/30 dark:border-gray-400/30", 
      label: safeT("project.bins.metal", "Metal") 
    },
    { 
      icon: Apple, 
      color: "text-green-500 dark:text-green-400", 
      bg: "bg-green-500/10 dark:bg-green-400/10", 
      borderColor: "border-green-500/30 dark:border-green-400/30", 
      label: safeT("project.bins.organic", "Organic") 
    },
  ], [safeT]);

  const actions = useMemo((): ActionItem[] => [
    {
      icon: Recycle,
      title: safeT("project.bins.title", "Smart Sorting Bins"),
      description: safeT("project.bins.text", "Learn about our innovative waste sorting system"),
      gradient: "from-blue-500/10 to-cyan-500/10 dark:from-blue-400/10 dark:to-cyan-400/10",
      iconColor: "text-blue-500 dark:text-blue-400",
      borderColor: "border-blue-500/20 dark:border-blue-400/20"
    },
    {
      icon: Lightbulb,
      title: safeT("project.campaigns.title", "Awareness Campaigns"),
      description: safeT("project.campaigns.text", "Educational initiatives to promote sustainability"),
      gradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-400/10 dark:to-orange-400/10",
      iconColor: "text-amber-500 dark:text-amber-400",
      borderColor: "border-amber-500/20 dark:border-amber-400/20"
    },
    {
      icon: Users,
      title: safeT("project.workshops.title", "Interactive Workshops"),
      description: safeT("project.workshops.text", "Hands-on learning experiences for all ages"),
      gradient: "from-purple-500/10 to-pink-500/10 dark:from-purple-400/10 dark:to-pink-400/10",
      iconColor: "text-purple-500 dark:text-purple-400",
      borderColor: "border-purple-500/20 dark:border-purple-400/20"
    },
    {
      icon: TrendingUp,
      title: safeT("project.monitoring.title", "Progress Monitoring"),
      description: safeT("project.monitoring.text", "Track our environmental impact over time"),
      gradient: "from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10",
      iconColor: "text-green-500 dark:text-green-400",
      borderColor: "border-green-500/20 dark:border-green-400/20"
    }
  ], [safeT]);

  const impacts = useMemo(() => [
    safeT("project.impact.1", "Reduced waste sent to landfills by 40%"),
    safeT("project.impact.2", "Increased recycling rates by 65%"),
    safeT("project.impact.3", "Educated over 500 students and community members"),
    safeT("project.impact.4", "Saved approximately 15 tons of CO2 emissions")
  ], [safeT]);

  // Computed values
  const initiativeLabel = useMemo(() => 
    language === "fr" ? "Initiative Écologique" : "Ecological Initiative",
    [language]
  );

  const sortingBinsTitle = useMemo(() =>
    safeT("project.bins.title", language === "fr" ? "Nos Bacs de Tri" : "Our Sorting Bins"),
    [safeT, language]
  );

  const sortingBinsSubtitle = useMemo(() =>
    language === "fr" ? "4 types de déchets, 4 bacs de couleurs" : "4 types of waste, 4 colored bins",
    [language]
  );

  // Event handlers
  const handleBinSelect = useCallback((index: number) => {
    setActiveBinIndex(index);
  }, []);

  // Bin rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBinIndex(prev => (prev + 1) % bins.length);
    }, BIN_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [bins.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveBinIndex(prev => (prev - 1 + bins.length) % bins.length);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveBinIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveBinIndex(bins.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bins.length]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Failed to load project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <ProjectSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>{safeT("project.title", "Eco Project")} | Eco Initiative</title>
        <meta name="description" content={safeT("project.intro", "Sustainable waste management initiative")} />
        <meta property="og:title" content={safeT("project.title", "Eco Project")} />
        <meta property="og:description" content={safeT("project.intro", "Sustainable waste management initiative")} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
        <BackgroundDecorations />
        
        <div ref={scrollRevealRef} className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          {/* Hero Section */}
          <section className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm animate-fade-in">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{initiativeLabel}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-fade-in">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {safeT("project.title", "Sustainable Waste Management")}
              </span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in" 
              style={{ animationDelay: '0.1s' }}
            >
              {safeT("project.intro", "Join us in creating a cleaner, more sustainable future through innovative waste management solutions.")}
            </p>

            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" 
              style={{ animationDelay: '0.2s' }}
            >
              <Link 
                to="/guide" 
                className="inline-block"
                aria-label={language === "fr" ? "Découvrir le projet" : "Discover the project"}
              >
                <Button 
                  size="lg" 
                  className="group px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                  {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                  <ArrowRight 
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Link 
                to="/resources" 
                className="inline-block"
                aria-label={language === "fr" ? "Voir les ressources" : "View resources"}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="group px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ExternalLink className="w-5 h-5 mr-2" aria-hidden="true" />
                  {language === "fr" ? "Voir les ressources" : "View resources"}
                </Button>
              </Link>
            </div>

            <div className="mt-12 animate-bounce" aria-hidden="true">
              <ChevronDown className="w-6 h-6 mx-auto text-muted-foreground" />
            </div>
          </section>

          {/* Goal Section */}
          <section className="max-w-5xl mx-auto mb-16 md:mb-24 scroll-reveal">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-8 md:p-10">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                    <Target className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {safeT("project.goal.title", "Our Goal")}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {language === "fr" ? "Notre mission principale" : "Our main mission"}
                    </p>
                  </div>
                </div>
                <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                  {safeT("project.goal.text", "To revolutionize waste management through education, innovation, and community engagement.")}
                </p>
              </div>
            </Card>
          </section>

          {/* Sorting Bins Section */}
          <section className="max-w-5xl mx-auto mb-16 md:mb-24" aria-labelledby="sorting-bins-title">
            <SectionHeader 
              title={sortingBinsTitle}
              subtitle={sortingBinsSubtitle}
            />
            <div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              role="list"
              aria-label="Sorting bins"
            >
              {bins.map((bin, index) => (
                <BinCard
                  key={`${bin.label}-${index}`}
                  bin={bin}
                  index={index}
                  isActive={index === activeBinIndex}
                  onSelect={handleBinSelect}
                />
              ))}
            </div>
          </section>

          {/* Actions Section */}
          <section className="max-w-5xl mx-auto mb-16 md:mb-24" aria-labelledby="actions-title">
            <SectionHeader 
              title={safeT("project.actions.title", "Our Actions")}
              subtitle={language === "fr" 
                ? "Découvrez comment nous agissons au quotidien" 
                : "Discover how we act every day"
              }
            />
            <div className="grid md:grid-cols-2 gap-6" role="list">
              {actions.map((action, index) => (
                <ActionCard
                  key={`${action.title}-${index}`}
                  action={action}
                  index={index}
                />
              ))}
            </div>
          </section>

          {/* Impact Section */}
          <section className="max-w-5xl mx-auto mb-16 md:mb-24 scroll-reveal">
            <Card className="border-2 border-green-500/20 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 p-8 md:p-10">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      {safeT("project.impact.title", "Our Impact")}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {safeT("project.impact.text", "Measurable results making a difference")}
                    </p>
                  </div>
                </div>
                <div className="grid gap-4" role="list">
                  {impacts.map((impact, index) => (
                    <div
                      key={`impact-${index}`}
                      className="flex items-start gap-4 p-4 rounded-xl bg-background/60 hover:bg-background/80 transition-all duration-300 group/item hover:shadow-md"
                      role="listitem"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110">
                        <Leaf className="w-5 h-5 text-green-600" aria-hidden="true" />
                      </div>
                      <p className="text-foreground/90 leading-relaxed text-sm md:text-base pt-2">
                        {impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          {/* Call to Action */}
          <section className="max-w-4xl mx-auto text-center scroll-reveal">
            <Card className="border-2 border-primary/30 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-green-500/5 to-amber-500/5 opacity-50"
                aria-hidden="true"
              />
              <CardContent className="p-10 md:p-12 relative">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 transition-transform duration-300 group-hover:scale-110 shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-primary" aria-hidden="true" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {safeT("project.why.title", "Why Join Us?")}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto text-lg">
                  {safeT("project.why.text", "Be part of a community dedicated to positive environmental change.")}
                </p>
                <div className="bg-gradient-to-br from-primary/10 via-green-500/10 to-primary/10 rounded-2xl p-6 mb-8 max-w-xl mx-auto border border-primary/20">
                  <p className="text-lg font-bold text-primary mb-2">
                    {safeT("project.why.join", "Join the movement!")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {safeT("project.why.invite", 
                      language === "fr"
                        ? "L'École Maria invite tous ses élèves, enseignants et parents à rejoindre cette initiative."
                        : "École Maria invites all its students, teachers and parents to join this initiative."
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/guide" 
                    className="inline-block"
                    aria-label={safeT("project.startLearning", "Start learning")}
                  >
                    <Button size="lg" className="group/btn px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                      <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                      {safeT("project.startLearning", "Start learning")}
                      <ArrowRight 
                        className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" 
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                  <Link 
                    to="/activities" 
                    className="inline-block"
                    aria-label={language === "fr" ? "Jouer aux jeux" : "Play games"}
                  >
                    <Button variant="outline" size="lg" className="px-10 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95">
                      <Play className="w-5 h-5 mr-2" aria-hidden="true" />
                      {language === "fr" ? "Jouer aux jeux" : "Play games"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

// Main exported component with error boundary
export default function Project() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent />
      </Suspense>
    </ErrorBoundary>
  );
}
