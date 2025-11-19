import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroImage from "@/assets/hero-eco.jpg";

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg animate-slide-in-left">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-md animate-slide-in-right [animation-delay:200ms]">
            {t("hero.subtitle")}
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-bounce-in [animation-delay:400ms]"
            onClick={() => navigate("/project")}
          >
            {t("hero.cta")}
          </Button>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card hover:shadow-lg transition-all hover:-translate-y-2 scroll-reveal">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("project.implementation")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("project.implementation.desc")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all hover:-translate-y-2 scroll-reveal [transition-delay:100ms]">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("project.awareness")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("project.awareness.desc")}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-all hover:-translate-y-2 scroll-reveal [transition-delay:200ms]">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t("project.mobilization")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("project.mobilization.desc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Canva Presentation Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.presentation.title")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("home.presentation.subtitle")}
            </p>
          </div>
          
          <div className="relative scroll-fade-left">
            <div className="relative w-full h-0 pb-[56.25%] rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)] transition-all duration-500 bg-card border border-border/50">
              <iframe
                loading="lazy"
                className="absolute w-full h-full top-0 left-0 border-0"
                src="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?embed"
                allowFullScreen
                allow="fullscreen"
              />
            </div>
            <div className="text-center mt-4">
              <a
                href="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?utm_content=DAG5CGlo4U8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                How To Recycle Waste {t("home.presentation.by")} Yahia Ikni
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
