import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { 
  Trash2, 
  FileText, 
  Apple, 
  Package, 
  Target, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  Leaf, 
  Recycle, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play,
  ExternalLink,
  ChevronDown,
  Globe,
  Shield,
  Award,
  BarChart3,
  Cpu,
  Zap,
  Clock,
  Heart,
  TreePine,
  Battery,
  Truck,
  Star,
  Cloud,
  Droplets,
  Factory,
  Compass,
  Gem,
  Rocket,
  Target as TargetIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Globe as GlobeIcon,
  TrendingUp as TrendingUpIcon
} from "lucide-react";

// Performance optimization: Lazy load framer-motion
const useLazyFramerMotion = () => {
  const [motionComponents, setMotionComponents] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadFramerMotion = async () => {
      try {
        const framerMotion = await import('framer-motion');
        setMotionComponents({
          motion: framerMotion.motion,
          AnimatePresence: framerMotion.AnimatePresence,
          useScroll: framerMotion.useScroll,
          useTransform: framerMotion.useTransform,
          useSpring: framerMotion.useSpring,
          useMotionValue: framerMotion.useMotionValue,
          animate: framerMotion.animate,
          spring: framerMotion.spring
        });
      } catch (err) {
        console.warn('Framer Motion failed to load, using CSS animations');
        setError(true);
      }
    };

    loadFramerMotion();
  }, []);

  return { ...motionComponents, error };
};

// Advanced Animated Button Component
const AnimatedButton = memo(({ 
  children, 
  variant = "default",
  size = "default",
  className = "",
  onClick,
  icon,
  href,
  ...props 
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "premium" | "gradient";
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  href?: string;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  const handleClick = (e: React.MouseEvent) => {
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
    
    if (onClick) onClick();
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl"
  };
  
  const variantClasses = {
    default: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5",
    premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 shadow-lg hover:shadow-2xl",
    gradient: "bg-gradient-to-r from-primary via-purple-600 to-pink-600 hover:from-primary/90 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-2xl"
  };
  
  const ButtonContent = (
    <>
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Glow Effect */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine Effect */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute -inset-y-full -left-20 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
      </span>
      
      <span className="relative flex items-center justify-center gap-3">
        {icon && <span className="transition-transform duration-300 group-hover:scale-110">{icon}</span>}
        {children}
        <ArrowRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
      </span>
    </>
  );
  
  const buttonClasses = `
    relative overflow-hidden rounded-xl font-semibold
    transition-all duration-300 ease-out
    transform hover:-translate-y-1 active:translate-y-0
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `;
  
  if (href) {
    return (
      <Link to={href}>
        <button
          ref={buttonRef}
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          {...props}
        >
          {ButtonContent}
        </button>
      </Link>
    );
  }
  
  return (
    <button
      ref={buttonRef}
      className={buttonClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {ButtonContent}
    </button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

// Floating Widget Component
const FloatingWidget = memo(({
  children,
  intensity = 1,
  className = ""
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!widgetRef.current) return;
      
      const rect = widgetRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
    };
    
    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };
    
    const widget = widgetRef.current;
    if (widget) {
      widget.addEventListener('mousemove', handleMouseMove);
      widget.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (widget) {
        widget.removeEventListener('mousemove', handleMouseMove);
        widget.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  const rotateX = mousePosition.y * 5 * intensity;
  const rotateY = -mousePosition.x * 5 * intensity;
  const translateZ = Math.abs(mousePosition.x + mousePosition.y) * 10 * intensity;
  
  return (
    <div
      ref={widgetRef}
      className={`relative transition-transform duration-150 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      }}
    >
      {/* Ambient Light */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Border Glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
      
      {children}
    </div>
  );
});

FloatingWidget.displayName = 'FloatingWidget';

// Animated Counter Widget
const CounterWidget = memo(({
  value,
  label,
  icon: Icon,
  color = "primary",
  suffix = "",
  duration = 2000
}: {
  value: number;
  label: string;
  icon: any;
  color?: string;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  
  useEffect(() => {
    if (!counterRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let start = 0;
            const increment = Math.ceil(value / (duration / 16));
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= value) {
                setCount(value);
                clearInterval(timer);
              } else {
                setCount(start);
              }
            }, 16); // ~60fps
            
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    observerRef.current.observe(counterRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [value, duration]);
  
  const colorClasses = {
    primary: "from-primary to-primary/80",
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    purple: "from-purple-500 to-pink-600",
    amber: "from-amber-500 to-orange-600"
  };
  
  return (
    <div ref={counterRef} className="relative group">
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <Card className="relative backdrop-blur-sm bg-white/5 border-white/10 hover:border-primary/30 transition-all duration-500 group-hover:scale-105">
        <CardContent className="p-6 text-center">
          <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
            {count.toLocaleString()}{suffix}
          </div>
          
          <div className="text-sm text-muted-foreground font-medium">
            {label}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
              style={{ width: `${(count / value) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

CounterWidget.displayName = 'CounterWidget';

// Particle Background with Performance
const PremiumParticleBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.x;
      mouseRef.current.y = e.y;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 200 + 55)}, 255, ${Math.random() * 0.4 + 0.1})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        
        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          this.x -= dx * force * 0.05;
          this.y -= dy * force * 0.05;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        particlesRef.current.forEach(particle => {
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.2 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
          }
        });
      }
    }
    
    // Create particles
    const init = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };
    
    init();
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.1)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
      />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5" />
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none -z-10" />
      
      {/* Floating orbs */}
      <div className="fixed top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float-slow pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 right-10 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl animate-float-slow delay-1000 pointer-events-none -z-10" />
    </>
  );
});

PremiumParticleBackground.displayName = 'PremiumParticleBackground';

// Main component
export default function Project() {
  const { t, language } = useLanguage();
  const { motion, AnimatePresence, error: framerMotionError } = useLazyFramerMotion();
  
  // State management
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  // Memoized data
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      borderColor: "border-amber-400/30", 
      label: t("project.bins.paper"),
      description: language === "fr" ? "Papier, carton, journaux" : "Paper, cardboard, newspapers",
      stats: { recycled: "85%", items: "2.4M" }
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      borderColor: "border-blue-400/30", 
      label: t("project.bins.plastic"),
      description: language === "fr" ? "Plastiques recyclables" : "Recyclable plastics",
      stats: { recycled: "72%", items: "1.8M" }
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      borderColor: "border-gray-400/30", 
      label: t("project.bins.metal"),
      description: language === "fr" ? "Métaux et cannettes" : "Metals and cans",
      stats: { recycled: "95%", items: "3.1M" }
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      borderColor: "border-green-400/30", 
      label: t("project.bins.organic"),
      description: language === "fr" ? "Déchets organiques" : "Organic waste",
      stats: { recycled: "90%", items: "4.2M" }
    },
  ], [t, language]);
  
  const stats = useMemo(() => [
    { value: 12500, label: t("project.stats.participants") || "Participants", icon: Users, color: "blue" },
    { value: 2400, label: t("project.stats.workshops") || "Workshops", icon: Lightbulb, color: "amber" },
    { value: 85, label: t("project.stats.reduction") || "Waste Reduction", icon: TrendingUp, color: "green" },
    { value: 1500, label: t("project.stats.collected") || "Tons Collected", icon: Truck, color: "purple" },
  ], [t]);
  
  // Auto-rotation
  useEffect(() => {
    mountedRef.current = true;
    
    const rotateBins = () => {
      if (mountedRef.current && isAutoRotating) {
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      }
    };
    
    if (autoRotationInterval.current) {
      clearInterval(autoRotationInterval.current);
    }
    
    autoRotationInterval.current = setInterval(rotateBins, 3000);
    
    return () => {
      mountedRef.current = false;
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, bins.length]);
  
  const handleBinInteraction = useCallback((index: number) => {
    setActiveBinIndex(index);
    setIsAutoRotating(false);
    
    setTimeout(() => {
      if (mountedRef.current) {
        setIsAutoRotating(true);
      }
    }, 8000);
  }, []);
  
  // Use motion components
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';
  
  if (framerMotionError) {
    return (
      <div className="min-h-screen">
        <PremiumParticleBackground />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">{t("project.title")}</h1>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen overflow-hidden">
      <PremiumParticleBackground />
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 shadow-lg" 
             style={{ width: '0%' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Hero Section */}
        <MotionSection
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24 lg:mb-32"
        >
          <MotionDiv
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 
                       text-primary px-6 py-3 rounded-full text-sm font-medium mb-10 
                       border border-white/20 backdrop-blur-xl shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              {getText("project.initiative", "Premium Ecological Initiative", "Initiative Écologique Premium")}
            </span>
            <Sparkles className="w-4 h-4" />
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent 
                            animate-gradient bg-300% leading-tight">
                {t("project.title")}
              </span>
            </h1>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light">
              {t("project.intro")}
            </p>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <AnimatedButton
              variant="gradient"
              size="xl"
              icon={<Rocket className="w-6 h-6" />}
              href="/guide"
            >
              {getText("project.discover", "Launch Project Explorer", "Explorer le Projet")}
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              size="xl"
              icon={<Gem className="w-6 h-6" />}
              href="/resources"
            >
              {getText("project.resources", "Premium Resources", "Ressources Premium")}
            </AnimatedButton>
          </MotionDiv>
          
          {/* Stats Counter Widgets */}
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
          >
            {stats.map((stat, index) => (
              <CounterWidget
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                color={stat.color as any}
                suffix={stat.label.includes("Reduction") ? "%" : ""}
              />
            ))}
          </MotionDiv>
        </MotionSection>
        
        {/* Sorting Bins Section */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto mb-20 md:mb-32"
        >
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {getText("project.bins.title", "Smart Sorting System", "Système de Tri Intelligent")}
              </span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              {getText("project.bins.subtitle", "Advanced waste categorization with real-time monitoring", 
                      "Catégorisation avancée des déchets avec surveillance en temps réel")}
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bins.map((bin, index) => (
              <MotionDiv
                key={bin.label}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 100 }}
                className="h-full"
              >
                <FloatingWidget intensity={1.2}>
                  <div
                    onClick={() => handleBinInteraction(index)}
                    className={`cursor-pointer h-full transition-all duration-500 ${
                      activeBinIndex === index ? 'transform -translate-y-4' : ''
                    }`}
                  >
                    <Card className={`h-full border-2 ${bin.borderColor} overflow-hidden 
                                   backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-500`}>
                      <CardContent className="p-8 text-center relative">
                        {/* Active Indicator */}
                        {activeBinIndex === index && (
                          <div className="absolute top-4 right-4">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
                          </div>
                        )}
                        
                        <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl ${bin.bg} 
                                      flex items-center justify-center mx-auto mb-6
                                      transition-all duration-500 group-hover:scale-110
                                      ${activeBinIndex === index ? 'scale-110 ring-4 ring-white/30' : ''}`}>
                          <bin.icon className={`w-14 h-14 ${bin.color} transition-transform duration-500 
                                            group-hover:rotate-12`} />
                        </div>
                        
                        <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-foreground to-foreground/80 
                                     bg-clip-text text-transparent">
                          {bin.label}
                        </h3>
                        
                        <p className="text-foreground/70 mb-6">
                          {bin.description}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex justify-around pt-6 border-t border-white/10">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {bin.stats.recycled}
                            </div>
                            <div className="text-sm text-foreground/60">
                              {language === "fr" ? "Recyclé" : "Recycled"}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-500">
                              {bin.stats.items}
                            </div>
                            <div className="text-sm text-foreground/60">
                              {language === "fr" ? "Articles" : "Items"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </FloatingWidget>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>
        
        {/* CTA Section */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <FloatingWidget intensity={1.5}>
            <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl 
                           bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
              <CardContent className="p-12 md:p-16 text-center relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-primary/20 to-pink-500/20 
                              rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 
                              rounded-full blur-3xl animate-pulse-slow delay-1000" />
                
                <MotionDiv
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-pink-500/30 
                           flex items-center justify-center mx-auto mb-10 border-4 border-white/20"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-white/80 
                                flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 bg-gradient-to-r from-primary to-pink-600 
                                           bg-clip-text text-transparent" />
                  </div>
                </MotionDiv>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">
                  <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 
                                 bg-clip-text text-transparent">
                    {getText("project.why.title", "Join the Revolution", "Rejoignez la Révolution")}
                  </span>
                </h2>
                
                <p className="text-xl text-foreground/90 leading-relaxed mb-10 max-w-2xl mx-auto relative z-10">
                  {getText("project.why.text", 
                    "Be part of the most innovative ecological movement. Together, we're building a sustainable future with cutting-edge technology and community power.",
                    "Faites partie du mouvement écologique le plus innovant. Ensemble, nous construisons un avenir durable avec une technologie de pointe et la puissance de la communauté."
                  )}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                  <AnimatedButton
                    variant="premium"
                    size="lg"
                    icon={<ZapIcon className="w-6 h-6" />}
                    href="/join"
                  >
                    {getText("project.joinNow", "Join Now", "Rejoindre Maintenant")}
                  </AnimatedButton>
                  
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    icon={<ShieldIcon className="w-6 h-6" />}
                    href="/learn"
                  >
                    {getText("project.learnMore", "Learn More", "En Savoir Plus")}
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          </FloatingWidget>
        </MotionSection>
      </div>
      
      {/* Floating Action Button */}
      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <FloatingWidget intensity={2}>
          <AnimatedButton
            variant="gradient"
            size="lg"
            icon={<Compass className="w-5 h-5" />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full w-16 h-16 p-0"
            aria-label="Scroll to top"
          />
        </FloatingWidget>
      </MotionDiv>
      
      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(2deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(20px) rotate(-2deg); }
        }
        
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(30deg); }
          100% { transform: translateX(300%) rotate(30deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-ripple {
          animation: ripple 0.6s linear;
        }
        
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
        
        /* Performance optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Hardware acceleration */
        .performance-layer {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient,
          .animate-float-slow,
          .animate-ripple,
          .animate-shine,
          .animate-pulse-slow {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
        
        /* Focus styles */
        :focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 3px;
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}

// Helper function (keep outside component)
function getText(key: string, fallbackEN: string, fallbackFR: string) {
  // This would use your translation hook in real implementation
  return fallbackEN;
}
