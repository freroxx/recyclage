import { useState, useEffect, useMemo, useCallback, useRef, memo, ReactNode, useContext } from "react";
import { 
  Trash2, FileText, Apple, Package, Target, Users, Leaf, Recycle, 
  CheckCircle2, ArrowRight, Sparkles, Award, BookOpen, Calendar, 
  Home, X, Share2, Rocket, Zap, Heart, Star, Cloud, Sun, Moon, 
  Droplets, Clock, Infinity, ChevronRight, Pause, Play, LucideIcon,
  Globe, ChevronDown, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Contexte de langue
type Language = 'fr' | 'en';

const LanguageContext = React.createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: 'fr',
  setLanguage: () => {},
});

const useLanguage = () => useContext(LanguageContext);

// Traductions
const translations = {
  fr: {
    hero: {
      initiative: "Initiative Écologique 2025",
      title: "Écologie",
      subtitle: "Notre Planète, Notre Avenir",
      description: "Bienvenue dans notre mouvement écologique communautaire. Ensemble, nous créons un avenir durable pour les générations à venir.",
      cta: {
        discover: "Découvrir",
        guide: "Guide Pratique"
      }
    },
    goals: {
      title: "Nos Objectifs",
      subtitle: "Construire un avenir durable ensemble"
    },
    recycling: {
      title: "Tri Sélectif",
      subtitle: "Un système simple pour un impact maximal",
      pause: "Pause",
      resume: "Reprendre",
      bins: [
        {
          label: "Papier & Carton",
          description: "Journaux, magazines, cartons",
          details: "Le papier et le carton représentent environ 25% de nos déchets ménagers. Leur recyclage permet de sauver des arbres et réduire la consommation d'eau et d'énergie."
        },
        {
          label: "Plastique",
          description: "Bouteilles, emballages plastiques",
          details: "Les plastiques peuvent mettre jusqu'à 500 ans à se décomposer. Notre programme de recyclage les transforme en nouvelles ressources."
        },
        {
          label: "Métal",
          description: "Cannettes, boîtes de conserve",
          details: "Le recyclage des métaux permet d'économiser jusqu'à 95% de l'énergie nécessaire à leur production primaire."
        },
        {
          label: "Organique",
          description: "Déchets alimentaires, compostables",
          details: "Transformés en compost pour enrichir les sols des jardins communautaires et espaces verts publics."
        }
      ]
    },
    actions: {
      title: "Passez à l'Action",
      subtitle: "Des initiatives concrètes pour s'engager",
      cta: {
        contact: "Nous Contacter",
        activities: "Voir les Activités"
      }
    },
    modal: {
      description: "Description",
      tips: {
        title: "CONSEILS DE TRI",
        items: [
          "Bien nettoyer les contenants",
          "Retirer les couvercles non-recyclables",
          "Compacter pour gagner de l'espace"
        ]
      },
      buttons: {
        close: "Fermer",
        guide: "Guide"
      }
    },
    footer: {
      title: "Votre Engagement Compte",
      description: "Chaque geste que vous posez pour l'environnement a un impact réel. Ensemble, nous pouvons créer un changement durable."
    },
    navigation: {
      home: "Accueil",
      guide: "Guide",
      activities: "Activités",
      resources: "Ressources",
      project: "Projet",
      contact: "Contact"
    }
  },
  en: {
    hero: {
      initiative: "Ecological Initiative 2025",
      title: "Ecology",
      subtitle: "Our Planet, Our Future",
      description: "Welcome to our community ecological movement. Together, we are creating a sustainable future for generations to come.",
      cta: {
        discover: "Discover",
        guide: "Practical Guide"
      }
    },
    goals: {
      title: "Our Goals",
      subtitle: "Building a sustainable future together"
    },
    recycling: {
      title: "Selective Sorting",
      subtitle: "A simple system for maximum impact",
      pause: "Pause",
      resume: "Resume",
      bins: [
        {
          label: "Paper & Cardboard",
          description: "Newspapers, magazines, cardboard",
          details: "Paper and cardboard represent about 25% of our household waste. Recycling them saves trees and reduces water and energy consumption."
        },
        {
          label: "Plastic",
          description: "Bottles, plastic packaging",
          details: "Plastics can take up to 500 years to decompose. Our recycling program transforms them into new resources."
        },
        {
          label: "Metal",
          description: "Cans, tin cans",
          details: "Recycling metals can save up to 95% of the energy needed for their primary production."
        },
        {
          label: "Organic",
          description: "Food waste, compostable materials",
          details: "Transformed into compost to enrich the soil of community gardens and public green spaces."
        }
      ]
    },
    actions: {
      title: "Take Action",
      subtitle: "Concrete initiatives to get involved",
      cta: {
        contact: "Contact Us",
        activities: "View Activities"
      }
    },
    modal: {
      description: "Description",
      tips: {
        title: "SORTING TIPS",
        items: [
          "Clean containers thoroughly",
          "Remove non-recyclable lids",
          "Compact to save space"
        ]
      },
      buttons: {
        close: "Close",
        guide: "Guide"
      }
    },
    footer: {
      title: "Your Commitment Matters",
      description: "Every action you take for the environment has a real impact. Together, we can create lasting change."
    },
    navigation: {
      home: "Home",
      guide: "Guide",
      activities: "Activities",
      resources: "Resources",
      project: "Project",
      contact: "Contact"
    }
  }
};

// Hook de navigation SPA
const useNavigate = () => {
  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
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
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
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

// Barre de navigation améliorée
const NavigationBar = memo(() => {
  const { t, language } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('navigation.home'), href: '/', icon: Home },
    { label: t('navigation.guide'), href: '/guide', icon: BookOpen },
    { label: t('navigation.activities'), href: '/activities', icon: Calendar },
    { label: t('navigation.resources'), href: '/resources', icon: FileText },
    { label: t('navigation.project'), href: '/project', icon: Rocket },
    { label: t('navigation.contact'), href: '/contact', icon: Users },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'dark:bg-slate-900/90 bg-white/90 backdrop-blur-xl shadow-lg'
          : 'dark:bg-transparent bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              EcoFuture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group relative px-3 py-2 rounded-lg transition-colors hover:dark:bg-white/10 hover:bg-gray-100"
              >
                <span className="text-sm font-medium dark:text-gray-300 text-gray-700 group-hover:dark:text-white group-hover:text-gray-900">
                  {item.label}
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300 transform -translate-x-1/2" />
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <ThemeSwitch />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg dark:hover:bg-white/10 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 dark:text-gray-300 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden mt-4"
            >
              <div className="space-y-2 py-4 border-t dark:border-white/10 border-gray-200">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:dark:bg-white/10 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 dark:text-gray-400 text-gray-500" />
                    <span className="dark:text-gray-300 text-gray-700">{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
});

NavigationBar.displayName = 'NavigationBar';

// Composant de sélection de langue amélioré
const LanguageSwitch = memo(() => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl transition-colors
          dark:bg-slate-800/50 dark:hover:bg-slate-700/50
          bg-gray-100 hover:bg-gray-200
          border dark:border-white/10 border-gray-300
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4 dark:text-gray-300 text-gray-700" />
        <span className="text-sm font-medium dark:text-gray-300 text-gray-700">
          {languages.find(l => l.code === language)?.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 dark:text-gray-400 text-gray-500" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className={`
              dark:bg-slate-800/95 bg-white/95 backdrop-blur-xl
              border dark:border-white/20 border-gray-300
              p-2 space-y-1
            `}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as Language);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${language === lang.code 
                      ? 'dark:bg-white/10 bg-gray-100 dark:text-white text-gray-900' 
                      : 'dark:text-gray-300 text-gray-700 dark:hover:bg-white/5 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-left font-medium">{lang.label}</span>
                  {language === lang.code && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

LanguageSwitch.displayName = 'LanguageSwitch';

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
    onClick?.();
  }, [disabled, loading, onClick]);
  
  const sizeClasses: Record<string, string> = {
    sm: "px-5 py-2.5 text-sm",
    default: "px-7 py-3.5 text-base",
    lg: "px-9 py-4 text-lg",
  };
  
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
    relative overflow-hidden rounded-2xl font-bold
    transition-all duration-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    focus:outline-none focus:ring-4 dark:focus:ring-blue-500/30 focus:ring-blue-500/20
    ${fullWidth ? 'w-full' : ''}
    group ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${isHovered ? 'shadow-2xl scale-105' : 'shadow-xl'}
    ${isPressed ? 'scale-95 shadow-lg' : ''}
  `;
  
  const ButtonContent = (
    <>
      {glow && (
        <span className={`
          absolute -inset-2 rounded-2xl blur-xl transition-all duration-700
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          dark:bg-gradient-to-r dark:from-blue-500/30 dark:via-emerald-500/20 dark:to-cyan-500/30
          bg-gradient-to-r from-blue-400/20 via-emerald-400/15 to-cyan-400/20
        `} />
      )}
      
      {pulse && (
        <span className={`
          absolute -inset-2 rounded-2xl transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-50'}
          dark:bg-gradient-to-r dark:from-blue-500/40 dark:via-emerald-500/30 dark:to-cyan-500/40
          bg-gradient-to-r from-blue-400/30 via-emerald-400/20 to-cyan-400/30
        `} style={{ animation: 'pulse 3s ease-in-out infinite' }} />
      )}
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center dark:bg-black/20 bg-white/20 backdrop-blur-sm rounded-2xl">
          <span className="rounded-full h-8 w-8 border-t-3 border-b-3 dark:border-white border-blue-600 animate-spin"></span>
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
  
  if (href && !disabled && !loading) {
    return (
      <Link 
        to={href} 
        className={`inline-block ${fullWidth ? 'w-full' : ''}`}
        onClick={onClick}
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
  
  useEffect(() => {
    if (!scrollReveal || !widgetRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    );
    
    observer.observe(widgetRef.current);
    return () => observer.disconnect();
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
      {glow && (
        <div className={`
          absolute -inset-3 rounded-3xl transition-all duration-700
          ${isHovered ? 'opacity-100 blur-2xl' : 'opacity-0 blur-xl'}
          dark:bg-gradient-to-br dark:from-blue-500/25 dark:via-emerald-500/20 dark:to-cyan-500/25
          bg-gradient-to-br from-blue-400/15 via-emerald-400/10 to-cyan-400/15
        `} />
      )}
      
      <div className={`
        absolute inset-0 rounded-3xl shadow-xl transition-all duration-700
        ${isHovered ? 'shadow-2xl' : ''}
        dark:bg-gradient-to-br dark:from-slate-800/95 dark:via-slate-900/90 dark:to-slate-800/85
        bg-gradient-to-br from-white/95 via-gray-50/90 to-white/85
        border dark:border-white/10 border-gray-200
      `} />
      
      <div className={`absolute inset-0 rounded-3xl overflow-hidden`}>
        <div className={`
          absolute -inset-full transition-transform duration-1200
          ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          dark:bg-gradient-to-r dark:from-transparent dark:via-white/10 dark:to-transparent
          bg-gradient-to-r from-transparent via-blue-500/5 to-transparent
        `} />
      </div>
      
      <div className="relative z-10 h-full transform-gpu">
        {children}
      </div>
    </div>
  );
});

WidgetFlottant.displayName = 'WidgetFlottant';

// Composant Switch pour thème
const ThemeSwitch = memo(() => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-3 rounded-xl transition-colors
        dark:bg-slate-800/50 dark:hover:bg-slate-700/50
        bg-gray-100 hover:bg-gray-200
        border dark:border-white/10 border-gray-300
      `}
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

// Carte interactive améliorée
const CarteInteractive = memo(({ 
  icon: Icon,
  title,
  description,
  color = "dark:text-blue-600 text-blue-500",
  bg = "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-blue-500/10 bg-gradient-to-br from-blue-400/20 to-blue-400/10",
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
      { threshold: 0.05, rootMargin: '100px 0px' }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, [delay]);
  
  return (
    <div ref={cardRef} className="h-full">
      <WidgetFlottant 
        intensity={0.35}
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
                className={`relative w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4 shadow-lg transform-gpu`}
                whileHover={{ rotateY: 3, rotateX: 3, scale: 1.1 }}
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
                  ${isHovered ? 'from-blue-500 via-emerald-500 to-cyan-500' : 'dark:from-white dark:to-white/80 from-gray-900 to-gray-700'}
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
                <span className="dark:text-gray-300 text-gray-600">
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
}

// Modal optimisé sans barres de défilement
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
  const { t } = useTranslation();
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
            className="relative w-full max-w-2xl max-h-[85vh]"
          >
            <WidgetFlottant intensity={0.2} glow={true} minHeight="min-h-0">
              <Card className={`
                border overflow-hidden
                dark:border-white/20 dark:bg-slate-900/95
                border-gray-300 bg-white/95
                max-h-[85vh] overflow-y-auto
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              `}>
                <CardContent className="p-6">
                  {/* Header */}
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
                        <h3 className={`
                          text-2xl font-bold mb-1
                          dark:text-white text-gray-900
                        `}>
                          {title}
                        </h3>
                        <p className={`
                          text-sm
                          dark:text-gray-300 text-gray-600
                        `}>
                          {description}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.button
                      onClick={onClose}
                      className={`
                        p-2 rounded-xl transition-colors flex-shrink-0
                        dark:hover:bg-white/10 hover:bg-gray-100
                      `}
                      aria-label={t('modal.buttons.close')}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <X className={`
                        w-6 h-6
                        dark:text-white text-gray-700
                      `} />
                    </motion.button>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className={`
                        font-semibold text-lg mb-3
                        dark:text-blue-400 text-blue-600
                      `}>
                        {t('modal.description')}
                      </h4>
                      <p className={`
                        leading-relaxed
                        dark:text-gray-300 text-gray-700
                      `}>
                        {details}
                      </p>
                    </motion.div>
                    
                    <motion.div
                      className={`
                        p-4 rounded-xl border
                        dark:bg-blue-500/10 dark:border-blue-500/20
                        bg-blue-50 border-blue-200
                      `}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className={`
                        font-semibold text-sm mb-2 flex items-center gap-2
                        dark:text-blue-400 text-blue-600
                      `}>
                        <Sparkles className="w-4 h-4" />
                        {t('modal.tips.title')}
                      </h4>
                      <ul className="text-sm space-y-1">
                        {t('modal.tips.items', { returnObjects: true }).map((tip: string, index: number) => (
                          <li key={index} className={`
                            dark:text-gray-300 text-gray-700
                          `}>
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                  
                  {/* Actions */}
                  <motion.div 
                    className={`
                      flex gap-4 mt-8 pt-6 border-t
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
                      {t('modal.buttons.close')}
                    </BoutonAnime>
                    
                    <BoutonAnime
                      variant="gradient"
                      size="sm"
                      href="/guide"
                      className="flex-1"
                      glow={true}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {t('modal.buttons.guide')}
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

// Hook de traduction
const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string, options?: { returnObjects?: boolean }) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (options?.returnObjects) {
      return value || [];
    }
    
    return value || key;
  };
  
  return { t, language };
};

// Composant principal optimisé
export default function ProjectEco() {
  const [language, setLanguage] = useState<Language>('fr');
  const { theme } = useTheme();
  const { t } = useTranslation();
  
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
      color: "dark:text-amber-600 text-amber-500", 
      bg: "dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-amber-600/10 bg-gradient-to-br from-amber-400/20 to-amber-500/10", 
    },
    { 
      icon: Package, 
      color: "dark:text-blue-600 text-blue-500", 
      bg: "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-600/10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10", 
    },
    { 
      icon: Trash2, 
      color: "dark:text-gray-600 text-gray-500", 
      bg: "dark:bg-gradient-to-br dark:from-gray-500/20 dark:to-gray-600/10 bg-gradient-to-br from-gray-400/20 to-gray-500/10", 
    },
    { 
      icon: Apple, 
      color: "dark:text-green-600 text-green-500", 
      bg: "dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-600/10 bg-gradient-to-br from-green-400/20 to-emerald-500/10", 
    },
  ], []);
  
  const goals = useMemo(() => [
    {
      icon: Target,
      title: "Mission Éducative",
      description: "Sensibiliser aux enjeux environnementaux",
      color: "dark:text-blue-600 text-blue-500",
      bg: "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-600/10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10",
    },
    {
      icon: Users,
      title: "Engagement Communautaire",
      description: "Créer une communauté active et engagée",
      color: "dark:text-green-600 text-green-500",
      bg: "dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-600/10 bg-gradient-to-br from-green-400/20 to-emerald-500/10",
    },
    {
      icon: Recycle,
      title: "Innovation Technologique",
      description: "Développer des solutions innovantes",
      color: "dark:text-purple-600 text-purple-500",
      bg: "dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-pink-600/10 bg-gradient-to-br from-purple-400/20 to-pink-500/10",
    },
    {
      icon: Award,
      title: "Impact Mesurable",
      description: "Atteindre des résultats concrets",
      color: "dark:text-amber-600 text-amber-500",
      bg: "dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-600/10 bg-gradient-to-br from-amber-400/20 to-orange-500/10",
    }
  ], []);
  
  const actions = useMemo(() => [
    {
      icon: Calendar,
      title: t('navigation.activities'),
      description: "Activités et événements communautaires",
      color: "dark:text-blue-600 text-blue-500",
      bg: "dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-600/10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10",
      href: "/activities"
    },
    {
      icon: BookOpen,
      title: t('navigation.resources'),
      description: "Guides et documents pédagogiques",
      color: "dark:text-green-600 text-green-500",
      bg: "dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-600/10 bg-gradient-to-br from-green-400/20 to-emerald-500/10",
      href: "/resources"
    },
    {
      icon: Home,
      title: t('navigation.guide'),
      description: "Conseils pour un foyer écologique",
      color: "dark:text-purple-600 text-purple-500",
      bg: "dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-pink-600/10 bg-gradient-to-br from-purple-400/20 to-pink-500/10",
      href: "/guide"
    },
    {
      icon: Share2,
      title: t('navigation.project'),
      description: "Découvrez nos initiatives en cours",
      color: "dark:text-amber-600 text-amber-500",
      bg: "dark:bg-gradient-to-br dark:from-amber-500/20 dark:to-orange-600/10 bg-gradient-to-br from-amber-400/20 to-orange-500/10",
      href: "/project"
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
    }, 300);
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className="min-h-screen overflow-hidden">
        <NavigationBar />
        
        {/* Barre de progression de scroll */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-1 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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
              transition={{ type: "spring", damping: 30, stiffness: 100 }}
            />
          </div>
        </motion.div>
        
        <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 pt-20">
          {/* Section Héro */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center mb-16 md:mb-24"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className={`
                inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-8 
                backdrop-blur-xl shadow-lg border
                dark:bg-gradient-to-r dark:from-blue-600/30 dark:via-emerald-500/30 dark:to-cyan-500/30
                dark:border-white/20 dark:text-white
                bg-gradient-to-r from-blue-500/20 via-emerald-400/20 to-cyan-400/20
                border-gray-300 text-gray-800
              `}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('hero.initiative')}</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
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
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  {t('hero.title')}
                </motion.span>
              </h1>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className={`
                  dark:text-white text-gray-900
                `}>
                  {t('hero.subtitle')}
                </span>
              </motion.h2>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <p className={`
                text-xl leading-relaxed mb-6
                dark:text-gray-300 text-gray-700
              `}>
                {t('hero.description')}
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
                {t('hero.cta.discover')}
              </BoutonAnime>
              
              <BoutonAnime
                variant="outline"
                size="lg"
                icon={<BookOpen className="w-5 h-5" />}
                href="/guide"
              >
                {t('hero.cta.guide')}
              </BoutonAnime>
            </motion.div>
          </motion.section>
          
          {/* Section Objectifs */}
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
                <Target className={`
                  w-12 h-12 mx-auto mb-4
                  dark:text-blue-600 text-blue-500
                `} />
              </motion.div>
              <h2 className={`
                text-4xl md:text-5xl font-bold mb-4
                dark:text-white text-gray-900
              `}>
                {t('goals.title')}
              </h2>
              <p className={`
                text-lg
                dark:text-gray-300 text-gray-600
              `}>
                {t('goals.subtitle')}
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
          
          {/* Section Tri Sélectif */}
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
                <Recycle className={`
                  w-12 h-12 mx-auto mb-4
                  dark:text-emerald-600 text-emerald-500
                `} />
              </motion.div>
              <h2 className={`
                text-4xl md:text-5xl font-bold mb-4
                dark:text-white text-gray-900
              `}>
                {t('recycling.title')}
              </h2>
              <p className={`
                text-lg
                dark:text-gray-300 text-gray-600
              `}>
                {t('recycling.subtitle')}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {bins.map((bin, index) => {
                const binData = t(`recycling.bins.${index}`, { returnObjects: true });
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <CarteInteractive
                      icon={bin.icon}
                      title={binData.label}
                      description={binData.description}
                      color={bin.color}
                      bg={bin.bg}
                      onClick={() => handleBinClick(index)}
                      isActive={activeBinIndex === index}
                      delay={index * 100}
                    />
                  </motion.div>
                );
              })}
            </div>
            
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4 mt-8"
            >
              <div className="flex items-center gap-2">
                {bins.map((_, index) => {
                  const binData = t(`recycling.bins.${index}`, { returnObjects: true });
                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleBinClick(index)}
                      className={`
                        relative w-3 h-3 rounded-full transition-colors duration-300
                        ${index === activeBinIndex 
                          ? 'dark:bg-gradient-to-r dark:from-blue-600 dark:to-emerald-600 bg-gradient-to-r from-blue-500 to-emerald-500' 
                          : 'dark:bg-white/30 dark:hover:bg-white/50 bg-gray-400 hover:bg-gray-600'
                        }
                      `}
                      whileHover={{ scale: 1.5 }}
                      whileTap={{ scale: 0.8 }}
                      aria-label={`Voir ${binData.label}`}
                    >
                      {index === activeBinIndex && (
                        <motion.div
                          className="absolute -inset-2 rounded-full border-2"
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
                  );
                })}
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }}>
                <BoutonAnime
                  variant="outline"
                  size="sm"
                  icon={isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                >
                  {isAutoRotating ? t('recycling.pause') : t('recycling.resume')}
                </BoutonAnime>
              </motion.div>
            </motion.div>
          </motion.section>
          
          {/* Section Actions */}
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
                <Zap className={`
                  w-12 h-12 mx-auto mb-4
                  dark:text-yellow-500 text-yellow-500
                `} />
              </motion.div>
              <h2 className={`
                text-4xl md:text-5xl font-bold mb-4
                dark:text-white text-gray-900
              `}>
                {t('actions.title')}
              </h2>
              <p className={`
                text-lg
                dark:text-gray-300 text-gray-600
              `}>
                {t('actions.subtitle')}
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
                    onClick={() => window.history.pushState({}, '', action.href)}
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
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <WidgetFlottant intensity={0.2} glow={true} minHeight="min-h-0">
                <Card className={`
                  border overflow-hidden
                  dark:bg-gradient-to-br dark:from-blue-600/20 dark:via-emerald-600/20 dark:to-cyan-600/20
                  bg-gradient-to-br from-blue-500/15 via-emerald-500/15 to-cyan-500/15
                  dark:border-white/20 border-gray-300
                `}>
                  <CardContent className="p-8 text-center">
                    <Heart className={`
                      w-16 h-16 mx-auto mb-6 animate-pulse
                      dark:text-pink-500 text-pink-500
                    `} />
                    <h3 className={`
                      text-3xl font-bold mb-4
                      dark:text-white text-gray-900
                    `}>
                      {t('footer.title')}
                    </h3>
                    <p className={`
                      mb-6 max-w-2xl mx-auto
                      dark:text-gray-300 text-gray-700
                    `}>
                      {t('footer.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <BoutonAnime
                        variant="gradient"
                        size="lg"
                        icon={<Users className="w-5 h-5" />}
                        href="/contact"
                        glow={true}
                      >
                        {t('actions.cta.contact')}
                      </BoutonAnime>
                      
                      <BoutonAnime
                        variant="outline"
                        size="lg"
                        icon={<Calendar className="w-5 h-5" />}
                        href="/activities"
                      >
                        {t('actions.cta.activities')}
                      </BoutonAnime>
                    </div>
                  </CardContent>
                </Card>
              </WidgetFlottant>
            </motion.div>
          </motion.section>
        </div>
        
        {/* Modals */}
        {openModalIndex !== null && {
          const binData = t(`recycling.bins.${openModalIndex}`, { returnObjects: true });
          return (
            <BinModal
              isOpen={true}
              onClose={handleCloseModal}
              icon={bins[openModalIndex].icon}
              title={binData.label}
              description={binData.description}
              details={binData.details}
              color={bins[openModalIndex].color}
              bg={bins[openModalIndex].bg}
            />
          );
        }}
        
        {/* Styles globaux */}
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
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
      </div>
    </LanguageContext.Provider>
  );
}
