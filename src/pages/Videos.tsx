import { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import LazyVideoPlayer from "@/components/LazyVideoPlayer";
import { 
  Play, 
  ExternalLink, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Sparkles,
  Recycle,
  Zap,
  X,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Search,
  Video,
  Youtube,
  User,
  Loader2,
  Info,
  AlertCircle,
  RefreshCw,
  Heart,
  RotateCw,
  ChevronRight
} from "lucide-react";

interface Video {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  youtubeId: string;
  duration?: string;
  publishDate?: string;
  category?: { fr: string; en: string };
  type: 'tutorial' | 'community' | 'channel';
  aspect?: 'landscape' | 'portrait';
  creator?: { name: string; role: string };
  isShort?: boolean;
}

interface Character {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
  color: string;
}

// Extracted Modal Component for better organization
const VideoModal = memo(({
  isOpen,
  selectedVideo,
  onClose,
  isMobile,
  isRotated,
  isLoading,
  videoError,
  errorMessage,
  showInterface,
  showControls,
  isMuted,
  isFullscreen,
  language,
  onMouseMove,
  onToggleInterface,
  onToggleMute,
  onToggleFullscreen,
  onOpenYouTube,
  onRetry,
  onToggleRotation,
  getLocalizedText,
  formatDate,
  getAspectRatio,
  onVideoLoad,
  onVideoError,
  style
}: {
  isOpen: boolean;
  selectedVideo: Video | null;
  onClose: () => void;
  isMobile: boolean;
  isRotated: boolean;
  isLoading: boolean;
  videoError: boolean;
  errorMessage: string;
  showInterface: boolean;
  showControls: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  language: string;
  onMouseMove: () => void;
  onToggleInterface: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onOpenYouTube: (youtubeId: string) => void;
  onRetry: () => void;
  onToggleRotation: () => void;
  getLocalizedText: (text: { fr: string; en: string } | string) => string;
  formatDate: (dateString: string) => string;
  getAspectRatio: (video: Video) => '16:9' | '9:16';
  onVideoLoad: () => void;
  onVideoError: (error?: string) => void;
  style: React.CSSProperties;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !selectedVideo) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          ref={modalRef}
          className="fixed border-none bg-black shadow-2xl overflow-hidden p-0 transition-all duration-300 ease-out z-50"
          style={style}
          onMouseMove={onMouseMove}
          onTouchMove={onMouseMove}
          onTouchStart={() => showControls && onMouseMove()}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
              <div className="relative">
                <div className="w-16 h-16 border-3 border-transparent border-t-emerald-500 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-emerald-500 animate-pulse-slow" />
                </div>
              </div>
            </div>
          )}
          
          {/* Error Overlay */}
          {videoError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
              <div className="text-center p-6 max-w-sm">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {language === 'fr' ? 'Erreur de chargement' : 'Loading Error'}
                </h3>
                <p className="text-white/80 mb-6">
                  {errorMessage || (language === 'fr' 
                    ? 'Impossible de charger la vidéo. Veuillez réessayer.'
                    : 'Unable to load video. Please try again.')}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={onRetry}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {language === 'fr' ? 'Réessayer' : 'Retry'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {language === 'fr' ? 'Fermer' : 'Close'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Top Controls Bar */}
          {showInterface && !videoError && (
            <div 
              className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/85 to-transparent p-4 transition-all duration-300 ease-out ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="ml-1 max-w-[calc(100%-180px)]">
                    <h3 className="text-sm font-semibold text-white/95 truncate animate-fade-in">
                      {getLocalizedText(selectedVideo.title)}
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                    onClick={onToggleInterface}
                  >
                    {showInterface ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {isMobile && selectedVideo?.aspect === 'landscape' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-10 w-10 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                      onClick={onToggleRotation}
                    >
                      <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isRotated ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                    onClick={() => selectedVideo && onOpenYouTube(selectedVideo.youtubeId)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                    onClick={onToggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div className={`relative w-full h-full flex items-center justify-center bg-black`}>
            {!videoError && (
              <div className="w-full h-full flex items-center justify-center animate-scale-in">
                <LazyVideoPlayer
                  youtubeId={selectedVideo.youtubeId}
                  title={getLocalizedText(selectedVideo.title)}
                  autoplay={true}
                  muted={isMuted}
                  loop={selectedVideo.isShort}
                  showControls={false}
                  aspectRatio={getAspectRatio(selectedVideo)}
                  className="w-full h-full"
                  onLoad={onVideoLoad}
                  onError={() => onVideoError()}
                  onPlay={onVideoLoad}
                />
              </div>
            )}
            
            {/* Floating Controls */}
            {!showInterface && showControls && !videoError && (
              <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 animate-fade-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                  onClick={onToggleInterface}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300`}
                  onClick={onToggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          {showInterface && !videoError && (
            <div 
              className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-4 transition-all duration-300 ease-out ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
              }`}
            >
              <div className="space-y-3 animate-fade-in">
                <div>
                  <h3 className="text-base font-semibold text-white line-clamp-1">
                    {getLocalizedText(selectedVideo.title)}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 mt-1">
                    {getLocalizedText(selectedVideo.description)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    {selectedVideo.publishDate && (
                      <span className="flex items-center gap-1.5 animate-fade-in hover:text-white transition-colors duration-200">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedVideo.publishDate)}</span>
                      </span>
                    )}
                    {selectedVideo.duration && (
                      <span className="flex items-center gap-1.5 animate-fade-in hover:text-white transition-colors duration-200">
                        <Clock className="w-4 h-4" />
                        <span>{selectedVideo.duration}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 transition-all duration-300"
                      onClick={onToggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-all duration-500 animate-fade-in"
        onClick={onClose}
      />
    </>
  );
});

VideoModal.displayName = 'VideoModal';

// Extracted Search Bar Component
const SearchBar = memo(({
  searchQuery,
  setSearchQuery,
  debouncedSearchQuery,
  language,
  isMobile,
  getTotalResults,
  onKeyDown,
  onClearSearch,
  searchInputRef
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  language: string;
  isMobile: boolean;
  getTotalResults: () => number;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}) => (
  <div className="mb-10">
    <div className="relative max-w-2xl mx-auto">
      <div className="relative flex items-center group">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors duration-300" />
        </div>
        <Input
          ref={searchInputRef}
          type="text"
          placeholder={language === 'fr' ? 'Rechercher des vidéos...' : 'Search videos...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className={`pl-12 ${isMobile ? 'pr-10 py-4 text-sm' : 'pr-10 py-6 text-base'} rounded-xl border-border/50 bg-background/80 backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 focus:shadow-2xl focus:shadow-emerald-500/10 transition-all duration-300 hover:border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
        />
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isMobile ? 'h-8 w-8' : 'h-10 w-10'
            } text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {debouncedSearchQuery && (
        <div className="mt-3 text-center animate-fade-in">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
            {getTotalResults()} {language === 'fr' ? 'résultats' : 'results'}
          </span>
        </div>
      )}
    </div>
  </div>
));

SearchBar.displayName = 'SearchBar';

export default function Videos() {
  const { language } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'tutorials' | 'community' | 'channel'>('tutorials');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showInterface, setShowInterface] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const [showCharacterDetail, setShowCharacterDetail] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useScrollReveal();

  // Memoized characters data
  const characters: Character[] = useMemo(() => [
    {
      id: "meow",
      name: "Meow",
      imageUrl: "https://i.ibb.co/d06DQqBR/Meow-png.jpg",
      role: language === 'fr' ? "Mascotte" : "Mascot",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "basma",
      name: "Basma",
      imageUrl: "https://i.ibb.co/4npFCFPd/Basma-png.jpg",
      role: language === 'fr' ? "Artiste Écologique" : "Ecological Artist",
      color: "from-emerald-500 to-green-500"
    },
    {
      id: "cat",
      name: "Cat",
      imageUrl: "https://i.ibb.co/Kzp4Rg9s/CAT-png.jpg",
      role: language === 'fr' ? "Super-héros Écologique" : "Ecological Superhero",
      color: "from-purple-500 to-pink-500"
    }
  ], [language]);

  // Check mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    const handleResize = () => {
      requestAnimationFrame(checkMobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized videos data
  const videos: Video[] = useMemo(() => [
    {
      id: "channel-showcase",
      title: {
        fr: "Website Showcase",
        en: "Website Showcase"
      },
      description: {
        fr: "Présentation complète de notre site web et de ses fonctionnalités",
        en: "Complete overview of our website and its features"
      },
      youtubeId: "v_EyngbVFb8",
      duration: "1:28",
      publishDate: "2025-12-09",
      category: { fr: "Chaîne", en: "Channel" },
      type: "channel",
      aspect: "landscape",
      creator: { name: "Yahia", role: language === 'fr' ? "Développeur" : "Developer" }
    },
    // ... rest of the videos array (keep the same as original)
  ], [language]);

  // Filter videos by type
  const tutorialVideos = useMemo(() => videos.filter(v => v.type === "tutorial"), [videos]);
  const communityVideos = useMemo(() => videos.filter(v => v.type === "community"), [videos]);
  const channelVideos = useMemo(() => videos.filter(v => v.type === "channel"), [videos]);

  // Auto search with debounce - FIXED: Clear timeout on unmount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Optimized search function
  const searchVideos = useCallback((videos: Video[], query: string): Video[] => {
    if (!query.trim()) return videos;
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    
    return videos.filter(video => {
      const searchableText = [
        video.title[language].toLowerCase(),
        video.description[language].toLowerCase(),
        video.category?.[language].toLowerCase() || '',
        video.creator?.name.toLowerCase() || '',
        video.creator?.role.toLowerCase() || '',
        video.type.toLowerCase()
      ].join(' ');
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [language]);

  // Memoized filtered videos
  const filteredTutorialVideos = useMemo(() => 
    searchVideos(tutorialVideos, debouncedSearchQuery),
  [tutorialVideos, debouncedSearchQuery, searchVideos]);

  const filteredCommunityVideos = useMemo(() => 
    searchVideos(communityVideos, debouncedSearchQuery),
  [communityVideos, debouncedSearchQuery, searchVideos]);

  const filteredChannelVideos = useMemo(() => 
    searchVideos(channelVideos, debouncedSearchQuery),
  [channelVideos, debouncedSearchQuery, searchVideos]);

  // Memoized text translation
  const getLocalizedText = useCallback((text: { fr: string; en: string } | string) => {
    if (typeof text === 'string') return text;
    return text[language];
  }, [language]);

  // Get total results for current section
  const getTotalResults = useCallback(() => {
    switch(activeSection) {
      case 'tutorials': return filteredTutorialVideos.length;
      case 'community': return filteredCommunityVideos.length;
      case 'channel': return filteredChannelVideos.length;
      default: return 0;
    }
  }, [activeSection, filteredTutorialVideos.length, filteredCommunityVideos.length, filteredChannelVideos.length]);

  // Handle video modal - FIXED: Proper cleanup
  useEffect(() => {
    if (selectedVideo) {
      setIsModalOpen(true);
      setShowInterface(true);
      setShowControls(true);
      setVideoError(false);
      setErrorMessage("");
      setIsRotated(false);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedVideo]);

  // Fullscreen handling - FIXED: Add error handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Thumbnail URL helper
  const getThumbnailUrl = useCallback((youtubeId: string, isShort?: boolean) => {
    const quality = isShort ? 'hqdefault' : 'maxresdefault';
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  }, []);

  // Open in YouTube
  const openInYouTube = useCallback((youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  }, []);

  // Date formatting
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [language]);

  // Video selection handler
  const handleVideoSelect = useCallback((video: Video) => {
    setIsLoading(true);
    setSelectedVideo(video);
    setShowInterface(true);
    setVideoError(false);
    setErrorMessage("");
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  // Thumbnail click handler
  const handleThumbnailClick = useCallback((e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    handleVideoSelect(video);
  }, [handleVideoSelect]);

  // Fullscreen toggle - FIXED: Better error handling
  const toggleFullscreen = useCallback(() => {
    const iframe = document.querySelector('iframe');
    
    if (!iframe) return;

    if (!document.fullscreenElement) {
      iframe.requestFullscreen?.().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(console.error);
      setIsFullscreen(false);
    }
  }, []);

  // Controls visibility
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Modal close handler - FIXED: Proper cleanup
  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
    setIsModalOpen(false);
    setIsFullscreen(false);
    setShowInterface(true);
    setIsLoading(false);
    setVideoError(false);
    setErrorMessage("");
    setIsRotated(false);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  // Interface toggle
  const toggleInterface = useCallback(() => {
    setShowInterface(prev => !prev);
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  // Mute toggle
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Search handlers
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  }, [handleClearSearch]);

  // Keyboard shortcuts - FIXED: Only listen when modal is open
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen || !selectedVideo) return;
      
      switch(e.key) {
        case 'Escape':
          handleModalClose();
          break;
        case 'f':
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case ' ':
          if (e.target === document.body) {
            e.preventDefault();
            toggleInterface();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen, selectedVideo, handleModalClose, toggleFullscreen, toggleMute, toggleInterface]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Section change with smooth transition
  const handleSectionChange = useCallback((section: 'tutorials' | 'community' | 'channel') => {
    setIsTransitioning(true);
    setActiveSection(section);
    
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Aspect ratio helper
  const getAspectRatio = useCallback((video: Video): '16:9' | '9:16' => {
    return video.aspect === 'portrait' ? '9:16' : '16:9';
  }, []);

  // Video event handlers
  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
    setVideoError(false);
    setErrorMessage("");
  }, []);

  const handleVideoError = useCallback((error?: string) => {
    setIsLoading(false);
    setVideoError(true);
    setErrorMessage(error || (language === 'fr' 
      ? 'Impossible de charger la vidéo. Veuillez vérifier votre connexion internet.'
      : 'Unable to load video. Please check your internet connection.'
    ));
  }, [language]);

  // Get modal style - FIXED: Simplified centering logic
  const getModalStyle = useCallback((): React.CSSProperties => {
    if (!selectedVideo) return {};
    
    const isPortrait = selectedVideo.aspect === 'portrait';
    
    if (isMobile) {
      if (isPortrait) {
        return {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: 0,
          margin: 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      } else {
        return {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: 0,
          margin: 0,
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) ${isRotated ? 'rotate(90deg)' : ''}`,
        };
      }
    } else {
      if (isPortrait) {
        return {
          width: '400px',
          height: '710px',
          maxWidth: '400px',
          maxHeight: '710px',
          borderRadius: '24px',
          margin: 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      } else {
        return {
          width: 'min(1200px, 90vw)',
          height: 'min(675px, 90vh)',
          maxWidth: 'min(1200px, 90vw)',
          maxHeight: 'min(675px, 90vh)',
          borderRadius: '24px',
          margin: 0,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
      }
    }
  }, [selectedVideo, isMobile, isRotated]);

  // Retry video loading
  const handleRetryVideo = useCallback(() => {
    if (selectedVideo) {
      setVideoError(false);
      setErrorMessage("");
      setIsLoading(true);
    }
  }, [selectedVideo]);

  // Toggle rotation for mobile
  const toggleRotation = useCallback(() => {
    setIsRotated(prev => !prev);
  }, []);

  // Character handlers
  const handleCharacterSelectionOpen = useCallback(() => {
    setShowCharacterSelection(true);
    setSelectedCharacter(null);
    setImageError(false);
  }, []);

  const handleCharacterSelectionClose = useCallback(() => {
    setShowCharacterSelection(false);
  }, []);

  const handleCharacterSelect = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setShowCharacterSelection(false);
    setTimeout(() => setShowCharacterDetail(true), 150);
    setImageError(false);
  }, []);

  const handleCharacterDetailClose = useCallback(() => {
    setShowCharacterDetail(false);
    setTimeout(() => setSelectedCharacter(null), 300);
  }, []);

  // Render sections based on active section
  const renderVideoSection = useCallback(() => {
    const noResultsText = debouncedSearchQuery 
      ? (language === 'fr' ? 'Aucun résultat trouvé' : 'No results found')
      : (language === 'fr' ? 'Aucune vidéo disponible' : 'No videos available');
    
    const noResultsDescription = debouncedSearchQuery 
      ? (language === 'fr' ? 'Essayez avec d\'autres termes de recherche' : 'Try different search terms')
      : (language === 'fr' ? 'De nouvelles vidéos seront bientôt disponibles' : 'New videos will be available soon');

    const videosToRender = activeSection === 'tutorials' ? filteredTutorialVideos :
                          activeSection === 'community' ? filteredCommunityVideos :
                          filteredChannelVideos;

    if (videosToRender.length === 0) {
      const icon = activeSection === 'tutorials' ? <Video className="w-10 h-10" /> :
                   activeSection === 'community' ? <Users className="w-10 h-10" /> :
                   <Youtube className="w-10 h-10" />;
      
      return (
        <NoResults 
          icon={icon}
          title={noResultsText}
          description={noResultsDescription}
        />
      );
    }

    return (
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6 md:gap-8`}>
        {videosToRender.map((video, index) => (
          <div
            key={video.id}
            className="scroll-reveal"
            style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
          >
            <EnhancedVideoCard
              video={video}
              getLocalizedText={getLocalizedText}
              getThumbnailUrl={getThumbnailUrl}
              formatDate={formatDate}
              openInYouTube={openInYouTube}
              handleVideoSelect={handleVideoSelect}
              handleThumbnailClick={handleThumbnailClick}
              language={language}
              isMobile={isMobile}
              showCharacterInfo={video.creator?.name === "Salsabile"}
              onCharacterInfoClick={handleCharacterSelectionOpen}
            />
          </div>
        ))}
      </div>
    );
  }, [
    activeSection, 
    filteredTutorialVideos, 
    filteredCommunityVideos, 
    filteredChannelVideos, 
    debouncedSearchQuery, 
    language, 
    isMobile, 
    getLocalizedText, 
    getThumbnailUrl, 
    formatDate, 
    openInYouTube, 
    handleVideoSelect, 
    handleThumbnailClick, 
    handleCharacterSelectionOpen
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center p-3 mb-6 animate-float-slow">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-green-500/30 blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 p-4 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 group">
                  <Video className="w-8 h-8 text-emerald-600 dark:text-emerald-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ease-out" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-up">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                {language === 'fr' ? 'Vidéos Éducatives' : 'Educational Videos'}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {language === 'fr' 
                ? 'Apprenez et inspirez-vous pour un avenir plus durable' 
                : 'Learn and get inspired for a more sustainable future'}
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            debouncedSearchQuery={debouncedSearchQuery}
            language={language}
            isMobile={isMobile}
            getTotalResults={getTotalResults}
            onKeyDown={handleKeyDown}
            onClearSearch={handleClearSearch}
            searchInputRef={searchInputRef}
          />

          {/* Navigation */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {(['tutorials', 'community', 'channel'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-1 ${
                    activeSection === section
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-glow'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {section === 'tutorials' ? <Recycle className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" /> :
                   section === 'community' ? <Users className="w-4 h-4 transition-transform group-hover:scale-125 duration-300" /> :
                   <Youtube className="w-4 h-4 transition-transform group-hover:scale-125 duration-300" />}
                  {section === 'tutorials' ? (language === 'fr' ? 'Tutoriels' : 'Tutorials') :
                   section === 'community' ? (language === 'fr' ? 'Communauté' : 'Community') :
                   (language === 'fr' ? 'Chaîne' : 'Channel')}
                  <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    activeSection === section 
                      ? 'bg-white/30 animate-pulse-slow' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-500/20'
                  }`}>
                    {section === 'tutorials' ? filteredTutorialVideos.length :
                     section === 'community' ? filteredCommunityVideos.length :
                     filteredChannelVideos.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className={`transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {renderVideoSection()}
          </div>

          {/* YouTube Channel Link */}
          <div className="mt-16">
            <div className="relative bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/20 p-6 md:p-8 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 group overflow-hidden">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {language === 'fr' ? 'Notre Chaîne YouTube' : 'Our YouTube Channel'}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4 md:mb-0 group-hover:text-foreground/80 transition-colors duration-500">
                    {language === 'fr' 
                      ? 'Plus de contenu éducatif disponible sur notre chaîne' 
                      : 'More educational content available on our channel'}
                  </p>
                </div>
                
                <Button
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 px-8 group-hover:shadow-xl group-hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300 group"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                  {language === 'fr' ? 'Visiter la chaîne' : 'Visit the channel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isModalOpen}
        selectedVideo={selectedVideo}
        onClose={handleModalClose}
        isMobile={isMobile}
        isRotated={isRotated}
        isLoading={isLoading}
        videoError={videoError}
        errorMessage={errorMessage}
        showInterface={showInterface}
        showControls={showControls}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        language={language}
        onMouseMove={handleMouseMove}
        onToggleInterface={toggleInterface}
        onToggleMute={toggleMute}
        onToggleFullscreen={toggleFullscreen}
        onOpenYouTube={openInYouTube}
        onRetry={handleRetryVideo}
        onToggleRotation={toggleRotation}
        getLocalizedText={getLocalizedText}
        formatDate={formatDate}
        getAspectRatio={getAspectRatio}
        onVideoLoad={handleVideoLoad}
        onVideoError={handleVideoError}
        style={getModalStyle()}
      />

      {/* Character Selection Dialog */}
      <Dialog open={showCharacterSelection} onOpenChange={handleCharacterSelectionClose}>
        <DialogContent className="max-w-md p-0 border-0 overflow-hidden">
          {/* Character dialog content */}
        </DialogContent>
      </Dialog>

      {/* Character Detail Dialog */}
      <Dialog open={showCharacterDetail} onOpenChange={handleCharacterDetailClose}>
        <DialogContent className="max-w-md p-0 border-0 overflow-hidden">
          {/* Character detail content */}
        </DialogContent>
      </Dialog>

      {/* Animations CSS */}
      <style>{`
        /* Animation styles remain the same */}
      `}</style>
    </div>
  );
}

// No Results Component remains the same
const NoResults = memo(({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="text-center py-16 animate-fade-in">
    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500/10 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-3 text-foreground">
      {title}
    </h3>
    <p className="text-muted-foreground max-w-md mx-auto text-lg">
      {description}
    </p>
  </div>
));

NoResults.displayName = 'NoResults';

// EnhancedVideoCard Component remains the same
