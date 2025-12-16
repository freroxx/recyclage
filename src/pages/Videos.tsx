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
  ChevronRight,
  Filter,
  Grid,
  List
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastScrollY = useRef(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const revealElementsRef = useRef<NodeListOf<Element>>();
  
  // Initialize scroll reveal with enhanced settings
  useScrollReveal({
    threshold: 0.1,
    distance: '30px',
    easing: 'cubic-bezier(0.5, 0, 0.1, 1)',
    duration: 800
  });

  // Enhanced mobile detection with better touch support
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

  // Memoized characters data with enhanced descriptions
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

  // Enhanced videos data with tags and categories
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

  // FIXED: Get videos for current section - Always returns correct videos
  const getSectionVideos = useCallback((section: typeof activeSection): Video[] => {
    switch(section) {
      case 'tutorials':
        return videos.filter(v => v.type === 'tutorial');
      case 'community':
        return videos.filter(v => v.type === 'community');
      case 'channel':
        return videos.filter(v => v.type === 'channel');
      default:
        return [];
    }
  }, [videos]);

  // Enhanced search function with fuzzy matching and priority scoring
  const searchVideos = useCallback((
    videos: Video[], 
    query: string
  ): { results: Video[]; categories: Set<string>; tags: Set<string> } => {
    if (!query.trim()) {
      return { 
        results: videos, 
        categories: new Set(videos.map(v => v.category?.[language] || '').filter(Boolean)),
        tags: new Set(videos.flatMap(v => v.tags || []))
      };
    }
    
    const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 1);
    if (searchTerms.length === 0) {
      return { results: videos, categories: new Set(), tags: new Set() };
    }
    
    // Create a map for scoring
    const scoredVideos = videos.map(video => {
      let score = 0;
      const fields = [
        { text: video.title[language].toLowerCase(), weight: 10 },
        { text: video.description[language].toLowerCase(), weight: 5 },
        { text: video.category?.[language]?.toLowerCase() || '', weight: 8 },
        { text: video.creator?.name.toLowerCase() || '', weight: 6 },
        { text: video.creator?.role.toLowerCase() || '', weight: 4 },
        { text: video.type.toLowerCase(), weight: 3 },
        { text: (video.tags || []).join(' ').toLowerCase(), weight: 7 }
      ];
      
      searchTerms.forEach(term => {
        fields.forEach(({ text, weight }) => {
          if (text.includes(term)) {
            score += weight;
            // Bonus for exact match at start of word
            if (text.split(/\s+/).some(word => word.startsWith(term))) {
              score += weight * 0.5;
            }
          }
        });
      });
      
      return { video, score };
    }).filter(item => item.score > 0);
    
    // Sort by score and return
    const results = scoredVideos
      .sort((a, b) => b.score - a.score)
      .map(item => item.video);
    
    // Extract categories and tags from results
    const categories = new Set(
      results.map(v => v.category?.[language] || '').filter(Boolean)
    );
    const tags = new Set(
      results.flatMap(v => v.tags || [])
    );
    
    return { results, categories, tags };
  }, [language]);

  // Enhanced search with debounce and loading state
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    setIsSearching(true);
    setSearchLoading(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      const currentVideos = getSectionVideos(activeSection);
      const { results } = searchVideos(currentVideos, searchQuery);
      setSearchResults(results);
      setDebouncedSearchQuery(searchQuery);
      
      setIsSearching(false);
      setSearchLoading(false);
    }, 250);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeSection, getSectionVideos, searchVideos]);

  // Get current videos based on section and search
  const getCurrentVideos = useCallback((): Video[] => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return getSectionVideos(activeSection);
  }, [searchQuery, searchResults, activeSection, getSectionVideos]);

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
    
    // Force modal open
    requestAnimationFrame(() => {
      setIsModalOpen(true);
    });
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
      }, 3000);
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

  // Thumbnail URL helper
  const getThumbnailUrl = useCallback((youtubeId: string, isShort?: boolean) => {
    const quality = isShort ? 'hqdefault' : 'maxresdefault';
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  }, []);

  // Open in YouTube
  const openInYouTube = useCallback((youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  }, []);

  // Enhanced date formatting with fallback
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

  // Video selection handler with error boundary
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

  // Enhanced fullscreen toggle with better error handling
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

  // Controls visibility with enhanced timing
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isModalOpen) {
        setShowControls(false);
      }
    }, 3000);
  }, [isModalOpen]);

  // Modal close handler with cleanup
  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
    setIsModalOpen(false);
    setIsLoading(false);
    setVideoError(false);
    setErrorMessage("");
    setIsRotated(false);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
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
    }, 3000);
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
    searchInputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  }, [handleClearSearch]);

  // Keyboard shortcuts with enhanced handling
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

  // FIXED: Section change with smooth transition - Videos always appear
  const handleSectionChange = useCallback((section: typeof activeSection) => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    
    // Clear search when changing sections
    if (searchQuery.trim()) {
      handleClearSearch();
    }
    
    // Add a slight delay for smooth transition
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
      
      // Scroll to section on mobile
      if (isMobile && sectionRef.current) {
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 50);
      }
    }, 150);
  }, [activeSection, isMobile, searchQuery, handleClearSearch]);

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
    setErrorMessage(error || getLocalizedText({
      fr: "Impossible de charger la vidéo. Veuillez vérifier votre connexion internet.",
      en: "Unable to load video. Please check your internet connection."
    }));
  }, [getLocalizedText]);

  // Image error handler
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Character handlers - FIXED: Single close button
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
    }, 100);
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
    if (isMobile) {
      setIsRotated(prev => !prev);
    }
  }, [isMobile]);

  // Get modal style - FIXED: Proper centering for PC, fullscreen for mobile
  const getModalStyle = useCallback((): React.CSSProperties => {
    if (!selectedVideo) return {};
    
    const isPortrait = selectedVideo.aspect === 'portrait' || selectedVideo.isShort;
    
    if (isMobile) {
      // Mobile: Full screen
      return {
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        borderRadius: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed',
        transform: isRotated && !isPortrait ? 'rotate(90deg)' : 'none',
        transformOrigin: 'center center'
      };
    } else {
      // PC: Centered floating modal
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
          overflow: 'hidden'
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
          overflow: 'hidden'
        };
      }
    }
  }, [selectedVideo, isMobile, isRotated]);

  // Enhanced video hover handler
  const handleVideoHover = useCallback((videoId: string | null) => {
    setHoveredVideoId(videoId);
  }, []);

  // Render sections - FIXED: Always shows correct videos
  const renderVideoSection = useCallback(() => {
    const currentVideos = getCurrentVideos();
    const hasSearchQuery = searchQuery.trim().length > 0;
    
    const noResultsText = hasSearchQuery 
      ? getLocalizedText({ fr: 'Aucun résultat trouvé', en: 'No results found' })
      : getLocalizedText({ fr: 'Aucune vidéo disponible', en: 'No videos available' });
    
    const noResultsDescription = hasSearchQuery 
      ? getLocalizedText({ fr: 'Essayez avec d\'autres termes de recherche', en: 'Try different search terms' })
      : getLocalizedText({ fr: 'De nouvelles vidéos seront bientôt disponibles', en: 'New videos will be available soon' });

    if (currentVideos.length === 0) {
      return (
        <NoResults 
          icon={activeSection === 'tutorials' ? <Recycle className="w-12 h-12" /> :
                activeSection === 'community' ? <Users className="w-12 h-12" /> :
                <Youtube className="w-12 h-12" />}
          title={noResultsText}
          description={noResultsDescription}
          searchQuery={searchQuery}
        />
      );
    }

    return (
      <div 
        ref={sectionRef}
        className={`${viewMode === 'grid' 
          ? `grid ${isMobile ? 'grid-cols-1 gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'}`
          : 'flex flex-col gap-4 max-w-4xl mx-auto'
        }`}
      >
        {currentVideos.map((video, index) => (
          <div
            key={video.id}
            className="scroll-reveal"
            style={{ 
              animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
              transitionDelay: `${Math.min(index * 0.02, 0.2)}s`
            }}
            onMouseEnter={() => !isMobile && handleVideoHover(video.id)}
            onMouseLeave={() => !isMobile && handleVideoHover(null)}
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
            />
          </div>
        ))}
      </div>
    );
  }, [
    activeSection,
    getCurrentVideos,
    searchQuery,
    getLocalizedText,
    isMobile,
    viewMode,
    handleVideoHover,
    hoveredVideoId,
    getThumbnailUrl,
    formatDate,
    openInYouTube,
    handleVideoSelect,
    handleThumbnailClick,
    language,
    handleCharacterSelectionOpen
  ]);

  // Get section icon
  const getSectionIcon = useCallback((section: typeof activeSection) => {
    switch(section) {
      case 'tutorials': return <Recycle className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      case 'channel': return <Youtube className="w-4 h-4" />;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with animations */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center p-3 mb-6 animate-float-slow">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-green-500/30 to-teal-500/30 blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 p-5 rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-700 hover:scale-105 hover:-translate-y-1 group">
                  <Video className="w-10 h-10 text-emerald-600 dark:text-emerald-400 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-12 ease-out" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-up">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-gradient">
                {getLocalizedText({ fr: 'Vidéos Éducatives', en: 'Educational Videos' })}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {getLocalizedText({ 
                fr: 'Apprenez et inspirez-vous pour un avenir plus durable', 
                en: 'Learn and get inspired for a more sustainable future' 
              })}
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mb-10">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className={`w-5 h-5 transition-all duration-300 ${
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
                  className={`pl-12 ${
                    isMobile ? 'pr-12 py-4 text-sm' : 'pr-12 py-6 text-base'
                  } rounded-2xl border-2 border-border/50 bg-background/90 backdrop-blur-sm shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 focus:shadow-2xl focus:shadow-emerald-500/10 transition-all duration-500 hover:border-emerald-500/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30`}
                  aria-label={getLocalizedText({ fr: 'Rechercher des vidéos', en: 'Search videos' })}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {searchLoading && (
                    <div className="relative">
                      <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                    </div>
                  )}
                  {searchQuery && !searchLoading && (
                    <button
                      onClick={handleClearSearch}
                      className={`${
                        isMobile ? 'h-9 w-9' : 'h-10 w-10'
                      } text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center hover:rotate-90`}
                      aria-label={getLocalizedText({ fr: 'Effacer la recherche', en: 'Clear search' })}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search Stats */}
              {(searchQuery || debouncedSearchQuery) && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm animate-fade-in">
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full">
                    <Filter className="w-3.5 h-3.5" />
                    <span>{getCurrentVideos().length} {getLocalizedText({ fr: 'résultats', en: 'results' })}</span>
                  </div>
                  {searchQuery && !searchLoading && (
                    <div className="text-muted-foreground">
                      {getLocalizedText({ fr: 'Recherche : ', en: 'Search: ' })}
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        "{searchQuery}"
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                {(['tutorials', 'community', 'channel'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-500 flex items-center gap-3 transform hover:-translate-y-1 active:translate-y-0 ${
                      activeSection === section
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-glow'
                        : 'bg-background/50 border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={
                      section === 'tutorials' 
                        ? getLocalizedText({ fr: 'Voir les tutoriels', en: 'View tutorials' })
                        : section === 'community'
                        ? getLocalizedText({ fr: 'Voir les vidéos communautaires', en: 'View community videos' })
                        : getLocalizedText({ fr: 'Voir les vidéos de la chaîne', en: 'View channel videos' })
                    }
                  >
                    {getSectionIcon(section)}
                    {section === 'tutorials' ? getLocalizedText({ fr: 'Tutoriels', en: 'Tutorials' }) :
                     section === 'community' ? getLocalizedText({ fr: 'Communauté', en: 'Community' }) :
                     getLocalizedText({ fr: 'Chaîne', en: 'Channel' })}
                    <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-500 ${
                      activeSection === section 
                        ? 'bg-white/30 animate-pulse-slow' 
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 group-hover:bg-emerald-500/20 group-hover:scale-110'
                    }`}>
                      {getSectionVideos(section).length}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* View Mode Toggle */}
              {!isMobile && (
                <div className="flex items-center gap-2 bg-background/50 border border-border rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={getLocalizedText({ fr: 'Vue grille', en: 'Grid view' })}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label={getLocalizedText({ fr: 'Vue liste', en: 'List view' })}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Sections with enhanced transitions */}
          <div className={`transition-all duration-500 ease-out ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            {renderVideoSection()}
          </div>

          {/* YouTube Channel Link */}
          <div className="mt-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/20 p-6 md:p-8 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-green-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:via-green-500/5 group-hover:to-teal-500/5 transition-all duration-700" />
              
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-500">
                      <Youtube className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {getLocalizedText({ fr: 'Notre Chaîne YouTube', en: 'Our YouTube Channel' })}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4 md:mb-0 group-hover:text-foreground/80 transition-colors duration-500">
                    {getLocalizedText({ 
                      fr: 'Plus de contenu éducatif disponible sur notre chaîne', 
                      en: 'More educational content available on our channel' 
                    })}
                  </p>
                </div>
                
                <Button
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 px-8 group-hover:shadow-xl group-hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-500 group"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                  aria-label={getLocalizedText({ fr: 'Visiter notre chaîne YouTube', en: 'Visit our YouTube channel' })}
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-700 ease-out" />
                  {getLocalizedText({ fr: 'Visiter la chaîne', en: 'Visit the channel' })}
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
          className="fixed border-none bg-black shadow-2xl overflow-hidden p-0 transition-all duration-500 ease-out z-50"
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
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {getLocalizedText({ fr: 'Erreur de chargement', en: 'Loading Error' })}
                </h3>
                <p className="text-white/80 mb-6">
                  {errorMessage || getLocalizedText({ 
                    fr: 'Impossible de charger la vidéo. Veuillez réessayer.', 
                    en: 'Unable to load video. Please try again.' 
                  })}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleRetryVideo}
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    aria-label={getLocalizedText({ fr: 'Réessayer', en: 'Retry' })}
                  >
                    <RefreshCw className="w-4 h-4" />
                    {getLocalizedText({ fr: 'Réessayer', en: 'Retry' })}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleModalClose}
                    className="border-white/30 text-white hover:bg-white/10"
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
              className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/85 to-transparent p-4 transition-all duration-500 ease-out ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      isMobile ? 'h-10 w-10' : 'h-9 w-9'
                    } bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500 hover:rotate-90`}
                    onClick={handleModalClose}
                    aria-label={getLocalizedText({ fr: 'Fermer la vidéo', en: 'Close video' })}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  {selectedVideo && (
                    <div className="ml-1 max-w-[calc(100%-180px)]">
                      <h3 className="text-sm font-semibold text-white/95 truncate animate-fade-in">
                        {getLocalizedText(selectedVideo.title)}
                      </h3>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Hide UI Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      isMobile ? 'h-10 w-10' : 'h-9 w-9'
                    } bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500`}
                    onClick={toggleInterface}
                    title={getLocalizedText({ fr: 'Masquer l\'interface', en: 'Hide interface' })}
                    aria-label={getLocalizedText({ fr: 'Masquer l\'interface', en: 'Hide interface' })}
                  >
                    {showInterface ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {/* Rotate Button for mobile landscape videos */}
                  {isMobile && selectedVideo?.aspect === 'landscape' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500"
                      onClick={toggleRotation}
                      title={getLocalizedText({ fr: 'Tourner l\'écran', en: 'Rotate screen' })}
                      aria-label={getLocalizedText({ fr: 'Tourner l\'écran', en: 'Rotate screen' })}
                    >
                      <RotateCw className={`w-4 h-4 transition-transform duration-500 ${isRotated ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      isMobile ? 'h-10 w-10' : 'h-9 w-9'
                    } bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500`}
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    title={getLocalizedText({ fr: 'Ouvrir sur YouTube', en: 'Open on YouTube' })}
                    aria-label={getLocalizedText({ fr: 'Ouvrir sur YouTube', en: 'Open on YouTube' })}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`${
                      isMobile ? 'h-10 w-10' : 'h-9 w-9'
                    } bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500`}
                    onClick={toggleFullscreen}
                    title={getLocalizedText({ fr: 'Plein écran', en: 'Fullscreen' })}
                    aria-label={getLocalizedText({ fr: 'Plein écran', en: 'Fullscreen' })}
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
                  onError={() => handleVideoError()}
                  onPlay={handleVideoLoad}
                />
              </div>
            )}
            
            {/* Floating Controls */}
            {!showInterface && showControls && !videoError && (
              <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 animate-fade-in">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isMobile ? 'h-12 w-12' : 'h-10 w-10'
                  } bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500`}
                  onClick={toggleInterface}
                  title={getLocalizedText({ fr: 'Afficher l\'interface', en: 'Show interface' })}
                  aria-label={getLocalizedText({ fr: 'Afficher l\'interface', en: 'Show interface' })}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                
                {/* Floating Rotate Button for mobile */}
                {isMobile && selectedVideo?.aspect === 'landscape' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500"
                    onClick={toggleRotation}
                    title={getLocalizedText({ fr: 'Tourner l\'écran', en: 'Rotate screen' })}
                    aria-label={getLocalizedText({ fr: 'Tourner l\'écran', en: 'Rotate screen' })}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isMobile ? 'h-12 w-12' : 'h-10 w-10'
                  } bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500`}
                  onClick={toggleMute}
                  title={
                    isMuted 
                      ? getLocalizedText({ fr: 'Activer le son', en: 'Unmute' })
                      : getLocalizedText({ fr: 'Désactiver le son', en: 'Mute' })
                  }
                  aria-label={
                    isMuted 
                      ? getLocalizedText({ fr: 'Activer le son', en: 'Unmute' })
                      : getLocalizedText({ fr: 'Désactiver le son', en: 'Mute' })
                  }
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
              className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 via-black/85 to-transparent p-4 transition-all duration-500 ease-out ${
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
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(selectedVideo.publishDate)}</span>
                        </span>
                      )}
                      {selectedVideo.duration && (
                        <span className="flex items-center gap-1.5 hover:text-white transition-colors duration-300">
                          <Clock className="w-4 h-4" />
                          <span>{selectedVideo.duration}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 hover:border-emerald-500/50 active:scale-95 transition-all duration-500"
                        onClick={toggleMute}
                        title={
                          isMuted 
                            ? getLocalizedText({ fr: 'Activer le son', en: 'Unmute' })
                            : getLocalizedText({ fr: 'Désactiver le son', en: 'Mute' })
                        }
                        aria-label={
                          isMuted 
                            ? getLocalizedText({ fr: 'Activer le son', en: 'Unmute' })
                            : getLocalizedText({ fr: 'Désactiver le son', en: 'Mute' })
                        }
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

      {/* Character Selection Dialog - FIXED: Single close button */}
      <Dialog open={showCharacterSelection} onOpenChange={handleCharacterSelectionClose}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-md p-0 border-0 overflow-hidden bg-transparent"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
          }}
        >
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl animate-scale-in">
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
                {/* Only one close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-300"
                  onClick={handleCharacterSelectionClose}
                  aria-label={getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterSelect(character)}
                    className="group relative flex flex-col items-center p-4 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl active:scale-95 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-800/50 border border-emerald-500/10 hover:border-emerald-500/30"
                  >
                    <div className="relative mb-3">
                      <div className={`absolute inset-0 bg-gradient-to-r ${character.color} rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                      <div className="relative w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden group-hover:border-emerald-500/30 transition-all duration-500">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={handleImageError}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {character.name}
                    </h4>
                    <p className="text-xs text-muted-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {character.role}
                    </p>
                    <ChevronRight className="absolute top-2 right-2 w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Character Detail Dialog - FIXED: Single close button */}
      {showCharacterDetail && selectedCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={handleCharacterDetailClose}
          />
          <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl animate-scale-in max-w-[95vw] sm:max-w-md w-full">
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
                {/* Only one close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-300"
                  onClick={handleCharacterDetailClose}
                  aria-label={getLocalizedText({ fr: 'Fermer', en: 'Close' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="relative aspect-square rounded-xl overflow-hidden mb-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5 group">
                {imageError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <AlertCircle className="w-16 h-16 text-emerald-500/50 mb-2" />
                    <p className="text-center text-sm text-emerald-500/70">
                      {getLocalizedText({ fr: 'Image non disponible', en: 'Image not available' })}
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
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  {getLocalizedText(selectedCharacter.description)}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>{getLocalizedText({ fr: 'Créé par Salsabile', en: 'Created by Salsabile' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Animations CSS */}
      <style>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
            transform: translateY(-15px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
          }
          50% {
            box-shadow: 0 0 50px rgba(16, 185, 129, 0.6);
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
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-bounce {
          animation: bounce 1.5s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-gradient {
          animation: gradient 6s ease infinite;
          background-size: 200% 200%;
        }
        
        /* Enhanced hover effects */
        .hover-lift {
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.2);
        }
        
        .hover-glow {
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-glow:hover {
          box-shadow: 0 25px 50px rgba(16, 185, 129, 0.25);
        }
        
        /* Enhanced scroll reveal */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.6s ease;
          filter: blur(2px);
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced touch targets for mobile */
        @media (max-width: 768px) {
          button, 
          [role="button"],
          .touch-target {
            min-height: 48px;
            min-width: 48px;
          }
          
          .scroll-reveal {
            transform: translateY(20px);
            transition-duration: 0.8s;
          }
        }
        
        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .scroll-reveal,
          .animate-fade-up,
          .animate-pulse-slow,
          .animate-float-slow,
          .animate-spin-slow,
          .animate-bounce,
          .animate-glow,
          .animate-fade-in,
          .animate-scale-in,
          .animate-slide-up,
          .animate-gradient,
          .transition-all,
          .transition-transform,
          .transition-colors,
          .hover-lift,
          .hover-glow {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }
        
        /* Performance optimizations */
        .will-change-transform {
          will-change: transform;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        /* Enhanced video card animations */
        .video-card-hover {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .video-card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
        }
        
        /* Smooth transitions for modals */
        .modal-transition {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
  <div className="text-center py-16 md:py-24 animate-fade-in">
    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full flex items-center justify-center group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-700"></div>
        <div className="relative text-emerald-600 dark:text-emerald-400">
          {icon}
        </div>
      </div>
    </div>
    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
      {title}
    </h3>
    <p className="text-muted-foreground max-w-md mx-auto text-lg mb-6">
      {description}
    </p>
    {searchQuery && (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
        <Search className="w-4 h-4" />
        <span>{searchQuery}</span>
      </div>
    )}
  </div>
));

NoResults.displayName = 'NoResults';

// Enhanced Video Card Component with better animations
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
  viewMode = 'grid'
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
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsHovering(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setIsHovering(false);
  }, [isMobile]);

  const aspectClass = video.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video';
  
  if (viewMode === 'list') {
    return (
      <Card className="group relative overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-700 hover-lift border-border/40 hover:border-emerald-500/50">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            <div className={`relative ${aspectClass} w-full md:w-64 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 flex-shrink-0`}>
              <div 
                className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 cursor-pointer"
                onClick={(e) => handleThumbnailClick(e, video)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-emerald-500/60">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner shadow-black/20 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 text-emerald-600 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <img
                src={getThumbnailUrl(video.youtubeId, video.isShort)}
                alt={getLocalizedText(video.title)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } ${isHovered ? 'scale-105 brightness-110' : 'scale-100'}`}
                loading="lazy"
                decoding="async"
                onLoad={handleImageLoad}
              />
              
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 animate-pulse-slow" />
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 z-30">
                {video.isShort ? (
                  <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 text-xs px-2.5 py-1 animate-pulse-slow">
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
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                      {getLocalizedText(video.title)}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-500">
                      {getLocalizedText(video.description)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-4 text-sm hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-500 hover:scale-105 active:scale-95 group"
                    onClick={() => handleVideoSelect(video)}
                    aria-label={language === 'fr' ? 'Regarder la vidéo' : 'Watch video'}
                  >
                    <Play className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform duration-500" />
                    {language === 'fr' ? 'Regarder' : 'Watch'}
                  </Button>
                </div>
                
                {video.creator && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 group">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-500 group-hover:scale-110">
                          <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        {showCharacterInfo && onCharacterInfoClick && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onCharacterInfoClick();
                            }}
                            className="absolute -right-1 -top-1 h-6 w-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-0.5 rounded-full border-2 border-background transition-all duration-500 hover:scale-125 active:scale-95 shadow-lg flex items-center justify-center"
                            aria-label={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                            title={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
                          {video.creator.name}
                        </span>
                        <p className="text-xs text-muted-foreground">{video.creator.role}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500">
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
    <Card 
      className="group relative h-full border-border/40 hover:border-emerald-500/50 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-700 video-card-hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <CardContent className="p-0">
        <div className={`relative ${aspectClass} overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5`}>
          <img
            src={getThumbnailUrl(video.youtubeId, video.isShort)}
            alt={getLocalizedText(video.title)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${isHovering ? 'scale-110 brightness-110' : 'scale-100'}`}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 animate-pulse-slow" />
          )}
          
          <div 
            className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 cursor-pointer"
            onClick={(e) => handleThumbnailClick(e, video)}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-700 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-emerald-500/60">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner shadow-black/20 group-hover:scale-110 transition-transform duration-500">
                    <Play className="w-6 h-6 text-emerald-600 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-3 left-3 z-30">
            {video.isShort ? (
              <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 text-xs px-2.5 py-1 animate-pulse-slow">
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
            <div className="absolute bottom-3 right-3 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-md">
              {video.duration}
            </div>
          )}
        </div>

        <div className="p-5 relative z-20">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500 flex-1">
                {getLocalizedText(video.title)}
              </h3>
            </div>
            
            {video.creator && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 group">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-500 group-hover:scale-110">
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {showCharacterInfo && onCharacterInfoClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onCharacterInfoClick();
                        }}
                        className="absolute -right-1 -top-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white p-0.5 rounded-full border-2 border-background transition-all duration-500 hover:scale-125 active:scale-95 shadow-lg flex items-center justify-center"
                        aria-label={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                        title={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-500">
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
            
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500">
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
                className="h-7 px-3 text-xs hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-500 hover:scale-110 active:scale-95 group"
                onClick={() => handleVideoSelect(video)}
                aria-label={language === 'fr' ? 'Regarder la vidéo' : 'Watch video'}
              >
                <Play className="w-3 h-3 mr-1.5 group-hover:scale-125 transition-transform duration-500" />
                {language === 'fr' ? 'Regarder' : 'Watch'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EnhancedVideoCard.displayName = 'EnhancedVideoCard';
