import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { 
  FileText, Palette, Video, ImageIcon, 
  ArrowRight, Sparkles, BookOpen, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define resource type for better type safety
interface ResourceItem {
  icon: React.ComponentType<{ className?: string }>;
  key: "guides" | "activities" | "videos" | "posters";
  color: string;
  bg: string;
  borderColor: string;
  gradient: string;
  description: string;
  route: string;
}

export default function Resources() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();

  // Memoize resources to prevent unnecessary re-renders
  const resources: ResourceItem[] = useMemo(() => [
    { 
      icon: FileText, 
      key: "guides", 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20 hover:border-blue-500/40",
      gradient: "from-blue-500/10 to-cyan-500/10",
      description: language === "fr" ? "Apprenez les bases du tri sélectif" : "Learn the basics of sorting",
      route: "/guide"
    },
    { 
      icon: Palette, 
      key: "activities", 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/20 hover:border-purple-500/40",
      gradient: "from-purple-500/10 to-pink-500/10",
      description: language === "fr" ? "Jeux et activités interactifs" : "Interactive games and activities",
      route: "/activities"
    },
    { 
      icon: Video, 
      key: "videos", 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      borderColor: "border-red-500/20 hover:border-red-500/40",
      gradient: "from-red-500/10 to-orange-500/10",
      description: language === "fr" ? "Vidéos éducatives sur le recyclage" : "Educational videos on recycling",
      route: "/videos"
    },
    { 
      icon: ImageIcon, 
      key: "posters", 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      borderColor: "border-green-500/20 hover:border-green-500/40",
      gradient: "from-green-500/10 to-emerald-500/10",
      description: language === "fr" ? "Affiches à imprimer et partager" : "Posters to print and share",
      route: "/posters"
    },
  ], [language]);

  // Memoize click handler
  const handleResourceClick = useCallback((route: string) => {
    navigate(route);
  }, [navigate]);

  // Memoize CTA text
  const ctaText = useMemo(() => ({
    title: language === "fr" ? "Prêt à commencer ?" : "Ready to start?",
    description: language === "fr" 
      ? "Explorez nos ressources et devenez un champion du recyclage !"
      : "Explore our resources and become a recycling champion!",
    button: language === "fr" ? "Commencer le guide" : "Start the guide"
  }), [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Background decorations - optimized with reduced motion preference */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl motion-safe:animate-pulse" />
        <div 
          className="absolute bottom-40 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl motion-safe:animate-pulse" 
          style={{ animationDelay: '1s' }} 
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12 md:mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20 hover:bg-primary/15 transition-colors duration-300">
              <BookOpen className="w-4 h-4" />
              <span>{language === "fr" ? "Centre de Ressources" : "Resource Center"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("resources.title")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("resources.subtitle")}
            </p>
          </header>

          {/* Resources Grid */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mb-12">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card
                  key={resource.key}
                  className={cn(
                    "scroll-reveal hover:shadow-xl transition-all duration-300 border-2",
                    resource.borderColor,
                    "group cursor-pointer overflow-hidden hover:-translate-y-1 active:scale-[0.99]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleResourceClick(resource.route)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleResourceClick(resource.route);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Navigate to ${t(`resources.${resource.key}`)}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                  <CardContent className="p-6 md:p-8 relative">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className={cn(
                        "w-14 h-14 md:w-16 md:h-16 rounded-2xl",
                        resource.bg,
                        "flex items-center justify-center",
                        "transition-transform duration-300 group-hover:scale-110",
                        "flex-shrink-0 shadow-lg"
                      )}>
                        <Icon className={cn("w-7 h-7 md:w-8 md:h-8", resource.color)} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                          {t(`resources.${resource.key}`)}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 md:mb-6">
                          {resource.description}
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full group/btn border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          <span className="flex items-center justify-center">
                            {t("resources.view")}
                            <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* CTA Section */}
          <section className="mt-12 md:mt-16 text-center scroll-reveal">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-6 md:p-10">
                <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {ctaText.title}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  {ctaText.description}
                </p>
                <Button 
                  size="lg" 
                  className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={() => navigate("/guide")}
                >
                  {ctaText.button}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
