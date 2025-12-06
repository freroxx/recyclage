import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { 
  Play, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Eye, 
  TrendingUp, 
  Users, 
  Tag, 
  Sparkles,
  Leaf,
  Recycle,
  Zap,
  ChevronRight,
  Heart,
  Globe,
  Shield
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration?: string;
  publishDate?: string;
  category?: string;
  tags?: string[];
  type: 'tutorial' | 'community';
  aspect?: 'landscape' | 'portrait';
}

export default function Videos() {
  useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'tutorials' | 'community'>('tutorials');
  useScrollReveal();

  const videos: Video[] = useMemo(() => [
    {
      id: "community",
      title: "Avenir plus propre avec nos amis félins",
      description: "Découvrez comment nos compagnons félins nous inspirent à créer un avenir plus durable",
      youtubeId: "CtcgvPj1vGk",
      duration: "0:59",
      publishDate: "2025-12-06",
      category: "Communauté",
      type: "community",
      aspect: "portrait",
      tags: ["Inspiration", "Communauté", "Futur Durable", "Écologie"]
    },
    {
      id: "1",
      title: "Introduction au Recyclage",
      description: "Découvrez les bases du recyclage et son importance pour l'environnement",
      youtubeId: "c5sPRL0YKUw",
      duration: "5:42",
      publishDate: "2024-01-15",
      category: "Éducation",
      type: "tutorial",
      aspect: "landscape",
      tags: ["Recyclage", "Environnement", "Débutant", "Écologie"]
    },
    {
      id: "2",
      title: "Recyclage du Papier et Carton",
      description: "Processus complet du recyclage du papier et du carton",
      youtubeId: "s003IbGz-rA",
      duration: "18:25",
      publishDate: "2024-02-10",
      category: "Processus",
      type: "tutorial",
      aspect: "landscape",
      tags: ["Papier", "Carton", "Processus", "Transformation"]
    },
    {
      id: "3",
      title: "Voyage au cœur du tri",
      description: "Parcours des déchets recyclables depuis le tri jusqu'à la transformation",
      youtubeId: "p67EWIamCIw",
      duration: "32:10",
      publishDate: "2024-03-05",
      category: "Documentaire",
      type: "tutorial",
      aspect: "landscape",
      tags: ["Tri", "Déchets", "Recyclables", "Parcours"]
    }
  ], []);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => v.type === activeSection);
  }, [videos, activeSection]);

  const tutorialVideos = videos.filter(v => v.type === "tutorial");
  const communityVideos = videos.filter(v => v.type === "community");

  useEffect(() => {
    if (selectedVideo) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedVideo]);

  const getThumbnailUrl = (youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'maxresdefault' = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  };

  const openInYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatModalDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Enhanced Design */}
          <div 
            className="text-center mb-16 md:mb-20 lg:mb-24 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div 
              className="inline-flex items-center justify-center p-4 mb-8 animate-float"
              style={{ animationDuration: "3s" }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 blur-3xl opacity-20 rounded-full"></div>
                <div className="relative bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/20 p-6 rounded-2xl">
                  <Play className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Découvrez Notre
              </span>
              <br />
              <span className="bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent">
                Collection Vidéo
              </span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Apprenez, inspirez-vous et rejoignez le mouvement pour un avenir plus durable
            </p>
            
            {/* Stats Cards */}
            <div 
              className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 rounded-xl">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Recycle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{tutorialVideos.length}</div>
                  <div className="text-sm text-muted-foreground">Tutoriels</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-6 py-4 bg-green-500/5 backdrop-blur-sm border border-green-500/20 rounded-xl">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">{communityVideos.length}</div>
                  <div className="text-sm text-muted-foreground">Vidéos Communauté</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 px-6 py-4 bg-teal-500/5 backdrop-blur-sm border border-teal-500/20 rounded-xl">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-700 dark:text-teal-300">24/7</div>
                  <div className="text-sm text-muted-foreground">Disponible</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs with Better Design */}
          <div 
            className="mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="flex justify-center mb-2">
              <div className="inline-flex bg-muted/50 backdrop-blur-sm p-1.5 rounded-2xl border border-border/30">
                <button
                  onClick={() => setActiveSection('tutorials')}
                  className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === 'tutorials'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Recycle className="w-4 h-4" />
                  Tutoriels
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20">{tutorialVideos.length}</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('community')}
                  className={`px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === 'community'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Communauté
                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/20">{communityVideos.length}</span>
                </button>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">
                {activeSection === 'tutorials' 
                  ? 'Apprenez les techniques essentielles de recyclage'
                  : 'Découvrez les actions inspirantes de notre communauté'}
              </p>
            </div>
          </div>

          {/* Content Grid */}
          {activeSection === 'tutorials' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutorialVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-in-up scroll-reveal"
                  style={{ 
                    animationDelay: `${0.6 + index * 0.1}s`,
                  }}
                >
                  <Card
                    className="group relative h-full border-border/40 hover:border-emerald-500/50 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-1"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <CardContent className="p-0">
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10">
                        <img
                          src={getThumbnailUrl(video.youtubeId)}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                          }}
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 w-20 h-20 bg-emerald-500/30 rounded-full animate-ping-slow" />
                            <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/60">
                              <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                            </div>
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 z-40">
                          <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 shadow-lg px-3 py-1.5">
                            {video.category}
                          </Badge>
                        </div>

                        {/* Duration Badge */}
                        {video.duration && (
                          <div className="absolute bottom-4 right-4 z-40 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 relative z-20">
                        <div className="space-y-4">
                          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                            {video.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {video.description}
                          </p>
                          
                          {/* Tags */}
                          {video.tags && video.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {video.tags.slice(0, 2).map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Metadata & Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(video.publishDate || '')}</span>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInYouTube(video.youtubeId);
                              }}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              YouTube
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

          {activeSection === 'community' && (
            <div className="max-w-2xl mx-auto">
              {/* Featured Community Video */}
              <div className="mb-12 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Vidéo à la une</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Notre Communauté en Action</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Découvrez comment nos membres contribuent à créer un avenir meilleur
                  </p>
                </div>
                
                {/* Community Card */}
                <div 
                  className="animate-scale-in"
                  style={{ animationDelay: "0.7s" }}
                >
                  <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50/10 to-green-50/5 dark:from-emerald-950/10 dark:to-green-950/5 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <CardContent className="p-0">
                      {/* Portrait Thumbnail */}
                      <div className="relative aspect-[9/16] max-w-md mx-auto overflow-hidden bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10">
                        <img
                          src={getThumbnailUrl(communityVideos[0].youtubeId)}
                          alt={communityVideos[0].title}
                          className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getThumbnailUrl(communityVideos[0].youtubeId, 'hqdefault');
                          }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 w-24 h-24 bg-emerald-500/30 rounded-full animate-ping-slow" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
                              <Play className="w-10 h-10 text-white ml-1" fill="white" />
                            </div>
                          </div>
                        </div>

                        {/* Short Badge */}
                        <div className="absolute top-6 left-6 z-40">
                          <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 shadow-lg px-4 py-2">
                            <Zap className="w-4 h-4 mr-2" />
                            SHORT
                          </Badge>
                        </div>

                        {/* Duration */}
                        {communityVideos[0].duration && (
                          <div className="absolute bottom-6 right-6 z-40 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg">
                            {communityVideos[0].duration}
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 relative z-20">
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                              {communityVideos[0].title}
                            </h3>
                            
                            <p className="text-muted-foreground">
                              {communityVideos[0].description}
                            </p>
                          </div>
                          
                          {/* Tags */}
                          {communityVideos[0].tags && communityVideos[0].tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {communityVideos[0].tags.map((tag) => (
                                <span 
                                  key={tag}
                                  className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-500/20 text-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* CTA */}
                          <div className="pt-6 border-t border-border/50">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Button
                                className="gap-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25"
                                onClick={() => setSelectedVideo(communityVideos[0])}
                              >
                                <Play className="w-5 h-5" />
                                Regarder maintenant
                              </Button>
                              
                              <Button
                                variant="outline"
                                className="gap-3 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                                onClick={() => openInYouTube(communityVideos[0].youtubeId)}
                              >
                                <ExternalLink className="w-5 h-5" />
                                Sur YouTube
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Community Inspiration */}
              <div 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: "0.8s" }}
              >
                <h3 className="text-2xl font-bold mb-6">Rejoignez Notre Mouvement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-2xl border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Portée Globale</h4>
                    <p className="text-sm text-muted-foreground">Des membres actifs partout dans le monde</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-2xl border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Impact Positif</h4>
                    <p className="text-sm text-muted-foreground">Chaque action compte pour notre planète</p>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-emerald-50/5 to-green-50/5 rounded-2xl border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Communauté Bienveillante</h4>
                    <p className="text-sm text-muted-foreground">Un espace d'échange et d'inspiration</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* YouTube Channel CTA */}
          <div 
            className="text-center mt-16 md:mt-20 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <div className="max-w-2xl mx-auto">
              <div className="p-8 bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl border border-emerald-500/20 mb-8">
                <h3 className="text-2xl font-bold mb-4">Notre Chaîne YouTube</h3>
                <p className="text-muted-foreground mb-6">
                  Abonnez-vous pour ne manquer aucune nouvelle vidéo éducative
                </p>
                <Button
                  size="lg"
                  className="gap-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 px-8"
                  onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  Visiter la chaîne
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal with Proper Aspect Ratio */}
      <Dialog open={isModalOpen} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-border/50 shadow-2xl overflow-hidden p-0 ${
          selectedVideo?.aspect === 'portrait' 
            ? 'max-w-md w-[95vw] h-[85vh] md:h-[90vh] aspect-[9/16]' 
            : 'max-w-4xl w-[95vw] md:w-[90vw] h-auto aspect-video max-h-[85vh] md:max-h-[90vh]'
        }`}>
          <div className="bg-background w-full h-full flex flex-col">
            {/* Video Player */}
            <div className={`relative flex-1 ${selectedVideo?.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>
              {selectedVideo && (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
            
            {/* Video Info - Only shown for landscape videos or below portrait */}
            {selectedVideo?.aspect === 'landscape' ? (
              <div className="p-6 border-t border-border/50 bg-gradient-to-b from-background to-background/95">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
                    <p className="text-muted-foreground text-sm">{selectedVideo.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {selectedVideo.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          <span>{selectedVideo.duration}</span>
                        </div>
                      )}
                      
                      {selectedVideo.publishDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>{formatModalDate(selectedVideo.publishDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                      onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Sur YouTube
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-border/50 bg-gradient-to-b from-background to-background/95">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{selectedVideo?.title}</h3>
                    {selectedVideo?.publishDate && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(selectedVideo.publishDate)}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
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
            transform: scale(1.4);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-modal-in {
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Smooth scrolling */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .scroll-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-scale-in,
          .animate-modal-in,
          .animate-ping-slow,
          .animate-float,
          .animate-shimmer,
          .scroll-reveal {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
        
        /* Better focus styles */
        *:focus-visible {
          outline: 2px solid rgb(16, 185, 129);
          outline-offset: 2px;
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
      `}</style>
    </div>
  );
}
