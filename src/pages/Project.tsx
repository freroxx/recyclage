import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trash2, FileText, Apple, Package } from "lucide-react";

export default function Project() {
  const { t } = useLanguage();
  useScrollReveal();

  const bins = [
    { icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", key: "plastic" },
    { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10", key: "paper" },
    { icon: Apple, color: "text-green-500", bg: "bg-green-500/10", key: "organic" },
    { icon: Trash2, color: "text-gray-500", bg: "bg-gray-500/10", key: "metal" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("project.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("project.intro")}
          </p>
        </div>

        {/* Sorting Bins */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center scroll-reveal">{t("project.bins.title")}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {bins.map((bin, index) => (
              <Card
                key={bin.key}
                className="hover:shadow-lg transition-all hover:-translate-y-2 scroll-reveal"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${bin.bg} flex items-center justify-center mx-auto mb-3`}>
                    <bin.icon className={`w-8 h-8 ${bin.color}`} />
                  </div>
                  <h3 className="font-bold">{t(`project.bins.${bin.key}`)}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 scroll-fade-left">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2 text-primary">
                {t("project.implementation")}
              </h3>
              <p className="text-muted-foreground">{t("project.implementation.desc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/5 to-transparent border-accent/20 scroll-reveal">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2 text-accent-foreground">
                {t("project.awareness")}
              </h3>
              <p className="text-muted-foreground">{t("project.awareness.desc")}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary to-transparent scroll-fade-right">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2 text-foreground">
                {t("project.mobilization")}
              </h3>
              <p className="text-muted-foreground">{t("project.mobilization.desc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
