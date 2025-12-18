import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Globe, 
  Users, 
  Shield, 
  AlertCircle, 
  ExternalLink,
  Share2,
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
  Smile,
  Globe as GlobeIcon,
  Server,
  Code,
  BookOpen,
  TrendingUp,
  ShieldCheck
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
        Chargement de la page de soutien...
      </p>
    </div>
  </div>
);

export default function Support() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [showAdBlockerWarning, setShowAdBlockerWarning] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [adViews, setAdViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [domainProgress, setDomainProgress] = useState(0);
  const [domainAmount, setDomainAmount] = useState(25); // $25 for a domain
  const [currentAmount, setCurrentAmount] = useState(0);
  const adRef1 = useRef<HTMLDivElement>(null);
  const adRef2 = useRef<HTMLDivElement>(null);

  // Initialize page
  useEffect(() => {
    setIsLoading(true);
    
    const initializePage = async () => {
      try {
        // Check for ad blocker
        await checkAdBlocker();
        
        // Load AdSense script with proper error handling
        await loadAdSenseScript();
        
        // Start ad view simulation (only for demo purposes)
        startAdViewSimulation();
        
        // Initialize domain progress (simulated)
        initializeProgress();
        
      } catch (error) {
        console.error('Initialization error:', error);
        showAdErrorToast();
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdBlocker = async () => {
      try {
        const testElement = document.createElement('div');
        testElement.className = 'adsbygoogle';
        testElement.style.cssText = 'position:absolute;top:-1000px;left:-1000px;height:1px;width:1px;';
        document.body.appendChild(testElement);
        
        setTimeout(() => {
          const isBlocked = testElement.offsetHeight === 0;
          setShowAdBlockerWarning(isBlocked);
          if (isBlocked) {
            toast({
              title: t("support.adBlockTitle", "Blocage de publicités détecté"),
              description: t("support.adBlockMessage", "Veuillez désactiver votre bloqueur pour nous soutenir gratuitement."),
              variant: "destructive",
            });
          }
          document.body.removeChild(testElement);
        }, 100);
      } catch (error) {
        console.error('Ad blocker check failed:', error);
      }
    };

    const loadAdSenseScript = () => {
      return new Promise<void>((resolve, reject) => {
        const scriptId = 'adsbygoogle-script';
        
        // Check if script already exists
        if (document.getElementById(scriptId)) {
          initializeAds();
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
          showAdErrorToast();
          reject(error);
        };
        
        document.head.appendChild(script);
      });
    };

    const initializeAds = () => {
      try {
        if (window.adsbygoogle) {
          // Add page-level ads configuration
          window.adsbygoogle.push({
            google_ad_client: "ca-pub-6418144328904526",
            enable_page_level_ads: true,
            overlays: false
          });
          
          // Initialize ad slots with retry logic
          const initializeAdSlot = (element: HTMLDivElement | null, retries = 3) => {
            if (!element || retries <= 0) return;
            
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              
              // Show success toast for first ad
              if (retries === 3) {
                toast({
                  title: t("support.adsLoaded", "Publicités chargées"),
                  description: t("support.adsReady", "Les publicités sont prêtes à générer des revenus."),
                  variant: "default",
                });
              }
            } catch (error) {
              console.error('Ad initialization error:', error);
              setTimeout(() => initializeAdSlot(element, retries - 1), 1000);
            }
          };

          // Initialize ad slots when they become visible
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                initializeAdSlot(entry.target as HTMLDivElement);
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.1 });

          if (adRef1.current) observer.observe(adRef1.current);
          if (adRef2.current) observer.observe(adRef2.current);
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
        showAdErrorToast();
      }
    };

    const startAdViewSimulation = () => {
      // Simulate ad views for demo
      const interval = setInterval(() => {
        setAdViews(prev => {
          const newViews = prev + Math.floor(Math.random() * 2) + 1;
          
          // Every 10 views add $0.01 to progress (simulation)
          if (newViews % 10 === 0) {
            setCurrentAmount(prev => {
              const newAmount = Math.min(prev + 0.01, domainAmount);
              setDomainProgress((newAmount / domainAmount) * 100);
              return newAmount;
            });
          }
          
          return newViews;
        });
      }, 30000);
      
      return () => clearInterval(interval);
    };

    const initializeProgress = () => {
      // Simulate initial progress (you can replace with real data)
      const simulatedAmount = 0.50; // $0.50 already raised
      setCurrentAmount(simulatedAmount);
      setDomainProgress((simulatedAmount / domainAmount) * 100);
    };

    const showAdErrorToast = () => {
      toast({
        title: t("support.adErrorTitle", "Erreur de chargement des publicités"),
        description: t("support.adErrorDesc", "Impossible de charger les publicités. Veuillez réessayer."),
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retryAds}
            className="ml-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            {t("support.retry", "Réessayer")}
          </Button>
        ),
      });
    };

    // Add a small delay before initialization for better UX
    const timer = setTimeout(() => {
      initializePage();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, t]);

  const retryAds = () => {
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
        toast({
          title: t("support.retrySuccess", "Réessayer"),
          description: t("support.retrySuccessDesc", "Tentative de rechargement des publicités..."),
          variant: "default",
        });
      } catch (error) {
        toast({
          title: t("support.retryFailed", "Échec"),
          description: t("support.retryFailedDesc", "Impossible de recharger les publicités."),
          variant: "destructive",
        });
      }
    }
  };

  const impactStats = [
    {
      icon: Users,
      value: "300+",
      label: t("support.students", "Élèves sensibilisés"),
      color: "text-blue-600"
    },
    {
      icon: Leaf,
      value: "50+",
      label: t("support.bins", "Bacs de tri installés"),
      color: "text-green-600"
    },
    {
      icon: Trophy,
      value: "95%",
      label: t("support.satisfaction", "Taux de satisfaction"),
      color: "text-amber-600"
    },
    {
      icon: Zap,
      value: "1000+",
      label: t("support.resources", "Ressources éducatives"),
      color: "text-purple-600"
    }
  ];

  const fundingGoal = {
    title: t("support.domainGoal", "Acheter un nom de domaine"),
    description: t("support.domainGoalDesc", "Un nom de domaine professionnel pour notre plateforme éducative"),
    target: domainAmount,
    current: currentAmount,
    progress: domainProgress,
    icon: GlobeIcon,
    details: [
      t("support.domainDetail1", "Renouvellement annuel du domaine"),
      t("support.domainDetail2", "Certificat SSL pour la sécurité"),
      t("support.domainDetail3", "Adresse email professionnelle")
    ]
  };

  const howItWorks = [
    {
      icon: Eye,
      title: t("support.how1.title", "Comment nous gagnons de l'argent ?"),
      description: t("support.how1.desc", "Grâce aux publicités Google AdSense affichées sur cette page. Chaque clic et vue génère des revenus qui financent notre projet."),
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: t("support.how2.title", "Que faisons-nous avec l'argent ?"),
      description: t("support.how2.desc", "Nous utilisons 100% des revenus pour acheter et maintenir notre nom de domaine, garantissant l'accès permanent à nos ressources éducatives."),
      color: "text-green-600"
    },
    {
      icon: Globe,
      title: t("support.how3.title", "Qu'est-ce qu'un nom de domaine ?"),
      description: t("support.how3.desc", "C'est l'adresse unique de notre site web (ex: recyclagemaria.org). C'est essentiel pour être trouvé sur internet et avoir une présence professionnelle."),
      color: "text-purple-600"
    }
  ];

  const transparencyInfo = [
    {
      icon: ShieldCheck,
      title: t("support.transparency1.title", "Transparence totale"),
      description: t("support.transparency1.desc", "Nous publions des rapports mensuels sur l'utilisation des fonds.")
    },
    {
      icon: TrendingUp,
      title: t("support.transparency2.title", "Impact mesurable"),
      description: t("support.transparency2.desc", "Chaque dollar contribue directement à l'éducation environnementale.")
    },
    {
      icon: BookOpen,
      title: t("support.transparency3.title", "Ressources gratuites"),
      description: t("support.transparency3.desc", "Toutes nos ressources resteront toujours gratuites pour les écoles.")
    }
  ];

  const quickFacts = [
    { 
      icon: Clock, 
      text: t("support.fact1", "Projet lancé en 2023"),
      desc: t("support.fact1.desc", "Initiative éducative depuis plus d'un an")
    },
    { 
      icon: Award, 
      text: t("support.fact2", "Projet éducatif à but non lucratif"),
      desc: t("support.fact2.desc", "100% des revenus réinvestis")
    },
    { 
      icon: Infinity, 
      text: t("support.fact3", "Ressources gratuites à vie"),
      desc: t("support.fact3.desc", "Accès libre pour toutes les écoles")
    },
    { 
      icon: BarChart3, 
      text: t("support.fact4", "Rapports d'impact mensuels"),
      desc: t("support.fact4.desc", "Transparence sur nos progrès")
    }
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = language === 'fr' 
    ? "Soutenez Recyclage Maria - Aidez-nous à acheter notre nom de domaine pour l'éducation environnementale !" 
    : "Support Recyclage Maria - Help us buy our domain name for environmental education!";

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === 'fr' ? "Recyclage Maria - Soutien" : "Recyclage Maria - Support",
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Show loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

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
                    {language === 'fr' ? "Merci pour votre soutien !" : "Thank you for your support!"}
                  </p>
                  <p className="text-white/80 text-xs">
                    {language === 'fr' ? "Vous faites la différence !" : "You're making a difference!"}
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
            <span>{language === 'fr' ? "Objectif Principal" : "Primary Goal"}</span>
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
              {language === 'fr' ? "Achetons notre nom de domaine ensemble" : "Let's Buy Our Domain Name Together"}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {language === 'fr' 
              ? "Aidez-nous à acheter un nom de domaine professionnel pour maintenir notre plateforme éducative gratuite. Chaque vue de publicité nous rapproche de notre objectif !"
              : "Help us buy a professional domain name to maintain our free educational platform. Every ad view brings us closer to our goal!"}
          </motion.p>

          {/* Progress bar for domain goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GlobeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h3 className="font-bold text-lg">{fundingGoal.title}</h3>
                    <p className="text-sm text-muted-foreground">{fundingGoal.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(fundingGoal.current)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'fr' ? "sur" : "of"} {formatCurrency(fundingGoal.target)}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{language === 'fr' ? "Progression" : "Progress"}</span>
                  <span className="font-bold">{fundingGoal.progress.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fundingGoal.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                {fundingGoal.details.map((detail, index) => (
                  <div key={index} className="flex items-center gap-1 justify-center">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-xs">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Impact counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full px-5 py-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? "Publicités vues :" : "Ads viewed:"}
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
            transition={{ delay: 0.7 }}
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
                <span className="relative z-10">
                  {language === 'fr' ? "Partager la page" : "Share this page"}
                </span>
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
                <span className="relative z-10">
                  {language === 'fr' ? "Voir notre projet" : "View our project"}
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick facts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
          >
            {quickFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex flex-col items-center text-center bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-green-200 dark:border-green-800"
              >
                <fact.icon className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {fact.text}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {fact.desc}
                </span>
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
              {language === 'fr' ? "Notre Impact" : "Our Impact"}
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

        {/* How It Works Section */}
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
            {language === 'fr' ? "Comment fonctionne notre financement ?" : "How Our Funding Works"}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileHover="hover"
                variants={cardHoverVariants}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-green-200 dark:border-green-800 overflow-hidden group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 relative">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    >
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </motion.div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                  {language === 'fr' 
                    ? "Cette publicité finance notre nom de domaine" 
                    : "This ad funds our domain name"} 💚
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
                      {language === 'fr' ? "Blocage de publicités détecté" : "Ad Blocker Detected"}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                      {language === 'fr' 
                        ? "Veuillez désactiver votre bloqueur de pubs pour nous aider à financer notre domaine !" 
                        : "Please disable your ad blocker to help us fund our domain!"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="min-h-[280px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700 relative">
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'fr' 
                      ? "Chargement des publicités... Merci de votre soutien !" 
                      : "Loading ads... Thank you for your support!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transparency Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            {language === 'fr' ? "Transparence et Confiance" : "Transparency & Trust"}
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {transparencyInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-bold text-lg mb-2">{info.title}</h4>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed explanation */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800">
            <h4 className="text-xl font-bold mb-6 text-center">
              {language === 'fr' 
                ? "Questions fréquentes sur notre financement" 
                : "Frequently Asked Questions About Our Funding"}
            </h4>
            
            <div className="space-y-6">
              <div>
                <h5 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-600" />
                  {language === 'fr' 
                    ? "Pourquoi avons-nous besoin d'un nom de domaine ?" 
                    : "Why do we need a domain name?"}
                </h5>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'fr'
                    ? "Un nom de domaine (comme recyclagemaria.org) est essentiel pour avoir une présence professionnelle sur internet. Il permet aux écoles et enseignants de nous trouver facilement, de faire confiance à nos ressources, et d'accéder à notre contenu de manière sécurisée. Sans domaine, notre site serait beaucoup moins accessible et professionnel."
                    : "A domain name (like recyclagemaria.org) is essential for professional online presence. It allows schools and teachers to find us easily, trust our resources, and access our content securely. Without a domain, our website would be much less accessible and professional."}
                </p>
              </div>
              
              <div>
                <h5 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-600" />
                  {language === 'fr' 
                    ? "Comment les publicités génèrent-elles des revenus ?" 
                    : "How do ads generate revenue?"}
                </h5>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'fr'
                    ? "Google AdSense affiche des publicités pertinentes sur cette page. Chaque fois qu'un visiteur voit une publicité ou clique dessus, Google nous verse une petite commission. Ces micro-paiements s'accumulent pour financer notre projet. Plus il y a de visiteurs, plus nous pouvons collecter de fonds pour notre domaine."
                    : "Google AdSense displays relevant ads on this page. Each time a visitor sees or clicks on an ad, Google pays us a small commission. These micro-payments accumulate to fund our project. The more visitors we have, the more funds we can collect for our domain."}
                </p>
              </div>
              
              <div>
                <h5 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  {language === 'fr' 
                    ? "Que se passe-t-il après avoir atteint notre objectif ?" 
                    : "What happens after we reach our goal?"}
                </h5>
                <p className="text-gray-700 dark:text-gray-300">
                  {language === 'fr'
                    ? "Une fois notre nom de domaine acheté, nous continuerons à utiliser les revenus publicitaires pour le renouvellement annuel (environ 15$/an) et pour développer de nouvelles ressources éducatives. Notre priorité restera toujours de fournir un contenu éducatif gratuit et de qualité."
                    : "Once our domain name is purchased, we will continue using ad revenue for annual renewal (about $15/year) and to develop new educational resources. Our priority will always remain providing free, quality educational content."}
                </p>
              </div>
            </div>
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
                {language === 'fr' 
                  ? "Merci de soutenir l'éducation environnementale !" 
                  : "Thank you for supporting environmental education!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'fr'
                  ? "Chaque vue de publicité nous rapproche de notre objectif de domaine"
                  : "Every ad view brings us closer to our domain goal"} 🌱
              </p>
            </div>
            
            <div className="min-h-[250px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 relative">
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
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'fr'
                      ? "En attente des publicités... Votre soutien compte !"
                      : "Waiting for ads... Your support matters!"}
                  </p>
                </div>
              </div>
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
                {language === 'fr' 
                  ? "Ensemble, nous pouvons y arriver !" 
                  : "Together, we can do this!"}
              </h3>
              
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                {language === 'fr'
                  ? "Chaque petit geste compte. En partageant cette page et en désactivant votre bloqueur de publicités, vous contribuez directement à l'éducation environnementale de centaines d'élèves."
                  : "Every small action counts. By sharing this page and disabling your ad blocker, you directly contribute to the environmental education of hundreds of students."}
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
                    <span className="relative z-10">
                      {language === 'fr' ? "Partager cette page" : "Share this page"}
                    </span>
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
                    <span className="relative z-10">
                      {language === 'fr' ? "Autres moyens d'aider" : "Other ways to help"}
                    </span>
                  </Button>
                </motion.div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-8 pt-6 border-t border-green-200 dark:border-green-800">
                {language === 'fr' ? "Des questions ? Contactez-nous à" : "Questions? Contact us at"}{' '}
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
  );
}
