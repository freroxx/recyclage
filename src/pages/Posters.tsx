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
  Minimize2
} from "lucide-react";

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
  source?: string;
}

// Mock data for development when images fail to load
const FALLBACK_POSTERS = {
  fr: [
    {
      id: 101,
      imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80",
      title: "Protection de l'Environnement",
      description: "Un design inspirant pour la protection de notre planète",
      author: "Éco-Designer",
      language: "fr" as const,
      tags: ["environnement", "protection", "nature", "écologie"],
      views: 1500,
      likes: 120
    }
  ],
  en: [
    {
      id: 201,
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      title: "Environmental Protection",
      description: "An inspiring design for protecting our planet",
      author: "Eco Designer",
      language: "en" as const,
      tags: ["environment", "protection", "nature", "ecology"],
      views: 1800,
      likes: 150
    }
  ]
};

interface LightboxState {
  isOpen: boolean;
  poster: Poster | null;
}

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
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Initialize mounted state and load posters
  useEffect(() => {
    setMounted(true);
    
    const loadPosters = () => {
      const currentLanguage = language || 'en';
      const posters: Poster[] = [];
      
      if (currentLanguage === 'fr') {
        // French posters
        posters.push(
          {
            id: 1,
            imageUrl: "https://i.ibb.co/h7tSmRD/yahia-poster2.jpg",
            title: "Allons Recycler",
            description: "Un design minimaliste et moderne pour promouvoir le recyclage au quotidien",
            author: "Yahia Ikni",
            language: "fr",
            tags: ["recyclage", "minimaliste", "moderne", "quotidien", "3R"],
            views: 2456,
            likes: 189,
            source: "Canva Design"
          },
          {
            id: 2,
            imageUrl: "https://i.ibb.co/nb0gWJv/yahia-poster1.jpg",
            title: "Sauvons la Terre avec les 3R",
            description: "Design illustratif vibrant mettant en avant les principes Réduire, Réutiliser, Recycler",
            author: "Yahia Ikni",
            language: "fr",
            tags: ["3R", "sauver la terre", "illustration", "vibrant", "éducation"],
            views: 3120,
            likes: 245,
            source: "Canva Design"
          },
          {
            id: 3,
            imageUrl: "https://i.ibb.co/FLg4Bk0/fr1.jpg",
            title: "Guide du Recyclage Quotidien",
            description: "Infographie pratique pour intégrer le recyclage dans votre routine journalière",
            author: "Salsabile",
            language: "fr",
            tags: ["guide", "pratique", "infographie", "tutoriel", "quotidien"],
            views: 1890,
            likes: 156
          },
          {
            id: 4,
            imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
            title: "École Écoresponsable",
            description: "Poster éducatif pour sensibiliser les élèves aux gestes écologiques à l'école",
            author: "Salsabile",
            language: "fr",
            tags: ["école", "éducation", "sensibilisation", "écocitoyenneté", "jeunesse"],
            views: 1678,
            likes: 134
          },
          {
            id: 5,
            imageUrl: "https://images.unsplash.com/photo-1578558288137-7207cb8c0e85?w=800&auto=format&fit=crop&q=80",
            title: "Famille Zéro Déchet",
            description: "Illustration familiale montrant comment adopter un mode de vie sans déchets",
            author: "Éco-Famille Collective",
            language: "fr",
            tags: ["zéro déchet", "famille", "mode de vie", "écologie", "durabilité"],
            views: 2345,
            likes: 198
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
            tags: ["earth day", "conversation", "discussion", "engagement", "community"],
            views: 2100,
            likes: 167
          },
          {
            id: 7,
            imageUrl: "https://i.ibb.co/cKY4Rj0/english2.jpg",
            title: "Recycling Mascot Adventures",
            description: "Fun and educational poster featuring our recycling mascot teaching kids about sustainability",
            author: "Salsabile",
            language: "en",
            tags: ["mascot", "fun", "educational", "kids", "playful"],
            views: 1987,
            likes: 154
          },
          {
            id: 8,
            imageUrl: "https://i.ibb.co/1tyxTwJ/english3.jpg",
            title: "Simple Zero Waste Lifestyle",
            description: "Step-by-step guide to achieving a zero waste lifestyle with practical tips",
            author: "Salsabile",
            language: "en",
            tags: ["zero waste", "simple", "lifestyle", "guide", "tips"],
            views: 2245,
            likes: 189
          },
          {
            id: 9,
            imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
            title: "Green Campus Initiative",
            description: "Promoting sustainable practices in educational institutions for a greener future",
            author: "Eco Education Team",
            language: "en",
            tags: ["campus", "education", "sustainability", "green", "future"],
            views: 1876,
            likes: 143
          },
          {
            id: 10,
            imageUrl: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&auto=format&fit=crop&q=80",
            title: "Sustainable Living Guide",
            description: "Comprehensive guide to adopting sustainable habits in daily life",
            author: "Green Living Collective",
            language: "en",
            tags: ["sustainable", "guide", "living", "habits", "daily"],
            views: 2567,
            likes: 210
          }
        );
      }
      
      setPostersData(posters);
      
      posters.forEach(poster => {
        const img = new Image();
        img.src = poster.imageUrl;
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(poster.id));
        };
        img.onerror = () => {
          console.warn(`Failed to load image for poster ${poster.id}`);
          if (poster.id <= 5) {
            poster.imageUrl = FALLBACK_POSTERS.fr[0].imageUrl;
          } else {
            poster.imageUrl = FALLBACK_POSTERS.en[0].imageUrl;
          }
          setLoadedImages(prev => new Set(prev).add(poster.id));
        };
      });
    };
    
    loadPosters();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (loadedImages.size === 0) {
        const currentLanguage = language || 'en';
        const fallbackPosters = currentLanguage === 'fr' ? FALLBACK_POSTERS.fr : FALLBACK_POSTERS.en;
        setPostersData(fallbackPosters);
      }
    }, 1000);
    
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

  // Copy contact info to clipboard with visual feedback
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

  // Handle image error with fallback
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>, poster: Poster) => {
    const img = e.target as HTMLImageElement;
    const currentLanguage = language || 'en';
    const fallbackImage = currentLanguage === 'fr' 
      ? FALLBACK_POSTERS.fr[0].imageUrl
      : FALLBACK_POSTERS.en[0].imageUrl;
    
    img.src = fallbackImage;
    
    setPostersData(prev => prev.map(p => 
      p.id === poster.id 
        ? { ...p, imageUrl: fallbackImage }
        : p
    ));
  }, [language]);

  // Handle like/unlike a poster
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
      url: poster.imageUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
        copyToClipboard(poster.imageUrl);
      }
    } else {
      copyToClipboard(poster.imageUrl);
    }
  }, [copyToClipboard]);

  // Open lightbox
  const openLightbox = useCallback((poster: Poster) => {
    setLightbox({ isOpen: true, poster });
    document.body.style.overflow = 'hidden';
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightbox({ isOpen: false, poster: null });
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  }, []);

  // Toggle fullscreen for lightbox
  const toggleFullscreen = useCallback(() => {
    if (!lightboxRef.current) return;
    
    if (!isFullscreen) {
      if (lightboxRef.current.requestFullscreen) {
        lightboxRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightbox.isOpen) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [lightbox.isOpen, closeLightbox]);

  // Handle click outside to close lightbox
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (lightboxRef.current && 
          !lightboxRef.current.contains(e.target as Node) && 
          lightbox.isOpen) {
        closeLightbox();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [lightbox.isOpen, closeLightbox]);

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
    <div className="min-h-screen bg-background relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 via-background to-teal-50/30 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] 
                        bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-full blur-3xl 
                        animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] md:w-[600px] md:h-[600px] 
                        bg-gradient-to-l from-teal-600/5 to-emerald-600/5 rounded-full blur-3xl 
                        animate-pulse-gentle animation-delay-2000"></div>
        
        {/* Animated floating particles */}
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-emerald-400/20 rounded-full animate-float-particle animation-delay-0"></div>
        <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-teal-400/20 rounded-full animate-float-particle animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-emerald-300/20 rounded-full animate-float-particle animation-delay-2000"></div>
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
                  {t("posters.title") || (currentLanguage === 'fr' ? "Galerie d'Affiches" : "Posters Gallery")}
                </h1>
                
                <div className="relative h-1 overflow-hidden max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  dark:via-emerald-400 animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-emerald-800/80 dark:text-emerald-200/80 
                          max-w-3xl mx-auto leading-relaxed font-light mb-8 animate-fade-in">
              {t("posters.subtitle") || 
               (currentLanguage === 'fr' 
                 ? "Découvrez des affiches environnementales inspirantes" 
                 : "Discover inspiring environmental posters")}
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
                             : `bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/90 border border-emerald-500/20`
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
                             : `bg-white/90 dark:bg-gray-800/90 text-emerald-700 dark:text-emerald-300
                                hover:bg-emerald-50 dark:hover:bg-gray-700/90 border border-emerald-500/20`
                           }`}
              >
                <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
                {currentLanguage === 'fr' ? "Partagez" : "Share"}
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
                                     text-emerald-600/70 dark:text-emerald-400/70 w-5 h-5
                                     transition-all duration-300 group-hover:scale-110 group-hover:text-emerald-500 
                                     group-hover:rotate-12" />
                    <input
                      type="text"
                      placeholder={currentLanguage === 'fr' 
                        ? "Rechercher des affiches..." 
                        : "Search posters..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-12 py-4 
                               bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm 
                               border border-emerald-500/20 dark:border-emerald-500/30 
                               rounded-2xl text-lg 
                               text-emerald-900 dark:text-emerald-100 
                               placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 
                               focus:outline-none focus:border-emerald-500/40 
                               focus:ring-2 focus:ring-emerald-500/20 
                               transition-all duration-300 group-hover:scale-[1.02]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 
                                 text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500 
                                 transition-all duration-200 p-1 hover:scale-125 active:scale-95"
                        aria-label={currentLanguage === 'fr' ? "Effacer" : "Clear"}
                      >
                        <span className="block w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                          <X className="w-3 h-3" />
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results */}
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
                      <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                        {currentLanguage === 'fr' ? "Aucune affiche" : "No posters"}
                      </h3>
                      <p className="text-emerald-700/70 dark:text-emerald-300/70">
                        {currentLanguage === 'fr' 
                          ? "Essayez d'autres mots-clés" 
                          : "Try different keywords"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-3 rounded-full relative overflow-hidden group
                               bg-gradient-to-r from-emerald-600 to-teal-500 text-white 
                               font-semibold hover:shadow-lg hover:shadow-emerald-500/30
                               transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <span className="relative z-10">{currentLanguage === 'fr' ? "Tout voir" : "View All"}</span>
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
                          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {currentLanguage === 'fr' ? "affiches" : "posters"}
                          </h3>
                          {searchQuery && (
                            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">
                              {currentLanguage === 'fr' ? "Résultats pour" : "Results for"} "
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
                          <span className="relative z-10">{currentLanguage === 'fr' ? "Effacer" : "Clear"}</span>
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
                          className="overflow-hidden border border-emerald-500/10 dark:border-emerald-500/20 
                                     bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm h-full group 
                                     hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 
                                     transition-all duration-300 hover:scale-[1.02] active:scale-100
                                     hover:-translate-y-1 cursor-pointer"
                          onClick={() => openLightbox(poster)}
                        >
                          {/* Poster Image */}
                          <div className="relative w-full pt-[125%] sm:pt-[140%] overflow-hidden 
                                        bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                            <div className="absolute inset-0">
                              <img
                                src={poster.imageUrl}
                                alt={poster.title}
                                className="absolute w-full h-full top-0 left-0 object-cover 
                                         group-hover:scale-105 transition-transform duration-500 ease-out"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => handleImageError(e, poster)}
                              />
                              
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                            opacity-0 group-hover:opacity-100 transition-all duration-300 
                                            flex flex-col justify-end p-4">
                                <div className="flex items-center justify-between mb-3 transform translate-y-2 
                                              group-hover:translate-y-0 opacity-0 group-hover:opacity-100 
                                              transition-all duration-300 delay-100">
                                  <div className="flex items-center gap-2 text-white/90">
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm font-medium">{poster.views?.toLocaleString() || '1.2k'}</span>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLikePoster(poster.id);
                                    }}
                                    className={`flex items-center gap-2 ${likedPosts.has(poster.id) ? 'text-red-400' : 'text-white/90'} 
                                             transition-all duration-300 hover:scale-110 active:scale-95`}
                                  >
                                    <Heart className={`w-4 h-4 ${likedPosts.has(poster.id) ? 'fill-current animate-heart-beat' : ''}`} />
                                    <span className="text-sm font-medium">
                                      {((poster.likes || 0) + (likedPosts.has(poster.id) ? 1 : 0)).toLocaleString()}
                                    </span>
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 transform translate-y-4 group-hover:translate-y-0 
                                              opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openLightbox(poster);
                                    }}
                                    className="px-3 py-2 rounded-lg bg-white/90 text-emerald-700 font-medium 
                                             hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 
                                             flex items-center justify-center gap-2 text-sm group/btn"
                                  >
                                    <Maximize2 className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                                    {currentLanguage === 'fr' ? "Agrandir" : "Expand"}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenNewTab(poster.imageUrl);
                                    }}
                                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 
                                             text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30 
                                             hover:scale-105 active:scale-95 transition-all duration-200 
                                             flex items-center justify-center gap-2 text-sm group/btn"
                                  >
                                    <Download className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                                    {currentLanguage === 'fr' ? "Télécharger" : "Save"}
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

                              {/* Source badge */}
                              {poster.source && (
                                <div className="absolute top-3 left-3">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md 
                                                 bg-black/60 text-white/90">
                                    {poster.source}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-5">
                            <h3 className="font-bold text-lg md:text-xl text-emerald-900 dark:text-emerald-100 
                                         mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                              {poster.title}
                            </h3>
                            <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70 
                                        line-clamp-2 leading-relaxed mb-4">
                              {poster.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 
                                           text-emerald-700 dark:text-emerald-300 
                                           border border-emerald-500/20 hover:bg-emerald-500/20 
                                           transition-all duration-300 cursor-default hover:scale-105"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="pt-3 border-t border-emerald-500/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 
                                                animate-pulse group-hover:animate-ping"></div>
                                  <span className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                                    {currentLanguage === 'fr' ? "Par" : "By"}{" "}
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-200 group-hover:text-emerald-600">
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
            </>
          ) : (
            /* Share Your Art Section */
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 
                             bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 
                             dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 
                             bg-clip-text text-transparent animate-title-glow">
                  {currentLanguage === 'fr' ? "Partagez votre création" : "Share Your Art"}
                </h2>
                <p className="text-xl text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                  {currentLanguage === 'fr' 
                    ? "Rejoignez notre communauté d'artistes environnementaux" 
                    : "Join our community of environmental artists"}
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {[
                  {
                    step: 1,
                    icon: Palette,
                    title: currentLanguage === 'fr' ? "Créez" : "Create",
                    description: currentLanguage === 'fr' 
                      ? "Créez des affiches inspirantes sur l'environnement"
                      : "Design inspiring posters about the environment"
                  },
                  {
                    step: 2,
                    icon: Send,
                    title: currentLanguage === 'fr' ? "Partagez" : "Share",
                    description: currentLanguage === 'fr' 
                      ? "Envoyez-nous votre création pour crédit"
                      : "Send us your creation for proper credit"
                  },
                  {
                    step: 3,
                    icon: User,
                    title: currentLanguage === 'fr' ? "Brillez" : "Shine",
                    description: currentLanguage === 'fr' 
                      ? "Votre travail sera présenté dans la galerie"
                      : "Your work will be featured in our gallery"
                  }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className="relative group"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                                  rounded-2xl blur opacity-0 group-hover:opacity-100 
                                  transition-all duration-500"></div>
                    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-8 
                                  rounded-2xl border border-emerald-500/10 h-full group-hover:border-emerald-500/30 
                                  transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
                      <div className="inline-flex items-center justify-center w-16 h-16 
                                    rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 
                                    text-white text-2xl font-bold mb-4 relative overflow-hidden
                                    group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <item.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 
                                          mb-4 mx-auto transform group-hover:scale-110 
                                          transition-transform duration-300" />
                      <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 
                                   mb-3 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-white/60 to-emerald-500/10 
                            backdrop-blur-sm rounded-3xl border border-emerald-500/10 p-8
                            transform hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 text-center">
                  {currentLanguage === 'fr' ? "Contact" : "Contact"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl 
                                  border border-emerald-500/20 group-hover:border-emerald-500/30 
                                  transition-all duration-300 transform group-hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10
                                      group-hover:from-emerald-500/20 group-hover:to-teal-500/20 
                                      transition-all duration-300 group-hover:scale-110">
                          <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400 
                                         group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                            Email
                          </h4>
                          <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                            {currentLanguage === 'fr' ? "Envoyez votre création" : "Send your artwork"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-lg font-mono text-emerald-800 dark:text-emerald-200 break-all 
                                       bg-emerald-500/5 px-3 py-2 rounded-lg flex-1">
                          recyclagemaria@gmail.com
                        </code>
                        <button
                          onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 
                                   transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 min-w-[100px]
                                   ${copiedEmail 
                                     ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                     : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white'
                                   }`}
                        >
                          {copiedEmail ? (
                            <>
                              <Check className="w-4 h-4" />
                              {currentLanguage === 'fr' ? "Copié !" : "Copied!"}
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              {currentLanguage === 'fr' ? "Copier" : "Copy"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl 
                                  border border-emerald-500/20 group-hover:border-pink-500/30 
                                  transition-all duration-300 transform group-hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10
                                      group-hover:from-pink-500/20 group-hover:to-purple-500/20 
                                      transition-all duration-300 group-hover:scale-110">
                          <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 
                                              group-hover:rotate-12 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                            Instagram
                          </h4>
                          <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                            {currentLanguage === 'fr' ? "Message direct" : "Direct message"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <code className="text-lg font-mono text-emerald-800 dark:text-emerald-200 break-all
                                       bg-gradient-to-r from-pink-500/5 to-purple-500/5 px-3 py-2 rounded-lg flex-1">
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
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action */}
                <div className="mt-8 text-center">
                  <button
                    onClick={() => window.open("mailto:recyclagemaria@gmail.com", "_blank")}
                    className="px-8 py-4 rounded-full relative overflow-hidden group
                             bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 
                             text-white font-semibold text-lg
                             hover:shadow-2xl hover:shadow-emerald-500/30
                             transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <Send className="w-5 h-5" />
                      {currentLanguage === 'fr' ? "Envoyer mon œuvre" : "Submit My Artwork"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox.isOpen && lightbox.poster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div 
            ref={lightboxRef}
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-6 border-b border-emerald-500/20 bg-white/95 dark:bg-gray-900/95">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${lightbox.poster.language === 'fr' ? 'bg-teal-500' : 'bg-emerald-500'}`} />
                  <span className="font-semibold text-emerald-900 dark:text-emerald-100">
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
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Maximize2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
                
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>

            {/* Lightbox Content */}
            <div className="flex-1 overflow-hidden relative">
              <div 
                ref={imageContainerRef}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <img
                  src={lightbox.poster.imageUrl}
                  alt={lightbox.poster.title}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    const currentLanguage = language || 'en';
                    img.src = currentLanguage === 'fr' 
                      ? FALLBACK_POSTERS.fr[0].imageUrl
                      : FALLBACK_POSTERS.en[0].imageUrl;
                  }}
                />
              </div>
            </div>

            {/* Lightbox Footer */}
            <div className="p-6 border-t border-emerald-500/20 bg-white/95 dark:bg-gray-900/95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
                    <span className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                      {currentLanguage === 'fr' ? "Par" : "By"}{" "}
                      <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                        {lightbox.poster.author}
                      </span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600/70 dark:text-emerald-400/70">
                      <Eye className="w-4 h-4" />
                      {lightbox.poster.views?.toLocaleString() || '1.2k'}
                    </span>
                    <button 
                      onClick={() => handleLikePoster(lightbox.poster!.id)}
                      className={`flex items-center gap-1 ${likedPosts.has(lightbox.poster!.id) ? 'text-red-500' : 'text-emerald-600/70 dark:text-emerald-400/70'}`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts.has(lightbox.poster!.id) ? 'fill-current' : ''}`} />
                      {((lightbox.poster.likes || 0) + (likedPosts.has(lightbox.poster!.id) ? 1 : 0)).toLocaleString()}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOpenNewTab(lightbox.poster!.imageUrl)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 
                             text-white font-medium hover:shadow-lg hover:shadow-emerald-500/30
                             transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95
                             flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {currentLanguage === 'fr' ? "Télécharger" : "Download"}
                  </button>
                  
                  <button
                    onClick={() => handleSharePoster(lightbox.poster!)}
                    className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 
                             text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20
                             hover:bg-emerald-50 dark:hover:bg-gray-700/80 transition-all duration-300
                             transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {currentLanguage === 'fr' ? "Partager" : "Share"}
                  </button>
                </div>
              </div>
              
              <p className="mt-4 text-emerald-700/80 dark:text-emerald-300/80">
                {lightbox.poster.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {lightbox.poster.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 
                             text-emerald-700 dark:text-emerald-300 
                             border border-emerald-500/20"
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

        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.05); }
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

        .animate-heart-beat {
          animation: heart-beat 0.6s ease-out;
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
        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }
      `}</style>
    </div>
  );
}
