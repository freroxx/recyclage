import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Globe, Sparkles } from "lucide-react";

interface Poster {
  id: number;
  imageUrl?: string;
  embedUrl?: string;
  viewUrl?: string;
  title: string;
  description: string;
  author: string;
  language: "fr" | "en";
  tags: string[];
}

export default function Posters() {
  const { t, language } = useLanguage();
  useScrollReveal();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoster, setHoveredPoster] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized poster data
  const yahiaPosters = useMemo<Poster[]>(() => {
    // Only show Yahia's posters in French
    if (language !== 'fr') return [];
    
    return [
      {
        id: 1,
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
        viewUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?utm_content=DAG5KNBOplY&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
        title: "Sauver la Terre avec les 3R",
        description: "Concept Réduire, Réutiliser, Recycler avec un design vibrant",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["3R", "environnement", "concept", "réduction"]
      },
      {
        id: 2,
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
        viewUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?utm_content=DAG5KD43qYg&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
        title: "Campagne de Recyclage Minimaliste",
        description: "Design épuré et minimaliste promouvant les habitudes de recyclage",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["minimaliste", "campagne", "épuré", "habitudes"]
      }
    ];
  }, [language]);

  const salsabilePosters = useMemo<Poster[]>(() => {
    if (language === 'en') {
      return [
        {
          id: 3,
          imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
          title: "Earth Day Conversation Starters",
          description: "Engaging questions to spark environmental discussions",
          author: "Salsabile",
          language: "en",
          tags: ["earth day", "conversation", "discussion", "engagement"]
        },
        {
          id: 4,
          imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
          title: "Cat and His Recycling Bins",
          description: "Fun and educational poster featuring recycling mascot",
          author: "Salsabile",
          language: "en",
          tags: ["fun", "mascot", "educational", "playful"]
        },
        {
          id: 5,
          imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
          title: "Easy Zero Waste",
          description: "Simple steps to achieve zero waste lifestyle",
          author: "Salsabile",
          language: "en",
          tags: ["zero waste", "simple", "lifestyle", "eco-friendly"]
        }
      ];
    } else {
      return [
        {
          id: 6,
          imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
          title: "Recyclage au Quotidien",
          description: "Guide pratique pour le recyclage de tous les jours",
          author: "Salsabile",
          language: "fr",
          tags: ["quotidien", "pratique", "guide", "recyclage"]
        },
        {
          id: 7,
          imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
          title: "École Verte et Responsable",
          description: "Poster éducatif pour une école plus respectueuse de l'environnement",
          author: "Salsabile",
          language: "fr",
          tags: ["école", "éducatif", "responsable", "vert"]
        }
      ];
    }
  }, [language]);

  const allPosters = useMemo(() => [...yahiaPosters, ...salsabilePosters], [yahiaPosters, salsabilePosters]);

  const filteredPosters = useMemo(() => {
    if (!searchQuery) return allPosters;
    
    const query = searchQuery.toLowerCase();
    return allPosters.filter(poster =>
      poster.title.toLowerCase().includes(query) ||
      poster.description.toLowerCase().includes(query) ||
      poster.author.toLowerCase().includes(query) ||
      poster.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allPosters, searchQuery]);

  // Handle opening in new tab
  const handleOpenNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-ping animation-delay-300"></div>
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
          <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-secondary animate-pulse animation-delay-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-l from-secondary/10 to-transparent rounded-full blur-3xl animate-float-slow animation-delay-1000"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-particle"
            style={{
              '--delay': `${i * 200}ms`,
              '--duration': `${3 + Math.random() * 4}s`,
              '--x-start': `${Math.random() * 100}%`,
              '--y-start': `${Math.random() * 100}%`,
              '--size': `${Math.random() * 3 + 1}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-8 relative animate-fade-in-down">
              <div className="relative">
                <h1 className="relative text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                  {t("posters.title")}
                </h1>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
              {t("posters.subtitle")}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-500">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors duration-300 group-focus-within:text-primary" />
              <input
                type="text"
                placeholder={language === 'en' 
                  ? "Search posters by title, description, or tags..." 
                  : "Rechercher des affiches par titre, description ou tags..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-card/60 backdrop-blur-sm border-2 border-primary/10 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results Info */}
          {filteredPosters.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex flex-col items-center gap-4 max-w-sm">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-pulse">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? "Try different search terms or browse all posters" 
                      : "Essayez d'autres termes de recherche ou parcourez toutes les affiches"}
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 active:scale-95"
                >
                  {language === 'en' ? "Browse All" : "Parcourir tout"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {filteredPosters.length} {language === 'en' ? "posters" : "affiches"}
                    </h3>
                    {searchQuery && (
                      <span className="text-sm text-muted-foreground">
                        {language === 'en' ? "for" : "pour"} "{searchQuery}"
                      </span>
                    )}
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-primary hover:text-secondary transition-colors duration-200 flex items-center gap-1"
                    >
                      {language === 'en' ? "Clear search" : "Effacer la recherche"}
                    </button>
                  )}
                </div>
              </div>

              {/* Posters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosters.map((poster, index) => (
                  <div
                    key={poster.id}
                    className="animate-fade-in-up scroll-reveal"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <Card 
                      className="overflow-hidden hover:shadow-2xl transition-all duration-500 border border-primary/10 backdrop-blur-sm bg-card/60 h-full group"
                      onMouseEnter={() => setHoveredPoster(poster.id)}
                      onMouseLeave={() => setHoveredPoster(null)}
                    >
                      {/* Poster Content */}
                      <div className="relative w-full h-0 pb-[125%] overflow-hidden rounded-t-lg">
                        {/* Poster Image/Embed */}
                        {poster.embedUrl ? (
                          <iframe
                            loading="lazy"
                            className="absolute w-full h-full top-0 left-0 border-none"
                            src={poster.embedUrl}
                            allowFullScreen
                            allow="fullscreen"
                            title={poster.title}
                          />
                        ) : (
                          <img
                            src={poster.imageUrl}
                            alt={poster.title}
                            className="absolute w-full h-full top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        )}
                        
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Language Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                            poster.language === 'en' 
                              ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                          }`}>
                            {poster.language.toUpperCase()}
                          </span>
                        </div>
                        
                        {/* Open Button - Always visible under embed */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)]">
                          <button
                            onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl || poster.embedUrl || '#')}
                            className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm rounded-lg font-medium text-foreground hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {language === 'en' ? "Open in new tab" : "Ouvrir dans un nouvel onglet"}
                          </button>
                        </div>
                      </div>
                      
                      {/* Poster Info */}
                      <div className="p-5 bg-gradient-to-b from-card to-card/80">
                        <div className="mb-3">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                            {poster.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {poster.description}
                          </p>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs rounded-full bg-primary/5 text-primary/80 border border-primary/10 transition-colors duration-300 hover:bg-primary/10 hover:text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              poster.author === "Yahia Ikni" 
                                ? 'bg-blue-500 animate-pulse' 
                                : 'bg-purple-500 animate-pulse'
                            }`}></div>
                            <span className="text-sm text-muted-foreground">
                              {t("home.presentation.by")}{" "}
                              <span className="font-medium text-foreground">{poster.author}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer Note */}
          {!searchQuery && (
            <div className="mt-16 text-center animate-fade-in-up animation-delay-1000">
              <div className="inline-block max-w-xl mx-auto">
                <p className="text-muted-foreground mb-4">
                  {t("posters.communityNote")}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <Sparkles className="w-4 h-4 text-primary/60 animate-pulse" />
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? "Community powered" : "Propulsé par la communauté"}
                  </span>
                  <Sparkles className="w-4 h-4 text-secondary/60 animate-pulse animation-delay-500" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translate(var(--x-start), var(--y-start)) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(
              calc(var(--x-start) + 20px),
              calc(var(--y-start) - 30px)
            ) scale(1.2);
            opacity: 0.6;
          }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-particle {
          background: radial-gradient(circle, rgba(var(--primary-rgb), 0.2) 0%, transparent 70%);
          animation: particle-float var(--duration) ease-in-out infinite var(--delay);
          width: var(--size);
          height: var(--size);
          left: var(--x-start);
          top: var(--y-start);
        }

        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 4s ease-in-out infinite;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .scroll-reveal.scroll-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-500 { animation-delay: 500ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }
      `}</style>
    </div>
  );
}
