import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Gamepad2 } from "lucide-react";

export default function Activities() {
  const { t } = useLanguage();
  useScrollReveal();

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("activities.title")}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">{t("activities.subtitle")}</p>
        </div>

        <div className="grid gap-8">
          {games.map((game, index) => (
            <Card
              key={game.id}
              className="scroll-reveal overflow-hidden"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {game.id}
                  </span>
                  {t(game.titleKey)}
                </CardTitle>
                <CardDescription>{t(game.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={game.url}
                    className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-border"
                    title={t(game.titleKey)}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
