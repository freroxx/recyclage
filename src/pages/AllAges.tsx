import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Construction } from "lucide-react";

export default function AllAges() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("allAges.title")}
          </h1>
        </div>

        <Card className="animate-slide-up">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Construction className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{t("allAges.developing")}</h2>
            <p className="text-muted-foreground text-lg">{t("allAges.coming")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
