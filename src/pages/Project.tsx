import { Card, CardContent } from "@/components/ui/card";
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
  Leaf, 
  Recycle, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  Home,
  X,
  Share2,
  Rocket,
  ChevronUp,
  ChevronDown,
  Zap,
  TrendingUp,
  Globe,
  Heart,
  Star,
  Shield,
  Lightbulb,
  Cloud,
  Sun,
  Moon,
  Droplets,
  Wind,
  TreePine,
  Coins,
  Gem,
  Crown,
  Flame,
  Snowflake
} from "lucide-react";

// Hook pour le chargement différé de framer-motion
const useLazyFramerMotion = () => {
  const [motionComponents, setMotionComponents] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadFramerMotion = async () => {
      try {
        setLoading(true);
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
        console.warn('Framer Motion a échoué à charger, utilisation des animations CSS');
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadFramerMotion();
  }, []);

  return { ...motionComponents, error, loading };
};

// Écran de chargement amélioré avec animations premium
const LoadingScreenPremium = memo(() => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const messages = useMemo(() => [
    "Chargement de l'expérience écologique...",
    "Initialisation des particules animées...",
    "Préparation des animations fluides...",
    "Chargement des modules interactifs...",
    "Presque terminé..."
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
      
      setPhase(prev => {
        const newPhase = Math.floor(progress / 20);
        return Math.min(newPhase, messages.length - 1);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [progress, messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-full animate-spin-slow blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full animate-spin-slow-reverse blur-3xl" />
        
        {/* Grille animée */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.1) 100%),
              linear-gradient(transparent 95%, rgba(255,255,255,0.1) 100%)
            `,
            backgroundSize: '40px 40px',
            animation: 'grid-move 20s linear infinite'
          }}
        />
      </div>

      {/* Contenu principal du chargement */}
      <div className="relative z-10 text-center max-w-md mx-4">
        {/* Logo/icône animé */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 animate-spin-slow blur-lg" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-background to-background/80 flex items-center justify-center">
            <div className="relative">
              <Leaf className="w-16 h-16 text-primary animate-pulse-slow" />
              <div className="absolute -inset-4 rounded-full border-4 border-primary/30 animate-ping-slow" />
            </div>
          </div>
          
          {/* Particules tournantes */}
          {[0, 72, 144, 216, 288].map((rotation, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${rotation + phase * 36}deg) translateX(60px) rotate(-${rotation + phase * 36}deg)`,
                transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: `orbit-${i} 4s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Message de chargement */}
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-slow">
          {messages[phase]}
        </h3>

        {/* Barre de progression améliorée */}
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 rounded-full transition-all duration-300 ease-out-smooth"
            style={{ width: `${progress}%` }}
          >
            {/* Effet de brillance sur la barre */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine-slow" />
          </div>
          
          {/* Points animés sur la barre */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {[0, 25, 50, 75, 100].map((point) => (
              <div
                key={point}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${progress >= point ? 'bg-white scale-125' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Pourcentage et indicateur */}
        <div className="flex items-center justify-between text-sm text-white/70 mb-2">
          <span>Chargement...</span>
          <span className="font-bold text-white">{Math.round(progress)}%</span>
        </div>

        {/* Conseils écologiques pendant le chargement */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <p className="text-sm text-white/80 italic animate-fade-in-out">
            {phase === 0 && "💡 Le recyclage d'une tonne de papier sauve 17 arbres."}
            {phase === 1 && "🌱 Chaque geste compte pour préserver notre planète."}
            {phase === 2 && "♻️ Le plastique peut prendre jusqu'à 500 ans à se décomposer."}
            {phase === 3 && "🌍 Ensemble, nous pouvons créer un impact significatif."}
            {phase === 4 && "✨ Merci de votre engagement écologique !"}
          </p>
        </div>
      </div>
    </div>
  );
});

LoadingScreenPremium.displayName = 'LoadingScreenPremium';

// Composant Bouton Animé Premium avec animations ultra-fluides
const BoutonAnimePremium = memo(({ 
  children, 
  variant = "default",
  size = "default",
  className = "",
  onClick,
  icon,
  href,
  disabled = false,
  loading = false,
  fullWidth = false,
  glow = true,
  pulse = false,
  ...props 
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "premium" | "gradient" | "success" | "eco" | "warning";
  size?: "sm" | "default" | "lg" | "xl" | "2xl";
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  pulse?: boolean;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number, size: number, color: string}>>([]);
  
  // Effets sonores subtils (optionnels)
  const playHoverSound = useCallback(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 523.25; // Do
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, []);
  
  const playClickSound = useCallback(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 659.25; // Mi
      oscillator.type = 'sine';
      gainNode.gain.value = 0.15;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
      oscillator.stop(audioContext.currentTime + 0.15);
    }
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    if (!disabled && !loading) {
      setIsHovered(true);
      playHoverSound();
    }
  }, [disabled, loading, playHoverSound]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  
  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  }, [disabled, loading]);
  
  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);
  
  const handleFocus = useCallback(() => {
    if (!disabled && !loading) {
      setIsFocused(true);
    }
  }, [disabled, loading]);
  
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || loading) return;
    
    playClickSound();
    
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);
    
    // Couleurs différentes selon la variante
    const rippleColor = variant === 'premium' ? 'rgba(255,193,7,0.4)' : 
                       variant === 'eco' ? 'rgba(34,197,94,0.4)' : 
                       variant === 'gradient' ? 'rgba(59,130,246,0.4)' : 
                       'rgba(255,255,255,0.4)';
    
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id, size, color: rippleColor }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 800);
    
    if (onClick) onClick();
  }, [disabled, loading, onClick, playClickSound, variant]);
  
  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    default: "px-7 py-3.5 text-base",
    lg: "px-9 py-4.5 text-lg",
    xl: "px-12 py-5.5 text-xl",
    "2xl": "px-16 py-7 text-2xl"
  };
  
  const variantClasses = {
    default: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-primary/40",
    outline: "border-2 border-primary/40 bg-background/90 backdrop-blur-sm hover:border-primary/80 hover:bg-primary/15 hover:shadow-primary/30",
    premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 shadow-xl hover:shadow-orange-500/40",
    gradient: "bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 hover:from-primary/90 hover:via-emerald-700 hover:to-cyan-700 shadow-xl hover:shadow-primary/40",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl hover:shadow-emerald-500/40",
    eco: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-500/40",
    warning: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 shadow-xl hover:shadow-amber-500/40"
  };
  
  const ButtonContent = (
    <>
      {/* Effets d'Ondulation améliorés avec couleurs */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple-advanced"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: 'translate(-50%, -50%)',
            background: ripple.color
          }}
        />
      ))}
      
      {/* Effet de Brillance amélioré */}
      <span className="absolute inset-0 overflow-hidden rounded-2xl">
        <span className={`absolute -inset-y-full -left-32 w-32 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-1200 ease-out-smooth ${isHovered ? 'translate-x-[calc(100%+15rem)]' : '-translate-x-full'}`} />
      </span>
      
      {/* Effet de glow au survol */}
      {glow && (
        <span className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary/30 via-emerald-500/20 to-cyan-500/30 transition-all duration-700 blur-xl ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      )}
      
      {/* Effet de pulse pour les boutons spéciaux */}
      {pulse && (
        <span className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-primary/40 via-emerald-500/30 to-cyan-500/40 animate-pulse-slow transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'}`} />
      )}
      
      {/* État Loading */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
          <div className="relative">
            <span className="animate-spin-smooth rounded-full h-8 w-8 border-t-3 border-b-3 border-white"></span>
            <span className="absolute inset-0 animate-spin-slow rounded-full h-8 w-8 border-t-3 border-b-3 border-primary/30"></span>
          </div>
        </span>
      )}
      
      {/* Effet de focus */}
      {isFocused && (
        <span className="absolute -inset-1 rounded-2xl border-3 border-white/50 animate-pulse-fast" />
      )}
      
      <span className={`relative flex items-center justify-center gap-3 transition-all duration-500 ease-out-smooth ${isPressed ? 'scale-95' : ''}`}>
        {icon && !loading && (
          <span className={`transition-all duration-500 ease-out-smooth ${isHovered ? 'scale-125 rotate-12' : ''}`}>
            {icon}
          </span>
        )}
        {loading ? (
          <span className="opacity-0">{children}</span>
        ) : (
          <span className={`relative ${isHovered ? 'scale-105' : ''} transition-transform duration-300`}>
            {children}
          </span>
        )}
        {!loading && variant !== 'outline' && (
          <ArrowRight className={`w-5 h-5 transition-all duration-500 ease-out-smooth ${isHovered ? 'translate-x-3 scale-125 rotate-6' : ''}`} />
        )}
      </span>
    </>
  );
  
  const buttonClasses = `
    relative overflow-hidden rounded-2xl font-bold
    transition-all duration-500 ease-out-smooth
    hover-lift-strong hover-glow-strong
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-4 focus:ring-primary/30
    ${fullWidth ? 'w-full' : ''}
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${isHovered ? 'shadow-2xl scale-105' : 'shadow-xl'}
    ${isPressed ? 'scale-95 shadow-lg' : ''}
    ${isFocused ? 'ring-4 ring-primary/30' : ''}
    transform-gpu
  `;
  
  if (href && !disabled && !loading) {
    return (
      <Link 
        to={href} 
        className={`inline-block ${fullWidth ? 'w-full' : ''} smooth-hover`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          ref={buttonRef}
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          disabled={disabled || loading}
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
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {ButtonContent}
    </button>
  );
});

BoutonAnimePremium.displayName = 'BoutonAnimePremium';

// Composant Widget Flottant redessiné avec animations ultra-fluides
const WidgetFlottantPremium = memo(({
  children,
  intensity = 1,
  className = "",
  interactive = true,
  glow = true,
  minHeight = "min-h-[320px]",
  equalSize = true,
  onHoverChange,
  delay = 0,
  scrollReveal = true,
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  minHeight?: string;
  equalSize?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  delay?: number;
  scrollReveal?: boolean;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  
  // Animation de révélation au scroll
  useEffect(() => {
    if (!scrollReveal || !widgetRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observerRef.current.observe(widgetRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [scrollReveal, delay]);
  
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!widgetRef.current) return;
      
      const rect = widgetRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      requestAnimationFrame(() => {
        setMousePosition({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
      });
    };
    
    const handleMouseEnter = () => {
      setIsHovered(true);
      onHoverChange?.(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
      onHoverChange?.(false);
    };
    
    const widget = widgetRef.current;
    if (widget) {
      widget.addEventListener('mousemove', handleMouseMove);
      widget.addEventListener('mouseenter', handleMouseEnter);
      widget.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (widget) {
        widget.removeEventListener('mousemove', handleMouseMove);
        widget.removeEventListener('mouseenter', handleMouseEnter);
        widget.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, onHoverChange]);
  
  const rotateX = interactive ? mousePosition.y * 10 * intensity : 0;
  const rotateY = interactive ? -mousePosition.x * 10 * intensity : 0;
  const translateZ = isHovered ? 30 : 0;
  const scale = isHovered ? 1.03 : isVisible ? 1 : 0.95;
  const opacity = isVisible ? 1 : 0;
  
  return (
    <div
      ref={widgetRef}
      className={`relative rounded-3xl group smooth-hover-strong ${className}
        ${equalSize ? 'w-full h-full flex flex-col' : ''}
        ${minHeight}
        transform-gpu
      `}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
        opacity,
        transition: `
          transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
          opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
          box-shadow 800ms cubic-bezier(0.16, 1, 0.3, 1)
        `,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Animated gradient border avec animation de pulse */}
      <div className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-primary/50 via-emerald-500/50 to-cyan-500/50 transition-all duration-1000 ${isHovered ? 'opacity-100 animate-gradient-border' : 'opacity-0'}`} 
        style={{ filter: 'blur(1.5px)' }}
      />
      
      {/* Glow effect on hover */}
      {glow && (
        <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 via-emerald-500/25 to-cyan-500/30 transition-all duration-1000 ${isHovered ? 'opacity-100 blur-3xl' : 'opacity-0 blur-2xl'}`} />
      )}
      
      {/* Inner shadow and background avec dégradé animé */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-card/95 via-card/90 to-card/85 shadow-2xl transition-all duration-1000 ${isHovered ? 'shadow-3xl' : ''}`} />
      
      {/* Shimmer effect on hover */}
      <div className={`absolute inset-0 rounded-3xl overflow-hidden`}>
        <div className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1500 ease-out-smooth ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
      </div>
      
      {/* Points de lumière animés */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/30 blur-sm"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
              animation: `float-particle ${3 + i * 0.5}s ease-in-out infinite ${i * 0.3}s`,
              opacity: isHovered ? 0.7 : 0.3,
            }}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="relative z-10 h-full transform-gpu">
        {children}
      </div>
    </div>
  );
});

WidgetFlottantPremium.displayName = 'WidgetFlottantPremium';

// Système de particules optimisé et amélioré
const FondParticulesUltra = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Définir la taille du canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    // Classe Particule ultra améliorée
    class Particule {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      distanceFromMouse: number;
      orbitRadius: number;
      orbitSpeed: number;
      orbitAngle: number;
      type: 'normal' | 'sparkle' | 'orb';
      
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.distanceFromMouse = 0;
        this.orbitRadius = Math.random() * 50 + 20;
        this.orbitSpeed = Math.random() * 0.02 + 0.01;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.type = Math.random() > 0.9 ? 'sparkle' : Math.random() > 0.8 ? 'orb' : 'normal';
      }
      
      getRandomColor() {
        const colors = [
          `rgb(100, 200, 255)`,    // Bleu clair
          `rgb(100, 255, 200)`,    // Turquoise
          `rgb(255, 200, 100)`,    // Orange clair
          `rgb(200, 100, 255)`,    // Violet
          `rgb(255, 100, 200)`,    // Rose
          `rgb(100, 255, 255)`,    // Cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      
      update(time: number) {
        // Mouvement orbital pour certaines particules
        if (this.type === 'orb') {
          this.orbitAngle += this.orbitSpeed;
          this.x = mouseRef.current.x + Math.cos(this.orbitAngle) * this.orbitRadius;
          this.y = mouseRef.current.y + Math.sin(this.orbitAngle) * this.orbitRadius;
        } else {
          this.x += this.speedX;
          this.y += this.speedY;
        }
        
        // Rebond sur les bords
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
        
        // Animation de pulsation
        this.alpha = 0.15 + Math.sin(time * this.pulseSpeed) * 0.25;
        
        // Interaction avec la souris
        const dx = this.x - mouseRef.current.x;
        const dy = this.y - mouseRef.current.y;
        this.distanceFromMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (this.distanceFromMouse < 150 && this.type !== 'orb') {
          const angle = Math.atan2(dy, dx);
          const force = (150 - this.distanceFromMouse) / 150;
          this.x += Math.cos(angle) * force * 2;
          this.y += Math.sin(angle) * force * 2;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.save();
        
        if (this.type === 'sparkle') {
          // Particules scintillantes
          ctx.globalAlpha = this.alpha * 0.7;
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Rayons
          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
              this.x + Math.cos(i * Math.PI / 2) * this.size * 3,
              this.y + Math.sin(i * Math.PI / 2) * this.size * 3
            );
            ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        } else {
          // Particules normales ou orbitales
          ctx.globalAlpha = this.alpha;
          
          // Dégradé radial pour les orbes
          if (this.type === 'orb') {
            const gradient = ctx.createRadialGradient(
              this.x, this.y, 0,
              this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, this.color.replace('rgb', 'rgba').replace(')', ', 0.8)'));
            gradient.addColorStop(1, this.color.replace('rgb', 'rgba').replace(')', ', 0)'));
            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = this.color;
          }
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Dessiner les connexions améliorées
          particlesRef.current.forEach(particule => {
            const dx = this.x - particule.x;
            const dy = this.y - particule.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.beginPath();
              const gradient = ctx.createLinearGradient(
                this.x, this.y,
                particule.x, particule.y
              );
              gradient.addColorStop(0, this.color.replace('rgb', 'rgba').replace(')', `, ${0.3 * (1 - distance/120)})`));
              gradient.addColorStop(1, particule.color.replace('rgb', 'rgba').replace(')', `, ${0.3 * (1 - distance/120)})`));
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.8 * (1 - distance/120);
              ctx.moveTo(this.x, this.y);
              ctx.lineTo(particule.x, particule.y);
              ctx.stroke();
            }
          });
        }
        ctx.restore();
      }
    }
    
    // Créer des particules
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 120);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particule());
      }
    };
    
    initParticles();
    
    // Boucle d'animation optimisée
    const animate = () => {
      timeRef.current += 0.01;
      
      // Fond dégradé animé
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dégradé de fond animé
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width * Math.cos(timeRef.current * 0.2),
        canvas.height * Math.sin(timeRef.current * 0.2)
      );
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.15)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Motifs de fond subtils
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      const gridSize = 60;
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          if ((x / gridSize + y / gridSize) % 2 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Mettre à jour et dessiner les particules
      particlesRef.current.forEach(particule => {
        particule.update(timeRef.current);
        particule.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
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
      
      {/* Enhanced animated gradient overlays */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Primary gradient layer with smooth animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" 
          style={{ 
            animation: 'gradient-pan 15s ease-in-out infinite',
            backgroundSize: '200% 200%'
          }} 
        />
        
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-emerald-500/20 via-emerald-500/10 to-transparent" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-gradient-radial from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl"
          style={{ 
            animation: 'float-orb-advanced 25s ease-in-out infinite',
            filter: 'blur(40px)'
          }}
        />
        <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] bg-gradient-radial from-emerald-500/25 via-emerald-500/10 to-transparent rounded-full blur-3xl"
          style={{ 
            animation: 'float-orb-advanced 30s ease-in-out infinite reverse',
            filter: 'blur(40px)'
          }}
        />
        <div className="absolute bottom-[10%] left-[30%] w-[700px] h-[700px] bg-gradient-radial from-cyan-500/20 via-cyan-500/8 to-transparent rounded-full blur-3xl"
          style={{ 
            animation: 'float-orb-advanced 35s ease-in-out infinite',
            filter: 'blur(40px)'
          }}
        />
        
        {/* Light beams */}
        <div className="absolute top-0 left-1/4 w-1 h-[100vh] bg-gradient-to-b from-primary/30 via-transparent to-transparent animate-light-beam" />
        <div className="absolute top-0 left-3/4 w-1 h-[100vh] bg-gradient-to-b from-emerald-500/30 via-transparent to-transparent animate-light-beam delay-1000" />
        
        {/* Floating particles overlay */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-primary/20 to-emerald-500/20"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float-particle-slow ${15 + Math.random() * 10}s ease-in-out infinite ${i * 0.5}s`,
                filter: 'blur(1px)'
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
});

FondParticulesUltra.displayName = 'FondParticulesUltra';

// Composant Carte Interactive ultra améliorée
const CarteInteractiveUltra = memo(({ 
  icon: Icon,
  title,
  description,
  color = "text-primary",
  bg = "bg-gradient-to-br from-primary/20 to-primary/10",
  border = "border-primary/20",
  onClick,
  isActive = false,
  equalSize = true,
  delay = 0,
  tags = [],
}: {
  icon: any;
  title: string;
  description: string;
  color?: string;
  bg?: string;
  border?: string;
  onClick?: () => void;
  isActive?: boolean;
  equalSize?: boolean;
  delay?: number;
  tags?: string[];
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Animation d'entrée au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  
  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);
  
  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);
  
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);
  
  return (
    <div ref={cardRef} className="h-full">
      <WidgetFlottantPremium 
        intensity={0.8} 
        glow={true}
        minHeight="min-h-[320px]"
        equalSize={equalSize}
        onHoverChange={setIsHovered}
        delay={delay}
        scrollReveal={true}
      >
        <div
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`cursor-pointer h-full smooth-hover-strong ${isPressed ? 'scale-[0.98]' : ''}`}
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
            opacity: isVisible ? 1 : 0,
            transition: `transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, opacity 600ms ease-out ${delay}ms`
          }}
        >
          <Card className={`h-full border-0 overflow-hidden bg-transparent rounded-3xl performance-layer`}>
            <CardContent className="p-8 text-center relative flex flex-col items-center justify-center h-full">
              {/* Active indicator avec animation */}
              {isActive && (
                <div className="absolute top-5 right-5 z-20">
                  <div className="relative">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse-glow shadow-lg shadow-emerald-500/50" />
                    <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/30 animate-ping-slow" />
                  </div>
                </div>
              )}
              
              {/* Tags */}
              {tags.length > 0 && (
                <div className="absolute top-5 left-5 flex gap-2 z-20">
                  {tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary backdrop-blur-sm border border-primary/20"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                        transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + index * 100}ms`
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Animated background circles */}
              <div className={`absolute inset-0 overflow-hidden rounded-3xl`}>
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${bg} transition-all duration-1000 ease-out-smooth ${isHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-30'}`} />
                <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full ${bg} transition-all duration-1000 ease-out-smooth delay-200 ${isHovered ? 'scale-150 opacity-70' : 'scale-100 opacity-30'}`} />
                
                {/* Lignes de fond animées */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent" />
                  <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent" />
                </div>
              </div>
              
              {/* Icon container with ultra animations */}
              <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-3xl ${bg} 
                            flex items-center justify-center mx-auto mb-8 overflow-hidden
                            smooth-hover-strong hover-lift-strong hover-rotate-3d
                            ${isHovered ? 'scale-110 shadow-2xl' : 'shadow-xl'}
                            ${isActive ? 'ring-4 ring-primary/40 scale-105' : ''}
                            transform-gpu`}
                style={{
                  transform: isHovered ? 'rotateY(5deg) rotateX(5deg)' : 'rotateY(0) rotateX(0)',
                  transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                {/* Inner glow */}
                <div className={`absolute inset-0 bg-gradient-to-br from-white/30 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* Particles around icon */}
                {isHovered && [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/50"
                    style={{
                      transform: `rotate(${i * 60}deg) translateX(60px) rotate(-${i * 60}deg)`,
                      animation: `orbit-particle 2s ease-in-out infinite ${i * 0.2}s`
                    }}
                  />
                ))}
                
                <Icon className={`relative z-10 w-14 h-14 md:w-16 md:h-16 ${color} smooth-hover-strong hover-scale-strong
                              ${isHovered ? 'scale-125 rotate-12 animate-wiggle' : ''}`} />
              </div>
              
              {/* Title with gradient animation */}
              <h3 className={`relative z-10 font-bold text-2xl md:text-3xl mb-4 smooth-hover-strong
                            ${isHovered ? 'scale-105' : ''}`}>
                <span className={`bg-gradient-to-r ${isHovered ? 'from-primary via-emerald-500 to-cyan-500' : 'from-foreground to-foreground/80'} bg-clip-text text-transparent animate-gradient-slow`}>
                  {title}
                </span>
              </h3>
              
              {/* Description avec animation de fade */}
              <p className={`relative z-10 text-base md:text-lg mb-6 smooth-hover-strong flex-grow
                            ${isHovered ? 'text-foreground scale-105' : 'text-muted-foreground'}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 200}ms`
                }}>
                {description}
              </p>
              
              {/* Stats ou indicateurs (optionnel) */}
              {isHovered && (
                <div className="relative z-10 w-full mb-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">95%</div>
                      <div className="text-xs text-muted-foreground">Efficacité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-500">24/7</div>
                      <div className="text-xs text-muted-foreground">Disponible</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-500">100%</div>
                      <div className="text-xs text-muted-foreground">Écologique</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hover indicator avec animation fluide */}
              <div className={`relative z-10 mt-6 pt-6 border-t transition-all duration-700 overflow-hidden
                             ${isHovered ? 'border-primary/40 opacity-100 max-h-24' : 'border-transparent opacity-0 max-h-0'}`}>
                <div className="flex items-center justify-center gap-3 text-primary text-sm font-medium animate-pulse-slow">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Cliquez pour explorer
                  </span>
                  <ArrowRight className="w-4 h-4 animate-bounce-smooth" style={{ animationDuration: '1.2s' }} />
                </div>
              </div>
              
              {/* Subtle particle effects on hover */}
              {isHovered && (
                <>
                  <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-primary/30 animate-ping-slow" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-emerald-500/30 animate-ping-slow delay-300" />
                  <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-cyan-500/30 animate-ping-slow delay-600" />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </WidgetFlottantPremium>
    </div>
  );
});

CarteInteractiveUltra.displayName = 'CarteInteractiveUltra';

// Composant Panel Détails amélioré avec animations
const PanelDetailsUltra = memo(({ 
  icon: Icon,
  title,
  description,
  details,
  color = "text-primary",
  bg = "bg-gradient-to-br from-primary/20 to-primary/10",
  border = "border-primary/30",
  onClose,
  equalSize = true,
  stats = [],
}: {
  icon: any;
  title: string;
  description: string;
  details: string;
  color?: string;
  bg?: string;
  border?: string;
  onClose?: () => void;
  equalSize?: boolean;
  stats?: Array<{ label: string; value: string; icon: any }>;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, 200);
        }
      },
      { threshold: 0.1 }
    );
    
    if (panelRef.current) {
      observer.observe(panelRef.current);
    }
    
    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current);
      }
    };
  }, []);
  
  return (
    <div ref={panelRef}>
      <WidgetFlottantPremium 
        intensity={0.5} 
        glow={true}
        minHeight="min-h-[420px]"
        equalSize={equalSize}
        onHoverChange={setIsHovered}
        scrollReveal={true}
      >
        <Card className={`h-full border-2 ${border} overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl smooth-hover-strong ${isHovered ? 'shadow-3xl' : ''}`}
          style={{
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 800ms cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
          <CardContent className="p-6 md:p-8 h-full flex flex-col">
            {/* En-tête avec animations */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`relative w-14 h-14 rounded-xl ${bg} flex items-center justify-center smooth-hover-strong ${isHovered ? 'scale-110 rotate-6' : ''}`}>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                  <Icon className={`relative z-10 w-7 h-7 ${color} smooth-hover-strong ${isHovered ? 'scale-125 rotate-12' : ''}`} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                    {title}
                  </h3>
                  <p className="text-sm text-foreground/70 mt-1 animate-fade-in">{description}</p>
                </div>
              </div>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl smooth-hover-strong hover-scale-strong hover-rotate-strong relative group"
                  aria-label="Fermer"
                >
                  <X className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-red-500/80 animate-pulse-slow" />
                </button>
              )}
            </div>
            
            {/* Contenu détaillé avec animations */}
            <div className="space-y-8 flex-grow">
              <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h4 className="font-semibold text-lg mb-4 text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Description Détaillée
                </h4>
                <p className="text-foreground/80 leading-relaxed text-lg">{details}</p>
              </div>
              
              {/* Stats avec animations */}
              {stats.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <h4 className="font-semibold text-lg mb-4 text-emerald-500 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Statistiques Clés
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div 
                        key={stat.label}
                        className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 smooth-hover-strong hover-lift-strong"
                        style={{
                          animationDelay: `${300 + index * 100}ms`,
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                          transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${300 + index * 100}ms`
                        }}
                      >
                        <div className="flex justify-center mb-2">
                          <stat.icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Timeline ou étapes (optionnel) */}
              <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <h4 className="font-semibold text-lg mb-4 text-cyan-500 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Prochaines Étapes
                </h4>
                <div className="space-y-3">
                  {['Analyse', 'Mise en œuvre', 'Optimisation', 'Suivi'].map((step, index) => (
                    <div 
                      key={step}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 smooth-hover-strong"
                      style={{
                        animationDelay: `${400 + index * 100}ms`,
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                        transition: `all 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${400 + index * 100}ms`
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      </div>
                      <span className="font-medium">{step}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Actions avec animations */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-white/20 gap-4">
              <div className="flex items-center gap-3">
                <BoutonAnimePremium
                  variant="outline"
                  size="sm"
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={() => navigator.share?.({ title, text: description })}
                  pulse={true}
                >
                  Partager
                </BoutonAnimePremium>
                
                <BoutonAnimePremium
                  variant="outline"
                  size="sm"
                  icon={<Heart className="w-4 h-4" />}
                  onClick={() => {}}
                >
                  Favoris
                </BoutonAnimePremium>
              </div>
              
              <div className="flex items-center gap-3">
                <BoutonAnimePremium
                  variant="gradient"
                  size="sm"
                  icon={<BookOpen className="w-4 h-4" />}
                  href={`/guide/${title.toLowerCase().replace(/ /g, '-')}`}
                  glow={true}
                >
                  Guide Complet
                </BoutonAnimePremium>
                
                <BoutonAnimePremium
                  variant="eco"
                  size="sm"
                  icon={<Leaf className="w-4 h-4" />}
                  href="/action"
                  pulse={true}
                >
                  Agir Maintenant
                </BoutonAnimePremium>
              </div>
            </div>
          </CardContent>
        </Card>
      </WidgetFlottantPremium>
    </div>
  );
});

PanelDetailsUltra.displayName = 'PanelDetailsUltra';

// Composant de navigation par scroll amélioré
const ScrollNavigation = memo(({ 
  sections,
  activeSection,
  onSectionClick
}: {
  sections: Array<{ id: string; label: string; icon: any }>;
  activeSection: string;
  onSectionClick: (id: string) => void;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY.current || currentScrollY < 100);
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div 
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out-smooth ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
    >
      <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(section.id)}
            className={`relative p-3 rounded-xl smooth-hover-strong transition-all duration-300
              ${activeSection === section.id 
                ? 'bg-gradient-to-r from-primary/20 to-emerald-500/20 text-primary' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            aria-label={`Aller à ${section.label}`}
          >
            <section.icon className="w-5 h-5" />
            
            {/* Indicateur actif */}
            {activeSection === section.id && (
              <>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gradient-to-b from-primary to-emerald-500 animate-pulse-slow" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-ping-slow" />
              </>
            )}
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-background/90 backdrop-blur-xl border border-white/10 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {section.label}
            </div>
          </button>
        ))}
        
        {/* Barre de progression */}
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        
        {/* Bouton retour en haut */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 smooth-hover-strong"
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

ScrollNavigation.displayName = 'ScrollNavigation';

// Composant principal ultra amélioré
export default function ProjectUltra() {
  useLanguage();
  const { motion, error: framerMotionError, loading: framerMotionLoading } = useLazyFramerMotion();
  
  // États améliorés
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showBinDetails, setShowBinDetails] = useState(false);
  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState<'light' | 'dark' | 'eco'>('dark');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement }>({});
  
  // Effet curseur personnalisé
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"]')) {
        setCursorVariant('pointer');
      } else if (target.closest('.interactive-card, .widget')) {
        setCursorVariant('hover');
      } else {
        setCursorVariant('default');
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  
  // Données avec tailles standardisées et tags
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      border: "border-amber-400/30", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons, emballages papier",
      details: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres, réduire la consommation d'eau (jusqu'à 90% d'économie) et d'énergie (jusqu'à 50% d'économie). Notre système de collecte optimisé garantit un taux de recyclage optimal.",
      tags: ["Recyclable", "Économie d'eau", "Sauve des arbres"],
      stats: [
        { label: "Taux de recyclage", value: "85%", icon: TrendingUp },
        { label: "Économie d'eau", value: "90%", icon: Droplets },
        { label: "Arbres sauvés", value: "17/tonne", icon: TreePine },
        { label: "Énergie économisée", value: "50%", icon: Zap }
      ]
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      border: "border-blue-400/30", 
      label: "Plastique",
      description: "Bouteilles, emballages, films plastiques recyclables",
      details: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer dans la nature. Notre programme de recyclage innovant transforme les plastiques usagés en nouvelles ressources. Nous utilisons des technologies de tri optique pour séparer les différents types de plastiques et maximiser leur valeur de recyclage.",
      tags: ["Recyclable", "Longue durée", "Innovation"],
      stats: [
        { label: "Temps de décomposition", value: "500 ans", icon: Clock },
        { label: "Taux de recyclage", value: "45%", icon: TrendingUp },
        { label: "Nouveaux produits", value: "Infini", icon: Recycle },
        { label: "Réduction CO₂", value: "75%", icon: Cloud }
      ]
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      border: "border-gray-400/30", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve, produits métalliques",
      details: "Le recyclage des métaux est particulièrement efficace : il permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire. Notre centre de tri utilise des aimants puissants et des courants de Foucault pour séparer les métaux ferreux et non-ferreux avec une précision de 99%.",
      tags: ["Recyclable à l'infini", "Économie d'énergie", "Haute valeur"],
      stats: [
        { label: "Économie d'énergie", value: "95%", icon: Zap },
        { label: "Précision du tri", value: "99%", icon: Target },
        { label: "Recyclage infini", value: "✓", icon: Infinity },
        { label: "Valeur récupérée", value: "100%", icon: Coins }
      ]
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      border: "border-green-400/30", 
      label: "Organique",
      description: "Déchets alimentaires, résidus végétaux, compostables",
      details: "Les déchets organiques représentent environ 30% de notre poubelle. Notre programme de compostage communautaire transforme ces déchets en ressources précieuses. Le compost produit est utilisé pour enrichir les sols des jardins communautaires, des espaces verts publics et des fermes locales.",
      tags: ["Compostable", "Fertilisant naturel", "Économie circulaire"],
      stats: [
        { label: "Part des déchets", value: "30%", icon: PieChart },
        { label: "Compost produit", value: "40%", icon: Leaf },
        { label: "Sol enrichi", value: "100%", icon: TreePine },
        { label: "Émissions évitées", value: "60%", icon: Cloud }
      ]
    },
  ], []);
  
  const goals = useMemo(() => [
    {
      icon: Target,
      title: "Mission Éducative",
      description: "Éduquer et sensibiliser la communauté aux enjeux environnementaux",
      details: "Notre programme éducatif complet s'adresse à tous les publics. Nous organisons des ateliers pratiques, des conférences interactives et fournissons des ressources pédagogiques gratuites. Notre objectif est de créer une culture durable partagée par tous les membres de la communauté.",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
      border: "border-blue-400/30",
      tags: ["Éducation", "Sensibilisation", "Formation"]
    },
    {
      icon: Users,
      title: "Engagement Communautaire",
      description: "Créer une communauté active et engagée dans la protection de l'environnement",
      details: "Nous croyons fermement que le changement durable vient de la base. Notre réseau grandissant de bénévoles et d'ambassadeurs écologiques organise des événements réguliers, des opérations de nettoyage et des projets collaboratifs qui renforcent les liens communautaires tout en protégeant l'environnement.",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      border: "border-green-400/30",
      tags: ["Communauté", "Bénévolat", "Collaboration"]
    },
    {
      icon: Recycle,
      title: "Innovation Technologique",
      description: "Développer des solutions innovantes pour le tri et la valorisation des déchets",
      details: "Nous investissons continuellement dans la recherche et le développement de technologies de pointe. Nos centres de tri intelligents utilisent l'IA et la robotique pour améliorer l'efficacité du tri, tandis que nos projets de R&D explorent de nouvelles filières de valorisation des déchets complexes.",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      border: "border-purple-400/30",
      tags: ["Innovation", "Technologie", "R&D"]
    },
    {
      icon: Award,
      title: "Impact Mesurable",
      description: "Atteindre des résultats concrets et mesurables pour notre planète",
      details: "La transparence et la mesure de l'impact sont au cœur de notre démarche. Nous suivons rigoureusement nos progrès avec des indicateurs clés de performance environnementaux. Nos rapports annuels détaillés permettent à chaque membre de la communauté de voir concrètement les résultats de ses efforts.",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      border: "border-amber-400/30",
      tags: ["Transparence", "Mesure", "Résultats"]
    }
  ], []);
  
  const actions = useMemo(() => [
    {
      icon: Calendar,
      title: "Événements Réguliers",
      description: "Participez à nos événements communautaires et ateliers pratiques",
      details: "Chaque mois, nous organisons des activités variées : clean-ups, ateliers de compostage, conférences et visites de centres de tri.",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
      border: "border-blue-400/30",
      href: "/activities",
      tags: ["Événements", "Ateliers", "Pratique"]
    },
    {
      icon: BookOpen,
      title: "Programme Éducatif",
      description: "Formations et ressources pour tous les niveaux",
      details: "Notre programme éducatif couvre les écoles, les entreprises et le grand public avec des contenus adaptés à chaque public.",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      border: "border-green-400/30",
      href: "/resources",
      tags: ["Éducation", "Ressources", "Formation"]
    },
    {
      icon: Home,
      title: "Solutions Domestiques",
      description: "Conseils et outils pour un foyer plus écologique",
      details: "Découvrez comment réduire votre empreinte écologique à la maison avec nos guides pratiques et kits de démarrage.",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      border: "border-purple-400/30",
      href: "/guide",
      tags: ["Maison", "Conseils", "Guides"]
    },
    {
      icon: Award,
      title: "Certification Écologique",
      description: "Obtenir la certification environnementale pour notre communauté",
      details: "Notre programme de certification valorise les entreprises et individus qui s'engagent concrètement pour l'environnement.",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      border: "border-amber-400/30",
      href: "/project",
      tags: ["Certification", "Reconnaissance", "Engagement"]
    }
  ], []);
  
  const sections = useMemo(() => [
    { id: 'hero', label: 'Accueil', icon: Home },
    { id: 'goals', label: 'Objectifs', icon: Target },
    { id: 'bins', label: 'Tri Sélectif', icon: Recycle },
    { id: 'actions', label: 'Actions', icon: Rocket },
    { id: 'cta', label: 'Engagement', icon: Heart },
  ], []);
  
  // Animation de scroll améliorée
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      
      // Détection de la section active
      const sections = ['hero', 'goals', 'bins', 'actions', 'cta'];
      for (const sectionId of sections) {
        const element = sectionsRef.current[sectionId];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Rotation automatique améliorée
  useEffect(() => {
    mountedRef.current = true;
    
    const rotateBins = () => {
      if (mountedRef.current && isAutoRotating && !showBinDetails) {
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      }
    };
    
    if (autoRotationInterval.current) {
      clearInterval(autoRotationInterval.current);
    }
    
    autoRotationInterval.current = setInterval(rotateBins, 3500);
    
    return () => {
      mountedRef.current = false;
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, showBinDetails, bins.length]);
  
  // Gestion des interactions ultra améliorée
  const handleBinInteraction = useCallback((index: number) => {
    setActiveBinIndex(index);
    setIsAutoRotating(false);
    setShowBinDetails(true);
    
    setTimeout(() => {
      if (mountedRef.current) {
        setIsAutoRotating(true);
      }
    }, 20000);
  }, []);
  
  const handleGoalInteraction = useCallback((index: number) => {
    setActiveGoalIndex(index === activeGoalIndex ? null : index);
  }, [activeGoalIndex]);
  
  const handleCloseDetails = useCallback(() => {
    setShowBinDetails(false);
    setActiveGoalIndex(null);
  }, []);
  
  const handleSectionClick = useCallback((sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);
  
  // Utiliser les composants motion
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';
  const AnimatePresence = motion?.AnimatePresence || 'div';
  const useScroll = motion?.useScroll;
  const useTransform = motion?.useTransform;
  
  // Animations de scroll avec Framer Motion
  const { scrollYProgress } = useScroll?.() || { scrollYProgress: { get: () => 0 } };
  const scaleX = useTransform?.(scrollYProgress, [0, 1], [0, 1]) || scrollProgress / 100;
  
  if (framerMotionLoading) {
    return <LoadingScreenPremium />;
  }
  
  if (framerMotionError) {
    return (
      <div className="min-h-screen">
        <FondParticulesUltra />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Projet Écologique</h1>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen overflow-hidden" ref={containerRef}>
      <FondParticulesUltra />
      
      {/* Curseur personnalisé amélioré */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div 
          className={`absolute w-8 h-8 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out-smooth ${
            cursorVariant === 'pointer' 
              ? 'bg-primary/20 border-2 border-primary/50 scale-150' 
              : cursorVariant === 'hover'
              ? 'bg-emerald-500/10 border-2 border-emerald-500/30 scale-125'
              : 'bg-white/10 border border-white/20'
          }`}
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
        <div 
          className="absolute w-2 h-2 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-linear"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
      </div>
      
      {/* Indicateur de progression du scroll amélioré */}
      <div className="fixed top-0 left-0 w-full h-1 z-40 bg-background/50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 transition-all duration-300 rounded-r-full"
          style={{ width: `${scrollProgress}%` }}
        />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
      </div>
      
      {/* Navigation par scroll */}
      <ScrollNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Section Héro avec animations avancées */}
        <MotionSection
          ref={(el) => { if (el) sectionsRef.current.hero = el; }}
          id="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24 lg:mb-32 pt-16"
        >
          <MotionDiv
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/30 via-emerald-500/30 to-cyan-500/30 
                       text-primary px-8 py-4 rounded-full text-base font-bold mb-12 
                       border border-white/20 backdrop-blur-xl shadow-2xl smooth-hover-strong hover-scale-strong hover-rotate"
          >
            <Sparkles className="w-5 h-5 animate-sparkle" />
            <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-slow">
              Initiative Écologique Excellence 2024
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter">
              <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent 
                            animate-gradient-advanced bg-400% leading-none">
                Projet Écologique
              </span>
            </h1>
            
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-emerald-500/20 to-cyan-500/20 blur-2xl rounded-full" />
              <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Notre Planète, Notre Avenir
              </h2>
            </div>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-16"
          >
            <p className="text-2xl md:text-3xl text-foreground/90 leading-relaxed font-light mb-8 animate-fade-in-up">
              Bienvenue dans notre mouvement écologique communautaire. Chaque geste compte, chaque action a un impact, 
              et ensemble, nous créons un avenir durable pour les générations à venir.
            </p>
            <div className="inline-flex items-center gap-6 text-lg text-foreground/70 animate-slide-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Impact mesurable</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Communauté engagée</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                <span>Solutions durables</span>
              </div>
            </div>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 max-w-2xl mx-auto"
          >
            <BoutonAnimePremium
              variant="gradient"
              size="2xl"
              icon={<Rocket className="w-7 h-7" />}
              href="/guide"
              fullWidth={true}
              glow={true}
              pulse={true}
              className="animate-bounce-subtle"
            >
              Commencer l'Aventure
            </BoutonAnimePremium>
            
            <BoutonAnimePremium
              variant="outline"
              size="2xl"
              icon={<BookOpen className="w-7 h-7" />}
              href="/resources"
              fullWidth={true}
              className="hover:border-primary/60"
            >
              Explorer les Ressources
            </BoutonAnimePremium>
          </MotionDiv>
          
          {/* Stats en temps réel */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: "2,458", label: "Membres Actifs", icon: Users, color: "text-blue-500" },
              { value: "15.7t", label: "Déchets Recyclés", icon: Recycle, color: "text-emerald-500" },
              { value: "128", label: "Événements", icon: Calendar, color: "text-purple-500" },
              { value: "95%", label: "Satisfaction", icon: Heart, color: "text-pink-500" },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 smooth-hover-strong hover-lift-strong"
                style={{
                  animationDelay: `${1.2 + index * 0.1}s`,
                  animation: 'fade-in-up 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className={`text-4xl font-bold mb-2 ${stat.color} animate-count-up`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <stat.icon className="w-4 h-4" />
                  {stat.label}
                </div>
              </div>
            ))}
          </MotionDiv>
        </MotionSection>
        
        {/* Section Objectifs avec animations de scroll */}
        <MotionSection
          ref={(el) => { if (el) sectionsRef.current.goals = el; }}
          id="goals"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20 md:mb-32 scroll-mt-20"
        >
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <div className="inline-block relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-emerald-500/20 blur-xl rounded-full" />
              <h2 className="relative text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-advanced">
                  Notre Vision
                </span>
              </h2>
            </div>
            <p className="text-2xl text-foreground/80 max-w-3xl mx-auto animate-fade-in-up">
              Une vision claire, des objectifs ambitieux, un impact réel
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {goals.map((goal, index) => (
              <MotionDiv
                key={goal.title}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 80 }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={goal.icon}
                  title={goal.title}
                  description={goal.description}
                  color={goal.color}
                  bg={goal.bg}
                  border={goal.border}
                  onClick={() => handleGoalInteraction(index)}
                  isActive={activeGoalIndex === index}
                  equalSize={true}
                  delay={index * 100}
                  tags={goal.tags}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Panel de détails des objectifs */}
          <AnimatePresence>
            {activeGoalIndex !== null && (
              <MotionDiv
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-16"
              >
                <PanelDetailsUltra
                  icon={goals[activeGoalIndex].icon}
                  title={goals[activeGoalIndex].title}
                  description={goals[activeGoalIndex].description}
                  details={goals[activeGoalIndex].details}
                  color={goals[activeGoalIndex].color}
                  bg={goals[activeGoalIndex].bg}
                  border={goals[activeGoalIndex].border}
                  onClose={handleCloseDetails}
                  equalSize={true}
                  stats={[
                    { label: "Impact Environnemental", value: "Élevé", icon: Leaf },
                    { label: "Engagement Communauté", value: "95%", icon: Users },
                    { label: "Innovation Technologique", value: "Avancée", icon: Zap },
                    { label: "Durabilité", value: "Long terme", icon: Shield }
                  ]}
                />
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionSection>
        
        {/* Section Tri Sélectif avec animations avancées */}
        <MotionSection
          ref={(el) => { if (el) sectionsRef.current.bins = el; }}
          id="bins"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20 md:mb-32 scroll-mt-20"
        >
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <Recycle className="w-12 h-12 text-primary animate-spin-slow" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-advanced">
                Tri Intelligent
              </span>
            </h2>
            <p className="text-2xl text-foreground/80 max-w-3xl mx-auto mb-6">
              Un système innovant pour un recyclage optimal
            </p>
            <p className="text-lg text-foreground/70 max-w-4xl mx-auto">
              Notre approche combine technologie de pointe et simplicité d'utilisation pour maximiser l'impact écologique.
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            {bins.map((bin, index) => (
              <MotionDiv
                key={bin.label}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 80 }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={bin.icon}
                  title={bin.label}
                  description={bin.description}
                  color={bin.color}
                  bg={bin.bg}
                  border={bin.border}
                  onClick={() => handleBinInteraction(index)}
                  isActive={activeBinIndex === index}
                  equalSize={true}
                  delay={index * 100}
                  tags={bin.tags}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Panel de détails des poubelles */}
          <AnimatePresence>
            {showBinDetails && (
              <MotionDiv
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mt-16"
              >
                <PanelDetailsUltra
                  icon={bins[activeBinIndex].icon}
                  title={bins[activeBinIndex].label}
                  description={bins[activeBinIndex].description}
                  details={bins[activeBinIndex].details}
                  color={bins[activeBinIndex].color}
                  bg={bins[activeBinIndex].bg}
                  border={bins[activeBinIndex].border}
                  onClose={handleCloseDetails}
                  equalSize={true}
                  stats={bins[activeBinIndex].stats}
                />
              </MotionDiv>
            )}
          </AnimatePresence>
          
          {/* Indicateurs de navigation améliorés */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-8 mt-20"
          >
            <div className="flex items-center gap-4">
              {bins.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleBinInteraction(index)}
                  className={`relative w-4 h-4 rounded-full transition-all duration-500 ease-out-smooth hover:scale-150 ${
                    index === activeBinIndex 
                      ? 'w-12 bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/50' 
                      : 'bg-muted hover:bg-primary/50'
                  }`}
                  aria-label={`Aller à ${bins[index].label}`}
                >
                  {index === activeBinIndex && (
                    <div className="absolute -inset-3 rounded-full border-2 border-primary/30 animate-ping-slow" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isAutoRotating ? 'Rotation automatique activée' : 'Rotation automatique désactivée'}
              </p>
              <BoutonAnimePremium
                variant="outline"
                size="sm"
                icon={isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                {isAutoRotating ? 'Pause' : 'Reprendre'}
              </BoutonAnimePremium>
            </div>
          </MotionDiv>
        </MotionSection>
        
        {/* Section Actions avec animations fluides */}
        <MotionSection
          ref={(el) => { if (el) sectionsRef.current.actions = el; }}
          id="actions"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20 md:mb-32 scroll-mt-20"
        >
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <div className="relative inline-block mb-6">
              <Zap className="absolute -top-6 -right-6 w-12 h-12 text-yellow-500 animate-pulse-glow" />
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-advanced">
                  Passez à l'Action
                </span>
              </h2>
            </div>
            <p className="text-2xl text-foreground/80 max-w-3xl mx-auto">
              Des initiatives concrètes pour un engagement immédiat
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {actions.map((action, index) => (
              <MotionDiv
                key={action.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                  bg={action.bg}
                  border={action.border}
                  onClick={() => action.href && window.open(action.href, '_self')}
                  equalSize={true}
                  delay={index * 100}
                  tags={action.tags}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Call to Action intermédiaire */}
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-20"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-emerald-500/20 to-cyan-500/20 animate-gradient-slow" />
              <div className="relative p-8 md:p-12 text-center backdrop-blur-sm">
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Prêt à faire la différence ?
                  </span>
                </h3>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Rejoignez notre communauté croissante de citoyens engagés pour l'environnement.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <BoutonAnimePremium
                    variant="premium"
                    size="lg"
                    icon={<Star className="w-5 h-5" />}
                    href="/join"
                    glow={true}
                    pulse={true}
                  >
                    Devenir Membre Premium
                  </BoutonAnimePremium>
                  
                  <BoutonAnimePremium
                    variant="outline"
                    size="lg"
                    icon={<Users className="w-5 h-5" />}
                    href="/community"
                  >
                    Voir la Communauté
                  </BoutonAnimePremium>
                </div>
              </div>
            </div>
          </MotionDiv>
        </MotionSection>
        
        {/* Section Appel à l'Action Finale avec animations premium */}
        <MotionSection
          ref={(el) => { if (el) sectionsRef.current.cta = el; }}
          id="cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="max-w-5xl mx-auto scroll-mt-20"
        >
          <WidgetFlottantPremium intensity={1} glow={true} equalSize={false}>
            <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl 
                           bg-gradient-to-br from-primary/15 via-emerald-500/15 to-cyan-500/15 rounded-3xl smooth-hover-strong">
              <CardContent className="p-12 md:p-16 text-center relative overflow-hidden">
                {/* Éléments de fond animés premium */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-r from-primary/20 to-emerald-500/20 
                              rounded-full blur-3xl animate-float-slow" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 
                              rounded-full blur-3xl animate-float-slow delay-2000" />
                
                {/* Étoiles scintillantes */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white/50 animate-twinkle"
                    style={{
                      top: `${20 + i * 10}%`,
                      left: `${10 + i * 12}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
                
                <MotionDiv
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 150, damping: 12, duration: 1.2 }}
                  className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-emerald-500/30 
                           flex items-center justify-center mx-auto mb-12 border-4 border-white/20 smooth-hover-strong hover-rotate-3d"
                >
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-background/90 to-background/70 
                                flex items-center justify-center">
                    <div className="relative">
                      <Heart className="w-20 h-20 text-primary animate-heartbeat" />
                      <div className="absolute -inset-6 rounded-full border-4 border-primary/20 animate-ping-slow" />
                    </div>
                  </div>
                </MotionDiv>
                
                <h2 className="text-5xl md:text-6xl font-bold mb-10 relative z-10">
                  <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 
                                 bg-clip-text text-transparent animate-gradient-advanced">
                    Votre Engagement Compte
                  </span>
                </h2>
                
                <div className="text-2xl text-foreground/90 leading-relaxed mb-12 max-w-3xl mx-auto relative z-10 space-y-6 animate-fade-in-up">
                  <p>
                    Chaque geste que vous posez pour l'environnement a un impact réel. En triant vos déchets, 
                    en réduisant votre consommation, en participant à nos événements, vous contribuez activement 
                    à la préservation de notre planète.
                  </p>
                  <p className="font-semibold text-primary animate-pulse-slow">
                    Ensemble, nous avons déjà accompli de grandes choses, mais il reste encore beaucoup à faire.
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent animate-gradient-slow">
                    Rejoignez-nous aujourd'hui et faites partie de la solution !
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                  <BoutonAnimePremium
                    variant="gradient"
                    size="xl"
                    icon={<Leaf className="w-7 h-7" />}
                    href="/contact"
                    fullWidth={true}
                    glow={true}
                    pulse={true}
                    className="animate-bounce-subtle"
                  >
                    Nous Rejoindre
                  </BoutonAnimePremium>
                  
                  <BoutonAnimePremium
                    variant="outline"
                    size="xl"
                    icon={<BookOpen className="w-7 h-7" />}
                    href="/activities"
                    fullWidth={true}
                  >
                    Voir nos Activités
                  </BoutonAnimePremium>
                  
                  <BoutonAnimePremium
                    variant="eco"
                    size="xl"
                    icon={<TreePine className="w-7 h-7" />}
                    href="/donate"
                    fullWidth={true}
                    glow={true}
                  >
                    Faire un Don
                  </BoutonAnimePremium>
                </div>
                
                {/* Social proof */}
                <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                  <p className="text-sm text-white/60 mb-4">Déjà rejoint par plus de 2,500 citoyens engagés</p>
                  <div className="flex items-center justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                    <span className="ml-2 text-white/80">4.9/5 (458 avis)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </WidgetFlottantPremium>
        </MotionSection>
      </div>
      
      {/* Footer animé */}
      <footer className="mt-32 py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-emerald-600 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Projet Écologique</h3>
                <p className="text-sm text-muted-foreground">Un avenir durable, ensemble</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary smooth-hover-strong">Mentions légales</a>
              <a href="#" className="text-muted-foreground hover:text-primary smooth-hover-strong">Politique de confidentialité</a>
              <a href="#" className="text-muted-foreground hover:text-primary smooth-hover-strong">Contact</a>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 smooth-hover-strong"
                aria-label="Changer le thème"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setTheme('eco')}
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 smooth-hover-strong"
                aria-label="Thème écologique"
              >
                <Leaf className="w-5 h-5 text-emerald-500" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
            <p>© 2024 Projet Écologique - Tous droits réservés | École Maria - Sauvons notre planète</p>
          </div>
        </div>
      </footer>
      
      {/* Styles globaux pour les animations ultra améliorées */}
      <style>{`
        @keyframes gradient-advanced {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 50% 100%; }
          50% { background-position: 100% 50%; }
          75% { background-position: 50% 0%; }
        }
        
        @keyframes gradient-border {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-20px) rotate(2deg) scale(1.05); }
          50% { transform: translateY(0px) rotate(0deg) scale(1); }
          75% { transform: translateY(20px) rotate(-2deg) scale(0.95); }
        }
        
        @keyframes float-orb-advanced {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          25% { transform: translate(50px, -60px) scale(1.2); opacity: 0.7; }
          50% { transform: translate(-30px, 30px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(60px, 40px) scale(1.1); opacity: 0.6; }
        }
        
        @keyframes ripple-advanced {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(4); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
        }
        
        @keyframes shine-smooth {
          0% { transform: translateX(-100%) rotate(30deg); }
          50% { transform: translateX(100%) rotate(30deg); }
          100% { transform: translateX(300%) rotate(30deg); }
        }
        
        @keyframes shine-slow {
          0% { transform: translateX(-100%) rotate(30deg); }
          100% { transform: translateX(400%) rotate(30deg); }
        }
        
        @keyframes pulse-smooth {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px currentColor; }
          50% { opacity: 0.7; transform: scale(1.1); box-shadow: 0 0 40px currentColor; }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes spin-smooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes bounce-smooth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.05); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        
        @keyframes light-beam {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.1; }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.7; }
          50% { transform: translateY(0) translateX(10px); opacity: 0.3; }
          75% { transform: translateY(10px) translateX(5px); opacity: 0.7; }
        }
        
        @keyframes float-particle-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -30px) rotate(90deg); }
          50% { transform: translate(-10px, 20px) rotate(180deg); }
          75% { transform: translate(30px, 10px) rotate(270deg); }
        }
        
        @keyframes orbit-particle {
          0% { transform: rotate(0deg) translateX(60px) rotate(0deg); opacity: 0.5; }
          50% { transform: rotate(180deg) translateX(80px) rotate(-180deg); opacity: 1; }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); opacity: 0.5; }
        }
        
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes gradient-pan {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 200%; }
        }
        
        .animate-gradient-advanced {
          animation: gradient-advanced 8s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-gradient-border {
          animation: gradient-border 3s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-gradient-slow {
          animation: gradient-slow 4s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-ripple-advanced {
          animation: ripple-advanced 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
        
        .animate-shine-smooth {
          animation: shine-smooth 2s ease-in-out;
        }
        
        .animate-shine-slow {
          animation: shine-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-smooth {
          animation: pulse-smooth 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 0.5s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-spin-smooth {
          animation: spin-smooth 1s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        
        .animate-bounce-smooth {
          animation: bounce-smooth 1.5s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
        
        .animate-sparkle {
          animation: sparkle 1s ease-in-out infinite;
        }
        
        .animate-count-up {
          animation: count-up 1s ease-out forwards;
        }
        
        .bg-400% {
          background-size: 400% 400%;
        }
        
        /* Courbes d'easing ultra améliorées */
        .ease-out-smooth {
          transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .ease-in-out-smooth {
          transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        }
        
        .ease-elastic {
          transition-timing-function: cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        
        /* Animations de survol ultra-fluides */
        .smooth-hover-strong {
          transition: all 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .hover-lift-strong {
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .hover-lift-strong:hover {
          transform: translateY(-8px);
        }
        
        .hover-scale-strong {
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .hover-scale-strong:hover {
          transform: scale(1.08);
        }
        
        .hover-rotate-strong {
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .hover-rotate-strong:hover {
          transform: rotate(8deg);
        }
        
        .hover-rotate-3d {
          transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .hover-rotate-3d:hover {
          transform: rotateY(10deg) rotateX(5deg);
        }
        
        .hover-glow-strong {
          transition: box-shadow 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .hover-glow-strong:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        /* Optimisations des performances */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Accélération matérielle */
        .performance-layer {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }
        
        .transform-gpu {
          transform: translate3d(0, 0, 0);
        }
        
        /* Réduction du mouvement */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient-advanced,
          .animate-gradient-border,
          .animate-gradient-slow,
          .animate-float-slow,
          .animate-ripple-advanced,
          .animate-shine-smooth,
          .animate-shine-slow,
          .animate-pulse-smooth,
          .animate-pulse-glow,
          .animate-pulse-fast,
          .animate-pulse-slow,
          .animate-ping-slow,
          .animate-spin-smooth,
          .animate-spin-slow,
          .animate-spin-slow-reverse,
          .animate-bounce-smooth,
          .animate-bounce-subtle,
          .animate-twinkle,
          .animate-heartbeat,
          .animate-fade-in-up,
          .animate-fade-in-out,
          .animate-slide-up,
          .animate-wiggle,
          .animate-sparkle,
          .animate-count-up {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.01ms !important;
          }
          
          .smooth-hover-strong,
          .hover-lift-strong,
          .hover-scale-strong,
          .hover-rotate-strong,
          .hover-rotate-3d,
          .hover-glow-strong {
            transition: none !important;
          }
        }
        
        /* Défilement ultra fluide */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }
        
        /* Styles de focus améliorés */
        :focus-visible {
          outline: 4px solid var(--primary);
          outline-offset: 4px;
          border-radius: 1rem;
        }
        
        /* Scroll animation pour les sections */
        .scroll-animate {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
          transition: opacity 1s cubic-bezier(0.34, 1.56, 0.64, 1), 
                     transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .scroll-animate.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        /* Uniformisation des tailles */
        .widget-uniform {
          min-height: 320px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .card-uniform {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .content-uniform {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        /* Effet de parallaxe léger */
        .parallax-layer {
          will-change: transform;
        }
        
        /* Scroll margin pour les ancres */
        .scroll-mt-20 {
          scroll-margin-top: 80px;
        }
        
        /* Media queries pour les animations */
        @media (max-width: 768px) {
          .animate-gradient-advanced,
          .animate-gradient-border {
            animation-duration: 12s;
          }
          
          .smooth-hover-strong {
            transition-duration: 300ms;
          }
        }
        
        /* Support du thème écologique */
        .theme-eco {
          --primary: 34 197 94;
          --primary-foreground: 255 255 255;
          --background: 6 78 59;
          --foreground: 240 253 244;
          --card: 6 78 59;
          --card-foreground: 240 253 244;
        }
        
        .theme-light {
          --primary: 59 130 246;
          --primary-foreground: 255 255 255;
          --background: 248 250 252;
          --foreground: 15 23 42;
          --card: 255 255 255;
          --card-foreground: 15 23 42;
        }
        
        .theme-dark {
          --primary: 59 130 246;
          --primary-foreground: 255 255 255;
          --background: 15 23 42;
          --foreground: 248 250 252;
          --card: 30 41 59;
          --card-foreground: 248 250 252;
        }
      `}</style>
    </div>
  );
}

// Ajout des imports manquants
const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Infinity = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const PieChart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const Pause = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Play = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
