import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Play, ExternalLink, Calendar, Clock, Eye, TrendingUp, Users, Tag } from "lucide-react";

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
}

export default function Videos() {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useScrollReveal();

  const videos: Video[] = useMemo(() => [
    {
      id: "1",
      title: t("videos.video1.title"),
      description: t("videos.video1.description"),
      youtubeId: "c5sPRL0YKUw",
      duration: "5:42",
      publishDate: "2024-01-15",
      category: t("videos.categories.tutorial"),
      views: "124K",
      tags: ["React", "Tutorial", "Beginners"]
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      description: "Learn advanced React patterns and best practices for building scalable applications with modern React features.",
      youtubeId: "s003IbGz-rA",
      duration: "18:25",
      publishDate: "2024-02-10",
      category: t("videos.categories.advanced"),
      views: "89K",
      tags: ["React", "Patterns", "Advanced", "Performance"]
    },
    {
      id: "3",
      title: "TypeScript Masterclass",
      description: "Deep dive into TypeScript features, advanced types, and best practices for type-safe development.",
      youtubeId: "p67EWIamCIw",
      duration: "32:10",
      publishDate: "2024-03-05",
      category: t("videos.categories.tutorial"),
      views: "156K",
      tags: ["TypeScript", "Tutorial", "Advanced"]
    }
  ], [t]);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatModalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
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
              {t("videos.title")}
            </h1>
            <p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {t("videos.subtitle")}
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
                {videos.length} {t("videos.totalVideos")}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-sm px-4 py-2 backdrop-blur-sm border-primary/20"
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                {t("videos.updatedWeekly")}
              </Badge>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="animate-fade-in-up scroll-reveal"
                style={{ 
                  animationDelay: `${0.5 + index * 0.1}s`,
                  transitionDelay: `${index * 100}ms` 
                }}
              >
                <Card
                  className="group relative h-full border-border/30 hover:border-primary/30 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:scale-95"
                  onMouseEnter={() => setHoveredVideo(video.id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-0">
                    {/* Thumbnail Container */}
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
                      
                      {/* Animated Gradient Overlay */}
                      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Animated Play Button */}
                      <div className="absolute inset-0 z-30 flex items-center justify-center">
                        <div className="relative">
                          {/* Outer Ring Pulse Effect */}
                          <div className="absolute inset-0 w-20 h-20 bg-primary/30 rounded-full animate-ping-slow" />
                          <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-30">
                        <Badge className="bg-black/80 backdrop-blur-sm text-white border-0 shadow-lg">
                          {video.category}
                        </Badge>
                      </div>

                      {/* Duration Badge */}
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 z-30 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                          {video.duration}
                        </div>
                      )}
                    </div>

                    {/* Content */}
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
                        
                        {/* Tags */}
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
                        
                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views}</span>
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

          {/* YouTube Link */}
          <div 
            className="text-center mt-12 md:mt-16 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <p className="text-muted-foreground mb-6">
              {t("videos.moreVideos")}
            </p>
            <div className="inline-block hover:scale-105 active:scale-95 transition-transform duration-300">
              <Button
                variant="outline"
                size="lg"
                className="gap-3 px-8 border-primary/30 hover:border-primary/50 group"
                onClick={() => window.open("https://www.youtube.com", '_blank')}
              >
                <span className="animate-spin-slow group-hover:rotate-12 transition-transform duration-300">
                  <ExternalLink className="w-5 h-5" />
                </span>
                {t("videos.visitChannel")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
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

            {/* Video Embed with Details Below */}
            <div className="space-y-6 p-6">
              {/* Video Player */}
              <div 
                className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl animate-scale-in"
                style={{ animationDelay: "0.2s" }}
              >
                {selectedVideo && (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Video Details Below Embed */}
              <div 
                className="space-y-4 animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-secondary/10 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Views</div>
                      <div className="font-semibold">{selectedVideo?.views}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">{selectedVideo?.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Published</div>
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
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-semibold">{selectedVideo?.category}</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedVideo?.tags && selectedVideo.tags.length > 0 && (
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                    <h4 className="font-semibold text-foreground">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.tags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm animate-fade-in"
                          style={{ animationDelay: `${0.5 + selectedVideo.tags!.indexOf(tag) * 0.1}s` }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
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
                      {t("videos.watchOnYouTube")}
                    </Button>
                  </div>
                  <div className="w-full sm:w-auto hover:scale-105 active:scale-95 transition-transform duration-300">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedVideo(null)}
                    >
                      {t("videos.close")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add custom animations to global CSS */}
      <style jsx>{`
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
            transform: scale(0.9);
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
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-modal-in {
          animation: modalIn 0.3s ease-out forwards;
        }
        
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
