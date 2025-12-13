import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FileText, Palette, Video, ImageIcon, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function Resources() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();

  const resources = [
    { 
      icon: FileText, 
      key: "guides", 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      gradient: "from-blue-500/10 to-cyan-500/10",
      description: language === "fr" ? "Apprenez les bases du tri sélectif" : "Learn the basics of sorting"
    },
    { 
      icon: Palette, 
      key: "activities", 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      gradient: "from-purple-500/10 to-pink-500/10",
      description: language === "fr" ? "Jeux et activités interactifs" : "Interactive games and activities"
    },
    { 
      icon: Video, 
      key: "videos", 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      borderColor: "border-red-500/20",
      gradient: "from-red-500/10 to-orange-500/10",
      description: language === "fr" ? "Vidéos éducatives sur le recyclage" : "Educational videos on recycling"
    },
    { 
      icon: ImageIcon, 
      key: "posters", 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      borderColor: "border-green-500/20",
      gradient: "from-green-500/10 to-emerald-500/10",
      description: language === "fr" ? "Affiches à imprimer et partager" : "Posters to print and share"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <BookOpen className="w-4 h-4" />
              <span>{language === "fr" ? "Centre de Ressources" : "Resource Center"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("resources.title")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("resources.subtitle")}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {resources.map((resource, index) => (
              <Card
                key={resource.key}
                className={`scroll-reveal hover:shadow-xl transition-all duration-300 border-2 ${resource.borderColor} group cursor-pointer overflow-hidden hover:-translate-y-2`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (resource.key === "posters") navigate("/posters");
                  if (resource.key === "guides") navigate("/guide");
                  if (resource.key === "videos") navigate("/videos");
                  if (resource.key === "activities") navigate("/activities");
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                <CardContent className="p-8 relative">
                  <div className={`w-16 h-16 rounded-2xl ${resource.bg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                    <resource.icon className={`w-8 h-8 ${resource.color}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                    {t(`resources.${resource.key}`)}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {resource.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full group/btn border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    {t("resources.view")}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center scroll-reveal">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-8 md:p-10">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {language === "fr" ? "Prêt à commencer ?" : "Ready to start?"}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  {language === "fr" 
                    ? "Explorez nos ressources et devenez un champion du recyclage !"
                    : "Explore our resources and become a recycling champion!"}
                </p>
                <Button size="lg" className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => navigate("/guide")}>
                  {language === "fr" ? "Commencer le guide" : "Start the guide"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
