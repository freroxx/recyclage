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
  Info,
  AlertCircle,
  RefreshCw,
  Heart,
  RotateCw,
  ChevronRight,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  Loader2,
  Share2,
  Bookmark,
  Download
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
  description?: { fr: string; en: string };
}

interface VideoCardProps {
  video: Video;
  getLocalizedText: (text: { fr: string; en: string } | string) => string;
  getThumbnailUrl: (youtubeId: string, isShort?: boolean) => string;
  formatDate: (dateString: string) => string;
  onVideoSelect: (video: Video) => void;
  onCharacterInfoClick?: () => void;
  onThumbnailClick: (e: React.MouseEvent, video: Video) => void;
  language: string;
  showCharacterInfo?: boolean;
  isExpanded?: boolean;
  onToggleDescription?: () => void;
  imageError?: boolean;
  onImageError?: () => void;
}

export default function Videos() {
  const { language } = useLanguage();
  
  // Core states
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeSection, setActiveSection] = useState<'tutorials' | 'community' | 'channel'>('tutorials');
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showInterface, setShowInterface] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Character states
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const [showCharacterDetail, setShowCharacterDetail] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  
  // UI states
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useScrollReveal();

  // Character data
  const characters: Character[] = useMemo(() => [
    {
      id: "meow",
      name: "Meow",
      imageUrl: "https://i.ibb.co/d06DQqBR/Meow-png.jpg",
      role: language === 'fr' ? "Mascotte" : "Mascot",
      color: "from-blue-500 to-cyan-500",
      description: {
        fr: "La mascotte amicale qui guide à travers les aventures écologiques",
        en: "The friendly mascot who guides through ecological adventures"
      }
    },
    {
      id: "basma",
      name: "Basma",
      imageUrl: "https://i.ibb.co/4npFCFPd/Basma-png.jpg",
      role: language === 'fr' ? "Artiste Écologique" : "Ecological Artist",
      color: "from-emerald-500 to-green-500",
      description: {
        fr: "Artiste passionnée qui transforme les déchets en œuvres d'art",
        en: "Passionate artist who transforms waste into works of art"
      }
    },
    {
      id: "cat",
      name: "Cat",
      imageUrl: "https://i.ibb.co/Kzp4Rg9s/CAT-png.jpg",
      role: language === 'fr' ? "Super-héros Écologique" : "Ecological Superhero",
      color: "from-purple-500 to-pink-500",
      description: {
        fr: "Super-héros qui protège l'environnement et enseigne le recyclage",
        en: "Superhero who protects the environment and teaches recycling"
      }
    }
  ], [language]);

  // Videos data - REMOVED THE "CHANNEL HIGHLIGHTS" VIDEO
  const videos: Video[] = useMemo(() => [
    // Channel Videos
    {
      id: "channel-showcase",
      title: {
        fr: "Présentation du Site Web",
        en: "Website Showcase"
      },
      description: {
        fr: "Présentation complète de notre site web et de ses fonctionnalités écologiques",
        en: "Complete overview of our website and its ecological features"
      },
      youtubeId: "v_EyngbVFb8",
      duration: "1:28",
      publishDate: "2025-12-09",
      category: { fr: "Chaîne", en: "Channel" },
      type: "channel",
      aspect: "landscape",
      creator: { name: "Yahia", role: language === 'fr' ? "Développeur Principal" : "Lead Developer" },
      tags: ["showcase", "website", "présentation"]
    },
    
    // Community Shorts
    {
      id: "reuse-cat-4",
      title: {
        fr: "Réutiliser avec Cat - Épisode 4",
        en: "Reuse with Cat - Episode 4"
      },
      description: {
        fr: "Découvrez comment réutiliser les objets du quotidien avec Cat. Créé par Salsabile",
        en: "Discover how to reuse everyday objects with Cat. Made by Salsabile"
      },
      youtubeId: "aEnA1z-G7qE",
      duration: "0:57",
      publishDate: "2025-12-11",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste & Créatrice" : "Artist & Creator" },
      isShort: true,
      tags: ["reuse", "cat", "salsabile", "short"]
    },
    {
      id: "laundry-cat",
      title: {
        fr: "Chat et Lessive Écologique",
        en: "Laundry Cat"
      },
      description: {
        fr: "Apprenez des astuces écologiques pour votre lessive avec Cat. Créé par Salsabile",
        en: "Learn ecological tips for your laundry with Cat. Made by Salsabile"
      },
      youtubeId: "c7akmKesIq4",
      duration: "0:45",
      publishDate: "2025-12-10",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste & Créatrice" : "Artist & Creator" },
      isShort: true,
      tags: ["laundry", "eco-friendly", "salsabile", "short"]
    },
    {
      id: "bottles-episode-2",
      title: {
        fr: "Ne jetez pas vos bouteilles - Épisode 2",
        en: "Don't throw your bottles - Episode 2"
      },
      description: {
        fr: "Transformez vos bouteilles en plastique en objets utiles. Créé par Salsabile",
        en: "Transform your plastic bottles into useful objects. Made by Salsabile"
      },
      youtubeId: "TeS8QfpPHic",
      duration: "0:53",
      publishDate: "2025-12-08",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste & Créatrice" : "Artist & Creator" },
      isShort: true,
      tags: ["bottles", "recycling", "salsabile", "short"]
    },
    {
      id: "cleaner-future-trailer",
      title: {
        fr: "Un Avenir Plus Propre avec Chat - Bande-annonce",
        en: "Cleaner Future with Cat - Trailer"
      },
      description: {
        fr: "Bande-annonce de notre série sur un avenir durable. Créé par Salsabile",
        en: "Trailer for our series on a sustainable future. Created by Salsabile"
      },
      youtubeId: "CtcgvPj1vGk",
      duration: "0:36",
      publishDate: "2025-12-06",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste & Créatrice" : "Artist & Creator" },
      isShort: true,
      tags: ["trailer", "future", "salsabile", "short"]
    },
    {
      id: "crafting-recycling-ep1",
      title: {
        fr: "Artisanat et Recyclage - Épisode 1",
        en: "Crafting and Recycling - Episode 1"
      },
      description: {
        fr: "Premier épisode de notre série sur l'artisanat écologique. Créé par Salsabile",
        en: "First episode of our series on ecological crafting. Created by Salsabile"
      },
      youtubeId: "g8MBdRd99LU",
      duration: "1:12",
      publishDate: "2025-12-07",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      creator: { name: "Salsabile", role: language === 'fr' ? "Artiste & Créatrice" : "Artist & Creator" },
      isShort: true,
      tags: ["crafting", "recycling", "salsabile", "short"]
    },
    
    // Tutorial Videos
    {
      id: "recycling-introduction",
      title: {
        fr: "Introduction au Recyclage",
        en: "Recycling Introduction"
      },
      description: {
        fr: "Découvrez les bases du recyclage et son importance cruciale pour la protection de notre environnement. Ce tutoriel couvre les fondamentaux des différents types de recyclage.",
        en: "Discover the basics of recycling and its crucial importance for protecting our environment. This tutorial covers the fundamentals of different types of recycling."
      },
      youtubeId: "c5sPRL0YKUw",
      duration: "7:03",
      publishDate: "2024-01-15",
      category: { fr: "Éducation", en: "Education" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["recycling", "introduction", "education", "tutorial"]
    },
    {
      id: "paper-cardboard-recycling",
      title: {
        fr: "Recyclage du Papier et Carton",
        en: "Paper and Cardboard Recycling"
      },
      description: {
        fr: "Processus complet du recyclage du papier et du carton, de la collecte à la transformation en nouveaux produits. Apprenez comment trier correctement vos déchets papier.",
        en: "Complete process of paper and cardboard recycling, from collection to transformation into new products. Learn how to properly sort your paper waste."
      },
      youtubeId: "s003IbGz-rA",
      duration: "3:01",
      publishDate: "2024-02-10",
      category: { fr: "Processus", en: "Process" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["paper", "cardboard", "recycling", "process"]
    },
    {
      id: "sorting-journey",
      title: {
        fr: "Voyage au cœur du tri",
        en: "Journey to the Heart of Sorting"
      },
      description: {
        fr: "Parcours fascinant des déchets recyclables depuis le tri jusqu'à la transformation. Découvrez les centres de tri modernes et leur fonctionnement.",
        en: "Fascinating journey of recyclable waste from sorting to transformation. Discover modern sorting centers and their operation."
      },
      youtubeId: "p67EWIamCIw",
      duration: "5:33",
      publishDate: "2024-03-05",
      category: { fr: "Documentaire", en: "Documentary" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["sorting", "journey", "documentary", "waste"]
    },
    {
      id: "plastic-recycling",
      title: {
        fr: "Recyclage du Plastique",
        en: "Plastic Recycling"
      },
      description: {
        fr: "Comprenez le recyclage des différents types de plastique et leur impact sur l'environnement. Apprenez à identifier les codes de recyclage.",
        en: "Understand the recycling of different types of plastic and their environmental impact. Learn to identify recycling codes."
      },
      youtubeId: "dQw4w9WgXcQ",
      duration: "4:15",
      publishDate: "2024-04-20",
      category: { fr: "Éducation", en: "Education" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["plastic", "recycling", "environment", "education"]
    },
    {
      id: "home-composting",
      title: {
        fr: "Compostage à la maison",
        en: "Composting at Home"
      },
      description: {
        fr: "Guide complet pour commencer le compostage domestique. Réduisez vos déchets organiques et créez un engrais naturel pour votre jardin.",
        en: "Complete guide to start home composting. Reduce your organic waste and create natural fertilizer for your garden."
      },
      youtubeId: "eBGIQ7ZuuiU",
      duration: "6:45",
      publishDate: "2024-05-12",
      category: { fr: "Guide Pratique", en: "Practical Guide" },
      type: "tutorial",
      aspect: "landscape",
      tags: ["composting", "home", "gardening", "organic"]
    }
  ], [language]);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    const handleResize = () => requestAnimationFrame(checkMobile);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    const sectionVideos = videos.filter(v => v.type === activeSection);
    
    if (!debouncedSearchQuery.trim()) return sectionVideos;
    
    const searchTerms = debouncedSearchQuery.toLowerCase().trim().split(/\s+/);
    
    return sectionVideos.filter(video => {
      const searchableText = [
        video.title[language].toLowerCase(),
        video.description[language].toLowerCase(),
        video.category?.[language].toLowerCase() || '',
        video.creator?.name.toLowerCase() || '',
        video.creator?.role.toLowerCase() || '',
        ...(video.tags || []).map(tag => tag.toLowerCase())
      ].join(' ');
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [videos, activeSection, debouncedSearchQuery, language]);

  // Utility functions
  const getLocalizedText = useCallback((text: { fr: string; en: string } | string) => {
    if (typeof text === 'string') return text;
    return text[language];
  }, [language]);

  const getThumbnailUrl = useCallback((youtubeId: string, isShort?: boolean) => {
    const quality = isShort ? 'hqdefault' : 'maxresdefault';
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [language]);

  // Video selection
  const handleVideoSelect = useCallback((video: Video) => {
    setIsLoading(true);
    setSelectedVideo(video);
    setIsModalOpen(true);
    setVideoError(false);
    setErrorMessage("");
    setIsRotated(false);
    setShowInterface(true);
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  const handleThumbnailClick = useCallback((e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    handleVideoSelect(video);
  }, [handleVideoSelect]);

  // Modal controls
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

  const toggleFullscreen = useCallback(() => {
    const modal = modalRef.current;
    
    if (!document.fullscreenElement) {
      modal?.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleInterface = useCallback(() => {
    setShowInterface(prev => !prev);
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  }, []);

  const toggleRotation = useCallback(() => {
    setIsRotated(prev => !prev);
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

  // Section change
  const handleSectionChange = useCallback((section: 'tutorials' | 'community' | 'channel') => {
    if (section === activeSection) return;
    
    setIsTransitioning(true);
    setActiveSection(section);
    
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [activeSection]);

  // Character handlers
  const handleCharacterSelectionOpen = useCallback(() => {
    setShowCharacterSelection(true);
    setSelectedCharacter(null);
  }, []);

  const handleCharacterSelectionClose = useCallback(() => {
    setShowCharacterSelection(false);
  }, []);

  const handleCharacterSelect = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setShowCharacterSelection(false);
    setTimeout(() => setShowCharacterDetail(true), 150);
  }, []);

  const handleCharacterDetailClose = useCallback(() => {
    setShowCharacterDetail(false);
    setTimeout(() => setSelectedCharacter(null), 300);
  }, []);

  // Video events
  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
    setVideoError(false);
  }, []);

  const handleVideoError = useCallback((error?: string) => {
    setIsLoading(false);
    setVideoError(true);
    setErrorMessage(error || (language === 'fr' 
      ? 'Impossible de charger la vidéo' 
      : 'Unable to load video'
    ));
  }, [language]);

  const handleRetryVideo = useCallback(() => {
    if (selectedVideo) {
      setVideoError(false);
      setErrorMessage("");
      setIsLoading(true);
    }
  }, [selectedVideo]);

  const handleImageError = useCallback((imageId: string) => {
    setImageErrors(prev => ({ ...prev, [imageId]: true }));
  }, []);

  // Toggle description expansion
  const toggleDescription = useCallback((videoId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  }, []);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  // Get modal style
  const getModalStyle = useCallback((): React.CSSProperties => {
    if (!selectedVideo) return {};
    
    const isPortrait = selectedVideo.aspect === 'portrait';
    const isShort = selectedVideo.isShort;
    
    if (isMobile) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: isPortrait || isShort ? 
          'translate(-50%, -50%)' : 
          `translate(-50%, -50%) ${isRotated ? 'rotate(90deg)' : ''}`,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        margin: 0,
        zIndex: 50,
      };
    } else {
      if (isPortrait || isShort) {
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(400px, 90vw)',
          height: 'min(710px, 90vh)',
          borderRadius: '24px',
          margin: 0,
          zIndex: 50,
        };
      } else {
        return {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1200px, 90vw)',
          height: 'min(675px, 90vh)',
          borderRadius: '24px',
          margin: 0,
          zIndex: 50,
        };
      }
    }
  }, [selectedVideo, isMobile, isRotated]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch(e.key) {
        case 'Escape':
          if (!showCharacterSelection && !showCharacterDetail) {
            handleModalClose();
          }
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
          if (e.target === document.body) {
            e.preventDefault();
            toggleMute();
          }
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
  }, [isModalOpen, handleModalClose, toggleFullscreen, toggleMute, toggleInterface, showCharacterSelection, showCharacterDetail]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Open in YouTube
  const openInYouTube = useCallback((youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  }, []);

  // Get aspect ratio for player
  const getAspectRatio = useCallback((video: Video): '16:9' | '9:16' => {
    return video.aspect === 'portrait' ? '9:16' : '16:9';
  }, []);

  // Render video cards based on view mode
  const renderVideoCards = () => {
    if (filteredVideos.length === 0) {
      const noResultsText = debouncedSearchQuery 
        ? (language === 'fr' ? 'Aucun résultat trouvé' : 'No results found')
        : (language === 'fr' ? 'Aucune vidéo disponible' : 'No videos available');
      
      const noResultsDescription = debouncedSearchQuery 
        ? (language === 'fr' ? 'Essayez avec d\'autres termes' : 'Try different search terms')
        : (language === 'fr' ? 'Revenez plus tard !' : 'Check back later!');

      const icon = activeSection === 'tutorials' ? <Video className="w-12 h-12" /> :
                   activeSection === 'community' ? <Users className="w-12 h-12" /> :
                   <Youtube className="w-12 h-12" />;
      
      return (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500/10 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-foreground">
            {noResultsText}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            {noResultsDescription}
          </p>
        </div>
      );
    }

    if (viewMode === 'grid') {
      return (
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              getLocalizedText={getLocalizedText}
              getThumbnailUrl={getThumbnailUrl}
              formatDate={formatDate}
              onVideoSelect={handleVideoSelect}
              onCharacterInfoClick={handleCharacterSelectionOpen}
              onThumbnailClick={handleThumbnailClick}
              language={language}
              showCharacterInfo={video.creator?.name === "Salsabile"}
              isExpanded={expandedDescriptions[video.id]}
              onToggleDescription={() => toggleDescription(video.id)}
              imageError={imageErrors[video.youtubeId]}
              onImageError={() => handleImageError(video.youtubeId)}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredVideos.map((video) => (
            <ListViewVideoCard
              key={video.id}
              video={video}
              getLocalizedText={getLocalizedText}
              getThumbnailUrl={getThumbnailUrl}
              formatDate={formatDate}
              onVideoSelect={handleVideoSelect}
              onCharacterInfoClick={handleCharacterSelectionOpen}
              language={language}
              showCharacterInfo={video.creator?.name === "Salsabile"}
              isExpanded={expandedDescriptions[video.id]}
              onToggleDescription={() => toggleDescription(video.id)}
              imageError={imageErrors[video.youtubeId]}
              onImageError={() => handleImageError(video.youtubeId)}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center p-3 mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-green-500/30 blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 p-3 sm:p-4 rounded-2xl shadow-lg shadow-emerald-500/10 transition-all duration-500 group">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                {language === 'fr' ? 'Vidéos Éducatives' : 'Educational Videos'}
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Apprenez et inspirez-vous pour un avenir plus durable' 
                : 'Learn and get inspired for a more sustainable future'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-2xl w-full">
                <div className="relative flex items-center group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder={language === 'fr' ? 'Rechercher des vidéos...' : 'Search videos...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-12 pr-10 py-4 sm:py-6 text-base rounded-xl border-border/50 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {debouncedSearchQuery && (
                  <div className="mt-2 text-center text-sm text-emerald-600 dark:text-emerald-400">
                    {filteredVideos.length} {language === 'fr' ? 'résultats' : 'results'}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleViewMode}
                  className="p-2 rounded-lg border border-border hover:border-emerald-500/30 transition-colors"
                  title={viewMode === 'grid' ? (language === 'fr' ? 'Mode liste' : 'List view') : (language === 'fr' ? 'Mode grille' : 'Grid view')}
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
              {(['tutorials', 'community', 'channel'] as const).map((section) => (
                <button
                  key={section}
                  onClick={() => handleSectionChange(section)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 sm:gap-3 ${
                    activeSection === section
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground'
                  }`}
                >
                  {section === 'tutorials' ? <Recycle className="w-4 h-4" /> :
                   section === 'community' ? <Users className="w-4 h-4" /> :
                   <Youtube className="w-4 h-4" />}
                  {section === 'tutorials' ? (language === 'fr' ? 'Tutoriels' : 'Tutorials') :
                   section === 'community' ? (language === 'fr' ? 'Communauté' : 'Community') :
                   (language === 'fr' ? 'Chaîne' : 'Channel')}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeSection === section ? 'bg-white/30' : 'bg-emerald-500/10'
                  }`}>
                    {filteredVideos.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {renderVideoCards()}
          </div>

          {/* YouTube Channel Link */}
          <div className="mt-12 sm:mt-16">
            <div className="bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold">
                      {language === 'fr' ? 'Notre Chaîne YouTube' : 'Our YouTube Channel'}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {language === 'fr' 
                      ? 'Plus de contenu éducatif disponible' 
                      : 'More educational content available'}
                  </p>
                </div>
                
                <Button
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  {language === 'fr' ? 'Visiter la chaîne' : 'Visit channel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <>
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 animate-fade-in"
            onClick={handleModalClose}
          />
          
          <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
            <DialogContent 
              ref={modalRef}
              className="fixed border-none bg-black shadow-2xl overflow-hidden p-0 z-50"
              style={getModalStyle()}
              onMouseMove={handleMouseMove}
              onTouchMove={handleMouseMove}
              onTouchStart={() => setShowControls(true)}
            >
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-50">
                  <div className="relative">
                    <div className="w-16 h-16 border-3 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-8 h-8 text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error Overlay */}
              {videoError && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-50">
                  <div className="text-center p-6 max-w-sm">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {language === 'fr' ? 'Erreur de chargement' : 'Loading Error'}
                    </h3>
                    <p className="text-white/80 mb-6">{errorMessage}</p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={handleRetryVideo}
                        className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500"
                      >
                        <RefreshCw className="w-4 h-4" />
                        {language === 'fr' ? 'Réessayer' : 'Retry'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleModalClose}
                        className="border-white/30 text-white"
                      >
                        {language === 'fr' ? 'Fermer' : 'Close'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Top Controls */}
              {showInterface && !videoError && (
                <div 
                  className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 to-transparent p-4 transition-all duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-black/60 text-white hover:bg-black/80"
                        onClick={handleModalClose}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <h3 className="text-sm font-semibold text-white/95 truncate max-w-[200px] sm:max-w-md">
                        {getLocalizedText(selectedVideo.title)}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isMobile && selectedVideo.aspect === 'landscape' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 bg-black/60 text-white hover:bg-black/80"
                          onClick={toggleRotation}
                        >
                          <RotateCw className={`w-4 h-4 ${isRotated ? 'rotate-180' : ''}`} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-black/60 text-white hover:bg-black/80"
                        onClick={toggleInterface}
                      >
                        {showInterface ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-black/60 text-white hover:bg-black/80"
                        onClick={() => openInYouTube(selectedVideo.youtubeId)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 bg-black/60 text-white hover:bg-black/80"
                        onClick={toggleFullscreen}
                      >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Player */}
              <div className="relative w-full h-full bg-black">
                {!videoError && (
                  <div className="w-full h-full">
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
                    />
                  </div>
                )}
                
                {/* Floating Controls */}
                {!showInterface && showControls && !videoError && (
                  <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-black/60 text-white hover:bg-black/80"
                      onClick={toggleInterface}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 bg-black/60 text-white hover:bg-black/80"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>

              {/* Bottom Controls */}
              {showInterface && !videoError && (
                <div 
                  className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/95 to-transparent p-4 transition-all duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-base font-semibold text-white line-clamp-1">
                        {getLocalizedText(selectedVideo.title)}
                      </h3>
                      <p className="text-sm text-white/80 line-clamp-2">
                        {getLocalizedText(selectedVideo.description)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        {selectedVideo.publishDate && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(selectedVideo.publishDate)}
                          </span>
                        )}
                        {selectedVideo.duration && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {selectedVideo.duration}
                          </span>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-white hover:bg-white/10"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Character Selection Modal */}
      {showCharacterSelection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {language === 'fr' ? 'Personnages' : 'Characters'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'fr' ? 'Choisissez un personnage' : 'Choose a character'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCharacterSelectionClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {characters.map((character) => (
                  <button
                    key={character.id}
                    onClick={() => handleCharacterSelect(character)}
                    className="flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 transition-colors"
                  >
                    <div className="relative mb-3">
                      <div className={`absolute inset-0 bg-gradient-to-r ${character.color} rounded-full blur-lg opacity-60`} />
                      <div className="relative w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden">
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(character.id)}
                        />
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                      {character.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{character.role}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Detail Modal */}
      {showCharacterDetail && selectedCharacter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${selectedCharacter.color} flex items-center justify-center text-white font-bold text-lg`}>
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
                  className="h-8 w-8"
                  onClick={handleCharacterDetailClose}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="aspect-square rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-800">
                {imageErrors[selectedCharacter.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <AlertCircle className="w-16 h-16 text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={selectedCharacter.imageUrl}
                    alt={selectedCharacter.name}
                    className="w-full h-full object-contain p-4"
                    onError={() => handleImageError(selectedCharacter.id)}
                  />
                )}
              </div>
              
              {selectedCharacter.description && (
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {getLocalizedText(selectedCharacter.description)}
                </p>
              )}
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>{language === 'fr' ? 'Créé par Salsabile' : 'Created by Salsabile'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Video Card Component (Grid View)
const VideoCard = memo(({
  video,
  getLocalizedText,
  getThumbnailUrl,
  formatDate,
  onVideoSelect,
  onCharacterInfoClick,
  onThumbnailClick,
  language,
  showCharacterInfo,
  isExpanded,
  onToggleDescription,
  imageError,
  onImageError
}: VideoCardProps) => {
  const hasDescription = getLocalizedText(video.description).length > 100;
  
  return (
    <Card className="group overflow-hidden border-border/40 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-0">
        {/* Thumbnail */}
        <div 
          className={`relative ${video.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} overflow-hidden cursor-pointer bg-gradient-to-br from-emerald-500/5 to-teal-500/5`}
          onClick={(e) => onThumbnailClick(e, video)}
        >
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              <Video className="w-12 h-12 text-emerald-500/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <img
              src={getThumbnailUrl(video.youtubeId, video.isShort)}
              alt={getLocalizedText(video.title)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={onImageError}
              loading="lazy"
            />
          )}
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-emerald-600 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3">
            {video.isShort ? (
              <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0">
                <Zap className="w-3 h-3 mr-1" />
                SHORT
              </Badge>
            ) : (
              video.category && (
                <Badge className="bg-black/80 backdrop-blur-sm text-white border-0">
                  {getLocalizedText(video.category)}
                </Badge>
              )
            )}
          </div>

          {/* Duration */}
          {video.duration && (
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {/* Title */}
            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {getLocalizedText(video.title)}
            </h3>
            
            {/* Creator */}
            {video.creator && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  {showCharacterInfo && onCharacterInfoClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCharacterInfoClick();
                      }}
                      className="absolute -right-1 -top-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-0.5 rounded-full border-2 border-background shadow-lg flex items-center justify-center"
                      title={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                    >
                      <Info className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium">{video.creator.name}</span>
                  <p className="text-xs text-muted-foreground">{video.creator.role}</p>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="space-y-2">
              <p className={`text-sm text-muted-foreground ${!isExpanded ? 'line-clamp-2' : ''}`}>
                {getLocalizedText(video.description)}
              </p>
              {hasDescription && onToggleDescription && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDescription();
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      {language === 'fr' ? 'Voir moins' : 'See less'}
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      {language === 'fr' ? 'Voir plus' : 'See more'}
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {video.publishDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(video.publishDate)}
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs hover:bg-emerald-500/10 hover:text-emerald-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onVideoSelect(video);
                }}
              >
                <Play className="w-3 h-3 mr-1" />
                {language === 'fr' ? 'Regarder' : 'Watch'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

VideoCard.displayName = 'VideoCard';

// List View Video Card Component
const ListViewVideoCard = memo(({
  video,
  getLocalizedText,
  getThumbnailUrl,
  formatDate,
  onVideoSelect,
  onCharacterInfoClick,
  language,
  showCharacterInfo,
  isExpanded,
  onToggleDescription,
  imageError,
  onImageError
}: Omit<VideoCardProps, 'onThumbnailClick'>) => {
  const hasDescription = getLocalizedText(video.description).length > 150;
  
  return (
    <Card className="overflow-hidden border-border/40 hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Thumbnail */}
        <div 
          className={`relative ${video.aspect === 'portrait' ? 'md:w-64 aspect-[9/16]' : 'md:w-80 aspect-video'} overflow-hidden cursor-pointer bg-gradient-to-br from-emerald-500/5 to-teal-500/5`}
          onClick={() => onVideoSelect(video)}
        >
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500/10 to-green-500/10">
              <Video className="w-16 h-16 text-emerald-500/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <img
              src={getThumbnailUrl(video.youtubeId, video.isShort)}
              alt={getLocalizedText(video.title)}
              className="absolute inset-0 w-full h-full object-cover"
              onError={onImageError}
              loading="lazy"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-3 right-3">
            {video.isShort ? (
              <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0">
                <Zap className="w-3 h-3 mr-1" />
                SHORT
              </Badge>
            ) : (
              video.category && (
                <Badge className="bg-black/80 backdrop-blur-sm text-white border-0">
                  {getLocalizedText(video.category)}
                </Badge>
              )
            )}
          </div>
          
          {video.duration && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 md:p-6">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold mb-2 hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => onVideoSelect(video)}>
                {getLocalizedText(video.title)}
              </h3>
              
              {video.creator && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    {showCharacterInfo && onCharacterInfoClick && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCharacterInfoClick();
                        }}
                        className="absolute -right-1 -top-1 h-5 w-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-0.5 rounded-full border-2 border-background shadow-lg flex items-center justify-center"
                        title={language === 'fr' ? 'Voir les personnages' : 'View characters'}
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium">{video.creator.name}</span>
                    <p className="text-xs text-muted-foreground">{video.creator.role}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <p className={`text-sm text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}>
                {getLocalizedText(video.description)}
              </p>
              {hasDescription && onToggleDescription && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleDescription();
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      {language === 'fr' ? 'Voir moins' : 'See less'}
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      {language === 'fr' ? 'Voir plus' : 'See more'}
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-3 border-t">
              {video.publishDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(video.publishDate)}
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                onClick={() => onVideoSelect(video)}
              >
                <Play className="w-4 h-4" />
                {language === 'fr' ? 'Regarder maintenant' : 'Watch now'}
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank')}
                  title={language === 'fr' ? 'Ouvrir sur YouTube' : 'Open on YouTube'}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

ListViewVideoCard.displayName = 'ListViewVideoCard';
