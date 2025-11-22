import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { FileText, Palette, Video, ImageIcon } from "lucide-react";

export default function Resources() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();

  const resources = [
    { icon: FileText, key: "guides", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Palette, key: "activities", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: Video, key: "videos", color: "text-red-500", bg: "bg-red-500/10" },
    { icon: ImageIcon, key: "posters", color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("resources.title")}
          </h1>
          <p className="text-lg text-muted-foreground">{t("resources.subtitle")}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <Card
              key={resource.key}
              className={`hover:shadow-lg transition-all hover:-translate-y-2 scroll-reveal`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className={`w-14 h-14 rounded-lg ${resource.bg} flex items-center justify-center mb-4`}>
                  <resource.icon className={`w-7 h-7 ${resource.color}`} />
                </div>
                <h3 className="font-bold text-lg mb-3">
                  {t(`resources.${resource.key}`)}
                </h3>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    if (resource.key === "posters") navigate("/posters");
                    if (resource.key === "guides") navigate("/guide");
                    if (resource.key === "videos") navigate("/videos");
                    if (resource.key === "activities") navigate("/activities");
                  }}
                >
                  {t("resources.view")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
