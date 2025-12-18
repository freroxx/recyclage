import { useEffect, useState, useRef, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Lightbulb,
  Award,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  Loader2,
  HelpCircle,
  Smile
} from "lucide-react";

// Declare global AdSense types
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background/95 to-primary/5">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto" />
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Loading support page...
      </p>
    </div>
  </div>
);

export default function Support() {
  const { t, language } = useLanguage();
  const [showAdBlockerWarning, setShowAdBlockerWarning] = useState(false);
  const [adError, setAdError] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [adViews, setAdViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [hasScriptError, setHasScriptError] = useState(false);
  const adRef1 = useRef<HTMLDivElement>(null);
  const adRef2 = useRef<HTMLDivElement>(null);

  // Check if we're on the client side and initialize
  useEffect(() => {
    setIsLoading(true);
    
    const initializePage = async () => {
      try {
        // Check for ad blocker
        await checkAdBlocker();
        
        // Load AdSense script
        await loadAdSenseScript();
        
        // Start ad view simulation (only for demo purposes)
        startAdViewSimulation();
        
      } catch (error) {
        console.error('Initialization error:', error);
        setAdError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdBlocker = async () => {
      try {
        // Multiple methods to detect ad blocker
        const testElement = document.createElement('div');
        testElement.className = 'adsbygoogle';
        testElement.style.cssText = 'position:absolute;top:-1000px;left:-1000px;height:1px;width:1px;';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
          const isBlocked = testElement.offsetHeight === 0;
          setIsAdBlocked(isBlocked);
          setShowAdBlockerWarning(isBlocked);
          document.body.removeChild(testElement);
        }, 100);
        
        // Additional check with fetch
        try {
          await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
            method: 'HEAD',
            mode: 'no-cors'
          });
        } catch {
          setIsAdBlocked(true);
          setShowAdBlockerWarning(true);
        }
      } catch (error) {
        console.error('Ad blocker check failed:', error);
      }
    };

    const loadAdSenseScript = () => {
      return new Promise<void>((resolve, reject) => {
        const scriptId = 'adsbygoogle-script';
        
        // Check if script already exists
        if (document.getElementById(scriptId)) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6418144328904526';
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          console.log('✅ AdSense script loaded successfully');
          initializeAds();
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('❌ Failed to load AdSense script:', error);
          setHasScriptError(true);
          setAdError(true);
          reject(error);
        };
        
        document.head.appendChild(script);
      });
    };

    const initializeAds = () => {
      try {
        if (window.adsbygoogle) {
          // Initialize ads with retry logic
          const initializeAd = (slot: string, retries = 3) => {
            try {
              window.adsbygoogle.push({
                google_ad_client: "ca-pub-6418144328904526",
                enable_page_level_ads: true,
                overlays: false
              });
            } catch (error) {
              if (retries > 0) {
                setTimeout(() => initializeAd(slot, retries - 1), 1000);
              } else {
                console.error(`Failed to initialize ad slot ${slot}:`, error);
              }
            }
          };

          // Initialize both ad slots
          initializeAd('XXXXXXXX');
          initializeAd('YYYYYYY');
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
        setAdError(true);
      }
    };

    const startAdViewSimulation = () => {
      // Only simulate ad views in development
      if (process.env.NODE_ENV === 'development') {
        const interval = setInterval(() => {
          setAdViews(prev => prev + Math.floor(Math.random() * 3) + 1);
        }, 30000);
        return () => clearInterval(interval);
      }
    };

    // Add a small delay before initialization for better UX
    const timer = setTimeout(() => {
      initializePage();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Intersection Observer for lazy loading ads
  useEffect(() => {
    if (isLoading || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && window.adsbygoogle) {
            try {
              window.adsbygoogle.push({});
            } catch (error) {
              console.error('Error loading visible ad:', error);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    if (adRef1.current) observer.observe(adRef1.current);
    if (adRef2.current) observer.observe(adRef2.current);

    return () => {
      observer.disconnect();
    };
  }, [isLoading]);

  const impactStats = [
    {
      icon: Users,
      value: "150+",
      label: t("Utilisateurs", "students educated"),
      color: "text-blue-600"
    },
    {
      icon: Leaf,
      value: "4",
      label: t("Types de déchets", "recycling bins installed"),
      color: "text-green-600"
    },
    {
      icon: Trophy,
      value: "95%",
      label: t("Satisfaction Globale", "satisfaction rate"),
      color: "text-amber-600"
    },
    {
      icon: Zap,
      value: "Google",
      label: t("Fournisseur de publicité", "educational resources"),
      color: "text-purple-600"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: t("support.benefit1.title", "Website Hosting & Maintenance"),
      description: t("support.benefit1.desc", "Keep our educational platform online and updated 24/7"),
      gradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-200"
    },
    {
      icon: Globe,
      title: t("support.benefit2.title", "Free Educational Resources"),
      description: t("support.benefit2.desc", "Develop new guides, activities, and learning materials"),
      gradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-200"
    },
    {
      icon: Sparkles,
      title: t("support.benefit3.title", "School Recycling Program"),
      description: t("support.benefit3.desc", "Fund physical recycling bins and collection programs"),
      gradient: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-200"
    }
  ];

  const fundUsage = [
    { 
      percentage: "0%", 
      label: t("Objectif 1", "Website hosting & domain"),
      description: t("support.fund1.desc", "Server costs and domain renewal")
    },
    { 
      percentage: "0%", 
      label: t("Objectif 2", "Educational materials development"),
      description: t("support.fund2.desc", "Creating new content and resources")
    },
    { 
      percentage: "0%", 
      label: t("Objectif 3", "Recycling equipment for schools"),
      description: t("support.fund3.desc", "Bins, sorting stations, and tools")
    },
    { 
      percentage: "0%", 
      label: t("Objectif 4", "Community workshops & events"),
      description: t("support.fund4.desc", "Educational events and outreach")
    }
  ];

  const testimonials = [
    {
      quote: t("support.testimonial1", "This project completely changed how our students think about recycling! The resources are incredibly valuable."),
      author: t("support.teacher", "Maria School Teacher"),
      role: t("support.role1", "Science Department"),
      rating: 5
    },
    {
      quote: t("support.testimonial2", "I love the interactive activities! Learning about recycling has never been so fun. My whole class is engaged!"),
      author: t("support.student", "Lucas, 5th Grade"),
      role: t("support.role2", "Student Ambassador"),
      rating: 5
    }
  ];

  const quickFacts = [
    { icon: Clock, text: t("support.fact1", "Founded in 2023") },
    { icon: Award, text: t("support.fact2", "Non-profit educational project") },
    { icon: Infinity, text: t("support.fact3", "100% free forever") },
    { icon: BarChart3, text: t("support.fact4", "Monthly impact reports") }
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = t("support.shareText", "Support Recyclage Maria - Join us in making schools more eco-friendly!");

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: t("support.shareTitle", "Recyclage Maria"),
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      }
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    } catch (error) {
      // Share cancelled or failed - silent fail
    }
  };

  const handleRetryAds = () => {
    setAdError(false);
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
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
        damping: 12
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
        damping: 20
      }
    },
    tap: { scale: 0.97 }
  };

  const cardHoverVariants = {
    rest: { y: 0 },
    hover: { 
      y: -8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
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
              className="fixed top-20 right-4 md:right-8 z-50"
            >
              <Card className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-md border-0 shadow-2xl max-w-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "linear" }}
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </motion.div>
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center text-center px-4 py-20 md:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 border-b border-green-200 dark:border-green-800"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-5 bg-center" />
          
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
                "Help us maintain this free educational platform and bring recycling education to schools worldwide. Every contribution supports sustainable education for future generations."
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
                  <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
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
              className="flex flex-wrap gap-3 justify-center"
            >
              <motion.div
                variants={buttonHoverVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl gap-3 group relative overflow-hidden"
                  onClick={handleShare}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <Share2 className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10">{t("support.share", "Share with Friends")}</span>
                  <ArrowUpRight className="w-5 h-5 relative z-10" />
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
                  className="border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 gap-3 group relative"
                  onClick={() => window.open('/project', '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50/0 via-green-100/20 to-green-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <ExternalLink className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="relative z-10">{t("support.learnMore", "Learn About Our Project")}</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Quick facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
            >
              {quickFacts.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-lg px-3 py-2"
                >
                  <fact.icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>{fact.text}</span>
                </motion.div>
              ))}
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
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/50 backdrop-blur-sm h-full group">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-14 h-14 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl"
                      >
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
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
              className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 md:p-10 border-2 border-green-200 dark:border-green-800 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <Lightbulb className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(
                      "support.mainText",
                      "Recyclage Maria is a 100% free educational initiative. We believe eco-education should be accessible to every school, everywhere. Your support through viewing ads on this page directly funds our platform's hosting, domain costs, and the development of new educational resources. Every interaction helps us reach more students and create a greener future."
                    )}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-green-200 dark:border-green-800">
                  <BadgeCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    {t("support.fact", "Non-profit educational project since 2023")}
                  </span>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                  <Infinity className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-muted-foreground">
                    {t("support.free", "100% free resources forever")}
                  </span>
                </div>
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
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  <Card className={`h-full hover:shadow-2xl transition-all duration-300 border-2 ${benefit.borderColor} dark:border-green-800 overflow-hidden group relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                    <CardContent className="p-6 relative">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
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
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 hover:bg-gradient-to-r hover:from-green-100/50 hover:to-emerald-100/50 dark:hover:from-green-800/20 dark:hover:to-emerald-800/20 transition-all duration-300 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="font-bold text-green-700 dark:text-green-400">
                        {item.percentage}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {item.description}
                    </p>
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
                      <Button variant="outline" className="gap-2 w-full group">
                        <DollarSign className="w-4 h-4" />
                        {t("support.viewReport", "View Financial Report")}
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* AdSense #1 */}
          <motion.div
            ref={adRef1}
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
              
              {adError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">
                        {t("support.adError", "Ad Loading Issue")}
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-400">
                        {t("support.adErrorMessage", "We're having trouble loading ads. You can still support us by sharing this page!")}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 gap-2"
                        onClick={handleRetryAds}
                      >
                        <RefreshCw className="w-3 h-3" />
                        {t("support.retry", "Retry Loading Ads")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {hasScriptError && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">
                        {t("support.scriptError", "Ad Script Issue")}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        {t("support.scriptErrorMessage", "Ad scripts couldn't load. Please ensure you have an active internet connection.")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="min-h-[280px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700">
                <ins
                  className="adsbygoogle block mx-auto"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '728px',
                    minHeight: '280px',
                    backgroundColor: 'transparent'
                  }}
                  data-ad-client="ca-pub-6418144328904526"
                  data-ad-slot="XXXXXXXX"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
                {adError && (
                  <div className="text-center p-8">
                    <Smile className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("support.adPlaceholder", "Ad placeholder - Thank you for your support!")}
                    </p>
                  </div>
                )}
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
                  whileHover="hover"
                  variants={cardHoverVariants}
                >
                  <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-green-200 dark:border-green-800">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
            ref={adRef2}
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
                    minHeight: '250px',
                    backgroundColor: 'transparent'
                  }}
                  data-ad-client="ca-pub-6418144328904526"
                  data-ad-slot="YYYYYYY"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
                {adError && (
                  <div className="text-center p-8">
                    <Heart className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                      {t("support.thankYouPlaceholder", "Thank you for visiting! Your support makes a difference.")}
                    </p>
                  </div>
                )}
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
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonHoverVariants}
                  >
                    <Button
                      onClick={handleShare}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg gap-3 group relative overflow-hidden"
                      size="lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <Share2 className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{t("support.shareAgain", "Share This Page")}</span>
                      <ChevronRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonHoverVariants}
                  >
                    <Button
                      variant="outline"
                      onClick={() => window.open('/contact', '_blank')}
                      className="border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 px-8 py-6 text-lg gap-3 group relative"
                      size="lg"
                    >
                      <CreditCard className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">{t("support.otherWays", "Other Ways to Help")}</span>
                    </Button>
                  </motion.div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-8 pt-6 border-t border-green-200 dark:border-green-800">
                  {t("support.contactInfo", "Questions? Contact us at")}{' '}
                  <a 
                    href="mailto:contact@recyclagemaria.org" 
                    className="text-green-600 dark:text-green-400 hover:underline font-medium"
                  >
                    contact@recyclagemaria.org
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </Suspense>
  );
}
