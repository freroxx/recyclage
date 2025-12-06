import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { 
  Gamepad2, 
  Home, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Loader2,
  AlertCircle,
  X,
  Trophy,
  BookOpen,
  RotateCw
} from "lucide-react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";

interface Game {
  id: number;
  url: string;
  titleKey: string;
  descriptionKey: string;
}

const GAMES: Game[] = [
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

export default function Activities() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const currentGame = GAMES[currentLevel];
  const isLastLevel = currentLevel === GAMES.length - 1;
  const progress = ((currentLevel + 1) / GAMES.length) * 100;

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextLevel = useCallback(() => {
    if (!isLastLevel) {
      setCurrentLevel(prev => prev + 1);
      setIsIframeLoading(true);
      setIframeError(null);
      setReloadKey(prev => prev + 1);
    }
  }, [isLastLevel]);

  const handleGoHome = () => navigate("/");

  const toggleFullscreen = useCallback(() => {
    if (!iframeContainerRef.current) return;

    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const reloadIframe = useCallback(() => {
    setIsIframeLoading(true);
    setIframeError(null);
    setReloadKey(prev => prev + 1);
  }, []);

  const handleLevelSelect = useCallback((index: number) => {
    setCurrentLevel(index);
    setIsIframeLoading(true);
    setIframeError(null);
    setReloadKey(prev => prev + 1);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIsIframeLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(t("activities.iframeError") || "Échec du chargement du jeu. Veuillez réessayer.");
  }, [t]);

  const handleCompletionClick = () => {
    setShowCompletionPopup(true);
  };

  const handleClosePopup = () => {
    setShowCompletionPopup(false);
  };

  const handleRestart = () => {
    window.location.reload(); // Reloads the page and resets progression
  };

  const handleLearnMore = () => {
    navigate("/guide");
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Confetti Animation */}
        {showCompletionPopup && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.1}
            initialVelocityX={4}
            initialVelocityY={10}
            colors={['#FFC700', '#FF0000', '#2E3192', '#41B883', '#DD1B16']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9998 }}
          />
        )}

        {/* Completion Popup */}
        {showCompletionPopup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Félicitations ! 🎉
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Tu as terminé tous les niveaux
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClosePopup}
                  className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-8">
                <p className="text-lg text-center font-medium text-gray-800 dark:text-gray-200 mb-6">
                  Bravo, nous te félicitons pour ton excellent travail !
                </p>
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Tu as montré que tu es un vrai champion du recyclage. 
                    Continue à apprendre et à partager tes connaissances !
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleRestart}
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 border-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <RotateCw className="w-5 h-5" />
                  Recommencer
                </Button>
                <Button
                  onClick={handleLearnMore}
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  <BookOpen className="w-5 h-5" />
                  En savoir plus
                </Button>
              </div>

              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
                Clique sur "Recommencer" pour refaire tous les jeux
              </p>
            </div>
          </div>
        )}

        {/* En-tête */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                {t("activities.title")}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
              {t("activities.subtitle")}
            </p>
          </div>
          
          {/* Barre de progression */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Votre progression
              </span>
              <span className="text-sm font-semibold text-primary">
                {currentLevel + 1} / {GAMES.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </header>

        {/* Carte principale du jeu */}
        <Card className="overflow-hidden border-2 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <Badge className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                  {currentGame.id}
                </Badge>
                <div>
                  <CardTitle className="text-xl sm:text-2xl">{t(currentGame.titleKey)}</CardTitle>
                  <CardDescription className="mt-1 text-sm sm:text-base">
                    {t(currentGame.descriptionKey)}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  Niveau {currentLevel + 1}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          {/* Conteneur du jeu */}
          <CardContent className="p-0">
            <ResizablePanelGroup direction="vertical" className="min-h-[500px] sm:min-h-[600px]">
              <ResizablePanel defaultSize={100} minSize={30}>
                <div 
                  ref={iframeContainerRef}
                  className="relative w-full h-full bg-gradient-to-br from-muted/10 to-muted/30"
                >
                  {/* État de chargement */}
                  {isIframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-20">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground">Chargement du jeu...</p>
                    </div>
                  )}
                  
                  {/* État d'erreur */}
                  {iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-20 p-6">
                      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                      <p className="text-lg font-medium text-center mb-4">{iframeError}</p>
                      <Button onClick={reloadIframe} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Réessayer
                      </Button>
                    </div>
                  )}
                  
                  {/* Iframe du jeu */}
                  <iframe
                    key={`${currentGame.url}-${reloadKey}`}
                    src={currentGame.url}
                    className="w-full h-full"
                    title={t(currentGame.titleKey)}
                    allowFullScreen
                    loading="lazy"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                  
                  {/* Contrôles du jeu */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="shadow-lg bg-background/80 backdrop-blur-sm"
                      onClick={toggleFullscreen}
                      aria-label={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="icon"
                      className="shadow-lg bg-background/80 backdrop-blur-sm"
                      onClick={reloadIframe}
                      aria-label="Recharger le jeu"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>

          {/* Pied de page de navigation */}
          <footer className="border-t bg-muted/20 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoHome}
                className="w-full sm:w-auto gap-2"
              >
                <Home className="w-4 h-4" />
                {t("activities.goHome")}
              </Button>
              
              <div className="flex gap-3 w-full sm:w-auto">
                {!isLastLevel ? (
                  <Button
                    size="lg"
                    onClick={handleNextLevel}
                    className="gap-2 flex-1 sm:flex-none"
                  >
                    {t("activities.nextLevel")}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex items-center justify-center sm:justify-end gap-3 flex-1">
                    <Button
                      size="lg"
                      onClick={handleCompletionClick}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white gap-2"
                    >
                      <Trophy className="w-5 h-5" />
                      J'ai terminé
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </footer>
        </Card>

        {/* Sélecteur de niveau */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Sélectionnez votre niveau
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {GAMES.map((game, index) => (
              <button
                key={game.id}
                onClick={() => handleLevelSelect(index)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-300
                  hover:scale-[1.02] hover:shadow-lg active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${currentLevel === index
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-card hover:border-primary/50"
                  }
                `}
                aria-label={`Sélectionner le niveau ${game.id}: ${t(game.titleKey)}`}
                aria-current={currentLevel === index ? "true" : "false"}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`
                    flex items-center justify-center w-10 h-10 rounded-lg
                    text-sm font-bold transition-colors
                    ${currentLevel === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                    }
                  `}>
                    {game.id}
                  </span>
                  <span className="text-sm font-medium">
                    Niveau {game.id}
                  </span>
                </div>
                <p className="text-sm text-left text-muted-foreground line-clamp-2">
                  {t(game.titleKey)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
