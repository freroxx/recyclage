import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-eco.jpg";

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-md">
            {t("hero.subtitle")}
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/project")}
          >
            {t("hero.cta")}
          </Button>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card hover:shadow-lg transition-shadow animate-slide-up">
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

          <Card className="bg-card hover:shadow-lg transition-shadow animate-slide-up [animation-delay:100ms]">
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

          <Card className="bg-card hover:shadow-lg transition-shadow animate-slide-up [animation-delay:200ms]">
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
    </div>
  );
}
