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
  Sparkles
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export default function Project() {
  const { t, language } = useLanguage();
  useScrollReveal();

  const bins = [
    { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", borderColor: "border-amber-500/30", label: t("project.bins.paper") },
    { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", borderColor: "border-blue-500/30", label: t("project.bins.plastic") },
    { icon: Trash2, color: "text-gray-500", bg: "bg-gray-500/10", borderColor: "border-gray-500/30", label: t("project.bins.metal") },
    { icon: Apple, color: "text-green-500", bg: "bg-green-500/10", borderColor: "border-green-500/30", label: t("project.bins.organic") },
  ];

  const actions = [
    {
      icon: Recycle,
      title: t("project.bins.title"),
      description: t("project.bins.text"),
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
  ];

  const impacts = [
    t("project.impact.1"),
    t("project.impact.2"),
    t("project.impact.3"),
    t("project.impact.4")
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center mb-16 md:mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{language === "fr" ? "Initiative Écologique" : "Ecological Initiative"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-green-600 to-primary bg-clip-text text-transparent leading-tight">
            {t("project.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t("project.intro")}
          </p>
        </div>

        {/* Goal Section */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-20 scroll-rotate-in">
          <Card className="border-2 border-primary/20 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-6 md:p-8 transition-all duration-500 group-hover:from-primary/15 group-hover:via-green-500/15 group-hover:to-primary/15">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">{t("project.goal.title")}</h2>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-foreground/90">
                {t("project.goal.text")}
              </p>
            </div>
          </Card>
        </div>

        {/* Sorting Bins */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold scroll-reveal">
              {language === "fr" ? "Nos Bacs de Tri" : "Our Sorting Bins"}
            </h2>
            <p className="text-muted-foreground mt-2 scroll-reveal">
              {language === "fr" ? "4 types de déchets, 4 bacs de couleurs" : "4 types of waste, 4 colored bins"}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bins.map((bin, index) => {
              const BinIcon = bin.icon;
              return (
                <Card
                  key={bin.label}
                  className={`hover:shadow-xl transition-all duration-500 hover:-translate-y-2 scroll-reveal border-2 ${bin.borderColor} group`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${bin.bg} flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110`}>
                      <BinIcon className={`w-8 h-8 md:w-10 md:h-10 ${bin.color}`} />
                    </div>
                    <h3 className="font-bold text-sm md:text-base">{bin.label}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Actions Section */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold scroll-reveal">{t("project.actions.title")}</h2>
            <p className="text-muted-foreground mt-2 scroll-reveal">
              {language === "fr" ? "Découvrez comment nous agissons au quotidien" : "Discover how we act every day"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Card
                  key={action.title}
                  className={`scroll-reveal hover:shadow-xl transition-all duration-500 border-2 ${action.borderColor} overflow-hidden group hover:-translate-y-1`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110`}>
                      <ActionIcon className={`w-6 h-6 md:w-7 md:h-7 ${action.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-lg md:text-xl mb-2">{action.title}</h3>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Impact Section */}
        <div className="max-w-5xl mx-auto mb-16 md:mb-20 scroll-fade-left">
          <Card className="border-2 border-green-500/20 shadow-xl overflow-hidden group">
            <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{t("project.impact.title")}</h2>
                  <p className="text-muted-foreground text-sm">{t("project.impact.text")}</p>
                </div>
              </div>
              <div className="grid gap-3">
                {impacts.map((impact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-background/60 hover:bg-background/80 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed text-sm md:text-base">{impact}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto text-center scroll-fade-right">
          <Card className="border-2 border-primary/30 shadow-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-green-500/5 to-primary/5">
            <CardContent className="p-8 md:p-12">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("project.why.title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                {t("project.why.text")}
              </p>
              <div className="bg-secondary/50 rounded-xl p-6 mb-8 max-w-xl mx-auto">
                <p className="text-lg font-semibold text-primary mb-2">
                  {t("project.why.join") || (language === "fr" ? "Rejoignez le mouvement !" : "Join the movement!")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("project.why.invite") || (language === "fr" 
                    ? "L'École Maria invite tous ses élèves, enseignants et parents à rejoindre cette initiative."
                    : "École Maria invites all its students, teachers and parents to join this initiative.")}
                </p>
              </div>
              <Link to="/guide">
                <Button size="lg" className="group">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t("project.startLearning") || (language === "fr" ? "Commencer à apprendre" : "Start learning")}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
