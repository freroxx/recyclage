import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Sparkles, Leaf, Filter, Globe } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  // Memoized poster data
  const yahiaPosters = useMemo<Poster[]>(() => {
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
    if (!searchQuery.trim()) return allPosters;
    
    const query = searchQuery.toLowerCase().trim();
    return allPosters.filter(poster =>
      poster.title.toLowerCase().includes(query) ||
      poster.description.toLowerCase().includes(query) ||
      poster.author.toLowerCase().includes(query) ||
      poster.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allPosters, searchQuery]);

  const handleOpenNewTab = useCallback((url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50/50">
        <div className="relative">
          <div className="w-20 h-20 border-3 border-emerald-200 rounded-full animate-spin">
            <div className="absolute inset-0 border-3 border-transparent border-t-emerald-500 rounded-full"></div>
          </div>
          <Leaf className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 animate-bounce animation-delay-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 via-white to-emerald-50/30">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-100/40 to-transparent rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-l from-emerald-200/30 to-transparent rounded-full blur-3xl animate-float-slow animation-delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(90deg,#22c55e_1px,transparent_1px),linear-gradient(180deg,#22c55e_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with improved readability */}
          <div className="text-center mb-16">
            <div className="inline-block mb-10">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse animation-delay-300"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse animation-delay-600"></div>
                  </div>
                </div>
                
                {/* Main title with better contrast */}
                <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 bg-clip-text text-transparent animate-gradient">
                      {t("posters.title")}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 blur-xl"></span>
                  </span>
                </h1>
                
                {/* Subtle underline */}
                <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mx-auto mt-6 opacity-60"></div>
              </div>
            </div>
            
            {/* Subtitle with improved readability */}
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-light mb-8 animate-fade-in">
              {t("posters.subtitle")}
            </p>
            
            {/* Community indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium animate-fade-in animation-delay-300">
              <Globe className="w-4 h-4" />
              <span>{t("posters.allCommunityMade")}</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-16 animate-fade-in-up animation-delay-500">
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-emerald-600" />
                <span className="text-sm text-gray-600 font-medium">
                  {language === 'en' ? "Find posters" : "Trouver des affiches"}
                </span>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder={language === 'en' 
                    ? "Search by title, description, or tags..." 
                    : "Rechercher par titre, description ou tags..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-white border-2 border-emerald-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 shadow-sm hover:border-emerald-200"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-colors duration-300 group-focus-within:text-emerald-600" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {filteredPosters.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex flex-col items-center gap-5 max-w-sm">
                <div className="p-4 rounded-full bg-emerald-50 border border-emerald-100">
                  <Search className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'en' 
                      ? "Try different keywords or browse all posters" 
                      : "Essayez d'autres mots-clés ou parcourez toutes les affiches"}
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors duration-300 active:scale-95"
                >
                  {language === 'en' ? "View All Posters" : "Voir toutes les affiches"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-10 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <Filter className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {filteredPosters.length} {language === 'en' ? "posters" : "affiches"}
                      </h3>
                      {searchQuery && (
                        <p className="text-sm text-gray-600 mt-1">
                          {language === 'en' ? "Results for" : "Résultats pour"} "
                          <span className="font-medium text-emerald-700">{searchQuery}</span>"
                        </p>
                      )}
                    </div>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
                    >
                      {language === 'en' ? "Clear" : "Effacer"}
                    </button>
                  )}
                </div>
              </div>

              {/* Posters Grid - Improved layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosters.map((poster, index) => (
                  <div
                    key={poster.id}
                    className="animate-card-enter scroll-reveal"
                    style={{
                      animationDelay: `${index * 120}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <Card 
                      className="overflow-hidden border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg transition-all duration-500 h-full group hover:-translate-y-1"
                    >
                      {/* Poster Container */}
                      <div className="relative w-full h-0 pb-[125%] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        {/* Poster Content */}
                        <div className="absolute inset-2 rounded-lg overflow-hidden bg-white shadow-inner">
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
                              className="absolute w-full h-full top-0 left-0 object-cover group-hover:scale-102 transition-transform duration-700"
                              loading="lazy"
                            />
                          )}
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Language Badge */}
                          <div className="absolute top-3 right-3">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm ${
                              poster.language === 'en' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {poster.language.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Open in New Tab Button - Improved visibility */}
                          <div className="absolute bottom-3 left-3 right-3">
                            <button
                              onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl || poster.embedUrl || '')}
                              className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-medium hover:shadow-md transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 active:scale-98"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {language === 'en' ? "Open in new tab" : "Ouvrir"}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Poster Info - Improved contrast */}
                      <div className="p-5">
                        {/* Title and Description */}
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors duration-300">
                            {poster.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {poster.description}
                          </p>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors duration-300 cursor-default"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Footer */}
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span className="text-sm text-gray-700">
                                {t("home.presentation.by")}{" "}
                                <span className="font-medium text-gray-900">{poster.author}</span>
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-500" />
                              <span>Community</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer Message */}
          {!searchQuery && filteredPosters.length > 0 && (
            <div className="mt-20 text-center animate-fade-in-up animation-delay-1000">
              <div className="inline-block max-w-md mx-auto">
                <div className="p-6 rounded-xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-100">
                  <p className="text-gray-700 mb-3">
                    {t("posters.communityNote")}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
                    <span className="text-sm font-medium text-emerald-700">
                      {language === 'en' ? "Community Driven" : "Propulsé par la communauté"}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          50% { 
            transform: translate(20px, -20px) scale(1.05);
          }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animation classes */
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease-in-out infinite;
        }

        .animate-card-enter {
          animation: card-enter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                      transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-reveal.scroll-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Utility classes */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .scale-102 {
          transform: scale(1.02);
        }

        .scale-98 {
          transform: scale(0.98);
        }

        .border-3 {
          border-width: 3px;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
