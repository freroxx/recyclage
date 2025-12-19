import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Lightbulb, ArrowRight, Sparkles, Leaf, TreeDeciduous, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  const [loadIframe, setLoadIframe] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const presentationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Detect mobile device and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll();
  const springScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax values for hero elements - optimized for mobile
  const heroY = useTransform(springScrollProgress, [0, 1], [0, isMobile ? 30 : 150]);
  const heroOpacity = useTransform(springScrollProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(springScrollProgress, [0, 0.2], [1, isMobile ? 0.98 : 0.95]);

  // Stats counter animation - optimized
  const [animatedStats, setAnimatedStats] = useState({ waste: 0, engagement: 0, impact: 0 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (statsInView) {
      const animateCounter = (target: number, key: keyof typeof animatedStats, duration: number = 1500) => {
        const start = 0;
        const end = typeof target === 'string' && target.includes('%') ? 100 : parseFloat(target as string);
        const startTime = Date.now();
        
        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          if (key === 'impact') {
            setAnimatedStats(prev => ({ ...prev, [key]: Infinity }));
          } else {
            const current = start + (end - start) * easeOutQuart;
            setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };
        
        requestAnimationFrame(updateCounter);
      };

      animateCounter(4, 'waste', 1200);
      animateCounter(100, 'engagement', 1500);
      setAnimatedStats(prev => ({ ...prev, impact: Infinity }));
    }
  }, [statsInView]);

  // Scroll progress tracking - optimized
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(Math.round(latest * 100));
  });

  // Memoized features with optimized animations
  const features = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.implementation"),
      description: t("project.implementation.desc"),
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      hoverShadow: "hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/20",
      iconAnimation: "group-hover:rotate-12 transition-transform duration-300"
    },
    {
      icon: Lightbulb,
      title: t("project.awareness"),
      description: t("project.awareness.desc"),
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
      hoverShadow: "hover:shadow-lg hover:shadow-amber-100/50 dark:hover:shadow-amber-900/20",
      iconAnimation: "group-hover:scale-110 transition-transform duration-300"
    },
    {
      icon: Users,
      title: t("project.mobilization"),
      description: t("project.mobilization.desc"),
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverShadow: "hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20",
      iconAnimation: "group-hover:translate-y-[-2px] transition-transform duration-300"
    }
  ], [t]);

  const stats = useMemo(() => [
    { 
      value: "4", 
      label: language === "fr" ? "Types de déchets" : "Waste types", 
      icon: Recycle,
      suffix: language === "fr" ? "catégories" : "categories"
    },
    { 
      value: "100%", 
      label: language === "fr" ? "Engagement école" : "School engagement", 
      icon: Users,
      suffix: language === "fr" ? "participation" : "participation"
    },
    { 
      value: "∞", 
      label: language === "fr" ? "Impact positif" : "Positive impact", 
      icon: Globe,
      suffix: language === "fr" ? "influence" : "influence"
    },
  ], [language]);

  // Optimized intersection observer with reduced rootMargin for mobile
  useEffect(() => {
    const element = iframeContainerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadIframe) {
          // Reduced timeout for better UX
          setTimeout(() => {
            setLoadIframe(true);
          }, 300);
          observer.disconnect();
        }
      },
      {
        rootMargin: isMobile ? '50px' : '150px',
        threshold: 0.1,
        root: null
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loadIframe, isMobile]);

  // Optimized particle system with reduced count
  useEffect(() => {
    if (!heroRef.current) return;

    const particles = [];
    const particleCount = isMobile ? 8 : 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = `${Math.random() * (isMobile ? 1 : 3) + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.background = Math.random() > 0.5 ? 
        'rgba(16, 185, 129, 0.4)' : 
        'rgba(59, 130, 246, 0.4)';
      particle.style.opacity = '0';
      
      heroRef.current.appendChild(particle);
      particles.push(particle);
      
      // Optimized animation
      setTimeout(() => {
        particle.style.transition = `opacity 0.5s ease, transform 4s ease-in-out`;
        particle.style.opacity = '0.4';
        const moveDistance = isMobile ? 20 : 40;
        particle.style.transform = `translate(${Math.random() * moveDistance * 2 - moveDistance}px, ${Math.random() * moveDistance * 2 - moveDistance}px)`;
      }, i * 50);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, [isMobile]);

  // Optimized image loading
  useEffect(() => {
    const img = new Image();
    img.src = "/hero.webp";
    img.onload = () => {
      setImageLoaded(true);
    };
  }, []);

  const handleCtaClick = useCallback(() => {
    navigate("/project");
  }, [navigate]);

  // Animation variants optimized for performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: isMobile ? 10 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const fadeInUp = {
    initial: { y: isMobile ? 20 : 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  // Optimized custom CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float-subtle {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-8px);
        }
      }
      
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
      
      .animate-float-subtle {
        animation: float-subtle 3s ease-in-out infinite;
      }
      
      .animate-spin-slow {
        animation: spin-slow 10s linear infinite;
      }
      
      .text-gradient {
        background: linear-gradient(45deg, var(--primary), var(--secondary), var(--accent));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 200% auto;
      }
      
      .hover-lift {
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
      }
      
      .hover-lift:hover {
        transform: translateY(-${isMobile ? '2px' : '4px'});
      }
      
      .glass-effect {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .dark .glass-effect {
        background: rgba(15, 23, 42, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Performance optimizations */
      .will-change-transform {
        will-change: transform;
      }
      
      .backface-hidden {
        backface-visibility: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile]);

  return (
    <>
      {/* Hidden SEO h1 */}
      <h1 className="sr-only">
        Projet de recyclage scolaire à l'École Maria à Agadir - Programme de gestion des déchets et sensibilisation environnementale
      </h1>

      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 z-50 origin-left will-change-transform"
        style={{ scaleX: springScrollProgress }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />

      {/* Optimized Hero Section */}
      <motion.header 
        ref={heroRef}
        className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Simplified Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-blue-900/10 to-amber-900/10" />
          <motion.img
            src="/hero.webp"
            alt={language === "fr" ? "École Maria - Programme de recyclage à Agadir" : "École Maria - Recycling program in Agadir"}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        <motion.main 
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Optimized Badge */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-2 glass-effect text-gray-800 dark:text-gray-100 px-5 py-2.5 rounded-full text-sm font-medium mb-6 md:mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">École Maria - Agadir</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight"
          >
            <span className="text-gradient">
              {t("hero.title")}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>
          
          <motion.div 
            variants={containerVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size={isMobile ? "default" : "lg"}
                className="group px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto hover-lift"
                onClick={handleCtaClick}
              >
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/resources">
                <Button
                  variant="outline"
                  size={isMobile ? "default" : "lg"}
                  className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg glass-effect text-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto hover-lift"
                >
                  <span className="font-medium">
                    {language === "fr" ? "Voir les ressources" : "View resources"}
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Simplified scroll indicator */}
          <motion.div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/50" />
          </motion.div>
        </motion.main>
      </motion.header>

      {/* Optimized Stats Section */}
      <motion.section 
        ref={statsRef}
        className="relative -mt-12 md:-mt-16 z-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.article 
                  key={stat.label} 
                  variants={itemVariants}
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift glass-effect"
                  custom={index}
                >
                  <div className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <StatIcon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value === "∞" ? "∞" : animatedStats[stat.value === "4" ? 'waste' : 'engagement']}
                      {stat.value === "100%" && "%"}
                    </div>
                    <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </h3>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Optimized Features Section */}
      <motion.section 
        ref={featuresRef}
        className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-primary/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            {...fadeInUp}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === "fr" ? "Notre Mission" : "Our Mission"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {language === "fr" 
                ? "Ensemble, construisons un avenir plus vert pour notre école et notre planète."
                : "Together, let's build a greener future for our school and our planet."}
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.article 
                  key={feature.title}
                  variants={itemVariants}
                  custom={index}
                  onMouseEnter={() => !isMobile && setHoveredFeature(index)}
                  onMouseLeave={() => !isMobile && setHoveredFeature(null)}
                  className={`group bg-white dark:bg-gray-800/50 backdrop-blur-sm border ${feature.borderColor} rounded-xl ${feature.hoverShadow} transition-all duration-300 hover-lift`}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6 md:p-8">
                    <div className={`w-16 h-16 rounded-lg ${feature.bg} flex items-center justify-center mb-6 transition-all duration-300`}>
                      <FeatureIcon className={`w-8 h-8 ${feature.color} ${feature.iconAnimation}`} />
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Optimized Presentation Section */}
      <motion.section 
        ref={presentationRef}
        className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-8 md:mb-12"
              {...fadeInUp}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <TreeDeciduous className="w-4 h-4" />
                <span>{language === "fr" ? "Présentation Interactive" : "Interactive Presentation"}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {t("home.presentation.title")}
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t("home.presentation.subtitle")}
              </p>
            </motion.div>
            
            <motion.div 
              ref={iframeContainerRef}
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                {!loadIframe && (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
                        <Recycle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin-slow" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {language === "fr" ? "Chargement..." : "Loading..."}
                      </p>
                    </div>
                  </div>
                )}
                
                {loadIframe && (
                  <iframe
                    loading="lazy"
                    className="w-full h-full"
                    src="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?embed"
                    allowFullScreen
                    allow="fullscreen"
                    title={language === "fr" 
                      ? "Présentation sur le recyclage des déchets" 
                      : "How To Recycle Waste Presentation"}
                  />
                )}
              </div>
              
              <div className="text-center mt-4">
                <a
                  href="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?utm_content=DAG5CGlo4U8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-300 text-sm font-medium"
                >
                  <span>How To Recycle Waste {t("home.presentation.by")} Yahia Ikni</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section with better theme compatibility */}
      <motion.section 
        ref={ctaRef}
        className="py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.article 
            className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift border border-emerald-200 dark:border-emerald-900/50"
            whileHover={{ y: -5 }}
            {...fadeInUp}
          >
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                <span className="text-gradient">
                  {language === "fr" ? "Rejoignez le Mouvement" : "Join the Movement"}
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {language === "fr" 
                  ? "Chaque geste compte. Ensemble, faisons de notre école un modèle de développement durable."
                  : "Every action counts. Together, let's make our school a model of sustainable development."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/project">
                  <Button 
                    size={isMobile ? "default" : "lg"}
                    className="group px-8 py-5 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button 
                    variant="outline"
                    size={isMobile ? "default" : "lg"}
                    className="px-8 py-5 border-2 transition-all duration-300 hover-lift"
                  >
                    <span className="font-medium">
                      {language === "fr" ? "Nous contacter" : "Contact us"}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.article>
        </div>
      </motion.section>
    </>
  );
}
