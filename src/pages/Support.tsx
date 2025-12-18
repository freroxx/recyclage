import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Globe, 
  Users, 
  Shield, 
  AlertCircle, 
  ExternalLink,
  Share2,
  TrendingUp,
  Sparkles,
  Leaf,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Support() {
  const { t } = useLanguage();
  const [showAdBlockerWarning, setShowAdBlockerWarning] = useState(false);
  const [adError, setAdError] = useState(false);

  // Check for ad blocker and handle AdSense
  useEffect(() => {
    const checkAdBlocker = async () => {
      try {
        // Test request to Google AdSense
        const testUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        const response = await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
      } catch {
        setShowAdBlockerWarning(true);
      }
    };

    checkAdBlocker();

    // Load AdSense ads
    const loadAds = () => {
      try {
        // Push each ad individually to ensure they load
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
        setAdError(true);
      }
    };

    // Delay ad loading for better UX
    const timer = setTimeout(() => {
      if (document.readyState === 'complete') {
        loadAds();
      } else {
        window.addEventListener('load', loadAds);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', loadAds);
    };
  }, []);

  const impactStats = [
    {
      icon: Users,
      value: "300+",
      label: t("support.students", "Élèves sensibilisés")
    },
    {
      icon: Leaf,
      value: "50+",
      label: t("support.bins", "Bacs de tri installés")
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: t("support.participation", "Participation aux ateliers")
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: t("support.benefit1.title", "Site maintenu à jour"),
      description: t("support.benefit1.desc", "Mises à jour régulières et nouvelles ressources")
    },
    {
      icon: Globe,
      title: t("support.benefit2.title", "Accès gratuit permanent"),
      description: t("support.benefit2.desc", "Toutes les ressources restent gratuites pour tous")
    },
    {
      icon: Sparkles,
      title: t("support.benefit3.title", "Impact environnemental réel"),
      description: t("support.benefit3.desc", "Actions concrètes de recyclage à l'école")
    }
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = t("support.shareText", "Découvrez le projet Recyclage Maria et soutenez l'écologie à l'école !");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("support.title", "Recyclage Maria - Soutien"),
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert(t("support.copied", "Lien copié dans le presse-papier !"));
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground theme-transition overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-1/4 left-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Hero Section - Improved */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-green-200 dark:border-green-800"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-5" />
        
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-green-200 dark:border-green-800"
        >
          <Heart className="w-4 h-4" />
          <span>{t("support.heroTag", "Soutien & Contribution")}</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
          <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {t("support.title", "Soutenez notre projet ♻️")}
          </span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
        >
          {t(
            "support.intro",
            "Votre support aide à financer l'hébergement du site et à développer de nouvelles ressources éducatives sur le recyclage."
          )}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            {t("support.share", "Partager la page")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => window.open('/project', '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            {t("support.learnMore", "Voir le projet")}
          </Button>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10 max-w-5xl">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-10">
            {t("support.impactTitle", "Notre impact jusqu'à présent")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Support Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-12 mb-16"
        >
          <motion.h2
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center"
          >
            {t("support.whyTitle", "Pourquoi votre soutien est important ?")}
          </motion.h2>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border border-green-200 dark:border-green-800"
          >
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t(
                "support.mainText",
                "Recyclage Maria est un projet éducatif entièrement gratuit. Votre soutien via les publicités affichées sur cette page nous permet de couvrir les coûts d'hébergement, de nom de domaine, et de développer de nouvelles ressources pédagogiques. Chaque clic contribue directement à l'éducation environnementale des élèves de l'école Maria."
              )}
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                      <benefit.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AdSense #1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="my-12"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.adHelp", "Cette publicité aide à financer le projet")} 💚
              </p>
              
              {showAdBlockerWarning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        {t("support.adBlockerTitle", "Blocage de publicités détecté")}
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                        {t("support.adBlockerMessage", "Veuillez désactiver votre bloqueur de pubs pour nous soutenir gratuitement !")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {adError && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {t("support.adError", "Les publicités n'ont pas pu charger. Merci de rafraîchir la page.")}
                  </p>
                </div>
              )}
              
              <ins
                className="adsbygoogle block text-center"
                style={{
                  display: 'block',
                  minHeight: '280px',
                  minWidth: '300px'
                }}
                data-ad-client="ca-pub-6418144328904526"
                data-ad-slot="XXXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true"
                data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
              ></ins>
            </div>
          </motion.div>
        </motion.section>

        {/* How Support Helps Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6 mb-16"
        >
          <h3 className="text-2xl font-semibold text-center">
            {t("support.howHelps", "Comment votre soutien est utilisé")}
          </h3>
          
          <div className="space-y-4">
            {[
              t("support.use1", "Hébergement du site web et maintenance technique"),
              t("support.use2", "Achat et renouvellement du nom de domaine"),
              t("support.use3", "Développement de nouvelles ressources éducatives"),
              t("support.use4", "Achat de matériel pour les ateliers de recyclage"),
              t("support.use5", "Impression d'affiches et documents pédagogiques")
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AdSense #2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="my-12"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t("support.thankYou", "Merci de votre soutien ! Chaque vue compte. 🌱")}
            </p>
            <ins
              className="adsbygoogle block text-center"
              style={{
                display: 'block',
                minHeight: '250px',
                minWidth: '300px'
              }}
              data-ad-client="ca-pub-6418144328904526"
              data-ad-slot="YYYYYYY"
              data-ad-format="auto"
              data-full-width-responsive="true"
              data-adtest={process.env.NODE_ENV === 'development' ? 'on' : 'off'}
            ></ins>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
            <CardContent className="p-8">
              <Heart className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                {t("support.thanksTitle", "Un grand merci pour votre soutien !")}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {t("support.thanksMessage", "Grâce à vous, nous pouvons continuer à éduquer et sensibiliser les générations futures à l'importance du recyclage et de la protection de l'environnement.")}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleShare}
                  className="gap-2"
                  size="lg"
                >
                  <Share2 className="w-4 h-4" />
                  {t("support.shareAgain", "Partager avec vos amis")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="gap-2"
                >
                  <Heart className="w-4 h-4" />
                  {t("support.backToTop", "Remonter en haut")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
