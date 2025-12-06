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
  Zap,
  Heart,
  Star,
  Cloud,
  Sun,
  Moon,
  Droplets,
  Clock,
  Infinity,
  ChevronRight,
  Pause,
  Play,
  LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Hook de navigation sans rechargement
const useNavigate = () => {
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, []);

  return navigate;
};

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

// Composant Link optimisé pour SPA
const Link = ({ to, children, className = "", onClick }: { 
  to: string; 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    onClick?.();
  };
  
  return (
    <a 
      href={to} 
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

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
  
  const handleClick = useCallback((e: React.MouseEvent) => {
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
        onClick={handleClick}
      >
        <button
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          disabled={disabled || loading}
        >
          {ButtonContent}
        </button>
      </Link>
    );
  }
  
  return (
    <button
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

// Composant Widget Flottant optimisé avec animations fluides
const WidgetFlottantPremium = memo(({
  children,
  intensity = 0.3,
  className = "",
  interactive = true,
  glow = true,
  minHeight = "min-h-[280px]",
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
      { threshold: 0.05, rootMargin: '50px' }
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
  
  const rotateX = interactive ? mousePosition.y * 4 * intensity : 0;
  const rotateY = interactive ? -mousePosition.x * 4 * intensity : 0;
  const translateZ = isHovered ? 12 : 0;
  const scale = isHovered ? 1.02 : isVisible ? 1 : 0.97;
  const opacity = isVisible ? 1 : 0;
  
  return (
    <div
      ref={widgetRef}
      className={`relative rounded-3xl group ${className}
        ${equalSize ? 'w-full h-full flex flex-col' : ''}
        ${minHeight}
        transform-gpu will-change-transform
      `}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
        opacity,
        transition: `
          transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
          opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
          box-shadow 600ms cubic-bezier(0.16, 1, 0.3, 1)
        `,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect */}
      {glow && (
        <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/25 via-emerald-500/20 to-cyan-500/25 transition-all duration-700 ${isHovered ? 'opacity-100 blur-2xl' : 'opacity-0 blur-xl'}`} />
      )}
      
      {/* Inner shadow and background */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-slate-800/85 shadow-xl transition-all duration-700 ${isHovered ? 'shadow-2xl' : ''}`} />
      
      {/* Shimmer effect amélioré */}
      <div className={`absolute inset-0 rounded-3xl overflow-hidden`}>
        <div className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1200 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 h-full transform-gpu">
        {children}
      </div>
    </div>
  );
});

WidgetFlottantPremium.displayName = 'WidgetFlottantPremium';

// Arrière-plan animé ultra fluide
const FondAniméUltra = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    alpha: number;
    pulseSpeed: number;
  }>>([]);
  const timeRef = useRef(0);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 60);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.3 - 0.15,
          speedY: Math.random() * 0.3 - 0.15,
          color: `hsl(${Math.random() * 60 + 180}, 70%, 70%)`,
          alpha: Math.random() * 0.2 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };
    
    const animate = () => {
      timeRef.current += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fond dégradé animé
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.08)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Particules
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        particle.alpha = 0.1 + Math.sin(timeRef.current * particle.pulseSpeed) * 0.1;
        
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    resize();
    window.addEventListener('resize', resize);
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
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
        {/* Ombres portées animées */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-500/15 via-blue-500/10 to-transparent"
          style={{ 
            animation: 'float-gentle 20s ease-in-out infinite',
          }} 
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-emerald-500/15 via-emerald-500/10 to-transparent"
          style={{ 
            animation: 'float-gentle 25s ease-in-out infinite reverse',
          }} 
        />
        
        {/* Orbes flottants */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-blue-500/20 via-blue-500/10 to-transparent rounded-full"
          style={{ 
            animation: 'float-orb 30s ease-in-out infinite',
            filter: 'blur(40px)'
          }}
        />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-emerald-500/20 via-emerald-500/10 to-transparent rounded-full"
          style={{ 
            animation: 'float-orb 35s ease-in-out infinite reverse',
            filter: 'blur(40px)'
          }}
        />
        
        {/* Effets de lumière subtils */}
        <div className="absolute top-1/2 left-0 w-px h-64 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse"
          style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-0 w-px h-64 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '2s' }} />
      </div>
    </>
  );
});

FondAniméUltra.displayName = 'FondAniméUltra';

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

// Composant Carte Interactive avec animations de scroll améliorées
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
      { 
        threshold: 0.05,
        rootMargin: '100px 0px 100px 0px'
      }
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
        intensity={0.35} 
        glow={true}
        minHeight="min-h-[260px]"
        equalSize={equalSize}
        onHoverChange={setIsHovered}
        delay={delay}
        scrollReveal={true}
      >
        <motion.div
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`cursor-pointer h-full ${isPressed ? 'scale-[0.98]' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 30
          }}
          transition={{ 
            duration: 0.8,
            delay: delay / 1000,
            ease: "easeOut"
          }}
        >
          <Card className={`h-full border-0 overflow-hidden bg-transparent rounded-3xl`}>
            <CardContent className="p-6 text-center relative flex flex-col items-center justify-center h-full">
              {isActive && (
                <motion.div
                  className="absolute top-3 right-3 z-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                </motion.div>
              )}
              
              <motion.div
                className={`relative w-20 h-20 rounded-2xl ${bg} 
                          flex items-center justify-center mx-auto mb-6 overflow-hidden
                          ${isHovered ? 'scale-110 shadow-xl' : 'shadow-lg'}
                          ${isActive ? 'ring-2 ring-blue-500/40' : ''}
                          transform-gpu`}
                whileHover={{ 
                  rotateY: 3,
                  rotateX: 3,
                  scale: 1.1
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                <Icon className={`relative z-10 w-10 h-10 ${color}`} />
              </motion.div>
              
              <motion.h3
                className="relative z-10 font-bold text-xl mb-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`bg-gradient-to-r ${isHovered ? 'from-blue-400 via-emerald-400 to-cyan-400' : 'from-white to-white/80'} bg-clip-text text-transparent`}>
                  {title}
                </span>
              </motion.h3>
              
              <motion.p
                className="relative z-10 text-sm text-slate-300 mb-4 flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.6, delay: (delay + 200) / 1000 }}
              >
                {description}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
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

// Modal amélioré avec animations fluides
const BinModal = memo(({ 
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  details,
  color = "text-blue-600",
  bg = "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
}: BinModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          style={{ WebkitBackdropFilter: 'blur(8px)' }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20, rotateX: 5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: -20,
              rotateX: -5
            }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8
            }}
            className="relative max-w-2xl w-full"
          >
            <WidgetFlottantPremium intensity={0.2} glow={true} minHeight="min-h-0" interactive={true}>
              <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl bg-slate-900/95">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className={`w-16 h-16 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${color}`} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-white/70">{description}</p>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={onClose}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                      aria-label="Fermer"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-semibold text-lg mb-3 text-blue-400">Description</h4>
                      <p className="text-white/80 leading-relaxed">{details}</p>
                    </motion.div>
                    
                    <motion.div
                      className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="font-semibold text-sm mb-2 text-blue-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        CONSEILS DE TRI
                      </h4>
                      <ul className="text-sm text-white/80 space-y-1">
                        <li>• Bien nettoyer les contenants</li>
                        <li>• Retirer les couvercles non-recyclables</li>
                        <li>• Compacter pour gagner de l'espace</li>
                        <li>• Vérifier les consignes locales</li>
                      </ul>
                    </motion.div>
                  </div>
                  
                  {/* Actions */}
                  <motion.div 
                    className="flex gap-4 mt-8 pt-6 border-t border-white/20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <BoutonAnimePremium
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Fermer
                    </BoutonAnimePremium>
                    
                    <BoutonAnimePremium
                      variant="gradient"
                      size="sm"
                      href="/guide"
                      className="flex-1"
                      glow={true}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Guide Complet
                    </BoutonAnimePremium>
                  </motion.div>
                </CardContent>
              </Card>
            </WidgetFlottantPremium>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

BinModal.displayName = 'BinModal';

// Composant principal optimisé
export default function ProjectUltra() {
  // États optimisés
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  // Données optimisées
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons",
      details: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres et réduire la consommation d'eau et d'énergie. Notre système de collecte optimisé garantit un taux de recyclage optimal."
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      label: "Plastique",
      description: "Bouteilles, emballages plastiques",
      details: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer dans la nature. Notre programme de recyclage innovant transforme les plastiques usagés en nouvelles ressources grâce à des technologies de tri optique avancées."
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve",
      details: "Le recyclage des métaux est particulièrement efficace avec une économie d'énergie allant jusqu'à 95% par rapport à la production primaire. Nous utilisons des aimants puissants pour une séparation précise à 99%."
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      label: "Organique",
      description: "Déchets alimentaires, compostables",
      details: "Transformés en compost de haute qualité pour enrichir les sols des jardins communautaires et espaces verts publics, contribuant ainsi à l'économie circulaire locale."
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
      description: "Activités et événements communautaires",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
      href: "/activities"
    },
    {
      icon: BookOpen,
      title: "Ressources",
      description: "Guides et documents pédagogiques",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      href: "/resources"
    },
    {
      icon: Home,
      title: "Guides Pratiques",
      description: "Conseils pour un foyer écologique",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      href: "/guide"
    },
    {
      icon: Share2,
      title: "Projets",
      description: "Découvrez nos initiatives en cours",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      href: "/project"
    }
  ], []);
  
  // Animation de scroll optimisée
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.body.scrollHeight - window.innerHeight;
          const progress = Math.min((scrollTop / docHeight) * 100, 100);
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
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
  
  // Gestion des interactions
  const handleBinClick = useCallback((index: number) => {
    setActiveBinIndex(index);
    setOpenModalIndex(index);
    setIsAutoRotating(false);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setOpenModalIndex(null);
    setTimeout(() => {
      setIsAutoRotating(true);
    }, 500);
  }, []);
  
  return (
    <div className="min-h-screen overflow-hidden">
      <FondAniméUltra />
      
      {/* Indicateur de progression du scroll amélioré */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-1 z-40 bg-background/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 rounded-r-full"
          style={{ width: `${scrollProgress}%` }}
          transition={{ type: "spring", damping: 30, stiffness: 100 }}
        />
      </motion.div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Section Héro avec animations fluides */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24 pt-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/30 via-emerald-500/30 to-cyan-500/30 
                       text-white px-6 py-3 rounded-full text-sm font-medium mb-8 
                       border border-white/20 backdrop-blur-xl shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Initiative Écologique 2025</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent leading-none inline-block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ 
                  backgroundSize: '200% auto'
                }}
              >
                Écologie
              </motion.span>
            </h1>
            
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Notre Planète, Notre Avenir
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
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
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <BoutonAnimePremium
              variant="gradient"
              size="lg"
              icon={<Rocket className="w-5 h-5" />}
              href="/project"
              glow={true}
              pulse={true}
            >
              Découvrir nos Projets
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
        
        {/* Section Objectifs avec animations de scroll */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            </motion.div>
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
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={goal.icon}
                  title={goal.title}
                  description={goal.description}
                  color={goal.color}
                  bg={goal.bg}
                  equalSize={true}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Section Tri Sélectif avec animations fluides */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Recycle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            </motion.div>
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
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
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
          
          {/* Indicateurs de navigation améliorés */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center gap-4 mt-8"
          >
            <div className="flex items-center gap-2">
              {bins.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleBinClick(index)}
                  className={`relative w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === activeBinIndex 
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.8 }}
                  aria-label={`Voir ${bins[index].label}`}
                >
                  {index === activeBinIndex && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border-2 border-emerald-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
            
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <BoutonAnimePremium
                variant="outline"
                size="sm"
                icon={isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                {isAutoRotating ? 'Pause' : 'Reprendre'}
              </BoutonAnimePremium>
            </motion.div>
          </motion.div>
        </motion.section>
        
        {/* Section Actions avec animations */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            </motion.div>
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
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut" 
                }}
                className="h-full"
              >
                <CarteInteractiveUltra
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                  bg={action.bg}
                  onClick={() => window.history.pushState({}, '', action.href)}
                  equalSize={true}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Call to Action final */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16"
          >
            <WidgetFlottantPremium intensity={0.2} glow={true} minHeight="min-h-0">
              <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl 
                             bg-gradient-to-br from-blue-600/20 via-emerald-600/20 to-cyan-600/20">
                <CardContent className="p-8 text-center">
                  <Heart className="w-16 h-16 text-pink-500 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Votre Engagement Compte
                  </h3>
                  <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                    Chaque geste que vous posez pour l'environnement a un impact réel. 
                    Ensemble, nous pouvons créer un changement durable.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <BoutonAnimePremium
                      variant="gradient"
                      size="lg"
                      icon={<Users className="w-5 h-5" />}
                      href="/contact"
                      glow={true}
                    >
                      Nous Contacter
                    </BoutonAnimePremium>
                    
                    <BoutonAnimePremium
                      variant="outline"
                      size="lg"
                      icon={<Calendar className="w-5 h-5" />}
                      href="/activities"
                    >
                      Voir les Activités
                    </BoutonAnimePremium>
                  </div>
                </CardContent>
              </Card>
            </WidgetFlottantPremium>
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
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0px) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          33% { transform: translate(40px, -30px) scale(1.1); opacity: 0.6; }
          66% { transform: translate(-20px, 40px) scale(0.9); opacity: 0.3; }
        }
        
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
        
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
