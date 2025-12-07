import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Sparkles, Leaf, Zap, Filter, Mail, Instagram, Upload, User, Palette, Send } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<"gallery" | "share">("gallery");

  // Initialize mounted state with optimized loading
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Memoized poster data - FIXED: Properly structured
  const postersData = useMemo(() => {
    const posters: Poster[] = [];
    
    if (language === 'fr') {
      // Yahia's posters for French
      posters.push(
        {
          id: 1,
          embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
          viewUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view",
          title: "Sauver la Terre avec les 3R",
          description: "Concept Réduire, Réutiliser, Recycler avec un design vibrant",
          author: "Yahia Ikni",
          language: "fr",
          tags: ["3R", "environnement", "concept", "réduction"]
        },
        {
          id: 2,
          embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
          viewUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view",
          title: "Campagne de Recyclage Minimaliste",
          description: "Design épuré et minimaliste promouvant les habitudes de recyclage",
          author: "Yahia Ikni",
          language: "fr",
          tags: ["minimaliste", "campagne", "épuré", "habitudes"]
        },
        // Salsabile's posters for French
        {
          id: 3,
          imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
          title: "Recyclage au Quotidien",
          description: "Guide pratique pour le recyclage de tous les jours",
          author: "Salsabile",
          language: "fr",
          tags: ["quotidien", "pratique", "guide", "recyclage"]
        },
        {
          id: 4,
          imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
          title: "École Verte et Responsable",
          description: "Poster éducatif pour une école plus respectueuse de l'environnement",
          author: "Salsabile",
          language: "fr",
          tags: ["école", "éducatif", "responsable", "vert"]
        }
      );
    } else {
      // English posters (only Salsabile's for English)
      posters.push(
        {
          id: 5,
          imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
          title: "Earth Day Conversation Starters",
          description: "Engaging questions to spark environmental discussions",
          author: "Salsabile",
          language: "en",
          tags: ["earth day", "conversation", "discussion", "engagement"]
        },
        {
          id: 6,
          imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
          title: "Cat and His Recycling Bins",
          description: "Fun and educational poster featuring recycling mascot",
          author: "Salsabile",
          language: "en",
          tags: ["fun", "mascot", "educational", "playful"]
        },
        {
          id: 7,
          imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
          title: "Easy Zero Waste",
          description: "Simple steps to achieve zero waste lifestyle",
          author: "Salsabile",
          language: "en",
          tags: ["zero waste", "simple", "lifestyle", "eco-friendly"]
        }
      );
    }
    
    return posters;
  }, [language]);

  const filteredPosters = useMemo(() => {
    if (!searchQuery.trim()) return postersData;
    
    const query = searchQuery.toLowerCase().trim();
    return postersData.filter(poster =>
      poster.title.toLowerCase().includes(query) ||
      poster.description.toLowerCase().includes(query) ||
      poster.author.toLowerCase().includes(query) ||
      poster.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [postersData, searchQuery]);

  // Handle opening in new tab
  const handleOpenNewTab = useCallback((url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Copy contact info to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert(`${language === 'en' ? 'Copied to clipboard!' : 'Copié dans le presse-papier!'}`);
  }, [language]);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-500/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Enhanced Background with subtle animations */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-background to-emerald-900/5 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] 
                        bg-gradient-to-r from-emerald-400/10 to-transparent rounded-full blur-3xl 
                        animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] 
                        bg-gradient-to-l from-emerald-600/10 to-transparent rounded-full blur-3xl 
                        animate-float-slow animation-delay-2000" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header with enhanced animations */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <div className="inline-block mb-8 md:mb-10 relative">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 
                             bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700 
                             dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-500 
                             bg-clip-text text-transparent tracking-tight animate-gradient">
                {t("posters.title") || "Posters Gallery"}
              </h1>
              <div className="relative h-1.5 overflow-hidden max-w-2xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                animate-shimmer"></div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-emerald-800/70 dark:text-emerald-200/70 
                          max-w-2xl md:max-w-3xl mx-auto leading-relaxed mb-8 animate-fade-in-up animation-delay-200">
              {t("posters.subtitle") || "Browse and share environmental posters"}
            </p>
            
            {/* Navigation Tabs with enhanced animations */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-10 md:mb-12">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-500 
                           flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base
                           transform hover:-translate-y-1 active:scale-95
                           ${activeSection === "gallery" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white 
                                shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/80 border border-emerald-500/20
                                hover:border-emerald-500/30"}`}
              >
                <Palette className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                {language === 'en' ? "Gallery" : "Galerie"}
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-500 
                           flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base
                           transform hover:-translate-y-1 active:scale-95
                           ${activeSection === "share" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white 
                                shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/80 border border-emerald-500/20
                                hover:border-emerald-500/30"}`}
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                {language === 'en' ? "Share Your Art" : "Partagez votre art"}
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section with enhanced hover */}
              <div className="max-w-2xl md:max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up animation-delay-300">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 
                                rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                     text-emerald-600/70 dark:text-emerald-400/70 w-5 h-5 md:w-6 md:h-6
                                     transition-all duration-300 group-focus-within:scale-110
                                     group-focus-within:text-emerald-500" />
                    <input
                      type="text"
                      placeholder={language === 'en' 
                        ? "Search posters by title, description, or tags..." 
                        : "Rechercher des affiches..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 md:pl-16 pr-10 md:pr-12 py-3 md:py-4 bg-white/80 dark:bg-gray-900/80 
                               backdrop-blur-sm border-2 border-emerald-500/20 dark:border-emerald-500/30 
                               rounded-xl md:rounded-2xl text-base md:text-lg 
                               text-emerald-900 dark:text-emerald-100 
                               placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 
                               focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 
                               focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 
                               transition-all duration-300 hover:border-emerald-500/30 
                               group-hover:scale-[1.02] group-hover:shadow-lg"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 
                                 text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500
                                 transition-colors duration-200 hover:scale-110 p-1"
                        aria-label="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-16 md:py-24 animate-fade-in-up">
                  <div className="inline-flex flex-col items-center gap-4 md:gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full 
                                    bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 
                                    flex items-center justify-center animate-pulse-gentle">
                        <Search className="w-10 h-10 md:w-12 md:h-12 text-emerald-500/50" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                        {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                      </h3>
                      <p className="text-emerald-700/70 dark:text-emerald-300/70 text-sm md:text-base">
                        {language === 'en' 
                          ? "Try different keywords or browse all posters" 
                          : "Essayez d'autres mots-clés"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 md:px-8 py-2.5 md:py-3 rounded-full 
                               bg-gradient-to-r from-emerald-600 to-emerald-500 text-white 
                               font-semibold text-sm md:text-base hover:shadow-xl hover:shadow-emerald-500/30
                               transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                    >
                      {language === 'en' ? "View All Posters" : "Voir toutes les affiches"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-6 md:mb-10 animate-fade-in-up animation-delay-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-full bg-emerald-500/10 
                                      animate-pulse-gentle">
                          <Zap className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {language === 'en' ? "community posters" : "affiches"}
                          </h3>
                          {searchQuery && (
                            <p className="text-xs md:text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">
                              {language === 'en' ? "Showing results for" : "Résultats pour"} "
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {searchQuery}
                              </span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400 
                                   hover:text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full 
                                   bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-300
                                   transform hover:-translate-y-0.5 active:scale-95"
                        >
                          {language === 'en' ? "Clear" : "Effacer"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Posters Grid with enhanced animations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="scroll-reveal animate-card-enter"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                        onMouseEnter={() => setHoveredPoster(poster.id)}
                        onMouseLeave={() => setHoveredPoster(null)}
                      >
                        <Card 
                          className="overflow-hidden border border-emerald-500/10 dark:border-emerald-500/20 
                                   bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full 
                                   transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl 
                                   hover:shadow-emerald-500/20 group cursor-pointer"
                        >
                          {/* Poster Container */}
                          <div className="relative w-full pb-[130%] overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {poster.embedUrl ? (
                              <iframe
                                loading="lazy"
                                className="absolute inset-0 w-full h-full border-none group-hover:scale-105 transition-transform duration-700"
                                src={poster.embedUrl}
                                allowFullScreen
                                allow="fullscreen"
                                title={poster.title}
                              />
                            ) : (
                              <img
                                src={poster.imageUrl}
                                alt={poster.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            
                            {/* Enhanced Overlay with View Button */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
                                          opacity-0 group-hover:opacity-100 transition-all duration-500 
                                          flex items-end p-4">
                              <button
                                onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl || poster.embedUrl)}
                                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 
                                         text-white font-semibold hover:shadow-xl hover:shadow-emerald-500/40
                                         transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 
                                         opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 
                                         active:scale-95 group-hover:delay-100 hover:-translate-y-1"
                              >
                                <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110" />
                                {language === 'en' ? "View Full Size" : "Voir en taille réelle"}
                              </button>
                            </div>
                            
                            {/* Language Badge */}
                            <div className="absolute top-3 right-3 transform group-hover:scale-110 transition-transform duration-300">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                                poster.language === 'en' 
                                  ? 'bg-emerald-600/90 text-white shadow-lg'
                                  : 'bg-emerald-700/90 text-white shadow-lg'
                              }`}>
                                {poster.language.toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Author Tag */}
                            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 
                                          transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                              <span className="px-2.5 py-1 bg-emerald-900/90 backdrop-blur-sm rounded-full 
                                             text-xs text-white font-medium shadow-lg">
                                {poster.author}
                              </span>
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-4 md:p-5">
                            <div className="mb-3 md:mb-4">
                              <h3 className="font-bold text-lg md:text-xl text-emerald-900 dark:text-emerald-100 
                                           mb-1 md:mb-2 line-clamp-1 group-hover:text-emerald-700 
                                           transition-colors duration-300">
                                {poster.title}
                              </h3>
                              <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70 line-clamp-2 
                                          group-hover:text-emerald-800/80 transition-colors duration-300">
                                {poster.description}
                              </p>
                            </div>
                            
                            {/* Tags with hover effects */}
                            <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4">
                              {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 
                                           text-emerald-700 dark:text-emerald-300 border border-emerald-500/20
                                           hover:bg-emerald-500/20 hover:border-emerald-500/30 
                                           hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="pt-3 md:pt-4 border-t border-emerald-500/10 
                                          group-hover:border-emerald-500/20 transition-colors duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                                    poster.author === "Yahia Ikni" 
                                      ? 'bg-emerald-500' 
                                      : 'bg-emerald-400'
                                  }`}></div>
                                  <span className="text-sm text-emerald-700/80 dark:text-emerald-300/80 
                                                 group-hover:text-emerald-800 transition-colors duration-300">
                                    By{" "}
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                                      {poster.author}
                                    </span>
                                  </span>
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
                <div className="mt-12 md:mt-20 text-center animate-fade-in-up animation-delay-1000">
                  <div className="inline-block max-w-xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-6 md:p-8 rounded-2xl 
                                  bg-gradient-to-br from-white/30 to-emerald-500/5 
                                  dark:from-gray-900/50 dark:to-emerald-900/20 
                                  backdrop-blur-sm border border-emerald-500/10
                                  hover:border-emerald-500/20 hover:shadow-lg transition-all duration-300">
                      <Leaf className="w-8 h-8 text-emerald-500 mb-4 mx-auto animate-float-slow" />
                      <p className="text-base md:text-lg text-emerald-800/80 dark:text-emerald-200/80 mb-4">
                        {t("posters.communityNote") || "Join our community of environmental artists!"}
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse-gentle">
                          {language === 'en' ? "Made with ♻️ by the community" : "Fait avec ♻️ par la communauté"}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Share Your Art Section with enhanced animations */
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 md:mb-6">
                  {language === 'en' ? "Share Your Artwork" : "Partagez votre création"}
                </h2>
                <p className="text-base md:text-xl text-emerald-700/80 dark:text-emerald-300/80">
                  {language === 'en' 
                    ? "Join our community and inspire others with your environmental artwork" 
                    : "Rejoignez notre communauté et inspirez les autres"}
                </p>
              </div>

              {/* Steps with hover animations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                {[
                  {
                    step: 1,
                    icon: Palette,
                    title: language === 'en' ? "Create Your Art" : "Créez votre art",
                    description: language === 'en' 
                      ? "Design a poster or video about recycling, environment, or sustainability"
                      : "Créez une affiche ou une vidéo sur l'environnement"
                  },
                  {
                    step: 2,
                    icon: Send,
                    title: language === 'en' ? "Send to Us" : "Envoyez-nous",
                    description: language === 'en' 
                      ? "Share your creation via email or Instagram with your name"
                      : "Partagez votre création par email ou Instagram"
                  },
                  {
                    step: 3,
                    icon: User,
                    title: language === 'en' ? "Get Featured" : "Soyez mis en avant",
                    description: language === 'en' 
                      ? "We'll feature your work in our community gallery with credit"
                      : "Nous mettrons en avant votre travail avec crédit"
                  }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className="relative group transform hover:-translate-y-2 transition-all duration-500"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 
                                  rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm p-6 md:p-8 
                                  rounded-xl md:rounded-2xl border-2 border-emerald-500/10 h-full
                                  group-hover:border-emerald-500/30 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 
                                    rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 
                                    text-white text-lg md:text-2xl font-bold mb-4 
                                    group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <item.icon className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 mb-4 mx-auto 
                                          transform group-hover:scale-110 group-hover:rotate-12 
                                          transition-all duration-300" />
                      <h3 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 
                                   mb-2 md:mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-emerald-700/80 dark:text-emerald-300/80 
                                  group-hover:text-emerald-800/90 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information with enhanced buttons */}
              <div className="bg-gradient-to-br from-white/50 to-emerald-500/5 
                            dark:from-gray-900/50 dark:to-emerald-900/20 
                            backdrop-blur-sm rounded-xl md:rounded-3xl 
                            border-2 border-emerald-500/10 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 text-center">
                  {language === 'en' ? "Contact Information" : "Coordonnées"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Email */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 
                                  rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 dark:bg-gray-800/50 p-4 md:p-6 rounded-xl 
                                  border border-emerald-500/20 group-hover:border-emerald-500/30 
                                  transition-all duration-300">
                      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className="p-2 md:p-3 rounded-full bg-emerald-500/10 
                                      group-hover:bg-emerald-500/20 transition-colors duration-300">
                          <Mail className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 
                                         group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm md:text-base">
                            {language === 'en' ? "Email" : "Courriel"}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-sm md:text-base font-mono text-emerald-800 dark:text-emerald-200 break-all">
                          recyclagemaria@gmail.com
                        </code>
                        <button
                          onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                          className="ml-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-emerald-500/10 
                                   text-emerald-600 hover:bg-emerald-500/20 transition-all duration-300
                                   transform hover:-translate-y-0.5 active:scale-95 hover:shadow-lg
                                   flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
                          title={language === 'en' ? "Copy email" : "Copier l'email"}
                        >
                          {language === 'en' ? "Copy" : "Copier"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                                  rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 dark:bg-gray-800/50 p-4 md:p-6 rounded-xl 
                                  border border-emerald-500/20 group-hover:border-pink-500/30 
                                  transition-all duration-300">
                      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className="p-2 md:p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10
                                      group-hover:from-pink-500/20 group-hover:to-purple-500/20 
                                      transition-all duration-300">
                          <Instagram className="w-5 h-5 md:w-6 md:h-6 text-pink-600 
                                              group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm md:text-base">
                            Instagram
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-sm md:text-base font-mono text-emerald-800 dark:text-emerald-200 break-all">
                          @recyclage_projet
                        </code>
                        <button
                          onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                          className="ml-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg 
                                   bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                   font-semibold hover:shadow-xl hover:shadow-pink-500/30
                                   transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                                   flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap"
                        >
                          <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                          {language === 'en' ? "Follow" : "Suivre"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-xl 
                              bg-emerald-500/5 border border-emerald-500/20
                              hover:border-emerald-500/30 transition-all duration-300">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 md:mb-3 
                               flex items-center gap-2 text-sm md:text-base">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-emerald-600 animate-pulse-gentle" />
                    {language === 'en' ? "Submission Guidelines" : "Directives"}
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2 text-sm text-emerald-700/80 dark:text-emerald-300/80">
                    <li className="flex items-start gap-2 transition-colors duration-300 hover:text-emerald-800">
                      <span className="text-emerald-600 mt-1 text-xs">•</span>
                      <span>{language === 'en' 
                        ? "Include your full name for proper credit" 
                        : "Incluez votre nom complet"}</span>
                    </li>
                    <li className="flex items-start gap-2 transition-colors duration-300 hover:text-emerald-800">
                      <span className="text-emerald-600 mt-1 text-xs">•</span>
                      <span>{language === 'en' 
                        ? "Accepted formats: JPG, PNG, PDF, MP4" 
                        : "Formats acceptés : JPG, PNG, PDF, MP4"}</span>
                    </li>
                    <li className="flex items-start gap-2 transition-colors duration-300 hover:text-emerald-800">
                      <span className="text-emerald-600 mt-1 text-xs">•</span>
                      <span>{language === 'en' 
                        ? "Keep content educational and inspiring" 
                        : "Contenu éducatif et inspirant"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx global>{`
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(20px, -20px) scale(1.1) rotate(90deg); }
          50% { transform: translate(-10px, 10px) scale(0.95) rotate(180deg); }
          75% { transform: translate(-20px, -10px) scale(1.05) rotate(270deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animation classes */
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 8s ease-in-out infinite;
        }

        .animate-card-enter {
          animation: card-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }

        /* Scroll reveal animation */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-reveal.scroll-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Enhanced hover transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Utility classes */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animation-delay-200 { animation-delay: 200ms !important; }
        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-400 { animation-delay: 400ms !important; }
        .animation-delay-500 { animation-delay: 500ms !important; }
        .animation-delay-600 { animation-delay: 600ms !important; }
        .animation-delay-800 { animation-delay: 800ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }

        /* Group delays */
        .group-hover\\:delay-100 {
          transition-delay: 100ms;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Performance optimizations */
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-shimmer,
          .animate-gradient,
          .animate-card-enter,
          .animate-pulse-gentle,
          .animate-fade-in-up,
          .scroll-reveal {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
