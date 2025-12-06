import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Users, Lightbulb, ArrowRight, Sparkles, Leaf, TreeDeciduous, Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from "framer-motion";

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  useScrollReveal();
  const [loadIframe, setLoadIframe] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const presentationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const springScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax values for hero elements
  const heroY = useTransform(springScrollProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(springScrollProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(springScrollProgress, [0, 0.2], [1, 0.95]);

  // Stats counter animation
  const [animatedStats, setAnimatedStats] = useState({ waste: 0, engagement: 0, impact: 0 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (statsInView) {
      const animateCounter = (target: number, key: keyof typeof animatedStats, duration: number = 2000) => {
        const start = 0;
        const end = typeof target === 'string' && target.includes('%') ? 100 : parseFloat(target as string);
        const startTime = Date.now();
        
        const updateCounter = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          if (key === 'impact') {
            // For infinity symbol, just show it
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

      animateCounter(4, 'waste', 1500);
      animateCounter(100, 'engagement', 1800);
      setAnimatedStats(prev => ({ ...prev, impact: Infinity }));
    }
  }, [statsInView]);

  // Memoized features with enhanced animations
  const features = useMemo(() => [
    {
      icon: Recycle,
      title: t("project.implementation"),
      description: t("project.implementation.desc"),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      gradient: "from-emerald-500/5 via-emerald-400/10 to-emerald-600/15",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]",
      iconAnimation: "group-hover:animate-spin"
    },
    {
      icon: Lightbulb,
      title: t("project.awareness"),
      description: t("project.awareness.desc"),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      gradient: "from-amber-500/5 via-amber-400/10 to-amber-600/15",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.3)]",
      iconAnimation: "group-hover:animate-pulse"
    },
    {
      icon: Users,
      title: t("project.mobilization"),
      description: t("project.mobilization.desc"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      gradient: "from-blue-500/5 via-blue-400/10 to-blue-600/15",
      hoverShadow: "hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)]",
      iconAnimation: "group-hover:animate-bounce"
    }
  ], [t]);

  const stats = useMemo(() => [
    { 
      value: "4", 
      label: language === "fr" ? "Types de déchets" : "Waste types", 
      icon: Recycle,
      suffix: language === "fr" ? "catégories" : "categories",
      animation: "animate-float"
    },
    { 
      value: "100%", 
      label: language === "fr" ? "Engagement école" : "School engagement", 
      icon: Users,
      suffix: language === "fr" ? "participation" : "participation",
      animation: "animate-pulse"
    },
    { 
      value: "∞", 
      label: language === "fr" ? "Impact positif" : "Positive impact", 
      icon: Globe,
      suffix: language === "fr" ? "influence" : "influence",
      animation: "animate-spin-slow"
    },
  ], [language]);

  // Enhanced intersection observer with animations
  useEffect(() => {
    const element = iframeContainerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadIframe) {
          // Staggered loading animation
          setTimeout(() => {
            setLoadIframe(true);
          }, 500);
          observer.disconnect();
        }
      },
      {
        rootMargin: '150px',
        threshold: 0.1,
        root: null
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loadIframe]);

  // Optimized particle system for better performance
  useEffect(() => {
    if (!heroRef.current || window.innerWidth < 768) return;

    const particles = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.background = Math.random() > 0.5 ? 
        'rgba(16, 185, 129, 0.4)' : 
        'rgba(59, 130, 246, 0.4)';
      particle.style.opacity = '0';
      particle.style.willChange = 'transform, opacity';
      
      heroRef.current.appendChild(particle);
      particles.push(particle);
      
      // Animate particles
      setTimeout(() => {
        particle.style.transition = `all ${Math.random() * 2 + 3}s ease-in-out`;
        particle.style.opacity = '0.4';
        particle.style.transform = `translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px)`;
      }, i * 100);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  // Preload the hero image with enhanced loading
  useEffect(() => {
    const img = new Image();
    img.src = "/hero.webp";
    img.onload = () => {
      setTimeout(() => {
        setImageLoaded(true);
      }, 300);
    };
  }, []);

  const handleCtaClick = useCallback(() => {
    // Add ripple effect animation
    const button = event?.currentTarget;
    if (button) {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
      `;
      
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    
    navigate("/project");
  }, [navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const fadeInUp = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const scaleIn = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "backOut" }
  };

  // Add custom CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes float-3d {
        0%, 100% {
          transform: translate3d(0, 0, 0) rotate(0deg);
        }
        33% {
          transform: translate3d(10px, -20px, 10px) rotate(120deg);
        }
        66% {
          transform: translate3d(-10px, 10px, -10px) rotate(240deg);
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
      
      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }
      
      .animate-float-3d {
        animation: float-3d 6s ease-in-out infinite;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .animate-spin-slow,
        .animate-float-3d,
        .hover-lift:hover,
        .group-hover\\:animate-spin,
        .group-hover\\:animate-pulse,
        .group-hover\\:animate-bounce {
          animation: none !important;
          transition: none !important;
        }
      }
      
      .text-gradient {
        background: linear-gradient(45deg, #10b981, #3b82f6, #f59e0b);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-size: 200% auto;
        animation: shimmer 3s linear infinite;
      }
      
      .hover-lift {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      
      .hover-lift:hover {
        transform: translateY(-8px);
      }
      
      .glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      @media (max-width: 768px) {
        .glass-effect {
          backdrop-filter: blur(5px);
        }
      }
      
      /* Improved button styles */
      .btn-primary {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }
      
      .btn-primary::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        z-index: -1;
      }
      
      .btn-primary:hover::before {
        width: 300px;
        height: 300px;
      }
      
      /* Improved stats card readability */
      .stats-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      
      .stats-card-dark {
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator (thinner, more subtle) */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 z-50 origin-left"
        style={{ scaleX: springScrollProgress }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      />

      {/* Enhanced Hero Section with Parallax */}
      <motion.header 
        ref={heroRef}
        className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/20 to-amber-900/20" />
          <motion.img
            src="/hero.webp"
            alt={language === "fr" ? "École Maria - Programme de recyclage à Agadir" : "École Maria - Recycling program in Agadir"}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            loading="eager"
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Simplified floating elements for better performance */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-xl"
              style={{
                top: `${30 + i * 40}%`,
                left: i === 0 ? '10%' : '80%',
                width: i === 0 ? '8rem' : '6rem',
                height: i === 0 ? '8rem' : '6rem',
                background: i === 0 
                  ? 'linear-gradient(45deg, #10b98140, #3b82f640)' 
                  : 'linear-gradient(45deg, #3b82f640, #f59e0b40)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.main 
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Badge */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-medium mb-8 md:mb-12 border border-white/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === "fr" ? "École Maria - Agadir" : "École Maria - Agadir"}</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <span className="text-gradient">
              {t("hero.title")}
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t("hero.subtitle")}
          </motion.p>
          
          <motion.div 
            variants={containerVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="btn-primary group px-8 py-6 text-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto border-0"
                onClick={handleCtaClick}
              >
                <Leaf className="w-5 h-5 mr-2" />
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/resources">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 w-full"
                >
                  <span className="relative">
                    {language === "fr" ? "Voir les ressources" : "View resources"}
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <ChevronDown className="w-8 h-8 text-white/60" />
            </div>
          </motion.div>
        </motion.main>
      </motion.header>

      {/* Enhanced Stats Section with improved readability */}
      <motion.section 
        ref={statsRef}
        className="relative -mt-16 md:-mt-20 z-20 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto"
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
                  whileHover={{ scale: 1.05 }}
                  className="stats-card stats-card-dark border border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                  custom={index}
                >
                  <div className="p-6 md:p-8 text-center relative">
                    {/* Clear icon container */}
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                      <StatIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>
                    
                    {/* Clear value display */}
                    <div className="text-3xl md:text-5xl font-bold text-white mb-1">
                      {stat.value === "∞" ? "∞" : animatedStats[stat.value === "4" ? 'waste' : 'engagement']}
                      {stat.value === "100%" && "%"}
                    </div>
                    
                    {/* Clear label with better contrast */}
                    <h3 className="text-base md:text-lg font-semibold text-white mb-1">
                      {stat.label}
                    </h3>
                    
                    {/* Clear suffix */}
                    <p className="text-sm text-white/70">
                      {stat.suffix}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section with enhanced animations */}
      <motion.section 
        ref={featuresRef}
        className="py-16 md:py-24 bg-gradient-to-b from-background via-background to-primary/5 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            {...fadeInUp}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground"
            >
              {language === "fr" ? "Notre Mission" : "Our Mission"}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {language === "fr" 
                ? "Ensemble, construisons un avenir plus vert pour notre école et notre planète."
                : "Together, let's build a greener future for our school and our planet."}
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <motion.article 
                  key={feature.title}
                  variants={itemVariants}
                  custom={index}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`group bg-card border ${feature.borderColor} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-lift relative overflow-hidden`}
                >
                  <div className="p-6 relative">
                    <motion.div 
                      className={`w-16 h-16 rounded-xl ${feature.bg} flex items-center justify-center mb-4 transition-all duration-300`}
                    >
                      <FeatureIcon className={`w-8 h-8 ${feature.color}`} />
                    </motion.div>
                    
                    <h3 className="font-bold text-xl mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Presentation Section */}
      <motion.section 
        ref={presentationRef}
        className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-8 md:mb-12"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-medium mb-6">
                <TreeDeciduous className="w-5 h-5" />
                <span>{language === "fr" ? "Présentation Interactive" : "Interactive Presentation"}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {t("home.presentation.title")}
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("home.presentation.subtitle")}
              </p>
            </motion.div>
            
            <motion.div 
              ref={iframeContainerRef}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-border">
                {!loadIframe && (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <Recycle className="w-6 h-6 text-primary animate-spin" />
                      </div>
                      <p className="text-muted-foreground">
                        {language === "fr" ? "Chargement de la présentation..." : "Loading presentation..."}
                      </p>
                    </div>
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  {loadIframe && (
                    <motion.iframe
                      key="iframe-loaded"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      loading="lazy"
                      className="w-full h-full border-0"
                      src="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?embed"
                      allowFullScreen
                      allow="fullscreen"
                      title={language === "fr" 
                        ? "Présentation sur le recyclage des déchets" 
                        : "How To Recycle Waste Presentation"}
                    />
                  )}
                </AnimatePresence>
              </div>
              
              <div className="text-center mt-4">
                <a
                  href="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?utm_content=DAG5CGlo4U8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors duration-300 group text-sm"
                >
                  <span>How To Recycle Waste {t("home.presentation.by")} Yahia Ikni</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section 
        ref={ctaRef}
        className="py-16 md:py-24 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.article 
            className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-2xl shadow-xl overflow-hidden border border-border"
            {...scaleIn}
            viewport={{ once: true }}
          >
            <div className="p-8 md:p-12 text-center relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {language === "fr" ? "Rejoignez le Mouvement" : "Join the Movement"}
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {language === "fr" 
                  ? "Chaque geste compte. Ensemble, faisons de notre école un modèle de développement durable."
                  : "Every action counts. Together, let's make our school a model of sustainable development."}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/project">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-base bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-6 text-base border-2 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto"
                  >
                    {language === "fr" ? "Nous contacter" : "Contact us"}
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
