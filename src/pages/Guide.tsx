import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookOpen, Construction } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Guide() {
  const { t } = useLanguage();
  const [openChapter, setOpenChapter] = useState<number | null>(null);
  useScrollReveal();

  const chapters = [
    {
      id: 1,
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/10",
      available: true,
    },
    {
      id: 2,
      icon: Construction,
      color: "text-muted-foreground",
      bg: "bg-muted",
      available: false,
    },
    {
      id: 3,
      icon: Construction,
      color: "text-muted-foreground",
      bg: "bg-muted",
      available: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("guide.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("guide.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <Card
              key={chapter.id}
              className={`scroll-reveal hover:shadow-lg transition-all ${
                chapter.available ? "cursor-pointer hover:-translate-y-1" : "opacity-75"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6 pb-6 text-center">
                <div className={`w-16 h-16 rounded-full ${chapter.bg} flex items-center justify-center mx-auto mb-4`}>
                  <chapter.icon className={`w-8 h-8 ${chapter.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-3">
                  {t(`guide.chapter${chapter.id}.title`)}
                </h3>
                <Button
                  variant={chapter.available ? "default" : "outline"}
                  className="w-full"
                  disabled={!chapter.available}
                  onClick={() => chapter.available && setOpenChapter(chapter.id)}
                >
                  {chapter.available ? t("guide.open") : t("guide.comingSoon")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chapter 1 Dialog - Introduction to Recycling */}
      <Dialog open={openChapter === 1} onOpenChange={() => setOpenChapter(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t("guide.chapter1.title")}</DialogTitle>
            <DialogDescription>{t("guide.chapter1.description")}</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="relative">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 0,
                  paddingTop: "56.25%",
                  paddingBottom: 0,
                  boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
                  marginTop: "1.6em",
                  marginBottom: "0.9em",
                  overflow: "hidden",
                  borderRadius: "8px",
                  willChange: "transform",
                }}
              >
                <iframe
                  loading="lazy"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    border: "none",
                    padding: 0,
                    margin: 0,
                  }}
                  src="https://www.canva.com/design/DAG5J4YE_vc/kEe6wTUO8l8FJI-XHCkL9Q/view?embed"
                  allowFullScreen
                  allow="fullscreen"
                />
              </div>
              <a
                href="https://www.canva.com/design/DAG5J4YE_vc/kEe6wTUO8l8FJI-XHCkL9Q/view?utm_content=DAG5J4YE_vc&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("home.presentation.canvaLink")}
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
