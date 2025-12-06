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
  Heart
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
      title: "Impact Communautaire",
      description: "Découvrez l'impact positif de notre communauté dans la protection de l'environnement",
      youtubeId: "CtcgvPj1vGk",
      duration: "0:59",
      publishDate: "2024-01-20",
      category: "Communauté",
      type: "community",
      aspect: "portrait",
      tags: ["Impact", "Communauté", "Action", "Écologie"]
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/5 dark:to-emerald-950/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section En-tête */}
          <div 
            className="text-center mb-12 md:mb-16 lg:mb-20 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div 
              className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl mb-6 animate-float"
              style={{ animationDuration: "3s" }}
            >
              <div className="relative">
                <Play className="w-8 h-8 text-emerald-600 dark:text-emerald-400 relative z-10" />
                <div className="absolute inset-0 bg-emerald-400/30 blur-xl rounded-full"></div>
              </div>
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 bg-clip-text text-transparent animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Vidéos Éducatives
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              Apprenez et inspirez-vous avec notre collection de vidéos sur le recyclage
            </p>
            <div 
              className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Badge 
                variant="secondary" 
                className="text-sm px-4 py-2.5 backdrop-blur-sm bg-emerald-500/10 border-emerald-500/20"
              >
                <Users className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                {tutorialVideos.length} Tutoriels
              </Badge>
              <Badge 
                variant="outline" 
                className="text-sm px-4 py-2.5 backdrop-blur-sm border-emerald-500/30"
              >
                <Sparkles className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                {communityVideos.length} Vidéo Communautaire
              </Badge>
            </div>
          </div>

          {/* Navigation Sections */}
          <div 
            className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => setActiveSection('tutorials')}
              className={`group flex-1 flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeSection === 'tutorials'
                  ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                  : 'border-border/30 hover:border-emerald-500/30 hover:bg-emerald-500/2.5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  activeSection === 'tutorials'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Recycle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Tutoriels</h3>
                  <p className="text-sm text-muted-foreground">Apprenez les techniques de recyclage</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 transition-all duration-300 ${
                activeSection === 'tutorials'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              }`}>
                <span className="text-2xl font-bold">{tutorialVideos.length}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => setActiveSection('community')}
              className={`group flex-1 flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${
                activeSection === 'community'
                  ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                  : 'border-border/30 hover:border-emerald-500/30 hover:bg-emerald-500/2.5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  activeSection === 'community'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Leaf className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Communauté</h3>
                  <p className="text-sm text-muted-foreground">Inspirez-vous des actions collectives</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 transition-all duration-300 ${
                activeSection === 'community'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              }`}>
                <span className="text-2xl font-bold">{communityVideos.length}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Grille de Vidéos */}
          {activeSection === 'tutorials' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {tutorialVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-in-up scroll-reveal"
                  style={{ 
                    animationDelay: `${0.6 + index * 0.1}s`,
                    transitionDelay: `${index * 100}ms` 
                  }}
                >
                  <Card
                    className="group relative h-full border-border/30 hover:border-emerald-500/40 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <CardContent className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/10 to-teal-500/5 z-0" />
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
                        
                        {/* Superposition */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Bouton Lecture */}
                        <div className="absolute inset-0 z-30 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 w-20 h-20 bg-emerald-500/30 rounded-full animate-ping-slow" />
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/60">
                              <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                          </div>
                        </div>

                        {/* Badge Catégorie */}
                        <div className="absolute top-4 left-4 z-30">
                          <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 shadow-lg">
                            {video.category}
                          </Badge>
                        </div>

                        {/* Badge Durée */}
                        {video.duration && (
                          <div className="absolute bottom-4 right-4 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      <div className="p-5 md:p-6 relative z-20">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                              {video.title}
                            </h3>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:scale-110 transition-transform hover:bg-emerald-500/10"
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
                          
                          {/* Étiquettes */}
                          {video.tags && video.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {video.tags.slice(0, 2).map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {video.tags.length > 2 && (
                                <span className="text-xs px-2.5 py-1 text-muted-foreground">
                                  +{video.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Métadonnées */}
                          {video.publishDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-3 border-t border-border/50">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(video.publishDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'community' && (
            <div className="max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div 
                className="animate-scale-in"
                style={{ animationDelay: "0.7s" }}
              >
                <Card className="group relative border-2 border-emerald-500/20 hover:border-emerald-500/40 overflow-hidden bg-gradient-to-br from-emerald-50/10 to-green-50/5 dark:from-emerald-950/10 dark:to-green-950/5 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <CardContent className="p-0">
                    <div className="relative aspect-[9/16] overflow-hidden">
                      <img
                        src={getThumbnailUrl(communityVideos[0].youtubeId)}
                        alt={communityVideos[0].title}
                        className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getThumbnailUrl(communityVideos[0].youtubeId, 'hqdefault');
                        }}
                      />
                      
                      {/* Badge Short */}
                      <div className="absolute top-4 left-4 z-30">
                        <Badge className="bg-gradient-to-r from-emerald-600 to-green-500 text-white border-0 shadow-lg">
                          <Zap className="w-3 h-3 mr-1" />
                          SHORT
                        </Badge>
                      </div>
                      
                      {/* Superposition */}
                      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Bouton Lecture */}
                      <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 w-24 h-24 bg-emerald-500/30 rounded-full animate-ping-slow" />
                          <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/60">
                            <Play className="w-10 h-10 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Badge Durée */}
                      {communityVideos[0].duration && (
                        <div className="absolute bottom-4 right-4 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
                          {communityVideos[0].duration}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 relative z-20">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                            {communityVideos[0].title}
                          </h3>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:scale-110 transition-transform hover:bg-emerald-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                openInYouTube(communityVideos[0].youtubeId);
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">
                          {communityVideos[0].description}
                        </p>
                        
                        {/* Étiquettes */}
                        {communityVideos[0].tags && communityVideos[0].tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {communityVideos[0].tags.map((tag) => (
                              <span 
                                key={tag}
                                className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* CTA */}
                        <div className="pt-4 border-t border-border/50">
                          <Button
                            variant="outline"
                            className="w-full gap-2 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 group"
                            onClick={() => setSelectedVideo(communityVideos[0])}
                          >
                            <Play className="w-4 h-4" />
                            Regarder la vidéo
                            <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Description Communautaire */}
                <div className="text-center mt-8 space-y-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Ensemble pour un Avenir Durable
                  </h3>
                  <p className="text-muted-foreground">
                    Chaque action compte. Découvrez comment nos membres contribuent à préserver l'environnement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lien YouTube */}
          <div 
            className="text-center mt-12 md:mt-16 animate-fade-in-up"
            style={{ animationDelay: "1s" }}
          >
            <p className="text-muted-foreground mb-6">
              Plus de contenu disponible sur notre chaîne
            </p>
            <div className="inline-block hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button
                variant="outline"
                size="lg"
                className="gap-3 px-8 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 group"
                onClick={() => window.open("https://www.youtube.com/channel/UC1H5HYDNTWHw7fGOYBJp0RQ", '_blank')}
              >
                <div className="relative">
                  <ExternalLink className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-emerald-500/20 blur-sm rounded-full"></div>
                </div>
                Visiter notre chaîne YouTube
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Vertical pour Short */}
      <Dialog open={isModalOpen} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className={`max-w-md w-full max-h-[90vh] overflow-y-auto border-border/50 shadow-2xl animate-modal-in ${
          selectedVideo?.aspect === 'portrait' ? 'aspect-[9/16]' : ''
        }`}>
          <div className="bg-background rounded-xl">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-xl font-bold animate-fade-in line-clamp-2">
                {selectedVideo?.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {selectedVideo?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 p-6 pt-0">
              {/* Lecteur Vidéo Adaptatif */}
              <div 
                className={`w-full rounded-xl overflow-hidden bg-black shadow-2xl animate-scale-in ${
                  selectedVideo?.aspect === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                {selectedVideo && (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                )}
              </div>

              {/* Détails */}
              <div 
                className="space-y-4 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {/* Métadonnées */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/5 rounded-lg">
                    <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs text-muted-foreground">Durée</div>
                      <div className="font-semibold text-sm">{selectedVideo?.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-emerald-500/5 rounded-lg">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <div className="text-xs text-muted-foreground">Publié</div>
                      <div className="font-semibold text-sm">
                        {selectedVideo?.publishDate && formatDate(selectedVideo.publishDate)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Étiquettes */}
                {selectedVideo?.tags && selectedVideo.tags.length > 0 && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag, tagIndex) => (
                        <Badge 
                          key={tag}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm animate-fade-in bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          style={{ animationDelay: `${0.5 + tagIndex * 0.1}s` }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boutons d'Action */}
                <div 
                  className="flex flex-col gap-3 pt-4 border-t border-border/30 animate-fade-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <Button
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                    onClick={() => selectedVideo && openInYouTube(selectedVideo.youtubeId)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Regarder sur YouTube
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVideo(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          .animate-scale-in,
          .animate-modal-in,
          .animate-ping-slow,
          .animate-float {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
