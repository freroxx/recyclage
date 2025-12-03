import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Project() {
  const { t, language } = useLanguage();
  useScrollReveal();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycle through bins for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const bins = [
    { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", borderColor: "border-amber-500/30", glowColor: "shadow-amber-500/20", label: t("project.bins.paper") },
    { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", borderColor: "border-blue-500/30", glowColor: "shadow-blue-500/20", label: t("project.bins.plastic") },
    { icon: Trash2, color: "text-gray-500", bg: "bg-gray-500/10", borderColor: "border-gray-500/30", glowColor: "shadow-gray-500/20", label: t("project.bins.metal") },
    { icon: Apple, color: "text-green-500", bg: "bg-green-500/10", borderColor: "border-green-500/30", glowColor: "shadow-green-500/20", label: t("project.bins.organic") },
  ];

  const actions = [
    {
      icon: Recycle,
      title: t("project.bins.title"),
      description: t("project.bins.text"),
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      hoverGlow: "hover:shadow-blue-500/20"
    },
    {
      icon: Lightbulb,
      title: t("project.campaigns.title"),
      description: t("project.campaigns.text"),
      gradient: "from-amber-500/10 to-orange-500/10",
      iconColor: "text-amber-500",
      borderColor: "border-amber-500/20",
      hoverGlow: "hover:shadow-amber-500/20"
    },
    {
      icon: Users,
      title: t("project.workshops.title"),
      description: t("project.workshops.text"),
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-500",
      borderColor: "border-purple-500/20",
      hoverGlow: "hover:shadow-purple-500/20"
    },
    {
      icon: TrendingUp,
      title: t("project.monitoring.title"),
      description: t("project.monitoring.text"),
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-500",
      borderColor: "border-green-500/20",
      hoverGlow: "hover:shadow-green-500/20"
    }
  ];

  const impacts = [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Hero Section - Enhanced */}
        <div className="max-w-5xl mx-auto text-center mb-16 md:mb-24">
          <div 
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm animate-bounce-in"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{language === "fr" ? "Initiative Écologique" : "Ecological Initiative"}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
              {t("project.title")}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t("project.intro")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/guide">
              <Button size="lg" className="group relative overflow-hidden px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" size="lg" className="group px-8 py-6 text-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                <ExternalLink className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
                {language === "fr" ? "Voir les ressources" : "View resources"}
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-6 h-6 mx-auto text-muted-foreground" />
          </div>
        </div>

        {/* Goal Section - Enhanced */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24 scroll-rotate-in">
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-8 md:p-10 transition-all duration-500 relative">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary/30 shadow-lg shadow-primary/20">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold">{t("project.goal.title")}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{language === "fr" ? "Notre mission principale" : "Our main mission"}</p>
                </div>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                {t("project.goal.text")}
              </p>
            </div>
          </Card>
        </div>

        {/* Sorting Bins - Enhanced with animation */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold scroll-reveal mb-3">
              {language === "fr" ? "Nos Bacs de Tri" : "Our Sorting Bins"}
            </h2>
            <p className="text-muted-foreground scroll-reveal text-lg">
              {language === "fr" ? "4 types de déchets, 4 bacs de couleurs" : "4 types of waste, 4 colored bins"}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {bins.map((bin, index) => {
              const BinIcon = bin.icon;
              const isActive = index === activeIndex;
              return (
                <Card
                  key={bin.label}
                  className={`relative hover:shadow-2xl transition-all duration-500 scroll-reveal border-2 ${bin.borderColor} group cursor-pointer overflow-hidden ${isActive ? `shadow-xl ${bin.glowColor} -translate-y-2 scale-105` : 'hover:-translate-y-3'}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${bin.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardContent className="pt-8 pb-8 text-center relative">
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl ${bin.bg} flex items-center justify-center mx-auto mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isActive ? 'scale-110 rotate-6' : ''}`}>
                      <BinIcon className={`w-10 h-10 md:w-12 md:h-12 ${bin.color} transition-all duration-300`} />
                    </div>
                    <h3 className="font-bold text-base md:text-lg">{bin.label}</h3>
                    <div className={`h-1 w-12 mx-auto mt-3 rounded-full ${bin.bg} transition-all duration-500 group-hover:w-20 ${isActive ? 'w-20' : ''}`} 
                         style={{ backgroundColor: bin.color.replace('text-', '') }} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Actions Section - Enhanced */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold scroll-reveal mb-3">{t("project.actions.title")}</h2>
            <p className="text-muted-foreground scroll-reveal text-lg">
              {language === "fr" ? "Découvrez comment nous agissons au quotidien" : "Discover how we act every day"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Card
                  key={action.title}
                  className={`scroll-reveal hover:shadow-2xl ${action.hoverGlow} transition-all duration-500 border-2 ${action.borderColor} overflow-hidden group hover:-translate-y-2 cursor-pointer relative`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                  <CardContent className="p-7 md:p-9 relative">
                    <div className="flex items-start gap-5">
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                        <ActionIcon className={`w-7 h-7 md:w-8 md:h-8 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors duration-300">{action.title}</h3>
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
        </div>

        {/* Impact Section - Enhanced */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-24 scroll-fade-left">
          <Card className="border-2 border-green-500/20 shadow-2xl overflow-hidden group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 p-8 md:p-10 relative">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-lg shadow-green-500/20">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold">{t("project.impact.title")}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{t("project.impact.text")}</p>
                </div>
              </div>
              <div className="grid gap-4">
                {impacts.map((impact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-background/60 hover:bg-background/90 transition-all duration-300 group/item hover:shadow-lg hover:-translate-x-1 cursor-default"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-green-500/30">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-sm md:text-base pt-1.5">{impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action - Enhanced */}
        <div className="max-w-4xl mx-auto text-center scroll-fade-right">
          <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-green-500/10 to-amber-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            <CardContent className="p-10 md:p-14 relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-xl shadow-primary/20">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5">{t("project.why.title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto text-lg">
                {t("project.why.text")}
              </p>
              <div className="bg-secondary/50 rounded-2xl p-7 mb-10 max-w-xl mx-auto border border-primary/10 backdrop-blur-sm">
                <p className="text-xl font-bold text-primary mb-3">
                  {t("project.why.join") || (language === "fr" ? "Rejoignez le mouvement !" : "Join the movement!")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("project.why.invite") || (language === "fr" 
                    ? "L'École Maria invite tous ses élèves, enseignants et parents à rejoindre cette initiative."
                    : "École Maria invites all its students, teachers and parents to join this initiative.")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/guide">
                  <Button size="lg" className="group/btn relative overflow-hidden px-10 py-7 text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                    <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      {t("project.startLearning") || (language === "fr" ? "Commencer à apprendre" : "Start learning")}
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Button>
                </Link>
                <Link to="/activities">
                  <Button variant="outline" size="lg" className="px-10 py-7 text-lg border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                    <Play className="w-5 h-5 mr-2" />
                    {language === "fr" ? "Jouer aux jeux" : "Play games"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
