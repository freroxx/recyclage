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

  // Scroll progress tracking
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(Math.round(latest * 100));
  });

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

  // Particle system for hero section
  useEffect(() => {
    if (!heroRef.current) return;

    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = `${Math.random() * 4 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.background = Math.random() > 0.5 ? 
        'rgba(16, 185, 129, 0.6)' : 
        'rgba(59, 130, 246, 0.6)';
      particle.style.opacity = '0';
      
      heroRef.current.appendChild(particle);
      particles.push(particle);
      
      // Animate particles
      setTimeout(() => {
        particle.style.transition = `all ${Math.random() * 2 + 3}s ease-in-out`;
        particle.style.opacity = '0.6';
        particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        
        // Continuous animation
        setInterval(() => {
          particle.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        }, 3000 + Math.random() * 2000);
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
      
      .animate-shimmer {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      
      .gradient-border {
        position: relative;
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(45deg, #10b981, #3b82f6, #f59e0b) border-box;
        border: 2px solid transparent;
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 z-50 origin-left"
        style={{ scaleX: springScrollProgress }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      />
      
      {/* Floating Progress Indicator */}
      <motion.div 
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full glass-effect flex items-center justify-center">
            <span className="text-sm font-bold text-gradient">{scrollProgress}%</span>
          </div>
          <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-emerald-500 border-r-blue-500 border-b-amber-500" />
        </div>
      </motion.div>

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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-blue-900/20 to-amber-900/20 animate-pulse" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          />
          
          <motion.img
            src="/hero.webp"
            alt={language === "fr" ? "École Maria - Programme de recyclage à Agadir" : "École Maria - Recycling program in Agadir"}
            className={`absolute inset-0 w-full h-full object-cover object-center ${
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

        {/* Animated floating elements with 3D effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl animate-float-3d"
              style={{
                top: `${20 + i * 30}%`,
                left: i === 0 ? '10%' : i === 1 ? '80%' : '25%',
                width: i === 0 ? '5rem' : i === 1 ? '6rem' : '4rem',
                height: i === 0 ? '5rem' : i === 1 ? '6rem' : '4rem',
                background: i === 0 
                  ? 'linear-gradient(45deg, #10b981, #3b82f6)' 
                  : i === 1 
                  ? 'linear-gradient(45deg, #3b82f6, #f59e0b)' 
                  : 'linear-gradient(45deg, #f59e0b, #10b981)',
                animationDelay: `${i * 2}s`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + i,
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
          {/* Enhanced Badge with shimmer effect */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-flex items-center gap-2 glass-effect text-white px-6 py-3 rounded-full text-sm font-medium mb-8 md:mb-12 animate-shimmer"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
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
            <motion.span
              className="inline-block"
              initial={{ backgroundPosition: "0% 0%" }}
              animate={{ backgroundPosition: "100% 100%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{
                background: "linear-gradient(45deg, #10b981, #3b82f6, #f59e0b, #10b981)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {t("hero.title")}
            </motion.span>
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
                className="group px-8 py-6 text-lg shadow-2xl hover:shadow-[0_25px_60px_-12px_rgba(16,185,129,0.5)] transition-all duration-300 w-full sm:w-auto relative overflow-hidden hover-lift"
                onClick={handleCtaClick}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Leaf className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5 ml-2 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/resources">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-2 glass-effect text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 w-full hover-lift relative overflow-hidden group"
                >
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-white/50 transition-all duration-500" />
                  <span className="relative">
                    {language === "fr" ? "Voir les ressources" : "View resources"}
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced scroll indicator with animation */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <ChevronDown className="w-8 h-8 text-white/60 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-white/30 rounded-full animate-ping opacity-20" />
            </div>
          </motion.div>
        </motion.main>
      </motion.header>

      {/* Enhanced Stats Section with counters */}
      <motion.section 
        ref={statsRef}
        className="relative -mt-16 md:-mt-20 z-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6">
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
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass-effect border-2 border-white/10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover-lift"
                  custom={index}
                >
                  <div className="p-6 md:p-8 text-center relative overflow-hidden group">
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 ${stat.animation}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <StatIcon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      </motion.div>
                      <motion.div 
                        className="text-3xl md:text-5xl font-bold text-white mb-2"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={statsInView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: index * 0.2, type: "spring" }}
                      >
                        {stat.value === "∞" ? "∞" : animatedStats[stat.value === "4" ? 'waste' : 'engagement']}
                        {stat.value === "100%" && "%"}
                        <span className="sr-only">{stat.suffix}</span>
                      </motion.div>
                      <h3 className="text-sm md:text-base text-white/80 font-medium">
                        {stat.label}
                      </h3>
                    </div>
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
        className="py-20 md:py-28 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #10b981 2%, transparent 0%), radial-gradient(circle at 75px 75px, #3b82f6 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            className="text-center mb-16 md:mb-20"
            {...fadeInUp}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                background: "linear-gradient(45deg, #10b981, #3b82f6, #f59e0b, #10b981)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {language === "fr" ? "Notre Mission" : "Our Mission"}
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
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
            className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto"
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
                  className={`group bg-card/80 backdrop-blur-sm border-2 ${feature.borderColor} rounded-2xl ${feature.hoverShadow} transition-all duration-500 hover-lift relative overflow-hidden`}
                  whileHover={{ 
                    y: -10,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                >
                  {/* Animated background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Floating particles on hover */}
                  <AnimatePresence>
                    {hoveredFeature === index && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-white/30"
                            initial={{ 
                              opacity: 0, 
                              scale: 0,
                              x: Math.random() * 100 - 50,
                              y: Math.random() * 100 - 50 
                            }}
                            animate={{ 
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: Math.random() * 200 - 100,
                              y: Math.random() * 200 - 100
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.1,
                              repeat: Infinity
                            }}
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${20 + i * 10}%`
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="p-8 relative z-10">
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg] relative`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <FeatureIcon className={`w-10 h-10 ${feature.color} ${feature.iconAnimation}`} />
                      {/* Glow effect */}
                      <div className={`absolute inset-0 rounded-2xl ${feature.bg} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                    </motion.div>
                    
                    <motion.h3 
                      className="font-bold text-2xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300"
                      animate={hoveredFeature === index ? { x: [0, -5, 5, 0] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {feature.description}
                    </motion.p>
                    
                    {/* Animated underline */}
                    <motion.div 
                      className="w-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-4 mx-auto"
                      initial={{ width: 0 }}
                      whileInView={{ width: "50%" }}
                      transition={{ delay: 0.5 }}
                    />
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
        className="py-20 md:py-28 bg-gradient-to-b from-background via-primary/5 to-background relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-amber-500/10 to-emerald-500/10 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-12 md:mb-16"
              {...fadeInUp}
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-amber-500/20 text-foreground px-6 py-3 rounded-full text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm hover-lift"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <TreeDeciduous className="w-5 h-5" />
                </motion.div>
                <span>{language === "fr" ? "Présentation Interactive" : "Interactive Presentation"}</span>
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {t("home.presentation.title")}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t("home.presentation.subtitle")}
              </motion.p>
            </motion.div>
            
            <motion.div 
              ref={iframeContainerRef}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-border/50 hover:border-primary/50 transition-all duration-500 group hover-lift">
                {/* Animated border gradient */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-500" />
                
                {/* Loading shimmer effect */}
                {!loadIframe && (
                  <div className="absolute inset-0 bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-shimmer flex items-center justify-center">
                    <motion.div 
                      className="text-center space-y-6"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Recycle className="w-10 h-10 text-primary" />
                        </motion.div>
                      </div>
                      <p className="text-muted-foreground font-medium">
                        {language === "fr" ? "Chargement de la présentation..." : "Loading presentation..."}
                      </p>
                    </motion.div>
                  </div>
                )}
                
                {/* Interactive iframe */}
                <AnimatePresence mode="wait">
                  {loadIframe && (
                    <motion.iframe
                      key="iframe-loaded"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      loading="lazy"
                      className="absolute w-full h-full top-0 left-0 border-0"
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
              
              <motion.div 
                className="text-center mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href="https://www.canva.com/design/DAG5CGlo4U8/e8TE7nOlF8W-8b7pUdDrPg/view?utm_content=DAG5CGlo4U8&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-foreground/80 hover:text-primary transition-all duration-300 group font-medium hover-lift"
                >
                  <span>How To Recycle Waste {t("home.presentation.by")} Yahia Ikni</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced CTA Section */}
      <motion.section 
        ref={ctaRef}
        className="py-20 md:py-28 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-amber-500/5">
          <motion.div 
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)`,
              backgroundSize: '200% 200%'
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.article 
            className="max-w-4xl mx-auto gradient-border rounded-3xl shadow-2xl overflow-hidden hover-lift"
            whileHover={{ 
              y: -5,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            {...scaleIn}
            viewport={{ once: true }}
          >
            <div className="p-10 md:p-14 text-center relative overflow-hidden group">
              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary/30"
                  animate={{
                    y: [0, -100, 0],
                    x: [0, Math.sin(i) * 50, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + i,
                    delay: i * 0.5,
                    repeat: Infinity
                  }}
                  style={{
                    left: `${10 + i * 10}%`,
                    top: `${20 + i * 5}%`
                  }}
                />
              ))}

              <div className="relative z-10">
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-8"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Leaf className="w-12 h-12 text-gradient" />
                  </motion.div>
                </motion.div>
                
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-gradient">
                    {language === "fr" ? "Rejoignez le Mouvement" : "Join the Movement"}
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {language === "fr" 
                    ? "Chaque geste compte. Ensemble, faisons de notre école un modèle de développement durable."
                    : "Every action counts. Together, let's make our school a model of sustainable development."}
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/project">
                      <Button 
                        size="lg" 
                        className="group px-10 py-7 text-lg shadow-2xl hover:shadow-[0_25px_60px_-12px_rgba(16,185,129,0.5)] transition-all duration-300 w-full sm:w-auto relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                        <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
                        {language === "fr" ? "Découvrir le projet" : "Discover the project"}
                        <ArrowRight className="w-6 h-6 ml-3 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                      </Button>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/contact">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="px-10 py-7 text-lg border-2 glass-effect hover:bg-white/10 transition-all duration-300 w-full sm:w-auto group relative overflow-hidden"
                      >
                        <span className="relative">
                          {language === "fr" ? "Nous contacter" : "Contact us"}
                        </span>
                        {/* Hover underline animation */}
                        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-500" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.article>
        </div>
      </motion.section>
    </>
  );
}
