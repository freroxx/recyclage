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
  Rocket
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

// Composant Bouton Animé Premium avec animations améliorées
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
  variant?: "default" | "outline" | "premium" | "gradient" | "success";
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
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number, size: number}>>([]);
  
  const handleMouseEnter = useCallback(() => {
    if (!disabled && !loading) {
      setIsHovered(true);
    }
  }, [disabled, loading]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
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
    }, 600);
    
    if (onClick) onClick();
  }, [disabled, loading, onClick]);
  
  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl"
  };
  
  const variantClasses = {
    default: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
    outline: "border-2 border-primary/20 bg-background/80 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5",
    premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600",
    gradient: "bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 hover:from-primary/90 hover:via-emerald-700 hover:to-cyan-700",
    success: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
  };
  
  const ButtonContent = (
    <>
      {/* Effets d'Ondulation améliorés */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 animate-ripple-smooth"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Effet de Brillance amélioré */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute -inset-y-full -left-20 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine-smooth transition-all duration-700" />
      </span>
      
      {/* Effet de glow au survol */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* État Loading */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-xl">
          <span className="animate-spin-smooth rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span>
        </span>
      )}
      
      <span className="relative flex items-center justify-center gap-3">
        {icon && !loading && (
          <span className="transition-all duration-500 ease-out-smooth group-hover:scale-110 group-hover:rotate-12">
            {icon}
          </span>
        )}
        {loading ? (
          <span className="opacity-0">{children}</span>
        ) : (
          children
        )}
        {!loading && (
          <ArrowRight className="w-5 h-5 transition-all duration-500 ease-out-smooth group-hover:translate-x-2 group-hover:scale-110 group-hover:rotate-3" />
        )}
      </span>
    </>
  );
  
  const buttonClasses = `
    relative overflow-hidden rounded-xl font-semibold
    transition-all duration-500 ease-out-smooth
    transform hover:-translate-y-1.5 active:translate-y-0
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${isHovered ? 'shadow-2xl scale-[1.02]' : 'shadow-lg hover:shadow-xl'}
  `;
  
  if (href && !disabled && !loading) {
    return (
      <Link to={href}>
        <button
          ref={buttonRef}
          className={buttonClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {ButtonContent}
    </button>
  );
});

BoutonAnime.displayName = 'BoutonAnime';

// Composant Widget Flottant redessiné avec animations ultra-fluides
const WidgetFlottant = memo(({
  children,
  intensity = 1,
  className = "",
  interactive = true,
  glow = true,
  minHeight = "min-h-[320px]",
  equalSize = true
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  minHeight?: string;
  equalSize?: boolean;
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
      
      requestAnimationFrame(() => {
        setMousePosition({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
      });
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
  
  const rotateX = interactive ? mousePosition.y * 8 * intensity : 0;
  const rotateY = interactive ? -mousePosition.x * 8 * intensity : 0;
  const translateZ = isHovered ? 20 : 0;
  const scale = isHovered ? 1.02 : 1;
  
  return (
    <div
      ref={widgetRef}
      className={`relative rounded-3xl group ${className}
        ${equalSize ? 'w-full h-full flex flex-col' : ''}
        ${minHeight}
      `}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
        transition: 'transform 600ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Animated gradient border */}
      <div className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-primary/40 via-emerald-500/40 to-cyan-500/40 opacity-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : ''}`} 
        style={{ filter: 'blur(1px)' }}
      />
      
      {/* Glow effect on hover */}
      {glow && (
        <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 via-emerald-500/15 to-cyan-500/20 transition-all duration-700 ${isHovered ? 'opacity-100 blur-2xl' : 'opacity-0 blur-xl'}`} />
      )}
      
      {/* Inner shadow and background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 shadow-xl" />
      
      {/* Shimmer effect on hover */}
      <div className={`absolute inset-0 rounded-3xl overflow-hidden`}>
        <div className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`} 
          style={{ transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)', transition: 'transform 1s ease-out' }}
        />
      </div>
      
      {/* Content container */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

WidgetFlottant.displayName = 'WidgetFlottant';

// Système de particules optimisé
const FondParticulesPremium = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  
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
    window.addEventListener('resize', resize);
    
    // Classe Particule améliorée
    class Particule {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = `rgb(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 200 + 55)}, 255)`;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebond sur les bords
        if (this.x > canvas!.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas!.height || this.y < 0) this.speedY = -this.speedY;
        
        // Animation de pulsation
        this.alpha = 0.1 + Math.sin(Date.now() * this.pulseSpeed) * 0.2;
      }
      
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Dessiner les connexions améliorées
        particlesRef.current.forEach(particule => {
          const dx = this.x - particule.x;
          const dy = this.y - particule.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.2 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particule.x, particule.y);
            ctx.stroke();
          }
        });
        ctx.restore();
      }
    }
    
    // Créer des particules
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particule());
      }
    };
    
    initParticles();
    
    // Boucle d'animation optimisée
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner le fond dégradé animé
      const time = Date.now() * 0.0001;
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width * Math.cos(time),
        canvas.height * Math.sin(time)
      );
      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.03)');
      gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.05)');
      gradient.addColorStop(1, 'rgba(30, 41, 59, 0.03)');
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
      
      {/* Enhanced animated gradient overlays */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Primary gradient layer with smooth animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-emerald-500/8 animate-pulse" 
          style={{ animationDuration: '8s' }} 
        />
        
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-emerald-500/15 via-emerald-500/5 to-transparent" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float-orb 20s ease-in-out infinite' }}
        />
        <div className="absolute top-[40%] right-[5%] w-[400px] h-[400px] bg-gradient-radial from-emerald-500/20 via-emerald-500/5 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float-orb 25s ease-in-out infinite reverse' }}
        />
        <div className="absolute bottom-[10%] left-[30%] w-[600px] h-[600px] bg-gradient-radial from-cyan-500/15 via-cyan-500/3 to-transparent rounded-full blur-3xl"
          style={{ animation: 'float-orb 30s ease-in-out infinite' }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </>
  );
});

FondParticulesPremium.displayName = 'FondParticulesPremium';

// Composant Carte Interactive redessiné
const CarteInteractive = memo(({ 
  icon: Icon,
  title,
  description,
  color = "text-primary",
  bg = "bg-gradient-to-br from-primary/20 to-primary/10",
  onClick,
  isActive = false,
  equalSize = true
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
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <WidgetFlottant 
      intensity={0.6} 
      glow={true}
      minHeight="min-h-[300px]"
      equalSize={equalSize}
    >
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer h-full"
      >
        <Card className={`h-full border-0 overflow-hidden bg-transparent rounded-3xl`}>
          <CardContent className="p-8 text-center relative flex flex-col items-center justify-center h-full">
            {/* Active indicator */}
            {isActive && (
              <div className="absolute top-5 right-5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
              </div>
            )}
            
            {/* Animated background circles */}
            <div className={`absolute inset-0 overflow-hidden rounded-3xl`}>
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${bg} transition-all duration-700 ${isHovered ? 'scale-150 opacity-60' : 'scale-100 opacity-30'}`} />
              <div className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full ${bg} transition-all duration-700 delay-100 ${isHovered ? 'scale-150 opacity-60' : 'scale-100 opacity-30'}`} />
            </div>
            
            {/* Icon container with enhanced animation */}
            <div className={`relative w-24 h-24 md:w-28 md:h-28 rounded-3xl ${bg} 
                          flex items-center justify-center mx-auto mb-6 overflow-hidden
                          transition-all duration-500
                          ${isHovered ? 'scale-110 rotate-3 shadow-2xl' : 'shadow-lg'}
                          ${isActive ? 'ring-4 ring-primary/40 scale-105' : ''}`}
            >
              {/* Inner glow */}
              <div className={`absolute inset-0 bg-gradient-to-br from-white/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
              
              <Icon className={`relative z-10 w-12 h-12 md:w-14 md:h-14 ${color} transition-all duration-500 
                            ${isHovered ? 'scale-110 rotate-6' : ''}`} />
            </div>
            
            {/* Title with gradient */}
            <h3 className={`relative z-10 font-bold text-xl md:text-2xl mb-3 transition-all duration-500
                          ${isHovered ? 'text-primary scale-105' : 'text-foreground'}`}>
              {title}
            </h3>
            
            {/* Description */}
            <p className={`relative z-10 text-sm md:text-base transition-all duration-500 flex-grow
                          ${isHovered ? 'text-foreground' : 'text-muted-foreground'}`}>
              {description}
            </p>
            
            {/* Hover indicator */}
            <div className={`relative z-10 mt-4 pt-4 border-t transition-all duration-500 overflow-hidden
                           ${isHovered ? 'border-primary/30 opacity-100 max-h-20' : 'border-transparent opacity-0 max-h-0'}`}>
              <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
                <span>Explorer</span>
                <ArrowRight className="w-4 h-4 animate-bounce" style={{ animationDirection: 'alternate', animationDuration: '0.5s' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </WidgetFlottant>
  );
});

CarteInteractive.displayName = 'CarteInteractive';

// Composant Panel Détails amélioré avec taille standardisée
const PanelDetails = memo(({ 
  icon: Icon,
  title,
  description,
  details,
  color = "text-primary",
  bg = "bg-gradient-to-br from-primary/20 to-primary/10",
  border = "border-primary/30",
  onClose,
  equalSize = true
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
}) => {
  
  return (
    <WidgetFlottant 
      intensity={0.5} 
      glow={true}
      minHeight="min-h-[400px]"
      equalSize={equalSize}
    >
      <Card className={`h-full border-2 ${border} overflow-hidden backdrop-blur-xl bg-white/10 rounded-2xl`}>
        <CardContent className="p-6 md:p-8 h-full flex flex-col">
          {/* En-tête avec boutons de contrôle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center transition-all duration-500 hover:scale-110`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">{title}</h3>
                <p className="text-sm text-foreground/70">{description}</p>
              </div>
            </div>
            
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Contenu détaillé */}
          <div className="space-y-6 flex-grow">
            <div>
              <h4 className="font-semibold text-lg mb-3 text-primary">Description Détaillée</h4>
              <p className="text-foreground/80 leading-relaxed">{details}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <BoutonAnime
                variant="outline"
                size="sm"
                icon={<Share2 className="w-4 h-4" />}
                onClick={() => navigator.share?.({ title, text: description })}
              >
                Partager
              </BoutonAnime>
            </div>
            
            <BoutonAnime
              variant="gradient"
              size="sm"
              icon={<BookOpen className="w-4 h-4" />}
              href={`/guide/${title.toLowerCase().replace(/ /g, '-')}`}
            >
              En savoir plus
            </BoutonAnime>
          </div>
        </CardContent>
      </Card>
    </WidgetFlottant>
  );
});

PanelDetails.displayName = 'PanelDetails';

// Composant principal amélioré
export default function Project() {
  useLanguage();
  const { motion, error: framerMotionError, loading: framerMotionLoading } = useLazyFramerMotion();
  
  // États améliorés
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showBinDetails, setShowBinDetails] = useState(false);
  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(null);
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  
  // Données avec tailles standardisées
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      border: "border-amber-400/30", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons, emballages papier",
      details: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres, réduire la consommation d'eau (jusqu'à 90% d'économie) et d'énergie (jusqu'à 50% d'économie). Notre système de collecte optimisé garantit un taux de recyclage optimal."
    },
    { 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      border: "border-blue-400/30", 
      label: "Plastique",
      description: "Bouteilles, emballages, films plastiques recyclables",
      details: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer dans la nature. Notre programme de recyclage innovant transforme les plastiques usagés en nouvelles ressources. Nous utilisons des technologies de tri optique pour séparer les différents types de plastiques et maximiser leur valeur de recyclage."
    },
    { 
      icon: Trash2, 
      color: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      border: "border-gray-400/30", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve, produits métalliques",
      details: "Le recyclage des métaux est particulièrement efficace : il permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire. Notre centre de tri utilise des aimants puissants et des courants de Foucault pour séparer les métaux ferreux et non-ferreux avec une précision de 99%."
    },
    { 
      icon: Apple, 
      color: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      border: "border-green-400/30", 
      label: "Organique",
      description: "Déchets alimentaires, résidus végétaux, compostables",
      details: "Les déchets organiques représentent environ 30% de notre poubelle. Notre programme de compostage communautaire transforme ces déchets en ressources précieuses. Le compost produit est utilisé pour enrichir les sols des jardins communautaires, des espaces verts publics et des fermes locales."
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
      border: "border-blue-400/30"
    },
    {
      icon: Users,
      title: "Engagement Communautaire",
      description: "Créer une communauté active et engagée dans la protection de l'environnement",
      details: "Nous croyons fermement que le changement durable vient de la base. Notre réseau grandissant de bénévoles et d'ambassadeurs écologiques organise des événements réguliers, des opérations de nettoyage et des projets collaboratifs qui renforcent les liens communautaires tout en protégeant l'environnement.",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      border: "border-green-400/30"
    },
    {
      icon: Recycle,
      title: "Innovation Technologique",
      description: "Développer des solutions innovantes pour le tri et la valorisation des déchets",
      details: "Nous investissons continuellement dans la recherche et le développement de technologies de pointe. Nos centres de tri intelligents utilisent l'IA et la robotique pour améliorer l'efficacité du tri, tandis que nos projets de R&D explorent de nouvelles filières de valorisation des déchets complexes.",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      border: "border-purple-400/30"
    },
    {
      icon: Award,
      title: "Impact Mesurable",
      description: "Atteindre des résultats concrets et mesurables pour notre planète",
      details: "La transparence et la mesure de l'impact sont au cœur de notre démarche. Nous suivons rigoureusement nos progrès avec des indicateurs clés de performance environnementaux. Nos rapports annuels détaillés permettent à chaque membre de la communauté de voir concrètement les résultats de ses efforts.",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      border: "border-amber-400/30"
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
      border: "border-blue-400/30"
    },
    {
      icon: BookOpen,
      title: "Programme Éducatif",
      description: "Formations et ressources pour tous les niveaux",
      details: "Notre programme éducatif couvre les écoles, les entreprises et le grand public avec des contenus adaptés à chaque public.",
      color: "text-green-600",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      border: "border-green-400/30"
    },
    {
      icon: Home,
      title: "Solutions Domestiques",
      description: "Conseils et outils pour un foyer plus écologique",
      details: "Découvrez comment réduire votre empreinte écologique à la maison avec nos guides pratiques et kits de démarrage.",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      border: "border-purple-400/30"
    },
    {
      icon: Award,
      title: "Certification Écologique",
      description: "Obtenir la certification environnementale pour notre communauté",
      details: "Notre programme de certification valorise les entreprises et individus qui s'engagent concrètement pour l'environnement.",
      color: "text-amber-600",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      border: "border-amber-400/30"
    }
  ], []);
  
  // Rotation automatique
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
  
  // Gestion des interactions améliorée
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
  
  const handleGoalInteraction = useCallback((index: number) => {
    setActiveGoalIndex(index === activeGoalIndex ? null : index);
  }, [activeGoalIndex]);
  
  const handleCloseDetails = useCallback(() => {
    setShowBinDetails(false);
    setActiveGoalIndex(null);
  }, []);
  
  // Utiliser les composants motion
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';
  const AnimatePresence = motion?.AnimatePresence || 'div';
  
  if (framerMotionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-background/50">
        <div className="text-center">
          <div className="animate-spin-smooth rounded-full h-32 w-32 border-t-2 border-b-2 border-primary mx-auto mb-8"></div>
          <h2 className="text-2xl font-semibold text-primary">Chargement de l'expérience...</h2>
        </div>
      </div>
    );
  }
  
  if (framerMotionError) {
    return (
      <div className="min-h-screen">
        <FondParticulesPremium />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">Projet Écologique</h1>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen overflow-hidden">
      <FondParticulesPremium />
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* Section Héro */}
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
                       border border-white/20 backdrop-blur-xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl"
          >
            <Sparkles className="w-4 h-4" />
            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Initiative Écologique Excellence
            </span>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 bg-clip-text text-transparent 
                            animate-gradient-smooth bg-300% leading-tight">
                Project de Recyclage
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
              Un projet au sein de l'école Maria pour sauver notre planète
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
              Guide du Tri
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
          </MotionDiv>
        </MotionSection>
        
        {/* Section Objectifs avec taille uniforme */}
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
                Nos Objectifs
              </span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Une vision claire et des objectifs ambitieux
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
                <CarteInteractive
                  icon={goal.icon}
                  title={goal.title}
                  description={goal.description}
                  color={goal.color}
                  bg={goal.bg}
                  border={goal.border}
                  onClick={() => handleGoalInteraction(index)}
                  isActive={activeGoalIndex === index}
                  equalSize={true}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Panel de détails des objectifs */}
          <AnimatePresence>
            {activeGoalIndex !== null && (
              <MotionDiv
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-12"
              >
                <PanelDetails
                  icon={goals[activeGoalIndex].icon}
                  title={goals[activeGoalIndex].title}
                  description={goals[activeGoalIndex].description}
                  details={goals[activeGoalIndex].details}
                  color={goals[activeGoalIndex].color}
                  bg={goals[activeGoalIndex].bg}
                  border={goals[activeGoalIndex].border}
                  onClose={handleCloseDetails}
                  equalSize={true}
                />
              </MotionDiv>
            )}
          </AnimatePresence>
        </MotionSection>
        
        {/* Section Tri Sélectif avec taille uniforme */}
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
              Apprenez à trier correctement vos déchets
            </p>
            <p className="text-lg text-foreground/70 max-w-4xl mx-auto">
              Notre système de tri a été conçu pour être simple, efficace et accessible à tous.
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
                <CarteInteractive
                  icon={bin.icon}
                  title={bin.label}
                  description={bin.description}
                  color={bin.color}
                  bg={bin.bg}
                  border={bin.border}
                  onClick={() => handleBinInteraction(index)}
                  isActive={activeBinIndex === index}
                  equalSize={true}
                />
              </MotionDiv>
            ))}
          </div>
          
          {/* Panel de détails des poubelles */}
          <AnimatePresence>
            {showBinDetails && (
              <MotionDiv
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-12"
              >
                <PanelDetails
                  icon={bins[activeBinIndex].icon}
                  title={bins[activeBinIndex].label}
                  description={bins[activeBinIndex].description}
                  details={bins[activeBinIndex].details}
                  color={bins[activeBinIndex].color}
                  bg={bins[activeBinIndex].bg}
                  border={bins[activeBinIndex].border}
                  onClose={handleCloseDetails}
                  equalSize={true}
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
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out-smooth hover:scale-125 ${
                  index === activeBinIndex 
                    ? 'w-8 bg-gradient-to-r from-primary to-emerald-600' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Aller à ${bins[index].label}`}
              />
            ))}
          </MotionDiv>
        </MotionSection>
        
        {/* Section Actions avec taille uniforme */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
                Passez à l'Action
              </span>
            </h2>
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Des initiatives concrètes pour vous engager dès aujourd'hui
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {actions.map((action, index) => (
              <MotionDiv
                key={action.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <CarteInteractive
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                  bg={action.bg}
                  border={action.border}
                  onClick={() => window.open(`/actions/${action.title.toLowerCase().replace(/ /g, '-')}`, '_blank')}
                  equalSize={true}
                />
              </MotionDiv>
            ))}
          </div>
        </MotionSection>
        
        {/* Section Appel à l'Action Finale */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <WidgetFlottant intensity={0.8} glow={true} equalSize={false}>
            <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl 
                           bg-gradient-to-br from-primary/10 via-emerald-500/10 to-cyan-500/10 rounded-2xl">
              <CardContent className="p-12 md:p-16 text-center relative overflow-hidden">
                {/* Éléments de fond animés */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-primary/15 to-emerald-500/15 
                              rounded-full blur-3xl animate-pulse-smooth" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 
                              rounded-full blur-3xl animate-pulse-smooth delay-1000" />
                
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
                    Ensemble, nous avons déjà accompli de grandes choses, mais il reste encore beaucoup à faire.
                  </p>
                  <p className="font-semibold text-primary animate-pulse-slow">
                    Rejoignez-nous aujourd'hui et faites partie de la solution !
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                  <BoutonAnime
                    variant="gradient"
                    size="lg"
                    icon={<Leaf className="w-6 h-6" />}
                    href="/contact"
                    fullWidth={true}
                  >
                    Nous Contacter
                  </BoutonAnime>
                  
                  <BoutonAnime
                    variant="outline"
                    size="lg"
                    icon={<BookOpen className="w-6 h-6" />}
                    href="/activities"
                    fullWidth={true}
                  >
                    Voir nos Activités
                  </BoutonAnime>
                </div>
              </CardContent>
            </Card>
          </WidgetFlottant>
        </MotionSection>
      </div>
      
      {/* Styles globaux pour les animations améliorées */}
      <style>{`
        @keyframes gradient-smooth {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        @keyframes float-smooth {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-10px) rotate(1deg) scale(1.02); }
          50% { transform: translateY(0px) rotate(0deg) scale(1); }
          75% { transform: translateY(10px) rotate(-1deg) scale(0.98); }
        }
        
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 30px) scale(1.05); }
        }
        
        @keyframes ripple-smooth {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          70% { transform: translate(-50%, -50%) scale(3); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        
        @keyframes shine-smooth {
          0% { transform: translateX(-100%) rotate(30deg); }
          50% { transform: translateX(100%) rotate(30deg); }
          100% { transform: translateX(300%) rotate(30deg); }
        }
        
        @keyframes pulse-smooth {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes spin-smooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce-smooth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-gradient-smooth {
          animation: gradient-smooth 5s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-gradient-slow {
          animation: gradient-slow 8s ease-in-out infinite;
        }
        
        .animate-float-smooth {
          animation: float-smooth 20s ease-in-out infinite;
        }
        
        .animate-ripple-smooth {
          animation: ripple-smooth 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .animate-shine-smooth {
          animation: shine-smooth 2s ease-in-out;
        }
        
        .animate-pulse-smooth {
          animation: pulse-smooth 2s ease-in-out infinite;
        }
        
        .animate-spin-smooth {
          animation: spin-smooth 1s linear infinite;
        }
        
        .animate-bounce-smooth {
          animation: bounce-smooth 1.5s ease-in-out infinite;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
        
        /* Courbes d'easing améliorées */
        .ease-out-smooth {
          transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        .ease-in-out-smooth {
          transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
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
          .animate-gradient-smooth,
          .animate-gradient-slow,
          .animate-float-smooth,
          .animate-ripple-smooth,
          .animate-shine-smooth,
          .animate-pulse-smooth,
          .animate-spin-smooth,
          .animate-bounce-smooth {
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
        
        /* Styles de focus améliorés */
        :focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 3px;
          border-radius: 0.5rem;
        }

        /* Animations de survol ultra-fluides */
        .smooth-hover {
          transition: all 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .hover-lift {
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .hover-scale {
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .hover-rotate {
          transition: transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .hover-glow {
          transition: box-shadow 500ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        
        /* Uniformisation des tailles */
        .widget-uniform {
          min-height: 280px;
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
      `}</style>
    </div>
  );
}
