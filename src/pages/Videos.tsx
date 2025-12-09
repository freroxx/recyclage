import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
  Leaf,
  Recycle,
  Zap,
  X,
  Maximize2,
  Minimize2,
  Globe,
  Shield,
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
  ChevronRight,
  ChevronLeft
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
  description: { fr: string; en: string };
  imageUrl: string;
  role: string;
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
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showCharacterInfo, setShowCharacterInfo] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useScrollReveal();

  const characters: Character[] = useMemo(() => [
    {
      id: "meow",
      name: "Meow",
      description: {
        fr: "Un chat mignon et curieux qui adore explorer et découvrir de nouvelles choses. Toujours prêt pour une aventure!",
        en: "A cute and curious cat who loves exploring and discovering new things. Always ready for an adventure!"
      },
      imageUrl: "https://i.ibb.co/d06DQqBR/Meow-png.jpg",
      role: "Mascotte"
    },
    {
      id: "basma",
      name: "Basma",
      description: {
        fr: "Une créative passionnée qui transforme les déchets en œuvres d'art. Son énergie positive est contagieuse!",
        en: "A passionate creative who transforms waste into works of art. Her positive energy is contagious!"
      },
      imageUrl: "https://i.ibb.co/4npFCFPd/Basma-png.jpg",
      role: "Artiste Écologique"
    },
    {
      id: "cat",
      name: "Cat",
      description: {
        fr: "Un super-héros félin qui protège l'environnement. Rapide, agile et toujours prêt à sauver la planète!",
        en: "A feline superhero who protects the environment. Fast, agile, and always ready to save the planet!"
      },
      imageUrl: "https://i.ibb.co/Kzp4Rg9s/CAT-png.jpg",
      role: "Super-héros Écologique"
    }
  ], []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      creator: { name: "Yahia", role: "Développeur" }
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
      creator: { name: "Salsabile", role: "Éco-Créatrice" },
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
      creator: { name: "Salsabile", role: "Éco-Artiste" },
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
      creator: { name: "Salsabile", role: "Éco-Influenceur" },
      isShort: true
    },
    {
      id: "1",
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
      aspect: "landscape"
    },
    {
      id: "2",
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
      id: "3",
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
  ], []);

  const tutorialVideos = useMemo(() => videos.filter(v => v.type === "tutorial"), [videos]);
  const communityVideos = useMemo(() => videos.filter(v => v.type === "community"), [videos]);
  const channelVideos = useMemo(() => videos.filter(v => v.type === "channel"), [videos]);

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

  const filteredTutorialVideos = useMemo(() => 
    searchVideos(tutorialVideos, activeSearchQuery),
  [tutorialVideos, activeSearchQuery, searchVideos]);

  const filteredCommunityVideos = useMemo(() => 
    searchVideos(communityVideos, activeSearchQuery),
  [communityVideos, activeSearchQuery, searchVideos]);

  const filteredChannelVideos = useMemo(() => 
    searchVideos(channelVideos, activeSearchQuery),
  [channelVideos, activeSearchQuery, searchVideos]);

  const getLocalizedText = useCallback((text: { fr: string; en: string } | string) => {
    if (typeof text === 'string') return text;
    return text[language];
  }, [language]);

  const getTotalResults = useCallback(() => {
    switch(activeSection) {
      case 'tutorials': return filteredTutorialVideos.length;
      case 'community': return filteredCommunityVideos.length;
      case 'channel': return filteredChannelVideos.length;
      default: return 0;
    }
  }, [activeSection, filteredTutorialVideos.length, filteredCommunityVideos.length, filteredChannelVideos.length]);

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

  const getThumbnailUrl = useCallback((youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'maxresdefault' = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  }, []);

  const openInYouTube = useCallback((youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [language]);

  const handleVideoSelect = useCallback((video: Video) => {
    setIsLoading(true);
    setSelectedVideo(video);
    setShowInterface(true);
    setVideoError(false);
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const handleThumbnailClick = useCallback((e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    handleVideoSelect(video);
  }, [handleVideoSelect]);

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

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

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

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setActiveSearchQuery(searchQuery);
      setTimeout(() => setIsSearching(false), 300);
    }
  }, [searchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setActiveSearchQuery("");
    searchInputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  }, [handleSearch, handleClearSearch]);

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

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleSectionChange = useCallback((section: 'tutorials' | 'community' | 'channel') => {
    setIsTransitioning(true);
    setActiveSection(section);
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);

  const getAspectRatio = useCallback((video: Video): '16:9' | '9:16' => {
    return video.aspect === 'portrait' ? '9:16' : '16:9';
  }, []);

  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setIsLoading(false);
    setVideoError(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleCharacterClick = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setShowCharacterInfo(true);
    setImageError(false);
  }, []);

  const handleCharacterInfoClose = useCallback(() => {
    setShowCharacterInfo(false);
    setSelectedCharacter(null);
    setImageError(false);
  }, []);

  const handleNextCharacter = useCallback(() => {
    if (!selectedCharacter) return;
    const currentIndex = characters.findIndex(c => c.id === selectedCharacter.id);
    const nextIndex = (currentIndex + 1) % characters.length;
    setSelectedCharacter(characters[nextIndex]);
    setImageError(false);
  }, [selectedCharacter, characters]);

  const handlePrevCharacter = useCallback(() => {
    if (!selectedCharacter) return;
    const currentIndex = characters.findIndex(c => c.id === selectedCharacter.id);
    const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
    setSelectedCharacter(characters[prevIndex]);
    setImageError(false);
  }, [selectedCharacter, characters]);

  const handleRetryVideo = useCallback(() => {
    if (selectedVideo) {
      setVideoError(false);
      setIsLoading(true);
    }
  }, [selectedVideo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5 transition-colors duration-500 ease-in-out">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
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
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent transition-all duration-500">
                {language === 'fr' ? 'Vidéos Éducatives' : 'Educational Videos'}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {language === 'fr' 
                ? 'Apprenez et inspirez-vous pour un avenir plus durable' 
                : 'Learn and get inspired for a more sustainable future'}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-10">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-all duration-300 group-focus-within:text-emerald-500 group-focus-within:scale-110 z-10" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={language === 'fr' ? 'Rechercher des vidéos, titres, descriptions, auteurs...' : 'Search videos, titles, descriptions, authors...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 pr-32 py-6 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm text-base shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 focus:shadow-2xl focus:shadow-emerald-500/10 transition-all duration-300 hover:border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClearSearch}
                      className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 transition-colors duration-200 hover:scale-110 hover:rotate-90"
                      aria-label={language === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="ml-1 gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    size="sm"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {language === 'fr' ? 'Rechercher' : 'Search'}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400 font-medium">
                    ↵
                  </span>
                  {language === 'fr' ? 'Entrée pour rechercher' : 'Enter to search'}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 rounded text-emerald-600 dark:text-emerald-400 font-medium">
                    Esc
                  </span>
                  {language === 'fr' ? 'Effacer la recherche' : 'Clear search'}
                </span>
                {activeSearchQuery && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {getTotalResults()} {language === 'fr' ? 'résultats' : 'results'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handleSectionChange('tutorials')}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 ${
                    activeSection === 'tutorials'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-glow'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Recycle className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'tutorials' ? 'animate-spin-slow' : ''} group-hover:rotate-180`} />
                  {language === 'fr' ? 'Tutoriels' : 'Tutorials'}
                  <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    activeSection === 'tutorials' 
                      ? 'bg-white/30 animate-pulse-slow' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-500/20'
                  }`}>
                    {filteredTutorialVideos.length}
                  </span>
                </button>
                
                <button
                  onClick={() => handleSectionChange('community')}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 ${
                    activeSection === 'community'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-glow'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Users className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'community' ? 'animate-bounce-slow' : ''} group-hover:scale-125`} />
                  {language === 'fr' ? 'Communauté' : 'Community'}
                  <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    activeSection === 'community' 
                      ? 'bg-white/30 animate-pulse-slow' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-500/20'
                  }`}>
                    {filteredCommunityVideos.length}
                  </span>
                </button>

                <button
                  onClick={() => handleSectionChange('channel')}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 ${
                    activeSection === 'channel'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-glow'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Youtube className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'channel' ? 'animate-pulse-slow' : ''} group-hover:scale-125`} />
                  {language === 'fr' ? 'Notre Chaîne' : 'Our Channel'}
                  <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    activeSection === 'channel' 
                      ? 'bg-white/30 animate-pulse-slow' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-500/20'
                  }`}>
                    {filteredChannelVideos.length}
                  </span>
                </button>
              </div>
              
              <div className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 hidden sm:block">
                <span className="inline-flex items-center gap-2 group">
                  <TrendingUp className="w-4 h-4 group-hover:animate-bounce transition-transform duration-300" />
                  {language === 'fr' ? 'Contenu régulièrement mis à jour' : 'Regularly updated content'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            
            {/* Tutorials Section */}
            {activeSection === 'tutorials' && (
              <>
                {filteredTutorialVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      {activeSearchQuery ? (
                        <Search className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <Video className="w-8 h-8 text-emerald-500" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {activeSearchQuery 
                        ? (language === 'fr' ? 'Aucun tutoriel trouvé' : 'No tutorials found')
                        : (language === 'fr' ? 'Aucun tutoriel disponible' : 'No tutorials available')
                      }
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {activeSearchQuery 
                        ? (language === 'fr' 
                            ? 'Essayez avec d\'autres termes de recherche ou vérifiez l\'orthographe' 
                            : 'Try different search terms or check spelling')
                        : (language === 'fr'
                            ? 'De nouveaux tutoriels seront bientôt disponibles'
                            : 'New tutorials will be available soon')
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredTutorialVideos.map((video, index) => (
                      <div
                        key={video.id}
                        className="scroll-reveal"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Card
                          className="group relative h-full border-border/40 hover:border-emerald-500/50 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 card-hover"
                          onClick={() => handleVideoSelect(video)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer" />
                          
                          <CardContent className="p-0">
                            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5">
                              <img
                                src={getThumbnailUrl(video.youtubeId)}
                                alt={getLocalizedText(video.title)}
                                className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                                }}
                              />
                              
                              <div 
                                className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                                onClick={(e) => handleThumbnailClick(e, video)}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="relative">
                                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-emerald-500/40 via-green-500/40 to-teal-500/40 rounded-full animate-ping-slow blur-md" />
                                    <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 transform group-hover:rotate-12">
                                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner shadow-black/20">
                                        <Play className="w-6 h-6 text-emerald-600 ml-0.5" fill="currentColor" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="absolute top-3 left-3 z-30 flex gap-2">
                                <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 text-xs px-2.5 py-1 hover:bg-black/90 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5">
                                  {getLocalizedText(video.category || { fr: 'Catégorie', en: 'Category' })}
                                </Badge>
                              </div>

                              {video.duration && (
                                <div className="absolute bottom-3 right-3 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md hover:bg-black/90 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5">
                                  {video.duration}
                                </div>
                              )}
                            </div>

                            <div className="p-5 relative z-20">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 group-hover:translate-x-1">
                                    {getLocalizedText(video.title)}
                                  </h3>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-emerald-500/10 hover:rotate-12"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openInYouTube(video.youtubeId);
                                    }}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                                  {getLocalizedText(video.description)}
                                </p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    <Calendar className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>{formatDate(video.publishDate || '')}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>{video.duration}</span>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2.5 text-xs hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 hover:scale-105 group"
                                    onClick={() => handleVideoSelect(video)}
                                  >
                                    <Play className="w-3 h-3 mr-1.5 group-hover:scale-125 transition-transform duration-300" />
                                    {language === 'fr' ? 'Regarder' : 'Watch'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Community Section */}
            {activeSection === 'community' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-4 hover:bg-emerald-500/15 transition-all duration-300 hover:scale-105 animate-pulse-slow">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {language === 'fr' ? 'Vidéos de la Communauté' : 'Community Videos'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 animate-fade-up">
                    {language === 'fr' ? 'Notre Communauté en Action' : 'Our Community in Action'}
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    {language === 'fr' 
                      ? 'Découvrez les moments inspirants partagés par notre communauté' 
                      : 'Discover inspiring moments shared by our community'}
                  </p>
                </div>
                
                {/* Community Videos Grid */}
                {filteredCommunityVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      {activeSearchQuery ? (
                        <Search className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <Users className="w-8 h-8 text-emerald-500" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {activeSearchQuery 
                        ? (language === 'fr' ? 'Aucune vidéo communautaire trouvée' : 'No community videos found')
                        : (language === 'fr' ? 'Aucune vidéo communautaire disponible' : 'No community videos available')
                      }
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {activeSearchQuery 
                        ? (language === 'fr' 
                            ? 'Essayez avec d\'autres termes de recherche ou vérifiez l\'orthographe' 
                            : 'Try different search terms or check spelling')
                        : (language === 'fr'
                            ? 'De nouvelles vidéos communautaires seront bientôt disponibles'
                            : 'New community videos will be available soon')
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredCommunityVideos.map((video, index) => (
                      <div 
                        key={video.id}
                        className="scroll-reveal"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/10 to-green-50/5 dark:from-emerald-950/10 dark:to-green-950/5 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 card-hover hover:shadow-xl hover:shadow-emerald-500/10">
                          <CardContent className="p-0">
                            <div className="relative aspect-video overflow-hidden">
                              <div 
                                className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 cursor-pointer group-hover:from-emerald-500/15 group-hover:via-green-500/15 group-hover:to-teal-500/15 transition-all duration-500"
                                onClick={(e) => handleThumbnailClick(e, video)}
                              >
                                <img
                                  src={getThumbnailUrl(video.youtubeId, 'hqdefault')}
                                  alt={getLocalizedText(video.title)}
                                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getThumbnailUrl(video.youtubeId, 'default');
                                  }}
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                      <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-emerald-500/40 via-green-500/40 to-teal-500/40 rounded-full animate-ping-slow blur-md" />
                                      <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 transform group-hover:rotate-12">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner shadow-black/20">
                                          <Play className="w-6 h-6 text-emerald-600 ml-0.5" fill="currentColor" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="absolute top-4 left-4 z-30">
                                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 shadow-lg text-xs px-3 py-1.5 hover:from-emerald-500 hover:to-green-400 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                                    <Zap className="w-3 h-3 mr-1.5 animate-pulse" />
                                    SHORT
                                  </Badge>
                                </div>

                                {video.duration && (
                                  <div className="absolute bottom-4 right-4 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md hover:bg-black/90 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5">
                                    {video.duration}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="p-5">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 group-hover:translate-x-1">
                                    {getLocalizedText(video.title)}
                                  </h3>
                                  
                                  <div className="flex items-center gap-3 mb-3">
                                    {video.creator && video.creator.name === "Salsabile" && (
                                      <div className="flex items-center gap-2 group">
                                        <div className="relative">
                                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                                            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleCharacterClick(characters[1]); // Basma character
                                            }}
                                            className="absolute -right-1 -top-1 h-5 w-5 bg-emerald-500 hover:bg-emerald-600 text-white p-0.5 rounded-full border-2 border-background transition-all duration-300 hover:scale-125 hover:rotate-12"
                                          >
                                            <Info className="w-3 h-3" />
                                          </Button>
                                        </div>
                                        <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                          {video.creator.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors duration-300 line-clamp-2">
                                    {getLocalizedText(video.description)}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    <Calendar className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>{formatDate(video.publishDate || '')}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>{video.duration}</span>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 group"
                                      onClick={() => handleVideoSelect(video)}
                                    >
                                      <Play className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                                      {language === 'fr' ? 'Regarder' : 'Watch'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Community Stats */}
                {filteredCommunityVideos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="p-5 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 group">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                        <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                      </div>
                      <h4 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {language === 'fr' ? 'Communauté Globale' : 'Global Community'}
                      </h4>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {language === 'fr' 
                          ? 'Membres engagés partout dans le monde' 
                          : 'Engaged members all over the world'}
                      </p>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 group">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                        <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                      </div>
                      <h4 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {language === 'fr' ? 'Impact Collectif' : 'Collective Impact'}
                      </h4>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {language === 'fr' 
                          ? 'Chaque action contribue à un futur meilleur' 
                          : 'Every action contributes to a better future'}
                      </p>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 group">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-12 transition-transform duration-500 ease-out" />
                      </div>
                      <h4 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {language === 'fr' ? 'Inspiration Mutuelle' : 'Mutual Inspiration'}
                      </h4>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {language === 'fr' 
                          ? 'Partagez vos initiatives et inspirez les autres' 
                          : 'Share your initiatives and inspire others'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Channel Section */}
            {activeSection === 'channel' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-4 hover:bg-emerald-500/15 transition-all duration-300 hover:scale-105 animate-pulse-slow">
                    <Youtube className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {language === 'fr' ? 'Vidéos de Notre Chaîne' : 'Our Channel Videos'}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 animate-fade-up">
                    {language === 'fr' ? 'Contenu Officiel de la Chaîne' : 'Official Channel Content'}
                  </h2>
                  <p className="text-muted-foreground max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    {language === 'fr' 
                      ? 'Découvrez le contenu officiel et les présentations de notre chaîne' 
                      : 'Discover official content and showcases from our channel'}
                  </p>
                </div>
                
                {/* Channel Videos Grid */}
                {filteredChannelVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
                      {activeSearchQuery ? (
                        <Search className="w-8 h-8 text-emerald-500" />
                      ) : (
                        <Youtube className="w-8 h-8 text-emerald-500" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {activeSearchQuery 
                        ? (language === 'fr' ? 'Aucune vidéo de chaîne trouvée' : 'No channel videos found')
                        : (language === 'fr' ? 'Aucune vidéo de chaîne disponible' : 'No channel videos available')
                      }
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {activeSearchQuery 
                        ? (language === 'fr' 
                            ? 'Essayez avec d\'autres termes de recherche ou vérifiez l\'orthographe' 
                            : 'Try different search terms or check spelling')
                        : (language === 'fr'
                            ? 'De nouvelles vidéos de chaîne seront bientôt disponibles'
                            : 'New channel videos will be available soon')
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {filteredChannelVideos.map((video, index) => (
                      <div 
                        key={video.id}
                        className="scroll-reveal"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/10 to-green-50/5 dark:from-emerald-950/10 dark:to-green-950/5 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 card-hover hover:shadow-xl hover:shadow-emerald-500/10">
                          <CardContent className="p-0">
                            <div className="relative aspect-video overflow-hidden">
                              <div 
                                className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 cursor-pointer group-hover:from-emerald-500/15 group-hover:via-green-500/15 group-hover:to-teal-500/15 transition-all duration-500"
                                onClick={(e) => handleThumbnailClick(e, video)}
                              >
                                <img
                                  src={getThumbnailUrl(video.youtubeId)}
                                  alt={getLocalizedText(video.title)}
                                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                                  }}
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative">
                                      <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-emerald-500/40 via-green-500/40 to-teal-500/40 rounded-full animate-ping-slow blur-md" />
                                      <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 transform group-hover:rotate-12">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner shadow-black/20">
                                          <Play className="w-6 h-6 text-emerald-600 ml-0.5" fill="currentColor" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="absolute top-4 left-4 z-30">
                                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 shadow-lg text-xs px-3 py-1.5 hover:from-emerald-500 hover:to-green-400 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5">
                                    <Video className="w-3 h-3 mr-1.5" />
                                    CHANNEL
                                  </Badge>
                                </div>

                                {video.duration && (
                                  <div className="absolute bottom-4 right-4 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md hover:bg-black/90 transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-0.5">
                                    {video.duration}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="p-5">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300 group-hover:translate-x-1">
                                    {getLocalizedText(video.title)}
                                  </h3>
                                  
                                  <div className="flex items-center gap-3 mb-3">
                                    {video.creator && (
                                      <div className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                                          <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                            {video.creator.name}
                                          </span>
                                          <p className="text-xs text-muted-foreground">{video.creator.role}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors duration-300 line-clamp-2">
                                    {getLocalizedText(video.description)}
                                  </p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                    <Calendar className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>{formatDate(video.publishDate || '')}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                                    <span>{video.duration}</span>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105 group"
                                      onClick={() => handleVideoSelect(video)}
                                    >
                                      <Play className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                                      {language === 'fr' ? 'Regarder' : 'Watch'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* YouTube Channel Link */}
          <div className="mt-12 md:mt-16 transition-opacity duration-500">
            <div className="bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/20 p-6 md:p-8 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-500 group">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                    {language === 'fr' ? 'Notre Chaîne YouTube' : 'Our YouTube Channel'}
                  </h3>
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

      {/* Enhanced Video Modal with LazyVideoPlayer */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent 
          ref={modalRef}
          className={`fixed inset-0 m-auto border-none bg-black shadow-2xl overflow-hidden p-0 transition-all duration-500 ease-out z-50 ${
            isMobile ? 'w-full h-full rounded-none' : 'sm:w-[95vw] sm:h-[85vh] rounded-lg'
          } ${selectedVideo?.isShort ? 'max-w-[400px] max-h-[710px]' : ''}`}
          style={{
            maxWidth: selectedVideo?.aspect === 'portrait' ? '400px' : 
                     isMobile ? '100%' : 'min(1000px, 95vw)',
            maxHeight: selectedVideo?.aspect === 'portrait' ? '710px' : 
                      isMobile ? '100%' : 'min(562px, 85vh)',
            aspectRatio: selectedVideo?.isShort ? '9/16' : 
                        selectedVideo?.aspect === 'portrait' ? '9/16' : '16/9',
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseLeave={() => {
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
            setTimeout(() => setShowControls(false), 100);
          }}
        >
          
          {/* Enhanced Loading Overlay - Faster and Better */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
              <div className="relative">
                <div className="w-16 h-16 border-3 border-transparent border-t-emerald-500 rounded-full animate-spin-fast"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-emerald-500 animate-pulse-fast" />
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
                    ? 'Impossible de charger la vidéo. Veuillez vérifier votre connexion et réessayer.'
                    : 'Unable to load video. Please check your connection and try again.'}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleRetryVideo}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {language === 'fr' ? 'Réessayer' : 'Retry'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleModalClose}
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
                    size={isMobile ? "icon" : "sm"}
                    className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 hover:-translate-y-0.5`}
                    onClick={handleModalClose}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  
                  {selectedVideo && (
                    <div className="ml-2 max-w-[calc(100%-140px)]">
                      <h3 className="text-sm font-semibold text-white/95 truncate animate-fade-in">
                        {getLocalizedText(selectedVideo.title)}
                      </h3>
                      {selectedVideo.creator && (
                        <p className="text-xs text-white/70 truncate animate-fade-in" style={{ animationDelay: '0.1s' }}>
                          {language === 'fr' ? 'Par' : 'By'} {selectedVideo.creator.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Hide Interface Button */}
                  <Button
                    variant="ghost"
                    size={isMobile ? "icon" : "sm"}
                    className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 hover:-translate-y-0.5`}
                    onClick={toggleInterface}
                    title={language === 'fr' ? 'Masquer l\'interface' : 'Hide interface'}
                  >
                    <EyeOff className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size={isMobile ? "icon" : "sm"}
                    className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 hover:-translate-y-0.5`}
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    title={language === 'fr' ? 'Ouvrir sur YouTube' : 'Open on YouTube'}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size={isMobile ? "icon" : "sm"}
                    className={`${isMobile ? 'h-12 w-12' : 'h-10 w-10'} bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 hover:-translate-y-0.5`}
                    onClick={toggleFullscreen}
                    title={language === 'fr' ? 'Plein écran' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5" />
                    ) : (
                      <Maximize2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Video Player with LazyVideoPlayer */}
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
                  className="h-12 w-12 bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 animate-float-slow hover:-translate-y-0.5"
                  onClick={toggleInterface}
                  title={language === 'fr' ? 'Afficher l\'interface' : 'Show interface'}
                >
                  <Eye className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 animate-float-slow hover:-translate-y-0.5"
                  onClick={toggleMute}
                  title={isMuted ? (language === 'fr' ? 'Activer le son' : 'Unmute') : (language === 'fr' ? 'Désactiver le son' : 'Mute')}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
              </div>
            )}
            
            {/* Floating Mute Controls for mobile when interface is visible */}
            {showInterface && isMobile && selectedVideo?.isShort && !videoError && (
              <div className="absolute bottom-20 right-4 z-50 flex flex-col gap-2 animate-fade-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border border-white/20 hover:scale-105 hover:border-emerald-500/50 active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
                  onClick={toggleMute}
                  title={isMuted ? (language === 'fr' ? 'Activer le son' : 'Unmute') : (language === 'fr' ? 'Désactiver le son' : 'Mute')}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
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
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      {selectedVideo.publishDate && (
                        <span className="flex items-center gap-1.5 animate-fade-in hover:text-white transition-colors duration-200">
                          <Calendar className="w-4 h-4" />
                          <span className="hidden sm:inline">{formatDate(selectedVideo.publishDate)}</span>
                          <span className="sm:hidden text-xs">{formatDate(selectedVideo.publishDate)}</span>
                        </span>
                      )}
                      {selectedVideo.duration && (
                        <span className="flex items-center gap-1.5 animate-fade-in hover:text-white transition-colors duration-200" style={{ animationDelay: '0.1s' }}>
                          <Clock className="w-4 h-4" />
                          <span>{selectedVideo.duration}</span>
                        </span>
                      )}
                      {selectedVideo.creator && (
                        <span className="flex items-center gap-1.5 animate-fade-in hover:text-white transition-colors duration-200" style={{ animationDelay: '0.2s' }}>
                          <User className="w-4 h-4" />
                          <span>{selectedVideo.creator.name}</span>
                        </span>
                      )}
                    </div>
                    
                    <Button
                      size={isMobile ? "sm" : "default"}
                      className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 hover:-translate-y-0.5"
                      onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden sm:inline">YouTube</span>
                      <span className="sm:hidden">YT</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Character Info Dialog */}
      <Dialog open={showCharacterInfo} onOpenChange={handleCharacterInfoClose}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl p-0 border-0 overflow-hidden bg-transparent">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-xl overflow-hidden border border-emerald-500/20 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">
                  {language === 'fr' ? 'Personnages' : 'Characters'}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-600"
                  onClick={handleCharacterInfoClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => setSelectedCharacter(character)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                      selectedCharacter?.id === character.id
                        ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30'
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-emerald-500/10'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/30">
                      <img
                        src={character.imageUrl}
                        alt={character.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/100/10b981/ffffff?text=?";
                        }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {character.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{character.role}</p>
                    </div>
                    {selectedCharacter?.id === character.id && (
                      <ChevronRight className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
              
              {selectedCharacter && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">
                        {selectedCharacter.name}
                      </h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">{selectedCharacter.role}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-emerald-500/10"
                        onClick={handlePrevCharacter}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-emerald-500/10"
                        onClick={handleNextCharacter}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-emerald-500/20 bg-emerald-500/5">
                    {imageError ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-emerald-500/50" />
                        <p className="absolute bottom-4 text-sm text-emerald-500/70">
                          {language === 'fr' ? 'Image non disponible' : 'Image not available'}
                        </p>
                      </div>
                    ) : (
                      <img
                        src={selectedCharacter.imageUrl}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {getLocalizedText(selectedCharacter.description)}
                  </p>
                </div>
              )}
            </div>
          </div>
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pingSlow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes pulseFast {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-fast {
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
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.8);
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
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
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
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulseFast 0.5s ease-in-out infinite;
        }
        
        .animate-spin-fast {
          animation: spin-fast 0.5s linear infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
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
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .card-hover {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                     box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                     border-color 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.2);
        }
        
        /* Enhanced hover animations */
        .group:hover .group-hover\:-translate-y-0\.5 {
          transform: translateY(-2px);
        }
        
        .group:hover .group-hover\:rotate-12 {
          transform: rotate(12deg);
        }
        
        .group:hover .group-hover\:scale-125 {
          transform: scale(1.25);
        }
        
        /* Smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping-slow,
          .animate-pulse-slow,
          .animate-pulse-fast,
          .animate-float,
          .animate-spin,
          .animate-spin-fast,
          .animate-bounce,
          .animate-shimmer,
          .animate-fade-up,
          .animate-glow,
          .animate-spin-slow,
          .animate-bounce-slow,
          .animate-fade-in,
          .animate-scale-in,
          .animate-float-slow,
          .card-hover,
          .transition-all,
          .transition-transform,
          .transition-colors {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
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
        
        /* Better focus styles */
        *:focus-visible {
          outline: 2px solid rgb(16, 185, 129);
          outline-offset: 2px;
        }
        
        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .card-hover:hover {
            transform: none;
            box-shadow: none;
          }
          
          .card-hover:active {
            transform: scale(0.98);
            transition: transform 0.1s ease;
          }
          
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
        }
        
        /* Shorts specific styles */
        .shorts-player {
          max-width: 400px;
          max-height: 710px;
          margin: 0 auto;
        }
        
        /* Video embed full viewability */
        iframe {
          display: block;
        }
        
        /* Theme transition enhancement */
        * {
          transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease;
        }
      `}</style>
    </div>
  );
}
