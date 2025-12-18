import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  CheckCircle2,
  Gift,
  CreditCard,
  Target,
  Trophy,
  Coins,
  Zap,
  ChevronRight,
  ArrowUpRight,
  Infinity,
  BadgeCheck,
  Star,
  RefreshCw,
  DollarSign,
  Lightbulb
} from "lucide-react";

export default function Support() {
  const { t, language } = useLanguage();
  const [showAdBlockerWarning, setShowAdBlockerWarning] = useState(false);
  const [adError, setAdError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [adViews, setAdViews] = useState(0);

  // Check for ad blocker and handle AdSense
  useEffect(() => {
    const checkAdBlocker = async () => {
      try {
        const testUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        await fetch(testUrl, { method: 'HEAD', mode: 'no-cors' });
      } catch {
        setShowAdBlockerWarning(true);
      }
    };

    checkAdBlocker();

    // Load AdSense ads
    const loadAds = () => {
      try {
        // Simulate ad views for demo
        const interval = setInterval(() => {
          setAdViews(prev => prev + Math.floor(Math.random() * 5));
        }, 30000);

        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});

        return () => clearInterval(interval);
      } catch (error) {
        console.error('AdSense error:', error);
        setAdError(true);
      }
    };

    const timer = setTimeout(() => {
      if (document.readyState === 'complete') {
        loadAds();
      } else {
        window.addEventListener('load', loadAds);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', loadAds);
    };
  }, []);

  const impactStats = [
    {
      icon: Users,
      value: "300+",
      label: t("support.students", "students educated")
    },
    {
      icon: Leaf,
      value: "50+",
      label: t("support.bins", "recycling bins installed")
    },
    {
      icon: Trophy,
      value: "95%",
      label: t("support.satisfaction", "satisfaction rate")
    },
    {
      icon: Zap,
      value: "1000+",
      label: t("support.resources", "educational resources")
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: t("support.benefit1.title", "Website Hosting & Maintenance"),
      description: t("support.benefit1.desc", "Keep our educational platform online and updated 24/7"),
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Globe,
      title: t("support.benefit2.title", "Free Educational Resources"),
      description: t("support.benefit2.desc", "Develop new guides, activities, and learning materials"),
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Sparkles,
      title: t("support.benefit3.title", "School Recycling Program"),
      description: t("support.benefit3.desc", "Fund physical recycling bins and collection programs"),
      gradient: "from-purple-500/10 to-pink-500/10"
    }
  ];

  const fundUsage = [
    { percentage: "45%", label: t("support.fund1", "Website hosting & domain") },
    { percentage: "30%", label: t("support.fund2", "Educational materials development") },
    { percentage: "15%", label: t("support.fund3", "Recycling equipment for schools") },
    { percentage: "10%", label: t("support.fund4", "Community workshops & events") }
  ];

  const testimonials = [
    {
      quote: t("support.testimonial1", "This project completely changed how our students think about recycling!"),
      author: t("support.teacher", "Maria School Teacher"),
      role: t("support.role1", "Science Department")
    },
    {
      quote: t("support.testimonial2", "I love the interactive activities! Learning about recycling has never been so fun."),
      author: t("support.student", "Lucas, 5th Grade"),
      role: t("support.role2", "Student Ambassador")
    }
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = t("support.shareText", "Support Recyclage Maria - Join us in making schools more eco-friendly!");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("support.shareTitle", "Recyclage Maria"),
          text: shareText,
          url: shareUrl,
        });
        setShowThankYou(true);
        setTimeout(() => setShowThankYou(false), 3000);
      } catch (error) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    }
  };

  const handleSupportClick = () => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const buttonHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-primary/5 text-foreground theme-transition overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/3 to-cyan-500/3 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Floating thank you message */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-20 right-8 z-50"
          >
            <Card className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md border-0 shadow-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <Heart className="w-6 h-6 text-white animate-pulse" />
                <div>
                  <p className="font-bold text-white text-sm">
                    {t("support.thankYouQuick", "Thank you for your support!")}
                  </p>
                  <p className="text-white/80 text-xs">
                    {t("support.makingDifference", "You're making a difference!")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex flex-col items-center justify-center text-center px-4 py-20 md:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 border-b border-green-200 dark:border-green-800"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-green-200 dark:border-green-800 shadow-lg"
          >
            <Heart className="w-4 h-4" />
            <span>{t("support.heroTag", "Join Our Mission")}</span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 ml-1" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {t("support.title", "Support Our Eco-Education Project")}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t(
              "support.intro",
              "Help us maintain this free educational platform and bring recycling education to schools worldwide. Every contribution supports sustainable education."
            )}
          </motion.p>

          {/* Impact counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full px-5 py-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("support.adsViewed", "Ads viewed this session:")}
                </span>
              </div>
              <span className="font-bold text-green-700 dark:text-green-300">
                {adViews.toLocaleString()}
              </span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            variants={containerVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.div
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl gap-3 group"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span>{t("support.share", "Share with Friends")}</span>
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.span>
              </Button>
            </motion.div>

            <motion.div
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 gap-3 group"
                onClick={() => window.open('/project', '_blank')}
              >
                <ExternalLink className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                <span>{t("support.learnMore", "Learn About Our Project")}</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 max-w-6xl">
        {/* Impact Stats */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.1 }}
          className="mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-10"
          >
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              {t("support.impactTitle", "Our Environmental Impact")}
            </span>
          </motion.h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
              >
                <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <stat.icon className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Support Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
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
            {t("support.whyTitle", "Why Your Support Matters")}
          </motion.h2>

          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 md:p-10 border-2 border-green-200 dark:border-green-800 backdrop-blur-sm"
          >
            <div className="flex items-start gap-4 mb-6">
              <Lightbulb className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {t(
                  "support.mainText",
                  "Recyclage Maria is a 100% free educational initiative. We believe eco-education should be accessible to every school, everywhere. Your support through viewing ads on this page directly funds our platform's hosting, domain costs, and the development of new educational resources. Every interaction helps us reach more students and create a greener future."
                )}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-muted-foreground">
                {t("support.fact", "Non-profit educational project since 2023")}
              </span>
              <Infinity className="w-5 h-5 text-green-600 dark:text-green-400 ml-4" />
              <span className="text-sm text-muted-foreground">
                {t("support.free", "100% free resources forever")}
              </span>
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  <CardContent className="p-6 relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    >
                      <benefit.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Fund Usage Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            {t("support.fundUsage", "How Your Support Is Used")}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {fundUsage.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-green-700 dark:text-green-400">
                    {item.percentage}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className="relative">
              <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800">
                <Target className="absolute top-6 right-6 w-8 h-8 text-green-600 dark:text-green-400" />
                <div className="space-y-4">
                  <h4 className="text-xl font-bold">
                    {t("support.transparency", "Full Transparency")}
                  </h4>
                  <p className="text-muted-foreground">
                    {t("support.transparencyDesc", "We publish annual reports showing exactly how every dollar is spent to support environmental education.")}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" className="gap-2 w-full">
                      <DollarSign className="w-4 h-4" />
                      {t("support.viewReport", "View Financial Report")}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* AdSense #1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="my-12"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-6 md:p-8 border-2 border-green-300 dark:border-green-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("support.adHelp", "This ad directly supports our project")} 💚
                </p>
              </div>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
            
            {showAdBlockerWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-4"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-1">
                      {t("support.adBlockerTitle", "Ad Blocker Detected")}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      {t("support.adBlockerMessage", "Please consider disabling your ad blocker for this site. Ads are our primary funding source!")}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="min-h-[280px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700">
              <ins
                className="adsbygoogle block mx-auto"
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '728px',
                  minHeight: '280px'
                }}
                data-ad-client="ca-pub-6418144328904526"
                data-ad-slot="XXXXXXXX"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            {t("support.testimonials", "What Our Community Says")}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                        <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-bold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-6 md:p-8 border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
            <div className="text-center mb-6">
              <Gift className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                {t("support.thankYouTitle", "Thank You for Supporting Education!")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("support.thankYouDesc", "Every ad view helps us create free resources for schools")} 🌱
              </p>
            </div>
            
            <div className="min-h-[250px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700">
              <ins
                className="adsbygoogle block mx-auto"
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '728px',
                  minHeight: '250px'
                }}
                data-ad-client="ca-pub-6418144328904526"
                data-ad-slot="YYYYYYY"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="border-2 border-green-300 dark:border-green-700 bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 shadow-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity }
                }}
              >
                <Heart className="w-14 h-14 text-green-600 dark:text-green-400 mx-auto mb-6" />
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-4">
                {t("support.thanksTitle", "Together, We're Making a Difference")}
              </h3>
              
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                {t("support.thanksMessage", "Your support enables us to continue providing free environmental education to schools worldwide. Join our growing community of eco-champions!")}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSupportClick}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg gap-3 group"
                    size="lg"
                  >
                    <Share2 className="w-5 h-5" />
                    {t("support.shareAgain", "Share This Page")}
                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => window.open('/contact', '_blank')}
                    className="border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 px-8 py-6 text-lg gap-3"
                    size="lg"
                  >
                    <CreditCard className="w-5 h-5" />
                    {t("support.otherWays", "Other Ways to Help")}
                  </Button>
                </motion.div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-8">
                {t("support.contactInfo", "Questions? Contact us at")}{' '}
                <a href="mailto:contact@recyclagemaria.org" className="text-green-600 dark:text-green-400 hover:underline">
                  contact@recyclagemaria.org
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
