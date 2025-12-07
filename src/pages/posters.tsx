import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Sparkles, Leaf, Zap, Mail, Instagram, Upload, User, Palette, Send, Eye, Maximize2, X, Globe } from "lucide-react";
import { useRouter } from "next/router";

interface Poster {
  id: number;
  title: string;
  description: string;
  author: string;
  language: "fr" | "en";
  tags: string[];
  canvaEmbedUrl?: string;
  canvaDirectUrl?: string;
  imageUrl?: string;
}

// Canva embed posters data
const CANVA_POSTERS = {
  fr: [
    {
      id: 1,
      title: "Allons Recycler",
      description: "Un design minimaliste et moderne pour promouvoir le recyclage au quotidien",
      author: "Yahia Ikni",
      language: "fr" as const,
      tags: ["recyclage", "minimaliste", "moderne", "quotidien", "3R"],
      canvaEmbedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
      canvaDirectUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view"
    },
    {
      id: 2,
      title: "Sauvons la Terre avec les 3R",
      description: "Design illustratif vibrant mettant en avant les principes Réduire, Réutiliser, Recycler",
      author: "Yahia Ikni",
      language: "fr" as const,
      tags: ["3R", "sauver la terre", "illustration", "vibrant", "éducation"],
      canvaEmbedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
      canvaDirectUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view"
    },
    {
      id: 3,
      title: "Guide du Recyclage Quotidien",
      description: "Infographie pratique pour intégrer le recyclage dans votre routine journalière",
      author: "Salsabile",
      language: "fr" as const,
      tags: ["guide", "pratique", "infographie", "tutoriel", "quotidien"],
      imageUrl: "https://i.ibb.co/FLg4Bk0/fr1.jpg"
    },
    {
      id: 4,
      title: "École Écoresponsable",
      description: "Poster éducatif pour sensibiliser les élèves aux gestes écologiques à l'école",
      author: "Salsabile",
      language: "fr" as const,
      tags: ["école", "éducation", "sensibilisation", "écocitoyenneté", "jeunesse"],
      imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg"
    },
    {
      id: 5,
      title: "Protégeons notre Planète",
      description: "Affiche inspirante pour la protection de l'environnement et la biodiversité",
      author: "Éco-Design Collective",
      language: "fr" as const,
      tags: ["biodiversité", "protection", "nature", "écologie", "durabilité"],
      imageUrl: "https://images.unsplash.com/photo-1578558288137-7207cb8c0e85?w=800&auto=format&fit=crop&q=80"
    }
  ],
  en: [
    {
      id: 6,
      title: "Earth Day Conversation Starters",
      description: "Engaging questions and prompts to spark meaningful environmental discussions",
      author: "Salsabile",
      language: "en" as const,
      tags: ["earth day", "conversation", "discussion", "engagement", "community"],
      imageUrl: "https://i.ibb.co/TBjKSzD/english1.jpg"
    },
    {
      id: 7,
      title: "Recycling Mascot Adventures",
      description: "Fun and educational poster featuring our recycling mascot teaching kids about sustainability",
      author: "Salsabile",
      language: "en" as const,
      tags: ["mascot", "fun", "educational", "kids", "playful"],
      imageUrl: "https://i.ibb.co/cKY4Rj0/english2.jpg"
    },
    {
      id: 8,
      title: "Simple Zero Waste Lifestyle",
      description: "Step-by-step guide to achieving a zero waste lifestyle with practical tips",
      author: "Salsabile",
      language: "en" as const,
      tags: ["zero waste", "simple", "lifestyle", "guide", "tips"],
      imageUrl: "https://i.ibb.co/1tyxTwJ/english3.jpg"
    },
    {
      id: 9,
      title: "Green Campus Initiative",
      description: "Promoting sustainable practices in educational institutions for a greener future",
      author: "Eco Education Team",
      language: "en" as const,
      tags: ["campus", "education", "sustainability", "green", "future"],
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: 10,
      title: "Sustainable Living Guide",
      description: "Comprehensive guide to adopting sustainable habits in daily life",
      author: "Green Living Collective",
      language: "en" as const,
      tags: ["sustainable", "guide", "living", "habits", "daily"],
      imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80"
    }
  ]
};

// Modal component for fullscreen view
interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author: string;
  children: React.ReactNode;
  language: "fr" | "en";
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, title, author, children, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full h-full max-w-7xl mx-auto p-4 animate-modal-enter">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
                <p className="text-emerald-300/80">
                  {language === 'fr' ? 'Par' : 'By'} <span className="font-semibold text-emerald-300">{author}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group"
                aria-label={language === 'fr' ? 'Fermer' : 'Close'}
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-4 pt-24 pb-6">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-black/50">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-emerald-300/70">
                <Maximize2 className="w-4 h-4 animate-pulse" />
                <span className="text-sm">
                  {language === 'fr' ? 'Utilisez la molette pour zoomer' : 'Use scroll wheel to zoom'}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex items-center gap-2 text-emerald-300/70">
                <Eye className="w-4 h-4 animate-pulse animation-delay-500" />
                <span className="text-sm">
                  {language === 'fr' ? 'Cliquez et glissez pour naviguer' : 'Click and drag to navigate'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Posters() {
  const { t, language = 'en' } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<"gallery" | "share">("gallery");
  const [postersData, setPostersData] = useState<Poster[]>([]);
  const [fullscreenPoster, setFullscreenPoster] = useState<Poster | null>(null);

  // Initialize mounted state and load posters
  useEffect(() => {
    setMounted(true);
    
    // Load posters based on current language
    const loadPosters = () => {
      const currentLanguage = language || 'en';
      const posters = currentLanguage === 'fr' ? CANVA_POSTERS.fr : CANVA_POSTERS.en;
      setPostersData(posters);
    };
    
    loadPosters();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [language]);

  // Filter posters based on search query
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

  // Handle opening fullscreen
  const handleOpenFullscreen = useCallback((poster: Poster) => {
    setFullscreenPoster(poster);
  }, []);

  // Copy contact info to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      const message = language === 'fr' 
        ? 'Copié dans le presse-papier!' 
        : 'Copied to clipboard!';
      alert(message);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        const message = language === 'fr' 
          ? 'Copié dans le presse-papier!' 
          : 'Copied to clipboard!';
        alert(message);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      document.body.removeChild(textArea);
    });
  }, [language]);

  // Navigate to contact page
  const navigateToContact = useCallback(() => {
    router.push('/contact');
  }, [router]);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-background to-emerald-50/30 
                      dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 border-3 md:border-4 border-emerald-500/20 rounded-full animate-spin">
            <div className="absolute inset-0 border-3 md:border-4 border-transparent border-t-emerald-500 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-3 md:border-4 border-transparent border-b-emerald-300 rounded-full animate-pulse animation-delay-300"></div>
          </div>
          <Leaf className="absolute -top-3 -right-3 w-6 h-6 md:w-8 md:h-8 text-emerald-500 animate-bounce animation-delay-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-28 animate-pulse">
              {language === 'fr' ? 'Chargement des affiches...' : 'Loading posters...'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLanguage = language || 'en';

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/60 via-background to-emerald-50/30 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] 
                        bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl 
                        animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] md:w-[600px] md:h-[600px] 
                        bg-gradient-to-l from-teal-600/10 to-emerald-600/10 rounded-full blur-3xl 
                        animate-pulse-gentle animation-delay-2000"></div>
        
        {/* Animated floating particles */}
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-emerald-400/30 rounded-full animate-float-particle animation-delay-0"></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-teal-400/30 rounded-full animate-float-particle animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-emerald-300/30 rounded-full animate-float-particle animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-6 md:mb-10 relative">
              <div className="relative">
                <Leaf className="hidden md:block absolute -left-12 top-1/2 w-8 h-8 text-emerald-400/60 dark:text-emerald-500/40 animate-float-slow" />
                <Sparkles className="hidden md:block absolute -right-12 top-1/2 w-8 h-8 text-emerald-300/60 dark:text-emerald-400/40 animate-float-slow animation-delay-1000" />
                
                <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-8 
                               bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 
                               dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 
                               bg-clip-text text-transparent tracking-tight animate-title-glow">
                  {t("posters.title") || (currentLanguage === 'fr' ? "Galerie d'Affiches Écologiques" : "Eco Posters Gallery")}
                </h1>
                
                <div className="relative h-1 overflow-hidden max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  dark:via-emerald-400 animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 
                          max-w-3xl mx-auto leading-relaxed font-light mb-8 animate-fade-in">
              {t("posters.subtitle") || 
               (currentLanguage === 'fr' 
                 ? "Découvrez des affiches environnementales créées par notre communauté" 
                 : "Discover environmental posters created by our community")}
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center gap-3 relative overflow-hidden group
                           transform hover:-translate-y-1 active:scale-95
                           ${activeSection === "gallery" 
                             ? `bg-gradient-to-r from-emerald-600 to-teal-500 text-white
                                shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20`
                             : `bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-gray-700/90 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/30`
                           }`}
              >
                <Palette className="w-5 h-5 transition-transform group-hover:scale-110" />
                {currentLanguage === 'fr' ? "Galerie" : "Gallery"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center gap-3 relative overflow-hidden group
                           transform hover:-translate-y-1 active:scale-95
                           ${activeSection === "share" 
                             ? `bg-gradient-to-r from-emerald-600 to-teal-500 text-white 
                                shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20` 
                             : `bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-gray-700/90 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/30`
                           }`}
              >
                <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
                {currentLanguage === 'fr' ? "Partagez votre art" : "Share Your Art"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section */}
              <div className="max-w-3xl mx-auto mb-12 md:mb-16 animate-fade-in-up">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                                rounded-2xl blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 
                                transition-all duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 
                                     text-gray-500 dark:text-gray-400 w-5 h-5
                                     transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500 
                                     group-hover:rotate-12" />
                    <input
                      type="text"
                      placeholder={currentLanguage === 'fr' 
                        ? "Rechercher des affiches, tags ou auteurs..." 
                        : "Search posters, tags, or authors..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-12 py-4 
                               bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm 
                               border border-gray-200 dark:border-gray-700 
                               rounded-2xl text-lg 
                               text-gray-900 dark:text-gray-100 
                               placeholder:text-gray-500 dark:placeholder:text-gray-400 
                               focus:outline-none focus:border-emerald-500/40 
                               focus:ring-2 focus:ring-emerald-500/20 
                               transition-all duration-300 group-hover:scale-[1.02]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 
                                 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300
                                 transition-all duration-200 p-1 hover:scale-125 active:scale-95"
                        aria-label={currentLanguage === 'fr' ? "Effacer la recherche" : "Clear search"}
                      >
                        <span className="block w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                          ✕
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Section */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-24 animate-fade-in">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full 
                                    bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                                    flex items-center justify-center animate-pulse-gentle">
                        <Search className="w-10 h-10 text-emerald-500/50" />
                      </div>
                      <Zap className="absolute -top-2 -right-2 w-8 h-8 text-emerald-400 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {currentLanguage === 'fr' ? "Aucune affiche trouvée" : "No posters found"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === 'fr' 
                          ? "Essayez d'autres mots-clés ou parcourez toutes les affiches" 
                          : "Try different keywords or browse all community posters"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-3 rounded-full relative overflow-hidden group
                               bg-gradient-to-r from-emerald-600 to-teal-500 text-white 
                               font-semibold hover:shadow-lg hover:shadow-emerald-500/30
                               transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <span className="relative z-10">{currentLanguage === 'fr' ? "Voir toutes les affiches" : "View All Posters"}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-10 animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                                      animate-pulse-gentle group cursor-pointer hover:scale-110 transition-transform duration-300">
                          <Zap className="w-5 h-5 text-emerald-500 dark:text-emerald-400 group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {filteredPosters.length} {currentLanguage === 'fr' ? "affiches communautaires" : "community posters"}
                          </h3>
                          {searchQuery && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                              {currentLanguage === 'fr' ? "Résultats pour" : "Showing results for"} "
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse-gentle">{searchQuery}</span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="font-medium text-emerald-600 dark:text-emerald-400 
                                   hover:text-emerald-700 px-4 py-2 rounded-full relative overflow-hidden group
                                   bg-emerald-500/10 dark:bg-emerald-500/20 hover:bg-emerald-500/20 
                                   transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                        >
                          <span className="relative z-10">{currentLanguage === 'fr' ? "Effacer" : "Clear search"}</span>
                          <span className="absolute inset-0 bg-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Posters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="animate-card-enter"
                        style={{
                          animationDelay: `${Math.min(index * 100, 600)}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <Card 
                          className="overflow-hidden border border-gray-200 dark:border-gray-700 
                                     bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm h-full group 
                                     hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 
                                     transition-all duration-300 hover:scale-[1.02] active:scale-100
                                     hover:-translate-y-1"
                        >
                          {/* Poster Container */}
                          <div className="relative w-full pt-[125%] sm:pt-[140%] overflow-hidden 
                                        bg-gradient-to-br from-gray-100 to-gray-200 
                                        dark:from-gray-800 dark:to-gray-900">
                            {/* Image or Canva Embed */}
                            <div className="absolute inset-0">
                              {poster.canvaEmbedUrl ? (
                                <div className="w-full h-full">
                                  <iframe
                                    src={poster.canvaEmbedUrl}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allowFullScreen
                                    loading="lazy"
                                    title={`${poster.title} by ${poster.author}`}
                                  />
                                </div>
                              ) : poster.imageUrl ? (
                                <img
                                  src={poster.imageUrl}
                                  alt={poster.title}
                                  className="absolute w-full h-full top-0 left-0 object-cover 
                                           group-hover:scale-105 transition-transform duration-500 ease-out"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-gray-400 dark:text-gray-600 text-center p-4">
                                    <Palette className="w-12 h-12 mx-auto mb-2" />
                                    <p>{currentLanguage === 'fr' ? 'Affiche non disponible' : 'Poster unavailable'}</p>
                                  </div>
                                </div>
                              )}
                              
                              {/* Overlay with buttons */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                            opacity-0 group-hover:opacity-100 transition-all duration-300 
                                            flex flex-col justify-end p-4">
                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2 transform translate-y-4 group-hover:translate-y-0 
                                              opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenFullscreen(poster);
                                    }}
                                    className="px-3 py-2 rounded-lg bg-white/90 text-gray-800 font-medium 
                                             hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 
                                             flex items-center justify-center gap-2 text-sm group/btn"
                                    title={currentLanguage === 'fr' ? "Ouvrir en plein écran" : "Open fullscreen"}
                                  >
                                    <Maximize2 className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                                    {currentLanguage === 'fr' ? "Ouvrir" : "Open"}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (poster.canvaDirectUrl) {
                                        handleOpenNewTab(poster.canvaDirectUrl);
                                      } else if (poster.imageUrl) {
                                        handleOpenNewTab(poster.imageUrl);
                                      }
                                    }}
                                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 
                                             text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 
                                             hover:scale-105 active:scale-95 transition-all duration-200 
                                             flex items-center justify-center gap-2 text-sm group/btn"
                                    title={currentLanguage === 'fr' ? "Ouvrir dans un nouvel onglet" : "Open in new tab"}
                                  >
                                    <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                                    {currentLanguage === 'fr' ? "Nouvel onglet" : "New Tab"}
                                  </button>
                                </div>
                              </div>
                              
                              {/* Language Badge */}
                              <div className="absolute top-3 right-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md 
                                               transition-all duration-300 group-hover:scale-110
                                               ${poster.language === 'en' 
                                                 ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white' 
                                                 : 'bg-gradient-to-r from-teal-600 to-teal-500 text-white'}`}>
                                  {poster.language.toUpperCase()}
                                </span>
                              </div>

                              {/* Canva badge if available */}
                              {poster.canvaEmbedUrl && (
                                <div className="absolute top-3 left-3">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                                 bg-black/60 text-white/90">
                                    Canva
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-5">
                            <div className="mb-4">
                              <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100 
                                           mb-2 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {poster.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 
                                          line-clamp-2 leading-relaxed">
                                {poster.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 
                                           text-gray-700 dark:text-gray-300 
                                           border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 
                                           transition-all duration-300 cursor-default hover:scale-105"
                                >
                                  {tag}
                                </span>
                              ))}
                              {poster.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 
                                               text-gray-500 dark:text-gray-500">
                                  +{poster.tags.length - 3}
                                </span>
                              )}
                            </div>
                            
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 
                                                animate-pulse group-hover:animate-ping"></div>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {currentLanguage === 'fr' ? "Par" : "By"}{" "}
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                      {poster.author}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 
                                              px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                                  <Globe className="w-3 h-3" />
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
                <div className="mt-20 text-center animate-fade-in-up">
                  <div className="inline-block max-w-xl mx-auto transform hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-white/60 to-emerald-500/10 
                                  dark:from-gray-800/60 dark:to-emerald-500/5 backdrop-blur-sm 
                                  border border-gray-200 dark:border-gray-700 group-hover:border-emerald-500/20
                                  transition-all duration-300">
                      <Leaf className="w-10 h-10 text-emerald-500 mb-4 mx-auto animate-float-slow group-hover:animate-spin-slow" />
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        {currentLanguage === 'fr' 
                          ? "Vous avez créé une affiche environnementale ? Partagez-la avec notre communauté !" 
                          : "Created an environmental poster? Share it with our community!"}
                      </p>
                      <button
                        onClick={() => setActiveSection("share")}
                        className="px-8 py-3 rounded-full relative overflow-hidden group/btn
                                 bg-gradient-to-r from-emerald-600 to-teal-500 text-white 
                                 font-semibold hover:shadow-lg hover:shadow-emerald-500/30
                                 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          {currentLanguage === 'fr' ? "Partager mon art" : "Share My Art"}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Share Your Art Section */
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 
                             bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 
                             dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 
                             bg-clip-text text-transparent animate-title-glow">
                  {currentLanguage === 'fr' ? "Partagez votre création" : "Share Your Artwork"}
                </h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentLanguage === 'fr' 
                    ? "Rejoignez notre communauté et inspirez les autres avec votre art environnemental" 
                    : "Join our community and inspire others with your environmental artwork"}
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
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
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                                  rounded-2xl blur opacity-0 group-hover:opacity-100 
                                  transition-all duration-500"></div>
                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-8 
                                  rounded-2xl border border-gray-200 dark:border-gray-700 h-full group-hover:border-emerald-500/30 
                                  transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/5">
                      <div className="inline-flex items-center justify-center w-16 h-16 
                                    rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 
                                    text-white text-2xl font-bold mb-4 relative overflow-hidden
                                    group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                       -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      </div>
                      <item.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 
                                          mb-4 mx-auto transform group-hover:scale-110 
                                          transition-transform duration-300 group-hover:rotate-12" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 
                                   mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-700/80 dark:text-gray-300/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-white/60 to-emerald-500/10 
                            dark:from-gray-800/60 dark:to-emerald-500/5 backdrop-blur-sm 
                            rounded-3xl border border-gray-200 dark:border-gray-700 p-8
                            transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center
                             bg-gradient-to-r from-emerald-600 to-teal-600 
                             dark:from-emerald-400 dark:to-teal-400 
                             bg-clip-text text-transparent">
                  {currentLanguage === 'fr' ? "Coordonnées" : "Contact Information"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl 
                                  border border-gray-200 dark:border-gray-700 group-hover:border-emerald-500/30 
                                  transition-all duration-300 transform group-hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10
                                      group-hover:from-emerald-500/20 group-hover:to-teal-500/20 
                                      transition-all duration-300 group-hover:scale-110">
                          <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400 
                                         group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {currentLanguage === 'fr' ? "Courriel" : "Email"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLanguage === 'fr' ? "Envoyez votre création à" : "Send your artwork to"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-lg font-mono text-gray-800 dark:text-gray-200 break-all 
                                       bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg flex-1">
                          recyclagemaria@gmail.com
                        </code>
                        <button
                          onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-300 
                                   transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 min-w-[100px]
                                   bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30"
                          title={currentLanguage === 'fr' ? "Copier l'email" : "Copy email"}
                        >
                          <span>{currentLanguage === 'fr' ? "Copier" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl 
                                  border border-gray-200 dark:border-gray-700 group-hover:border-pink-500/30 
                                  transition-all duration-300 transform group-hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10
                                      group-hover:from-pink-500/20 group-hover:to-purple-500/20 
                                      transition-all duration-300 group-hover:scale-110">
                          <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 
                                              group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            Instagram
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLanguage === 'fr' ? "Envoyez-nous votre création en MP" : "DM us your artwork"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-lg font-mono text-gray-800 dark:text-gray-200 break-all
                                       bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg flex-1">
                          @recyclage_projet
                        </code>
                        <button
                          onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                          className="px-4 py-2 rounded-lg relative overflow-hidden group/btn
                                   bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                   font-semibold hover:shadow-lg hover:shadow-pink-500/30
                                   transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                                   flex items-center gap-2 min-w-[100px] justify-center"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <Instagram className="w-4 h-4" />
                            {currentLanguage === 'fr' ? "Suivre" : "Follow"}
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-8 p-6 rounded-xl 
                              bg-gradient-to-br from-emerald-500/5 to-teal-500/5 
                              border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 
                               flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 
                                       animate-pulse-gentle" />
                    {currentLanguage === 'fr' ? "Directives de soumission" : "Submission Guidelines"}
                  </h4>
                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-3 group/item">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-2 
                                     group-hover/item:scale-150 transition-transform duration-300"></span>
                      <span>{currentLanguage === 'fr' 
                        ? "Incluez votre nom complet pour un crédit approprié" 
                        : "Include your full name for proper credit"}</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-2
                                     group-hover/item:scale-150 transition-transform duration-300 animation-delay-100"></span>
                      <span>{currentLanguage === 'fr' 
                        ? "Formats acceptés : JPG, PNG, PDF (haute qualité recommandée)" 
                        : "Accepted formats: JPG, PNG, PDF (high quality recommended)"}</span>
                    </li>
                    <li className="flex items-start gap-3 group/item">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mt-2
                                     group-hover/item:scale-150 transition-transform duration-300 animation-delay-200"></span>
                      <span>{currentLanguage === 'fr' 
                        ? "Gardez le contenu éducatif et inspirant sur les thèmes environnementaux" 
                        : "Keep content educational and inspiring about environmental topics"}</span>
                    </li>
                  </ul>
                </div>

                {/* Send Message Button */}
                <div className="mt-8 text-center">
                  <button
                    onClick={navigateToContact}
                    className="px-8 py-4 rounded-full relative overflow-hidden group
                             bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 
                             text-white font-semibold text-lg
                             hover:shadow-2xl hover:shadow-emerald-500/30
                             transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Send className="w-5 h-5" />
                      {currentLanguage === 'fr' ? "Nous envoyer un message" : "Send us a message"}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    {currentLanguage === 'fr' 
                      ? "Ou utilisez notre formulaire de contact pour toute question" 
                      : "Or use our contact form for any questions"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenPoster && (
        <FullscreenModal
          isOpen={!!fullscreenPoster}
          onClose={() => setFullscreenPoster(null)}
          title={fullscreenPoster.title}
          author={fullscreenPoster.author}
          language={currentLanguage === 'fr' ? 'fr' : 'en'}
        >
          {fullscreenPoster.canvaEmbedUrl ? (
            <iframe
              src={fullscreenPoster.canvaEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title={`${fullscreenPoster.title} by ${fullscreenPoster.author}`}
            />
          ) : fullscreenPoster.imageUrl ? (
            <img
              src={fullscreenPoster.imageUrl}
              alt={fullscreenPoster.title}
              className="w-full h-full object-contain"
            />
          ) : null}
        </FullscreenModal>
      )}

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
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

        @keyframes title-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.2)); }
          50% { filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.4)); }
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

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 15s ease-in-out infinite;
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

        .animate-title-glow {
          animation: title-glow 4s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-modal-enter {
          animation: modal-enter 0.3s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

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

        .animation-delay-0 { animation-delay: 0ms !important; }
        .animation-delay-100 { animation-delay: 100ms !important; }
        .animation-delay-200 { animation-delay: 200ms !important; }
        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-500 { animation-delay: 500ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }

        /* Responsive improvements */
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          h1 {
            font-size: 2.5rem !important;
          }
          
          .grid {
            gap: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}