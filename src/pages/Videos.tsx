import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Play, ExternalLink, Calendar, Clock, Eye } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration?: string;
  publishDate?: string;
  category?: string;
  views?: string;
}

export default function Videos() {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
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
      views: "124K"
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      description: "Learn advanced React patterns and best practices for scalable applications",
      youtubeId: "s003IbGz-rA",
      duration: "18:25",
      publishDate: "2024-02-10",
      category: t("videos.categories.advanced"),
      views: "89K"
    },
    {
      id: "3",
      title: "TypeScript Masterclass",
      description: "Deep dive into TypeScript features and type-safe development",
      youtubeId: "p67EWIamCIw",
      duration: "32:10",
      publishDate: "2024-03-05",
      category: t("videos.categories.tutorial"),
      views: "156K"
    }
  ], [t]);

  const getThumbnailUrl = (youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'maxresdefault' = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  };

  const openInYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20 scroll-reveal">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-foreground">
            {t("videos.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("videos.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="text-sm">
              {videos.length} {t("videos.totalVideos")}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {t("videos.updatedWeekly")}
            </Badge>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer h-full border-border/50 hover:border-primary/20 overflow-hidden"
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                onClick={() => setSelectedVideo(video)}
              >
                <CardContent className="p-0">
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                    <img
                      src={getThumbnailUrl(video.youtubeId)}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                      }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="transform transition-all duration-300 group-hover:scale-110">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/30">
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {video.category && (
                        <Badge className="bg-black/80 backdrop-blur-sm text-white border-0">
                          {video.category}
                        </Badge>
                      )}
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between text-white/90 text-sm">
                        {video.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{video.duration}</span>
                          </div>
                        )}
                        {video.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{video.views}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInYouTube(video.youtubeId);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {video.description}
                    </p>
                    
                    {video.publishDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(video.publishDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* YouTube Link */}
        <div className="text-center mt-12 md:mt-16 scroll-reveal">
          <p className="text-muted-foreground mb-4">
            {t("videos.moreVideos")}
          </p>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => window.open("https://www.youtube.com", '_blank')}
          >
            <ExternalLink className="w-5 h-5" />
            {t("videos.visitChannel")}
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <>
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {selectedVideo.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedVideo.duration}</span>
                    </div>
                  )}
                  {selectedVideo.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedVideo.views} {t("videos.views")}</span>
                    </div>
                  )}
                  {selectedVideo.publishDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(selectedVideo.publishDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-foreground">{selectedVideo.description}</p>
                
                <div className="flex items-center gap-3 pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => openInYouTube(selectedVideo.youtubeId)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("videos.watchOnYouTube")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedVideo(null)}
                  >
                    {t("videos.close")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
