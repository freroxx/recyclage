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
  poster: null;
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
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-emerald-50/20 to-teal-50/20 dark:from-[#0f1a15] dark:to-emerald-950/20 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="text-center animate-fade-in">
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
        <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in">
          <div className="text-center p-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
            <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load interactive poster</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Please try opening in Canva directly</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
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
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{width: number; height: number}>({width: 0, height: 0});
  const [hoveredPosterId, setHoveredPosterId] = useState<number | null>(null);
  
  const lightboxRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);

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

  // Lightbox functions with animations
  const openLightbox = useCallback((poster: Poster) => {
    setLightbox({ isOpen: true, poster: poster as any });
    document.body.style.overflow = 'hidden';
    
    // Preload image for dimension calculation
    if (poster.type === 'image') {
      const img = new Image();
      img.src = poster.imageUrl;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const isVertical = aspectRatio <= 0.75; // 3:4 ratio or more vertical
        setImageDimensions({width: img.width, height: img.height});
      };
    }
    
    // Trigger animation after state update
    setTimeout(() => {
      setLightboxVisible(true);
    }, 10);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
    
    // Wait for exit animation before removing
    setTimeout(() => {
      setLightbox({ isOpen: false, poster: null });
      setIsFullscreen(false);
      document.body.style.overflow = 'unset';
    }, 300);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-emerald-50 dark:from-[#0f1a15] dark:via-[#0f1a15] dark:to-emerald-950/20">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/20 dark:from-[#0f1a15] dark:to-[#0f1a15]">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/60 via-white/40 to-emerald-50/30 dark:from-[#0f1a15]/90 dark:via-[#0f1a15]/80 dark:to-emerald-950/10 animate-gradient-pan"></div>
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-[500px] md:h-[500px] bg-emerald-600/5 rounded-full blur-3xl animate-pulse-gentle animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-[2px] bg-emerald-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12" ref={sectionRef}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-up">
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
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-500 
                           flex items-center gap-2 relative overflow-hidden group
                           transform hover:-translate-y-1 active:scale-95
                           hover:shadow-xl hover:shadow-emerald-500/20
                           ${activeSection === "gallery" 
                             ? `bg-gradient-to-r from-gray-900 to-emerald-800 text-white
                                shadow-xl shadow-emerald-500/30 dark:shadow-emerald-500/20
                                animate-glow`
                             : `bg-white/80 dark:bg-[#1a2a22]/80 text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-[#1a2a22] border border-gray-300 dark:border-emerald-900/50`
                           }`}
              >
                <Palette className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {currentLanguage === 'fr' ? "Galerie" : "Gallery"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-500 
                           flex items-center gap-2 relative overflow-hidden group
                           transform hover:-translate-y-1 active:scale-95
                           hover:shadow-xl hover:shadow-emerald-500/20
                           ${activeSection === "share" 
                             ? `bg-gradient-to-r from-gray-900 to-emerald-800 text-white
                                shadow-xl shadow-emerald-500/30 dark:shadow-emerald-500/20
                                animate-glow` 
                             : `bg-white/80 dark:bg-[#1a2a22]/80 text-gray-700 dark:text-gray-300
                                hover:bg-gray-50 dark:hover:bg-[#1a2a22] border border-gray-300 dark:border-emerald-900/50`
                           }`}
              >
                <Upload className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {currentLanguage === 'fr' ? "Partager" : "Share"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section - Removed flickering glow */}
              <div className="max-w-2xl mx-auto mb-12 md:mb-16 animate-fade-up animation-delay-100">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-700"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                     text-gray-600/70 dark:text-gray-400/70 w-4 h-4
                                     transition-all duration-500 group-hover:scale-125 group-hover:text-emerald-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={currentLanguage === 'fr' 
                        ? "Rechercher par titre ou auteur..." 
                        : "Search by title or author..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 
                               bg-white/90 dark:bg-[#1a2a22]/90 backdrop-blur-sm 
                               border border-gray-300 dark:border-emerald-900/50
                               rounded-xl text-base
                               text-gray-900 dark:text-gray-100 
                               placeholder:text-gray-600/50 dark:placeholder:text-gray-400/50 
                               focus:outline-none focus:border-emerald-500 
                               focus:ring-2 focus:ring-emerald-500/30 
                               transition-all duration-500
                               hover:shadow-xl hover:shadow-emerald-500/20"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                 text-gray-600/70 dark:text-gray-400/70 hover:text-gray-500 
                                 transition-all duration-300 p-1 hover:scale-125"
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
                <div className="text-center py-20 animate-fade-in">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full 
                                    bg-gradient-to-br from-gray-500/10 to-emerald-500/10 
                                    flex items-center justify-center animate-pulse">
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
                               font-semibold hover:shadow-xl hover:shadow-emerald-500/30
                               transition-all duration-500 transform hover:-translate-y-1
                               hover:scale-105 active:scale-95"
                    >
                      {currentLanguage === 'fr' ? "Tout afficher" : "View All"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-8 animate-fade-up animation-delay-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500/10 to-emerald-500/10 animate-pulse">
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
                                   transition-all duration-500 transform hover:scale-110"
                        >
                          {currentLanguage === 'fr' ? "Effacer" : "Clear"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Modern Gallery Grid - Fixed Canva embeds for Yahia's posters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="group relative animate-fade-up"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                        onMouseEnter={() => poster.type === 'embed' && setHoveredPosterId(poster.id)}
                        onMouseLeave={() => poster.type === 'embed' && setHoveredPosterId(null)}
                      >
                        {/* Poster Card */}
                        <Card 
                          className="overflow-hidden border border-gray-300 dark:border-emerald-900/50 
                                     bg-white dark:bg-[#1a2a22] h-full relative
                                     hover:border-emerald-500/70 hover:shadow-2xl hover:shadow-emerald-500/20 
                                     transition-all duration-700 cursor-pointer
                                     hover:scale-[1.03] active:scale-[0.98]"
                          onClick={() => openLightbox(poster)}
                        >
                          {/* Gradient Border Effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                          
                          {/* Poster Preview Container */}
                          <div className="relative w-full pt-[141.4286%] overflow-hidden bg-gray-100 dark:bg-[#0f1a15]">
                            {/* Image or Embed Preview - Fixed to only show embed on hover for Yahia's posters */}
                            {poster.type === 'embed' ? (
                              <div className="absolute inset-0">
                                {/* Show embed only when this specific poster is hovered */}
                                {hoveredPosterId === poster.id && poster.embedUrl ? (
                                  <div className="relative w-full h-full">
                                    <div className="absolute inset-0">
                                      <iframe
                                        src={poster.embedUrl}
                                        className="absolute top-0 left-0 w-full h-full border-0"
                                        title={`${poster.title} - Preview`}
                                        loading="lazy"
                                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={poster.imageUrl}
                                    alt={poster.title}
                                    className="absolute inset-0 w-full h-full object-cover 
                                             group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => handleImageError(e, poster.id)}
                                  />
                                )}
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
                                          opacity-0 group-hover:opacity-100 transition-all duration-700">
                              <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 
                                            group-hover:translate-y-0 transition-transform duration-500">
                                <Maximize2 className="w-5 h-5 mb-2 mx-auto animate-pulse" />
                                <p className="text-xs text-center opacity-90">
                                  {currentLanguage === 'fr' ? "Cliquez pour agrandir" : "Click to expand"}
                                </p>
                              </div>
                            </div>
                            
                            {/* Language Badge */}
                            <div className="absolute top-3 left-3 animate-fade-in">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                             ${poster.language === 'fr' 
                                               ? 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white' 
                                               : 'bg-gradient-to-r from-gray-800/90 to-gray-700/90 text-white'}`}>
                                {poster.language.toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Interactive Badge for Canva */}
                            {poster.type === 'embed' && (
                              <div className="absolute top-3 right-3 animate-fade-in">
                                <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                               bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white
                                               flex items-center gap-1">
                                  <Globe className="w-3 h-3 animate-pulse" />
                                  Interactive
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-4 relative z-10 bg-white dark:bg-[#1a2a22]">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 
                                         line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 
                                         transition-colors duration-300">
                              {poster.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                              {poster.description}
                            </p>
                            
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-emerald-900/50 
                                          flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {poster.author}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                {poster.type === 'embed' ? (
                                  <>
                                    <Globe className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>Canva</span>
                                  </>
                                ) : (
                                  <>
                                    <ImageIcon className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
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
            /* Share Section */
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
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
                    className="relative group animate-fade-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-emerald-500/10 
                                  rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative bg-white/80 dark:bg-[#1a2a22]/80 backdrop-blur-sm p-6 
                                  rounded-xl border border-gray-300 dark:border-emerald-900/50 transition-all duration-700
                                  hover:scale-[1.03]">
                      <div className="inline-flex items-center justify-center w-12 h-12 
                                    rounded-full bg-gradient-to-br from-gray-900 to-emerald-800 
                                    text-white mb-4 group-hover:scale-110 transition-transform duration-500
                                    hover:shadow-xl hover:shadow-emerald-500/30">
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
              <div className="bg-white/80 dark:bg-[#1a2a22]/80 backdrop-blur-sm rounded-2xl border border-gray-300 dark:border-emerald-900/50 p-6 md:p-8 animate-fade-up animation-delay-400">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {currentLanguage === 'fr' ? "Contactez-nous" : "Get in Touch"}
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="group animate-fade-up animation-delay-500">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/10
                                    group-hover:from-emerald-500/20 group-hover:to-emerald-500/20 
                                    transition-all duration-500">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            Email
                          </h4>
                          <button
                            onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-500 
                                     transform hover:scale-110 active:scale-95
                                     ${copiedEmail 
                                       ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                       : 'bg-gradient-to-r from-gray-900 to-emerald-800 text-white hover:shadow-xl hover:shadow-emerald-500/30'
                                     }`}
                          >
                            {copiedEmail ? (
                              <>
                                <Check className="w-3 h-3 inline mr-1 animate-bounce" />
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
                  <div className="group animate-fade-up animation-delay-600">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10
                                    group-hover:from-pink-500/20 group-hover:to-purple-500/20 
                                    transition-all duration-500">
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
                                     text-white text-sm font-medium hover:shadow-xl hover:shadow-pink-500/30
                                     transition-all duration-500 flex items-center gap-1
                                     transform hover:scale-110 active:scale-95"
                          >
                            <Instagram className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
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
                <div className="mt-8 pt-6 border-t border-gray-300 dark:border-emerald-900/50 animate-fade-up animation-delay-700">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    {currentLanguage === 'fr' ? "Directives" : "Guidelines"}
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700/80 dark:text-gray-300/80">
                    <li className="flex items-start gap-2 animate-fade-up animation-delay-800">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Incluez votre nom pour les crédits" 
                        : "Include your name for proper credit"}</span>
                    </li>
                    <li className="flex items-start gap-2 animate-fade-up animation-delay-900">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Formats : JPG, PNG, PDF (haute qualité)" 
                        : "Formats: JPG, PNG, PDF (high quality)"}</span>
                    </li>
                    <li className="flex items-start gap-2 animate-fade-up animation-delay-1000">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                      <span>{currentLanguage === 'fr' 
                        ? "Contenu éducatif et positif" 
                        : "Educational and positive content"}</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Submit - Changed to use client-side navigation without new tab or reload */}
                <div className="mt-8 text-center animate-fade-up animation-delay-1100">
                  <a
                    href="/contact"
                    className="inline-block px-8 py-3 rounded-full 
                             bg-gradient-to-r from-gray-900 to-emerald-800 text-white 
                             font-semibold hover:shadow-xl hover:shadow-emerald-500/30
                             transition-all duration-500 transform hover:-translate-y-1
                             hover:scale-105 active:scale-95
                             animate-glow"
                  >
                    {currentLanguage === 'fr' ? "Envoyer une création" : "Submit a Creation"}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Vertical Lightbox Modal - Removed description */}
      {lightbox.isOpen && lightbox.poster && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1a15]/95 backdrop-blur-md transition-all duration-500 ${
          lightboxVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div 
            ref={lightboxRef}
            className={`relative bg-white dark:bg-[#1a2a22] rounded-2xl overflow-hidden flex flex-col shadow-2xl transform transition-all duration-500 ${
              lightboxVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
            }`}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: (lightbox.poster as any).type === 'embed' ? '400px' : 'auto',
              height: (lightbox.poster as any).type === 'embed' ? '711px' : 'auto',
              aspectRatio: (lightbox.poster as any).type === 'embed' ? '9/16' : imageDimensions.width && imageDimensions.height ? 
                `${imageDimensions.width}/${imageDimensions.height}` : 'auto'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-300 dark:border-emerald-900/50">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${(lightbox.poster as any).language === 'fr' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                      {(lightbox.poster as any).title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {currentLanguage === 'fr' ? 'Par' : 'By'} {(lightbox.poster as any).author}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 md:p-3 rounded-lg bg-gray-100 dark:bg-emerald-900/20 hover:bg-gray-200 dark:hover:bg-emerald-800/30 
                           transition-all duration-500 group transform hover:scale-125 active:scale-95"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-gray-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </button>
                <button
                  onClick={() => handleOpenNewTab(
                    (lightbox.poster as any).type === 'embed' 
                      ? getCanvaDirectLink((lightbox.poster as any).embedUrl) 
                      : (lightbox.poster as any).imageUrl
                  )}
                  className="p-2 md:p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 transition-all duration-500 
                           text-white group transform hover:scale-125 active:scale-95
                           hover:shadow-xl hover:shadow-emerald-500/30"
                  title={currentLanguage === 'fr' ? "Ouvrir dans un nouvel onglet" : "Open in new tab"}
                >
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 md:p-3 rounded-lg bg-gray-100 dark:bg-emerald-900/20 hover:bg-gray-200 dark:hover:bg-emerald-800/30 
                           transition-all duration-500 group transform hover:scale-125 active:scale-95"
                  title={currentLanguage === 'fr' ? "Fermer" : "Close"}
                >
                  <X className="w-4 h-4 text-gray-700 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Content - Adapts to image/embed format */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#0f1a15] rounded-xl p-2">
                {(lightbox.poster as any).type === 'embed' && (lightbox.poster as any).embedUrl ? (
                  <div className="w-full h-full min-h-[500px]" ref={embedRef}>
                    <CanvaEmbed 
                      embedUrl={(lightbox.poster as any).embedUrl}
                      title={(lightbox.poster as any).title}
                    />
                  </div>
                ) : (
                  <div className="max-w-full max-h-full overflow-auto">
                    <img
                      ref={imageRef}
                      src={(lightbox.poster as any).imageUrl}
                      alt={(lightbox.poster as any).title}
                      className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-700 hover:scale-105"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        setImageDimensions({width: img.naturalWidth, height: img.naturalHeight});
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Removed description paragraph */}
            <div className="p-4 md:p-6 border-t border-gray-300 dark:border-emerald-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                                  flex items-center justify-center animate-pulse">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{(lightbox.poster as any).author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(lightbox.poster as any).type === 'embed' ? 'Interactive Poster' : 'Static Poster'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium
                                 ${(lightbox.poster as any).language === 'fr' 
                                   ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                                   : 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-500/20'}`}>
                    {(lightbox.poster as any).language.toUpperCase()}
                  </span>
                </div>
              </div>
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

        @keyframes fade-up {
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

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        @keyframes gradient-pan {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.8);
          }
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

        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-gradient-pan {
          background-size: 200% 200%;
          animation: gradient-pan 10s ease infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
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

        .animation-delay-100 { animation-delay: 100ms !important; }
        .animation-delay-200 { animation-delay: 200ms !important; }
        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-400 { animation-delay: 400ms !important; }
        .animation-delay-500 { animation-delay: 500ms !important; }
        .animation-delay-600 { animation-delay: 600ms !important; }
        .animation-delay-700 { animation-delay: 700ms !important; }
        .animation-delay-800 { animation-delay: 800ms !important; }
        .animation-delay-900 { animation-delay: 900ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-1100 { animation-delay: 1100ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }
      `}</style>
    </div>
  );
}
