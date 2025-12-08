import { useState, useEffect, useMemo, useCallback, useRef, memo, ReactNode } from "react";
import { 
  Trash2, FileText, Apple, Package, Target, Users, Leaf, Recycle, 
  CheckCircle2, ArrowRight, Sparkles, Award, BookOpen, Calendar, 
  Home, X, Share2, Rocket, Zap, Heart, Star, Cloud, Sun, Moon, 
  Droplets, Clock, Infinity, ChevronRight, Pause, Play, LucideIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types pour la traduction
type Language = 'fr' | 'en';
type TranslationKey = 
  | 'title' | 'subtitle' | 'welcome' | 'discover' | 'guide' | 'goals'
  | 'goals_subtitle' | 'sorting' | 'sorting_subtitle' | 'actions'
  | 'actions_subtitle' | 'commitment' | 'commitment_text' | 'contact'
  | 'see_activities' | 'tips' | 'tips_list_1' | 'tips_list_2' | 'tips_list_3'
  | 'close' | 'mission' | 'community' | 'innovation' | 'impact'
  | 'events' | 'resources' | 'home_guide' | 'projects' | 'initiative'
  | 'our_planet' | 'together_future' | 'simple_system' | 'concrete_initiatives'
  | 'recycling_tips' | 'description' | 'pause' | 'resume';

// Traductions
const translations: Record<Language, Record<TranslationKey, string>> = {
  fr: {
    title: "Écologie",
    subtitle: "Notre Planète, Notre Avenir",
    welcome: "Bienvenue dans notre mouvement écologique communautaire. Ensemble, nous créons un avenir durable pour les générations à venir.",
    discover: "Découvrir",
    guide: "Guide Pratique",
    goals: "Nos Objectifs",
    goals_subtitle: "Construire un avenir durable ensemble",
    sorting: "Tri Sélectif",
    sorting_subtitle: "Un système simple pour un impact maximal",
    actions: "Passez à l'Action",
    actions_subtitle: "Des initiatives concrètes pour s'engager",
    commitment: "Votre Engagement Compte",
    commitment_text: "Chaque geste que vous posez pour l'environnement a un impact réel. Ensemble, nous pouvons créer un changement durable.",
    contact: "Nous Contacter",
    see_activities: "Voir les Activités",
    tips: "CONSEILS DE TRI",
    tips_list_1: "• Bien nettoyer les contenants",
    tips_list_2: "• Retirer les couvercles non-recyclables",
    tips_list_3: "• Compacter pour gagner de l'espace",
    close: "Fermer",
    mission: "Mission Éducative",
    community: "Engagement Communautaire",
    innovation: "Innovation Technologique",
    impact: "Impact Mesurable",
    events: "Événements",
    resources: "Ressources",
    home_guide: "Guides",
    projects: "Projets",
    initiative: "Initiative Écologique 2025",
    our_planet: "Notre Planète, Notre Avenir",
    together_future: "Construire un avenir durable ensemble",
    simple_system: "Un système simple pour un impact maximal",
    concrete_initiatives: "Des initiatives concrètes pour s'engager",
    recycling_tips: "CONSEILS DE TRI",
    description: "Description",
    pause: "Pause",
    resume: "Reprendre"
  },
  en: {
    title: "Ecology",
    subtitle: "Our Planet, Our Future",
    welcome: "Welcome to our community ecological movement. Together, we're creating a sustainable future for generations to come.",
    discover: "Discover",
    guide: "Practical Guide",
    goals: "Our Goals",
    goals_subtitle: "Building a sustainable future together",
    sorting: "Selective Sorting",
    sorting_subtitle: "A simple system for maximum impact",
    actions: "Take Action",
    actions_subtitle: "Concrete initiatives to get involved",
    commitment: "Your Commitment Matters",
    commitment_text: "Every action you take for the environment has a real impact. Together, we can create lasting change.",
    contact: "Contact Us",
    see_activities: "See Activities",
    tips: "RECYCLING TIPS",
    tips_list_1: "• Clean containers thoroughly",
    tips_list_2: "• Remove non-recyclable lids",
    tips_list_3: "• Compact to save space",
    close: "Close",
    mission: "Educational Mission",
    community: "Community Engagement",
    innovation: "Technological Innovation",
    impact: "Measurable Impact",
    events: "Events",
    resources: "Resources",
    home_guide: "Guides",
    projects: "Projects",
    initiative: "Ecological Initiative 2025",
    our_planet: "Our Planet, Our Future",
    together_future: "Building a sustainable future together",
    simple_system: "A simple system for maximum impact",
    concrete_initiatives: "Concrete initiatives to get involved",
    recycling_tips: "RECYCLING TIPS",
    description: "Description",
    pause: "Pause",
    resume: "Resume"
  }
};

// Hook de gestion du thème corrigé
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);
  
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return { theme, toggleTheme };
};

// Hook de gestion de la langue simplifié (sans bouton)
const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('fr');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    const browserLang = navigator.language.split('-')[0];
    
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else if (browserLang === 'fr' || browserLang === 'en') {
      setLanguage(browserLang as Language);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);
  
  const t = useCallback((key: TranslationKey) => translations[language][key], [language]);
  
  return { language, t };
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

// Composant Link simplifié
const Link = ({ to, children, className = "", onClick }: { 
  to: string; 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
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

// Types pour le bouton
interface BoutonAnimeProps {
  children: ReactNode;
  variant?: "default" | "outline" | "gradient" | "eco";
  size?: "sm" | "default" | "lg";
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

// Composant Bouton corrigé
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
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || loading) return;
    e.preventDefault();
    onClick?.();
  }, [disabled, loading, onClick]);
  
  const sizeClasses: Record<string, string> = {
    sm: "px-5 py-2.5 text-sm",
    default: "px-7 py-3.5 text-base",
    lg: "px-9 py-4 text-lg",
  };
  
  const variantClasses: Record<string, string> = {
    default: `
      bg-gradient-to-r from-blue-600 to-blue-500 
      hover:from-blue-500 hover:to-blue-600 
      shadow-xl hover:shadow-blue-500/40
      text-white
    `,
    outline: `
      border-2 border-blue-400/40 bg-slate-900/90 
      hover:border-blue-400/80 hover:bg-blue-500/15 
      hover:shadow-blue-500/30
      dark:text-white text-blue-900
    `,
    gradient: `
      bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 
      hover:from-blue-500 hover:via-emerald-700 hover:to-cyan-700 
      shadow-xl hover:shadow-blue-500/40
      text-white
    `,
    eco: `
      bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 
      hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 
      shadow-xl hover:shadow-emerald-500/40
      text-white
    `,
  };
  
  const buttonClasses = `
    relative overflow-hidden rounded-2xl font-bold
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-blue-500/30
    ${fullWidth ? 'w-full' : ''}
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${isHovered ? 'shadow-2xl scale-105' : 'shadow-xl'}
  `;
  
  const ButtonContent = (
    <>
      {glow && (
        <span className={`
          absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-700
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          bg-gradient-to-r from-blue-500/30 via-emerald-500/20 to-cyan-500/30
        `} />
      )}
      
      {pulse && (
        <span className={`
          absolute -inset-2 rounded-2xl opacity-50
          bg-gradient-to-r from-blue-500/40 via-emerald-500/30 to-cyan-500/40
          animate-pulse
        `} />
      )}
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
          <span className="rounded-full h-8 w-8 border-t-3 border-b-3 border-white animate-spin"></span>
        </span>
      )}
      
      <span className="relative flex items-center justify-center gap-3">
        {icon && !loading && icon}
        {loading ? (
          <span className="opacity-0">{children}</span>
        ) : (
          children
        )}
        {!loading && variant !== 'outline' && (
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        )}
      </span>
    </>
  );
  
  const buttonElement = (
    <button
      className={buttonClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {ButtonContent}
    </button>
  );
  
  if (href && !disabled && !loading) {
    return (
      <Link 
        to={href} 
        className={`inline-block ${fullWidth ? 'w-full' : ''}`}
        onClick={onClick}
      >
        {buttonElement}
      </Link>
    );
  }
  
  return buttonElement;
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

// Widget corrigé et optimisé
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
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(!scrollReveal);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!scrollReveal || !widgetRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    observer.observe(widgetRef.current);
    return () => observer.disconnect();
  }, [scrollReveal, delay]);
  
  return (
    <div
      ref={widgetRef}
      className={`relative rounded-3xl ${className}
        ${equalSize ? 'w-full h-full flex flex-col' : ''}
        ${minHeight}
        transition-all duration-500
      `}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange?.(false);
      }}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`
      }}
    >
      {glow && (
        <div className={`
          absolute -inset-2 rounded-3xl blur-xl transition-opacity duration-700
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          bg-gradient-to-br from-blue-500/25 via-emerald-500/20 to-cyan-500/25
        `} />
      )}
      
      <div className={`
        absolute inset-0 rounded-3xl shadow-xl transition-all duration-500
        ${isHovered ? 'shadow-2xl' : ''}
        bg-gradient-to-br from-slate-800/95 via-slate-900/90 to-slate-800/85
        border border-white/10
      `} />
      
      <div className={`absolute inset-0 rounded-3xl overflow-hidden`}>
        <div className={`
          absolute -inset-full transition-transform duration-1200
          ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          bg-gradient-to-r from-transparent via-white/10 to-transparent
        `} />
      </div>
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
});

WidgetFlottant.displayName = 'WidgetFlottant';

// Arrière-plan animé optimisé et corrigé
const FondAnime = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number; y: number; size: number; speedX: number; speedY: number;
    color: string; alpha: number; pulseSpeed: number;
  }>>([]);
  
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
      ctx.scale(dpr, dpr);
      initParticles();
    };
    
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 40000));
      
      const colors = ['#60a5fa', '#34d399', '#22d3ee', '#c084fc'];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.2 + 0.1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    };
    
    const drawParticle = (particle: typeof particlesRef.current[0]) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.2)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      particlesRef.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        
        particle.alpha = 0.15 + Math.sin(time * particle.pulseSpeed) * 0.1;
        
        drawParticle(particle);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    resize();
    window.addEventListener('resize', resize);
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
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
        <div className={`
          absolute inset-0
          bg-gradient-to-br from-blue-900/10 via-transparent to-emerald-900/10
          animate-gradient-flow
        `} />
        
        <div className={`
          absolute top-0 left-0 right-0 h-64
          bg-gradient-to-b from-blue-500/10 to-transparent
          animate-float-gentle
        `} />
        
        <div className={`
          absolute bottom-0 left-0 right-0 h-64
          bg-gradient-to-t from-emerald-500/10 to-transparent
          animate-float-gentle-reverse
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
}

// Carte interactive corrigée
const CarteInteractive = memo(({ 
  icon: Icon,
  title,
  description,
  color = "text-blue-500",
  bg = "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
  onClick,
  isActive = false,
  delay = 0,
}: CarteInteractiveProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [delay]);
  
  return (
    <div ref={cardRef} className="h-full">
      <WidgetFlottant 
        glow={true}
        minHeight="min-h-[220px]"
        onHoverChange={setIsHovered}
        delay={delay}
      >
        <motion.div
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="cursor-pointer h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.6, delay: delay / 1000 }}
        >
          <Card className="h-full border-0 overflow-hidden bg-transparent rounded-3xl">
            <CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
              {isActive && (
                <motion.div
                  className="absolute top-3 right-3 z-20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                </motion.div>
              )}
              
              <motion.div
                className={`relative w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Icon className={`relative z-10 w-8 h-8 ${color}`} />
              </motion.div>
              
              <motion.h3
                className="font-bold text-lg mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={`
                  bg-gradient-to-r bg-clip-text text-transparent
                  ${isHovered ? 'from-blue-500 via-emerald-500 to-cyan-500' : 'from-white to-white/80'}
                `}>
                  {title}
                </span>
              </motion.h3>
              
              <motion.p
                className="text-sm mb-4 flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.4, delay: (delay + 200) / 1000 }}
              >
                <span className="text-gray-300">
                  {description}
                </span>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
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
  t: (key: TranslationKey) => string;
}

// Modal corrigé
const BinModal = memo(({ 
  isOpen,
  onClose,
  icon: Icon,
  title,
  description,
  details,
  color = "text-blue-500",
  bg = "bg-gradient-to-br from-blue-500/20 to-blue-500/10",
  t
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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
            }}
            className="relative w-full max-w-2xl"
          >
            <WidgetFlottant glow={true} minHeight="min-h-0">
              <Card className="border border-white/20 bg-slate-900/95 max-h-[85vh] overflow-y-auto">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className={`w-14 h-14 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${color}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1 text-white">
                          {title}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {description}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={onClose}
                      className="p-2 rounded-xl transition-colors flex-shrink-0 hover:bg-white/10"
                      aria-label="Fermer"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <X className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-semibold text-lg mb-3 text-blue-400">
                        {t('description')}
                      </h4>
                      <p className="leading-relaxed text-gray-300">
                        {details}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className="p-4 rounded-xl border bg-blue-500/10 border-blue-500/20"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-blue-400">
                        <Sparkles className="w-4 h-4" />
                        {t('recycling_tips')}
                      </h4>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li>{t('tips_list_1')}</li>
                        <li>{t('tips_list_2')}</li>
                        <li>{t('tips_list_3')}</li>
                      </ul>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="flex gap-4 mt-8 pt-6 border-t border-white/20"
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
                      {t('close')}
                    </BoutonAnime>
                    
                    <BoutonAnime
                      variant="gradient"
                      size="sm"
                      href="/guide"
                      className="flex-1"
                      glow={true}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {t('guide')}
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
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl transition-colors bg-slate-800/50 hover:bg-slate-700/50 border border-white/10"
      aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </motion.div>
    </motion.button>
  );
});

ThemeSwitch.displayName = 'ThemeSwitch';

// Composant principal corrigé
export default function ProjectEco() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const [activeBinIndex, setActiveBinIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const autoRotationInterval = useRef<NodeJS.Timeout>();
  
  const bins = useMemo(() => [
    { 
      icon: FileText, 
      color: "text-amber-500", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons",
      details: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres et réduire la consommation d'eau et d'énergie."
    },
    { 
      icon: Package, 
      color: "text-blue-500", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      label: "Plastique",
      description: "Bouteilles, emballages plastiques",
      details: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer. Notre programme de recyclage les transforme en nouvelles ressources."
    },
    { 
      icon: Trash2, 
      color: "text-gray-500", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve",
      details: "Le recyclage des métaux permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire."
    },
    { 
      icon: Apple, 
      color: "text-green-500", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      label: "Organique",
      description: "Déchets alimentaires, compostables",
      details: "Transformés en compost pour enrichir les sols des jardins communautaires et espaces verts publics."
    },
  ], []);
  
  const goals = useMemo(() => [
    {
      icon: Target,
      title: t('mission'),
      description: "Sensibiliser aux enjeux environnementaux",
      color: "text-blue-500",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
    },
    {
      icon: Users,
      title: t('community'),
      description: "Créer une communauté active et engagée",
      color: "text-green-500",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
    },
    {
      icon: Recycle,
      title: t('innovation'),
      description: "Développer des solutions innovantes",
      color: "text-purple-500",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
    },
    {
      icon: Award,
      title: t('impact'),
      description: "Atteindre des résultats concrets",
      color: "text-amber-500",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
    }
  ], [t]);
  
  const actions = useMemo(() => [
    {
      icon: Calendar,
      title: t('events'),
      description: "Activités et événements communautaires",
      color: "text-blue-500",
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
      href: "/activities"
    },
    {
      icon: BookOpen,
      title: t('resources'),
      description: "Guides et documents pédagogiques",
      color: "text-green-500",
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
      href: "/resources"
    },
    {
      icon: Home,
      title: t('home_guide'),
      description: "Conseils pour un foyer écologique",
      color: "text-purple-500",
      bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/10",
      href: "/guide"
    },
    {
      icon: Share2,
      title: t('projects'),
      description: "Découvrez nos initiatives en cours",
      color: "text-amber-500",
      bg: "bg-gradient-to-br from-amber-500/20 to-orange-600/10",
      href: "/project"
    }
  ], [t]);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isAutoRotating && openModalIndex === null) {
      autoRotationInterval.current = setInterval(() => {
        setActiveBinIndex(prev => (prev + 1) % bins.length);
      }, 4000);
    }
    
    return () => {
      if (autoRotationInterval.current) {
        clearInterval(autoRotationInterval.current);
      }
    };
  }, [isAutoRotating, openModalIndex, bins.length]);
  
  const handleBinClick = useCallback((index: number) => {
    setActiveBinIndex(index);
    setOpenModalIndex(index);
    setIsAutoRotating(false);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setOpenModalIndex(null);
    setIsAutoRotating(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <FondAnime />
      
      <motion.div 
        className="fixed top-0 left-0 w-full h-1 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-full h-full bg-slate-900/30 backdrop-blur-sm">
          <motion.div 
            className="h-full rounded-r-full bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600"
            style={{ width: `${scrollProgress}%` }}
            transition={{ type: "spring", damping: 30, stiffness: 100 }}
          />
        </div>
      </motion.div>
      
      <div className="fixed top-4 right-4 z-40">
        <ThemeSwitch />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto text-center mb-16 md:mb-24 pt-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-xl shadow-lg border bg-gradient-to-r from-blue-600/30 via-emerald-500/30 to-cyan-500/30 border-white/20 text-white"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('initiative')}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
              <motion.span
                className="bg-gradient-to-r bg-clip-text text-transparent inline-block from-blue-600 via-emerald-600 to-cyan-600"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% auto' }}
              >
                {t('title')}
              </motion.span>
            </h1>
            
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-white">
                {t('our_planet')}
              </span>
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <p className="text-xl leading-relaxed mb-6 text-gray-300">
              {t('welcome')}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <BoutonAnime
              variant="gradient"
              size="lg"
              icon={<Rocket className="w-5 h-5" />}
              href="/project"
              glow={true}
              pulse={true}
            >
              {t('discover')}
            </BoutonAnime>
            
            <BoutonAnime
              variant="outline"
              size="lg"
              icon={<BookOpen className="w-5 h-5" />}
              href="/guide"
            >
              {t('guide')}
            </BoutonAnime>
          </motion.div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <Target className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('goals')}
            </h2>
            <p className="text-lg text-gray-300">
              {t('together_future')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
        
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            >
              <Recycle className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('sorting')}
            </h2>
            <p className="text-lg text-gray-300">
              {t('simple_system')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {bins.map((bin, index) => (
              <motion.div
                key={bin.label}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mt-8"
          >
            <div className="flex items-center gap-2">
              {bins.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleBinClick(index)}
                  className={`relative w-3 h-3 rounded-full transition-colors duration-300
                    ${index === activeBinIndex 
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600' 
                      : 'bg-white/30 hover:bg-white/50'
                    }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.8 }}
                  aria-label={`Voir ${bins[index].label}`}
                >
                  {index === activeBinIndex && (
                    <motion.div
                      className="absolute -inset-2 rounded-full border-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <div className="w-full h-full rounded-full border-emerald-500/30" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }}>
              <BoutonAnime
                variant="outline"
                size="sm"
                icon={isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                onClick={() => setIsAutoRotating(!isAutoRotating)}
              >
                {isAutoRotating ? t('pause') : t('resume')}
              </BoutonAnime>
            </motion.div>
          </motion.div>
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('actions')}
            </h2>
            <p className="text-lg text-gray-300">
              {t('concrete_initiatives')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <CarteInteractive
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  color={action.color}
                  bg={action.bg}
                  onClick={() => window.location.href = action.href}
                  delay={index * 100}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <WidgetFlottant glow={true} minHeight="min-h-0">
              <Card className="border border-white/20 bg-gradient-to-br from-blue-600/20 via-emerald-600/20 to-cyan-600/20">
                <CardContent className="p-8 text-center">
                  <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse text-pink-500" />
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    {t('commitment')}
                  </h3>
                  <p className="mb-6 max-w-2xl mx-auto text-gray-300">
                    {t('commitment_text')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <BoutonAnime
                      variant="gradient"
                      size="lg"
                      icon={<Users className="w-5 h-5" />}
                      href="/contact"
                      glow={true}
                    >
                      {t('contact')}
                    </BoutonAnime>
                    
                    <BoutonAnime
                      variant="outline"
                      size="lg"
                      icon={<Calendar className="w-5 h-5" />}
                      href="/activities"
                    >
                      {t('see_activities')}
                    </BoutonAnime>
                  </div>
                </CardContent>
              </Card>
            </WidgetFlottant>
          </motion.div>
        </motion.section>
      </div>
      
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
          t={t}
        />
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-gentle-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-gradient-flow {
          animation: gradient-flow 20s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-float-gentle {
          animation: float-gentle 10s ease-in-out infinite;
        }
        
        .animate-float-gentle-reverse {
          animation: float-gentle-reverse 12s ease-in-out infinite;
        }
        
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
