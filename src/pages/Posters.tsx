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
  ChevronRight
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
}

interface LightboxState {
  isOpen: boolean;
  poster: Poster | null;
  currentIndex: number;
}

// Fallback image for errors
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80";

// Canva embed component
const CanvaEmbed = ({ embedUrl, title }: { embedUrl: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    const iframe = iframeRef.current;
    
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-emerald-50/20 to-teal-50/20 dark:from-gray-900 dark:to-emerald-950/20 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-emerald-500/20 rounded-full animate-spin mx-auto mb-3">
              <div className="w-full h-full border-3 border-transparent border-t-emerald-500 rounded-full"></div>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Loading interactive poster...</p>
          </div>
        </div>
      )}
      
      <div className="relative w-full" style={{ paddingTop: '141.4286%' }}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full border-0"
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
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    poster: null,
    currentIndex: 0
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Initialize posters data
  const initializePosters = useCallback((): Poster[] => {
    return [
      // Yahia Ikni - Canva Embeds (French)
      {
        id: 1,
        imageUrl: "https://i.ibb.co/h7tSmRD/yahia-poster2.jpg",
        title: "ALLONS RECYCLER",
        description: "Poster minimaliste et moderne pour promouvoir le recyclage quotidien avec un design épuré et des couleurs vibrantes.",
        author: "Yahia Ikni",
        language: "fr",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed"
      },
      {
        id: 2,
        imageUrl: "https://i.ibb.co/nb0gWJv/yahia-poster1.jpg",
        title: "Green Illustrative Save the Earth With 3R Poster",
        description: "Illustration éducative vibrante présentant les principes des 3R (Réduire, Réutiliser, Recycler) avec un message environnemental fort.",
        author: "Yahia Ikni",
        language: "fr",
        type: "embed",
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed"
      },
      // Salsabile - French Posters
      {
        id: 3,
        imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
        title: "École Écoresponsable",
        description: "Poster éducatif conçu pour sensibiliser les élèves aux gestes écologiques à adopter à l'école.",
        author: "Salsabile",
        language: "fr",
        type: "image"
      },
      {
        id: 4,
        imageUrl: "https://i.ibb.co/FLg4Bk0/fr1.jpg",
        title: "Guide du Recyclage Quotidien",
        description: "Infographie détaillée présentant des étapes pratiques pour intégrer facilement le recyclage dans votre routine.",
        author: "Salsabile",
        language: "fr",
        type: "image"
      },
      // Salsabile - English Posters
      {
        id: 5,
        imageUrl: "https://i.ibb.co/TBjKSzD/english1.jpg",
        title: "Earth Day Conversation Starters",
        description: "Collection de questions engageantes et de sujets de discussion pour stimuler des conversations sur l'environnement.",
        author: "Salsabile",
        language: "en",
        type: "image"
      },
      {
        id: 6,
        imageUrl: "https://i.ibb.co/cKY4Rj0/english2.jpg",
        title: "Recycling Mascot Adventures",
        description: "Poster ludique et éducatif mettant en scène une mascotte de recyclage qui enseigne aux enfants l'importance de la durabilité.",
        author: "Salsabile",
        language: "en",
        type: "image"
      },
      {
        id: 7,
        imageUrl: "https://i.ibb.co/1tyxTwJ/english3.jpg",
        title: "Simple Zero Waste Lifestyle",
        description: "Guide visuel étape par étape pour adopter un mode de vie zéro déchet avec des conseils pratiques et des astuces faciles.",
        author: "Salsabile",
        language: "en",
        type: "image"
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
              const img = new Image();
              img.src = poster.imageUrl;
              img.onload = () => resolve();
              img.onerror = () => resolve(); // Don't fail on error
            })
          )
        );
        
      } catch (error) {
        console.error('Error loading posters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosters();
  }, [initializePosters]);

  // Handle image error
  const handleImageError = useCallback((posterId: number) => {
    setImageErrors(prev => new Set(prev).add(posterId));
    setPosters(prev => prev.map(p => 
      p.id === posterId 
        ? { ...p, imageUrl: FALLBACK_IMAGE }
        : p
    ));
  }, []);

  // Open lightbox
  const openLightbox = useCallback((poster: Poster, index: number) => {
    setLightbox({ isOpen: true, poster, currentIndex: index });
    document.body.style.overflow = 'hidden';
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightbox({ isOpen: false, poster: null, currentIndex: 0 });
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
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

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!lightboxRef.current) return;
    
    if (!isFullscreen) {
      lightboxRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Event listeners for keyboard navigation
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
  }, [lightbox.isOpen, closeLightbox, navigatePoster]);

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
    const link = document.createElement('a');
    link.href = poster.imageUrl;
    link.download = `${poster.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-emerald-950/20">
        <div className="relative">
          <div className="w-16 h-16 border-3 border-emerald-500/20 rounded-full animate-spin">
            <div className="absolute inset-0 border-3 border-transparent border-t-emerald-500 rounded-full animate-ping"></div>
          </div>
          <Leaf className="absolute -top-2 -right-2 w-4 h-4 text-emerald-500 animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-emerald-950/10">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-gray-950 to-gray-950"></div>
        <div className="absolute top-20 left-10 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-[500px] md:h-[500px] bg-teal-600/5 rounded-full blur-3xl animate-pulse-gentle animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-8">
              <div className="relative">
                <Sparkles className="hidden md:block absolute -left-8 top-1/2 w-5 h-5 text-emerald-400 animate-float-slow" />
                <Leaf className="hidden md:block absolute -right-8 top-1/2 w-5 h-5 text-emerald-300 animate-float-slow animation-delay-1000" />
                
                <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold mb-6 
                               bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 
                               bg-clip-text text-transparent tracking-tight">
                  Eco Posters Gallery
                </h1>
                
                <div className="relative h-1 overflow-hidden max-w-2xl mx-auto rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  animate-shimmer rounded-full"></div>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-gray-300/80 max-w-2xl mx-auto leading-relaxed font-light">
              Discover inspiring environmental posters created by our creative community
            </p>
          </div>

          {/* Posters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {posters.map((poster, index) => (
              <div
                key={poster.id}
                className="transform transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => openLightbox(poster, index)}
                >
                  {/* Card Container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <Card className="relative overflow-hidden border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm 
                                 group-hover:border-emerald-500/30 group-hover:bg-gray-900/70
                                 transition-all duration-500 h-full">
                    
                    {/* Poster Image Container */}
                    <div className="relative w-full pt-[140%] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                      {/* Image */}
                      <img
                        src={imageErrors.has(poster.id) ? FALLBACK_IMAGE : poster.imageUrl}
                        alt={poster.title}
                        className="absolute inset-0 w-full h-full object-cover 
                                 group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={() => handleImageError(poster.id)}
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                                    opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Interactive Badge */}
                      {poster.type === 'embed' && (
                        <div className="absolute top-4 right-4 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md 
                                         bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white flex items-center gap-1.5">
                            <Globe className="w-3 h-3" />
                            Interactive
                          </span>
                        </div>
                      )}
                      
                      {/* Author Badge */}
                      <div className="absolute top-4 left-4 transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md 
                                       bg-gradient-to-r from-gray-900/90 to-gray-800/90 text-gray-200">
                          {poster.author}
                        </span>
                      </div>
                      
                      {/* Language Badge */}
                      <div className="absolute bottom-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md 
                                       ${poster.language === 'fr' 
                                         ? 'bg-gradient-to-r from-teal-600/90 to-teal-500/90 text-white' 
                                         : 'bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 text-white'}`}>
                          {poster.language.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Hover Expand Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-gray-900/90 backdrop-blur-sm rounded-full p-4 
                                      transform scale-90 group-hover:scale-100 transition-transform duration-500">
                          <Maximize2 className="w-6 h-6 text-emerald-400" />
                        </div>
                      </div>
                      
                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 
                                    transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-white line-clamp-1 text-sm">
                            {poster.title}
                          </h3>
                          <p className="text-xs text-gray-300/80 line-clamp-2">
                            {poster.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Type Indicator */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                      {poster.type === 'embed' ? (
                        <Globe className="w-4 h-4 text-purple-400" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-20 text-center">
            <div className="inline-block">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-emerald-900/20 
                            backdrop-blur-sm border border-gray-800/50">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-300/80 max-w-md">
                  Want to see your environmental artwork featured here? Join our creative community!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal - Vertical Popup */}
      {lightbox.isOpen && lightbox.poster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div 
            ref={lightboxRef}
            className="relative w-full max-w-md md:max-w-lg h-[90vh] bg-gray-900 rounded-2xl overflow-hidden flex flex-col border border-gray-800/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/50 bg-gray-900/90 backdrop-blur-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${lightbox.poster.language === 'fr' ? 'bg-teal-500' : 'bg-emerald-500'}`} />
                  <span className="font-semibold text-white truncate text-sm">
                    {lightbox.poster.title}
                  </span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
                  {lightbox.poster.language.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadImage(lightbox.poster!)}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => openInNewTab(lightbox.poster!)}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Maximize2 className="w-4 h-4 text-gray-400 rotate-45" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => navigatePoster('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10
                       p-3 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-800/50
                       hover:bg-gray-800/80 transition-all duration-300 opacity-0 hover:opacity-100
                       group-hover:opacity-100"
              style={{ animationDelay: '200ms' }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
            
            <button
              onClick={() => navigatePoster('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10
                       p-3 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-800/50
                       hover:bg-gray-800/80 transition-all duration-300 opacity-0 hover:opacity-100
                       group-hover:opacity-100"
              style={{ animationDelay: '400ms' }}
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-4">
              {lightbox.poster.type === 'embed' && lightbox.poster.embedUrl ? (
                <CanvaEmbed 
                  embedUrl={lightbox.poster.embedUrl}
                  title={lightbox.poster.title}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <img
                    src={lightbox.poster.imageUrl}
                    alt={lightbox.poster.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800/50 bg-gray-900/90 backdrop-blur-sm">
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                  <span className="text-sm font-medium text-gray-300">
                    {lightbox.poster.author}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {lightbox.currentIndex + 1} / {posters.length}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {lightbox.poster.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {lightbox.poster.type === 'embed' ? (
                    <Globe className="w-4 h-4 text-purple-400" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs text-gray-500">
                    {lightbox.poster.type === 'embed' ? 'Interactive Poster' : 'Image Poster'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {posters.length > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigatePoster('prev')}
                        className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                      >
                        <ChevronLeft className="w-3 h-3 text-gray-400" />
                      </button>
                      <span className="text-xs text-gray-500 px-2">
                        {lightbox.currentIndex + 1} / {posters.length}
                      </span>
                      <button
                        onClick={() => navigatePoster('next')}
                        className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
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

        .animation-delay-1000 { animation-delay: 1000ms !important; }
        .animation-delay-2000 { animation-delay: 2000ms !important; }
      `}</style>
    </div>
  );
}
