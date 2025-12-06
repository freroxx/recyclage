import { useState, useEffect, useMemo, useCallback, useRef, memo, ReactNode } from "react";
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
  Snowflake,
  Clock,
  Infinity,
  PieChart,
  ChevronRight,
  Pause,
  Play,
  LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simple Card components
const Card = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} style={style}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

// Simple Link component
const Link = ({ to, children, className = "", onMouseEnter, onMouseLeave }: { 
  to: string; 
  children: ReactNode; 
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => (
  <a 
    href={to} 
    className={className}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </a>
);

// Types for button component
interface BoutonAnimePremiumProps {
  children: ReactNode;
  variant?: "default" | "outline" | "premium" | "gradient" | "success" | "eco" | "warning";
  size?: "sm" | "default" | "lg" | "xl" | "2xl";
  className?: string;
  onClick?: () => void;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  pulse?: boolean;
}

// Composant Bouton Animé Premium optimisé
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
}: BoutonAnimePremiumProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const handleMouseEnter = useCallback(() => {
    if (!disabled && !loading) {
      setIsHovered(true);
    }
  }, [disabled, loading]);
  
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
  
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.();
  }, [disabled, loading, onClick]);
  
  const sizeClasses: Record<string, string> = {
    sm: "px-5 py-2.5 text-sm",
    default: "px-7 py-3.5 text-base",
    lg: "px-9 py-4 text-lg",
    xl: "px-12 py-5 text-xl",
    "2xl": "px-16 py-7 text-2xl"
  };
  
  const variantClasses: Record<string, string> = {
    default: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-xl hover:shadow-blue-500/40",
    outline: "border-2 border-blue-400/40 bg-slate-900/90 backdrop-blur-sm hover:border-blue-400/80 hover:bg-blue-500/15 hover:shadow-blue-500/30",
    premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 shadow-xl hover:shadow-orange-500/40",
    gradient: "bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 hover:from-blue-500 hover:via-emerald-700 hover:to-cyan-700 shadow-xl hover:shadow-blue-500/40",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-xl hover:shadow-emerald-500/40",
    eco: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-500/40",
    warning: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 shadow-xl hover:shadow-amber-500/40"
  };
  
  const ButtonContent = (
    <>
      {/* Effet de glow au survol */}
      {glow && (
        <span className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/30 via-emerald-500/20 to-cyan-500/30 transition-all duration-700 blur-xl ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      )}
      
      {/* Effet de pulse */}
      {pulse && (
        <span className={`absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-500/40 via-emerald-500/30 to-cyan-500/40 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'}`}
          style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      )}
      
      {/* État Loading */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
          <span className="rounded-full h-8 w-8 border-t-3 border-b-3 border-white animate-spin"></span>
        </span>
      )}
      
      <span className={`relative flex items-center justify-center gap-3 transition-all duration-500 ${isPressed ? 'scale-95' : ''}`}>
        {icon && !loading && (
          <span className={`transition-all duration-500 ${isHovered ? 'scale-125 rotate-12' : ''}`}>
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
          <ArrowRight className={`w-5 h-5 transition-all duration-500 ${isHovered ? 'translate-x-3 scale-125 rotate-6' : ''}`} />
        )}
      </span>
    </>
  );
  
  const buttonClasses = `
    relative overflow-hidden rounded-2xl font-bold text-white
    transition-all duration-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-4 focus:ring-blue-500/30
    ${fullWidth ? 'w-full' : ''}
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${isHovered ? 'shadow-2xl scale-105' : 'shadow-xl'}
    ${isPressed ? 'scale-95 shadow-lg' : ''}
  `;
  
  if (href && !disabled && !loading) {
    return (
      <Link 
        to={href} 
        className={`inline-block ${fullWidth ? 'w-full' : ''}`}
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
          onClick={handleClick}
          disabled={disabled || loading}
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
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {ButtonContent}
    </button>
  );
});

BoutonAnimePremium.displayName = 'BoutonAnimePremium';

// Types for widget
interface WidgetFlottantPremiumProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  minHeight?: string;
  equalSize?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  delay?: number;
  scrollReveal?: boolean;
}

// Composant Widget Flottant optimisé avec moins de courbure
const WidgetFlottantPremium = memo(({
  children,
  intensity = 0.3, // Réduit l'intensité pour moins de courbure
  className = "",
  interactive = true,
  glow = true,
  minHeight = "min-h-[320px]",
  equalSize = true,
  onHoverChange,
  delay = 0,
  scrollReveal = true,
}: WidgetFlottantPremiumProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(!scrollReveal);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scrollReveal || !widgetRef.current) return;
    
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
    
    observer.observe(widgetRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [scrollReveal, delay]);
  
  useEffect(() => {
    if (!interactive || !widgetRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = widgetRef.current!.getBoundingClientRect();
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
    widget.addEventListener('mousemove', handleMouseMove);
    widget.addEventListener('mouseenter', handleMouseEnter);
    widget.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      widget.removeEventListener('mousemove', handleMouseMove);
      widget.removeEventListener('mouseenter', handleMouseEnter);
      widget.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive, onHoverChange]);
  
  const rotateX = interactive ? mousePosition.y * 5 * intensity : 0; // Réduit de 10 à 5
  const rotateY = interactive ? -mousePosition.x * 5 * intensity : 0; // Réduit de 10 à 5
  const translateZ = isHovered ? 15 : 0; // Réduit de 30 à 15
  const scale = isHovered ? 1.02 : isVisible ? 1 : 0.95; // Réduit de 1.03 à 1.02
  const opacity = isVisible ? 1 : 0;
  
  return (
    <div
      ref={widgetRef}
      className={`relative rounded-3xl group ${className}
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
      {/* Glow effect */}
      {glow && (
        <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/30 via-emerald-500/25 to-cyan-500/30 transition-all duration-1000 ${isHovered ? 'opacity-100 blur-3xl' : 'opacity-0 blur-2xl'}`} />
      )}
      
      {/* Inner shadow and background */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-slate-800/85 shadow-2xl transition-all duration-1000 ${isHovered ? 'shadow-3xl' : ''}`} />
      
      {/* Content container */}
      <div className="relative z-10 h-full transform-gpu">
        {children}
      </div>
    </div>
  );
});

WidgetFlottantPremium.displayName = 'WidgetFlottantPremium';

// Système de particules optimisé
const FondParticulesUltra = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particule[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const mountedRef = useRef(true);

  class Particule {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
    pulseSpeed: number;

    constructor(canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = this.getRandomColor();
      this.alpha = Math.random() * 0.3 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }
    
    getRandomColor() {
      const colors = [
        `rgb(100, 200, 255)`,
        `rgb(100, 255, 200)`,
        `rgb(200, 100, 255)`,
        `rgb(100, 255, 255)`,
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(time: number, canvasWidth: number, canvasHeight: number) {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x > canvasWidth) this.x = 0;
      if (this.x < 0) this.x = canvasWidth;
      if (this.y > canvasHeight) this.y = 0;
      if (this.y < 0) this.y = canvasHeight;
      
      this.alpha = 0.15 + Math.sin(time * this.pulseSpeed) * 0.15;
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  useEffect(() => {
    mountedRef.current = true;
    
    mouseRef.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      if (!mountedRef.current || !canvas) return;
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
    
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particule(canvas.width, canvas.height));
      }
    };
    
    const animate = () => {
      if (!mountedRef.current || !ctx || !canvas) return;
      
      timeRef.current += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particule => {
        particule.update(timeRef.current, canvas.width, canvas.height);
        particule.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    animate();
    
    return () => {
      mountedRef.current = false;
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
      
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/10" 
          style={{ 
            animation: 'gradient-pan 20s ease-in-out infinite',
            backgroundSize: '200% 200%'
          }} 
        />
      </div>
    </>
  );
});

FondParticulesUltra.displayName = 'FondParticulesUltra';

// Types for card
interface CarteInteractiveUltraProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bg?: string;
  border?: string;
  onClick?: () => void;
  isActive?: boolean;
  equalSize?: boolean;
  delay?: number;
}

// Composant Carte Interactive optimisé
const CarteInteractiveUltra = memo(({ 
  icon: Icon,
  title,
  description,
  color = "text-blue-500",
  bg = "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
  border = "border-blue-500/20",
  onClick,
  isActive = false,
  equalSize = true,
  delay = 0,
}: CarteInteractiveUltraProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
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
        intensity={0.4} 
        glow={true}
        minHeight="min-h-[280px]"
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
          className={`cursor-pointer h-full ${isPressed ? 'scale-[0.98]' : ''}`}
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
            opacity: isVisible ? 1 : 0,
            transition: `transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, opacity 600ms ease-out ${delay}ms`
          }}
        >
          <Card className={`h-full border-0 overflow-hidden bg-transparent rounded-3xl`}>
            <CardContent className="p-6 text-center relative flex flex-col items-center justify-center h-full">
              {isActive && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                </div>
              )}
              
              <div className={`relative w-20 h-20 rounded-2xl ${bg} 
                            flex items-center justify-center mx-auto mb-6 overflow-hidden
                            ${isHovered ? 'scale-105 shadow-xl' : 'shadow-lg'}
                            ${isActive ? 'ring-2 ring-blue-500/40' : ''}
                            transform-gpu`}
                style={{
                  transform: isHovered ? 'rotateY(3deg) rotateX(3deg)' : 'rotateY(0) rotateX(0)',
                  transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <Icon className={`relative z-10 w-10 h-10 ${color}
                              ${isHovered ? 'scale-110 rotate-6' : ''}`} 
                  style={{ transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
              </div>
              
              <h3 className={`relative z-10 font-bold text-xl mb-3
                            ${isHovered ? 'scale-105' : ''}`}
                style={{ transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                <span className={`bg-gradient-to-r ${isHovered ? 'from-blue-400 via-emerald-400 to-cyan-400' : 'from-white to-white/80'} bg-clip-text text-transparent`}>
                  {title}
                </span>
              </h3>
              
              <p className={`relative z-10 text-sm text-slate-300 mb-4 flex-grow
                            ${isHovered ? 'scale-105' : ''}`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 500ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay + 200}ms`
                }}>
                {description}
              </p>
            </CardContent>
          </Card>
        </div>
      </WidgetFlottantPremium>
    </div>
  );
});

CarteInteractiveUltra.displayName = 'CarteInteractiveUltra';

// Types for modal
interface BinModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: LucideIcon;
  title: string;
  description: string;
  details: string;
  color?: string;
  bg?: string;
}

// Modal pour les détails des poubelles
const BinModal = memo(({ 
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  details,
  color = "text-primary",
  bg = "bg-gradient-to-br from-primary/20 to-primary/10",
}: BinModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-2xl w-full rounded-3xl overflow-hidden"
          >
            <WidgetFlottantPremium intensity={0.2} glow={true} minHeight="min-h-0">
              <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl bg-slate-900/90">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${color}`} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-white/70">{description}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      aria-label="Fermer"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3 text-blue-400">Description</h4>
                      <p className="text-white/80 leading-relaxed">{details}</p>
                    </div>
                    
                    {/* Quick tips */}
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <h4 className="font-semibold text-sm mb-2 text-blue-400">💡 CONSEILS DE TRI</h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        <li>• Bien nettoyer les contenants</li>
                        <li>• Retirer les couvercles non-recyclables</li>
                        <li>• Compacter pour gagner de l'espace</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-4 mt-8 pt-6 border-t border-white/20">
                    <BoutonAnimePremium
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                    >
                      Fermer
                    </BoutonAnimePremium>
                    
                    <BoutonAnimePremium
                      variant="gradient"
                      size="sm"
                      href="/guide"
                    >
                      Guide Complet
                    </BoutonAnimePremium>
                  </div>
                </CardContent>
              </Card>
            </WidgetFlottantPremium>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

BinModal.displayName = 'BinModal';

// Composant principal ultra optimisé
export default function ProjectUltra() {
  
  // États optimisés
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  // Données simplifiées
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons",
      details: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres et réduire la consommation d'eau et d'énergie."
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      label: "Plastique",
      description: "Bouteilles, emballages plastiques",
      details: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer. Notre programme de recyclage les transforme en nouvelles ressources."
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve",
      details: "Le recyclage des métaux permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire."
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      label: "Organique",
      description: "Déchets alimentaires, compostables",
      details: "Transformés en compost pour enrichir les sols des jardins communautaires et espaces verts."
    },
  ], []);
  
  const goals = useMemo(() => [
    {
      icon: Target,
      title: "Mission Éducative",
      description: "Sensibiliser aux enjeux environnementaux",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
    },
    {
      icon: Users,
      title: "Engagement Communautaire",
      description: "Créer une communauté active et engagée",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
    },
    {
      icon: Recycle,
      title: "Innovation Technologique",
      description: "Développer des solutions innovantes",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
    },
    {
      icon: Award,
      title: "Impact Mesurable",
      description: "Atteindre des résultats concrets",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
    }
  ], []);
  
  const actions = useMemo(() => [
    {
      icon: Calendar,
      title: "Événements",
      description: "Participez à nos activités communautaires",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
      href: "/activities"
    },
    {
      icon: BookOpen,
      title: "Ressources",
      description: "Formations et guides pratiques",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      href: "/resources"
    },
    {
      icon: Home,
      title: "Guides",
      description: "Solutions pour un foyer écologique",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      href: "/guide"
    },
    {
      icon: Award,
      title: "Projets",
      description: "Découvrez nos initiatives en cours",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      href: "/project"
    }
  ], []);
  
  // Animation de scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Rotation automatique optimisée
  useEffect(() => {
    mountedRef.current = true;
    
    const rotateBins = () => {
      if (mountedRef.current && isAutoRotating && openModalIndex === null) {
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      }
    };
    
    if (autoRotationInterval.current) {
      clearInterval(autoRotationInterval.current);
    }
    
    autoRotationInterval.current = setInterval(rotateBins, 4000);
    
    return () => {
      mountedRef.current = false;
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, openModalIndex, bins.length]);
  
  // Gestion des interactions optimisées
  const handleBinClick = useCallback((index: number) => {
    setActiveBinIndex(index);
    setOpenModalIndex(index);
    setIsAutoRotating(false);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setOpenModalIndex(null);
    setIsAutoRotating(true);
  }, []);
  
  const handleGoalClick = useCallback((index: number) => {
    setActiveGoalIndex(index === activeGoalIndex ? null : index);
  }, [activeGoalIndex]);
  
  return (
    <div className="min-h-screen overflow-hidden">
      <FondParticulesUltra />
      
      {/* Indicateur de progression du scroll */}
      <div className="fixed top-0 left-0 w-full h-1 z-40 bg-background/50 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 transition-all duration-300 rounded-r-full"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Section Héro optimisée */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24 pt-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/30 via-emerald-500/30 to-cyan-500/30 
                       text-white px-6 py-3 rounded-full text-sm font-medium mb-8 
                       border border-white/20 backdrop-blur-xl"
          >
            <Sparkles className="w-4 h-4" />
            <span>Initiative Écologique 2025</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
              <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent leading-none">
                Écologie
              </span>
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Notre Planète, Notre Avenir
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <p className="text-xl text-white/80 leading-relaxed mb-6">
              Bienvenue dans notre mouvement écologique communautaire. 
              Ensemble, nous créons un avenir durable pour les générations à venir.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <BoutonAnimePremium
              variant="gradient"
              size="lg"
              icon={<Rocket className="w-5 h-5" />}
              href="/project"
              glow={true}
            >
              Découvrir
            </BoutonAnimePremium>
            
            <BoutonAnimePremium
              variant="outline"
              size="lg"
              icon={<BookOpen className="w-5 h-5" />}
              href="/guide"
            >
              Guide Pratique
            </BoutonAnimePremium>
          </motion.div>
        </motion.section>
        
        {/* Section Objectifs optimisée */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Nos Objectifs
            </h2>
            <p className="text-lg text-white/60">
              Construire un avenir durable ensemble
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={goal.icon}
                  title={goal.title}
                  description={goal.description}
                  color={goal.color}
                  bg={goal.bg}
                  onClick={() => handleGoalClick(index)}
                  isActive={activeGoalIndex === index}
                  equalSize={true}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Section Tri Sélectif optimisée */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Recycle className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" style={{ animationDuration: '15s' }} />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Tri Sélectif
            </h2>
            <p className="text-lg text-white/60">
              Un système simple pour un impact maximal
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {bins.map((bin, index) => (
              <motion.div
                key={bin.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={bin.icon}
                  title={bin.label}
                  description={bin.description}
                  color={bin.color}
                  bg={bin.bg}
                  onClick={() => handleBinClick(index)}
                  isActive={activeBinIndex === index}
                  equalSize={true}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Indicateurs de navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mt-8"
          >
            <div className="flex items-center gap-2">
              {bins.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleBinClick(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 hover:scale-150 ${
                    index === activeBinIndex 
                      ? 'w-8 bg-gradient-to-r from-blue-600 to-emerald-600' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Voir ${bins[index].label}`}
                />
              ))}
            </div>
            
            <div className="text-center">
              <BoutonAnimePremium
                variant="outline"
                size="sm"
                icon={isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                {isAutoRotating ? 'Pause' : 'Reprendre'}
              </BoutonAnimePremium>
            </div>
          </motion.div>
        </motion.section>
        
        {/* Section Actions optimisée */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Passez à l'Action
            </h2>
            <p className="text-lg text-white/60">
              Des initiatives concrètes pour s'engager
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                  bg={action.bg}
                  onClick={() => action.href && window.open(action.href, '_self')}
                  equalSize={true}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Call to Action intermédiaire */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="relative rounded-2xl overflow-hidden p-8 text-center bg-gradient-to-r from-blue-600/20 to-emerald-600/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Rejoignez notre communauté
              </h3>
              <p className="text-white/80 mb-6">
                Ensemble, nous pouvons faire la différence
              </p>
              <BoutonAnimePremium
                variant="gradient"
                size="lg"
                icon={<Users className="w-5 h-5" />}
                href="/contact"
                glow={true}
              >
                Nous Contacter
              </BoutonAnimePremium>
            </div>
          </motion.div>
        </motion.section>
      </div>
      
      {/* Modals pour les détails des poubelles */}
      {openModalIndex !== null && (
        <BinModal
          isOpen={true}
          onClose={handleCloseModal}
          icon={bins[openModalIndex].icon}
          title={bins[openModalIndex].label}
          description={bins[openModalIndex].description}
          details={bins[openModalIndex].details}
          color={bins[openModalIndex].color}
          bg={bins[openModalIndex].bg}
        />
      )}
      
      {/* Styles globaux optimisés */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        
        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
