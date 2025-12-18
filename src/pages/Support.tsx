import { useEffect } from "react";
import { motion } from "framer-motion"; // pour animations scroll
import { useLanguage } from "@/contexts/LanguageContext"; // ton context
import { Footer } from "@/components/Footer";

export default function Support() {
  const { t } = useLanguage(); // traduction

  // AdSense
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground theme-transition">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center justify-center text-center px-4 py-24 bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-200"
      >
        <h1 className="text-5xl font-extrabold mb-6">
          {t("support_title", "Soutenez notre projet ♻️")}
        </h1>
        <p className="max-w-2xl text-lg">
          {t(
            "support_intro",
            "Cette page aide à financer le domaine et maintenir le projet actif. Chaque action compte pour un futur plus vert !"
          )}
        </p>
      </motion.section>

      {/* Contenu explicatif */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 py-16 space-y-12"
      >
        <motion.h2
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center"
        >
          {t("support_why", "Pourquoi nous soutenir ?")}
        </motion.h2>

        <motion.p
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-muted-foreground"
        >
          {t(
            "support_text",
            "Votre soutien permet à l’école Maria de mettre en place des actions concrètes de recyclage et sensibilisation auprès des élèves. Les publicités affichées sur cette page nous aident à maintenir le site et financer le domaine."
          )}
        </motion.p>

        {/* AdSense #1 */}
        <div className="flex justify-center my-8">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-6418144328904526"
            data-ad-slot="XXXXXXXX"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-semibold">{t("support_impact", "Impact du projet")}</h3>
          <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
            <li>{t("support_point1", "Sensibilisation de plus de 300 élèves à l'écologie.")}</li>
            <li>{t("support_point2", "Installation de bacs de tri dans toute l'école.")}</li>
            <li>{t("support_point3", "Organisation d'ateliers et activités sur le recyclage.")}</li>
          </ul>
        </motion.div>

        {/* AdSense #2 */}
        <div className="flex justify-center my-8">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-6418144328904526"
            data-ad-slot="YYYYYYY"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </motion.section>

      {/* Footer intégré */}
      <Footer />
    </main>
  );
}
