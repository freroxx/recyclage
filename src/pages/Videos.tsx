import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

export default function Videos() {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  useScrollReveal();

  const videos: Video[] = [
    {
      id: "1",
      title: t("videos.video1.title"),
      description: t("videos.video1.description"),
      youtubeId: "c5sPRL0YKUw",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("videos.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("videos.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className="hover:shadow-lg transition-all hover:-translate-y-2 cursor-pointer scroll-reveal"
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setSelectedVideo(video)}
            >
              <CardContent className="pt-6">
                <div className="relative mb-4 rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
