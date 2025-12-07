import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Sparkles, Leaf, Zap, Filter, Mail, Instagram, Upload, User, Palette, Send } from "lucide-react";

interface Poster {
  id: number;
  imageUrl: string;
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

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Memoized poster data with correct image URLs
  const postersData = useMemo<Poster[]>(() => {
    const posters: Poster[] = [];
    
    if (language === 'fr') {
      // French posters
      posters.push(
        // Yahia's posters (French only)
        {
          id: 1,
          imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg", // Temporary placeholder - Yahia's French poster 1
          title: "Sauver la Terre avec les 3R",
          description: "Concept Réduire, Réutiliser, Recycler avec un design vibrant",
          author: "Yahia Ikni",
          language: "fr",
          tags: ["3R", "environnement", "concept", "réduction"]
        },
        {
          id: 2,
          imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg", // Temporary placeholder - Yahia's French poster 2
          title: "Campagne de Recyclage Minimaliste",
          description: "Design épuré et minimaliste promouvant les habitudes de recyclage",
          author: "Yahia Ikni",
          language: "fr",
          tags: ["minimaliste", "campagne", "épuré", "habitudes"]
        },
        // Salsabile's French posters
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
      // English posters (Salsabile only)
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
  const handleOpenNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Copy contact info to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    alert(`${language === 'en' ? 'Copied to clipboard!' : 'Copié dans le presse-papier!'}`);
  }, [language]);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/20 via-background to-emerald-900/5 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-emerald-300 rounded-full animate-pulse animation-delay-600"></div>
          </div>
          <Leaf className="absolute -top-3 -right-3 w-8 h-8 text-emerald-500 animate-bounce animation-delay-400" />
          <Zap className="absolute -bottom-3 -left-3 w-8 h-8 text-emerald-400 animate-pulse animation-delay-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-auto">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-background to-emerald-900/5 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          <div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-400/10 to-transparent rounded-full blur-3xl animate-orb-float"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-emerald-600/5 to-transparent rounded-full blur-3xl animate-orb-float"
            style={{ animationDelay: '2s' }}
          />
        </div>
        
        {/* Animated floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-particle-float"
            style={{
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + i * 0.5}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-10 relative">
              <div className="relative">
                <Leaf className="absolute -left-10 top-1/2 w-8 h-8 text-emerald-400/60 animate-float-slow" />
                <Sparkles className="absolute -right-10 top-1/2 w-8 h-8 text-emerald-300/60 animate-float-slow animation-delay-1000" />
                
                <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black mb-8 
                               bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700 
                               dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-500 
                               bg-clip-text text-transparent animate-gradient tracking-tight">
                  {t("posters.title") || "Posters Gallery"}
                </h1>
                
                <div className="relative h-1 overflow-hidden max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-emerald-800/70 dark:text-emerald-200/70 max-w-3xl mx-auto leading-relaxed font-light mb-6 animate-fade-in">
              {t("posters.subtitle") || "Browse and share environmental posters from our community"}
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 flex items-center justify-center gap-3 
                           transform hover:-translate-y-1 hover:scale-105 active:scale-95
                           ${activeSection === "gallery" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/30 hover:shadow-3xl" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700/80 border-2 border-emerald-500/20 hover:border-emerald-500/30"}`}
              >
                <Palette className="w-5 h-5 transition-transform group-hover:rotate-12" />
                {language === 'en' ? "Gallery" : "Galerie"}
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-500 flex items-center justify-center gap-3 
                           transform hover:-translate-y-1 hover:scale-105 active:scale-95
                           ${activeSection === "share" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/30 hover:shadow-3xl" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700/80 border-2 border-emerald-500/20 hover:border-emerald-500/30"}`}
              >
                <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                {language === 'en' ? "Share Your Art" : "Partagez votre art"}
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section */}
              <div className="max-w-3xl mx-auto mb-16 animate-fade-in-up">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-600/70 dark:text-emerald-400/70 w-6 h-6 transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500" />
                    <input
                      type="text"
                      placeholder={language === 'en' 
                        ? "Search posters by title, description, or tags..." 
                        : "Rechercher des affiches par titre, description ou tags..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-12 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl text-lg text-emerald-900 dark:text-emerald-100 placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 hover:border-emerald-500/30 group-hover:scale-[1.02]"
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500 transition-all duration-200 p-1 hover:scale-125"
                          aria-label="Clear search"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-24 animate-fade-in">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center animate-pulse-gentle">
                        <Search className="w-12 h-12 text-emerald-500/50 animate-pulse" />
                      </div>
                      <Zap className="absolute -top-2 -right-2 w-8 h-8 text-emerald-400 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                        {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                      </h3>
                      <p className="text-emerald-700/70 dark:text-emerald-300/70">
                        {language === 'en' 
                          ? "Try different keywords or browse all community posters" 
                          : "Essayez d'autres mots-clés ou parcourez toutes les affiches"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95"
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
                        <div className="p-2 rounded-full bg-emerald-500/10 animate-pulse-gentle">
                          <Zap className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {language === 'en' ? "community posters" : "affiches communautaires"}
                          </h3>
                          {searchQuery && (
                            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-1">
                              {language === 'en' ? "Showing results for" : "Résultats pour"} "
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse">{searchQuery}</span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 transform hover:-translate-y-0.5 active:scale-95"
                        >
                          {language === 'en' ? "Clear search" : "Effacer"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Posters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          className="overflow-hidden border-2 border-emerald-500/10 dark:border-emerald-500/20 
                                     bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm h-full group 
                                     hover:border-emerald-500/30 dark:hover:border-emerald-400/30 
                                     hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 
                                     transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer"
                        >
                          {/* Poster Container */}
                          <div className="relative w-full pb-[130%] overflow-hidden bg-gradient-to-br from-emerald-500/5 to-emerald-600/5">
                            <div className="absolute inset-2 rounded-lg overflow-hidden">
                              <img
                                src={poster.imageUrl}
                                alt={poster.title}
                                className="absolute w-full h-full top-0 left-0 object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                              />
                              
                              {/* Animated Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                              
                              {/* Language Badge */}
                              <div className="absolute top-3 right-3 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${
                                  poster.language === 'en' 
                                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white'
                                    : 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white'
                                }`}>
                                  {poster.language.toUpperCase()}
                                </span>
                              </div>
                              
                              {/* Author Tag */}
                              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-4 group-hover:translate-x-0">
                                <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-900/90 to-emerald-800/90 backdrop-blur-sm rounded-full text-xs text-white font-medium shadow-lg">
                                  {poster.author}
                                </span>
                              </div>
                              
                              {/* View Button */}
                              <div className="absolute bottom-3 left-3 right-3">
                                <button
                                  onClick={() => handleOpenNewTab(poster.imageUrl)}
                                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 
                                            text-white font-semibold hover:shadow-xl hover:shadow-emerald-600/40 
                                            transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 
                                            opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 
                                            active:scale-95 group-hover:delay-100 hover:-translate-y-1"
                                >
                                  <ExternalLink className="w-5 h-5 transition-transform group-hover:rotate-45" />
                                  {language === 'en' ? "View Full Size" : "Voir en taille réelle"}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-5 bg-gradient-to-b from-white/50 to-white/30 
                                          dark:from-gray-900/50 dark:to-gray-900/30">
                            {/* Title and Description */}
                            <div className="mb-4">
                              <h3 className="font-bold text-xl text-emerald-900 dark:text-emerald-100 mb-2 
                                            group-hover:text-emerald-700 transition-colors duration-300 line-clamp-1">
                                {poster.title}
                              </h3>
                              <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70 line-clamp-2 leading-relaxed group-hover:text-emerald-800/80 transition-colors duration-300">
                                {poster.description}
                              </p>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {poster.tags.slice(0, 4).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 
                                             text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 
                                             hover:bg-emerald-500/20 hover:border-emerald-500/30 
                                             transition-all duration-300 cursor-default transform hover:-translate-y-0.5"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="pt-4 border-t border-emerald-500/10 group-hover:border-emerald-500/20 transition-colors duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                                    poster.author === "Yahia Ikni" 
                                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                                      : 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                                  }`}></div>
                                  <span className="text-sm text-emerald-700/80 dark:text-emerald-300/80 group-hover:text-emerald-800 transition-colors duration-300">
                                    {t("home.presentation.by") || "By"}{" "}
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-200 group-hover:text-emerald-700 transition-colors duration-300">{poster.author}</span>
                                  </span>
                                </div>
                                <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60 group-hover:text-emerald-500 transition-colors duration-300">
                                  {poster.language === 'en' ? 'EN' : 'FR'}
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
                  <div className="inline-block max-w-xl mx-auto transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-full blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/30 to-emerald-500/5 
                                      dark:from-gray-900/50 dark:to-emerald-900/20 backdrop-blur-sm 
                                      border border-emerald-500/10 dark:border-emerald-500/20 hover:border-emerald-500/20 transition-colors duration-300">
                        <Leaf className="w-8 h-8 text-emerald-500 mb-4 mx-auto animate-float-slow" />
                        <p className="text-lg text-emerald-800/80 dark:text-emerald-200/80 mb-4">
                          {t("posters.communityNote") || "Join our community of environmental artists!"}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent animate-shimmer"></div>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse-gentle">
                            {language === 'en' ? "Made with ♻️ by the community" : "Fait avec ♻️ par la communauté"}
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-shimmer animation-delay-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Share Your Art Section */
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 animate-gradient">
                  {language === 'en' ? "Share Your Artwork" : "Partagez votre création"}
                </h2>
                <p className="text-xl text-emerald-700/80 dark:text-emerald-300/80">
                  {language === 'en' 
                    ? "Join our community and inspire others with your environmental artwork" 
                    : "Rejoignez notre communauté et inspirez les autres avec votre art environnemental"}
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    step: 1,
                    icon: Palette,
                    title: language === 'en' ? "Create Your Art" : "Créez votre art",
                    description: language === 'en' 
                      ? "Design a poster or video about recycling, environment, or sustainability"
                      : "Créez une affiche ou une vidéo sur le recyclage, l'environnement ou le développement durable"
                  },
                  {
                    step: 2,
                    icon: Send,
                    title: language === 'en' ? "Send to Us" : "Envoyez-nous",
                    description: language === 'en' 
                      ? "Share your creation via email or Instagram. Include your name for credit."
                      : "Partagez votre création par email ou Instagram. Incluez votre nom pour le crédit."
                  },
                  {
                    step: 3,
                    icon: User,
                    title: language === 'en' ? "Get Featured" : "Soyez mis en avant",
                    description: language === 'en' 
                      ? "We'll review and feature your work in our community gallery with proper credit"
                      : "Nous examinerons et mettrons en avant votre travail dans notre galerie communautaire"
                  }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className="relative group transform hover:-translate-y-3 transition-all duration-500"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-emerald-500/10 h-full group-hover:border-emerald-500/30 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        {item.step}
                      </div>
                      <item.icon className="w-12 h-12 text-emerald-600 mb-4 mx-auto transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                      <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-emerald-700/80 dark:text-emerald-300/80 group-hover:text-emerald-800/90 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-white/50 to-emerald-500/5 dark:from-gray-900/50 dark:to-emerald-900/20 
                              backdrop-blur-sm rounded-3xl border-2 border-emerald-500/10 p-8 transform hover:scale-[1.01] transition-transform duration-300">
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 text-center animate-gradient">
                  {language === 'en' ? "Contact Information" : "Coordonnées"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-500/30 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all duration-300">
                          <Mail className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 group-hover:text-emerald-700 transition-colors duration-300">
                            {language === 'en' ? "Email" : "Courriel"}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono text-emerald-800 dark:text-emerald-200 group-hover:text-emerald-700 transition-colors duration-300">
                          recyclagemaria@gmail.com
                        </code>
                        <button
                          onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-110 active:scale-95"
                          title={language === 'en' ? "Copy email" : "Copier l'email"}
                        >
                          {language === 'en' ? "Copy" : "Copier"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-emerald-500/20 group-hover:border-pink-500/30 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 group-hover:from-pink-500/20 group-hover:to-purple-500/20 transition-all duration-300">
                          <Instagram className="w-6 h-6 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 group-hover:text-pink-600 transition-colors duration-300">
                            Instagram
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono text-emerald-800 dark:text-emerald-200 group-hover:text-pink-700 transition-colors duration-300">
                          @recyclage_projet
                        </code>
                        <button
                          onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                          <Instagram className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                          {language === 'en' ? "Follow" : "Suivre"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/30 transition-all duration-300">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse-gentle" />
                    {language === 'en' ? "Submission Guidelines" : "Directives de soumission"}
                  </h4>
                  <ul className="space-y-2 text-emerald-700/80 dark:text-emerald-300/80">
                    <li className="flex items-start gap-2 transition-all duration-300 hover:text-emerald-800 transform hover:translate-x-1">
                      <span className="text-emerald-600 mt-1 animate-pulse-gentle">•</span>
                      <span>{language === 'en' 
                        ? "Include your full name for proper credit" 
                        : "Incluez votre nom complet pour un crédit approprié"}</span>
                    </li>
                    <li className="flex items-start gap-2 transition-all duration-300 hover:text-emerald-800 transform hover:translate-x-1">
                      <span className="text-emerald-600 mt-1 animate-pulse-gentle animation-delay-200">•</span>
                      <span>{language === 'en' 
                        ? "Accepted formats: JPG, PNG, PDF, MP4 (for videos)" 
                        : "Formats acceptés : JPG, PNG, PDF, MP4 (pour les vidéos)"}</span>
                    </li>
                    <li className="flex items-start gap-2 transition-all duration-300 hover:text-emerald-800 transform hover:translate-x-1">
                      <span className="text-emerald-600 mt-1 animate-pulse-gentle animation-delay-400">•</span>
                      <span>{language === 'en' 
                        ? "Keep content educational and inspiring about environmental topics" 
                        : "Gardez le contenu éducatif et inspirant sur les thèmes environnementaux"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes orb-float {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          33% { 
            transform: translate(30px, -40px) scale(1.1) rotate(120deg);
            opacity: 0.5;
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
            opacity: 0.4;
          }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% { 
            transform: translateY(-50px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
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
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
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
        .animate-orb-float {
          animation: orb-float 20s ease-in-out infinite;
        }

        .animate-particle-float {
          animation: particle-float 6s ease-in-out infinite;
        }

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
          animation: pulse-gentle 2.5s ease-in-out infinite;
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
      `}</style>
    </div>
  );
}
