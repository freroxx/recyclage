import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Gamepad2, Home, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useNavigate } from "react-router-dom";

export default function Activities() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const games = [
    {
      id: 1,
      url: "https://sitetom.syctom-paris.fr/joue-avec-tom/je-suis-champion-du-tri.html#game",
      titleKey: "activities.game1.title",
      descriptionKey: "activities.game1.description",
    },
    {
      id: 2,
      url: "https://sitetom.syctom-paris.fr/joue-avec-tom/je-fais-un-geste-pour-la-planete.html#game",
      titleKey: "activities.game2.title",
      descriptionKey: "activities.game2.description",
    },
    {
      id: 3,
      url: "https://sitetom.syctom-paris.fr/joue-avec-tom/je-transforme-mes-dechets.html#game",
      titleKey: "activities.game3.title",
      descriptionKey: "activities.game3.description",
    },
    {
      id: 4,
      url: "https://sitetom.syctom-paris.fr/joue-avec-tom/je-deviens-le-roi-du-compost.html#game",
      titleKey: "activities.game4.title",
      descriptionKey: "activities.game4.description",
    },
  ];

  const currentGame = games[currentLevel];
  const isLastLevel = currentLevel === games.length - 1;

  const handleNextLevel = () => {
    if (!isLastLevel) {
      setCurrentLevel(currentLevel + 1);
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("activities.title")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">{t("activities.subtitle")}</p>
        </div>

        <Card className="overflow-hidden shadow-xl border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground text-lg font-bold shadow-lg">
                  {currentGame.id}
                </span>
                <div>
                  <CardTitle className="text-2xl">{t(currentGame.titleKey)}</CardTitle>
                  <CardDescription className="mt-1">{t(currentGame.descriptionKey)}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-background rounded-full">
                  Niveau {currentLevel + 1}/{games.length}
                </span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ResizablePanelGroup direction="vertical" className="min-h-[600px]">
              <ResizablePanel defaultSize={100} minSize={30}>
                <div 
                  ref={iframeContainerRef}
                  className="relative w-full h-full bg-muted/20"
                >
                  <iframe
                    key={currentGame.url}
                    src={currentGame.url}
                    className="w-full h-full"
                    title={t(currentGame.titleKey)}
                    allowFullScreen
                    loading="lazy"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 shadow-lg z-10"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>

          <div className="border-t bg-muted/30 p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                {t("activities.goHome")}
              </Button>
              
              {!isLastLevel && (
                <Button
                  size="lg"
                  onClick={handleNextLevel}
                  className="gap-2 ml-auto"
                >
                  {t("activities.nextLevel")}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              
              {isLastLevel && (
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-lg font-semibold text-primary">
                    🎉 {t("activities.completed")}
                  </span>
                  <Button
                    size="lg"
                    onClick={() => setCurrentLevel(0)}
                    variant="secondary"
                  >
                    {t("activities.restart")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {games.map((game, index) => (
            <button
              key={game.id}
              onClick={() => setCurrentLevel(index)}
              className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                currentLevel === index
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                  currentLevel === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {game.id}
                </span>
                <span className="text-xs font-medium">Niveau {game.id}</span>
              </div>
              <p className="text-xs text-left text-muted-foreground line-clamp-2">
                {t(game.titleKey)}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
