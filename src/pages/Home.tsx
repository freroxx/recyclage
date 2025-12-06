import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Lightbulb, ArrowRight, Sparkles, Leaf, TreeDeciduous, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion"; // Optional: For enhanced animations

// Lazy load heavy components if needed
// const LazyComponent = lazy(() => import('./LazyComponent'));

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  const [loadIframe, setLoadIframe] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  // Memoized features to prevent recalculation on every render
  const features = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.implementation"),
      description: t("project.implementation.desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      gradient: "from-emerald-500/5 to-emerald-600/10"
    },
    {
      icon: Lightbulb,
      title: t("project.awareness"),
      description: t("project.awareness.desc"),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      gradient: "from-amber-500/5 to-amber-600/10"
    },
    {
      icon: Users,
      title: t("project.mobilization"),
      description: t("project.mobilization.desc"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      gradient: "from-blue-500/5 to-blue-600/10"
    }
  ], [t]);

  const stats = useMemo(() => [
    { 
      value: "4", 
      label: language === "fr" ? "Types de déchets" : "Waste types", 
      icon: Recycle,
      suffix: language === "fr" ? "catégories" : "categories"
    },
    { 
      value: "100%", 
      label: language === "fr" ? "Engagement école" : "School engagement", 
      icon: Users,
      suffix: language === "fr" ? "participation" : "participation"
    },
    { 
      value: "∞", 
      label: language === "fr" ? "Impact positif" : "Positive impact", 
      icon: Globe,
      suffix: language === "fr" ? "influence" : "influence"
    },
  ], [language]);

  // Optimized intersection observer with useCallback
  useEffect(() => {
    const element = iframeContainerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadIframe) {
          // Use requestAnimationFrame for smoother loading
          requestAnimationFrame(() => {
            setLoadIframe(true);
          });
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        root: null
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loadIframe]);

  // Preload the hero image
  useEffect(() => {
    const img = new Image();
    img.src = "/hero.webp";
    img.onload = () => setImageLoaded(true);
  }, []);

  const handleCtaClick = useCallback(() => {
    navigate("/project");
  }, [navigate]);

  const animationDelays = {
    slideInLeft: '0ms',
    slideInRight: '200ms',
    bounceIn: '400ms',
    stats: (index: number) => `${index * 100}ms`,
    features: (index: number) => `${index * 150}ms`
  };

  // Skip to main content for accessibility
  const skipToMain = () => {
    const mainContent = document.querySelector('main');
    mainContent?.focus();
  };

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
        onClick={skipToMain}
      >
        {language === "fr" ? "Passer au contenu principal" : "Skip to main content"}
      </a>

      <div className="min-h-screen overflow-hidden">
        {/* Hero Section - Enhanced with better accessibility */}
        <header className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden" role="banner">
          {/* Background Image with optimized loading */}
          <div className="absolute inset-0" aria-hidden="true">
            <picture>
              <source srcSet="/hero-mobile.webp" media="(max-width: 768px)" />
              <img
                src="/hero.webp"
                alt={language === "fr" ? "École Maria - Programme de recyclage à Agadir" : "École Maria - Recycling program in Agadir"}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
                  imageLoaded ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="eager"
                fetchPriority="high"
                width="1920"
                height="1080"
                decoding="async"
              />
            </picture>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" 
              aria-hidden="true"
            />
          </div>

          {/* Floating decorative elements - Reduced count for performance */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full blur-2xl animate-soft-float"
                style={{
                  top: `${20 + i * 30}%`,
                  left: i === 0 ? '10%' : i === 1 ? '80%' : '25%',
                  width: i === 0 ? '5rem' : i === 1 ? '6rem' : '4rem',
                  height: i === 0 ? '5rem' : i === 1 ? '6rem' : '4rem',
                  background: i === 0 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : i === 1 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(245, 158, 11, 0.2)',
                  animationDelay: `${i * 1}s`,
                  animationDuration: '8s'
                }}
              />
            ))}
          </div>

          <main 
            id="main-content" 
            className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto" 
            tabIndex={-1}
          >
            {/* Badge with aria-label */}
            <div 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 md:mb-8 border border-white/20 animate-fade-in"
              role="status"
              aria-label={language === "fr" ? "École Maria à Agadir" : "École Maria in Agadir"}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>{language === "fr" ? "École Maria - Agadir" : "École Maria - Agadir"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight animate-slide-in-left">
              <span className="sr-only">{t("hero.title")}</span>
              <span aria-hidden="true">{t("hero.title")}</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-in-right">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
              <Button
                size="lg"
                className="group px-8 py-6 text-lg shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={handleCtaClick}
                aria-label={t("hero.cta")}
              >
                <Leaf className="w-5 h-5 mr-2" aria-hidden="true" />
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              
              <Link 
                to="/resources" 
                className="w-full sm:w-auto"
                aria-label={language === "fr" ? "Voir les ressources de recyclage" : "View recycling resources"}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 w-full focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  {language === "fr" ? "Voir les ressources" : "View resources"}
                </Button>
              </Link>
            </div>

            {/* Scroll indicator with aria-label */}
            <div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
              role="navigation"
              aria-label={language === "fr" ? "Faites défiler vers le bas" : "Scroll down"}
            >
              <ChevronDown className="w-8 h-8 text-white/60" aria-hidden="true" />
            </div>
          </main>
        </header>

        {/* Stats Section with semantic HTML */}
        <section className="relative -mt-16 md:-mt-20 z-20" aria-label={language === "fr" ? "Statistiques du projet" : "Project statistics"}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <article 
                    key={stat.label} 
                    className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 scroll-reveal rounded-lg"
                    style={{ animationDelay: animationDelays.stats(index) }}
                  >
                    <div className="p-4 md:p-6 text-center">
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-3"
                        aria-hidden="true"
                      >
                        <StatIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <div className="text-2xl md:text-4xl font-bold text-primary mb-1">
                        {stat.value}
                        <span className="sr-only">{stat.suffix}</span>
                      </div>
                      <h3 className="text-xs md:text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section 
          className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5" 
          aria-labelledby="features-heading"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 md:mb-16 scroll-reveal">
              <h2 
                id="features-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
                  {language === "fr" ? "Notre Mission" : "Our Mission"}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "fr" 
                  ? "Ensemble, construisons un avenir plus vert pour notre école et notre planète."
                  : "Together, let's build a greener future for our school and our planet."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <article 
                    key={feature.title}
                    className={`group bg-card hover:shadow-2xl transition-all duration-500 border-2 ${feature.borderColor} hover:border-primary/30 scroll-reveal overflow-hidden rounded-xl`}
                    style={{ animationDelay: animationDelays.features(index) }}
                  >
                    <div className="p-6 md:p-8 relative h-full">
                      {/* Background gradient with reduced opacity for better performance */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        aria-hidden="true"
                      />
                      
                      <div className="relative z-10 h-full flex flex-col">
                        <div 
                          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 md:mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0`}
                          aria-hidden="true"
                        >
                          <FeatureIcon className={`w-8 h-8 md:w-10 md:h-10 ${feature.color}`} />
                        </div>
                        <h3 className="font-bold text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors duration-300 flex-shrink-0">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed flex-grow">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Canva Presentation Section with lazy loading */}
        <section 
          className="py-16 md:py-24 bg-background" 
          aria-labelledby="presentation-heading"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12 scroll-reveal">
                <div 
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 border border-primary/20"
                  role="status"
                >
                  <TreeDeciduous className="w-4 h-4" aria-hidden="true" />
                  <span>{language === "fr" ? "Présentation Interactive" : "Interactive Presentation"}</span>
                </div>
                <h2 
                  id="presentation-heading"
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground"
                >
                  {t("home.presentation.title")}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t("home.presentation.subtitle")}
                </p>
              </div>
              
              <div className="scroll-reveal" ref={iframeContainerRef}>
                <div 
                  className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 hover:border-primary/30 transition-all duration-500 bg-card group"
                  role="region"
                  aria-label={language === "fr" ? "Présentation interactive sur le recyclage" : "Interactive recycling presentation"}
                >
                  <Suspense fallback={
                    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center bg-muted">
                      <div className="text-center space-y-4">
                        <div 
                          className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse"
                          aria-hidden="true"
                        >
                          <Recycle className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground">
                          {language === "fr" ? "Chargement..." : "Loading..."}
                        </p>
                      </div>
                    </div>
                  }>
                    {loadIframe ? (
                      <iframe
                        loading="lazy"
                        className="absolute w-full h-full top-0 left-0 border-0"
                        src="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?embed"
                        allowFullScreen
                        allow="fullscreen"
                        title={language === "fr" 
                          ? "Présentation sur le recyclage des déchets" 
                          : "How To Recycle Waste Presentation"}
                        aria-label={language === "fr" 
                          ? "Présentation interactive sur le recyclage" 
                          : "Interactive recycling presentation"}
                      />
                    ) : (
                      <div 
                        className="absolute w-full h-full top-0 left-0 flex items-center justify-center bg-muted"
                        role="status"
                        aria-live="polite"
                      >
                        <div className="text-center space-y-4">
                          <div 
                            className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse"
                            aria-hidden="true"
                          >
                            <Recycle className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-muted-foreground">
                            {language === "fr" ? "Préparation de la présentation..." : "Preparing presentation..."}
                          </p>
                        </div>
                      </div>
                    )}
                  </Suspense>
                </div>
                <div className="text-center mt-4">
                  <a
                    href="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?utm_content=DAG5CGlo4U8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label={language === "fr" 
                      ? "Ouvrir la présentation dans un nouvel onglet" 
                      : "Open presentation in new tab"}
                  >
                    How To Recycle Waste {t("home.presentation.by")} Yahia Ikni
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background" 
          aria-labelledby="cta-heading"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <article className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl overflow-hidden scroll-reveal rounded-xl">
              <div className="p-8 md:p-12 text-center relative">
                {/* Background decorations with reduced opacity */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" 
                  aria-hidden="true"
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-soft-float"
                    aria-hidden="true"
                  >
                    <Leaf className="w-10 h-10 text-primary" />
                  </div>
                  <h2 
                    id="cta-heading"
                    className="text-3xl md:text-4xl font-bold mb-4"
                  >
                    {language === "fr" ? "Rejoignez le Mouvement" : "Join the Movement"}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {language === "fr" 
                      ? "Chaque geste compte. Ensemble, faisons de notre école un modèle de développement durable."
                      : "Every action counts. Together, let's make our school a model of sustainable development."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/project"
                      aria-label={language === "fr" 
                        ? "Découvrir le projet de recyclage" 
                        : "Discover the recycling project"}
                    >
                      <Button 
                        size="lg" 
                        className="group px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
                        {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link 
                      to="/contact"
                      aria-label={language === "fr" 
                        ? "Contacter l'équipe du projet" 
                        : "Contact the project team"}
                    >
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 w-full sm:w-auto focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        {language === "fr" ? "Nous contacter" : "Contact us"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
