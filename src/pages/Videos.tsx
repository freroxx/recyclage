import { lazy, Suspense } from "react";
import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Shield,
  Globe
} from "lucide-react";

// Lazy load heavy components
const LazyVideoPlayer = lazy(() => import("@/components/LazyVideoPlayer"));

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration?: string;
  publishDate?: string;
  category?: string;
  views?: string;
  tags?: string[];
  type?: 'tutorial' | 'community' | 'short';
  engagement?: {
    likes?: string;
    comments?: string;
    shares?: string;
  };
}

export default function Videos() {
  useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  useScrollReveal();

  const videos: Video[] = useMemo(() => [
    {
      id: "community",
      title: "Notre Communauté en Action",
      description: "Découvrez comment notre communauté recycle et protège l'environnement. Rejoignez le mouvement !",
      youtubeId: "CtcgvPj1vGk",
      duration: "0:59",
      publishDate: "2024-01-20",
      category: "Communauté",
      views: "250K",
      type: "short",
      tags: ["Communauté", "Impact", "Écologie", "Action", "Recyclage"],
      engagement: {
        likes: "15K",
        comments: "2.3K",
        shares: "5.4K"
      }
    },
    {
      id: "1",
      title: "Introduction au Recyclage",
      description: "Découvrez les bases du recyclage, son importance pour l'environnement et comment participer activement à la préservation de notre planète.",
      youtubeId: "c5sPRL0YKUw",
      duration: "5:42",
      publishDate: "2024-01-15",
      category: "Éducation",
      views: "124K",
      type: "tutorial",
      tags: ["Recyclage", "Environnement", "Débutant", "Écologie"]
    },
    {
      id: "2",
      title: "Le Recyclage Du Papier Et Du Carton - Comment ça marche ?",
      description: "Explorez le processus complet du recyclage du papier et du carton, de la collecte à la transformation en nouveaux produits.",
      youtubeId: "s003IbGz-rA",
      duration: "18:25",
      publishDate: "2024-02-10",
      category: "Processus",
      views: "89K",
      type: "tutorial",
      tags: ["Papier", "Carton", "Processus", "Transformation", "Déchets"]
    },
    {
      id: "3",
      title: "Voyage au cœur du tri - Que se passe-t-il avec les déchets recyclables ?",
      description: "Suivez le parcours des déchets recyclables depuis le tri sélectif jusqu'à leur transformation en nouvelles matières premières.",
      youtubeId: "p67EWIamCIw",
      duration: "32:10",
      publishDate: "2024-03-05",
      category: "Documentaire",
      views: "156K",
      type: "tutorial",
      tags: ["Tri", "Centre de tri", "Déchets", "Recyclables", "Parcours"]
    }
  ], []);

  const filteredVideos = useMemo(() => {
    if (activeTab === "all") return videos;
    if (activeTab === "community") return videos.filter(v => v.type === "community" || v.type === "short");
    if (activeTab === "tutorials") return videos.filter(v => v.type === "tutorial");
    return videos;
  }, [videos, activeTab]);

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

  const communityVideo = videos.find(v => v.type === "short");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section En-tête */}
          <div 
            className="text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div 
              className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl mb-6 animate-pulse-slow"
              style={{ animationDuration: "3s" }}
            >
              <Play className="w-6 h-6 text-primary" />
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Vidéos Éducatives
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Découvrez notre collection de vidéos sur le recyclage et la gestion des déchets
            </p>
            <div 
              className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Badge 
                variant="secondary" 
                className="text-sm px-4 py-2 backdrop-blur-sm bg-secondary/50"
              >
                <Users className="w-3 h-3 mr-2" />
                {videos.length} Vidéos disponibles
              </Badge>
              <Badge 
                variant="outline" 
                className="text-sm px-4 py-2 backdrop-blur-sm border-primary/20"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Mise à jour régulière
              </Badge>
            </div>
          </div>

          {/* Section Notre Communauté */}
          {communityVideo && (
            <div 
              className="mb-16 lg:mb-20 animate-fade-in-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Notre Communauté
                </h2>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Carte Vidéo Communauté */}
                <div 
                  className="animate-scale-in"
                  style={{ animationDelay: "0.6s" }}
                >
                  <Card className="group relative h-full border-2 border-green-500/20 hover:border-green-500/40 overflow-hidden bg-gradient-to-br from-green-50/10 to-emerald-50/5 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <CardContent className="p-0">
                      <div className="relative aspect-[9/16] md:aspect-video overflow-hidden">
                        <img
                          src={getThumbnailUrl(communityVideo.youtubeId)}
                          alt={communityVideo.title}
                          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getThumbnailUrl(communityVideo.youtubeId, 'hqdefault');
                          }}
                        />
                        
                        {/* Badge Short */}
                        <div className="absolute top-4 left-4 z-30">
                          <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg animate-pulse">
                            SHORT
                          </Badge>
                        </div>
                        
                        {/* Superposition */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Bouton Lecture */}
                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 w-20 h-20 bg-green-500/30 rounded-full animate-ping-slow" />
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 transition-transform duration-300 group-hover:scale-110">
                              <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 relative z-20">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold text-xl line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
                              {communityVideo.title}
                            </h3>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:scale-110 transition-transform"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInYouTube(communityVideo.youtubeId);
                                }}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground">
                            {communityVideo.description}
                          </p>
                          
                          {/* Engagement Stats */}
                          {communityVideo.engagement && (
                            <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                              <div className="flex items-center gap-2 text-sm">
                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                <span>{communityVideo.engagement.likes}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MessageCircle className="w-4 h-4 text-blue-500" />
                                <span>{communityVideo.engagement.comments}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Share2 className="w-4 h-4 text-green-500" />
                                <span>{communityVideo.engagement.shares}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Texte Explicatif */}
                <div className="space-y-6 animate-fade-in-left" style={{ animationDelay: "0.7s" }}>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80">
                      Rejoignez Notre Mouvement Écologique
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Découvrez comment des milliers de personnes comme vous contribuent chaque jour à préserver notre planète.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Communauté Engagée</h4>
                        <p className="text-sm text-muted-foreground">25,000+ membres actifs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Impact Réel</h4>
                        <p className="text-sm text-muted-foreground">500+ tonnes recyclées mensuellement</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Portée Mondiale</h4>
                        <p className="text-sm text-muted-foreground">Plus de 50 pays représentés</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full gap-3 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300"
                    onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Rejoindre la communauté YouTube
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Filtres */}
          <div 
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList className="bg-background/50 backdrop-blur-sm border border-border/30">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                    Toutes les vidéos
                  </TabsTrigger>
                  <TabsTrigger value="tutorials" className="data-[state=active]:bg-blue-500/10">
                    Tutoriels
                  </TabsTrigger>
                  <TabsTrigger value="community" className="data-[state=active]:bg-green-500/10">
                    Communauté
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          {/* Grille de Vidéos */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredVideos.filter(v => v.type !== "short").map((video, index) => (
              <div
                key={video.id}
                className="animate-fade-in-up scroll-reveal"
                style={{ 
                  animationDelay: `${0.9 + index * 0.1}s`,
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                <Card
                  className="group relative h-full border-border/30 hover:border-primary/30 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:scale-95"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 z-0" />
                      <img
                        src={getThumbnailUrl(video.youtubeId)}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                        }}
                      />
                      
                      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 w-20 h-20 bg-primary/30 rounded-full animate-ping-slow" />
                          <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-3 left-3 z-30">
                        <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 shadow-lg">
                          {video.category}
                        </Badge>
                      </div>

                      {video.duration && (
                        <div className="absolute bottom-3 right-3 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                          {video.duration}
                        </div>
                      )}
                    </div>

                    <div className="p-5 md:p-6 relative z-20">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                            {video.title}
                          </h3>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:scale-110 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInYouTube(video.youtubeId);
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                        
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {video.tags.slice(0, 2).map((tag) => (
                              <span 
                                key={tag}
                                className="text-xs px-2 py-1 bg-secondary/30 rounded-full text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                            {video.tags.length > 2 && (
                              <span className="text-xs px-2 py-1 text-muted-foreground">
                                +{video.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views} vues</span>
                          </div>
                          {video.publishDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(video.publishDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Lien YouTube */}
          <div 
            className="text-center mt-12 md:mt-16 animate-fade-in-up"
            style={{ animationDelay: "1.2s" }}
          >
            <p className="text-muted-foreground mb-6">
              Plus de vidéos disponibles sur notre chaîne
            </p>
            <div className="inline-block hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button
                variant="outline"
                size="lg"
                className="gap-3 px-8 border-primary/30 hover:border-primary/50 group"
                onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
              >
                <span className="animate-spin-slow group-hover:rotate-12 transition-transform duration-300">
                  <ExternalLink className="w-5 h-5" />
                </span>
                Visiter notre chaîne YouTube
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Vidéo */}
      <Dialog open={isModalOpen} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto border-border/50 shadow-2xl animate-modal-in">
          <div className="bg-background rounded-xl">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl md:text-3xl font-bold animate-fade-in">
                {selectedVideo?.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {selectedVideo?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 p-6">
              <div 
                className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                }>
                  {selectedVideo && (
                    <LazyVideoPlayer
                      youtubeId={selectedVideo.youtubeId}
                      title={selectedVideo.title}
                      autoplay={true}
                    />
                  )}
                </Suspense>
              </div>

              <div 
                className="space-y-4 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/10 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Vues</div>
                      <div className="font-semibold">{selectedVideo?.views}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Durée</div>
                      <div className="font-semibold">{selectedVideo?.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Publié le</div>
                      <div className="font-semibold">
                        {selectedVideo?.publishDate && formatModalDate(selectedVideo.publishDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Tag className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Catégorie</div>
                      <div className="font-semibold">{selectedVideo?.category}</div>
                    </div>
                  </div>
                </div>

                {selectedVideo?.tags && selectedVideo.tags.length > 0 && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <h4 className="font-semibold text-foreground">Étiquettes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tag}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm animate-fade-in"
                          style={{ animationDelay: `${0.5 + tagIndex * 0.1}s` }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div 
                  className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/30 animate-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform duration-300">
                    <Button
                      className="w-full gap-2"
                      onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Regarder sur YouTube
                    </Button>
                  </div>
                  <div className="w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform duration-300">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedVideo(null)}
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Animations CSS Optimisées */}
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
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
            opacity: 0.5;
          }
          50% {
            opacity: 0;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .animate-modal-in {
          animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          animation-play-state: running;
        }
        
        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
          animation-play-state: running;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        /* Optimisations pour les animations */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-fade-in-left,
          .animate-scale-in,
          .animate-modal-in,
          .animate-ping-slow,
          .animate-spin-slow,
          .animate-pulse-slow,
          .animate-fade-in {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
        
        /* Optimisations pour les images */
        img {
          content-visibility: auto;
        }
      `}</style>
    </div>
  );
}
