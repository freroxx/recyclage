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
  TrendingUp as TrendingUpIcon,
  BookOpen,
  Award as AwardIcon,
  Info,
  Calendar,
  MapPin,
  Gift,
  Coffee,
  Clock as ClockIcon,
  ThumbsUp,
  ShieldCheck,
  Heart as HeartIcon,
  Users as UsersIcon,
  Home,
  School,
  Leaf as LeafIcon,
  Search,
  Filter,
  Download,
  Share2,
  Bell,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mail,
  Phone,
  Map,
  Navigation,
  Camera,
  Video,
  Mic,
  Music,
  Film,
  Image,
  File,
  Folder,
  Database,
  Server,
  Cpu as CpuIcon,
  MemoryStick,
  HardDrive,
  Network,
  Wifi,
  Bluetooth,
  Radio,
  Satellite,
  CloudRain,
  Wind,
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Umbrella,
  Thermometer,
  Droplet
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
          spring: framerMotion.spring,
          useAnimation: framerMotion.useAnimation,
          useInView: framerMotion.useInView
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

// Composant Bouton Animé Premium avec corrections et améliorations
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
  ...props 
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "premium" | "gradient" | "success" | "warning" | "danger";
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number, size: number}>>([]);
  
  const handleMouseEnter = () => !disabled && setIsHovered(true);
  const handleMouseLeave = () => !disabled && setIsHovered(false);
  const handleMouseDown = () => !disabled && setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading) return;
    
    const button = buttonRef.current;
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);
    
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id, size }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 800);
    
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
    gradient: "bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 hover:from-primary/90 hover:via-emerald-700 hover:to-cyan-700 shadow-lg hover:shadow-2xl",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl",
    warning: "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
  };
  
  const ButtonContent = (
    <>
      {/* Effets d'Ondulation */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Effet de Lueur */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Effet de Brillance */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute -inset-y-full -left-20 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
      </span>
      
      {/* État Loading */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-xl">
          <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
        </span>
      )}
      
      <span className="relative flex items-center justify-center gap-3">
        {icon && !loading && (
          <span className="transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </span>
        )}
        {loading ? (
          <span className="opacity-0">{children}</span>
        ) : (
          children
        )}
        {!loading && (
          <ArrowRight className="w-5 h-5 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:scale-110" />
        )}
      </span>
    </>
  );
  
  const buttonClasses = `
    relative overflow-hidden rounded-xl font-semibold
    transition-all duration-500 ease-out
    transform hover:-translate-y-1 active:translate-y-0
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${isPressed ? 'scale-95' : ''}
  `;
  
  if (href && !disabled && !loading) {
    return (
      <Link to={href}>
        <button
          ref={buttonRef}
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
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
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {ButtonContent}
    </button>
  );
});

BoutonAnime.displayName = 'BoutonAnime';

// Composant Widget Flottant amélioré avec plus d'options
const WidgetFlottant = memo(({
  children,
  intensity = 1,
  className = "",
  interactive = true,
  glow = true,
  shadow = true,
  border = true
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  shadow?: boolean;
  border?: boolean;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!widgetRef.current) return;
      
      const rect = widgetRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
    };
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
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
  }, [interactive]);
  
  const rotateX = interactive ? mousePosition.y * 3 * intensity : 0;
  const rotateY = interactive ? -mousePosition.x * 3 * intensity : 0;
  const translateZ = interactive ? Math.abs(mousePosition.x + mousePosition.y) * 8 * intensity : 0;
  
  return (
    <div
      ref={widgetRef}
      className={`relative transition-all duration-500 ease-out will-change-transform ${className}
        ${shadow ? 'shadow-lg hover:shadow-2xl' : ''}
        ${border ? 'border border-white/10 hover:border-primary/20' : ''}
      `}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      }}
    >
      {/* Lumière Ambiance */}
      {glow && interactive && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 via-transparent to-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      )}
      
      {/* Bordure Lumineuse */}
      {glow && interactive && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
      )}
      
      {/* Effet de focus */}
      {isHovered && interactive && (
        <div className="absolute -inset-1 rounded-2xl bg-primary/5 blur-md transition-all duration-300" />
      )}
      
      {children}
    </div>
  );
});

WidgetFlottant.displayName = 'WidgetFlottant';

// Système de particules amélioré avec contrôle de performance
const FondParticulesPremium = memo(({ 
  particleCount = 60,
  interactionStrength = 0.05,
  connectionDistance = 100
}: {
  particleCount?: number;
  interactionStrength?: number;
  connectionDistance?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 });
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Définir la taille du canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    
    const handleResize = () => {
      resize();
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Gestion de la visibilité pour économiser les performances
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Suivi de la souris
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.x;
      mouseRef.current.y = e.y;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Classe Particule
    class Particule {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      originalX: number;
      originalY: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originalX = this.x;
        this.originalY = this.y;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 200 + 55)}, 255, ${Math.random() * 0.2 + 0.05})`;
      }
      
      update() {
        // Mouvement naturel
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebond sur les bords
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        
        // Interaction avec la souris
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRef.current.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          
          this.x -= Math.cos(angle) * force * interactionStrength * 50;
          this.y -= Math.sin(angle) * force * interactionStrength * 50;
        }
        
        // Retour à la position originale progressivement
        this.x += (this.originalX - this.x) * 0.01;
        this.y += (this.originalY - this.y) * 0.01;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Dessiner les connexions
        particlesRef.current.forEach(particule => {
          const dx = this.x - particule.x;
          const dy = this.y - particule.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.15 * (1 - distance/connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particule.x, particule.y);
            ctx.stroke();
          }
        });
      }
    }
    
    // Initialiser les particules
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particule());
      }
    };
    
    initParticles();
    
    // Boucle d'animation optimisée
    const animate = () => {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner le fond dégradé
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.05)');
      gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.03)');
      gradient.addColorStop(1, 'rgba(30, 41, 59, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Mettre à jour et dessiner les particules
      particlesRef.current.forEach(particule => {
        particule.update();
        particule.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, particleCount, interactionStrength, connectionDistance]);
  
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
      />
      
      {/* Superpositions de dégradés animés */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-primary/3 via-transparent to-emerald-500/3 animate-pulse-slow" />
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none -z-10" />
      
      {/* Orbes flottants interactifs */}
      <div className="fixed top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-float-slow pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 right-10 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-full blur-3xl animate-float-slow delay-1000 pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/3 to-pink-500/3 rounded-full blur-3xl animate-float-slow delay-500 pointer-events-none -z-10" />
    </>
  );
});

FondParticulesPremium.displayName = 'FondParticulesPremium';

// Composant Carte Interactive pour les Poubelles
const CartePoubelleInteractive = memo(({ 
  bin,
  isActive,
  onClick,
  showDetails = false
}: {
  bin: any;
  isActive: boolean;
  onClick: () => void;
  showDetails?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const BinIcon = bin.icon;
  
  return (
    <WidgetFlottant intensity={1} glow={true} shadow={true} border={true}>
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`cursor-pointer h-full transition-all duration-500 ${isActive ? 'transform -translate-y-4' : ''}`}
      >
        <Card className={`h-full border-2 ${bin.borderColor} overflow-hidden 
                       backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-500 group`}>
          <CardContent className="p-6 md:p-8 text-center relative">
            {isActive && (
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            )}
            
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${bin.bg} 
                          flex items-center justify-center mx-auto mb-6
                          transition-all duration-500 group-hover:scale-105
                          ${isActive ? 'scale-105 ring-4 ring-white/30' : ''}`}>
              <BinIcon className={`w-10 h-10 md:w-12 md:h-12 ${bin.color} transition-all duration-500 
                            group-hover:rotate-6`} />
            </div>
            
            <h3 className="font-bold text-xl md:text-2xl mb-3 bg-gradient-to-r from-foreground to-foreground/80 
                         bg-clip-text text-transparent group-hover:text-primary transition-colors duration-500">
              {bin.label}
            </h3>
            
            <p className="text-sm md:text-base text-foreground/70 mb-4 group-hover:text-foreground/80 transition-colors duration-500">
              {bin.description}
            </p>
            
            {showDetails && (
              <div className="pt-4 border-t border-white/10 group-hover:border-primary/20 transition-colors duration-500">
                <div className="text-sm text-foreground/60 mb-2 group-hover:text-foreground/70 transition-colors duration-500">
                  Objectif 2025
                </div>
                <div className="text-base font-semibold text-emerald-500 group-hover:text-emerald-400 transition-colors duration-500">
                  {bin.goal}
                </div>
              </div>
            )}
            
            {/* Indicateur de survol */}
            {isHovered && !isActive && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="text-xs text-primary animate-bounce">Cliquez pour plus de détails</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WidgetFlottant>
  );
});

CartePoubelleInteractive.displayName = 'CartePoubelleInteractive';

// Composant Panel Détails amélioré
const PanelDetailsPoubelle = memo(({ 
  bin,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: {
  bin: any;
  onClose?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}) => {
  const BinIcon = bin.icon;
  
  return (
    <WidgetFlottant intensity={0.5} glow={true} shadow={true} border={true}>
      <Card className="border-2 border-primary/20 overflow-hidden backdrop-blur-xl bg-white/10">
        <CardContent className="p-6 md:p-8">
          {/* En-tête avec boutons de contrôle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${bin.bg} flex items-center justify-center`}>
                <BinIcon className={`w-6 h-6 ${bin.color}`} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">{bin.label}</h3>
                <p className="text-sm text-foreground/70">{bin.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Contenu détaillé */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">Description Détaillée</h4>
              <p className="text-foreground/80 leading-relaxed">{bin.longDescription}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-3 text-emerald-500">Objectif 2025</h4>
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-lg font-semibold text-emerald-600">{bin.goal}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-3 text-amber-500">Bons Gestes</h4>
              <ul className="space-y-2">
                {bin.bestPractices?.map((practice: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 text-foreground/70">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Navigation et actions */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              {hasPrev && onPrev && (
                <BoutonAnime
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft className="w-4 h-4" />}
                  onClick={onPrev}
                >
                  Précédent
                </BoutonAnime>
              )}
              
              {hasNext && onNext && (
                <BoutonAnime
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight className="w-4 h-4" />}
                  onClick={onNext}
                >
                  Suivant
                </BoutonAnime>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <BoutonAnime
                variant="outline"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
                onClick={() => navigator.share?.({ title: bin.label, text: bin.description })}
              >
                Partager
              </BoutonAnime>
              
              <BoutonAnime
                variant="gradient"
                size="sm"
                icon={<BookOpen className="w-4 h-4" />}
                href={`/guide/${bin.label.toLowerCase().replace(/ /g, '-')}`}
              >
                Guide Complet
              </BoutonAnime>
            </div>
          </div>
        </CardContent>
      </Card>
    </WidgetFlottant>
  );
});

PanelDetailsPoubelle.displayName = 'PanelDetailsPoubelle';

// Composant principal amélioré
export default function Project() {
  const { t, language } = useLanguage();
  const { motion, AnimatePresence, error: framerMotionError, loading: framerMotionLoading } = useLazyFramerMotion();
  
  // États améliorés
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredAction, setHoveredAction] = useState<number | null>(null);
  const [showBinDetails, setShowBinDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [particleSettings, setParticleSettings] = useState({
    count: 60,
    interaction: 0.05,
    distance: 100
  });
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const detailsPanelRef = useRef<HTMLDivElement>(null);
  
  // Données améliorées avec plus de détails
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      borderColor: "border-amber-400/30", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons, emballages papier",
      longDescription: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres, réduire la consommation d'eau (jusqu'à 90% d'économie) et d'énergie (jusqu'à 50% d'économie). Notre système de collecte optimisé garantit un taux de recyclage optimal.",
      goal: "Réduire la déforestation de 30% d'ici 2025",
      bestPractices: [
        "Aplatir les cartons pour gagner de la place",
        "Retirer les films plastiques des emballages",
        "Éviter de salir le papier avec des substances grasses",
        "Séparer les papiers brillants des papiers normaux"
      ]
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      borderColor: "border-blue-400/30", 
      label: "Plastique",
      description: "Bouteilles, emballages, films plastiques recyclables",
      longDescription: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer dans la nature. Notre programme de recyclage innovant transforme les plastiques usagés en nouvelles ressources. Nous utilisons des technologies de tri optique pour séparer les différents types de plastiques et maximiser leur valeur de recyclage.",
      goal: "Éliminer 50% des plastiques à usage unique d'ici 2024",
      bestPractices: [
        "Laver les emballages plastiques avant de les jeter",
        "Retirer les bouchons des bouteilles",
        "Écraser les bouteilles pour réduire le volume",
        "Vérifier le code de recyclage sous les produits"
      ]
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      borderColor: "border-gray-400/30", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve, produits métalliques",
      longDescription: "Le recyclage des métaux est particulièrement efficace : il permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire. Notre centre de tri utilise des aimants puissants et des courants de Foucault pour séparer les métaux ferreux et non-ferreux avec une précision de 99%.",
      goal: "Recycler 95% des métaux collectés et réduire l'empreinte carbone de 60%",
      bestPractices: [
        "Rincer les boîtes de conserve avant recyclage",
        "Séparer les couvercles des boîtes",
        "Ne pas écraser les canettes en aluminium",
        "Retirer les étiquettes si possible"
      ]
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      borderColor: "border-green-400/30", 
      label: "Organique",
      description: "Déchets alimentaires, résidus végétaux, compostables",
      longDescription: "Les déchets organiques représentent environ 30% de notre poubelle. Notre programme de compostage communautaire transforme ces déchets en ressources précieuses. Le compost produit est utilisé pour enrichir les sols des jardins communautaires, des espaces verts publics et des fermes locales, créant ainsi une économie circulaire.",
      goal: "Produire 100 tonnes de compost annuel et nourrir 5000m² de terres agricoles",
      bestPractices: [
        "Utiliser des sacs compostables pour la collecte",
        "Éviter les produits animaux dans le compost domestique",
        "Mélanger déchets verts et bruns",
        "Aérer régulièrement le compost"
      ]
    },
  ], []);
  
  const goals = useMemo(() => [
    {
      icon: Target,
      title: "Mission Éducative",
      description: "Éduquer et sensibiliser la communauté aux enjeux environnementaux",
      longDescription: "Notre programme éducatif complet s'adresse à tous les publics. Nous organisons des ateliers pratiques, des conférences interactives et fournissons des ressources pédagogiques gratuites. Notre objectif est de créer une culture durable partagée par tous les membres de la communauté.",
      color: "text-blue-600",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100/50",
      features: [
        "Ateliers éducatifs pour toutes les générations",
        "Ressources pédagogiques gratuites en ligne",
        "Formations certifiantes pour les entreprises",
        "Programme scolaire intégré dans 10 écoles"
      ],
      metrics: {
        participants: 5000,
        workshops: 120,
        schools: 10,
        satisfaction: 95
      }
    },
    {
      icon: Users,
      title: "Engagement Communautaire",
      description: "Créer une communauté active et engagée dans la protection de l'environnement",
      longDescription: "Nous croyons fermement que le changement durable vient de la base. Notre réseau grandissant de bénévoles et d'ambassadeurs écologiques organise des événements réguliers, des opérations de nettoyage et des projets collaboratifs qui renforcent les liens communautaires tout en protégeant l'environnement.",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-50 to-emerald-100/50",
      features: [
        "Réseau de 500+ bénévoles actifs",
        "Événements communautaires mensuels",
        "Partenariats avec 50 entreprises locales",
        "Programme d'ambassadeurs écologiques"
      ],
      metrics: {
        volunteers: 500,
        events: 24,
        partners: 50,
        projects: 15
      }
    },
    {
      icon: Recycle,
      title: "Innovation Technologique",
      description: "Développer des solutions innovantes pour le tri et la valorisation des déchets",
      longDescription: "Nous investissons continuellement dans la recherche et le développement de technologies de pointe. Nos centres de tri intelligents utilisent l'IA et la robotique pour améliorer l'efficacité du tri, tandis que nos projets de R&D explorent de nouvelles filières de valorisation des déchets complexes.",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-50 to-pink-100/50",
      features: [
        "Centres de tri intelligents avec IA",
        "Applications mobiles de suivi des déchets",
        "Systèmes de compostage avancés",
        "Recherche sur les bioplastiques innovants"
      ],
      metrics: {
        efficiency: 85,
        accuracy: 99,
        innovation: 12,
        patents: 3
      }
    },
    {
      icon: Award,
      title: "Impact Mesurable",
      description: "Atteindre des résultats concrets et mesurables pour notre planète",
      longDescription: "La transparence et la mesure de l'impact sont au cœur de notre démarche. Nous suivons rigoureusement nos progrès avec des indicateurs clés de performance environnementaux. Nos rapports annuels détaillés permettent à chaque membre de la communauté de voir concrètement les résultats de ses efforts.",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-50 to-orange-100/50",
      features: [
        "Réduction de 60% des déchets enfouis",
        "Augmentation de 75% du taux de recyclage",
        "Économie de 1 million de litres d'eau annuels",
        "Compensation de 500 tonnes de CO2 par an"
      ],
      metrics: {
        wasteReduction: 60,
        recyclingRate: 75,
        waterSaved: 1000000,
        co2Offset: 500
      }
    }
  ], []);
  
  const actions = useMemo(() => [
    {
      icon: Calendar,
      title: "Événements Réguliers",
      description: "Participez à nos événements communautaires et ateliers pratiques",
      details: "Chaque mois, nous organisons des activités variées : clean-ups, ateliers de compostage, conférences et visites de centres de tri.",
      color: "text-blue-600",
      bg: "from-blue-50 to-blue-100",
      date: "Tous les samedis",
      participants: "50-100 personnes"
    },
    {
      icon: School,
      title: "Programme Éducatif",
      description: "Formations et ressources pour tous les niveaux",
      details: "Notre programme éducatif couvre les écoles, les entreprises et le grand public avec des contenus adaptés à chaque public.",
      color: "text-green-600",
      bg: "from-green-50 to-emerald-100",
      date: "Sur demande",
      participants: "Tous publics"
    },
    {
      icon: Home,
      title: "Solutions Domestiques",
      description: "Conseils et outils pour un foyer plus écologique",
      details: "Découvrez comment réduire votre empreinte écologique à la maison avec nos guides pratiques et kits de démarrage.",
      color: "text-purple-600",
      bg: "from-purple-50 to-pink-100",
      date: "Accès permanent",
      participants: "Familles et particuliers"
    },
    {
      icon: Gift,
      title: "Récompenses Écologiques",
      description: "Bénéficiez d'avantages pour vos actions environnementales",
      details: "Notre programme de récompenses valorise chaque geste écologique avec des points échangeables contre des produits durables.",
      color: "text-amber-600",
      bg: "from-amber-50 to-orange-100",
      date: "Programme continu",
      participants: "Tous les membres"
    }
  ], []);
  
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
    
    autoRotationInterval.current = setInterval(rotateBins, 4000);
    
    return () => {
      mountedRef.current = false;
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, showBinDetails, bins.length]);
  
  // Gestion améliorée des interactions
  const handleBinInteraction = useCallback((index: number) => {
    setActiveBinIndex(index);
    setIsAutoRotating(false);
    setShowBinDetails(true);
    
    setTimeout(() => {
      if (mountedRef.current) {
        setIsAutoRotating(true);
      }
    }, 15000);
  }, []);
  
  const handleActionHover = useCallback((index: number | null) => {
    setHoveredAction(index);
  }, []);
  
  const handleNextBin = useCallback(() => {
    setActiveBinIndex(prev => (prev + 1) % bins.length);
  }, [bins.length]);
  
  const handlePrevBin = useCallback(() => {
    setActiveBinIndex(prev => (prev - 1 + bins.length) % bins.length);
  }, [bins.length]);
  
  const handleCloseDetails = useCallback(() => {
    setShowBinDetails(false);
  }, []);
  
  // Fonction pour ajuster les particules
  const adjustParticles = useCallback((setting: 'count' | 'interaction' | 'distance', value: number) => {
    setParticleSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);
  
  // Utiliser les composants motion
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';
  
  if (framerMotionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-8"></div>
          <h2 className="text-2xl font-semibold text-primary">Chargement des animations...</h2>
          <p className="text-muted-foreground mt-2">Préparation de l'expérience écologique</p>
        </div>
      </div>
    );
  }
  
  if (framerMotionError) {
    return (
      <div className="min-h-screen">
        <FondParticulesPremium {...particleSettings} />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Projet Écologique</h1>
          </div>
        </div>
      </div>
    );
  }
  
  // Récupérer l'icône de la poubelle active
  const ActiveBinIcon = bins[activeBinIndex]?.icon || FileText;
  
  return (
    <div className="min-h-screen overflow-hidden">
      <FondParticulesPremium {...particleSettings} />
      
      {/* Barre de progression améliorée */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 shadow-lg transition-all duration-300 ease-out" />
      </div>
      
      {/* Contrôles de performance (optionnel - peut être retiré en production) */}
      <div className="fixed bottom-24 right-8 z-40">
        <WidgetFlottant intensity={0.5}>
          <div className="bg-black/50 backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="text-xs text-white/70 mb-2">Performance</div>
            <div className="space-y-2">
              <button
                onClick={() => adjustParticles('count', particleSettings.count === 60 ? 30 : 60)}
                className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                Particules: {particleSettings.count}
              </button>
            </div>
          </div>
        </WidgetFlottant>
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Section Héro améliorée */}
        <MotionSection
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24 lg:mb-32"
        >
          <MotionDiv
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 via-emerald-500/20 to-cyan-500/20 
                       text-primary px-6 py-3 rounded-full text-sm font-medium mb-10 
                       border border-white/20 backdrop-blur-xl shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Initiative Écologique Excellence
            </span>
            <Sparkles className="w-4 h-4" />
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent 
                            animate-gradient bg-300% leading-tight">
                Ensemble pour la Planète
              </span>
            </h1>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light mb-6">
              Bienvenue dans notre mouvement écologique communautaire. Nous croyons fermement que chaque petit geste compte 
              et que, collectivement, nous pouvons créer un impact significatif pour préserver notre belle planète.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Depuis notre création, nous avons sensibilisé plus de 10 000 personnes, recyclé des centaines de tonnes 
              de déchets et créé une communauté engagée qui grandit chaque jour. Rejoignez-nous dans cette aventure 
              passionnante vers un avenir plus vert et durable.
            </p>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <BoutonAnime
              variant="gradient"
              size="xl"
              icon={<Rocket className="w-6 h-6" />}
              href="/guide"
              fullWidth={true}
            >
              Découvrir le Projet
            </BoutonAnime>
            
            <BoutonAnime
              variant="outline"
              size="xl"
              icon={<BookOpen className="w-6 h-6" />}
              href="/ressources"
              fullWidth={true}
            >
              Ressources Éducatives
            </BoutonAnime>

            <BoutonAnime
              variant="success"
              size="xl"
              icon={<HeartIcon className="w-6 h-6" />}
              href="/rejoindre"
              fullWidth={true}
            >
              Nous Rejoindre
            </BoutonAnime>
          </MotionDiv>
        </MotionSection>
        
        {/* Section Objectifs améliorée */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20 md:mb-32"
        >
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Nos Objectifs Stratégiques
              </span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Une vision claire et des objectifs ambitieux pour un impact environnemental significatif et durable
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map((goal, index) => (
              <MotionDiv
                key={goal.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
                className="h-full"
              >
                <WidgetFlottant intensity={0.8}>
                  <Card className={`h-full border-2 border-white/20 overflow-hidden 
                                 backdrop-blur-sm ${goal.bg} hover:bg-white/5 transition-all duration-500 group`}>
                    <CardContent className="p-8 relative">
                      <div className="flex items-start gap-6 mb-6">
                        <div className={`w-16 h-16 rounded-2xl ${goal.bg} 
                                      flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                          <goal.icon className={`w-8 h-8 ${goal.color} transition-transform duration-500`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-2xl mb-3 bg-gradient-to-r from-foreground to-foreground/80 
                                       bg-clip-text text-transparent group-hover:text-primary transition-colors duration-500">
                            {goal.title}
                          </h3>
                          <p className="text-foreground/80 mb-4 group-hover:text-foreground/90 transition-colors duration-500">
                            {goal.description}
                          </p>
                          <p className="text-sm text-foreground/70 group-hover:text-foreground/80 transition-colors duration-500">
                            {goal.longDescription}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="space-y-3 pt-6 border-t border-white/10 group-hover:border-primary/20 transition-colors duration-500">
                        {goal.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-foreground/70 group-hover:text-foreground/80 transition-colors duration-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform duration-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </WidgetFlottant>
              </MotionDiv>
            ))}
          </div>
        </MotionSection>
        
        {/* Section Tri Sélectif avec Description Détaillée */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-20 md:mb-32"
        >
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                Système de Tri Intelligent
              </span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-4">
              Apprenez à trier correctement vos déchets pour maximiser le recyclage et minimiser l'impact environnemental
            </p>
            <p className="text-lg text-foreground/70 max-w-4xl mx-auto">
              Notre système de tri a été conçu pour être simple, efficace et accessible à tous. Chaque catégorie de déchets 
              a son propre circuit de valorisation, permettant de réutiliser au maximum les ressources et de réduire notre empreinte écologique.
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {bins.map((bin, index) => (
              <MotionDiv
                key={bin.label}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
                className="h-full"
              >
                <CartePoubelleInteractive
                  bin={bin}
                  isActive={activeBinIndex === index}
                  onClick={() => handleBinInteraction(index)}
                  showDetails={true}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Panel de détails amélioré */}
          <AnimatePresence>
            {showBinDetails && (
              <MotionDiv
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-4xl mx-auto mb-8"
                ref={detailsPanelRef}
              >
                <PanelDetailsPoubelle
                  bin={bins[activeBinIndex]}
                  onClose={handleCloseDetails}
                  onNext={handleNextBin}
                  onPrev={handlePrevBin}
                  hasNext={activeBinIndex < bins.length - 1}
                  hasPrev={activeBinIndex > 0}
                />
              </MotionDiv>
            )}
          </AnimatePresence>
          
          {/* Indicateurs de navigation */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="flex justify-center gap-3 mt-12"
          >
            {bins.map((_, index) => (
              <button
                key={index}
                onClick={() => handleBinInteraction(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                  index === activeBinIndex 
                    ? 'w-8 bg-gradient-to-r from-primary to-emerald-600' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Aller à ${bins[index].label}`}
              />
            ))}
          </MotionDiv>
        </MotionSection>
        
        {/* Section Appel à l'Action Finale */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <WidgetFlottant intensity={1.2}>
            <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl 
                           bg-gradient-to-br from-primary/10 via-emerald-500/10 to-cyan-500/10">
              <CardContent className="p-12 md:p-16 text-center relative overflow-hidden">
                {/* Éléments de fond animés */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-primary/15 to-emerald-500/15 
                              rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 
                              rounded-full blur-3xl animate-pulse-slow delay-1000" />
                
                <MotionDiv
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 120, damping: 15, duration: 1 }}
                  className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-primary/25 to-emerald-500/25 
                           flex items-center justify-center mx-auto mb-10 border-4 border-white/20"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-white/80 
                                flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 bg-gradient-to-r from-primary to-emerald-600 
                                           bg-clip-text text-transparent" />
                  </div>
                </MotionDiv>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">
                  <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 
                                 bg-clip-text text-transparent">
                    Votre Engagement Compte
                  </span>
                </h2>
                
                <div className="text-xl text-foreground/90 leading-relaxed mb-10 max-w-2xl mx-auto relative z-10 space-y-4">
                  <p>
                    Chaque geste que vous posez pour l'environnement a un impact réel. En triant vos déchets, 
                    en réduisant votre consommation, en participant à nos événements, vous contribuez activement 
                    à la préservation de notre planète.
                  </p>
                  <p>
                    Notre communauté compte déjà des milliers de membres engagés qui font la différence chaque jour. 
                    Ensemble, nous avons déjà accompli de grandes choses, mais il reste encore beaucoup à faire.
                  </p>
                  <p className="font-semibold text-primary">
                    Rejoignez-nous aujourd'hui et faites partie de la solution !
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                  <BoutonAnime
                    variant="gradient"
                    size="lg"
                    icon={<Leaf className="w-6 h-6" />}
                    href="/rejoindre"
                    fullWidth={true}
                  >
                    Rejoindre Maintenant
                  </BoutonAnime>
                  
                  <BoutonAnime
                    variant="outline"
                    size="lg"
                    icon={<Compass className="w-6 h-6" />}
                    href="/decouvrir"
                    fullWidth={true}
                  >
                    Découvrir nos Projets
                  </BoutonAnime>

                  <BoutonAnime
                    variant="success"
                    size="lg"
                    icon={<Gift className="w-6 h-6" />}
                    href="/benevolat"
                    fullWidth={true}
                  >
                    Devenir Bénévole
                  </BoutonAnime>
                </div>
              </CardContent>
            </Card>
          </WidgetFlottant>
        </MotionSection>
      </div>
      
      {/* Bouton d'Action Flottant */}
      <MotionDiv
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        className="fixed bottom-8 right-8 z-40"
      >
        <WidgetFlottant intensity={1.5}>
          <BoutonAnime
            variant="gradient"
            size="lg"
            icon={<ChevronDown className="w-5 h-5" />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full w-16 h-16 p-0"
            aria-label="Retour en haut"
          >
            <ChevronDown className="w-6 h-6 rotate-180" />
          </BoutonAnime>
        </WidgetFlottant>
      </MotionDiv>
      
      {/* Styles globaux pour les animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(1deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(15px) rotate(-1deg); }
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
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-gradient {
          animation: gradient 4s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite;
        }
        
        .animate-ripple {
          animation: ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
        
        /* Optimisations des performances */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Accélération matérielle */
        .performance-layer {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity;
        }
        
        /* Réduction du mouvement */
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient,
          .animate-float-slow,
          .animate-ripple,
          .animate-shine,
          .animate-pulse-slow,
          .animate-bounce {
            animation: none !important;
          }
          
          * {
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Défilement fluide */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }
        
        /* Styles de focus */
        :focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 3px;
          border-radius: 0.5rem;
        }

        /* Animations de survol ultra-fluides */
        .smooth-hover {
          transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift {
          transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hover-lift:hover {
          transform: translateY(-8px);
        }

        .hover-scale {
          transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .hover-glow {
          transition: box-shadow 500ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-glow:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
