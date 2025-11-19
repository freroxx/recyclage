import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

export default function Posters() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("posters.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("posters.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
          {/* First Poster */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-0 pb-[141.4286%] overflow-hidden rounded-t-lg">
              <iframe
                loading="lazy"
                className="absolute w-full h-full top-0 left-0 border-none"
                src="https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="p-4 bg-card">
              <a
                href="https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?utm_content=DAG5KNBOplY&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t("posters.poster1")} {t("home.presentation.by")} Yahia Ikni
              </a>
            </div>
          </Card>

          {/* Second Poster */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-0 pb-[141.4286%] overflow-hidden rounded-t-lg">
              <iframe
                loading="lazy"
                className="absolute w-full h-full top-0 left-0 border-none"
                src="https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="p-4 bg-card">
              <a
                href="https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?utm_content=DAG5KD43qYg&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {t("posters.poster2")} {t("home.presentation.by")} Yahia Ikni
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
