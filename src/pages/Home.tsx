import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Lightbulb, ArrowRight, Sparkles, Leaf, TreeDeciduous, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  const [loadIframe, setLoadIframe] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadIframe) {
            setTimeout(() => {
              setLoadIframe(true);
            }, 100);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (iframeContainerRef.current) {
      observer.observe(iframeContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadIframe]);

  const features = [
    {
      icon: Recycle,
      title: t("project.implementation"),
      description: t("project.implementation.desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      icon: Lightbulb,
      title: t("project.awareness"),
      description: t("project.awareness.desc"),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      icon: Users,
      title: t("project.mobilization"),
      description: t("project.mobilization.desc"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    }
  ];

  const stats = [
    { value: "4", label: language === "fr" ? "Types de déchets" : "Waste types", icon: Recycle },
    { value: "100%", label: language === "fr" ? "Engagement école" : "School engagement", icon: Users },
    { value: "∞", label: language === "fr" ? "Impact positif" : "Positive impact", icon: Globe },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Enhanced */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src="/hero.webp"
            alt="Ecole Maria - Recyclage"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-20 h-20 md:w-32 md:h-32 bg-primary/20 rounded-full blur-2xl animate-soft-float" />
          <div className="absolute top-1/3 right-16 w-24 h-24 md:w-40 md:h-40 bg-emerald-500/20 rounded-full blur-2xl animate-soft-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-amber-500/20 rounded-full blur-2xl animate-soft-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 md:mb-8 border border-white/20 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>{language === "fr" ? "École Maria - Agadir" : "École Maria - Agadir"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight animate-slide-in-left">
            {t("hero.title")}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-in-right" style={{ animationDelay: '200ms' }}>
            {t("hero.subtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in" style={{ animationDelay: '400ms' }}>
            <Button
              size="lg"
              className="group px-8 py-6 text-lg shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
              onClick={() => navigate("/project")}
            >
              <Leaf className="w-5 h-5 mr-2" />
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Link to="/resources" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 w-full"
              >
                {language === "fr" ? "Voir les ressources" : "View resources"}
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 md:-mt-20 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <Card 
                  key={stat.label} 
                  className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 scroll-reveal"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <StatIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <div className="text-2xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
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
                <Card 
                  key={feature.title}
                  className={`group bg-card hover:shadow-2xl transition-all duration-500 border-2 ${feature.borderColor} hover:border-primary/30 scroll-reveal overflow-hidden`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 md:p-8 relative">
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${feature.bg} flex items-center justify-center mb-5 md:mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <FeatureIcon className={`w-8 h-8 md:w-10 md:h-10 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Canva Presentation Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-12 scroll-reveal">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 border border-primary/20">
                <TreeDeciduous className="w-4 h-4" />
                <span>{language === "fr" ? "Présentation Interactive" : "Interactive Presentation"}</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {t("home.presentation.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("home.presentation.subtitle")}
              </p>
            </div>
            
            <div className="scroll-reveal" ref={iframeContainerRef} style={{ animationDelay: '200ms' }}>
              <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 hover:border-primary/30 transition-all duration-500 bg-card group">
                {loadIframe ? (
                  <iframe
                    loading="lazy"
                    className="absolute w-full h-full top-0 left-0 border-0"
                    src="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?embed"
                    allowFullScreen
                    allow="fullscreen"
                    title="How To Recycle Waste Presentation"
                  />
                ) : (
                  <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center bg-muted">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto animate-pulse">
                        <Recycle className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">{language === "fr" ? "Chargement..." : "Loading..."}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <a
                  href="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?utm_content=DAG5CGlo4U8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  How To Recycle Waste {t("home.presentation.by")} Yahia Ikni
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl overflow-hidden scroll-reveal">
            <CardContent className="p-8 md:p-12 text-center relative">
              {/* Background decorations */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 animate-soft-float">
                  <Leaf className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {language === "fr" ? "Rejoignez le Mouvement" : "Join the Movement"}
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {language === "fr" 
                    ? "Chaque geste compte. Ensemble, faisons de notre école un modèle de développement durable."
                    : "Every action counts. Together, let's make our school a model of sustainable development."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/project">
                    <Button size="lg" className="group px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                      <Sparkles className="w-5 h-5 mr-2" />
                      {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                      <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                      {language === "fr" ? "Nous contacter" : "Contact us"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}