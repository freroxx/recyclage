import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function Posters() {
  const { t, language } = useLanguage();
  useScrollReveal();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoster, setHoveredPoster] = useState<number | null>(null);

  const yahiaPosters = [
    {
      id: 1,
      embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
      viewUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?utm_content=DAG5KNBOplY&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
      titleKey: "posters.poster1",
      author: "Yahia Ikni"
    },
    {
      id: 2,
      embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
      viewUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?utm_content=DAG5KD43qYg&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
      titleKey: "posters.poster2",
      author: "Yahia Ikni"
    }
  ];

  const salsabilePosters = language === 'en' 
    ? [
        {
          id: 3,
          imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
          title: "English Poster 1",
          author: "Salsabile"
        },
        {
          id: 4,
          imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
          title: "English Poster 2",
          author: "Salsabile"
        },
        {
          id: 5,
          imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
          title: "English Poster 3",
          author: "Salsabile"
        }
      ]
    : [
        {
          id: 6,
          imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
          title: "Affiche Française 1",
          author: "Salsabile"
        },
        {
          id: 7,
          imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
          title: "Affiche Française 2",
          author: "Salsabile"
        }
      ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animation-delay-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with enhanced animation */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <div className="relative">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                  {t("posters.title")}
                </h1>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
              {t("posters.subtitle")}
            </p>
          </div>

          {/* Community Badge */}
          <div className="text-center mb-12 animate-fade-in-up animation-delay-500">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-foreground">
                {t("posters.allCommunityMade")}
              </span>
            </span>
          </div>

          {/* Yahia's Posters */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground flex items-center gap-3 animate-fade-in-left">
              <span className="bg-gradient-to-r from-primary to-secondary w-6 h-0.5"></span>
              {t("posters.yahiaSection")}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({yahiaPosters.length} {t("posters.posters")})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {yahiaPosters.map((poster, index) => (
                <div
                  key={poster.id}
                  className={`transform transition-all duration-500 ${
                    hoveredPoster === poster.id ? 'scale-[1.02]' : ''
                  } animate-fade-in-up animation-delay-${(index + 1) * 200}`}
                  onMouseEnter={() => setHoveredPoster(poster.id)}
                  onMouseLeave={() => setHoveredPoster(null)}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 backdrop-blur-sm bg-card/50">
                    <div className="relative w-full h-0 pb-[125%] overflow-hidden rounded-t-lg group">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <iframe
                        loading="lazy"
                        className="absolute w-full h-full top-0 left-0 border-none transform group-hover:scale-105 transition-transform duration-500"
                        src={poster.embedUrl}
                        allowFullScreen
                        allow="fullscreen"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span className="px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs text-white">
                          {t("posters.clickToView")}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-b from-card to-card/50">
                      <a
                        href={poster.viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {t(poster.titleKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t("home.presentation.by")} {poster.author}
                          </p>
                        </div>
                        <svg 
                          className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Salsabile's Posters */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground flex items-center gap-3 animate-fade-in-right">
              <span className="bg-gradient-to-r from-secondary to-primary w-6 h-0.5"></span>
              {t("posters.salsabileSection")}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({salsabilePosters.length} {t("posters.posters")})
              </span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {salsabilePosters.map((poster, index) => (
                <div
                  key={poster.id}
                  className={`transform transition-all duration-500 ${
                    hoveredPoster === poster.id ? 'scale-[1.02]' : ''
                  } animate-fade-in-up animation-delay-${(index + 3) * 200}`}
                  onMouseEnter={() => setHoveredPoster(poster.id)}
                  onMouseLeave={() => setHoveredPoster(null)}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-secondary/20 backdrop-blur-sm bg-card/50">
                    <div className="relative w-full h-0 pb-[125%] overflow-hidden rounded-t-lg group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={poster.imageUrl}
                        alt={poster.title}
                        className="absolute w-full h-full top-0 left-0 object-cover transform group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <button
                          onClick={() => window.open(poster.imageUrl, '_blank')}
                          className="w-full px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-foreground hover:bg-white transition-colors"
                        >
                          {t("posters.viewFullSize")}
                        </button>
                      </div>
                    </div>
                    <div className="p-4 md:p-6 bg-gradient-to-b from-card to-card/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base md:text-lg">{poster.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t("home.presentation.by")} {poster.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            language === 'en' 
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-purple-500/10 text-purple-500'
                          }`}>
                            {language === 'en' ? 'EN' : 'FR'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-20 text-center animate-fade-in-up animation-delay-1000">
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              {t("posters.communityNote")}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(var(--scale)); }
          50% { transform: translateY(-20px) scale(var(--scale)); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }

        .animation-delay-700 {
          animation-delay: 700ms;
        }

        .animation-delay-1000 {
          animation-delay: 1000ms;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }
      `}</style>
    </div>
  );
}
