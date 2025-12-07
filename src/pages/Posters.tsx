import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { Search, ExternalLink, Globe, Star } from "lucide-react";

export default function Posters() {
  const { t, language } = useLanguage();
  useScrollReveal();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoster, setHoveredPoster] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "yahia" | "salsabile">("all");

  const yahiaPosters = [
    {
      id: 1,
      embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
      viewUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?utm_content=DAG5KNBOplY&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
      title: language === 'en' ? "Save the Earth with 3R" : "Sauver la Terre avec les 3R",
      description: language === 'en' 
        ? "Reduce, Reuse, Recycle concept with vibrant design" 
        : "Concept Réduire, Réutiliser, Recycler avec un design vibrant",
      author: "Yahia Ikni",
      language: "fr",
      tags: ["3R", "environment", "concept"]
    },
    {
      id: 2,
      embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
      viewUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?utm_content=DAG5KD43qYg&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
      title: language === 'en' ? "Minimalist Recycling Campaign" : "Campagne de Recyclage Minimaliste",
      description: language === 'en' 
        ? "Clean and minimalist design promoting recycling habits" 
        : "Design épuré et minimaliste promouvant les habitudes de recyclage",
      author: "Yahia Ikni",
      language: "fr",
      tags: ["minimalist", "campaign", "clean"]
    }
  ];

  const salsabilePosters = useMemo(() => {
    if (language === 'en') {
      return [
        {
          id: 3,
          imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
          title: "Earth Day Conversation Starters",
          description: "Engaging questions to spark environmental discussions",
          author: "Salsabile",
          language: "en",
          tags: ["earth day", "conversation", "engagement"]
        },
        {
          id: 4,
          imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
          title: "Cat and His Recycling Bins",
          description: "Fun and educational poster featuring recycling mascot",
          author: "Salsabile",
          language: "en",
          tags: ["fun", "mascot", "educational"]
        },
        {
          id: 5,
          imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
          title: "Easy Zero Waste",
          description: "Simple steps to achieve zero waste lifestyle",
          author: "Salsabile",
          language: "en",
          tags: ["zero waste", "simple", "lifestyle"]
        }
      ];
    } else {
      return [
        {
          id: 6,
          imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
          title: "Affiche Française 1",
          description: "Design français sur le recyclage quotidien",
          author: "Salsabile",
          language: "fr",
          tags: ["français", "quotidien", "recyclage"]
        },
        {
          id: 7,
          imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
          title: "Affiche Française 2",
          description: "Poster éducatif pour les écoles",
          author: "Salsabile",
          language: "fr",
          tags: ["école", "éducatif", "français"]
        }
      ];
    }
  }, [language]);

  const allPosters = useMemo(() => [
    ...yahiaPosters,
    ...salsabilePosters
  ], [yahiaPosters, salsabilePosters]);

  const filteredPosters = useMemo(() => {
    let filtered = allPosters;

    // Apply author filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(poster => 
        activeFilter === "yahia" 
          ? poster.author === "Yahia Ikni"
          : poster.author === "Salsabile"
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(poster =>
        poster.title.toLowerCase().includes(query) ||
        poster.description.toLowerCase().includes(query) ||
        poster.author.toLowerCase().includes(query) ||
        poster.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allPosters, activeFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-ping animation-delay-300"></div>
          </div>
          <div className="absolute -inset-4 border-4 border-transparent border-t-secondary rounded-full animate-spin animation-delay-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/10"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse animation-delay-1500"></div>
        </div>
        
        {/* Enhanced floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `radial-gradient(circle, rgba(var(--primary-rgb), ${0.1 + Math.random() * 0.2}) 0%, transparent 70%)`,
              animation: `float ${4 + Math.random() * 5}s infinite ease-in-out ${Math.random() * 3}s`,
              transform: `scale(${0.3 + Math.random() * 0.7})`,
            }}
          />
        ))}
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 95%, var(--primary) 100%),
                              linear-gradient(0deg, transparent 95%, var(--primary) 100%)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with enhanced animation */}
          <div className="text-center mb-12 animate-fade-in-down">
            <div className="inline-block mb-8 relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full blur-xl animate-pulse"></div>
                <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                  {t("posters.title")}
                </h1>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent animate-pulse animation-delay-500"></div>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
              {t("posters.subtitle")}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12 animate-fade-in-up animation-delay-500">
            <div className="max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-6 group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-hover:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search posters by title, author, or tags..." : "Rechercher des affiches par titre, auteur ou tags..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card/50 backdrop-blur-sm border-2 border-primary/10 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeFilter === "all"
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                      : "bg-card/50 backdrop-blur-sm border border-primary/10 text-foreground hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {language === 'en' ? "All Posters" : "Toutes les affiches"}
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-black/10">
                    {allPosters.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveFilter("yahia")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeFilter === "yahia"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-card/50 backdrop-blur-sm border border-blue-500/10 text-foreground hover:border-blue-500/30 hover:shadow-md"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Yahia's Designs
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-black/10">
                    {yahiaPosters.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveFilter("salsabile")}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeFilter === "salsabile"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                      : "bg-card/50 backdrop-blur-sm border border-purple-500/10 text-foreground hover:border-purple-500/30 hover:shadow-md"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Salsabile's Designs
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-black/10">
                    {salsabilePosters.length}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Community Badge */}
          {searchQuery === "" && activeFilter === "all" && (
            <div className="text-center mb-12 animate-fade-in-up animation-delay-700">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
                </div>
                <span className="text-base font-medium text-foreground">
                  {t("posters.allCommunityMade")}
                </span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-primary/60 animate-pulse"></div>
                  <div className="w-1 h-1 rounded-full bg-secondary/60 animate-pulse animation-delay-300"></div>
                  <div className="w-1 h-1 rounded-full bg-primary/60 animate-pulse animation-delay-600"></div>
                </div>
              </div>
            </div>
          )}

          {/* Search Results Info */}
          {filteredPosters.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'en' 
                      ? "Try different search terms or clear the filters" 
                      : "Essayez d'autres termes de recherche ou effacez les filtres"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  {language === 'en' ? "Show All Posters" : "Afficher toutes les affiches"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {language === 'en' ? "Showing" : "Affichage"} {filteredPosters.length} {language === 'en' ? "posters" : "affiches"}
                    </h3>
                    {searchQuery && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'en' ? "Search results for:" : "Résultats pour :"} "{searchQuery}"
                      </p>
                    )}
                  </div>
                  {filteredPosters.length < allPosters.length && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setActiveFilter("all");
                      }}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      {language === 'en' ? "Clear filters" : "Effacer les filtres"} →
                    </button>
                  )}
                </div>
              </div>

              {/* Posters Grid */}
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosters.map((poster, index) => (
                  <div
                    key={poster.id}
                    className={`transform transition-all duration-700 ${
                      hoveredPoster === poster.id 
                        ? 'scale-[1.03] translate-y-[-4px]' 
                        : 'hover:translate-y-[-2px]'
                    } animate-fade-in-up scroll-fade-in`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                    onMouseEnter={() => setHoveredPoster(poster.id)}
                    onMouseLeave={() => setHoveredPoster(null)}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent group hover:border-primary/20 backdrop-blur-sm bg-card/60 h-full">
                      {/* Poster Image/Embed */}
                      <div className="relative w-full h-0 pb-[125%] overflow-hidden rounded-t-xl group-hover:rounded-b-xl transition-all duration-500">
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        {/* Poster content */}
                        {poster.embedUrl ? (
                          <iframe
                            loading="lazy"
                            className="absolute w-full h-full top-0 left-0 border-none transform group-hover:scale-105 transition-transform duration-700"
                            src={poster.embedUrl}
                            allowFullScreen
                            allow="fullscreen"
                            title={poster.title}
                          />
                        ) : (
                          <img
                            src={poster.imageUrl}
                            alt={poster.title}
                            className="absolute w-full h-full top-0 left-0 object-cover transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                        )}
                        
                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                        
                        {/* Action Buttons */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-8 group-hover:translate-y-0 space-y-2">
                          <button
                            onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {t("posters.viewFullSize")}
                          </button>
                          <button
                            onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl)}
                            className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-foreground hover:bg-white transition-all duration-300 flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {language === 'en' ? "Open in new tab" : "Ouvrir dans un nouvel onglet"}
                          </button>
                        </div>
                        
                        {/* Language Badge */}
                        <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
                            poster.language === 'en' 
                              ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                          }`}>
                            {poster.language === 'en' ? 'EN' : 'FR'}
                          </span>
                        </div>
                        
                        {/* Author Badge */}
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                          <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white">
                            {t("home.presentation.by")} {poster.author}
                          </span>
                        </div>
                      </div>
                      
                      {/* Poster Info */}
                      <div className="p-5 md:p-6 bg-gradient-to-b from-card to-card/80">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                              {poster.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {poster.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {poster.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs rounded-full bg-primary/5 text-primary/80 border border-primary/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-primary/10">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              poster.author === "Yahia Ikni" ? 'bg-blue-500' : 'bg-purple-500'
                            } animate-pulse`}></div>
                            <span className="text-sm text-muted-foreground">
                              {t("home.presentation.by")} <span className="font-medium text-foreground">{poster.author}</span>
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl)}
                            className="text-primary hover:text-secondary transition-colors duration-300 flex items-center gap-1 text-sm font-medium"
                          >
                            {language === 'en' ? "View" : "Voir"}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer Note */}
          {searchQuery === "" && activeFilter === "all" && (
            <div className="mt-24 text-center animate-fade-in-up animation-delay-1000">
              <div className="inline-block max-w-2xl mx-auto">
                <p className="text-lg text-muted-foreground mb-6">
                  {t("posters.communityNote")}
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? "Made with ♥ by the community" : "Fait avec ♥ par la communauté"}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(var(--scale)); 
          }
          33% { 
            transform: translateY(-20px) translateX(10px) scale(var(--scale)); 
          }
          66% { 
            transform: translateY(10px) translateX(-10px) scale(var(--scale)); 
          }
        }

        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 4s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .scroll-fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .scroll-fade-in.scroll-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-1500 { animation-delay: 1500ms; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        :root {
          --primary-rgb: 59 130 246;
        }
      `}</style>
    </div>
  );
}
