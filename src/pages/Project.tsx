import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  ChevronDown
} from "lucide-react";

// Type definitions for better TypeScript support
interface BinItem {
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  borderColor: string;
  label: string;
}

interface ActionItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
  borderColor: string;
}

// Constants moved outside component to prevent recreation
const BIN_TYPES = 4;
const ANIMATION_DELAY = 2500; // ms

export default function Project() {
  const { t, language } = useLanguage();
  useScrollReveal();
  const [activeIndex, setActiveIndex] = useState(0);

  // Memoized data to prevent recreation on every render
  const bins: BinItem[] = useMemo(() => [
    { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", borderColor: "border-amber-500/30", label: t("project.bins.paper") },
    { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", borderColor: "border-blue-500/30", label: t("project.bins.plastic") },
    { icon: Trash2, color: "text-gray-500", bg: "bg-gray-500/10", borderColor: "border-gray-500/30", label: t("project.bins.metal") },
    { icon: Apple, color: "text-green-500", bg: "bg-green-500/10", borderColor: "border-green-500/30", label: t("project.bins.organic") },
  ], [t]);

  const actions: ActionItem[] = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.actions.recycle.title") || t("project.bins.title"),
      description: t("project.actions.recycle.description") || t("project.bins.text"),
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Lightbulb,
      title: t("project.campaigns.title"),
      description: t("project.campaigns.text"),
      gradient: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500",
      borderColor: "border-amber-500/20"
    },
    {
      icon: Users,
      title: t("project.workshops.title"),
      description: t("project.workshops.text"),
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20"
    },
    {
      icon: TrendingUp,
      title: t("project.monitoring.title"),
      description: t("project.monitoring.text"),
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20"
    }
  ], [t]);

  const impacts: string[] = useMemo(() => [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ], [t]);

  // Animation interval with proper cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % BIN_TYPES);
    }, ANIMATION_DELAY);
    
    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleBinHover = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Helper functions
  const getDelayStyle = useCallback((index: number) => ({
    animationDelay: `${index * 100}ms`
  }), []);

  // Fallback translations
  const initiativeText = language === "fr" ? "Initiative Écologique" : "Ecological Initiative";
  const discoverText = language === "fr" ? "Découvrir le projet" : "Discover the project";
  const resourcesText = language === "fr" ? "Voir les ressources" : "View resources";
  const missionText = language === "fr" ? "Notre mission principale" : "Our main mission";
  const sortingBinsText = language === "fr" ? "Nos Bacs de Tri" : "Our Sorting Bins";
  const binsSubtitle = language === "fr" ? "4 types de déchets, 4 bacs de couleurs" : "4 types of waste, 4 colored bins";
  const actionsSubtitle = language === "fr" ? "Découvrez comment nous agissons au quotidien" : "Discover how we act every day";
  const joinText = t("project.why.join") || (language === "fr" ? "Rejoignez le mouvement !" : "Join the movement!");
  const inviteText = t("project.why.invite") || (language === "fr" 
    ? "L'École Maria invite tous ses élèves, enseignants et parents à rejoindre cette initiative."
    : "École Maria invites all its students, teachers and parents to join this initiative.");
  const startLearningText = t("project.startLearning") || (language === "fr" ? "Commencer à apprendre" : "Start learning");
  const playGamesText = language === "fr" ? "Jouer aux jeux" : "Play games";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
      {/* Background decorations - optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>{initiativeText}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
              {t("project.title")}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in" style={getDelayStyle(1)}>
            {t("project.intro")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={getDelayStyle(2)}>
            <Link to="/guide" aria-label={discoverText}>
              <Button size="lg" className="group px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <Play className="w-5 h-5 mr-2" />
                {discoverText}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/resources" aria-label={resourcesText}>
              <Button variant="outline" size="lg" className="group px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95">
                <ExternalLink className="w-5 h-5 mr-2" />
                {resourcesText}
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
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{t("project.goal.title")}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{missionText}</p>
                </div>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                {t("project.goal.text")}
              </p>
            </div>
          </Card>
        </section>

        {/* Sorting Bins Section */}
        <section className="max-w-5xl mx-auto mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold scroll-reveal mb-3">
              {sortingBinsText}
            </h2>
            <p className="text-muted-foreground scroll-reveal text-lg">
              {binsSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" role="list">
            {bins.map((bin, index) => {
              const BinIcon = bin.icon;
              const isActive = index === activeIndex;
              
              return (
                <Card
                  key={bin.label}
                  role="listitem"
                  className={`scroll-reveal transition-all duration-300 border-2 ${bin.borderColor} cursor-pointer bg-card ${isActive ? 'shadow-xl scale-105 -translate-y-2 border-primary/40' : 'hover:shadow-xl hover:scale-105 hover:-translate-y-2'}`}
                  style={getDelayStyle(index)}
                  onMouseEnter={() => handleBinHover(index)}
                  onFocus={() => handleBinHover(index)}
                  tabIndex={0}
                >
                  <CardContent className="pt-6 pb-6 md:pt-8 md:pb-8 text-center relative z-10">
                    <div 
                      className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl md:rounded-3xl ${bin.bg} flex items-center justify-center mx-auto mb-4 md:mb-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'hover:scale-110'}`}
                      aria-hidden="true"
                    >
                      <BinIcon className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${bin.color}`} />
                    </div>
                    <h3 className="font-bold text-sm md:text-base lg:text-lg text-foreground">{bin.label}</h3>
                    <div 
                      className={`h-1 w-10 md:w-12 mx-auto mt-3 rounded-full transition-all duration-300 ${bin.bg} ${isActive ? 'w-14 md:w-16' : ''}`}
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Actions Section */}
        <section className="max-w-5xl mx-auto mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold scroll-reveal mb-3">{t("project.actions.title")}</h2>
            <p className="text-muted-foreground scroll-reveal text-lg">
              {actionsSubtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6" role="list">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              
              return (
                <Card
                  key={action.title}
                  role="listitem"
                  className={`scroll-reveal hover:shadow-xl transition-all duration-300 border-2 ${action.borderColor} overflow-hidden group hover:-translate-y-2 cursor-pointer`}
                  style={getDelayStyle(index)}
                  tabIndex={0}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                  <CardContent className="p-7 md:p-8 relative">
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                        <ActionIcon className={`w-7 h-7 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{action.title}</h3>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Impact Section */}
        <section className="max-w-5xl mx-auto mb-16 md:mb-24 scroll-reveal">
          <Card className="border-2 border-green-500/20 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 p-8 md:p-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{t("project.impact.title")}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{t("project.impact.text")}</p>
                </div>
              </div>
              <div className="grid gap-4" role="list">
                {impacts.map((impact, index) => (
                  <div
                    key={`impact-${index}`}
                    role="listitem"
                    className="flex items-start gap-4 p-4 rounded-xl bg-background/60 hover:bg-background/80 transition-all duration-300 group/item hover:shadow-md"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-sm md:text-base pt-2">{impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="max-w-4xl mx-auto text-center scroll-reveal">
          <Card className="border-2 border-primary/30 shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-green-500/5 to-amber-500/5 opacity-50" />
            <CardContent className="p-10 md:p-12 relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 transition-transform duration-300 group-hover:scale-110 shadow-xl">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("project.why.title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto text-lg">
                {t("project.why.text")}
              </p>
              <div className="bg-gradient-to-br from-primary/10 via-green-500/10 to-primary/10 rounded-2xl p-6 mb-8 max-w-xl mx-auto border border-primary/20">
                <p className="text-lg font-bold text-primary mb-2">
                  {joinText}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {inviteText}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/guide" aria-label={startLearningText}>
                  <Button size="lg" className="group/btn px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {startLearningText}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/activities" aria-label={playGamesText}>
                  <Button variant="outline" size="lg" className="px-10 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95">
                    <Play className="w-5 h-5 mr-2" />
                    {playGamesText}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
