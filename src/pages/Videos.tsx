import { useState, useEffect, useMemo, useCallback, useRef, memo, ReactNode } from "react";
import { 
  Trash2, FileText, Apple, Package, Target, Users, Recycle, 
  ArrowRight, Sparkles, Award, BookOpen, Calendar, Gamepad2, 
  Home, X, Share2, Rocket, Zap, Heart, Star, Sun, Moon, 
  Pause, Play, LucideIcon, Video, Image, Trophy, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { useIsMobile } from "../hooks/use-mobile";

// Hook de navigation SPA amélioré
const useNavigate = () => {
  const navigate = useCallback((path: string) => {
    // Stocker l'état actuel de scroll
    const scrollY = window.scrollY;
    sessionStorage.setItem('scrollY', scrollY.toString());
    
    window.history.pushState({}, '', path);
    
    // Créer un événement personnalisé pour la navigation
    const navEvent = new CustomEvent('spa:navigate', { 
      detail: { path, timestamp: Date.now() }
    });
    window.dispatchEvent(navEvent);
    
    // Forcer le re-rendu de l'application
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Scroll doux vers le haut pour les nouvelles pages
    if (path !== window.location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return navigate;
};

// Hook de gestion du thème
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return { theme, toggleTheme };
};

// Composants de base
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

// Composant Link optimisé pour SPA avec meilleure gestion des événements
const Link = ({ to, children, className = "", onClick, ...props }: { 
  to: string; 
  children: ReactNode; 
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: any;
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Exécuter le callback onClick si fourni
    onClick?.(e);
    
    // Ajouter un effet visuel pour le feedback
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.98)';
    target.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
      target.style.transform = '';
      
      // Naviguer après l'animation
      setTimeout(() => {
        navigate(to);
      }, isMobile ? 50 : 100);
    }, 150);
  }, [to, navigate, onClick, isMobile]);
  
  return (
    <a 
      href={to} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

// Types pour le bouton
interface BoutonAnimeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "gradient" | "eco";
  size?: "sm" | "default" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  icon?: ReactNode;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  pulse?: boolean;
}

// Composant Bouton avec support thème amélioré
const BoutonAnime = memo(({ 
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
}: BoutonAnimeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isMobile = useIsMobile();
  
  const handleMouseEnter = useCallback(() => {
    if (!disabled && !loading) setIsHovered(true);
  }, [disabled, loading]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
  }, []);
  
  const handleMouseDown = useCallback(() => {
    if (!disabled && !loading) setIsPressed(true);
  }, [disabled, loading]);
  
  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || loading) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Effet de feedback tactile
    if (isMobile) {
      const button = e.currentTarget as HTMLButtonElement;
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    }
    
    onClick?.(e);
  }, [disabled, loading, onClick, isMobile]);
  
  // Tailles adaptées pour mobile
  const sizeClasses: Record<string, string> = isMobile ? {
    sm: "px-4 py-2.5 text-sm",
    default: "px-5 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  } : {
    sm: "px-5 py-2.5 text-sm",
    default: "px-6 py-3.5 text-base",
    lg: "px-8 py-4 text-lg",
  };
  
  // Classes variant pour thème clair/sombre avec meilleur contraste
  const variantClasses: Record<string, string> = {
    default: `
      dark:bg-gradient-to-r dark:from-blue-600 dark:to-blue-500 
      dark:hover:from-blue-500 dark:hover:to-blue-600 
      dark:shadow-xl dark:hover:shadow-blue-500/40
      bg-gradient-to-r from-blue-500 to-blue-400
      hover:from-blue-400 hover:to-blue-500 
      shadow-xl hover:shadow-blue-500/30
      text-white
    `,
    outline: `
      dark:border-2 dark:border-blue-400/40 dark:bg-slate-900/90 
      dark:hover:border-blue-400/80 dark:hover:bg-blue-500/15 
      dark:hover:shadow-blue-500/30
      border-2 border-blue-500/60 bg-white/90
      hover:border-blue-500/80 hover:bg-blue-50 
      hover:shadow-blue-500/20
      dark:text-white text-blue-900
    `,
    gradient: `
      dark:bg-gradient-to-r dark:from-blue-600 dark:via-emerald-600 dark:to-cyan-600 
      dark:hover:from-blue-500 dark:hover:via-emerald-700 dark:hover:to-cyan-700 
      dark:shadow-xl dark:hover:shadow-blue-500/40
      bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500
      hover:from-blue-400 hover:via-emerald-600 hover:to-cyan-600 
      shadow-xl hover:shadow-blue-500/30
      text-white
    `,
    eco: `
      dark:bg-gradient-to-r dark:from-emerald-500 dark:via-green-500 dark:to-teal-500 
      dark:hover:from-emerald-600 dark:hover:via-green-600 dark:hover:to-teal-600 
      dark:shadow-xl dark:hover:shadow-emerald-500/40
      bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400
      hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 
      shadow-xl hover:shadow-emerald-500/30
      text-white
    `,
  };
  
  const buttonClasses = `
    relative overflow-hidden rounded-xl font-bold
    transition-all duration-200 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-3 dark:focus:ring-blue-500/40 focus:ring-blue-500/30
    ${fullWidth ? 'w-full' : ''}
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${!isMobile && isHovered ? 'shadow-2xl scale-[1.02]' : 'shadow-xl'}
    ${!isMobile && isPressed ? 'scale-95 shadow-lg' : ''}
    ${isMobile ? 'active:scale-95 touch-manipulation' : ''}
  `;
  
  const ButtonContent = (
    <>
      {!isMobile && glow && (
        <motion.span
          className={`
            absolute -inset-1 rounded-xl blur-xl
            dark:bg-gradient-to-r dark:from-blue-500/30 dark:via-emerald-500/20 dark:to-cyan-500/30
            bg-gradient-to-r from-blue-400/20 via-emerald-400/15 to-cyan-400/20
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {!isMobile && pulse && (
        <span className={`
          absolute -inset-1 rounded-xl
          dark:bg-gradient-to-r dark:from-blue-500/40 dark:via-emerald-500/30 dark:to-cyan-500/40
          bg-gradient-to-r from-blue-400/30 via-emerald-400/20 to-cyan-400/30
        `} style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      )}
      
      {loading && (
        <motion.span 
          className="absolute inset-0 flex items-center justify-center dark:bg-black/20 bg-white/20 backdrop-blur-sm rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="rounded-full h-6 w-6 border-t-2 border-b-2 dark:border-white border-blue-600 animate-spin" />
        </motion.span>
      )}
      
      <motion.span 
        className={`relative flex items-center justify-center gap-3 ${isPressed ? 'scale-95' : ''}`}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon && !loading && (
          <motion.span
            initial={false}
            animate={{ scale: !isMobile && isHovered ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.span>
        )}
        {loading ? (
          <span className="opacity-0">{children}</span>
        ) : (
          <motion.span 
            className="relative"
            initial={false}
            animate={{ scale: !isMobile && isHovered ? 1.05 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {children}
          </motion.span>
        )}
        {!loading && variant !== 'outline' && !isMobile && (
          <motion.div
            initial={false}
            animate={{ x: isHovered ? 2 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        )}
      </motion.span>
    </>
  );
  
  if (href && !disabled && !loading) {
    return (
      <Link 
        to={href} 
        className={`inline-block ${fullWidth ? 'w-full' : ''}`}
        onClick={onClick}
      >
        <button
          className={buttonClasses}
          onMouseEnter={!isMobile ? handleMouseEnter : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onMouseDown={!isMobile ? handleMouseDown : undefined}
          onMouseUp={!isMobile ? handleMouseUp : undefined}
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
      onMouseEnter={!isMobile ? handleMouseEnter : undefined}
      onMouseLeave={!isMobile ? handleMouseLeave : undefined}
      onMouseDown={!isMobile ? handleMouseDown : undefined}
      onMouseUp={!isMobile ? handleMouseUp : undefined}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {ButtonContent}
    </button>
  );
});

BoutonAnime.displayName = 'BoutonAnime';

// Types pour le widget
interface WidgetFlottantProps {
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

// Widget avec support thème amélioré
const WidgetFlottant = memo(({
  children,
  intensity = 0.3,
  className = "",
  interactive = true,
  glow = true,
  minHeight = "min-h-[240px]",
  equalSize = true,
  onHoverChange,
  delay = 0,
  scrollReveal = true,
}: WidgetFlottantProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(!scrollReveal);
  const widgetRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Désactiver l'interactivité sur mobile pour de meilleures performances
  const effectiveInteractive = isMobile ? false : interactive;
  const effectiveGlow = isMobile ? false : glow;
  
  useEffect(() => {
    if (!scrollReveal || !widgetRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { 
        threshold: 0.05, 
        rootMargin: isMobile ? '100px' : '200px' 
      }
    );
    
    observer.observe(widgetRef.current);
    return () => observer.disconnect();
  }, [scrollReveal, delay, isMobile]);
  
  useEffect(() => {
    if (!effectiveInteractive || !widgetRef.current) return;
    
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
  }, [effectiveInteractive, onHoverChange]);
  
  const rotateX = effectiveInteractive ? mousePosition.y * 1.5 * intensity : 0;
  const rotateY = effectiveInteractive ? -mousePosition.x * 1.5 * intensity : 0;
  const translateZ = isHovered && !isMobile ? 8 : 0;
  const scale = isHovered && !isMobile ? 1.02 : isVisible ? 1 : 0.95;
  const opacity = isVisible ? 1 : 0;
  
  return (
    <motion.div
      ref={widgetRef}
      className={`relative rounded-2xl group ${className}
        ${equalSize ? 'w-full h-full flex flex-col' : ''}
        ${isMobile ? 'min-h-[200px]' : minHeight}
        transform-gpu will-change-transform
      `}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ 
        opacity,
        scale,
        rotateX,
        rotateY,
        translateZ,
        y: 0
      }}
      transition={{
        opacity: { duration: 0.5, delay: delay / 1000, ease: "easeOut" },
        scale: { duration: 0.5, delay: delay / 1000, ease: "easeOut" },
        rotateX: { duration: 0.3, ease: "easeOut" },
        rotateY: { duration: 0.3, ease: "easeOut" },
        translateZ: { duration: 0.3, ease: "easeOut" },
        y: { duration: 0.5, delay: delay / 1000, ease: "easeOut" }
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {effectiveGlow && (
        <motion.div
          className={`
            absolute -inset-2 rounded-2xl blur-xl
            dark:bg-gradient-to-br dark:from-blue-500/20 dark:via-emerald-500/15 dark:to-cyan-500/20
            bg-gradient-to-br from-blue-400/15 via-emerald-400/10 to-cyan-400/15
          `}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered && !isMobile ? 0.3 : 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
      
      <div className={`
        absolute inset-0 rounded-2xl shadow-lg transition-all duration-300
        ${isHovered && !isMobile ? 'shadow-xl' : ''}
        dark:bg-gradient-to-br dark:from-slate-800/95 dark:via-slate-900/90 dark:to-slate-800/85
        bg-gradient-to-br from-white/95 via-gray-50/90 to-white/85
        border dark:border-white/10 border-gray-200
      `} />
      
      {!isMobile && (
        <div className={`absolute inset-0 rounded-2xl overflow-hidden`}>
          <div className={`
            absolute -inset-full transition-transform duration-1000
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
            dark:bg-gradient-to-r dark:from-transparent dark:via-white/5 dark:to-transparent
            bg-gradient-to-r from-transparent via-blue-500/3 to-transparent
          `} />
        </div>
      )}
      
      <div className="relative z-10 h-full transform-gpu">
        {children}
      </div>
    </motion.div>
  );
});

WidgetFlottant.displayName = 'WidgetFlottant';

// Arrière-plan animé optimisé
const FondAnime = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number; y: number; size: number; speedX: number; speedY: number;
    color: string; alpha: number; pulseSpeed: number;
  }>>([]);
  const timeRef = useRef(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };
    
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = isMobile ? 40 : 60;
      const isDark = document.documentElement.classList.contains('dark');
      
      const colors = isDark 
        ? ['#60a5fa', '#34d399', '#22d3ee']
        : ['#3b82f6', '#10b981', '#06b6d4'];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.2 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };
    
    const animate = () => {
      timeRef.current += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = document.documentElement.classList.contains('dark');
      
      // Fond dégradé subtil
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      if (isDark) {
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
        gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.08)');
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(249, 250, 251, 0.2)');
        gradient.addColorStop(0.5, 'rgba(243, 244, 246, 0.15)');
        gradient.addColorStop(1, 'rgba(249, 250, 251, 0.2)');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner les particules
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Rebond sur les bords
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
        
        // Animation de pulsation
        particle.alpha = 0.15 + Math.sin(timeRef.current * particle.pulseSpeed) * 0.1;
        
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMobile]);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
      />
      
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className={`
          absolute inset-0
          dark:bg-gradient-to-br dark:from-blue-900/5 dark:via-transparent dark:to-emerald-900/5
          bg-gradient-to-br from-blue-50/10 via-transparent to-emerald-50/10
          animate-gradient-flow
        `} />
      </div>
    </>
  );
});

FondAnime.displayName = 'FondAnime';

// Types pour la carte
interface CarteInteractiveProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  bg?: string;
  onClick?: () => void;
  isActive?: boolean;
  delay?: number;
  href?: string;
}

// Carte interactive améliorée avec support de navigation
const CarteInteractive = memo(({ 
  icon: Icon,
  title,
  description,
  color = "dark:text-blue-600 text-blue-500",
  bg = "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-blue-500/10 bg-gradient-to-br from-blue-400/20 to-blue-400/10",
  onClick,
  isActive = false,
  delay = 0,
  href,
}: CarteInteractiveProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { 
        threshold: 0.05, 
        rootMargin: '100px' 
      }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [delay]);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Feedback visuel
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    // Exécuter le callback onClick si fourni
    if (onClick) {
      onClick();
    } else if (href) {
      // Naviguer vers l'URL si href est fourni
      setTimeout(() => {
        navigate(href);
      }, isMobile ? 100 : 150);
    }
  }, [onClick, href, navigate, isMobile]);
  
  return (
    <div ref={cardRef} className="h-full">
      <WidgetFlottant 
        intensity={0.25}
        glow={!isMobile}
        minHeight={isMobile ? "min-h-[180px]" : "min-h-[200px]"}
        onHoverChange={setIsHovered}
        delay={delay}
      >
        <Link 
          to={href || '#'}
          className="block h-full"
          onClick={handleClick}
        >
          <motion.div
            className="cursor-pointer h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 20,
              scale: isPressed ? 0.98 : 1
            }}
            transition={{ 
              opacity: { duration: 0.4, delay: delay / 1000, ease: "easeOut" },
              y: { duration: 0.4, delay: delay / 1000, ease: "easeOut" },
              scale: { duration: 0.15 }
            }}
          >
            <Card className="h-full border-0 overflow-hidden bg-transparent rounded-2xl">
              <CardContent className={`${isMobile ? 'p-4' : 'p-5'} text-center flex flex-col items-center justify-center h-full relative`}>
                {isActive && (
                  <motion.div
                    className="absolute top-2 right-2 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                  </motion.div>
                )}
                
                <motion.div
                  className={`relative ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} rounded-xl ${bg} flex items-center justify-center mx-auto mb-3 shadow-lg transform-gpu`}
                  whileHover={!isMobile ? { scale: 1.1 } : {}}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon className={`relative z-10 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'} ${color}`} />
                </motion.div>
                
                <motion.h3
                  className={`font-bold ${isMobile ? 'text-base mb-1' : 'text-lg mb-2'}`}
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className={`
                    bg-gradient-to-r bg-clip-text text-transparent
                    ${isHovered && !isMobile ? 'from-blue-500 via-emerald-500 to-cyan-500' : 'dark:from-white dark:to-white/80 from-gray-900 to-gray-700'}
                  `}>
                    {title}
                  </span>
                </motion.h3>
                
                {description && (
                  <motion.p
                    className={`${isMobile ? 'text-xs mb-2' : 'text-sm mb-3'} flex-grow`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: (delay + 200) / 1000 }}
                  >
                    <span className="dark:text-gray-300 text-gray-600">
                      {description}
                    </span>
                  </motion.p>
                )}
                
                {href && (
                  <motion.div
                    className="mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: (delay + 300) / 1000 }}
                  >
                    <div className="inline-flex items-center gap-1 text-xs dark:text-blue-400 text-blue-600">
                      <span>Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Link>
      </WidgetFlottant>
    </div>
  );
});

CarteInteractive.displayName = 'CarteInteractive';

// Types pour le modal
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

// Modal optimisé
const BinModal = memo(({ 
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  details,
  color = "dark:text-blue-600 text-blue-500",
  bg = "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-blue-500/10 bg-gradient-to-br from-blue-400/20 to-blue-400/10",
}: BinModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8
            }}
            className={`relative w-full ${isMobile ? 'max-w-full' : 'max-w-2xl'}`}
          >
            <WidgetFlottant intensity={0.15} glow={!isMobile} minHeight="min-h-0">
              <Card className={`
                border overflow-hidden
                dark:border-white/20 dark:bg-slate-900/95
                border-gray-300 bg-white/95
                ${isMobile ? 'max-h-[90vh]' : 'max-h-[85vh]'} overflow-y-auto
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              `}>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className={`flex items-start justify-between ${isMobile ? 'mb-4' : 'mb-6'}`}>
                    <motion.div 
                      className="flex items-center gap-3"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg ${bg} flex items-center justify-center`}>
                        <Icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} ${color}`} />
                      </div>
                      <div>
                        <h3 className={`
                          ${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-1
                          dark:text-white text-gray-900
                        `}>
                          {title}
                        </h3>
                        <p className={`
                          ${isMobile ? 'text-xs' : 'text-sm'}
                          dark:text-gray-300 text-gray-600
                        `}>
                          {description}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={onClose}
                      className={`
                        p-1 rounded-lg transition-colors flex-shrink-0
                        dark:hover:bg-white/10 hover:bg-gray-100
                      `}
                      aria-label="Fermer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <X className={`
                        ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}
                        dark:text-white text-gray-700
                      `} />
                    </motion.button>
                  </div>
                  
                  <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className={`
                        font-semibold ${isMobile ? 'text-base' : 'text-lg'} mb-2
                        dark:text-blue-400 text-blue-600
                      `}>
                        Description
                      </h4>
                      <p className={`
                        ${isMobile ? 'text-sm' : 'leading-relaxed'}
                        dark:text-gray-300 text-gray-700
                      `}>
                        {details}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className={`
                        p-3 rounded-lg border
                        dark:bg-blue-500/10 dark:border-blue-500/20
                        bg-blue-50 border-blue-200
                      `}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className={`
                        font-semibold text-xs mb-1 flex items-center gap-1
                        dark:text-blue-400 text-blue-600
                      `}>
                        <Sparkles className="w-3 h-3" />
                        CONSEILS DE TRI
                      </h4>
                      <ul className="text-xs space-y-1">
                        <li className="dark:text-gray-300 text-gray-700">• Bien nettoyer les contenants</li>
                        <li className="dark:text-gray-300 text-gray-700">• Retirer les couvercles non-recyclables</li>
                        <li className="dark:text-gray-300 text-gray-700">• Compacter pour gagner de l'espace</li>
                      </ul>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className={`
                      flex gap-3 mt-6 pt-4 border-t
                      dark:border-white/20 border-gray-200
                    `}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <BoutonAnime
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Fermer
                    </BoutonAnime>
                    
                    <BoutonAnime
                      variant="gradient"
                      size="sm"
                      href="/guide"
                      className="flex-1"
                      glow={!isMobile}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Guide
                    </BoutonAnime>
                  </motion.div>
                </CardContent>
              </Card>
            </WidgetFlottant>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

BinModal.displayName = 'BinModal';

// Composant Switch pour thème
const ThemeSwitch = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg transition-colors
        dark:bg-slate-800/50 dark:hover:bg-slate-700/50
        bg-gray-100 hover:bg-gray-200
        border dark:border-white/10 border-gray-300
      `}
      aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {theme === 'dark' ? (
          <Sun className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-yellow-500`} />
        ) : (
          <Moon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-600`} />
        )}
      </motion.div>
    </motion.button>
  );
});

ThemeSwitch.displayName = 'ThemeSwitch';

// Composant principal optimisé
export default function ProjectEco() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // États optimisés
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  // Données optimisées avec traductions
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "dark:text-amber-600 text-amber-500", 
      bg: "dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-amber-600/10 bg-gradient-to-br from-amber-400/20 to-amber-500/10", 
      label: t("project.bins.paper", "Papier & Carton"),
      description: "",
      details: t("project.bins.paperDetails", "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres et réduire la consommation d'eau et d'énergie.")
    },
    { 
      icon: Package, 
      color: "dark:text-blue-600 text-blue-500", 
      bg: "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-600/10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10", 
      label: t("project.bins.plastic", "Plastique"),
      description: t("project.bins.plasticDesc", "Bouteilles, emballages plastiques"),
      details: t("project.bins.plasticDetails", "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer. Notre programme de recyclage les transforme en nouvelles ressources.")
    },
    { 
      icon: Trash2, 
      color: "dark:text-gray-600 text-gray-500", 
      bg: "dark:bg-gradient-to-br dark:from-gray-500/20 dark:to-gray-600/10 bg-gradient-to-br from-gray-400/20 to-gray-500/10", 
      label: t("project.bins.metal", "Métal"),
      description: t("project.bins.metalDesc", "Cannettes, boîtes de conserve"),
      details: t("project.bins.metalDetails", "Le recyclage des métaux permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire.")
    },
    { 
      icon: Apple, 
      color: "dark:text-green-600 text-green-500", 
      bg: "dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-600/10 bg-gradient-to-br from-green-400/20 to-emerald-500/10", 
      label: t("project.bins.organic", "Organique"),
      description: t("project.bins.organicDesc", "Déchets alimentaires, compostables"),
      details: t("project.bins.organicDetails", "Transformés en compost pour enrichir les sols des jardins communautaires et espaces verts publics.")
    },
  ], [t]);
  
  const goals = useMemo(() => [
    {
      icon: Target,
      title: t("project.implementation", "Mission Éducative"),
      description: t("project.implementation.desc", "Sensibiliser aux enjeux environnementaux"),
      color: "dark:text-blue-600 text-blue-500",
      bg: "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-600/10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10",
    },
    {
      icon: Users,
      title: t("project.awareness", "Engagement Communautaire"),
      description: t("project.awareness.desc", "Créer une communauté active et engagée"),
      color: "dark:text-green-600 text-green-500",
      bg: "dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-600/10 bg-gradient-to-br from-green-400/20 to-emerald-500/10",
    },
    {
      icon: Recycle,
      title: t("project.mobilization", "Innovation Technologique"),
      description: t("project.mobilization.desc", "Développer des solutions innovantes"),
      color: "dark:text-purple-600 text-purple-500",
      bg: "dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-pink-600/10 bg-gradient-to-br from-purple-400/20 to-pink-500/10",
    },
    {
      icon: Award,
      title: t("project.impact.1", "Impact Mesurable"),
      description: t("project.impact.2", "Atteindre des résultats concrets"),
      color: "dark:text-amber-600 text-amber-500",
      bg: "dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-600/10 bg-gradient-to-br from-amber-400/20 to-orange-500/10",
    }
  ], [t]);
  
  // Activités Éducatives section cards
  const activities = useMemo(() => [
    {
      icon: Gamepad2,
      title: t("activities.games", "Jeux"),
      description: t("activities.games.desc", "Jouez et apprenez avec nos jeux interactifs"),
      color: "dark:text-blue-600 text-blue-500",
      bg: "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-600/10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10",
      href: "/activities"
    },
    {
      icon: Video,
      title: t("videos.title", "Vidéos"),
      description: t("videos.subtitle", "Découvrez nos vidéos éducatives"),
      color: "dark:text-green-600 text-green-500",
      bg: "dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-600/10 bg-gradient-to-br from-green-400/20 to-emerald-500/10",
      href: "/videos"
    },
    {
      icon: Image,
      title: t("posters.title", "Posters"),
      description: t("posters.subtitle", "Affiches éducatives sur le recyclage"),
      color: "dark:text-purple-600 text-purple-500",
      bg: "dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-pink-600/10 bg-gradient-to-br from-purple-400/20 to-pink-500/10",
      href: "/posters"
    },
    {
      icon: BookOpen,
      title: t("guide.title", "Guide"),
      description: t("guide.subtitle", "Apprenez à trier correctement vos déchets"),
      color: "dark:text-amber-600 text-amber-500",
      bg: "dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-600/10 bg-gradient-to-br from-amber-400/20 to-orange-500/10",
      href: "/guide"
    }
  ], [t]);
  
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
    
    const interval = isMobile ? 5000 : 4000;
    autoRotationInterval.current = setInterval(rotateBins, interval);
    
    return () => {
      mountedRef.current = false;
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, openModalIndex, bins.length, isMobile]);
  
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
    }, 300);
  }, []);
  
  return (
    <div className="min-h-screen overflow-hidden">
      <FondAnime />
      
      {/* Barre de progression de scroll */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-1 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className={`
          w-full h-full
          dark:bg-slate-900/30 bg-gray-100/30
          backdrop-blur-sm
        `}>
          <motion.div 
            className={`
              h-full rounded-r-full
              dark:bg-gradient-to-r dark:from-blue-600 dark:via-emerald-600 dark:to-cyan-600
              bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500
            `}
            style={{ width: `${scrollProgress}%` }}
            transition={{ type: "spring", damping: 30, stiffness: 100, mass: 0.5 }}
          />
        </div>
      </motion.div>
      
      {/* Bouton thème */}
      <div className="fixed top-4 right-4 z-40">
        <ThemeSwitch />
      </div>
      
      <div className={`container mx-auto px-4 ${isMobile ? 'py-6' : 'py-8 md:py-12 lg:py-16'}`}>
        {/* Section Héro */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`max-w-6xl mx-auto text-center ${isMobile ? 'mb-12 pt-12' : 'mb-16 md:mb-24 pt-16'}`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className={`
              inline-flex items-center gap-2 ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-full font-medium mb-6
              backdrop-blur-xl shadow-lg border
              dark:bg-gradient-to-r dark:from-blue-600/30 dark:via-emerald-500/30 dark:to-cyan-500/30
              dark:border-white/20 dark:text-white
              bg-gradient-to-r from-blue-500/20 via-emerald-400/20 to-cyan-400/20
              border-gray-300 text-gray-800
            `}
          >
            <Sparkles className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span>{t("hero.badge", "Our project explained")}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.h1 
              className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl lg:text-7xl'} font-black mb-4 tracking-tight`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.span
                className={`
                  bg-gradient-to-r bg-clip-text text-transparent inline-block
                  dark:from-blue-600 dark:via-emerald-600 dark:to-cyan-600
                  from-blue-500 via-emerald-500 to-cyan-500
                `}
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% auto' }}
              >
                {t("hero.title", "Écologie")}
              </motion.span>
            </motion.h1>
            
            <motion.h2
              className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold mb-4`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="dark:text-white text-gray-900">
                {t("project.title", "Notre Planète, Notre Avenir")}
              </span>
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
            className={`max-w-2xl mx-auto mb-6`}
          >
            <p className={`
              ${isMobile ? 'text-base' : 'text-lg'} leading-relaxed mb-6
              dark:text-gray-300 text-gray-700
            `}>
              {t("project.intro", "Bienvenue dans notre mouvement écologique communautaire. Ensemble, nous créons un avenir durable pour les générations à venir.")}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
            className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 justify-center items-center mb-8`}
          >
            <BoutonAnime
              variant="gradient"
              size={isMobile ? "default" : "lg"}
              icon={<Rocket className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />}
              href="/project"
              glow={!isMobile}
              pulse={!isMobile}
            >
              {t("hero.cta", "Découvrir")}
            </BoutonAnime>
            
            <BoutonAnime
              variant="outline"
              size={isMobile ? "default" : "lg"}
              icon={<BookOpen className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />}
              href="/guide"
            >
              {t("guide.title", "Guide Pratique")}
            </BoutonAnime>
          </motion.div>
        </motion.section>
        
        {/* Section Objectifs */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          transition={{ duration: 0.5 }}
          className={`max-w-7xl mx-auto ${isMobile ? 'mb-12' : 'mb-16'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={!isMobile ? { rotate: 360 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Target className={`
                ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mx-auto mb-3
                dark:text-blue-600 text-blue-500
              `} />
            </motion.div>
            <motion.h2
              className={`
                ${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-3
                dark:text-white text-gray-900
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("project.goal.title", "Nos Objectifs")}
            </motion.h2>
            <motion.p
              className={`
                ${isMobile ? 'text-base' : 'text-lg'}
                dark:text-gray-300 text-gray-600
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("project.goal.text", "Construire un avenir durable ensemble")}
            </motion.p>
          </motion.div>
          
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-5'}`}>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <CarteInteractive
                  icon={goal.icon}
                  title={goal.title}
                  description={goal.description}
                  color={goal.color}
                  bg={goal.bg}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
        
        {/* Section Tri Sélectif */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          transition={{ duration: 0.5 }}
          className={`max-w-7xl mx-auto ${isMobile ? 'mb-12' : 'mb-16'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: isMobile ? 15 : 12, repeat: Infinity, ease: "linear" }}
            >
              <Recycle className={`
                ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mx-auto mb-3
                dark:text-emerald-600 text-emerald-500
              `} />
            </motion.div>
            <motion.h2
              className={`
                ${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-3
                dark:text-white text-gray-900
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("project.bins.title", "Tri Sélectif")}
            </motion.h2>
            <motion.p
              className={`
                ${isMobile ? 'text-base' : 'text-lg'}
                dark:text-gray-300 text-gray-600
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("project.bins.text", "Un système simple pour un impact maximal")}
            </motion.p>
          </motion.div>
          
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-5'} mb-6`}>
            {bins.map((bin, index) => (
              <motion.div
                key={bin.label}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <CarteInteractive
                  icon={bin.icon}
                  title={bin.label}
                  description={bin.description}
                  color={bin.color}
                  bg={bin.bg}
                  onClick={() => handleBinClick(index)}
                  isActive={activeBinIndex === index}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3 mt-6"
          >
            <div className="flex items-center gap-2">
              {bins.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleBinClick(index)}
                  className={`
                    relative w-2.5 h-2.5 rounded-full transition-colors duration-200
                    ${index === activeBinIndex 
                      ? 'dark:bg-gradient-to-r dark:from-blue-600 dark:to-emerald-600 bg-gradient-to-r from-blue-500 to-emerald-500' 
                      : 'dark:bg-white/30 dark:hover:bg-white/50 bg-gray-400 hover:bg-gray-600'
                    }
                  `}
                  whileHover={!isMobile ? { scale: 1.5 } : {}}
                  whileTap={{ scale: 0.8 }}
                  aria-label={`${t("common.view", "Voir")} ${bins[index].label}`}
                >
                  {index === activeBinIndex && (
                    <motion.div
                      className="absolute -inset-1.5 rounded-full border"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <div className={`
                        w-full h-full rounded-full
                        dark:border-emerald-500/30 border-emerald-400/30
                      `} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            
            <motion.div whileHover={!isMobile ? { scale: 1.05 } : {}}>
              <BoutonAnime
                variant="outline"
                size="sm"
                icon={isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                {isAutoRotating ? t("common.pause", 'Pause') : t("common.play", 'Reprendre')}
              </BoutonAnime>
            </motion.div>
          </motion.div>
        </motion.section>
        
        {/* Section Activités Éducatives */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: isMobile ? "-50px" : "-100px" }}
          transition={{ duration: 0.5 }}
          className={`max-w-7xl mx-auto ${isMobile ? 'mb-12' : 'mb-16'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={!isMobile ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className={`
                ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mx-auto mb-3
                dark:text-yellow-500 text-yellow-500
              `} />
            </motion.div>
            <motion.h2
              className={`
                ${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold mb-3
                dark:text-white text-gray-900
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t("activities.title", "Activités Éducatives")}
            </motion.h2>
            <motion.p
              className={`
                ${isMobile ? 'text-base' : 'text-lg'}
                dark:text-gray-300 text-gray-600
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("activities.subtitle", "Explorez nos ressources interactives")}
            </motion.p>
          </motion.div>
          
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-5'}`}>
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <CarteInteractive
                  icon={activity.icon}
                  title={activity.title}
                  description={activity.description}
                  color={activity.color}
                  bg={activity.bg}
                  href={activity.href}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
          
          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <WidgetFlottant intensity={0.15} glow={!isMobile} minHeight="min-h-0">
              <Card className={`
                border overflow-hidden
                dark:bg-gradient-to-br dark:from-blue-600/20 dark:via-emerald-600/20 dark:to-cyan-600/20
                bg-gradient-to-br from-blue-500/15 via-emerald-500/15 to-cyan-500/15
                dark:border-white/20 border-gray-300
              `}>
                <CardContent className={`${isMobile ? 'p-5' : 'p-6'} text-center`}>
                  <Heart className={`
                    ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} mx-auto mb-4 animate-pulse
                    dark:text-pink-500 text-pink-500
                  `} />
                  <h3 className={`
                    ${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-3
                    dark:text-white text-gray-900
                  `}>
                    {t("project.why.title", "Votre Engagement Compte")}
                  </h3>
                  <p className={`
                    mb-4 max-w-2xl mx-auto ${isMobile ? 'text-sm' : ''}
                    dark:text-gray-300 text-gray-700
                  `}>
                    {t("project.why.text", "Chaque geste que vous posez pour l'environnement a un impact réel. Ensemble, nous pouvons créer un changement durable.")}
                  </p>
                  <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 justify-center`}>
                    <BoutonAnime
                      variant="gradient"
                      size={isMobile ? "default" : "default"}
                      icon={<Users className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                      href="/contact"
                      glow={!isMobile}
                    >
                      {t("nav.contact", "Nous Contacter")}
                    </BoutonAnime>
                    
                    <BoutonAnime
                      variant="outline"
                      size={isMobile ? "default" : "default"}
                      icon={<Gamepad2 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />}
                      href="/activities"
                    >
                      {t("activities.games", "Jeux")}
                    </BoutonAnime>
                  </div>
                </CardContent>
              </Card>
            </WidgetFlottant>
          </motion.div>
        </motion.section>
      </div>
      
      {/* Modals */}
      {openModalIndex !== null && (
        <BinModal
          isOpen={true}
          onClose={handleCloseModal}
          icon={bins[openModalIndex].icon}
          title={bins[openModalIndex].label}
          description={bins[openModalIndex].description || bins[openModalIndex].label}
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
          50% { opacity: 0.8; transform: scale(1.03); }
        }
        
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .animate-gradient-flow {
          animation: gradient-flow 15s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-float-gentle {
          animation: float-gentle 8s ease-in-out infinite;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
        
        .will-change-transform {
          will-change: transform;
        }
        
        /* Cache les scrollbars */
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Smooth transitions for theme changes */
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        
        /* Optimisations pour mobile */
        @media (max-width: 768px) {
          .touch-manipulation {
            touch-action: manipulation;
          }
          
          /* Prévenir le zoom sur les inputs iOS */
          input, select, textarea {
            font-size: 16px !important;
          }
        }
        
        /* Améliorations de performance */
        .performance-optimized {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
