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
  Users, 
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
  ChevronRight,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronDown,
  Sparkles
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
  tags?: string[];
}

interface Character {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
  color: string;
  description: { fr: string; en: string };
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hasLoaded, setHasLoaded] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSectionRef = useRef<string>('tutorials');
  
  // Enhanced scroll reveal with better performance
  useScrollReveal({
    threshold: isMobile ? 0.05 : 0.1,
    distance: isMobile ? '15px' : '25px',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: isMobile ? 500 : 700,
    delay: 50
  });

  // Enhanced mobile detection with debouncing
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };
    
    checkMobile();
    setHasLoaded(true);
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Memoized characters data
  const characters: Character[] = useMemo(() => [
    {
      id: "meow",
      name: "Meow",
      imageUrl: "https://i.ibb.co/d06DQqBR/Meow-png.jpg",
      role: language === 'fr' ? "Mascotte" : "Mascot",
      color: "from-blue-500 to-cyan-500",
      description: {
        fr: "La mascotte adorable qui encourage le recyclage et la réutilisation créative",
        en: "The adorable mascot who encourages recycling and creative reuse"
      }
    },
    {
      id: "basma",
      name: "Basma",
      imageUrl: "https://i.ibb.co/4npFCFPd/Basma-png.jpg",
      role: language === 'fr' ? "Artiste Écologique" : "Ecological Artist",
      color: "from-emerald-500 to-green-500",
      description: {
        fr: "Artiste passionnée qui transforme les déchets en œuvres d'art inspirantes",
        en: "Passionate artist who transforms waste into inspiring works of art"
      }
    },
    {
      id: "cat",
      name: "Cat",
      imageUrl: "https://i.ibb.co/Kzp4Rg9s/CAT-png.jpg",
      role: language === 'fr' ? "Super-héros Écologique" : "Ecological Superhero",
      color: "from-purple-500 to-pink-500",
      description: {
        fr: "Super-héros qui combat la pollution et enseigne les bonnes pratiques environnementales",
        en: "Superhero who fights pollution and teaches good environmental practices"
      }
    }
  ], [language]);

  // Memoized videos data
  const videos: Video[] = useMemo(() => [
    {
      id: "channel-showcase",
      title: {
        fr: "Présentation du Site Web",
        en: "Website Showcase"
      },
      description: {
        fr: "Découvrez toutes les fonctionnalités de notre plateforme éducative",
        en: "Discover all the features of our educational platform"
      },
      youtubeId: "v_EyngbVFb8",
      duration: "1:28",
      publishDate: "2025-12-09",
      category: { fr: "Chaîne", en: "Channel" },
      type: "channel",
      aspect: "landscape",
      creator: { name: "Yahia", role: language === 'fr' ? "Développeur" : "Developer" },
      tags: ["présentation", "développement", "éducation"]
    },
    {
      id: "reuse-cat-4",
      title: {
        fr: "Réutiliser avec Cat - Épisode 4",
        en: "Reuse with Cat - Episode 4"
      },
      description: {
        fr: "Apprenez des techniques créatives de réutilisation avec notre super-héros préféré",
        en: "Learn creative reuse techniques with our favorite superhero"
      },
      youtubeId: "aEnA1z-G7qE",
      duration: "0:57",
      publishDate: "2025-12-11",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true,
      tags: ["réutilisation", "créativité", "cat"]
    },
    {
      id: "laundry-cat",
      title: {
        fr: "Le Chat du Lavage",
        en: "Laundry cat"
      },
      description: {
        fr: "Une aventure amusante avec Cat qui apprend les bonnes pratiques écologiques",
        en: "A fun adventure with Cat learning eco-friendly practices"
      },
      youtubeId: "c7akmKesIq4",
      duration: "0:45",
      publishDate: "2025-12-10",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true,
      tags: ["écologie", "apprentissage", "animation"]
    },
    {
      id: "community-short",
      title: {
        fr: "Ne jetez pas vos bouteilles - Épisode 2",
        en: "Don't throw your bottles - Episode 2"
      },
      description: {
        fr: "Découvrez comment transformer vos bouteilles en objets utiles",
        en: "Discover how to transform your bottles into useful objects"
      },
      youtubeId: "TeS8QfpPHic",
      duration: "0:53",
      publishDate: "2025-12-08",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true,
      tags: ["recyclage", "bouteilles", "DIY"]
    },
    {
      id: "community1",
      title: {
        fr: "Avenir plus propre avec Chat",
        en: "Cleaner Future with Cat - Trailer"
      },
      description: {
        fr: "Bande-annonce de notre série éducative sur un avenir durable",
        en: "Trailer of our educational series on a sustainable future"
      },
      youtubeId: "CtcgvPj1vGk",
      duration: "0:36",
      publishDate: "2025-12-06",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true,
      tags: ["trailer", "série", "éducation"]
    },
    {
      id: "community2",
      title: {
        fr: "Artisanat et recyclage - Épisode 1",
        en: "Crafting and recycling - Episode 1"
      },
      description: {
        fr: "Premier épisode de notre série sur l'artisanat avec des matériaux recyclés",
        en: "First episode of our series on crafting with recycled materials"
      },
      youtubeId: "g8MBdRd99LU",
      duration: "1:12",
      publishDate: "2025-12-07",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste" : "Artist" },
      isShort: true,
      tags: ["artisanat", "recyclage", "tutoriel"]
    },
    {
      id: "tutorial1",
      title: {
        fr: "Introduction au Recyclage",
        en: "Recycling Introduction"
      },
      description: {
        fr: "Les bases essentielles du recyclage pour débutants",
        en: "Essential recycling basics for beginners"
      },
      youtubeId: "c5sPRL0YKUw",
      duration: "7:03",
      publishDate: "2024-01-15",
      category: { fr: "Éducation", en: "Education" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["débutant", "bases", "éducation"]
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
      aspect: "landscape",
      tags: ["papier", "carton", "processus"]
    },
    {
      id: "tutorial3",
      title: {
        fr: "Voyage au cœur du tri",
        en: "Journey to the Heart of Sorting"
      },
      description: {
        fr: "Découvrez le parcours des déchets recyclables",
        en: "Discover the journey of recyclable waste"
      },
      youtubeId: "p67EWIamCIw",
      duration: "5:33",
      publishDate: "2024-03-05",
      category: { fr: "Documentaire", en: "Documentary" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["documentaire", "tri", "déchets"]
    }
  ], [language]);

  // Get section videos - FIXED: No disappearing issue
  const getSectionVideos = useCallback((section: typeof activeSection): Video[] => {
    return videos.filter(v => v.type === section.slice(0, -1) as Video['type']);
  }, [videos]);

  // Enhanced search function - works across all sections
  const searchVideos = useCallback((query: string): Video[] => {
    if (!query.trim()) return [];
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 1);
    if (searchTerms.length === 0) return [];
    
    return videos.filter(video => {
      const searchableText = [
        video.title[language].toLowerCase(),
        video.description[language].toLowerCase(),
        video.category?.[language]?.toLowerCase() || '',
        video.creator?.name.toLowerCase() || '',
        video.creator?.role.toLowerCase() || '',
        video.type.toLowerCase(),
        ...(video.tags || []).map(tag => tag.toLowerCase())
      ].join(' ');
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [videos, language]);

  // Enhanced search with better debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setDebouncedSearchQuery("");
      setIsSearching(false);
      setSearchLoading(false);
      return;
    }
    
    setSearchLoading(true);
    setIsSearching(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      const results = searchVideos(searchQuery);
      setSearchResults(results);
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
      setSearchLoading(false);
      
      // Scroll to videos when searching
      if (results.length > 0 && videoSectionRef.current) {
        setTimeout(() => {
          videoSectionRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
    }, 350);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchVideos]);

  // FIXED: Get current videos - No disappearing issue
  const currentVideos = useMemo(() => {
    // If searching, show search results filtered by current section
    if (searchResults.length > 0 && debouncedSearchQuery.trim()) {
      return searchResults.filter(video => video.type === activeSection.slice(0, -1) as Video['type']);
    }
    
    // Otherwise show all videos for current section
    return getSectionVideos(activeSection);
  }, [activeSection, getSectionVideos, debouncedSearchQuery, searchResults]);

  // Memoized text translation
  const getLocalizedText = useCallback((text: { fr: string; en: string } | string) => {
    if (typeof text === 'string') return text;
    return text[language];
  }, [language]);

  // Enhanced video modal handling
  const openVideoModal = useCallback((video: Video) => {
    setIsLoading(true);
    setSelectedVideo(video);
    setVideoError(false);
    setErrorMessage("");
    setIsRotated(false);
    
    setTimeout(() => {
      setIsModalOpen(true);
    }, 50);
  }, []);

  // Handle video modal state
  useEffect(() => {
    if (selectedVideo && !isModalOpen) {
      setIsModalOpen(true);
      setShowInterface(true);
      setShowControls(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isModalOpen) {
          setShowControls(false);
        }
      }, 3500);
    }
  }, [selectedVideo, isModalOpen]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Enhanced thumbnail URL helper with quality optimization
  const getThumbnailUrl = useCallback((youtubeId: string, isShort?: boolean) => {
    return `https://img.youtube.com/vi/${youtubeId}/${isShort ? 'hqdefault' : 'maxresdefault'}.jpg`;
  }, []);

  // Open in YouTube
  const openInYouTube = useCallback((youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  }, []);

  // Enhanced date formatting
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }, [language]);

  // Video selection handler
  const handleVideoSelect = useCallback((video: Video) => {
    try {
      openVideoModal(video);
    } catch (error) {
      console.error('Video selection error:', error);
      setErrorMessage(getLocalizedText({
        fr: "Erreur lors de l'ouverture de la vidéo",
        en: "Error opening video"
      }));
    }
  }, [openVideoModal, getLocalizedText]);

  // Thumbnail click handler
  const handleThumbnailClick = useCallback((e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    e.preventDefault();
    handleVideoSelect(video);
  }, [handleVideoSelect]);

  // Enhanced fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await modalRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  // Controls visibility
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isModalOpen) {
        setShowControls(false);
      }
    }, 3500);
  }, [isModalOpen]);

  // Modal close handler
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedVideo(null);
      setIsLoading(false);
      setVideoError(false);
      setErrorMessage("");
      setIsRotated(false);
      setShowInterface(true);
      setShowControls(true);
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }, 200);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
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
      if (isModalOpen) {
        setShowControls(false);
      }
    }, 3500);
  }, [isModalOpen]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Enhanced search handlers
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
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
          e.preventDefault();
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
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleMute();
          }
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

  // FIXED: Section change - NO DISAPPEARING CONTENT
  const handleSectionChange = useCallback((section: typeof activeSection) => {
    if (section === activeSection) return;
    
    // Update active section immediately
    lastSectionRef.current = activeSection;
    setActiveSection(section);
    
    // Update content key to trigger smooth transition
    setContentKey(prev => prev + 1);
    
    // Scroll to videos
    setTimeout(() => {
      videoSectionRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 50);
  }, [activeSection]);

  // Aspect ratio helper
  const getAspectRatio = useCallback((video: Video): '16:9' | '9:16' => {
    return video.aspect === 'portrait' || video.isShort ? '9:16' : '16:9';
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
    setErrorMessage(error || getLocalizedText({
      fr: "Impossible de charger la vidéo",
      en: "Unable to load video"
    }));
  }, [getLocalizedText]);

  // Image error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
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
    
    setTimeout(() => {
      setShowCharacterDetail(true);
    }, 200);
  }, []);

  const handleCharacterDetailClose = useCallback(() => {
    setShowCharacterDetail(false);
    
    setTimeout(() => {
      setSelectedCharacter(null);
      setImageError(false);
    }, 200);
  }, []);

  // Retry video loading
  const handleRetryVideo = useCallback(() => {
    if (selectedVideo) {
      setVideoError(false);
      setErrorMessage("");
      setIsLoading(true);
    }
  }, [selectedVideo]);

  // Toggle rotation for mobile only
  const toggleRotation = useCallback(() => {
    if (isMobile && selectedVideo?.aspect === 'landscape') {
      setIsRotated(prev => !prev);
    }
  }, [isMobile, selectedVideo]);

  // Get modal style for mobile compatibility
  const getModalStyle = useCallback((): React.CSSProperties => {
    if (!selectedVideo) return {};
    
    const isPortrait = selectedVideo.aspect === 'portrait' || selectedVideo.isShort;
    
    if (isMobile) {
      if (isRotated && selectedVideo?.aspect === 'landscape') {
        return {
          width: '100vh',
          height: '100vw',
          margin: 0,
          padding: 0,
          borderRadius: 0,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(90deg)',
          zIndex: 9999
        };
      }
      
      return {
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        borderRadius: 0,
        top: 0,
        left: 0,
        position: 'fixed',
        zIndex: 9999
      };
    } else {
      if (isPortrait) {
        return {
          width: '400px',
          height: '710px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          margin: 0,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '20px',
          overflow: 'hidden',
          zIndex: 50
        };
      } else {
        return {
          width: 'min(1200px, 90vw)',
          height: 'min(675px, 90vh)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          margin: 0,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '20px',
          overflow: 'hidden',
          zIndex: 50
        };
      }
    }
  }, [selectedVideo, isMobile, isRotated]);

  // FIXED: Render video section - NO DISAPPEARING CONTENT
  const renderVideoSection = useCallback(() => {
    const hasSearchQuery = debouncedSearchQuery.trim().length > 0;
    const hasVideos = currentVideos.length > 0;
    
    const noResultsText = hasSearchQuery 
      ? getLocalizedText({ fr: 'Aucun résultat trouvé', en: 'No results found' })
      : getLocalizedText({ fr: 'Aucune vidéo disponible', en: 'No videos available' });
    
    const noResultsDescription = hasSearchQuery 
      ? getLocalizedText({ fr: 'Essayez avec d\'autres termes', en: 'Try different terms' })
      : getLocalizedText({ fr: 'De nouvelles vidéos arrivent bientôt', en: 'New videos coming soon' });

    if (!hasVideos) {
      return (
        <NoResults 
          icon={activeSection === 'tutorials' ? <Recycle className="w-12 h-12" /> :
                activeSection === 'community' ? <Users className="w-12 h-12" /> :
                <Youtube className="w-12 h-12" />}
          title={noResultsText}
          description={noResultsDescription}
          searchQuery={debouncedSearchQuery}
        />
      );
    }

    return (
      <div 
        ref={videoSectionRef}
        key={contentKey}
        className={`${viewMode === 'grid' 
          ? `grid ${isMobile ? 'grid-cols-1 gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'}`
          : 'flex flex-col gap-4 max-w-4xl mx-auto'
        } animate-content-appear`}
      >
        {currentVideos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            className="scroll-reveal"
            style={{ 
              animationDelay: `${Math.min(index * 0.04, 0.4)}s`,
              transitionDelay: `${Math.min(index * 0.02, 0.2)}s`
            }}
            onMouseEnter={() => !isMobile && setHoveredVideoId(video.id)}
            onMouseLeave={() => !isMobile && setHoveredVideoId(null)}
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
              isHovered={hoveredVideoId === video.id}
              showCharacterInfo={video.creator?.name === "Salsabile"}
              onCharacterInfoClick={handleCharacterSelectionOpen}
              viewMode={viewMode}
              isLoading={!hasLoaded}
            />
          </div>
        ))}
      </div>
    );
  }, [
    activeSection,
    currentVideos,
    debouncedSearchQuery,
    contentKey,
    getLocalizedText,
    isMobile,
    viewMode,
    hoveredVideoId,
    getThumbnailUrl,
    formatDate,
    openInYouTube,
    handleVideoSelect,
    handleThumbnailClick,
    language,
    handleCharacterSelectionOpen,
    hasLoaded
  ]);

  // Get section icon with better quality
  const getSectionIcon = useCallback((section: typeof activeSection) => {
    const size = isMobile ? "w-5 h-5" : "w-6 h-6";
    switch(section) {
      case 'tutorials': return <Recycle className={size} />;
      case 'community': return <Users className={size} />;
      case 'channel': return <Youtube className={size} />;
    }
  }, [isMobile]);

  // Get section count
  const getSectionCount = useCallback((section: typeof activeSection) => {
    return getSectionVideos(section).length;
  }, [getSectionVideos]);

  // Adjusted button sizes for mobile
  const getButtonSize = useCallback(() => {
    return isMobile ? "default" : "lg";
  }, [isMobile]);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5"
    >
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12 lg:mb-16 animate-fade-up">
            <div className="inline-flex items-center justify-center p-3 mb-4 md:mb-6 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-green-500/30 blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 p-3 md:p-4 rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 group">
                  <Video className="w-8 h-8 md:w-10 md:h-10 text-emerald-600 dark:text-emerald-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 animate-fade-up">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                {getLocalizedText({ fr: 'Vidéos Éducatives', en: 'Educational Videos' })}
              </span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {getLocalizedText({ 
                fr: 'Apprenez et inspirez-vous pour un avenir durable', 
                en: 'Learn and get inspired for a sustainable future' 
              })}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-8 md:mb-10 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center group">
                <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                    searchQuery ? 'text-emerald-500 scale-110' : 'text-muted-foreground'
                  }`} />
                </div>
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={getLocalizedText({ fr: 'Rechercher des vidéos...', en: 'Search videos...' })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`pl-12 md:pl-14 ${
                    isMobile ? 'pr-12 py-3 text-base' : 'pr-14 py-5 text-lg'
                  } rounded-xl md:rounded-2xl border border-border/50 bg-background/90 backdrop-blur-sm shadow-lg hover:shadow-xl focus:shadow-2xl transition-all duration-300 hover:border-emerald-500/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                  aria-label={getLocalizedText({ fr: 'Rechercher des vidéos', en: 'Search videos' })}
                />
                <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {searchLoading && (
                    <div className="relative">
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 animate-spin" />
                    </div>
                  )}
                  {searchQuery && !searchLoading && (
                    <button
                      onClick={handleClearSearch}
                      className={`${
                        isMobile ? 'h-9 w-9' : 'h-10 w-10'
                      } text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center`}
                      aria-label={getLocalizedText({ fr: 'Effacer la recherche', en: 'Clear search' })}
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search Stats */}
              {(searchQuery || debouncedSearchQuery) && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm animate-fade-in">
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full">
                    <Filter className="w-4 h-4" />
                    <span>{currentVideos.length} {getLocalizedText({ fr: 'résultats', en: 'results' })}</span>
                    {searchResults.length > currentVideos.length && (
                      <span className="text-xs opacity-70">
                        ({searchResults.length} {getLocalizedText({ fr: 'au total', en: 'total' })})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="mb-8 md:mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {(['tutorials', 'community', 'channel'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`group relative px-5 md:px-7 py-3 md:py-4 rounded-lg md:rounded-xl text-base font-medium transition-all duration-300 flex items-center gap-3 md:gap-4 ${
                      activeSection === section
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={
                      section === 'tutorials' 
                        ? getLocalizedText({ fr: 'Tutoriels', en: 'Tutorials' })
                        : section === 'community'
                        ? getLocalizedText({ fr: 'Communauté', en: 'Community' })
                        : getLocalizedText({ fr: 'Chaîne', en: 'Channel' })
                    }
                  >
                    {getSectionIcon(section)}
                    <span className="whitespace-nowrap">
                      {section === 'tutorials' ? getLocalizedText({ fr: 'Tutoriels', en: 'Tutorials' }) :
                       section === 'community' ? getLocalizedText({ fr: 'Communauté', en: 'Community' }) :
                       getLocalizedText({ fr: 'Chaîne', en: 'Channel' })}
                    </span>
                    <span className={`px-2 md:px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                      activeSection === section 
                        ? 'bg-white/30' 
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-500/20'
                    }`}>
                      {getSectionCount(section)}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* View Mode Toggle - Desktop only */}
              {!isMobile && (
                <div className="flex items-center gap-2 bg-background/50 border border-border rounded-xl p-1.5 animate-fade-in">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={getLocalizedText({ fr: 'Vue grille', en: 'Grid view' })}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2.5 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={getLocalizedText({ fr: 'Vue liste', en: 'List view' })}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections - FIXED: No disappearing content */}
          <div key={`content-${activeSection}`} className="animate-content-fade">
            {renderVideoSection()}
          </div>

          {/* YouTube Channel Link */}
          <div className="mt-12 md:mt-16 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="relative bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-xl md:rounded-2xl border border-emerald-500/20 p-5 md:p-7 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300 group">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-5 md:gap-7">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Youtube className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {getLocalizedText({ fr: 'Chaîne YouTube', en: 'YouTube Channel' })}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    {getLocalizedText({ 
                      fr: 'Plus de contenu éducatif sur notre chaîne', 
                      en: 'More educational content on our channel' 
                    })}
                  </p>
                </div>
                
                <Button
                  size={getButtonSize()}
                  className="gap-3 md:gap-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 px-6 md:px-10 py-5 hover:scale-105 active:scale-95 transition-all duration-300 group"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                  aria-label={getLocalizedText({ fr: 'Visiter notre chaîne YouTube', en: 'Visit our YouTube channel' })}
                >
                  <ExternalLink className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
                  {getLocalizedText({ fr: 'Visiter', en: 'Visit' })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent 
          ref={modalRef}
          className="fixed border-none bg-black shadow-2xl overflow-hidden p-0 transition-all duration-300 ease-out z-[9999]"
          style={getModalStyle()}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onTouchStart={() => setShowControls(true)}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-10 h-10 text-emerald-500 animate-pulse-slow" />
                </div>
              </div>
            </div>
          )}
          
          {/* Error Overlay */}
          {videoError && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm z-50 animate-fade-in">
              <div className="text-center p-6 max-w-sm">
                <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                  {getLocalizedText({ fr: 'Erreur', en: 'Error' })}
                </h3>
                <p className="text-white/80 mb-6 text-base md:text-lg">
                  {errorMessage || getLocalizedText({ 
                    fr: 'Impossible de charger la vidéo', 
                    en: 'Unable to load video' 
                  })}
                </p>
                <div className="flex gap-4 md:gap-5 justify-center">
                  <Button
                    onClick={handleRetryVideo}
                    className="gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-base"
                    aria-label={getLocalizedText({ fr: 'Réessayer', en: 'Retry' })}
                  >
                    <RefreshCw className="w-5 h-5" />
                    {getLocalizedText({ fr: 'Réessayer', en: 'Retry' })}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleModalClose}
                    className="border-white/30 text-white hover:bg-white/10 text-base px-6"
                    aria-label={getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                  >
                    {getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Top Controls Bar */}
          {showInterface && !videoError && (
            <div 
              className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/85 to-transparent p-4 md:p-5 transition-all duration-300 ease-out ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-11 w-11'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={handleModalClose}
                    aria-label={getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                  
                  {selectedVideo && (
                    <div className="ml-2 max-w-[calc(100%-160px)] md:max-w-[calc(100%-200px)]">
                      <h3 className="text-sm md:text-base font-semibold text-white/95 truncate animate-fade-in">
                        {getLocalizedText(selectedVideo.title)}
                      </h3>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                  {/* Hide UI Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-11 w-11'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={toggleInterface}
                    title={getLocalizedText({ fr: 'Masquer l\'interface', en: 'Hide interface' })}
                    aria-label={getLocalizedText({ fr: 'Masquer l\'interface', en: 'Hide interface' })}
                  >
                    {showInterface ? (
                      <EyeOff className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <Eye className="w-5 h-5 md:w-6 md:h-6" />
                    )}
                  </Button>
                  
                  {/* Rotate Button for mobile landscape videos */}
                  {isMobile && selectedVideo?.aspect === 'landscape' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300"
                      onClick={toggleRotation}
                      title={getLocalizedText({ fr: 'Tourner', en: 'Rotate' })}
                      aria-label={getLocalizedText({ fr: 'Tourner', en: 'Rotate' })}
                    >
                      <RotateCw className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-11 w-11'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    title={getLocalizedText({ fr: 'YouTube', en: 'YouTube' })}
                    aria-label={getLocalizedText({ fr: 'YouTube', en: 'YouTube' })}
                  >
                    <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${isMobile ? 'h-10 w-10' : 'h-11 w-11'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                    onClick={toggleFullscreen}
                    title={getLocalizedText({ fr: 'Plein écran', en: 'Fullscreen' })}
                    aria-label={getLocalizedText({ fr: 'Plein écran', en: 'Fullscreen' })}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5 md:w-6 md:h-6" />
                    ) : (
                      <Maximize2 className="w-5 h-5 md:w-6 md:h-6" />
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
                  showControls={true}
                  aspectRatio={getAspectRatio(selectedVideo)}
                  className="w-full h-full"
                  onLoad={handleVideoLoad}
                  onError={() => handleVideoError()}
                  onPlay={handleVideoLoad}
                  playsInline={true}
                  modestbranding={1}
                  rel={0}
                  config={{
                    playerVars: {
                      playsinline: 1,
                      modestbranding: 1,
                      rel: 0,
                      origin: window.location.origin
                    }
                  }}
                />
              </div>
            )}
            
            {/* Floating Controls */}
            {!showInterface && showControls && !videoError && (
              <div className="absolute top-4 md:top-5 right-4 md:right-5 z-50 flex flex-col gap-2 md:gap-3 animate-fade-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMobile ? 'h-12 w-12' : 'h-11 w-11'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                  onClick={toggleInterface}
                  title={getLocalizedText({ fr: 'Afficher', en: 'Show' })}
                  aria-label={getLocalizedText({ fr: 'Afficher', en: 'Show' })}
                >
                  <Eye className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
                
                {/* Floating Rotate Button for mobile */}
                {isMobile && selectedVideo?.aspect === 'landscape' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300"
                    onClick={toggleRotation}
                    title={getLocalizedText({ fr: 'Tourner', en: 'Rotate' })}
                    aria-label={getLocalizedText({ fr: 'Tourner', en: 'Rotate' })}
                  >
                    <RotateCw className="w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${isMobile ? 'h-12 w-12' : 'h-11 w-11'} bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300`}
                  onClick={toggleMute}
                  title={
                    isMuted 
                      ? getLocalizedText({ fr: 'Son', en: 'Sound' })
                      : getLocalizedText({ fr: 'Muet', en: 'Mute' })
                  }
                  aria-label={
                    isMuted 
                      ? getLocalizedText({ fr: 'Son', en: 'Sound' })
                      : getLocalizedText({ fr: 'Muet', en: 'Mute' })
                  }
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
                  ) : (
                    <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Controls Bar */}
          {showInterface && !videoError && (
            <div 
              className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-4 md:p-5 transition-all duration-300 ease-out ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
              }`}
            >
              {selectedVideo && (
                <div className="space-y-3 md:space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white line-clamp-1">
                      {getLocalizedText(selectedVideo.title)}
                    </h3>
                    <p className="text-sm md:text-base text-white/80 line-clamp-2 mt-2">
                      {getLocalizedText(selectedVideo.description)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div className="flex items-center gap-4 md:gap-5 text-sm md:text-base text-white/70">
                      {selectedVideo.publishDate && (
                        <span className="flex items-center gap-2 md:gap-2.5">
                          <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                          <span>{formatDate(selectedVideo.publishDate)}</span>
                        </span>
                      )}
                      {selectedVideo.duration && (
                        <span className="flex items-center gap-2 md:gap-2.5">
                          <Clock className="w-4 h-4 md:w-5 md:h-5" />
                          <span>{selectedVideo.duration}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 md:h-10 md:w-10 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-300"
                        onClick={toggleMute}
                        title={
                          isMuted 
                            ? getLocalizedText({ fr: 'Son', en: 'Sound' })
                            : getLocalizedText({ fr: 'Muet', en: 'Mute' })
                        }
                        aria-label={
                          isMuted 
                            ? getLocalizedText({ fr: 'Son', en: 'Sound' })
                            : getLocalizedText({ fr: 'Muet', en: 'Mute' })
                        }
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
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

      {/* Character Selection Dialog */}
      {showCharacterSelection && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={handleCharacterSelectionClose}
          />
          <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl animate-scale-in max-w-[95vw] sm:max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {getLocalizedText({ fr: 'Personnages', en: 'Characters' })}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getLocalizedText({ fr: 'Choisissez un personnage', en: 'Choose a character' })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-300"
                  onClick={handleCharacterSelectionClose}
                  aria-label={getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterSelect(character)}
                    className="group relative flex flex-col items-center p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-800/50 border border-emerald-500/10 hover:border-emerald-500/30"
                  >
                    <div className="relative mb-2 md:mb-3">
                      <div className={`absolute inset-0 bg-gradient-to-r ${character.color} rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/20 overflow-hidden group-hover:border-emerald-500/30 transition-all duration-300">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {character.name}
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {character.role}
                    </p>
                    <ChevronRight className="absolute top-2 right-2 md:top-3 md:right-3 w-4 h-4 md:w-5 md:h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Detail Dialog */}
      {showCharacterDetail && selectedCharacter && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={handleCharacterDetailClose}
          />
          <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl animate-scale-in max-w-[95vw] sm:max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r ${selectedCharacter.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {selectedCharacter.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {selectedCharacter.name}
                    </h3>
                    <p className="text-base text-emerald-600 dark:text-emerald-400 font-medium">
                      {selectedCharacter.role}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-300"
                  onClick={handleCharacterDetailClose}
                  aria-label={getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="relative aspect-square rounded-xl overflow-hidden mb-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
                {imageError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-emerald-500/50 mb-2" />
                    <p className="text-center text-base text-emerald-500/70">
                      {getLocalizedText({ fr: 'Image non disponible', en: 'Image not available' })}
                    </p>
                  </div>
                ) : (
                  <img
                    src={selectedCharacter.imageUrl}
                    alt={selectedCharacter.name}
                    className="w-full h-full object-contain p-4"
                    onError={handleImageError}
                    loading="lazy"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <p className="text-base text-muted-foreground text-center">
                  {getLocalizedText(selectedCharacter.description)}
                </p>
                <div className="flex items-center justify-center gap-4 text-base text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span>{getLocalizedText({ fr: 'Créé par Salsabile', en: 'Created by Salsabile' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Optimized CSS */}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(15px);
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
            opacity: 0.8;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
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
        
        @keyframes content-fade {
          from {
            opacity: 0.8;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes content-appear {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        
        .animate-bounce {
          animation: bounce 1.2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s ease-out forwards;
        }
        
        .animate-content-fade {
          animation: content-fade 0.3s ease-out forwards;
        }
        
        .animate-content-appear {
          animation: content-appear 0.4s ease-out forwards;
        }
        
        /* Fix blurry sections */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease-out, 
                      transform 0.7s ease-out;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Image optimization */
        img {
          image-rendering: auto;
          image-rendering: crisp-edges;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Icon optimization */
        svg {
          shape-rendering: geometricPrecision;
          text-rendering: geometricPrecision;
        }
        
        /* Mobile performance */
        @media (max-width: 768px) {
          .scroll-reveal {
            transform: translateY(15px);
            transition-duration: 0.5s;
          }
          
          button {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Improve video embeds */
          .video-player {
            width: 100% !important;
            height: auto !important;
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal,
          .animate-fade-up,
          .animate-pulse-slow,
          .animate-float,
          .animate-spin-slow,
          .animate-bounce,
          .animate-fade-in,
          .animate-scale-in,
          .animate-content-fade,
          .animate-content-appear,
          .transition-all,
          .transition-transform {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* Hardware acceleration */
        .will-change-transform {
          will-change: transform;
        }
        
        /* Smooth transitions */
        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Better button sizing */
        button {
          touch-action: manipulation;
        }
        
        /* Improved modal */
        [data-state="open"] {
          z-index: 9999 !important;
        }
        
        /* Better focus styles */
        *:focus-visible {
          outline: 2px solid theme('colors.emerald.500');
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

// Enhanced No Results Component
const NoResults = memo(({ 
  icon, 
  title, 
  description,
  searchQuery = ""
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  searchQuery?: string;
}) => (
  <div className="text-center py-16 md:py-20 animate-fade-in">
    <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full flex items-center justify-center">
      <div className="text-emerald-600 dark:text-emerald-400">
        {icon}
      </div>
    </div>
    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
      {title}
    </h3>
    <p className="text-muted-foreground max-w-md mx-auto text-lg md:text-xl mb-4">
      {description}
    </p>
    {searchQuery && (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-base">
        <Search className="w-4 h-4" />
        <span>{searchQuery}</span>
      </div>
    )}
  </div>
));

NoResults.displayName = 'NoResults';

// Enhanced Video Card Component
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
  isHovered = false,
  showCharacterInfo = false,
  onCharacterInfoClick,
  viewMode = 'grid',
  isLoading = false
}: {
  video: Video;
  getLocalizedText: (text: { fr: string; en: string } | string) => string;
  getThumbnailUrl: (youtubeId: string, isShort?: boolean) => string;
  formatDate: (dateString?: string) => string;
  openInYouTube: (youtubeId: string) => void;
  handleVideoSelect: (video: Video) => void;
  handleThumbnailClick: (e: React.MouseEvent, video: Video) => void;
  language: string;
  isMobile: boolean;
  isHovered?: boolean;
  showCharacterInfo?: boolean;
  onCharacterInfoClick?: () => void;
  viewMode?: 'grid' | 'list';
  isLoading?: boolean;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const aspectClass = video.aspect === 'portrait' || video.isShort ? 'aspect-[9/16]' : 'aspect-video';
  
  if (viewMode === 'list' && !isMobile) {
    return (
      <Card className="group relative overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl border-border/40 hover:border-emerald-500/30 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Thumbnail */}
            <div className={`relative ${aspectClass} w-full md:w-64 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 flex-shrink-0`}>
              <div 
                className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
                onClick={(e) => handleThumbnailClick(e, video)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <img
                src={getThumbnailUrl(video.youtubeId, video.isShort)}
                alt={getLocalizedText(video.title)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } ${isHovered ? 'scale-110' : 'scale-100'}`}
                loading="lazy"
                decoding="async"
                onLoad={handleImageLoad}
              />
              
              {!imageLoaded && !isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10" />
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 z-30">
                {video.isShort ? (
                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 text-sm px-3 py-1">
                    <Zap className="w-4 h-4 mr-1" />
                    SHORT
                  </Badge>
                ) : (
                  video.category && (
                    <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 text-sm px-3 py-1">
                      {getLocalizedText(video.category)}
                    </Badge>
                  )
                )}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl md:text-2xl mb-2 md:mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {getLocalizedText(video.title)}
                    </h3>
                    <p className="text-base text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-500">
                      {getLocalizedText(video.description)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 px-4 text-base hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-500 hover:scale-110 active:scale-95"
                    onClick={() => handleVideoSelect(video)}
                    aria-label={language === 'fr' ? 'Regarder' : 'Watch'}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {language === 'fr' ? 'Regarder' : 'Watch'}
                  </Button>
                </div>
                
                {video.creator && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 group">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        {showCharacterInfo && onCharacterInfoClick && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onCharacterInfoClick();
                            }}
                            className="absolute -right-1 -top-1 h-6 w-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-1 rounded-full border-2 border-background transition-all duration-500 hover:scale-110 active:scale-95 shadow-md flex items-center justify-center"
                            aria-label={language === 'fr' ? 'Personnages' : 'Characters'}
                            title={language === 'fr' ? 'Personnages' : 'Characters'}
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div>
                        <span className="text-base font-medium">
                          {video.creator.name}
                        </span>
                        <p className="text-sm text-muted-foreground">{video.creator.role}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                    {video.publishDate && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(video.publishDate)}</span>
                      </span>
                    )}
                    {video.duration && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{video.duration}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid View
  return (
    <Card className="group relative h-full border-border/40 hover:border-emerald-500/30 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-0">
        <div className={`relative ${aspectClass} overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5`}>
          <img
            src={getThumbnailUrl(video.youtubeId, video.isShort)}
            alt={getLocalizedText(video.title)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
          />
          
          {!imageLoaded && !isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10" />
          )}
          
          <div 
            className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
            onClick={(e) => handleThumbnailClick(e, video)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-2 left-2 z-30">
            {video.isShort ? (
              <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 text-sm px-3 py-1">
                <Zap className="w-4 h-4 mr-1" />
                SHORT
              </Badge>
            ) : (
              video.category && (
                <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 text-sm px-3 py-1">
                  {getLocalizedText(video.category)}
                </Badge>
              )
            )}
          </div>

          {video.duration && (
            <div className="absolute bottom-2 right-2 z-30 bg-black/80 backdrop-blur-sm text-white text-sm px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
        </div>

        <div className="p-4 relative z-20">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500 flex-1">
                {getLocalizedText(video.title)}
              </h3>
            </div>
            
            {video.creator && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {showCharacterInfo && onCharacterInfoClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onCharacterInfoClick();
                        }}
                        className="absolute -right-1 -top-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-0.5 rounded-full border border-background shadow-sm flex items-center justify-center"
                        aria-label={language === 'fr' ? 'Personnages' : 'Characters'}
                        title={language === 'fr' ? 'Personnages' : 'Characters'}
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium">
                      {video.creator.name}
                    </span>
                    <p className="text-xs text-muted-foreground">{video.creator.role}</p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-500">
              {getLocalizedText(video.description)}
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {video.publishDate && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(video.publishDate)}</span>
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-500 hover:scale-110 active:scale-95"
                onClick={() => handleVideoSelect(video)}
                aria-label={language === 'fr' ? 'Regarder' : 'Watch'}
              >
                <Play className="w-4 h-4 mr-1" />
                {language === 'fr' ? 'Voir' : 'View'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EnhancedVideoCard.displayName = 'EnhancedVideoCard';
