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
  Target as GoalIcon
} from "lucide-react";

// Optimisation des performances : Chargement différé de framer-motion
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
        console.warn('Framer Motion a échoué à charger, utilisation des animations CSS');
        setError(true);
      }
    };

    loadFramerMotion();
  }, []);

  return { ...motionComponents, error };
};

// Composant Bouton Animé Premium
const BoutonAnime = memo(({ 
  enfants, 
  variante = "default",
  taille = "default",
  className = "",
  onClick,
  icone,
  href,
  ...props 
}: {
  enfants: React.ReactNode;
  variante?: "default" | "outline" | "premium" | "gradient";
  taille?: "sm" | "default" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  icone?: React.ReactNode;
  href?: string;
}) => {
  const boutonRef = useRef<HTMLButtonElement>(null);
  const [estSurvole, setEstSurvole] = useState(false);
  const [ondulations, setOndulations] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  const handleMouseEnter = () => setEstSurvole(true);
  const handleMouseLeave = () => setEstSurvole(false);
  
  const handleClick = (e: React.MouseEvent) => {
    const bouton = boutonRef.current;
    if (!bouton) return;
    
    const rect = bouton.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setOndulations(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setOndulations(prev => prev.filter(ondulation => ondulation.id !== id));
    }, 800); // Animation plus longue pour plus de fluidité
    
    if (onClick) onClick();
  };
  
  const classesTaille = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl"
  };
  
  const classesVariante = {
    default: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/5",
    premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 shadow-lg hover:shadow-2xl",
    gradient: "bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 hover:from-primary/90 hover:via-emerald-700 hover:to-cyan-700 shadow-lg hover:shadow-2xl"
  };
  
  const ContenuBouton = (
    <>
      {/* Effets d'Ondulation */}
      {ondulations.map(ondulation => (
        <span
          key={ondulation.id}
          className="absolute rounded-full bg-white/20 animate-ondulation"
          style={{
            left: ondulation.x,
            top: ondulation.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Effet de Lueur */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Effet de Brillance */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute -inset-y-full -left-20 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-brillance" />
      </span>
      
      <span className="relative flex items-center justify-center gap-3">
        {icone && <span className="transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">{icone}</span>}
        {enfants}
        <ArrowRight className="w-5 h-5 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:scale-110" />
      </span>
    </>
  );
  
  const classesBouton = `
    relative overflow-hidden rounded-xl font-semibold
    transition-all duration-500 ease-out
    transform hover:-translate-y-1 active:translate-y-0
    active:scale-95
    group ${classesTaille[taille]} ${classesVariante[variante]} ${className}
  `;
  
  if (href) {
    return (
      <Link to={href}>
        <button
          ref={boutonRef}
          className={classesBouton}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          {...props}
        >
          {ContenuBouton}
        </button>
      </Link>
    );
  }
  
  return (
    <button
      ref={boutonRef}
      className={classesBouton}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {ContenuBouton}
    </button>
  );
});

BoutonAnime.displayName = 'BoutonAnime';

// Composant Widget Flottant
const WidgetFlottant = memo(({
  enfants,
  intensite = 1,
  className = ""
}: {
  enfants: React.ReactNode;
  intensite?: number;
  className?: string;
}) => {
  const [positionSouris, setPositionSouris] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!widgetRef.current) return;
      
      const rect = widgetRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setPositionSouris({ x: (x - 0.5) * 2, y: (y - 0.5) * 2 });
    };
    
    const handleMouseLeave = () => {
      setPositionSouris({ x: 0, y: 0 });
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
  
  const rotateX = positionSouris.y * 3 * intensite; // Réduit pour plus de douceur
  const rotateY = -positionSouris.x * 3 * intensite;
  const translateZ = Math.abs(positionSouris.x + positionSouris.y) * 8 * intensite;
  
  return (
    <div
      ref={widgetRef}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      }}
    >
      {/* Lumière Ambiance */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 via-transparent to-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Bordure Lumineuse */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
      
      {enfants}
    </div>
  );
});

WidgetFlottant.displayName = 'WidgetFlottant';

// Fond de Particules Premium
const FondParticulesPremium = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particulesRef = useRef<any[]>([]);
  
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
    
    // Classe Particule
    class Particule {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5; // Particules plus petites
        this.speedX = Math.random() * 0.3 - 0.15; // Mouvement plus lent
        this.speedY = Math.random() * 0.3 - 0.15;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 200 + 55)}, 255, ${Math.random() * 0.2 + 0.05})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Rebond sur les bords
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Dessiner les connexions
        particulesRef.current.forEach(particule => {
          const dx = this.x - particule.x;
          const dy = this.y - particule.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) { // Distance réduite
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 * (1 - distance/80)})`;
            ctx.lineWidth = 0.3;
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particule.x, particule.y);
            ctx.stroke();
          }
        });
      }
    }
    
    // Créer des particules
    const init = () => {
      particulesRef.current = [];
      const nombreParticules = Math.min(Math.floor((canvas.width * canvas.height) / 20000), 80); // Moins de particules
      
      for (let i = 0; i < nombreParticules; i++) {
        particulesRef.current.push(new Particule());
      }
    };
    
    init();
    
    // Boucle d'animation
    const animer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner le fond dégradé
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(30, 41, 59, 0.05)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Mettre à jour et dessiner les particules
      particulesRef.current.forEach(particule => {
        particule.update();
        particule.draw();
      });
      
      animationRef.current = requestAnimationFrame(animer);
    };
    
    animer();
    
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
      
      {/* Superpositions de dégradés */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-br from-primary/3 via-transparent to-emerald-500/3" />
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none -z-10" />
      
      {/* Orbes flottants */}
      <div className="fixed top-1/4 left-10 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-flottement-lent pointer-events-none -z-10" />
      <div className="fixed bottom-1/3 right-10 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-full blur-3xl animate-flottement-lent delay-1000 pointer-events-none -z-10" />
    </>
  );
});

FondParticulesPremium.displayName = 'FondParticulesPremium';

// Composant principal
export default function Project() {
  const { t, language } = useLanguage();
  const { motion, AnimatePresence, error: framerMotionError } = useLazyFramerMotion();
  
  // Gestion d'état
  const [indexPoubelleActive, setIndexPoubelleActive] = useState(0);
  const [rotationAuto, setRotationAuto] = useState(true);
  const intervalleRotation = useRef<NodeJS.Timeout>();
  const monteRef = useRef(true);
  
  // Données mémoïsées
  const poubelles = useMemo(() => [
    { 
      icone: FileText, 
      couleur: "text-amber-600", 
      bg: "bg-gradient-to-br from-amber-500/20 to-amber-600/10", 
      bordure: "border-amber-400/30", 
      label: "Papier & Carton",
      description: "Journaux, magazines, cartons, emballages papier",
      objectif: "Réduire la déforestation de 30%"
    },
    { 
      icone: Package, 
      couleur: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10", 
      bordure: "border-blue-400/30", 
      label: "Plastique",
      description: "Bouteilles, emballages, films plastiques recyclables",
      objectif: "Éliminer 50% des plastiques à usage unique"
    },
    { 
      icone: Trash2, 
      couleur: "text-gray-600", 
      bg: "bg-gradient-to-br from-gray-500/20 to-gray-600/10", 
      bordure: "border-gray-400/30", 
      label: "Métal",
      description: "Cannettes, boîtes de conserve, produits métalliques",
      objectif: "Recycler 90% des métaux collectés"
    },
    { 
      icone: Apple, 
      couleur: "text-green-600", 
      bg: "bg-gradient-to-br from-green-500/20 to-emerald-600/10", 
      bordure: "border-green-400/30", 
      label: "Organique",
      description: "Déchets alimentaires, résidus végétaux, compostables",
      objectif: "Produire 100 tonnes de compost annuel"
    },
  ], []);
  
  const objectifs = useMemo(() => [
    {
      icone: Target,
      titre: "Sensibilisation Environnementale",
      description: "Éduquer la communauté sur l'importance du tri sélectif et du recyclage",
      couleur: "from-blue-500/20 to-cyan-500/20",
      details: [
        "Ateliers éducatifs mensuels",
        "Campagnes de sensibilisation",
        "Ressources pédagogiques"
      ]
    },
    {
      icone: Users,
      titre: "Engagement Communautaire",
      description: "Impliquer tous les membres de la communauté dans notre mission écologique",
      couleur: "from-green-500/20 to-emerald-500/20",
      details: [
        "Programmes de bénévolat",
        "Événements communautaires",
        "Partenariats locaux"
      ]
    },
    {
      icone: Recycle,
      titre: "Réduction des Déchets",
      description: "Diminuer significativement notre empreinte écologique collective",
      couleur: "from-purple-500/20 to-pink-500/20",
      details: [
        "Objectif: -60% de déchets",
        "Compostage systématique",
        "Valorisation énergétique"
      ]
    },
    {
      icone: Award,
      titre: "Certification Écologique",
      description: "Obtenir la certification environnementale pour notre communauté",
      couleur: "from-amber-500/20 to-orange-500/20",
      details: [
        "Normes internationales",
        "Audits réguliers",
        "Amélioration continue"
      ]
    }
  ], []);
  
  // Rotation automatique
  useEffect(() => {
    monteRef.current = true;
    
    const faireTourner = () => {
      if (monteRef.current && rotationAuto) {
        setIndexPoubelleActive(prev => (prev + 1) % poubelles.length);
      }
    };
    
    if (intervalleRotation.current) {
      clearInterval(intervalleRotation.current);
    }
    
    intervalleRotation.current = setInterval(faireTourner, 4000); // Rotation plus lente
    
    return () => {
      monteRef.current = false;
      if (intervalleRotation.current) {
        clearInterval(intervalleRotation.current);
      }
    };
  }, [rotationAuto, poubelles.length]);
  
  const gererInteractionPoubelle = useCallback((index: number) => {
    setIndexPoubelleActive(index);
    setRotationAuto(false);
    
    setTimeout(() => {
      if (monteRef.current) {
        setRotationAuto(true);
      }
    }, 10000);
  }, []);
  
  // Utiliser les composants motion
  const MotionDiv = motion?.div || 'div';
  const MotionSection = motion?.section || 'section';
  
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
      
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-gradient-to-r from-primary via-emerald-600 to-cyan-600 shadow-lg transition-all duration-300 ease-out" 
             style={{ width: '0%' }} />
      </div>
      
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
                            animate-degrade bg-300% leading-tight">
                Projet Écologique
              </span>
            </h1>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light">
              Rejoignez notre mouvement pour un avenir plus vert. Ensemble, transformons 
              nos habitudes et protégeons notre planète pour les générations futures.
            </p>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <BoutonAnime
              variante="gradient"
              taille="xl"
              icone={<Rocket className="w-6 h-6" />}
              href="/guide"
            >
              Découvrir le Projet
            </BoutonAnime>
            
            <BoutonAnime
              variante="outline"
              taille="xl"
              icone={<BookOpen className="w-6 h-6" />}
              href="/ressources"
            >
              Ressources Éducatives
            </BoutonAnime>
          </MotionDiv>
        </MotionSection>
        
        {/* Section Objectifs */}
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
              Une vision claire pour un impact environnemental significatif
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {objectifs.map((objectif, index) => (
              <MotionDiv
                key={objectif.titre}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
                className="h-full"
              >
                <WidgetFlottant intensite={0.8}>
                  <Card className={`h-full border-2 border-white/20 overflow-hidden 
                                 backdrop-blur-sm bg-gradient-to-br ${objectif.couleur} hover:bg-white/5 transition-all duration-500`}>
                    <CardContent className="p-8 relative">
                      <div className="flex items-start gap-6 mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${objectif.couleur} 
                                      flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110`}>
                          <objectif.icone className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-2xl mb-3 bg-gradient-to-r from-foreground to-foreground/80 
                                       bg-clip-text text-transparent">
                            {objectif.titre}
                          </h3>
                          <p className="text-foreground/80">
                            {objectif.description}
                          </p>
                        </div>
                      </div>
                      
                      <ul className="space-y-3 pt-6 border-t border-white/10">
                        {objectif.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-3 text-foreground/70">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{detail}</span>
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
        
        {/* Section Tri Sélectif */}
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
            <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
              Apprenez à trier correctement vos déchets pour maximiser le recyclage
            </p>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {poubelles.map((poubelle, index) => (
              <MotionDiv
                key={poubelle.label}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 80 }}
                className="h-full"
              >
                <WidgetFlottant intensite={1}>
                  <div
                    onClick={() => gererInteractionPoubelle(index)}
                    className={`cursor-pointer h-full transition-all duration-500 ${indexPoubelleActive === index ? 'transform -translate-y-4' : ''}`}
                  >
                    <Card className={`h-full border-2 ${poubelle.bordure} overflow-hidden 
                                   backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-500`}>
                      <CardContent className="p-8 text-center relative">
                        {/* Indicateur d'activité */}
                        {indexPoubelleActive === index && (
                          <div className="absolute top-4 right-4">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                          </div>
                        )}
                        
                        <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl ${poubelle.bg} 
                                      flex items-center justify-center mx-auto mb-6
                                      transition-all duration-500 group-hover:scale-105
                                      ${indexPoubelleActive === index ? 'scale-105 ring-4 ring-white/30' : ''}`}>
                          <poubelle.icone className={`w-14 h-14 ${poubelle.couleur} transition-all duration-500 
                                            group-hover:rotate-6`} />
                        </div>
                        
                        <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-foreground to-foreground/80 
                                     bg-clip-text text-transparent">
                          {poubelle.label}
                        </h3>
                        
                        <p className="text-foreground/70 mb-6">
                          {poubelle.description}
                        </p>
                        
                        {/* Objectif */}
                        <div className="pt-6 border-t border-white/10">
                          <div className="text-sm text-foreground/60 mb-2">Objectif</div>
                          <div className="text-lg font-semibold text-emerald-500">
                            {poubelle.objectif}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </WidgetFlottant>
              </MotionDiv>
            ))}
          </div>
          
          {/* Indicateurs de navigation */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="flex justify-center gap-3 mt-12"
          >
            {poubelles.map((_, index) => (
              <button
                key={index}
                onClick={() => gererInteractionPoubelle(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                  index === indexPoubelleActive 
                    ? 'w-8 bg-gradient-to-r from-primary to-emerald-600' 
                    : 'bg-muted hover:bg-primary/50'
                }`}
                aria-label={`Aller à ${poubelles[index].label}`}
              />
            ))}
          </MotionDiv>
        </MotionSection>
        
        {/* Section Appel à l'Action */}
        <MotionSection
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <WidgetFlottant intensite={1.2}>
            <Card className="border-2 border-white/20 overflow-hidden backdrop-blur-xl 
                           bg-gradient-to-br from-primary/10 via-emerald-500/10 to-cyan-500/10">
              <CardContent className="p-12 md:p-16 text-center relative overflow-hidden">
                {/* Éléments de fond animés */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-primary/15 to-emerald-500/15 
                              rounded-full blur-3xl animate-pulse-lent" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 
                              rounded-full blur-3xl animate-pulse-lent delay-1000" />
                
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
                    Rejoignez la Révolution Verte
                  </span>
                </h2>
                
                <p className="text-xl text-foreground/90 leading-relaxed mb-10 max-w-2xl mx-auto relative z-10">
                  Ensemble, nous pouvons créer un impact significatif. Chaque geste compte, 
                  chaque action contribue à préserver notre planète pour les générations futures.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                  <BoutonAnime
                    variante="gradient"
                    taille="lg"
                    icone={<Leaf className="w-6 h-6" />}
                    href="/rejoindre"
                  >
                    Rejoindre Maintenant
                  </BoutonAnime>
                  
                  <BoutonAnime
                    variante="outline"
                    taille="lg"
                    icone={<Compass className="w-6 h-6" />}
                    href="/decouvrir"
                  >
                    En Savoir Plus
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
        <WidgetFlottant intensite={1.5}>
          <BoutonAnime
            variante="gradient"
            taille="lg"
            icone={<ChevronDown className="w-5 h-5" />}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="rounded-full w-16 h-16 p-0"
            aria-label="Retour en haut"
          />
        </WidgetFlottant>
      </MotionDiv>
      
      {/* Styles globaux pour les animations */}
      <style jsx>{`
        @keyframes degrade {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes flottement-lent {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(1deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(15px) rotate(-1deg); }
        }
        
        @keyframes ondulation {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        
        @keyframes brillance {
          0% { transform: translateX(-100%) rotate(30deg); }
          100% { transform: translateX(300%) rotate(30deg); }
        }
        
        @keyframes pulse-lent {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        .animate-degrade {
          animation: degrade 4s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-flottement-lent {
          animation: flottement-lent 25s ease-in-out infinite;
        }
        
        .animate-ondulation {
          animation: ondulation 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-brillance {
          animation: brillance 2s ease-in-out;
        }
        
        .animate-pulse-lent {
          animation: pulse-lent 6s ease-in-out infinite;
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
        }
        
        /* Réduction du mouvement */
        @media (prefers-reduced-motion: reduce) {
          .animate-degrade,
          .animate-flottement-lent,
          .animate-ondulation,
          .animate-brillance,
          .animate-pulse-lent {
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
      `}</style>
    </div>
  );
}
