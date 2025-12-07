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
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
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
        description: "Poster minimaliste et moderne pour promouvoir le recyclage quotidien avec un design épuré et des couleurs vibrantes qui capturent l'attention.",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["recyclage", "minimaliste", "moderne", "design", "écologie", "quotidien"],
        views: 2856,
        likes: 234,
        source: "Canva Design",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
        createdAt: "2024-01-15"
      },
      {
        id: 2,
        imageUrl: "https://i.ibb.co/nb0gWJv/yahia-poster1.jpg",
        title: "Green Illustrative Save the Earth With 3R Poster",
        description: "Illustration éducative vibrante présentant les principes des 3R (Réduire, Réutiliser, Recycler) avec des graphiques accrocheurs et un message environnemental fort.",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["3R", "illustration", "éducation", "environnement", "graphisme", "durabilité"],
        views: 3420,
        likes: 289,
        source: "Canva Design",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
        createdAt: "2024-01-10"
      },
      // Salsabile - French Posters
      {
        id: 3,
        imageUrl: "https://i.ibb.co/FLg4Bk0/fr1.jpg",
        title: "Guide du Recyclage Quotidien",
        description: "Infographie détaillée présentant des étapes pratiques pour intégrer facilement le recyclage dans votre routine quotidienne, avec des icônes intuitives.",
        author: "Salsabile",
        language: "fr",
        tags: ["guide", "infographie", "quotidien", "pratique", "tutoriel", "étapes"],
        views: 2190,
        likes: 187,
        type: "image",
        createdAt: "2024-01-20"
      },
      {
        id: 4,
        imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
        title: "École Écoresponsable",
        description: "Poster éducatif conçu pour sensibiliser les élèves aux gestes écologiques à adopter à l'école, avec des illustrations engageantes et des messages clairs.",
        author: "Salsabile",
        language: "fr",
        tags: ["école", "éducation", "sensibilisation", "jeunesse", "pédagogie", "écologie"],
        views: 1978,
        likes: 165,
        type: "image",
        createdAt: "2024-01-18"
      },
      // Salsabile - English Posters
      {
        id: 5,
        imageUrl: "https://i.ibb.co/TBjKSzD/english1.jpg",
        title: "Earth Day Conversation Starters",
        description: "Collection de questions engageantes et de sujets de discussion pour stimuler des conversations significatives sur l'environnement et la durabilité.",
        author: "Salsabile",
        language: "en",
        tags: ["earth day", "conversation", "discussion", "engagement", "community", "dialogue"],
        views: 2410,
        likes: 198,
        type: "image",
        createdAt: "2024-01-22"
      },
      {
        id: 6,
        imageUrl: "https://i.ibb.co/cKY4Rj0/english2.jpg",
        title: "Recycling Mascot Adventures",
        description: "Poster ludique et éducatif mettant en scène une mascotte de recyclage qui enseigne aux enfants l'importance de la durabilité à travers des aventures amusantes.",
        author: "Salsabile",
        language: "en",
        tags: ["mascot", "fun", "educational", "kids", "playful", "stories", "adventure"],
        views: 2287,
        likes: 184,
        type: "image",
        createdAt: "2024-01-21"
      },
      {
        id: 7,
        imageUrl: "https://i.ibb.co/1tyxTwJ/english3.jpg",
        title: "Simple Zero Waste Lifestyle",
        description: "Guide visuel étape par étape pour adopter un mode de vie zéro déchet avec des conseils pratiques, des alternatives simples et des astuces faciles à suivre.",
        author: "Salsabile",
        language: "en",
        tags: ["zero waste", "simple", "lifestyle", "guide", "tips", "practical", "sustainable"],
        views: 2645,
        likes: 219,
        type: "image",
        createdAt: "2024-01-19"
      },
      // Additional Environmental Posters
      {
        id: 8,
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
        title: "Green Campus Initiative",
        description: "Campagne visuelle pour promouvoir des pratiques durables dans les institutions éducatives, encourageant les étudiants à adopter des habitudes écologiques.",
        author: "Eco Education Team",
        language: "en",
        tags: ["campus", "education", "sustainability", "green", "initiative", "students"],
        views: 2176,
        likes: 173,
        type: "image",
        createdAt: "2024-01-17"
      },
      {
        id: 9,
        imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80",
        title: "Sustainable Living Guide",
        description: "Guide complet présentant des habitudes durables faciles à intégrer dans la vie quotidienne, avec des visuels inspirants et des recommandations actionnables.",
        author: "Green Living Collective",
        language: "en",
        tags: ["sustainable", "guide", "living", "habits", "daily", "actionable", "eco-friendly"],
        views: 2867,
        likes: 240,
        type: "image",
        createdAt: "2024-01-16"
      },
      {
        id: 10,
        imageUrl: "https://images.unsplash.com/photo-1578558288137-7207cb8c0e85?w=800&auto=format&fit=crop&q=80",
        title: "Famille Zéro Déchet",
        description: "Illustration familiale montrant comment toute la famille peut participer à la réduction des déchets avec des gestes simples et des alternatives durables.",
        author: "Éco-Famille Collective",
        language: "fr",
        tags: ["zéro déchet", "famille", "mode de vie", "écologie", "durabilité", "responsable"],
        views: 2545,
        likes: 228,
        type: "image",
        createdAt: "2024-01-14"
      }
    ];

    // Filter by language if needed, or show all posters
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
      poster.author.toLowerCase().includes(query) ||
      poster.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [postersData, searchQuery]);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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

  // Handle like/unlike
  const handleLikePoster = useCallback((posterId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(posterId)) {
        newSet.delete(posterId);
      } else {
        newSet.add(posterId);
      }
      return newSet;
    });
  }, []);

  // Share poster functionality
  const handleSharePoster = useCallback(async (poster: Poster) => {
    const shareData = {
      title: poster.title,
      text: `${poster.title} by ${poster.author} - ${poster.description}`,
      url: poster.type === 'embed' ? `https://www.canva.com/design/${poster.embedUrl?.split('/').slice(-3, -1).join('/')}` : poster.imageUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard(shareData.url);
      }
    } else {
      copyToClipboard(shareData.url);
    }
  }, [copyToClipboard]);

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

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [language]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
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
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30 dark:from-gray-950 dark:to-emerald-950/10">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-white/40 to-teal-50/50 dark:from-gray-950/90 dark:via-gray-900/80 dark:to-emerald-950/20"></div>
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-[500px] md:h-[500px] bg-teal-600/5 rounded-full blur-3xl animate-pulse-gentle animation-delay-2000"></div>
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
                               bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 
                               dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 
                               bg-clip-text text-transparent tracking-tight">
                  {currentLanguage === 'fr' ? "Galerie Écologique" : "Eco Gallery"}
                </h1>
                
                <div className="relative h-1.5 overflow-hidden max-w-xl mx-auto rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  dark:via-emerald-400 animate-shimmer rounded-full"></div>
                </div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-emerald-800/80 dark:text-emerald-200/80 
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
                             ? `bg-gradient-to-r from-emerald-700 to-teal-600 text-white
                                shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/15`
                             : `bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/80 border border-emerald-500/20`
                           }`}
              >
                <Palette className="w-4 h-4" />
                {currentLanguage === 'fr' ? "Galerie" : "Gallery"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center gap-2 relative overflow-hidden group
                           transform hover:-translate-y-0.5 active:scale-95
                           ${activeSection === "share" 
                             ? `bg-gradient-to-r from-emerald-700 to-teal-600 text-white
                                shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/15` 
                             : `bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/80 border border-emerald-500/20`
                           }`}
              >
                <Upload className="w-4 h-4" />
                {currentLanguage === 'fr' ? "Partager" : "Share"}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section */}
              <div className="max-w-2xl mx-auto mb-12 md:mb-16">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                     text-emerald-600/70 dark:text-emerald-400/70 w-4 h-4
                                     transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={currentLanguage === 'fr' 
                        ? "Rechercher par titre, auteur ou mot-clé..." 
                        : "Search by title, author, or keyword..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 
                               bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
                               border border-emerald-500/20 dark:border-emerald-500/30 
                               rounded-xl text-base
                               text-emerald-900 dark:text-emerald-100 
                               placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 
                               focus:outline-none focus:border-emerald-500/40 
                               focus:ring-2 focus:ring-emerald-500/20 
                               transition-all duration-300"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                 text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500 
                                 transition-all duration-200 p-1"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full 
                                    bg-gradient-to-br from-emerald-500/10 to-teal-500/10 
                                    flex items-center justify-center">
                        <Search className="w-8 h-8 text-emerald-500/50" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                        {currentLanguage === 'fr' ? "Aucun résultat" : "No results found"}
                      </h3>
                      <p className="text-emerald-700/70 dark:text-emerald-300/70">
                        {currentLanguage === 'fr' 
                          ? "Essayez d'autres termes de recherche" 
                          : "Try different search terms"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-2.5 rounded-full 
                               bg-gradient-to-r from-emerald-700 to-teal-600 text-white 
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
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                          <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {currentLanguage === 'fr' ? "créations" : "creations"}
                          </h3>
                          {searchQuery && (
                            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">
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

                  {/* Posters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="transform transition-all duration-300 hover:-translate-y-1"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <Card 
                          className="overflow-hidden border border-emerald-500/15 dark:border-emerald-500/20 
                                     bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full group 
                                     hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 
                                     transition-all duration-300 cursor-pointer"
                          onClick={() => openLightbox(poster)}
                        >
                          {/* Poster Preview */}
                          <div className="relative w-full pt-[140%] overflow-hidden 
                                        bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                            {/* Image */}
                            <img
                              src={poster.imageUrl}
                              alt={poster.title}
                              className="absolute inset-0 w-full h-full object-cover 
                                       group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => handleImageError(e, poster.id)}
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent 
                                          opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            
                            {/* Interactive Badge for Canva */}
                            {poster.type === 'embed' && (
                              <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                               bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white">
                                  <Globe className="w-3 h-3 inline mr-1" />
                                  Interactive
                                </span>
                              </div>
                            )}
                            
                            {/* Language Badge */}
                            <div className="absolute top-3 left-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                             ${poster.language === 'fr' 
                                               ? 'bg-gradient-to-r from-teal-600/90 to-teal-500/90 text-white' 
                                               : 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white'}`}>
                                {poster.language.toUpperCase()}
                              </span>
                            </div>
                            
                            {/* Hover Actions */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3 
                                            transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <Maximize2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            </div>
                            
                            {/* Stats at Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 
                                          transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <div className="flex items-center justify-between text-white/90 text-xs">
                                <div className="flex items-center gap-2">
                                  <Eye className="w-3 h-3" />
                                  <span>{poster.views.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart className={`w-3 h-3 ${likedPosts.has(poster.id) ? 'fill-current text-red-400' : ''}`} />
                                  <span>{poster.likes + (likedPosts.has(poster.id) ? 1 : 0)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(poster.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 
                                           line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                {poster.title}
                              </h3>
                              <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 mt-1 line-clamp-2">
                                {poster.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></div>
                                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                  {poster.author}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {poster.tags.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500/10 
                                             text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {poster.tags.length > 2 && (
                                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500/5 
                                                 text-emerald-600/60 dark:text-emerald-400/60">
                                    +{poster.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Load More / Community CTA */}
                  {!searchQuery && (
                    <div className="mt-16 text-center">
                      <div className="inline-block max-w-lg mx-auto">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/60 to-emerald-500/10 
                                      backdrop-blur-sm border border-emerald-500/15">
                          <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-3 animate-pulse" />
                          <p className="text-emerald-800/80 dark:text-emerald-200/80 mb-4">
                            {currentLanguage === 'fr' 
                              ? "Votre création pourrait être la prochaine à inspirer notre communauté !" 
                              : "Your creation could be next to inspire our community!"}
                          </p>
                          <button
                            onClick={() => setActiveSection("share")}
                            className="px-6 py-2.5 rounded-full 
                                     bg-gradient-to-r from-emerald-700 to-teal-600 text-white 
                                     font-semibold hover:shadow-lg hover:shadow-emerald-500/25
                                     transition-all duration-300 transform hover:-translate-y-0.5"
                          >
                            {currentLanguage === 'fr' ? "Participer" : "Submit Yours"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            /* Share Section */
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-4">
                  {currentLanguage === 'fr' ? "Partagez votre vision" : "Share Your Vision"}
                </h2>
                <p className="text-lg text-emerald-700/80 dark:text-emerald-300/80">
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 
                                  rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 
                                  rounded-xl border border-emerald-500/15 transition-all duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 
                                    rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 
                                    text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-emerald-500/15 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-6">
                  {currentLanguage === 'fr' ? "Contactez-nous" : "Get in Touch"}
                </h3>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10
                                    group-hover:from-emerald-500/20 group-hover:to-teal-500/20 
                                    transition-all duration-300">
                        <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
                            Email
                          </h4>
                          <button
                            onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 
                                     ${copiedEmail 
                                       ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                       : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
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
                        <code className="text-base text-emerald-800 dark:text-emerald-200 break-all block bg-emerald-500/5 px-3 py-2 rounded-lg">
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
                          <h4 className="font-medium text-emerald-900 dark:text-emerald-100">
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
                        <code className="text-base text-emerald-800 dark:text-emerald-200 break-all block bg-gradient-to-r from-pink-500/5 to-purple-500/5 px-3 py-2 rounded-lg">
                          @recyclage_projet
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="mt-8 pt-6 border-t border-emerald-500/15">
                  <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {currentLanguage === 'fr' ? "Directives" : "Guidelines"}
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-700/80 dark:text-emerald-300/80">
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
                             bg-gradient-to-r from-emerald-700 to-teal-600 text-white 
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

      {/* Lightbox Modal */}
      {lightbox.isOpen && lightbox.poster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div 
            ref={lightboxRef}
            className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${lightbox.poster.language === 'fr' ? 'bg-teal-500' : 'bg-emerald-500'}`} />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100 truncate">
                    {lightbox.poster.title}
                  </span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  {lightbox.poster.language.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                >
                  <X className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-4">
              {lightbox.poster.type === 'embed' && lightbox.poster.embedUrl ? (
                <CanvaEmbed 
                  embedUrl={lightbox.poster.embedUrl}
                  title={lightbox.poster.title}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <img
                    src={lightbox.poster.imageUrl}
                    alt={lightbox.poster.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <span className="text-sm text-emerald-700 dark:text-emerald-300">
                      {lightbox.poster.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Eye className="w-3 h-3" />
                      {lightbox.poster.views.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => handleLikePoster(lightbox.poster!.id)}
                      className={`flex items-center gap-1 ${likedPosts.has(lightbox.poster!.id) ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}
                    >
                      <Heart className={`w-3 h-3 ${likedPosts.has(lightbox.poster!.id) ? 'fill-current' : ''}`} />
                      {lightbox.poster.likes + (likedPosts.has(lightbox.poster!.id) ? 1 : 0)}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {lightbox.poster.type === 'embed' ? (
                    <button
                      onClick={() => handleOpenNewTab(getCanvaDirectLink(lightbox.poster.embedUrl))}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 
                               text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25
                               transition-all duration-300 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {currentLanguage === 'fr' ? "Ouvrir" : "Open"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenNewTab(lightbox.poster!.imageUrl)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 
                               text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25
                               transition-all duration-300 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      {currentLanguage === 'fr' ? "Télécharger" : "Download"}
                    </button>
                  )}
                  <button
                    onClick={() => handleSharePoster(lightbox.poster!)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 
                             text-emerald-700 dark:text-emerald-300 text-sm font-medium border border-emerald-500/20
                             hover:bg-emerald-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                    {currentLanguage === 'fr' ? "Partager" : "Share"}
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mb-3">
                {lightbox.poster.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {lightbox.poster.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 
                             text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  >
                    {tag}
                  </span>
                ))}
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
