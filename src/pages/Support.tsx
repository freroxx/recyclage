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
  ShieldCheck,
  Info
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
        showAdErrorToast("Erreur d'initialisation", "Impossible de charger les ressources.");
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
            showAdErrorToast(
              language === 'fr' ? "Blocage de publicités détecté" : "Ad Blocker Detected",
              language === 'fr' 
                ? "Veuillez désactiver votre bloqueur pour nous soutenir gratuitement." 
                : "Please disable your ad blocker to support us for free."
            );
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
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('❌ Failed to load AdSense script:', error);
          showAdErrorToast(
            language === 'fr' ? "Erreur de chargement des publicités" : "Ad Loading Error",
            language === 'fr' 
              ? "Impossible de charger les publicités. Veuillez réessayer." 
              : "Unable to load ads. Please try again."
          );
          reject(error);
        };
        
        document.head.appendChild(script);
      });
    };

    const initializeAds = () => {
      try {
        if (window.adsbygoogle) {
          // Push the ads to initialize them
          window.adsbygoogle.push({});
          window.adsbygoogle.push({});
          
          toast({
            title: language === 'fr' ? "Publicités chargées" : "Ads Loaded",
            description: language === 'fr' 
              ? "Les publicités sont prêtes à générer des revenus pour notre projet." 
              : "Ads are ready to generate revenue for our project.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Ad initialization error:', error);
        showAdErrorToast(
          language === 'fr' ? "Erreur d'initialisation des publicités" : "Ad Initialization Error",
          language === 'fr' 
            ? "Les publicités n'ont pas pu être initialisées correctement." 
            : "Ads could not be initialized properly."
        );
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
              const newAmount = Math.min(prev + 0.05, domainAmount);
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
      // Simulate initial progress
      const simulatedAmount = 0; // $0
      setCurrentAmount(simulatedAmount);
      setDomainProgress((simulatedAmount / domainAmount) * 100);
    };

    const showAdErrorToast = (title: string, description: string) => {
      toast({
        title,
        description,
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={retryAds}
            className="ml-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            {language === 'fr' ? "Réessayer" : "Retry"}
          </Button>
        ),
      });
    };

    // Initialize ads after a short delay
    const timer = setTimeout(() => {
      initializePage();
      setTimeout(initializeAds, 500); // Initialize ads 0.5 second after page load
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, language]);

  const retryAds = () => {
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
        toast({
          title: language === 'fr' ? "Réessayer" : "Retry",
          description: language === 'fr' 
            ? "Tentative de rechargement des publicités..." 
            : "Attempting to reload ads...",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: language === 'fr' ? "Échec" : "Failed",
          description: language === 'fr' 
            ? "Impossible de recharger les publicités." 
            : "Unable to reload ads.",
          variant: "destructive",
        });
      }
    }
  };

  const impactStats = [
    {
      icon: Users,
      value: "150+",
      label: language === 'fr' ? "Élèves sensibilisés" : "Students educated",
      color: "text-blue-600"
    },
    {
      icon: Leaf,
      value: "4",
      label: language === 'fr' ? "Bacs de tri installés" : "Recycling bins installed",
      color: "text-green-600"
    },
    {
      icon: Trophy,
      value: "95%",
      label: language === 'fr' ? "Taux de satisfaction" : "Satisfaction rate",
      color: "text-amber-600"
    },
    {
      icon: Zap,
      value: "Google",
      label: language === 'fr' ? "Fournisseur de publicité" : "Ads provider",
      color: "text-purple-600"
    }
  ];

  const fundingGoal = {
    title: language === 'fr' ? "Objectif Principal : Acheter un nom de domaine" : "Primary Goal: Buy a Website Domain",
    description: language === 'fr' 
      ? "Nous avons besoin de $25 pour acheter et renouveler notre nom de domaine (recyclagemaria.com) pendant un an." 
      : "We need $25 to purchase and renew our domain name (recyclagemaria.org) for one year.",
    target: domainAmount,
    current: currentAmount,
    progress: domainProgress,
    icon: GlobeIcon,
    details: [
      language === 'fr' ? "Nom de domaine professionnel" : "Professional domain name",
      language === 'fr' ? "Certificat SSL inclus" : "SSL certificate included",
      language === 'fr' ? "Renouvellement annuel" : "Annual renewal"
    ]
  };

  const howItWorks = [
    {
      icon: Eye,
      title: language === 'fr' ? "Comment nous gagnons de l'argent ?" : "How do we earn money?",
      description: language === 'fr' 
        ? "Nous utilisons Google AdSense pour afficher des publicités sur cette page. Chaque clic et chaque vue génère de petits revenus qui s'accumulent pour financer notre domaine." 
        : "We use Google AdSense to display ads on this page. Each click and view generates small revenues that accumulate to fund our domain.",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: language === 'fr' ? "Que faisons-nous avec l'argent ?" : "What do we do with the money?",
      description: language === 'fr' 
        ? "100% des revenus sont utilisés pour acheter et maintenir notre nom de domaine. Cela garantit que notre plateforme éducative reste accessible gratuitement." 
        : "100% of the revenue is used to purchase and maintain our domain name. This ensures our educational platform remains freely accessible.",
      color: "text-green-600"
    },
    {
      icon: Globe,
      title: language === 'fr' ? "Qu'est-ce qu'un nom de domaine ?" : "What is a website domain?",
      description: language === 'fr' 
        ? "C'est l'adresse unique de notre site web (ex: recyclagemaria.org). C'est essentiel pour être trouvé sur internet, avoir une présence professionnelle et protéger notre marque." 
        : "It's the unique address of our website (e.g., recyclagemaria.org). It's essential to be found online, have a professional presence, and protect our brand.",
      color: "text-purple-600"
    }
  ];

  const transparencyInfo = [
    {
      icon: ShieldCheck,
      title: language === 'fr' ? "Transparence totale" : "Complete transparency",
      description: language === 'fr' 
        ? "Nous publions des rapports mensuels montrant exactement comment chaque dollar est utilisé." 
        : "We publish monthly reports showing exactly how every dollar is used."
    },
    {
      icon: TrendingUp,
      title: language === 'fr' ? "Impact mesurable" : "Measurable impact",
      description: language === 'fr' 
        ? "Chaque dollar contribue directement à maintenir notre plateforme éducative en ligne." 
        : "Every dollar directly contributes to keeping our educational platform online."
    },
    {
      icon: BookOpen,
      title: language === 'fr' ? "Ressources toujours gratuites" : "Always free resources",
      description: language === 'fr' 
        ? "Toutes nos ressources éducatives resteront gratuites, maintenant et à l'avenir." 
        : "All our educational resources will remain free, now and in the future."
    }
  ];

  const quickFacts = [
    { 
      icon: Clock, 
      text: language === 'fr' ? "Projet lancé en November 2025" : "Project launched in November 2025",
      desc: language === 'fr' ? "On viens de commencer...!" : "We just started...!"
    },
    { 
      icon: Award, 
      text: language === 'fr' ? "Projet à but non lucratif" : "Non-profit project",
      desc: language === 'fr' ? "100% des revenus réinvestis" : "100% of revenue reinvested"
    },
    { 
      icon: Infinity, 
      text: language === 'fr' ? "Accès gratuit permanent" : "Permanent free access",
      desc: language === 'fr' ? "Pour toutes les écoles et enseignants" : "For all schools and teachers"
    },
    { 
      icon: BarChart3, 
      text: language === 'fr' ? "Progrès transparents" : "Transparent progress",
      desc: language === 'fr' ? "Mises à jour régulières sur nos objectifs" : "Regular updates on our goals"
    }
  ];

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = language === 'fr' 
    ? "Aidez Recyclage Maria à acheter son nom de domaine ! Soutenez l'éducation environnementale gratuite en visionnant des publicités." 
    : "Help Recyclage Maria buy its domain name! Support free environmental education by viewing ads.";

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === 'fr' ? "Soutenez Recyclage Maria" : "Support Recyclage Maria",
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        toast({
          title: language === 'fr' ? "Lien copié !" : "Link copied!",
          description: language === 'fr' 
            ? "Le lien a été copié dans votre presse-papier." 
            : "The link has been copied to your clipboard.",
          variant: "default",
        });
      }
      setShowThankYou(true);
      setTimeout(() => setShowThankYou(false), 3000);
    } catch (error) {
      // Share cancelled or failed
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
              {language === 'fr' ? "Aidez-nous à acheter notre nom de domaine" : "Help Us Buy Our Domain Name"}
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {language === 'fr' 
              ? "Nous avons besoin de votre aide pour acheter un nom de domaine professionnel. Chaque publicité que vous visionnez sur cette page nous rapproche de notre objectif !"
              : "We need your help to buy a professional domain name. Every ad you view on this page brings us closer to our goal!"}
          </motion.p>

          {/* Progress bar for domain goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 shadow-lg">
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
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
                  {language === 'fr' ? "Partager cette page" : "Share this page"}
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
                  {language === 'fr' ? "Découvrir notre projet" : "Discover our project"}
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
              {language === 'fr' ? "Notre Impact Éducatif" : "Our Educational Impact"}
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

        {/* First Ad - In-article format */}
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
                    ? "Publicité 1/2 - Cette vue rapproche notre objectif" 
                    : "Ad 1/2 - This view brings us closer to our goal"} 💚
                </p>
              </div>
              <Info className="w-4 h-4 text-green-600" />
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
            
            <div className="min-h-[280px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-green-300 dark:border-green-700">
              {/* First Ad Slot */}
              <ins
                className="adsbygoogle"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '728px',
                  minHeight: '250px'
                }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-6418144328904526"
                data-ad-slot="2955145363"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'fr' 
                  ? "Conseil : Les publicités qui vous intéressent génèrent plus de revenus pour notre projet." 
                  : "Tip: Ads that interest you generate more revenue for our project."}
              </p>
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
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800">
            <CardContent className="p-8">
              <h4 className="text-xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                <Lightbulb className="w-6 h-6 text-green-600" />
                {language === 'fr' 
                  ? "Informations détaillées sur notre financement" 
                  : "Detailed Information About Our Funding"}
              </h4>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h5 className="font-bold text-lg">
                    {language === 'fr' 
                      ? "Comment les publicités génèrent-elles de l'argent ?" 
                      : "How do ads generate money?"}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'fr'
                      ? "Google AdSense affiche des publicités pertinentes basées sur le contenu de notre page. Chaque fois que vous voyez une publicité, Google nous paie une petite commission. Les clics sur les publicités génèrent des revenus supplémentaires. Ces micro-paiements s'accumulent pour financer notre projet éducatif."
                      : "Google AdSense displays relevant ads based on our page content. Each time you see an ad, Google pays us a small commission. Clicks on ads generate additional revenue. These micro-payments accumulate to fund our educational project."}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-bold text-lg">
                    {language === 'fr' 
                      ? "Pourquoi un nom de domaine est-il important ?" 
                      : "Why is a domain name important?"}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'fr'
                      ? "Un nom de domaine professionnel (comme recyclagemaria.org) est essentiel pour :\n• Être facilement trouvable sur internet\n• Avoir une adresse email professionnelle\n• Gagner la confiance des écoles et enseignants\n• Protéger notre marque et notre contenu\n• Offrir une expérience utilisateur professionnelle"
                      : "A professional domain name (like recyclagemaria.org) is essential for:\n• Being easily found online\n• Having a professional email address\n• Gaining trust from schools and teachers\n• Protecting our brand and content\n• Providing a professional user experience"}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-bold text-lg">
                    {language === 'fr' 
                      ? "Comment suivre nos progrès ?" 
                      : "How to track our progress?"}
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'fr'
                      ? "Nous mettrons à jour régulièrement notre progression vers l'objectif de 25$. Vous pouvez suivre nos avancées sur cette page et via nos communications. Une fois le domaine acheté, nous partagerons la facture et les détails avec notre communauté."
                      : "We will regularly update our progress toward the $25 goal. You can track our progress on this page and through our communications. Once the domain is purchased, we will share the receipt and details with our community."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Second Ad - In-article format */}
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
                  ? "Publicité 2/2 - Merci de votre soutien !" 
                  : "Ad 2/2 - Thank you for your support!"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'fr'
                  ? "Cette publicité nous aide à atteindre notre objectif de domaine"
                  : "This ad helps us reach our domain goal"} 🌱
              </p>
            </div>
            
            <div className="min-h-[250px] flex items-center justify-center bg-gradient-to-br from-white/50 to-transparent dark:from-gray-900/30 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700">
              {/* Second Ad Slot */}
              <ins
                className="adsbygoogle"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: '728px',
                  minHeight: '250px'
                }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-6418144328904526"
                data-ad-slot="9536865580"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'fr' 
                  ? "Objectif : 25$ pour notre domaine | Actuel : " + formatCurrency(currentAmount)
                  : "Goal: $25 for our domain | Current: " + formatCurrency(currentAmount)}
              </p>
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
                  ? "Votre soutien fait la différence !" 
                  : "Your support makes a difference!"}
              </h3>
              
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                {language === 'fr'
                  ? "Chaque vue de publicité, chaque partage, chaque visite nous rapproche de notre objectif. Merci de contribuer à l'éducation environnementale des générations futures."
                  : "Every ad view, every share, every visit brings us closer to our goal. Thank you for contributing to the environmental education of future generations."}
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
                      {language === 'fr' ? "Partager avec vos amis" : "Share with your friends"}
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
                      {language === 'fr' ? "Autres moyens de nous aider" : "Other ways to help us"}
                    </span>
                  </Button>
                </motion.div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-8 pt-6 border-t border-green-200 dark:border-green-800">
                {language === 'fr' ? "Des questions ? Contactez-nous à" : "Questions? Contact us at"}{' '}
                <a 
                  href="mailto:recyclagemaria@gmail.com" 
                  className="text-green-600 dark:text-green-400 hover:underline font-medium"
                >
                  recyclagemaria@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
