import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { 
  Play, 
  ExternalLink, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Tag, 
  Sparkles,
  Leaf,
  Recycle,
  Zap,
  X,
  Maximize2,
  Minimize2,
  Globe,
  Shield,
  ThumbsUp,
  MessageSquare,
  Eye
} from "lucide-react";

interface Video {
  id: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  youtubeId: string;
  duration?: string;
  publishDate?: string;
  category?: { fr: string; en: string };
  tags?: { fr: string[]; en: string[] };
  type: 'tutorial' | 'community';
  aspect?: 'landscape' | 'portrait';
  views?: string;
  likes?: string;
  creator?: { name: string; role: string };
}

export default function Videos() {
  const { language, t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'tutorials' | 'community'>('tutorials');
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  useScrollReveal();

  const videos: Video[] = useMemo(() => [
    {
      id: "community1",
      title: {
        fr: "Avenir plus propre avec nos amis félins",
        en: "Cleaner Future with Our Feline Friends"
      },
      description: {
        fr: "Créé par Salsabile - Une inspiration quotidienne pour un avenir durable",
        en: "Created by Salsabile - Daily inspiration for a sustainable future"
      },
      youtubeId: "CtcgvPj1vGk",
      duration: "0:59",
      publishDate: "2025-12-06",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      views: "1.2K",
      likes: "156",
      creator: { name: "Salsabile", role: "Éco-Artiste" },
      tags: {
        fr: ["Inspiration", "Communauté", "Futur Durable", "Écologie", "Créativité"],
        en: ["Inspiration", "Community", "Sustainable Future", "Ecology", "Creativity"]
      }
    },
    {
      id: "community2",
      title: {
        fr: "Le recyclage au quotidien",
        en: "Daily Recycling"
      },
      description: {
        fr: "Créé par Salsabile - Astuces simples pour recycler chaque jour",
        en: "Created by Salsabile - Simple tips for daily recycling"
      },
      youtubeId: "g8MBdRd99LU",
      duration: "0:59",
      publishDate: "2025-12-07",
      category: { fr: "Communauté", en: "Community" },
      type: "community",
      aspect: "portrait",
      views: "890",
      likes: "98",
      creator: { name: "Salsabile", role: "Éco-Influenceur" },
      tags: {
        fr: ["Recyclage Quotidien", "Astuces", "Communauté", "Éco-Gestes", "Tutoriel Court"],
        en: ["Daily Recycling", "Tips", "Community", "Eco-Actions", "Short Tutorial"]
      }
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
      duration: "5:42",
      publishDate: "2024-01-15",
      category: { fr: "Éducation", en: "Education" },
      type: "tutorial",
      aspect: "landscape",
      views: "24K",
      likes: "1.8K",
      tags: {
        fr: ["Recyclage", "Environnement", "Débutant", "Écologie", "Guide"],
        en: ["Recycling", "Environment", "Beginner", "Ecology", "Guide"]
      }
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
      duration: "18:25",
      publishDate: "2024-02-10",
      category: { fr: "Processus", en: "Process" },
      type: "tutorial",
      aspect: "landscape",
      views: "18K",
      likes: "1.2K",
      tags: {
        fr: ["Papier", "Carton", "Processus", "Transformation", "Industrie"],
        en: ["Paper", "Cardboard", "Process", "Transformation", "Industry"]
      }
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
      duration: "32:10",
      publishDate: "2024-03-05",
      category: { fr: "Documentaire", en: "Documentary" },
      type: "tutorial",
      aspect: "landscape",
      views: "42K",
      likes: "3.5K",
      tags: {
        fr: ["Tri", "Déchets", "Recyclables", "Parcours", "Documentaire"],
        en: ["Sorting", "Waste", "Recyclables", "Journey", "Documentary"]
      }
    }
  ], []);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => v.type === activeSection);
  }, [videos, activeSection]);

  const tutorialVideos = videos.filter(v => v.type === "tutorial");
  const communityVideos = videos.filter(v => v.type === "community");

  const getLocalizedText = useCallback((text: { fr: string; en: string } | string) => {
    if (typeof text === 'string') return text;
    return text[language];
  }, [language]);

  useEffect(() => {
    if (selectedVideo) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedVideo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getThumbnailUrl = (youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'maxresdefault' = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  };

  const openInYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleVideoSelect = useCallback((video: Video) => {
    setIsLoading(true);
    setSelectedVideo(video);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const handleThumbnailClick = useCallback((e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    handleVideoSelect(video);
  }, [handleVideoSelect]);

  const toggleFullscreen = useCallback(() => {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    if (!document.fullscreenElement) {
      iframe.requestFullscreen?.();
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
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div 
            className="text-center mb-12 md:mb-16 lg:mb-20"
          >
            <div 
              className="inline-flex items-center justify-center p-3 mb-6 animate-float"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-green-500/30 blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 p-4 rounded-2xl shadow-lg shadow-emerald-500/10">
                  <Play className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
            >
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                {language === 'fr' ? 'Vidéos Éducatives' : 'Educational Videos'}
              </span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              {language === 'fr' 
                ? 'Apprenez et inspirez-vous pour un avenir plus durable' 
                : 'Learn and get inspired for a more sustainable future'}
            </p>
          </div>

          {/* Navigation */}
          <div 
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveSection('tutorials')}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'tutorials'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Recycle className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'tutorials' ? 'group-hover:rotate-12' : ''}`} />
                  {language === 'fr' ? 'Tutoriels' : 'Tutorials'}
                  <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    activeSection === 'tutorials' 
                      ? 'bg-white/30' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {tutorialVideos.length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveSection('community')}
                  className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 ${
                    activeSection === 'community'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-background/50 border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Users className={`w-4 h-4 transition-transform duration-300 ${activeSection === 'community' ? 'group-hover:scale-110' : ''}`} />
                  {language === 'fr' ? 'Communauté' : 'Community'}
                  <span className={`px-2 py-0.5 text-xs rounded-full transition-all duration-300 ${
                    activeSection === 'community' 
                      ? 'bg-white/30' 
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {communityVideos.length}
                  </span>
                </button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {language === 'fr' ? 'Contenu régulièrement mis à jour' : 'Regularly updated content'}
                </span>
              </div>
            </div>
          </div>

          {/* Tutorials Grid */}
          {activeSection === 'tutorials' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tutorialVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="scroll-reveal"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Card
                    className="group relative h-full border-border/40 hover:border-emerald-500/50 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 card-hover"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5">
                        <img
                          src={getThumbnailUrl(video.youtubeId)}
                          alt={getLocalizedText(video.title)}
                          className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                          }}
                        />
                        
                        <div 
                          className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                          onClick={(e) => handleThumbnailClick(e, video)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 w-16 h-16 bg-emerald-500/40 rounded-full animate-ping-slow" />
                              <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
                                <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-3 left-3 z-30 flex gap-2">
                          <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 text-xs px-2.5 py-1">
                            {getLocalizedText(video.category || { fr: 'Catégorie', en: 'Category' })}
                          </Badge>
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
                            <h3 className="font-bold text-lg line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                              {getLocalizedText(video.title)}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-emerald-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInYouTube(video.youtubeId);
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {getLocalizedText(video.description)}
                          </p>
                          
                          {video.views && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {video.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {video.likes}
                              </span>
                            </div>
                          )}
                          
                          {video.tags && video.tags[language] && video.tags[language].length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {video.tags[language].slice(0, 2).map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(video.publishDate || '')}</span>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2.5 text-xs hover:bg-emerald-500/10"
                              onClick={() => handleVideoSelect(video)}
                            >
                              <Play className="w-3 h-3 mr-1.5" />
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

          {/* Community Section */}
          {activeSection === 'community' && (
            <div className="space-y-8">
              <div 
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {language === 'fr' ? 'Vidéos de la Communauté' : 'Community Videos'}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {language === 'fr' ? 'Notre Communauté en Action' : 'Our Community in Action'}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  {language === 'fr' 
                    ? 'Découvrez les moments inspirants partagés par notre communauté' 
                    : 'Discover inspiring moments shared by our community'}
                </p>
              </div>
              
              {/* Community Videos Grid */}
              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {communityVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    className="scroll-reveal"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/10 to-green-50/5 dark:from-emerald-950/10 dark:to-green-950/5 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 card-hover">
                      <CardContent className="p-0">
                        <div className="relative aspect-[9/16] overflow-hidden">
                          <div 
                            className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 cursor-pointer"
                            onClick={(e) => handleThumbnailClick(e, video)}
                          >
                            <img
                              src={getThumbnailUrl(video.youtubeId, 'hqdefault')}
                              alt={getLocalizedText(video.title)}
                              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getThumbnailUrl(video.youtubeId, 'default');
                              }}
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                  <div className="absolute inset-0 w-20 h-20 bg-emerald-500/40 rounded-full animate-ping-slow" />
                                  <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
                                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="absolute top-4 left-4 z-30">
                              <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 shadow-lg text-xs px-3 py-1.5">
                                <Zap className="w-3 h-3 mr-1.5" />
                                SHORT
                              </Badge>
                            </div>

                            {video.duration && (
                              <div className="absolute bottom-4 right-4 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md">
                                {video.duration}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                {getLocalizedText(video.title)}
                              </h3>
                              
                              <div className="flex items-center gap-3 mb-3">
                                {video.creator && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-emerald-600">S</span>
                                    </div>
                                    <span className="text-sm font-medium">{video.creator.name}</span>
                                  </div>
                                )}
                                
                                {video.views && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Eye className="w-3 h-3" />
                                    {video.views}
                                    {video.likes && (
                                      <>
                                        <span className="mx-1">•</span>
                                        <ThumbsUp className="w-3 h-3" />
                                        {video.likes}
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {getLocalizedText(video.description)}
                              </p>
                              
                              {video.tags && video.tags[language] && video.tags[language].length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {video.tags[language].slice(0, 3).map((tag) => (
                                    <span 
                                      key={tag}
                                      className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/20"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-border/50">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(video.publishDate || '')}</span>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md shadow-emerald-500/20"
                                  onClick={() => handleVideoSelect(video)}
                                >
                                  <Play className="w-4 h-4" />
                                  {language === 'fr' ? 'Regarder' : 'Watch'}
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                                  onClick={() => openInYouTube(video.youtubeId)}
                                >
                                  <ExternalLink className="w-4 h-4" />
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
              
              {/* Community Stats */}
              <div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              >
                <div className="p-5 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold mb-1">
                    {language === 'fr' ? 'Communauté Globale' : 'Global Community'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' 
                      ? 'Membres engagés partout dans le monde' 
                      : 'Engaged members all over the world'}
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
                    <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold mb-1">
                    {language === 'fr' ? 'Impact Collectif' : 'Collective Impact'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' 
                      ? 'Chaque action contribue à un futur meilleur' 
                      : 'Every action contributes to a better future'}
                  </p>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-xl border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold mb-1">
                    {language === 'fr' ? 'Inspiration Mutuelle' : 'Mutual Inspiration'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'fr' 
                      ? 'Partagez vos initiatives et inspirez les autres' 
                      : 'Share your initiatives and inspire others'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Channel */}
          <div 
            className="mt-12 md:mt-16"
          >
            <div className="bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/20 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">
                    {language === 'fr' ? 'Notre Chaîne YouTube' : 'Our YouTube Channel'}
                  </h3>
                  <p className="text-muted-foreground mb-4 md:mb-0">
                    {language === 'fr' 
                      ? 'Plus de contenu éducatif disponible sur notre chaîne' 
                      : 'More educational content available on our channel'}
                  </p>
                </div>
                
                <Button
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 px-8 group"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  {language === 'fr' ? 'Visiter la chaîne' : 'Visit the channel'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Video Modal with Perfect Centering */}
      <Dialog open={isModalOpen} onOpenChange={() => {
        setSelectedVideo(null);
        setIsFullscreen(false);
      }}>
        <DialogContent 
          ref={modalRef}
          className="fixed inset-0 m-auto border-none bg-black shadow-2xl overflow-hidden p-0 w-[95vw] h-[85vh] transition-all duration-300 z-50"
          style={{
            maxWidth: selectedVideo?.aspect === 'portrait' ? '350px' : '900px',
            maxHeight: selectedVideo?.aspect === 'portrait' ? '620px' : '506px',
            aspectRatio: selectedVideo?.aspect === 'portrait' ? '9/16' : '16/9',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            if (controlsTimeoutRef.current) {
              clearTimeout(controlsTimeoutRef.current);
            }
            setTimeout(() => setShowControls(false), 100);
          }}
        >
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Top Controls Bar */}
          <div 
            className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/80 to-transparent p-4 transition-all duration-200 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 transition-all duration-200 hover:border-emerald-500/50"
                  onClick={() => {
                    setSelectedVideo(null);
                    setIsFullscreen(false);
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
                
                {selectedVideo && (
                  <div className="ml-2">
                    <h3 className="text-sm font-semibold text-white/95 truncate max-w-[200px]">
                      {getLocalizedText(selectedVideo.title)}
                    </h3>
                    {selectedVideo.creator && (
                      <p className="text-xs text-white/70 truncate">
                        {language === 'fr' ? 'Par' : 'By'} {selectedVideo.creator.name}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {selectedVideo?.views && (
                  <div className="hidden sm:flex items-center gap-3 mr-2 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {selectedVideo.views}
                    </span>
                    {selectedVideo.likes && (
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {selectedVideo.likes}
                      </span>
                    )}
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 transition-all duration-200 hover:border-emerald-500/50"
                  onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                  title={language === 'fr' ? 'Ouvrir sur YouTube' : 'Open on YouTube'}
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white border border-white/20 hover:scale-110 transition-all duration-200 hover:border-emerald-500/50"
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
            
            {selectedVideo && selectedVideo.tags && selectedVideo.tags[language] && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedVideo.tags[language].slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Video Player */}
          <div className="relative w-full h-full">
            {selectedVideo && (
              <>
                {/* YouTube Player */}
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=0`}
                  title={getLocalizedText(selectedVideo.title)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  onLoad={() => setIsLoading(false)}
                />
              </>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div 
            className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/90 via-black/80 to-transparent p-4 transition-all duration-200 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
            }`}
          >
            {selectedVideo && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-white line-clamp-1">
                    {getLocalizedText(selectedVideo.title)}
                  </h3>
                  <p className="text-sm text-white/80 line-clamp-2 mt-1">
                    {getLocalizedText(selectedVideo.description)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/20">
                  <div className="flex items-center gap-4">
                    {selectedVideo.publishDate && (
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(selectedVideo.publishDate)}
                      </span>
                    )}
                    {selectedVideo.duration && (
                      <span className="text-xs text-white/70 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedVideo.duration}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === 'fr' ? 'YouTube' : 'YouTube'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            setSelectedVideo(null);
            setIsFullscreen(false);
          }}
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
            transform: scale(1.3);
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
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
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.1);
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-ping-slow,
          .animate-pulse-slow,
          .animate-float,
          .animate-spin,
          .card-hover,
          .transition-all {
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
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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
      `}</style>
    </div>
  );
}
