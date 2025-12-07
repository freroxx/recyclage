import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Sparkles, Leaf, Zap, Mail, Instagram, Upload, User, Palette, Send, Heart, Eye, Download } from "lucide-react";

interface Poster {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  language: "fr" | "en";
  tags: string[];
  views?: number;
  likes?: number;
}

export default function Posters() {
  const { t, language = 'en' } = useLanguage(); // Added default value
  useScrollReveal();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoster, setHoveredPoster] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<"gallery" | "share">("gallery");
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Handle image errors
  const handleImageError = useCallback((posterId: number) => {
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.add(posterId);
      return newSet;
    });
  }, []);

  // Memoized poster data with correct URLs and text
  const postersData = useMemo<Poster[]>(() => {
    const posters: Poster[] = [];
    
    const currentLanguage = language || 'en';
    
    if (currentLanguage === 'fr') {
      // French posters
      posters.push(
        // Yahia's posters (French)
        {
          id: 1,
          imageUrl: "https://i.ibb.co/nb0gWJv/yahia-poster1.jpg",
          title: "Sauver la Terre avec les 3R",
          description: "Un design vibrant illustrant le concept Réduire, Réutiliser, Recycler pour protéger notre planète",
          author: "Yahia Ikni",
          language: "fr",
          tags: ["3R", "écologie", "concept", "réduction", "développement durable"],
          views: 1245,
          likes: 89
        },
        {
          id: 2,
          imageUrl: "https://i.ibb.co/h7tSmRD/yahia-poster2.jpg",
          title: "Campagne de Recyclage Minimaliste",
          description: "Design épuré et moderne promouvant les bonnes habitudes de recyclage au quotidien",
          author: "Yahia Ikni",
          language: "fr",
          tags: ["minimaliste", "campagne", "design", "habitudes", "écoresponsable"],
          views: 987,
          likes: 67
        },
        // Salsabile's French posters
        {
          id: 3,
          imageUrl: "https://i.ibb.co/FLg4Bk0/fr1.jpg",
          title: "Guide du Recyclage Quotidien",
          description: "Infographie pratique pour intégrer le recyclage dans votre routine journalière",
          author: "Salsabile",
          language: "fr",
          tags: ["guide", "pratique", "quotidien", "infographie", "tutoriel"],
          views: 1567,
          likes: 112
        },
        {
          id: 4,
          imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
          title: "École Écoresponsable",
          description: "Poster éducatif pour sensibiliser les élèves aux gestes écologiques à l'école",
          author: "Salsabile",
          language: "fr",
          tags: ["éducation", "école", "sensibilisation", "jeunesse", "écocitoyenneté"],
          views: 1342,
          likes: 95
        },
        // Additional French posters
        {
          id: 5,
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
          title: "Zéro Déchet Facile",
          description: "Astuces simples pour réduire vos déchets et adopter un mode de vie plus écologique",
          author: "Éco-Design Collective",
          language: "fr",
          tags: ["zéro déchet", "écologie", "astuces", "lifestyle", "durabilité"],
          views: 2100,
          likes: 156
        }
      );
    } else {
      // English posters
      posters.push(
        {
          id: 6,
          imageUrl: "https://i.ibb.co/TBjKSzD/english1.jpg",
          title: "Earth Day Conversation Starters",
          description: "Engaging questions and prompts to spark meaningful environmental discussions",
          author: "Salsabile",
          language: "en",
          tags: ["earth day", "conversation", "discussion", "engagement", "education"],
          views: 1890,
          likes: 134
        },
        {
          id: 7,
          imageUrl: "https://i.ibb.co/cKY4Rj0/english2.jpg",
          title: "Recycling Mascot Adventures",
          description: "Fun and educational poster featuring our recycling mascot teaching kids about sustainability",
          author: "Salsabile",
          language: "en",
          tags: ["fun", "mascot", "educational", "kids", "playful"],
          views: 1765,
          likes: 121
        },
        {
          id: 8,
          imageUrl: "https://i.ibb.co/1tyxTwJ/english3.jpg",
          title: "Simple Zero Waste Lifestyle",
          description: "Step-by-step guide to achieving a zero waste lifestyle with practical tips",
          author: "Salsabile",
          language: "en",
          tags: ["zero waste", "simple", "lifestyle", "eco-friendly", "guide"],
          views: 1954,
          likes: 142
        },
        {
          id: 9,
          imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80",
          title: "Green Campus Initiative",
          description: "Promoting sustainable practices in educational institutions for a greener future",
          author: "Eco Education Team",
          language: "en",
          tags: ["campus", "education", "sustainability", "green", "future"],
          views: 1678,
          likes: 98
        },
        {
          id: 10,
          imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
          title: "Sustainable Living Guide",
          description: "Comprehensive guide to adopting sustainable habits in daily life",
          author: "Green Living Collective",
          language: "en",
          tags: ["sustainable", "guide", "living", "habits", "eco"],
          views: 2243,
          likes: 167
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
    navigator.clipboard.writeText(text).then(() => {
      alert(`${language === 'fr' ? 'Copié dans le presse-papier!' : 'Copied to clipboard!'}`);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert(`${language === 'fr' ? 'Copié dans le presse-papier!' : 'Copied to clipboard!'}`);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
    });
  }, [language]);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-background to-teal-50 
                      dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 border-3 md:border-4 border-emerald-500/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-3 md:border-4 border-transparent border-t-emerald-500 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-3 md:border-4 border-transparent border-b-emerald-300 rounded-full animate-pulse animation-delay-300"></div>
          </div>
          <Leaf className="absolute -top-3 -right-3 w-6 h-6 md:w-8 md:h-8 text-emerald-500 animate-bounce animation-delay-400" />
        </div>
      </div>
    );
  }

  const currentLanguage = language || 'en';

  return (
    <div className="relative min-h-screen overflow-auto bg-background">
      {/* Enhanced Background with Theme Support */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Gradient Background - Different for light/dark */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-background to-teal-50/30 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"></div>
        
        {/* Animated orbs - Subtle for performance */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] 
                        bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl 
                        animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] md:w-[600px] md:h-[600px] 
                        bg-gradient-to-l from-teal-600/5 to-emerald-600/5 rounded-full blur-3xl 
                        animate-pulse-gentle animation-delay-2000"></div>
        
        {/* Subtle grid for texture */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] 
                        bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
                        from-emerald-500/10 via-transparent to-transparent"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header - Mobile Optimized */}
          <div className="text-center mb-10 md:mb-16 px-2">
            <div className="inline-block mb-6 md:mb-10 relative">
              <div className="relative">
                {/* Decorative elements - Hidden on mobile */}
                <Leaf className="hidden md:block absolute -left-12 top-1/2 w-8 h-8 text-emerald-400/60 dark:text-emerald-500/40 animate-float-slow" />
                <Sparkles className="hidden md:block absolute -right-12 top-1/2 w-8 h-8 text-emerald-300/60 dark:text-emerald-400/40 animate-float-slow animation-delay-1000" />
                
                {/* Main title */}
                <h1 className="relative text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-8 
                               bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 
                               dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 
                               bg-clip-text text-transparent tracking-tight leading-tight">
                  {t("posters.title") || (currentLanguage === 'fr' ? "Galerie d'Affiches Écologiques" : "Eco Posters Gallery")}
                </h1>
                
                {/* Animated underline */}
                <div className="relative h-0.5 md:h-1 overflow-hidden max-w-lg md:max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  dark:via-emerald-400 animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-emerald-800/80 dark:text-emerald-200/80 
                          max-w-lg md:max-w-3xl mx-auto leading-relaxed font-light mb-6 px-2">
              {t("posters.subtitle") || 
               (currentLanguage === 'fr' 
                 ? "Découvrez des affiches environnementales inspirantes de notre communauté créative" 
                 : "Discover inspiring environmental posters from our creative community")}
            </p>
            
            {/* Navigation Tabs - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 md:mb-12 px-2">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-5 sm:px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base
                           transform hover:-translate-y-0.5 active:scale-95
                           ${activeSection === "gallery" 
                             ? `bg-gradient-to-r from-emerald-600 to-teal-500 text-white
                                shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20
                                hover:shadow-xl hover:shadow-emerald-500/40`
                             : `bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/90 border border-emerald-500/20
                                hover:border-emerald-500/30 dark:border-emerald-500/30`
                           }`}
              >
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                {currentLanguage === 'fr' ? "Galerie" : "Gallery"}
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-5 sm:px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base
                           transform hover:-translate-y-0.5 active:scale-95
                           ${activeSection === "share" 
                             ? `bg-gradient-to-r from-emerald-600 to-teal-500 text-white 
                                shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20 
                                hover:shadow-xl hover:shadow-emerald-500/40` 
                             : `bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/90 border border-emerald-500/20
                                hover:border-emerald-500/30 dark:border-emerald-500/30`
                           }`}
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
                {currentLanguage === 'fr' ? "Partagez votre art" : "Share Your Art"}
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section - Mobile Optimized */}
              <div className="max-w-xl md:max-w-3xl mx-auto mb-10 md:mb-16 px-3 sm:px-4 animate-fade-in-up">
                <div className="relative group">
                  <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                                rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 
                                transition-opacity duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 md:left-5 top-1/2 transform -translate-y-1/2 
                                     text-emerald-600/70 dark:text-emerald-400/70 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6
                                     transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500
                                     group-focus-within:scale-110 group-focus-within:text-emerald-500" />
                    <input
                      type="text"
                      placeholder={currentLanguage === 'fr' 
                        ? "Rechercher des affiches, tags ou auteurs..." 
                        : "Search posters, tags, or authors..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 md:pl-16 pr-9 sm:pr-10 md:pr-12 py-3 sm:py-4 
                               bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm 
                               border border-emerald-500/20 dark:border-emerald-500/30 
                               rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg 
                               text-emerald-900 dark:text-emerald-100 
                               placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 
                               focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 
                               focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 
                               transition-all duration-300 hover:border-emerald-500/30 
                               group-hover:scale-[1.01] group-focus-within:scale-[1.01]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 sm:right-3 md:right-4 top-1/2 transform -translate-y-1/2 
                                 text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500 
                                 transition-all duration-200 p-1 hover:scale-125"
                        aria-label={currentLanguage === 'fr' ? "Effacer la recherche" : "Clear search"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Section */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-12 md:py-24 px-4 animate-fade-in-up">
                  <div className="inline-flex flex-col items-center gap-4 md:gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full 
                                    bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                                    flex items-center justify-center animate-pulse-gentle">
                        <Search className="w-8 h-8 md:w-10 md:h-10 text-emerald-500/50" />
                      </div>
                      <Zap className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 text-emerald-400 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                        {currentLanguage === 'fr' ? "Aucune affiche trouvée" : "No posters found"}
                      </h3>
                      <p className="text-sm md:text-base text-emerald-700/70 dark:text-emerald-300/70">
                        {currentLanguage === 'fr' 
                          ? "Essayez d'autres mots-clés ou parcourez toutes les affiches" 
                          : "Try different keywords or browse all community posters"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-5 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-full 
                               bg-gradient-to-r from-emerald-600 to-teal-500 text-white 
                               font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-emerald-500/30
                               transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                    >
                      {currentLanguage === 'fr' ? "Voir toutes les affiches" : "View All Posters"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-6 md:mb-10 px-3 sm:px-4 animate-fade-in-up animation-delay-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 
                                      animate-pulse-gentle">
                          <Zap className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {currentLanguage === 'fr' ? "affiches communautaires" : "community posters"}
                          </h3>
                          {searchQuery && (
                            <p className="text-xs md:text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">
                              {currentLanguage === 'fr' ? "Résultats pour" : "Showing results for"} "
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{searchQuery}</span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="self-start sm:self-center text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 
                                   hover:text-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full 
                                   bg-emerald-500/10 dark:bg-emerald-500/20 hover:bg-emerald-500/20 
                                   transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                                   whitespace-nowrap"
                        >
                          {currentLanguage === 'fr' ? "Effacer" : "Clear search"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Posters Grid - Mobile Optimized */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-3 sm:px-4">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="scroll-reveal animate-card-enter"
                        style={{
                          animationDelay: `${Math.min(index * 100, 600)}ms`,
                          animationFillMode: 'both'
                        }}
                        onMouseEnter={() => setHoveredPoster(poster.id)}
                        onMouseLeave={() => setHoveredPoster(null)}
                      >
                        <Card 
                          className="overflow-hidden border border-emerald-500/10 dark:border-emerald-500/20 
                                     bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm h-full group 
                                     hover:border-emerald-500/30 dark:hover:border-emerald-400/30 
                                     hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/5 
                                     transition-all duration-300 active:scale-95 sm:hover:-translate-y-1 
                                     cursor-pointer touch-manipulation"
                        >
                          {/* Poster Container */}
                          <div className="relative w-full pb-[130%] sm:pb-[140%] overflow-hidden 
                                        bg-gradient-to-br from-emerald-500/5 to-teal-500/5 
                                        dark:from-emerald-900/10 dark:to-teal-900/10">
                            {/* Image with fallback */}
                            <div className="absolute inset-2 rounded-lg overflow-hidden">
                              {imageErrors.has(poster.id) ? (
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                                              dark:from-emerald-900/20 dark:to-teal-900/20 
                                              flex flex-col items-center justify-center p-4">
                                  <Eye className="w-12 h-12 text-emerald-500/50 mb-3" />
                                  <span className="text-emerald-700/70 dark:text-emerald-300/70 text-sm text-center">
                                    {currentLanguage === 'fr' ? "Image non disponible" : "Image unavailable"}
                                  </span>
                                </div>
                              ) : (
                                <img
                                  src={poster.imageUrl}
                                  alt={poster.title}
                                  className="absolute w-full h-full top-0 left-0 object-cover 
                                           group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                  decoding="async"
                                  onError={() => handleImageError(poster.id)}
                                />
                              )}
                              
                              {/* Overlay with stats */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent 
                                            opacity-0 group-hover:opacity-100 transition-all duration-300 
                                            flex flex-col justify-end p-3 sm:p-4">
                                {/* Stats */}
                                <div className="flex items-center justify-between mb-3 transform translate-y-2 
                                              group-hover:translate-y-0 opacity-0 group-hover:opacity-100 
                                              transition-all duration-300 delay-100">
                                  <div className="flex items-center gap-2 text-white/90">
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">{poster.views?.toLocaleString() || '1.2k'}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-white/90">
                                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="text-xs sm:text-sm font-medium">{poster.likes?.toLocaleString() || '89'}</span>
                                  </div>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="grid grid-cols-2 gap-2 transform translate-y-4 group-hover:translate-y-0 
                                              opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenNewTab(poster.imageUrl);
                                    }}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/90 dark:bg-gray-900/90 
                                             text-emerald-700 dark:text-emerald-300 font-medium 
                                             hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 
                                             flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm
                                             active:scale-95"
                                  >
                                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {currentLanguage === 'fr' ? "Voir" : "View"}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenNewTab(poster.imageUrl);
                                    }}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 
                                             text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 
                                             transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 
                                             text-xs sm:text-sm active:scale-95"
                                  >
                                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {currentLanguage === 'fr' ? "Enregistrer" : "Save"}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Language Badge */}
                              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md 
                                               ${poster.language === 'en' 
                                                 ? 'bg-emerald-600/90 dark:bg-emerald-500/90 text-white' 
                                                 : 'bg-teal-600/90 dark:bg-teal-500/90 text-white'}`}>
                                  {poster.language.toUpperCase()}
                                </span>
                              </div>
                              
                              {/* Author Tag - Mobile Only */}
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 sm:hidden">
                                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full 
                                               text-xs text-white font-medium">
                                  {poster.author.split(' ')[0]}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-3 sm:p-4 md:p-5">
                            {/* Title and Description */}
                            <div className="mb-3 sm:mb-4">
                              <h3 className="font-bold text-base sm:text-lg md:text-xl text-emerald-900 dark:text-emerald-100 
                                           mb-1 sm:mb-2 line-clamp-1 group-hover:text-emerald-700 
                                           dark:group-hover:text-emerald-400 transition-colors duration-300">
                                {poster.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-emerald-800/70 dark:text-emerald-300/70 
                                          line-clamp-2 leading-relaxed">
                                {poster.description}
                              </p>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                              {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-[10px] sm:text-xs rounded-full bg-emerald-500/10 
                                           dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 
                                           border border-emerald-500/20 dark:border-emerald-500/30 
                                           hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 
                                           transition-all duration-300 cursor-default"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="pt-2 sm:pt-3 border-t border-emerald-500/10 dark:border-emerald-500/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 
                                                animate-pulse"></div>
                                  <span className="text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-300/80">
                                    {currentLanguage === 'fr' ? "Par" : "By"}{" "}
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                                      {poster.author}
                                    </span>
                                  </span>
                                </div>
                                <div className="text-[10px] sm:text-xs text-emerald-600/60 dark:text-emerald-400/60">
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
                <div className="mt-12 md:mt-20 text-center px-3 sm:px-4 animate-fade-in-up animation-delay-1000">
                  <div className="inline-block max-w-xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/50 to-emerald-500/5 
                                  dark:from-gray-900/50 dark:to-emerald-900/20 backdrop-blur-sm 
                                  border border-emerald-500/10 dark:border-emerald-500/20">
                      <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 mb-3 sm:mb-4 mx-auto animate-float-slow" />
                      <p className="text-sm sm:text-base md:text-lg text-emerald-800/80 dark:text-emerald-200/80 mb-3 sm:mb-4">
                        {currentLanguage === 'fr' 
                          ? "Rejoignez notre communauté grandissante d'artistes et d'activistes environnementaux !" 
                          : "Join our growing community of environmental artists and activists!"}
                      </p>
                      <div className="flex items-center justify-center gap-3 sm:gap-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                        <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-pulse-gentle">
                          {currentLanguage === 'fr' ? "Fait avec ♻️ par la communauté" : "Made with ♻️ by the community"}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Share Your Art Section - Mobile Optimized */
            <div className="max-w-4xl mx-auto animate-fade-in-up px-3 sm:px-4">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 md:mb-6">
                  {currentLanguage === 'fr' ? "Partagez votre création" : "Share Your Artwork"}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-emerald-700/80 dark:text-emerald-300/80">
                  {currentLanguage === 'fr' 
                    ? "Rejoignez notre communauté et inspirez les autres avec votre art environnemental" 
                    : "Join our community and inspire others with your environmental artwork"}
                </p>
              </div>

              {/* Steps - Mobile Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
                {[
                  {
                    step: 1,
                    icon: Palette,
                    title: currentLanguage === 'fr' ? "Créez votre art" : "Create Your Art",
                    description: currentLanguage === 'fr' 
                      ? "Créez des affiches inspirantes sur le recyclage, la durabilité ou la protection de l'environnement"
                      : "Design inspiring posters about recycling, sustainability, or environmental protection"
                  },
                  {
                    step: 2,
                    icon: Send,
                    title: currentLanguage === 'fr' ? "Partagez avec nous" : "Share With Us",
                    description: currentLanguage === 'fr' 
                      ? "Envoyez votre création par email ou Instagram avec votre nom pour un crédit approprié"
                      : "Send your creation via email or Instagram with your name for proper credit"
                  },
                  {
                    step: 3,
                    icon: User,
                    title: currentLanguage === 'fr' ? "Soyez mis en avant" : "Get Featured",
                    description: currentLanguage === 'fr' 
                      ? "Nous mettrons en avant votre travail dans notre galerie communautaire pour inspirer les autres"
                      : "We'll feature your work in our community gallery to inspire others"
                  }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className="relative group"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                                  rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-500"></div>
                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 
                                  rounded-xl sm:rounded-2xl border border-emerald-500/10 dark:border-emerald-500/20 
                                  h-full group-hover:border-emerald-500/30 transition-all duration-300
                                  sm:transform sm:hover:-translate-y-1">
                      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 
                                    rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 
                                    text-white text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4
                                    group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <item.icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-600 dark:text-emerald-400 
                                          mb-3 sm:mb-4 mx-auto transform group-hover:scale-110 
                                          transition-transform duration-300" />
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 
                                   mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-emerald-700/80 dark:text-emerald-300/80">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-white/60 to-emerald-500/5 dark:from-gray-900/60 dark:to-emerald-900/20 
                            backdrop-blur-sm rounded-xl sm:rounded-3xl border border-emerald-500/10 dark:border-emerald-500/20 
                            p-4 sm:p-6 md:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 text-center">
                  {currentLanguage === 'fr' ? "Coordonnées" : "Contact Information"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Email */}
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-xl 
                                  border border-emerald-500/20 dark:border-emerald-500/30 
                                  group-hover:border-emerald-500/30 transition-all duration-300">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20
                                      group-hover:bg-emerald-500/20 transition-colors duration-300">
                          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 
                                         group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm sm:text-base">
                            {currentLanguage === 'fr' ? "Courriel" : "Email"}
                          </h4>
                          <p className="text-xs sm:text-sm text-emerald-700/70 dark:text-emerald-300/70">
                            {currentLanguage === 'fr' ? "Envoyez votre création à" : "Send your artwork to"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <code className="text-sm sm:text-base md:text-lg font-mono text-emerald-800 dark:text-emerald-200 
                                       break-all mb-2 sm:mb-0">
                          recyclagemaria@gmail.com
                        </code>
                        <button
                          onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 
                                   text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 
                                   transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                                   text-xs sm:text-sm whitespace-nowrap"
                          title={currentLanguage === 'fr' ? "Copier l'email" : "Copy email"}
                        >
                          {currentLanguage === 'fr' ? "Copier" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-4 sm:p-6 rounded-xl 
                                  border border-emerald-500/20 dark:border-emerald-500/30 
                                  group-hover:border-pink-500/30 transition-all duration-300">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 
                                      dark:from-pink-500/20 dark:to-purple-500/20
                                      group-hover:from-pink-500/20 group-hover:to-purple-500/20 
                                      transition-all duration-300">
                          <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 dark:text-pink-400 
                                              group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm sm:text-base">
                            Instagram
                          </h4>
                          <p className="text-xs sm:text-sm text-emerald-700/70 dark:text-emerald-300/70">
                            {currentLanguage === 'fr' ? "Envoyez-nous votre création en MP" : "DM us your artwork"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <code className="text-sm sm:text-base md:text-lg font-mono text-emerald-800 dark:text-emerald-200 
                                       break-all mb-2 sm:mb-0">
                          @recyclage_projet
                        </code>
                        <button
                          onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg 
                                   bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                   font-semibold hover:shadow-lg hover:shadow-pink-500/30
                                   transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                                   flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
                        >
                          <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                          {currentLanguage === 'fr' ? "Suivre" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl 
                              bg-emerald-500/5 dark:bg-emerald-500/10 
                              border border-emerald-500/20 dark:border-emerald-500/30">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 sm:mb-3 
                               flex items-center gap-2 text-sm sm:text-base">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 
                                       animate-pulse-gentle" />
                    {currentLanguage === 'fr' ? "Directives de soumission" : "Submission Guidelines"}
                  </h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-300/80">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Incluez votre nom complet pour un crédit approprié" 
                        : "Include your full name for proper credit"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Formats acceptés : JPG, PNG, PDF, MP4 (pour les vidéos)" 
                        : "Accepted formats: JPG, PNG, PDF, MP4 (for videos)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Gardez le contenu éducatif et inspirant sur les thèmes environnementaux" 
                        : "Keep content educational and inspiring about environmental topics"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
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

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
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

        .animate-card-enter {
          animation: card-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }

        /* Scroll reveal animation */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                      transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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
        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }

        /* Touch optimizations */
        .touch-manipulation {
          touch-action: manipulation;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-float-slow,
          .animate-shimmer,
          .animate-card-enter,
          .animate-pulse-gentle,
          .animate-fade-in-up,
          .scroll-reveal {
            animation: none !important;
            transition: opacity 0.3s ease !important;
          }
          
          .transform,
          .hover\\:transform,
          .group:hover .group-hover\\:transform {
            transform: none !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .text-balance {
            text-wrap: balance;
          }
        }
      `}</style>
    </div>
  );
}
