import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Play, ExternalLink, Calendar, Clock, Eye, TrendingUp, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const getThumbnailUrl = (youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'maxresdefault' = 'maxresdefault') => {
    return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
  };

  const openInYouTube = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank', 'noopener,noreferrer');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const thumbnailVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const playButtonVariants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { 
      scale: [1, 1.1, 1],
      opacity: 1,
      transition: {
        scale: {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12 md:mb-16 lg:mb-20"
          >
            <motion.div 
              className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl mb-6"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Play className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              {t("videos.title")}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {t("videos.subtitle")}
            </motion.p>
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
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
            </motion.div>
          </motion.div>

          {/* Video Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <Card
                    className="group relative h-full border-border/30 hover:border-primary/30 overflow-hidden bg-gradient-to-b from-card to-card/50 backdrop-blur-sm cursor-pointer"
                    onMouseEnter={() => setHoveredVideo(video.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    onClick={() => setSelectedVideo(video)}
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardContent className="p-0">
                      {/* Thumbnail Container */}
                      <motion.div 
                        className="relative aspect-video overflow-hidden"
                        variants={thumbnailVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 z-0" />
                        <img
                          src={getThumbnailUrl(video.youtubeId)}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover z-10"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getThumbnailUrl(video.youtubeId, 'hqdefault');
                          }}
                        />
                        
                        {/* Animated Gradient Overlay */}
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        
                        {/* Animated Play Button */}
                        <motion.div 
                          className="absolute inset-0 z-30 flex items-center justify-center"
                          variants={playButtonVariants}
                          initial="rest"
                          whileHover="hover"
                        >
                          <div className="relative">
                            {/* Outer Ring Pulse Effect */}
                            <motion.div 
                              className="absolute inset-0 w-20 h-20 bg-primary/30 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
                              <Play className="w-8 h-8 text-white ml-1" fill="white" />
                            </div>
                          </div>
                        </motion.div>

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
                      </motion.div>

                      {/* Content */}
                      <div className="p-5 md:p-6 relative z-20">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-bold text-lg md:text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                              {video.title}
                            </h3>
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              whileHover={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInYouTube(video.youtubeId);
                                }}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </motion.div>
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
                                <span>
                                  {new Date(video.publishDate).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* YouTube Link */}
          <motion.div 
            className="text-center mt-12 md:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="text-muted-foreground mb-6">
              {t("videos.moreVideos")}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="gap-3 px-8 border-primary/30 hover:border-primary/50 group"
                onClick={() => window.open("https://www.youtube.com", '_blank')}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ExternalLink className="w-5 h-5" />
                </motion.div>
                {t("videos.visitChannel")}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setSelectedVideo(null)}
            />
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border-border/50 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background rounded-xl"
              >
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl md:text-3xl font-bold">
                    {selectedVideo.title}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    {selectedVideo.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Video Embed with Details Below */}
                <div className="space-y-6 p-6">
                  {/* Video Player */}
                  <motion.div 
                    className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
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
                  </motion.div>

                  {/* Video Details Below Embed */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-4 p-4 bg-secondary/10 rounded-lg border border-border/30">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Eye className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Views</div>
                          <div className="font-semibold">{selectedVideo.views}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                          <div className="font-semibold">{selectedVideo.duration}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Published</div>
                          <div className="font-semibold">
                            {selectedVideo.publishDate && new Date(selectedVideo.publishDate).toLocaleDateString(undefined, {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Category</div>
                          <div className="font-semibold">{selectedVideo.category}</div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedVideo.tags.map((tag) => (
                            <Badge 
                              key={tag}
                              variant="secondary"
                              className="px-3 py-1.5 text-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <motion.div 
                      className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-border/30"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          className="w-full gap-2"
                          onClick={() => openInYouTube(selectedVideo.youtubeId)}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t("videos.watchOnYouTube")}
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedVideo(null)}
                        >
                          {t("videos.close")}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
