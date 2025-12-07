import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  Search, 
  ExternalLink, 
  Sparkles, 
  Leaf, 
  Zap, 
  Mail, 
  Instagram, 
  Upload, 
  User, 
  Palette, 
  Send, 
  Heart, 
  Eye, 
  Download, 
  Share2, 
  Copy, 
  Check,
  X,
  Maximize2,
  Minimize2,
  Globe,
  Image as ImageIcon,
  AlertCircle,
  Film,
  Clock
} from "lucide-react";

interface Poster {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  language: "fr" | "en";
  tags: string[];
  views: number;
  likes: number;
  source?: string;
  type: "image" | "embed";
  embedUrl?: string;
  createdAt: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80";

interface LightboxState {
  isOpen: boolean;
  poster: Poster | null;
}

const CanvaEmbed = ({ embedUrl, title }: { embedUrl: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };
    
    const iframe = iframeRef.current;
    
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      const timeoutId = setTimeout(() => {
        if (isLoading) setIsLoading(false);
      }, 5000);
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
        clearTimeout(timeoutId);
      };
    }
  }, [isLoading]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-emerald-50/20 to-teal-50/20 dark:from-gray-900 dark:to-emerald-950/20 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full animate-spin mx-auto mb-4">
              <div className="w-full h-full border-4 border-transparent border-t-emerald-500 rounded-full"></div>
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
              Loading interactive poster...
            </p>
          </div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load interactive poster</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Please try opening in Canva directly</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full" style={{ paddingTop: '141.4286%' }}>
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
            title={title}
            allowFullScreen
            allow="fullscreen"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};

export default function Posters() {
  const { t, language = 'en' } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<"gallery" | "share">("gallery");
  const [postersData, setPostersData] = useState<Poster[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    poster: null
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const lightboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize posters data
  const initializePosters = useCallback((currentLanguage: string): Poster[] => {
    const basePosters: Poster[] = [
      // Yahia Ikni - Canva Embeds (French)
      {
        id: 1,
        imageUrl: "https://i.ibb.co/h7tSmRD/yahia-poster2.jpg",
        title: "ALLONS RECYCLER",
        description: "Poster minimaliste et moderne pour promouvoir le recyclage quotidien",
        author: "Yahia Ikni",
        language: "fr",
        tags: [],
        views: 0,
        likes: 0,
        source: "Canva Design",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        imageUrl: "https://i.ibb.co/nb0gWJv/yahia-poster1.jpg",
        title: "Green Illustrative Save the Earth With 3R Poster",
        description: "Illustration éducative vibrante présentant les principes des 3R",
        author: "Yahia Ikni",
        language: "fr",
        tags: [],
        views: 0,
        likes: 0,
        source: "Canva Design",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
        createdAt: "2024-01-10"
      },
      // Salsabile - French Posters
      {
        id: 3,
        imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
        title: "Guide du Recyclage Quotidien",
        description: "Infographie détaillée pour intégrer le recyclage dans votre routine",
        author: "Salsabile",
        language: "fr",
        tags: [],
        views: 0,
        likes: 0,
        type: "image",
        createdAt: "2024-01-20"
      },
      {
        id: 4,
        imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
        title: "École Écoresponsable",
        description: "Poster éducatif pour sensibiliser les élèves aux gestes écologiques",
        author: "Salsabile",
        language: "fr",
        tags: [],
        views: 0,
        likes: 0,
        type: "image",
        createdAt: "2024-01-18"
      },
      // Salsabile - English Posters
      {
        id: 5,
        imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
        title: "Earth Day Conversation Starters",
        description: "Collection de questions engageantes pour stimuler des conversations",
        author: "Salsabile",
        language: "en",
        tags: [],
        views: 0,
        likes: 0,
        type: "image",
        createdAt: "2024-01-22"
      },
      {
        id: 6,
        imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
        title: "Recycling Mascot Adventures",
        description: "Poster ludique et éducatif avec une mascotte de recyclage",
        author: "Salsabile",
        language: "en",
        tags: [],
        views: 0,
        likes: 0,
        type: "image",
        createdAt: "2024-01-21"
      },
      {
        id: 7,
        imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
        title: "Simple Zero Waste Lifestyle",
        description: "Guide visuel étape par étape pour un mode de vie zéro déchet",
        author: "Salsabile",
        language: "en",
        tags: [],
        views: 0,
        likes: 0,
        type: "image",
        createdAt: "2024-01-19"
      }
    ];

    // Filter by current language
    if (currentLanguage === 'fr') {
      return basePosters.filter(poster => poster.language === 'fr');
    } else {
      return basePosters.filter(poster => poster.language === 'en');
    }
  }, []);

  // Load posters on mount and language change
  useEffect(() => {
    setMounted(true);
    
    const loadPosters = async () => {
      try {
        const currentLanguage = language || 'en';
        const posters = initializePosters(currentLanguage);
        
        // Set data immediately
        setPostersData(posters);
        
        // Preload images
        const loadPromises = posters.map(poster => {
          return new Promise<void>((resolve) => {
            if (poster.type === 'image') {
              const img = new Image();
              img.src = poster.imageUrl;
              img.onload = () => {
                setLoadedImages(prev => new Set(prev).add(poster.id));
                resolve();
              };
              img.onerror = () => {
                console.warn(`Failed to load image for poster ${poster.id}`);
                poster.imageUrl = FALLBACK_IMAGE;
                setLoadedImages(prev => new Set(prev).add(poster.id));
                resolve();
              };
            } else {
              // For embed posters, consider loaded immediately
              setLoadedImages(prev => new Set(prev).add(poster.id));
              resolve();
            }
          });
        });

        await Promise.allSettled(loadPromises);
        
      } catch (error) {
        console.error('Error loading posters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosters();
  }, [language, initializePosters]);

  // Filter posters based on search query
  const filteredPosters = useMemo(() => {
    if (!searchQuery.trim()) return postersData;
    
    const query = searchQuery.toLowerCase().trim();
    return postersData.filter(poster =>
      poster.title.toLowerCase().includes(query) ||
      poster.description.toLowerCase().includes(query) ||
      poster.author.toLowerCase().includes(query)
    );
  }, [postersData, searchQuery]);

  // Handle opening in new tab
  const handleOpenNewTab = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Copy to clipboard with visual feedback
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
      document.body.removeChild(textArea);
    });
  }, []);

  // Handle image error
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, posterId: number) => {
    const img = e.target as HTMLImageElement;
    img.src = FALLBACK_IMAGE;
    
    setPostersData(prev => prev.map(p => 
      p.id === posterId 
        ? { ...p, imageUrl: FALLBACK_IMAGE }
        : p
    ));
  }, []);

  // Lightbox functions
  const openLightbox = useCallback((poster: Poster) => {
    setLightbox({ isOpen: true, poster });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ isOpen: false, poster: null });
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!lightboxRef.current) return;
    
    if (!isFullscreen) {
      lightboxRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Event listeners
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightbox.isOpen) {
        closeLightbox();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [lightbox.isOpen, closeLightbox]);

  // Get Canva direct link
  const getCanvaDirectLink = useCallback((embedUrl?: string) => {
    if (!embedUrl) return '#';
    const match = embedUrl.match(/\/design\/([^\/]+)\/([^\/]+)\/view/);
    if (match) {
      return `https://www.canva.com/design/${match[1]}/view?utm_content=${match[1]}&utm_campaign=designshare&utm_medium=embeds&utm_source=link`;
    }
    return embedUrl;
  }, []);

  // Focus search on mount
  useEffect(() => {
    if (mounted && searchInputRef.current && activeSection === 'gallery') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  }, [mounted, activeSection]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-500/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-ping"></div>
          </div>
          <Leaf className="absolute -top-3 -right-3 w-6 h-6 text-emerald-500 animate-bounce animation-delay-400" />
        </div>
      </div>
    );
  }

  const currentLanguage = language || 'en';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/20 dark:from-gray-950 dark:to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/60 via-white/40 to-emerald-50/30 dark:from-gray-950/90 dark:via-gray-900/80 dark:to-emerald-950/10"></div>
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-[500px] md:h-[500px] bg-emerald-600/5 rounded-full blur-3xl animate-pulse-gentle animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-8 md:mb-12 relative">
              <div className="relative">
                <Sparkles className="hidden md:block absolute -left-10 top-1/2 w-6 h-6 text-emerald-400 animate-float-slow" />
                <Leaf className="hidden md:block absolute -right-10 top-1/2 w-6 h-6 text-emerald-300 animate-float-slow animation-delay-1000" />
                
                <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 
                               bg-gradient-to-r from-gray-900 via-emerald-700 to-emerald-600 
                               dark:from-gray-100 dark:via-emerald-400 dark:to-emerald-300 
                               bg-clip-text text-transparent tracking-tight">
                  {currentLanguage === 'fr' ? "Galerie Écologique" : "Eco Gallery"}
                </h1>
                
                <div className="relative h-1.5 overflow-hidden max-w-xl mx-auto rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  dark:via-emerald-400 animate-shimmer rounded-full"></div>
                </div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 
                          max-w-2xl mx-auto leading-relaxed font-light mb-8">
              {currentLanguage === 'fr' 
                ? "Découvrez des créations inspirantes pour un avenir durable" 
                : "Discover inspiring creations for a sustainable future"}
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center gap-2 relative overflow-hidden group
                           transform hover:-translate-y-0.5 active:scale-95
                           ${activeSection === "gallery" 
                             ? `bg-gradient-to-r from-gray-900 to-emerald-800 text-white
                                shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/15`
                             : `bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-300 dark:border-gray-600`
                           }`}
              >
                <Palette className="w-4 h-4" />
                {currentLanguage === 'fr' ? "Galerie" : "Gallery"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center gap-2 relative overflow-hidden group
                           transform hover:-translate-y-0.5 active:scale-95
                           ${activeSection === "share" 
                             ? `bg-gradient-to-r from-gray-900 to-emerald-800 text-white
                                shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/15` 
                             : `bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-300 dark:border-gray-600`
                           }`}
              >
                <Upload className="w-4 h-4" />
                {currentLanguage === 'fr' ? "Partager" : "Share"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section */}
              <div className="max-w-2xl mx-auto mb-12 md:mb-16">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                     text-gray-600/70 dark:text-gray-400/70 w-4 h-4
                                     transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={currentLanguage === 'fr' 
                        ? "Rechercher par titre ou auteur..." 
                        : "Search by title or author..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 
                               bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
                               border border-gray-300 dark:border-gray-600
                               rounded-xl text-base
                               text-gray-900 dark:text-gray-100 
                               placeholder:text-gray-600/50 dark:placeholder:text-gray-400/50 
                               focus:outline-none focus:border-emerald-500 
                               focus:ring-2 focus:ring-emerald-500/20 
                               transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                 text-gray-600/70 dark:text-gray-400/70 hover:text-gray-500 
                                 transition-all duration-200 p-1"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full 
                                    bg-gradient-to-br from-gray-500/10 to-emerald-500/10 
                                    flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-500/50" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {currentLanguage === 'fr' ? "Aucun résultat" : "No results found"}
                      </h3>
                      <p className="text-gray-700/70 dark:text-gray-300/70">
                        {currentLanguage === 'fr' 
                          ? "Essayez d'autres termes de recherche" 
                          : "Try different search terms"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-2.5 rounded-full 
                               bg-gradient-to-r from-gray-900 to-emerald-800 text-white 
                               font-semibold hover:shadow-lg hover:shadow-emerald-500/25
                               transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {currentLanguage === 'fr' ? "Tout afficher" : "View All"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500/10 to-emerald-500/10">
                          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {filteredPosters.length} {currentLanguage === 'fr' ? "posters" : "posters"}
                          </h3>
                          {searchQuery && (
                            <p className="text-sm text-gray-700/70 dark:text-gray-300/70 mt-0.5">
                              {currentLanguage === 'fr' ? "Résultats pour" : "Results for"} "
                              <span className="font-medium text-emerald-700 dark:text-emerald-300">{searchQuery}</span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 
                                   hover:text-emerald-700 px-3 py-1.5 rounded-lg 
                                   bg-emerald-500/10 dark:bg-emerald-500/20 hover:bg-emerald-500/20 
                                   transition-all duration-300"
                        >
                          {currentLanguage === 'fr' ? "Effacer" : "Clear"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Modern Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="group relative"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        {/* Poster Card */}
                        <Card 
                          className="overflow-hidden border border-gray-300 dark:border-gray-700 
                                     bg-white dark:bg-gray-900 h-full relative
                                     hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 
                                     transition-all duration-500 cursor-pointer"
                          onClick={() => openLightbox(poster)}
                        >
                          {/* Gradient Border Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Poster Preview Container */}
                          <div className="relative w-full pt-[141.4286%] overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {/* Image or Embed Preview */}
                            {poster.type === 'embed' ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-full h-full">
                                  {/* Preview Image */}
                                  <img
                                    src={poster.imageUrl}
                                    alt={poster.title}
                                    className="absolute inset-0 w-full h-full object-cover 
                                             group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => handleImageError(e, poster.id)}
                                  />
                                  
                                  {/* Interactive Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
                                                opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                  
                                  {/* Play Button */}
                                  <div className="absolute inset-0 flex items-center justify-center 
                                                opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm 
                                                  flex items-center justify-center 
                                                  transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                      <Globe className="w-8 h-8 text-white" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={poster.imageUrl}
                                alt={poster.title}
                                className="absolute inset-0 w-full h-full object-cover 
                                         group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => handleImageError(e, poster.id)}
                              />
                            )}
                            
                            {/* Hover Expand Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent 
                                          opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 
                                            group-hover:translate-y-0 transition-transform duration-500">
                                <Maximize2 className="w-5 h-5 mb-2 mx-auto" />
                                <p className="text-xs text-center opacity-90">
                                  {currentLanguage === 'fr' ? "Cliquez pour agrandir" : "Click to expand"}
                                </p>
                              </div>
                            </div>
                            
                            {/* Language Badge */}
                            <div className="absolute top-3 left-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                             ${poster.language === 'fr' 
                                               ? 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white' 
                                               : 'bg-gradient-to-r from-gray-800/90 to-gray-700/90 text-white'}`}>
                                {poster.language.toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Interactive Badge for Canva */}
                            {poster.type === 'embed' && (
                              <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                               bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white
                                               flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  Interactive
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-4 relative z-10 bg-white dark:bg-gray-900">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 
                                         line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 
                                         transition-colors duration-300">
                              {poster.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                              {poster.description}
                            </p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 
                                          flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {poster.author}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                {poster.type === 'embed' ? (
                                  <>
                                    <Globe className="w-3 h-3" />
                                    <span>Canva</span>
                                  </>
                                ) : (
                                  <>
                                    <ImageIcon className="w-3 h-3" />
                                    <span>Image</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Shine Effect */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                        opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full 
                                        transition-all duration-1000"></div>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* No Search Results Message */}
                  {filteredPosters.length === 0 && searchQuery && (
                    <div className="text-center mt-16">
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentLanguage === 'fr' 
                          ? "Aucun poster ne correspond à votre recherche. Essayez avec d'autres mots-clés."
                          : "No posters match your search. Try different keywords."}
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* Share Section - Keep as is */
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {currentLanguage === 'fr' ? "Partagez votre vision" : "Share Your Vision"}
                </h2>
                <p className="text-lg text-gray-700/80 dark:text-gray-300/80">
                  {currentLanguage === 'fr' 
                    ? "Rejoignez notre mouvement et inspirez le changement" 
                    : "Join our movement and inspire change"}
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    icon: Palette,
                    title: currentLanguage === 'fr' ? "Créez" : "Create",
                    description: currentLanguage === 'fr' 
                      ? "Concevez des affiches percutantes sur l'environnement"
                      : "Design impactful posters about the environment"
                  },
                  {
                    icon: Send,
                    title: currentLanguage === 'fr' ? "Partagez" : "Share",
                    description: currentLanguage === 'fr' 
                      ? "Envoyez-nous vos créations avec vos crédits"
                      : "Send us your creations with proper credits"
                  },
                  {
                    icon: Film,
                    title: currentLanguage === 'fr' ? "Inspirez" : "Inspire",
                    description: currentLanguage === 'fr' 
                      ? "Votre travail sera vu par notre communauté mondiale"
                      : "Your work will be seen by our global community"
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 
                                  rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 
                                  rounded-xl border border-gray-300 dark:border-gray-600 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 
                                    rounded-full bg-gradient-to-br from-gray-900 to-emerald-800 
                                    text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-700/70 dark:text-gray-300/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-300 dark:border-gray-600 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {currentLanguage === 'fr' ? "Contactez-nous" : "Get in Touch"}
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/10
                                    group-hover:from-emerald-500/20 group-hover:to-emerald-500/20 
                                    transition-all duration-300">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Email
                          </h4>
                          <button
                            onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 
                                     ${copiedEmail 
                                       ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                       : 'bg-gradient-to-r from-gray-900 to-emerald-800 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                                     }`}
                          >
                            {copiedEmail ? (
                              <>
                                <Check className="w-3 h-3 inline mr-1" />
                                {currentLanguage === 'fr' ? "Copié" : "Copied"}
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 inline mr-1" />
                                {currentLanguage === 'fr' ? "Copier" : "Copy"}
                              </>
                            )}
                          </button>
                        </div>
                        <code className="text-base text-gray-800 dark:text-gray-200 break-all block bg-gray-500/5 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                          recyclagemaria@gmail.com
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10
                                    group-hover:from-pink-500/20 group-hover:to-purple-500/20 
                                    transition-all duration-300">
                        <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Instagram
                          </h4>
                          <button
                            onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-500 
                                     text-white text-sm font-medium hover:shadow-lg hover:shadow-pink-500/25
                                     transition-all duration-300 flex items-center gap-1"
                          >
                            <Instagram className="w-3 h-3" />
                            {currentLanguage === 'fr' ? "Suivre" : "Follow"}
                          </button>
                        </div>
                        <code className="text-base text-gray-800 dark:text-gray-200 break-all block bg-gradient-to-r from-pink-500/5 to-purple-500/5 dark:from-pink-500/10 dark:to-purple-500/10 px-3 py-2 rounded-lg">
                          @recyclage_projet
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {currentLanguage === 'fr' ? "Directives" : "Guidelines"}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700/80 dark:text-gray-300/80">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Incluez votre nom pour les crédits" 
                        : "Include your name for proper credit"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Formats : JPG, PNG, PDF (haute qualité)" 
                        : "Formats: JPG, PNG, PDF (high quality)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Contenu éducatif et positif" 
                        : "Educational and positive content"}</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Submit */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.open("mailto:recyclagemaria@gmail.com", "_blank")}
                    className="px-8 py-3 rounded-full 
                             bg-gradient-to-r from-gray-900 to-emerald-800 text-white 
                             font-semibold hover:shadow-lg hover:shadow-emerald-500/25
                             transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    {currentLanguage === 'fr' ? "Envoyer une création" : "Submit a Creation"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Lightbox Modal */}
      {lightbox.isOpen && lightbox.poster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div 
            ref={lightboxRef}
            className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-300 dark:border-gray-700">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full ${lightbox.poster.language === 'fr' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                      {lightbox.poster.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {currentLanguage === 'fr' ? 'Par' : 'By'} {lightbox.poster.author}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                           transition-all duration-300 group"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                  )}
                </button>
                <button
                  onClick={() => handleOpenNewTab(
                    lightbox.poster!.type === 'embed' 
                      ? getCanvaDirectLink(lightbox.poster!.embedUrl) 
                      : lightbox.poster!.imageUrl
                  )}
                  className="p-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 
                           text-white group"
                  title={currentLanguage === 'fr' ? "Ouvrir dans un nouvel onglet" : "Open in new tab"}
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                           transition-all duration-300 group"
                  title={currentLanguage === 'fr' ? "Fermer" : "Close"}
                >
                  <X className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-6">
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
                {lightbox.poster.type === 'embed' && lightbox.poster.embedUrl ? (
                  <div className="w-full h-full">
                    <CanvaEmbed 
                      embedUrl={lightbox.poster.embedUrl}
                      title={lightbox.poster.title}
                    />
                  </div>
                ) : (
                  <img
                    src={lightbox.poster.imageUrl}
                    alt={lightbox.poster.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-300 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                                  flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{lightbox.poster.author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lightbox.poster.type === 'embed' ? 'Interactive Poster' : 'Static Poster'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium
                                 ${lightbox.poster.language === 'fr' 
                                   ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                                   : 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20'}`}>
                    {lightbox.poster.language.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {lightbox.poster.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
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

        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }
      `}</style>
    </div>
  );
}
