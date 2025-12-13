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
  Star,
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);
  const [showParticles, setShowParticles] = useState(false);
  
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
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowParticles(!mobile);
    };
    
    checkMobile();
    
    const handleResize = () => {
      requestAnimationFrame(checkMobile);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse position for particle effects
  useEffect(() => {
    if (!showParticles) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showParticles]);

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
    {
      id: "reuse-cat-4",
      title: {
        fr: "Réutiliser avec Cat - Épisode 4",
        en: "Reuse with Cat - Episode 4"
      },
      description: {
        fr: "Créé par Salsabile - Apprenez à réutiliser avec Cat",
        en: "Made by Salsabile - Learn to reuse with Cat"
      },
      youtubeId: "aEnA1z-G7qE",
      duration: "0:57",
      publishDate: "2025-12-11",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true
    },
    {
      id: "laundry-cat",
      title: {
        fr: "Laundry cat",
        en: "Laundry cat"
      },
      description: {
        fr: "Créé par Salsabile",
        en: "Made by Salsabile"
      },
      youtubeId: "c7akmKesIq4",
      duration: "0:45",
      publishDate: "2025-12-10",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true
    },
    {
      id: "community-short",
      title: {
        fr: "Ne jetez pas vos bouteilles - Épisode 2",
        en: "Don't throw your bottles - Episode 2"
      },
      description: {
        fr: "Créé par Salsabile",
        en: "Made by Salsabile"
      },
      youtubeId: "TeS8QfpPHic",
      duration: "0:53",
      publishDate: "2025-12-08",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true
    },
    {
      id: "community1",
      title: {
        fr: "Avenir plus propre avec Chat",
        en: "Cleaner Future with Cat - Trailer"
      },
      description: {
        fr: "Créé par Salsabile - Un avenir durable avec Chat",
        en: "Created by Salsabile - A sustainable future with Cat"
      },
      youtubeId: "CtcgvPj1vGk",
      duration: "0:36",
      publishDate: "2025-12-06",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true
    },
    {
      id: "community2",
      title: {
        fr: "Artisanat et recyclage - Épisode 1",
        en: "Crafting and recycling - Episode 1"
      },
      description: {
        fr: "Créé par Salsabile - Astuces simples pour recycler",
        en: "Created by Salsabile - Simple tips for recycling"
      },
      youtubeId: "g8MBdRd99LU",
      duration: "1:12",
      publishDate: "2025-12-07",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true
    },
    {
      id: "tutorial1",
      title: {
        fr: "Introduction au Recyclage",
        en: "Recycling Introduction"
      },
      description: {
        fr: "Découvrez les bases du recyclage et son importance pour l'environnement",
        en: "Discover the basics of recycling and its importance for the environment"
      },
      youtubeId: "c5sPRL0YKUw",
      duration: "7:03",
      publishDate: "2024-01-15",
      category: { fr: "Éducation", en: "Education" },
      type: "tutorial",
      aspect: "landscape",
    },
    {
      id: "tutorial2",
      title: {
        fr: "Recyclage du Papier et Carton",
        en: "Paper and Cardboard Recycling"
      },
      description: {
        fr: "Processus complet du recyclage du papier et du carton",
        en: "Complete process of paper and cardboard recycling"
      },
      youtubeId: "s003IbGz-rA",
      duration: "3:01",
      publishDate: "2024-02-10",
      category: { fr: "Processus", en: "Process" },
      type: "tutorial",
      aspect: "landscape"
    },
    {
      id: "tutorial3",
      title: {
        fr: "Voyage au cœur du tri",
        en: "Journey to the Heart of Sorting"
      },
      description: {
        fr: "Parcours des déchets recyclables depuis le tri jusqu'à la transformation",
        en: "Journey of recyclable waste from sorting to transformation"
      },
      youtubeId: "p67EWIamCIw",
      duration: "5:33",
      publishDate: "2024-03-05",
      category: { fr: "Documentaire", en: "Documentary" },
      type: "tutorial",
      aspect: "landscape"
    }
  ], [language]);

  // Filter videos by type
  const tutorialVideos = useMemo(() => videos.filter(v => v.type === "tutorial"), [videos]);
  const communityVideos = useMemo(() => videos.filter(v => v.type === "community"), [videos]);
  const channelVideos = useMemo(() => videos.filter(v => v.type === "channel"), [videos]);

  // Auto search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
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

  // Handle video modal
  useEffect(() => {
    if (selectedVideo) {
      setIsModalOpen(true);
      setShowInterface(true);
      setShowControls(true);
      setVideoError(false);
      
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

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isFullscreen);
      if (isFullscreen) {
        setShowInterface(true);
        setShowControls(true);
      }
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
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  // Thumbnail click handler
  const handleThumbnailClick = useCallback((e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    handleVideoSelect(video);
  }, [handleVideoSelect]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const iframe = document.querySelector('iframe');
    const modal = modalRef.current;
    
    if (!iframe && !modal) return;

    if (!document.fullscreenElement) {
      (modal || iframe)?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
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

  // Modal close handler
  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
    setIsFullscreen(false);
    setShowInterface(true);
    setIsLoading(false);
    setVideoError(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
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
          e.preventDefault();
          toggleInterface();
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isModalOpen, handleModalClose, toggleFullscreen, toggleMute, toggleInterface]);

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

  // Section change with transition - FIXED for mobile
  const handleSectionChange = useCallback((section: 'tutorials' | 'community' | 'channel') => {
    setIsTransitioning(true);
    setActiveSection(section);
    
    // Force re-render of videos by scrolling slightly
    if (isMobile) {
      window.scrollTo({ top: lastScrollY.current, behavior: 'smooth' });
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isMobile]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Aspect ratio helper
  const getAspectRatio = useCallback((video: Video): '16:9' | '9:16' => {
    return video.aspect === 'portrait' ? '9:16' : '16:9';
  }, []);

  // Video event handlers
  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setIsLoading(false);
    setVideoError(true);
  }, []);

  // Image error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Character handlers with smooth transitions
  const handleCharacterSelectionOpen = useCallback(() => {
    setShowCharacterSelection(true);
    setSelectedCharacter(null);
    setImageError(false);
  }, []);

  const handleCharacterSelectionClose = useCallback(() => {
    setShowCharacterSelection(false);
    setTimeout(() => setSelectedCharacter(null), 300);
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

  // Retry video loading
  const handleRetryVideo = useCallback(() => {
    if (selectedVideo) {
      setVideoError(false);
      setIsLoading(true);
    }
  }, [selectedVideo]);

  // Render sections based on active section
  const renderVideoSection = useCallback(() => {
    const noResultsText = debouncedSearchQuery 
      ? (language === 'fr' ? 'Aucun résultat trouvé' : 'No results found')
      : (language === 'fr' ? 'Aucune vidéo disponible' : 'No videos available');
    
    const noResultsDescription = debouncedSearchQuery 
      ? (language === 'fr' ? 'Essayez avec d\'autres termes de recherche' : 'Try different search terms')
      : (language === 'fr' ? 'De nouvelles vidéos seront bientôt disponibles' : 'New videos will be available soon');

    switch (activeSection) {
      case 'tutorials':
        return filteredTutorialVideos.length === 0 ? (
          <NoResults 
            icon={<Video className="w-10 h-10" />}
            title={noResultsText}
            description={noResultsDescription}
          />
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6 md:gap-8`}>
            {filteredTutorialVideos.map((video, index) => (
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
                />
              </div>
            ))}
          </div>
        );
      
      case 'community':
        return filteredCommunityVideos.length === 0 ? (
          <NoResults 
            icon={<Users className="w-10 h-10" />}
            title={noResultsText}
            description={noResultsDescription}
          />
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6 md:gap-8`}>
            {filteredCommunityVideos.map((video, index) => (
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
      
      case 'channel':
        return filteredChannelVideos.length === 0 ? (
          <NoResults 
            icon={<Youtube className="w-10 h-10" />}
            title={noResultsText}
            description={noResultsDescription}
          />
        ) : (
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6 md:gap-8 max-w-6xl mx-auto`}>
            {filteredChannelVideos.map((video, index) => (
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
                />
              </div>
            ))}
          </div>
        );
    }
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
      {/* Floating particles for PC */}
      {showParticles && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-emerald-500/5 via-transparent to-transparent"
               style={{
                 transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
               }} />
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center p-3 mb-6 animate-float">
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

          {/* Auto Search Bar */}
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
                  onKeyDown={handleKeyDown}
                  className={`pl-12 ${isMobile ? 'pr-10 py-4 text-sm' : 'pr-10 py-6 text-base'} rounded-xl border-border/50 bg-background/80 backdrop-blur-sm shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 focus:shadow-2xl focus:shadow-emerald-500/10 transition-all duration-300 hover:border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                  aria-label={language === 'fr' ? 'Rechercher des vidéos' : 'Search videos'}
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                      isMobile ? 'h-8 w-8' : 'h-9 w-9'
                    } text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center`}
                    aria-label={language === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {debouncedSearchQuery && (
                <div className="mt-3 text-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in text-sm">
                    {getTotalResults()} {language === 'fr' ? 'résultats' : 'results'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {(['tutorials', 'community', 'channel'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0 ${
                    activeSection === section
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-glow'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label={section === 'tutorials' 
                    ? (language === 'fr' ? 'Voir les tutoriels' : 'View tutorials')
                    : section === 'community'
                    ? (language === 'fr' ? 'Voir les vidéos communautaires' : 'View community videos')
                    : (language === 'fr' ? 'Voir les vidéos de la chaîne' : 'View channel videos')
                  }
                >
                  {section === 'tutorials' ? <Recycle className="w-4 h-4" /> :
                   section === 'community' ? <Users className="w-4 h-4" /> :
                   <Youtube className="w-4 h-4" />}
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
          <div className={`transition-all duration-300 ease-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {renderVideoSection()}
          </div>

          {/* YouTube Channel Link */}
          <div className="mt-16">
            <div className="relative bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/20 p-6 md:p-8 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer" />
              
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
                  className="gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 px-8 group-hover:shadow-xl group-hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 group"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                  aria-label={language === 'fr' ? 'Visiter notre chaîne YouTube' : 'Visit our YouTube channel'}
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                  {language === 'fr' ? 'Visiter la chaîne' : 'Visit the channel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent 
          ref={modalRef}
          className={`fixed inset-0 m-auto border-none bg-black shadow-2xl overflow-hidden p-0 transition-all duration-300 ease-out z-50 transform ${
            isMobile 
              ? 'w-full h-full rounded-none' 
              : 'rounded-2xl'
          } ${selectedVideo?.isShort ? 'max-w-[400px] max-h-[710px]' : ''}`}
          style={{
            maxWidth: selectedVideo?.aspect === 'portrait' ? '400px' : 
                     isMobile ? '100%' : 'min(1200px, 90vw)',
            maxHeight: selectedVideo?.aspect === 'portrait' ? '710px' : 
                      isMobile ? '100%' : 'min(675px, 90vh)',
            aspectRatio: selectedVideo?.aspect === 'portrait' ? '9/16' : '16/9',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onTouchStart={() => setShowControls(true)}
          onMouseLeave={() => {
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
            setTimeout(() => setShowControls(false), 100);
          }}
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
                  {language === 'fr' 
                    ? 'Impossible de charger la vidéo. Veuillez réessayer.'
                    : 'Unable to load video. Please try again.'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleRetryVideo}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    aria-label={language === 'fr' ? 'Réessayer' : 'Retry'}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {language === 'fr' ? 'Réessayer' : 'Retry'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleModalClose}
                    className="border-white/30 text-white hover:bg-white/10"
                    aria-label={language === 'fr' ? 'Fermer' : 'Close'}
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
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={handleModalClose}
                    aria-label={language === 'fr' ? 'Fermer la vidéo' : 'Close video'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  {selectedVideo && (
                    <div className="ml-1 max-w-[calc(100%-140px)]">
                      <h3 className="text-sm font-semibold text-white/95 truncate animate-fade-in">
                        {getLocalizedText(selectedVideo.title)}
                      </h3>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    title={language === 'fr' ? 'Ouvrir sur YouTube' : 'Open on YouTube'}
                    aria-label={language === 'fr' ? 'Ouvrir sur YouTube' : 'Open on YouTube'}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-9 w-9'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={toggleFullscreen}
                    title={language === 'fr' ? 'Plein écran' : 'Fullscreen'}
                    aria-label={language === 'fr' ? 'Plein écran' : 'Fullscreen'}
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
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {selectedVideo && !videoError && (
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
                  onLoad={handleVideoLoad}
                  onError={handleVideoError}
                  onPlay={handleVideoLoad}
                />
              </div>
            )}
            
            {/* Floating Controls for when interface is hidden */}
            {!showInterface && showControls && !videoError && (
              <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 animate-fade-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                  onClick={toggleInterface}
                  title={language === 'fr' ? 'Afficher l\'interface' : 'Show interface'}
                  aria-label={language === 'fr' ? 'Afficher l\'interface' : 'Show interface'}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                  onClick={toggleMute}
                  title={isMuted ? (language === 'fr' ? 'Activer le son' : 'Unmute') : (language === 'fr' ? 'Désactiver le son' : 'Mute')}
                  aria-label={isMuted ? (language === 'fr' ? 'Activer le son' : 'Unmute') : (language === 'fr' ? 'Désactiver le son' : 'Mute')}
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
              {selectedVideo && (
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
                        className="h-9 w-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300"
                        onClick={toggleMute}
                        title={isMuted ? (language === 'fr' ? 'Activer le son' : 'Unmute') : (language === 'fr' ? 'Désactiver le son' : 'Mute')}
                        aria-label={isMuted ? (language === 'fr' ? 'Activer le son' : 'Unmute') : (language === 'fr' ? 'Désactiver le son' : 'Mute')}
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
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Character Selection Dialog */}
      <Dialog open={showCharacterSelection} onOpenChange={handleCharacterSelectionClose}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-md p-0 border-0 overflow-hidden bg-transparent transform transition-all duration-300 ease-out"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {language === 'fr' ? 'Personnages' : 'Characters'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'fr' ? 'Sélectionnez un personnage' : 'Select a character'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-200"
                  onClick={handleCharacterSelectionClose}
                  aria-label={language === 'fr' ? 'Fermer' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterSelect(character)}
                    className="group relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-800/50 border border-emerald-500/10 hover:border-emerald-500/30"
                  >
                    <div className="relative mb-3">
                      <div className={`absolute inset-0 bg-gradient-to-r ${character.color} rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                      <div className="relative w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {character.name}
                    </h4>
                    <p className="text-xs text-muted-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {character.role}
                    </p>
                    <ChevronRight className="absolute top-2 right-2 w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Character Detail Dialog - Single close button */}
      <Dialog open={showCharacterDetail} onOpenChange={handleCharacterDetailClose}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-md p-0 border-0 overflow-hidden bg-transparent transform transition-all duration-300 ease-out"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {selectedCharacter && (
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl animate-scale-in">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedCharacter.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {selectedCharacter.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {selectedCharacter.name}
                      </h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        {selectedCharacter.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-200"
                    onClick={handleCharacterDetailClose}
                    aria-label={language === 'fr' ? 'Fermer' : 'Close'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="relative aspect-square rounded-xl overflow-hidden mb-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5 group">
                  {imageError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <AlertCircle className="w-16 h-16 text-emerald-500/50 mb-2" />
                      <p className="text-center text-sm text-emerald-500/70">
                        {language === 'fr' ? 'Image non disponible' : 'Image not available'}
                      </p>
                    </div>
                  ) : (
                    <img
                      src={selectedCharacter.imageUrl}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>{language === 'fr' ? 'Créé par Salsabile' : 'Created by Salsabile'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-all duration-500 animate-fade-in"
          onClick={handleModalClose}
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-10px) translateX(5px);
          }
          66% {
            transform: translateY(5px) translateX(-5px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
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
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(16, 185, 129, 0.1) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse-slow,
          .animate-float,
          .animate-spin-slow,
          .animate-bounce,
          .animate-shimmer,
          .animate-fade-up,
          .animate-glow,
          .animate-fade-in,
          .animate-scale-in,
          .animate-slide-up,
          .scroll-reveal,
          .transition-all,
          .transition-transform,
          .transition-colors,
          .scroll-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }
        
        /* Scroll reveal */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Enhanced PC hover effects */
        @media (min-width: 768px) {
          .hover-lift {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-4px);
          }
          
          .hover-glow {
            transition: box-shadow 0.3s ease;
          }
          
          .hover-glow:hover {
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          /* Better touch targets */
          button, 
          [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Modal touch improvements */
          [data-radix-dialog-content] {
            touch-action: pan-y;
          }
          
          /* Disable complex animations on mobile */
          .animate-float,
          .animate-shimmer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

// No Results Component
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

// Memoized Enhanced Video Card Component
const EnhancedVideoCard = memo(({
  video,
  getLocalizedText,
  getThumbnailUrl,
  formatDate,
  openInYouTube,
  handleVideoSelect,
  handleThumbnailClick,
  language,
  isMobile,
  showCharacterInfo = false,
  onCharacterInfoClick
}: {
  video: Video;
  getLocalizedText: (text: { fr: string; en: string } | string) => string;
  getThumbnailUrl: (youtubeId: string, isShort?: boolean) => string;
  formatDate: (dateString: string) => string;
  openInYouTube: (youtubeId: string) => void;
  handleVideoSelect: (video: Video) => void;
  handleThumbnailClick: (e: React.MouseEvent, video: Video) => void;
  language: string;
  isMobile: boolean;
  showCharacterInfo?: boolean;
  onCharacterInfoClick?: () => void;
}) => (
  <Card className="group relative h-full border-border/40 hover:border-emerald-500/50 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-300 hover-lift hover-glow active:scale-98">
    <CardContent className="p-0">
      <div className={`relative ${video.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5`}>
        <img
          src={getThumbnailUrl(video.youtubeId, video.isShort)}
          alt={getLocalizedText(video.title)}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
          loading="lazy"
          decoding="async"
        />
        
        <div 
          className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
          onClick={(e) => handleThumbnailClick(e, video)}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-500 group-hover:scale-110">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-emerald-600 ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-3 left-3 z-30">
          {video.isShort ? (
            <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 text-xs px-2.5 py-1">
              <Zap className="w-3 h-3 mr-1.5" />
              SHORT
            </Badge>
          ) : (
            video.category && (
              <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 text-xs px-2.5 py-1">
                {getLocalizedText(video.category)}
              </Badge>
            )
          )}
        </div>

        {video.duration && (
          <div className="absolute bottom-3 right-3 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md">
            {video.duration}
          </div>
        )}
      </div>

      <div className="p-5 relative z-20">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 flex-1">
              {getLocalizedText(video.title)}
            </h3>
          </div>
          
          {video.creator && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300 group-hover:scale-110">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {showCharacterInfo && onCharacterInfoClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCharacterInfoClick();
                      }}
                      className="absolute -right-1 -top-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-0.5 rounded-full border-2 border-background transition-all duration-300 hover:scale-125 active:scale-95 shadow-lg flex items-center justify-center"
                      aria-label={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                      title={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {video.creator.name}
                  </span>
                  <p className="text-xs text-muted-foreground">{video.creator.role}</p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
            {getLocalizedText(video.description)}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              {video.publishDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(video.publishDate)}</span>
                </span>
              )}
              {video.duration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{video.duration}</span>
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-3 text-xs hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => handleVideoSelect(video)}
              aria-label={language === 'fr' ? 'Regarder la vidéo' : 'Watch video'}
            >
              <Play className="w-3 h-3 mr-1.5" />
              {language === 'fr' ? 'Regarder' : 'Watch'}
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
));

EnhancedVideoCard.displayName = 'EnhancedVideoCard';
