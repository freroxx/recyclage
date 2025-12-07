import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { 
  ExternalLink, 
  Sparkles, 
  Leaf, 
  X,
  Maximize2,
  Download,
  Globe,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Send,
  Upload
} from "lucide-react";

interface Poster {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  language: "fr" | "en";
  type: "image" | "embed";
  embedUrl?: string;
  aspectRatio?: number;
}

interface LightboxState {
  isOpen: boolean;
  poster: Poster | null;
  currentIndex: number;
}

// Canva embed component for previews
const CanvaEmbedPreview = ({ embedUrl, title }: { embedUrl: string; title: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);
    const iframe = iframeRef.current;
    
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
          <div className="w-8 h-8 border-2 border-emerald-500/30 rounded-full animate-spin">
            <div className="w-full h-full border-2 border-transparent border-t-emerald-500 rounded-full"></div>
          </div>
        </div>
      )}
      <div className="relative w-full" style={{ paddingTop: '141.4286%' }}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
          title={title}
          allowFullScreen
          allow="fullscreen"
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

// Full Canva embed for lightbox
const CanvaEmbedLightbox = ({ embedUrl, title }: { embedUrl: string; title: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);
    const iframe = iframeRef.current;
    
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-emerald-900/10 to-teal-900/10 rounded-lg overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-emerald-500/20 rounded-full animate-spin mx-auto mb-3">
              <div className="w-full h-full border-3 border-transparent border-t-emerald-500 rounded-full"></div>
            </div>
            <p className="text-sm text-emerald-400 animate-pulse">Loading interactive poster...</p>
          </div>
        </div>
      )}
      
      <div className="relative w-full h-full">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="w-full h-full border-0"
          title={title}
          allowFullScreen
          allow="fullscreen"
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default function PostersGallery() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    poster: null,
    currentIndex: 0
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hoveredPoster, setHoveredPoster] = useState<number | null>(null);
  
  const lightboxRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollYRef = useRef(0);

  // Initialize posters data with Canva embeds for preview
  const initializePosters = useCallback((): Poster[] => {
    return [
      // Yahia Ikni - Canva Embeds (with preview embeds)
      {
        id: 1,
        imageUrl: "https://i.ibb.co/h7tSmRD/yahia-poster2.jpg",
        title: "ALLONS RECYCLER",
        description: "Poster minimaliste et moderne pour promouvoir le recyclage quotidien avec un design épuré et des couleurs vibrantes qui capturent l'attention.",
        author: "Yahia Ikni",
        language: "fr",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
        aspectRatio: 141.4286
      },
      {
        id: 2,
        imageUrl: "https://i.ibb.co/nb0gWJv/yahia-poster1.jpg",
        title: "Green Illustrative Save the Earth With 3R Poster",
        description: "Illustration éducative vibrante présentant les principes des 3R (Réduire, Réutiliser, Recycler) avec des graphiques accrocheurs et un message environnemental fort.",
        author: "Yahia Ikni",
        language: "fr",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
        aspectRatio: 141.4286
      },
      // Salsabile - French Posters
      {
        id: 3,
        imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
        title: "École Écoresponsable",
        description: "Poster éducatif conçu pour sensibiliser les élèves aux gestes écologiques à adopter à l'école, avec des illustrations engageantes et des messages clairs.",
        author: "Salsabile",
        language: "fr",
        type: "image",
        aspectRatio: 140
      },
      {
        id: 4,
        imageUrl: "https://i.ibb.co/FLg4Bk0/fr1.jpg",
        title: "Guide du Recyclage Quotidien",
        description: "Infographie détaillée présentant des étapes pratiques pour intégrer facilement le recyclage dans votre routine quotidienne, avec des icônes intuitives.",
        author: "Salsabile",
        language: "fr",
        type: "image",
        aspectRatio: 140
      },
      // Salsabile - English Posters
      {
        id: 5,
        imageUrl: "https://i.ibb.co/TBjKSzD/english1.jpg",
        title: "Earth Day Conversation Starters",
        description: "Collection de questions engageantes et de sujets de discussion pour stimuler des conversations significatives sur l'environnement et la durabilité.",
        author: "Salsabile",
        language: "en",
        type: "image",
        aspectRatio: 140
      },
      {
        id: 6,
        imageUrl: "https://i.ibb.co/cKY4Rj0/english2.jpg",
        title: "Recycling Mascot Adventures",
        description: "Poster ludique et éducatif mettant en scène une mascotte de recyclage qui enseigne aux enfants l'importance de la durabilité à travers des aventures amusantes.",
        author: "Salsabile",
        language: "en",
        type: "image",
        aspectRatio: 140
      },
      {
        id: 7,
        imageUrl: "https://i.ibb.co/1tyxTwJ/english3.jpg",
        title: "Simple Zero Waste Lifestyle",
        description: "Guide visuel étape par étape pour adopter un mode de vie zéro déchet avec des conseils pratiques, des alternatives simples et des astuces faciles à suivre.",
        author: "Salsabile",
        language: "en",
        type: "image",
        aspectRatio: 140
      }
    ];
  }, []);

  // Load posters on mount
  useEffect(() => {
    setMounted(true);
    
    const loadPosters = async () => {
      try {
        const postersData = initializePosters();
        setPosters(postersData);
        
        // Preload images
        await Promise.allSettled(
          postersData.map(poster => 
            new Promise<void>((resolve) => {
              if (poster.type === 'image') {
                const img = new Image();
                img.src = poster.imageUrl;
                img.onload = () => resolve();
                img.onerror = () => resolve();
              } else {
                resolve();
              }
            })
          )
        );
        
      } catch (error) {
        console.error('Error loading posters:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    loadPosters();
  }, [initializePosters]);

  // Intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    const cards = document.querySelectorAll('.poster-card');
    cards.forEach(card => observerRef.current?.observe(card));

    return () => {
      cards.forEach(card => observerRef.current?.unobserve(card));
      observerRef.current?.disconnect();
    };
  }, [posters]);

  // Open lightbox with animation
  const openLightbox = useCallback((poster: Poster, index: number) => {
    scrollYRef.current = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    setLightbox({ isOpen: true, poster, currentIndex: index });
    
    // Trigger opening animation
    setTimeout(() => {
      const lightbox = document.querySelector('.lightbox-container');
      if (lightbox) {
        lightbox.classList.add('lightbox-open');
      }
    }, 10);
  }, []);

  // Close lightbox with animation
  const closeLightbox = useCallback(() => {
    setIsClosing(true);
    
    setTimeout(() => {
      setLightbox({ isOpen: false, poster: null, currentIndex: 0 });
      setIsClosing(false);
      setIsFullscreen(false);
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      
      window.scrollTo(0, scrollYRef.current);
    }, 300);
  }, []);

  // Navigate between posters in lightbox
  const navigatePoster = useCallback((direction: 'prev' | 'next') => {
    setLightbox(prev => {
      const newIndex = direction === 'prev' 
        ? (prev.currentIndex - 1 + posters.length) % posters.length
        : (prev.currentIndex + 1) % posters.length;
      
      return {
        ...prev,
        poster: posters[newIndex],
        currentIndex: newIndex
      };
    });
  }, [posters]);

  // Toggle fullscreen with animation
  const toggleFullscreen = useCallback(async () => {
    if (!lightboxRef.current) return;
    
    try {
      if (!isFullscreen) {
        await lightboxRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [isFullscreen]);

  // Event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigatePoster('prev');
          break;
        case 'ArrowRight':
          navigatePoster('next');
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [lightbox.isOpen, closeLightbox, navigatePoster, toggleFullscreen]);

  // Open in new tab
  const openInNewTab = useCallback((poster: Poster) => {
    if (poster.type === 'embed' && poster.embedUrl) {
      window.open(poster.embedUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(poster.imageUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Download image
  const downloadImage = useCallback((poster: Poster) => {
    if (poster.type === 'image') {
      const link = document.createElement('a');
      link.href = poster.imageUrl;
      link.download = `${poster.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (poster.embedUrl) {
      window.open(poster.embedUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Calculate aspect ratio for container
  const getAspectRatio = useCallback((poster: Poster) => {
    return poster.aspectRatio || (poster.type === 'embed' ? 141.4286 : 140);
  }, []);

  // Handle submit art button
  const handleSubmitArt = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1a15]">
        <div className="relative">
          <div className="w-16 h-16 border-3 border-emerald-500/20 rounded-full animate-spin">
            <div className="absolute inset-0 border-3 border-transparent border-t-emerald-500 rounded-full animate-ping animation-delay-300"></div>
          </div>
          <Leaf className="absolute -top-2 -right-2 w-5 h-5 text-emerald-500 animate-bounce animation-delay-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1a15]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1a15] via-[#0f1a15] to-emerald-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/5 rounded-full blur-3xl animate-float-particle animation-delay-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 md:w-[500px] md:h-[500px] bg-teal-600/5 rounded-full blur-3xl animate-float-particle animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-900/10 to-teal-900/10 rounded-full blur-3xl animate-pulse-gentle"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
            <div className="inline-block mb-8 relative">
              <div className="relative">
                <Sparkles className="hidden md:block absolute -left-10 top-1/2 w-6 h-6 text-emerald-400 animate-float-slow" />
                <Leaf className="hidden md:block absolute -right-10 top-1/2 w-6 h-6 text-emerald-300 animate-float-slow animation-delay-1000" />
                
                <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold mb-6 
                               bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 
                               bg-clip-text text-transparent tracking-tight">
                  Eco Gallery
                </h1>
                
                <div className="relative h-1.5 overflow-hidden max-w-2xl mx-auto rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  animate-shimmer rounded-full"></div>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-emerald-200/80 max-w-2xl mx-auto leading-relaxed font-light mb-10">
              Discover inspiring environmental posters created by our creative community
            </p>
            
            <button
              onClick={handleSubmitArt}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 
                       text-white font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/30
                       transition-all duration-500 transform hover:-translate-y-1 hover:scale-105
                       animate-pulse-gentle"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Submit Your Art
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-700 
                             rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 
                             rounded-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            </button>
          </div>

          {/* Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {posters.map((poster, index) => (
              <div
                key={poster.id}
                className="poster-card transform transition-all duration-700 hover:-translate-y-2 opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredPoster(poster.id)}
                onMouseLeave={() => setHoveredPoster(null)}
              >
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => openLightbox(poster, index)}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl blur-xl 
                                opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"></div>
                  
                  {/* Card Container */}
                  <Card className="relative overflow-hidden border border-emerald-900/30 bg-emerald-950/20 backdrop-blur-sm 
                                 group-hover:border-emerald-500/40 group-hover:bg-emerald-950/30
                                 transition-all duration-500 h-full">
                    
                    {/* Poster Container - Adaptive Aspect Ratio */}
                    <div 
                      className="relative w-full overflow-hidden bg-gradient-to-br from-emerald-950/40 to-teal-950/40"
                      style={{ paddingTop: `${getAspectRatio(poster)}%` }}
                    >
                      {poster.type === 'embed' && poster.embedUrl ? (
                        // Canva Embed Preview
                        <div className="absolute inset-0">
                          <CanvaEmbedPreview 
                            embedUrl={poster.embedUrl}
                            title={poster.title}
                          />
                        </div>
                      ) : (
                        // Image Preview
                        <img
                          src={poster.imageUrl}
                          alt={poster.title}
                          className="absolute inset-0 w-full h-full object-cover 
                                   group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Interactive Badge */}
                      {poster.type === 'embed' && (
                        <div className="absolute top-4 right-4 transform translate-x-4 opacity-0 
                                      group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md 
                                         bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white 
                                         flex items-center gap-1.5 shadow-lg shadow-purple-500/20">
                            <Globe className="w-3 h-3" />
                            Interactive
                          </span>
                        </div>
                      )}
                      
                      {/* Author Badge */}
                      <div className="absolute top-4 left-4 transform -translate-x-4 opacity-0 
                                    group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md 
                                       bg-gradient-to-r from-emerald-900/90 to-teal-900/90 text-emerald-200
                                       shadow-lg shadow-emerald-500/10">
                          {poster.author}
                        </span>
                      </div>
                      
                      {/* Language Badge */}
                      <div className="absolute bottom-4 right-4 transform translate-y-4 opacity-0 
                                    group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md 
                                       ${poster.language === 'fr' 
                                         ? 'bg-gradient-to-r from-teal-600/90 to-teal-500/90 text-white' 
                                         : 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white'}
                                       shadow-lg shadow-${poster.language === 'fr' ? 'teal' : 'emerald'}-500/20`}>
                          {poster.language.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Hover Expand Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                                    transition-all duration-500">
                        <div className="bg-emerald-950/90 backdrop-blur-sm rounded-full p-4 
                                      transform scale-0 group-hover:scale-100 transition-transform duration-500 
                                      shadow-2xl shadow-emerald-500/20">
                          <Maximize2 className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                      </div>
                      
                      {/* Title on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 
                                    transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="font-semibold text-white text-sm line-clamp-1 bg-gradient-to-r from-black/60 to-transparent p-2 rounded">
                          {poster.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Type Indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                      {poster.type === 'embed' ? (
                        <div className="relative">
                          <Globe className="w-4 h-4 text-purple-400 group-hover:animate-spin-slow transition-all duration-300" />
                          <div className="absolute inset-0 w-4 h-4 border-2 border-purple-400/30 rounded-full animate-ping"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <ImageIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                          <div className="absolute inset-0 w-4 h-4 border-2 border-emerald-400/30 rounded-full animate-ping animation-delay-300"></div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-24 text-center animate-fade-in-up animation-delay-1000">
            <div className="inline-block transform hover:-translate-y-1 transition-transform duration-500">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-teal-950/20 
                            backdrop-blur-sm border border-emerald-900/30">
                <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-4 animate-pulse-gentle" />
                <p className="text-xl text-emerald-200/80 max-w-md mb-6">
                  Want to see your environmental artwork featured here?
                </p>
                <button
                  onClick={handleSubmitArt}
                  className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 
                           text-white font-semibold hover:shadow-2xl hover:shadow-emerald-500/30
                           transition-all duration-500 transform hover:-translate-y-0.5 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Contact Us to Submit
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 
                                 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal - 9:16 Vertical */}
      {lightbox.isOpen && lightbox.poster && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm 
                       ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
          <div 
            ref={lightboxRef}
            className="lightbox-container relative w-full max-w-sm md:max-w-md h-[90vh] bg-[#0f1a15] rounded-2xl 
                     overflow-hidden flex flex-col border border-emerald-900/50 shadow-2xl shadow-black/50
                     transform scale-95 opacity-0 transition-all duration-300"
            style={{ 
              maxHeight: 'calc(90vh)',
              aspectRatio: '9/16'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald-900/30 bg-[#0f1a15]/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${lightbox.poster.language === 'fr' ? 'bg-teal-500' : 'bg-emerald-500'}`} />
                  <span className="font-semibold text-white truncate text-sm">
                    {lightbox.poster.title}
                  </span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-emerald-900/50 text-emerald-300">
                  {lightbox.poster.language.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => downloadImage(lightbox.poster!)}
                  className="group p-2 rounded-lg hover:bg-emerald-900/30 transition-all duration-300 
                           hover:scale-110 active:scale-95"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 
                                    group-hover:animate-bounce" />
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => openInNewTab(lightbox.poster!)}
                  className="group p-2 rounded-lg hover:bg-emerald-900/30 transition-all duration-300 
                           hover:scale-110 active:scale-95"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 
                                        group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="group p-2 rounded-lg hover:bg-emerald-900/30 transition-all duration-300 
                           hover:scale-110 active:scale-95"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  <Maximize2 className={`w-4 h-4 text-emerald-400 group-hover:text-emerald-300 
                                       transition-transform duration-300 ${isFullscreen ? 'rotate-45' : ''}`} />
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={closeLightbox}
                  className="group p-2 rounded-lg hover:bg-red-900/30 transition-all duration-300 
                           hover:scale-110 active:scale-95"
                  title="Close"
                >
                  <X className="w-4 h-4 text-red-400 group-hover:text-red-300 
                              group-hover:rotate-90 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {posters.length > 1 && (
              <>
                <button
                  onClick={() => navigatePoster('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10
                           p-3 rounded-full bg-[#0f1a15]/80 backdrop-blur-sm border border-emerald-900/50
                           hover:bg-emerald-900/80 transition-all duration-300 opacity-0 hover:opacity-100
                           group-hover:opacity-100 hover:scale-110 active:scale-95"
                  style={{ animationDelay: '200ms' }}
                >
                  <ChevronLeft className="w-5 h-5 text-emerald-400" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent 
                                rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={() => navigatePoster('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10
                           p-3 rounded-full bg-[#0f1a15]/80 backdrop-blur-sm border border-emerald-900/50
                           hover:bg-emerald-900/80 transition-all duration-300 opacity-0 hover:opacity-100
                           group-hover:opacity-100 hover:scale-110 active:scale-95"
                  style={{ animationDelay: '400ms' }}
                >
                  <ChevronRight className="w-5 h-5 text-emerald-400" />
                  <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/10 to-transparent 
                                rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            )}

            {/* Content - Adaptive 9:16 */}
            <div className="flex-1 overflow-hidden p-4">
              <div className="h-full w-full flex items-center justify-center">
                {lightbox.poster.type === 'embed' && lightbox.poster.embedUrl ? (
                  <div className="w-full h-full">
                    <CanvaEmbedLightbox 
                      embedUrl={lightbox.poster.embedUrl}
                      title={lightbox.poster.title}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={lightbox.poster.imageUrl}
                      alt={lightbox.poster.title}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50
                               animate-fade-in"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-emerald-900/30 bg-[#0f1a15]/90 backdrop-blur-sm">
              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-300">
                    {lightbox.poster.author}
                  </span>
                  <span className="text-xs text-emerald-500">•</span>
                  <span className="text-xs text-emerald-500">
                    {lightbox.currentIndex + 1} / {posters.length}
                  </span>
                </div>
                <p className="text-sm text-emerald-200/80 line-clamp-2">
                  {lightbox.poster.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {lightbox.poster.type === 'embed' ? (
                    <div className="relative">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <div className="absolute inset-0 w-4 h-4 border border-purple-400/30 rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <ImageIcon className="w-4 h-4 text-emerald-400" />
                      <div className="absolute inset-0 w-4 h-4 border border-emerald-400/30 rounded-full animate-ping"></div>
                    </div>
                  )}
                  <span className="text-xs text-emerald-500">
                    {lightbox.poster.type === 'embed' ? 'Interactive Poster' : 'Image Poster'}
                  </span>
                </div>
                
                {posters.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigatePoster('prev')}
                      className="group p-1.5 rounded-lg hover:bg-emerald-900/50 transition-all duration-300 
                               hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-3 h-3 text-emerald-400 group-hover:text-emerald-300" />
                    </button>
                    <span className="text-xs text-emerald-500 px-2">
                      {lightbox.currentIndex + 1} / {posters.length}
                    </span>
                    <button
                      onClick={() => navigatePoster('next')}
                      className="group p-1.5 rounded-lg hover:bg-emerald-900/50 transition-all duration-300 
                               hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:text-emerald-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 15s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .lightbox-open {
          transform: scale(1);
          opacity: 1;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animation-delay-0 { animation-delay: 0ms !important; }
        .animation-delay-100 { animation-delay: 100ms !important; }
        .animation-delay-200 { animation-delay: 200ms !important; }
        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-500 { animation-delay: 500ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0f1a15;
        }

        ::-webkit-scrollbar-thumb {
          background: #047857;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}
