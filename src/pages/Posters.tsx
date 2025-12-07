import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, ExternalLink, Sparkles, Leaf, Zap, Filter, Mail, Instagram, Upload, User, Palette, Send } from "lucide-react";

interface Poster {
  id: number;
  imageUrl?: string;
  embedUrl?: string;
  viewUrl?: string;
  title: string;
  description: string;
  author: string;
  language: "fr" | "en";
  tags: string[];
}

export default function Posters() {
  const { t, language } = useLanguage();
  useScrollReveal();
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPoster, setHoveredPoster] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<"gallery" | "share">("gallery");

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Memoized poster data
  const yahiaPosters = useMemo<Poster[]>(() => {
    if (language !== 'fr') return [];
    
    return [
      {
        id: 1,
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
        viewUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?utm_content=DAG5KNBOplY&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
        title: "Sauver la Terre avec les 3R",
        description: "Concept Réduire, Réutiliser, Recycler avec un design vibrant",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["3R", "environnement", "concept", "réduction"]
      },
      {
        id: 2,
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
        viewUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?utm_content=DAG5KD43qYg&utm_campaign=designshare&utm_medium=embeds&utm_source=link",
        title: "Campagne de Recyclage Minimaliste",
        description: "Design épuré et minimaliste promouvant les habitudes de recyclage",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["minimaliste", "campagne", "épuré", "habitudes"]
      }
    ];
  }, [language]);

  const salsabilePosters = useMemo<Poster[]>(() => {
    if (language === 'en') {
      return [
        {
          id: 3,
          imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
          title: "Earth Day Conversation Starters",
          description: "Engaging questions to spark environmental discussions",
          author: "Salsabile",
          language: "en",
          tags: ["earth day", "conversation", "discussion", "engagement"]
        },
        {
          id: 4,
          imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
          title: "Cat and His Recycling Bins",
          description: "Fun and educational poster featuring recycling mascot",
          author: "Salsabile",
          language: "en",
          tags: ["fun", "mascot", "educational", "playful"]
        },
        {
          id: 5,
          imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
          title: "Easy Zero Waste",
          description: "Simple steps to achieve zero waste lifestyle",
          author: "Salsabile",
          language: "en",
          tags: ["zero waste", "simple", "lifestyle", "eco-friendly"]
        }
      ];
    } else {
      return [
        {
          id: 6,
          imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
          title: "Recyclage au Quotidien",
          description: "Guide pratique pour le recyclage de tous les jours",
          author: "Salsabile",
          language: "fr",
          tags: ["quotidien", "pratique", "guide", "recyclage"]
        },
        {
          id: 7,
          imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
          title: "École Verte et Responsable",
          description: "Poster éducatif pour une école plus respectueuse de l'environnement",
          author: "Salsabile",
          language: "fr",
          tags: ["école", "éducatif", "responsable", "vert"]
        }
      ];
    }
  }, [language]);

  const allPosters = useMemo(() => [...yahiaPosters, ...salsabilePosters], [yahiaPosters, salsabilePosters]);

  const filteredPosters = useMemo(() => {
    if (!searchQuery.trim()) return allPosters;
    
    const query = searchQuery.toLowerCase().trim();
    return allPosters.filter(poster =>
      poster.title.toLowerCase().includes(query) ||
      poster.description.toLowerCase().includes(query) ||
      poster.author.toLowerCase().includes(query) ||
      poster.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [allPosters, searchQuery]);

  // Handle opening in new tab
  const handleOpenNewTab = useCallback((url: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Copy contact info to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute inset-0 border-4 border-transparent border-b-emerald-300 rounded-full animate-pulse animation-delay-600"></div>
          </div>
          <Leaf className="absolute -top-3 -right-3 w-8 h-8 text-emerald-500 animate-bounce animation-delay-400" />
          <Zap className="absolute -bottom-3 -left-3 w-8 h-8 text-emerald-400 animate-pulse animation-delay-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Animated Background with Dark Theme Support */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Gradient Background - Different for light/dark */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-background to-emerald-900/5 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 opacity-40 dark:opacity-20">
          <div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-400/10 to-transparent rounded-full blur-3xl animate-orb-float"
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-l from-emerald-600/5 to-transparent rounded-full blur-3xl animate-orb-float"
            style={{ animationDelay: '2s' }}
          />
          {/* Additional dark theme elements */}
          <div 
            className="absolute top-3/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-900/10 to-transparent rounded-full blur-3xl animate-orb-float"
            style={{ animationDelay: '1s' }}
          />
        </div>
        
        {/* Animated floating particles - More for dark theme */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 dark:bg-emerald-500/20 rounded-full animate-particle-float"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + i * 0.3}s`,
              left: `${10 + (i * 4)}%`,
              top: `${20 + (i * 4)}%`,
              scale: `${0.5 + (i % 3) * 0.5}`
            }}
          />
        ))}
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] 
                        bg-[linear-gradient(90deg,#22c55e_1px,transparent_1px),linear-gradient(180deg,#22c55e_1px,transparent_1px)] 
                        bg-[size:20px_20px] dark:bg-[linear-gradient(90deg,#059669_1px,transparent_1px),linear-gradient(180deg,#059669_1px,transparent_1px)]"></div>
        
        {/* Animated noise texture for depth */}
<div
  className="absolute inset-0 opacity-[0.015] dark:opacity-[0.01] 
  bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22/%3E%3C/svg%3E')]"
></div>


      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with enhanced styling */}
          <div className="text-center mb-16">
            <div className="inline-block mb-10 relative">
              <div className="relative">
                {/* Decorative elements */}
                <Leaf className="absolute -left-10 top-1/2 w-8 h-8 text-emerald-400/60 dark:text-emerald-500/40 animate-float-slow" />
                <Sparkles className="absolute -right-10 top-1/2 w-8 h-8 text-emerald-300/60 dark:text-emerald-400/40 animate-float-slow animation-delay-1000" />
                
                {/* Main title */}
                <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black mb-8 
                               bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700 
                               dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-500 
                               bg-clip-text text-transparent animate-gradient tracking-tight">
                  {t("posters.title")}
                </h1>
                
                {/* Animated underline */}
                <div className="relative h-1 overflow-hidden max-w-2xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent 
                                  dark:via-emerald-400 animate-shimmer"></div>
                </div>
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-emerald-800/70 dark:text-emerald-200/70 max-w-3xl mx-auto leading-relaxed font-light mb-6 animate-fade-in">
              {t("posters.subtitle")}
            </p>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 
                           ${activeSection === "gallery" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/30" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700/80"}`}
              >
                <Palette className="w-5 h-5" />
                {language === 'en' ? "Gallery" : "Galerie"}
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-3 
                           ${activeSection === "share" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-2xl shadow-emerald-500/30" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-gray-700/80"}`}
              >
                <Upload className="w-5 h-5" />
                {language === 'en' ? "Share Your Art" : "Partagez votre art"}
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section */}
              <div className="max-w-3xl mx-auto mb-16 animate-fade-in-up">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-600/70 dark:text-emerald-400/70 w-6 h-6 transition-all duration-300 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 group-focus-within:scale-110" />
                    <input
                      type="text"
                      placeholder={language === 'en' 
                        ? "Search posters by title, description, or tags..." 
                        : "Rechercher des affiches par titre, description ou tags..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-12 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl text-lg text-emerald-900 dark:text-emerald-100 placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 transition-all duration-300 hover:border-emerald-500/30 dark:hover:border-emerald-400/30"
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-200 p-1"
                          aria-label="Clear search"
                        >
                          ✕
                        </button>
                      )}
                      <Filter className="w-5 h-5 text-emerald-600/50 dark:text-emerald-400/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-24 animate-fade-in">
                  <div className="inline-flex flex-col items-center gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 flex items-center justify-center animate-pulse-gentle">
                        <Search className="w-12 h-12 text-emerald-500/50 dark:text-emerald-400/50" />
                      </div>
                      <Zap className="absolute -top-2 -right-2 w-8 h-8 text-emerald-400 dark:text-emerald-300 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                        {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                      </h3>
                      <p className="text-emerald-700/70 dark:text-emerald-300/70">
                        {language === 'en' 
                          ? "Try different keywords or browse all community posters" 
                          : "Essayez d'autres mots-clés ou parcourez toutes les affiches de la communauté"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 active:scale-95 transform hover:-translate-y-0.5"
                    >
                      {language === 'en' ? "View All Posters" : "Voir toutes les affiches"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-10 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                          <Zap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {language === 'en' ? "community posters" : "affiches communautaires"}
                          </h3>
                          {searchQuery && (
                            <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-1">
                              {language === 'en' ? "Showing results for" : "Résultats pour"} "
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{searchQuery}</span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30"
                        >
                          {language === 'en' ? "Clear search" : "Effacer"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Posters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="animate-card-enter scroll-reveal"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                        onMouseEnter={() => setHoveredPoster(poster.id)}
                        onMouseLeave={() => setHoveredPoster(null)}
                      >
                        <Card 
                          className="overflow-hidden border-2 border-emerald-500/10 dark:border-emerald-500/20 
                                     bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm h-full group 
                                     hover:border-emerald-500/30 dark:hover:border-emerald-400/30 
                                     hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 
                                     transition-all duration-500"
                        >
                          {/* Poster Container */}
                          <div className="relative w-full h-0 pb-[130%] overflow-hidden">
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 
                                            dark:from-emerald-500/10 dark:to-emerald-600/10"></div>
                            
                            {/* Poster Content */}
                            <div className="absolute inset-2 rounded-lg overflow-hidden">
                              {poster.embedUrl ? (
                                <iframe
                                  loading="lazy"
                                  className="absolute w-full h-full top-0 left-0 border-none"
                                  src={poster.embedUrl}
                                  allowFullScreen
                                  allow="fullscreen"
                                  title={poster.title}
                                />
                              ) : (
                                <img
                                  src={poster.imageUrl}
                                  alt={poster.title}
                                  className="absolute w-full h-full top-0 left-0 object-cover group-hover:scale-105 transition-transform duration-700"
                                  loading="lazy"
                                />
                              )}
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-emerald-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              
                              {/* Language Badge */}
                              <div className="absolute top-3 right-3 transform group-hover:scale-110 transition-transform duration-300">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${
                                  poster.language === 'en' 
                                    ? 'bg-emerald-600/90 dark:bg-emerald-500/90 text-white border border-emerald-700 dark:border-emerald-600'
                                    : 'bg-emerald-700/90 dark:bg-emerald-600/90 text-white border border-emerald-800 dark:border-emerald-700'
                                }`}>
                                  {poster.language.toUpperCase()}
                                </span>
                              </div>
                              
                              {/* Author Tag */}
                              <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
                                <span className="px-3 py-1.5 bg-emerald-900/90 dark:bg-emerald-800/90 backdrop-blur-sm rounded-full text-xs text-white font-medium shadow-lg">
                                  {poster.author}
                                </span>
                              </div>
                              
                              {/* Open in New Tab Button */}
                              <div className="absolute bottom-3 left-3 right-3">
                                <button
                                  onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl || poster.embedUrl || '')}
                                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-600 
                                            dark:from-emerald-600 dark:to-emerald-500 text-white font-semibold 
                                            hover:shadow-xl hover:shadow-emerald-600/30 dark:hover:shadow-emerald-500/30 
                                            transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 
                                            opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 
                                            active:scale-95 group-hover:delay-100"
                                >
                                  <ExternalLink className="w-5 h-5" />
                                  {language === 'en' ? "Open in new tab" : "Ouvrir dans un nouvel onglet"}
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-5 bg-gradient-to-b from-white/50 to-white/30 
                                          dark:from-gray-900/50 dark:to-gray-900/30">
                            {/* Title and Description */}
                            <div className="mb-4">
                              <h3 className="font-bold text-xl text-emerald-900 dark:text-emerald-100 mb-2 
                                            group-hover:text-emerald-700 dark:group-hover:text-emerald-400 
                                            transition-colors duration-300 line-clamp-1">
                                {poster.title}
                              </h3>
                              <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70 line-clamp-2 leading-relaxed">
                                {poster.description}
                              </p>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {poster.tags.slice(0, 4).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-3 py-1 text-xs rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 
                                             text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 
                                             dark:border-emerald-500/30 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 
                                             hover:border-emerald-500/30 dark:hover:border-emerald-500/40 
                                             transition-all duration-300 cursor-default"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="pt-4 border-t border-emerald-500/10 dark:border-emerald-500/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                                    poster.author === "Yahia Ikni" 
                                      ? 'bg-emerald-500' 
                                      : 'bg-emerald-400'
                                  }`}></div>
                                  <span className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                                    {t("home.presentation.by")}{" "}
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">{poster.author}</span>
                                  </span>
                                </div>
                                <div className="text-xs text-emerald-600/60 dark:text-emerald-400/60">
                                  {poster.language === 'en' ? 'EN' : 'FR'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Footer Message */}
              {!searchQuery && filteredPosters.length > 0 && (
                <div className="mt-20 text-center animate-fade-in-up animation-delay-1000">
                  <div className="inline-block max-w-xl mx-auto">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-full blur-xl"></div>
                      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/30 to-emerald-500/5 
                                      dark:from-gray-900/50 dark:to-emerald-900/20 backdrop-blur-sm 
                                      border border-emerald-500/10 dark:border-emerald-500/20">
                        <Leaf className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-4 mx-auto animate-float-slow" />
                        <p className="text-lg text-emerald-800/80 dark:text-emerald-200/80 mb-4">
                          {t("posters.communityNote")}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 dark:via-emerald-400/30 to-transparent"></div>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {language === 'en' ? "Made with ♻️ by the community" : "Fait avec ♻️ par la communauté"}
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/30 dark:via-emerald-300/30 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Share Your Art Section */
            <div className="max-w-4xl mx-auto animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-6">
                  {language === 'en' ? "Share Your Artwork" : "Partagez votre création"}
                </h2>
                <p className="text-xl text-emerald-700/80 dark:text-emerald-300/80">
                  {language === 'en' 
                    ? "Join our community and inspire others with your environmental artwork" 
                    : "Rejoignez notre communauté et inspirez les autres avec votre art environnemental"}
                </p>
              </div>

              {/* Steps */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {[
                  {
                    step: 1,
                    icon: Palette,
                    title: language === 'en' ? "Create Your Art" : "Créez votre art",
                    description: language === 'en' 
                      ? "Design a poster or video about recycling, environment, or sustainability"
                      : "Créez une affiche ou une vidéo sur le recyclage, l'environnement ou le développement durable"
                  },
                  {
                    step: 2,
                    icon: Send,
                    title: language === 'en' ? "Send to Us" : "Envoyez-nous",
                    description: language === 'en' 
                      ? "Share your creation via email or Instagram. Include your name for credit."
                      : "Partagez votre création par email ou Instagram. Incluez votre nom pour le crédit."
                  },
                  {
                    step: 3,
                    icon: User,
                    title: language === 'en' ? "Get Featured" : "Soyez mis en avant",
                    description: language === 'en' 
                      ? "We'll review and feature your work in our community gallery with proper credit"
                      : "Nous examinerons et mettrons en avant votre travail dans notre galerie communautaire avec crédit approprié"
                  }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className="relative group"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-emerald-500/10 dark:border-emerald-500/20 h-full">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-6">
                        {item.step}
                      </div>
                      <item.icon className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-4 mx-auto" />
                      <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">
                        {item.title}
                      </h3>
                      <p className="text-emerald-700/80 dark:text-emerald-300/80">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-white/50 to-emerald-500/5 dark:from-gray-900/50 dark:to-emerald-900/20 
                              backdrop-blur-sm rounded-3xl border-2 border-emerald-500/10 dark:border-emerald-500/20 p-8">
                <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-8 text-center">
                  {language === 'en' ? "Contact Information" : "Coordonnées"}
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20">
                          <Mail className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                            {language === 'en' ? "Email" : "Courriel"}
                          </h4>
                          <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                            {language === 'en' ? "Send your artwork to" : "Envoyez votre création à"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono text-emerald-800 dark:text-emerald-200">
                          recyclagemaria@gmail.com
                        </code>
                        <button
                          onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                          className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 transition-colors duration-200"
                          title={language === 'en' ? "Copy email" : "Copier l'email"}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20">
                          <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
                            Instagram
                          </h4>
                          <p className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
                            {language === 'en' ? "DM us your artwork" : "Envoyez-nous votre création en message privé"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono text-emerald-800 dark:text-emerald-200">
                          @recyclage_projet
                        </code>
                        <button
                          onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 flex items-center gap-2"
                        >
                          <Instagram className="w-4 h-4" />
                          {language === 'en' ? "Follow" : "Suivre"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    {language === 'en' ? "Submission Guidelines" : "Directives de soumission"}
                  </h4>
                  <ul className="space-y-2 text-emerald-700/80 dark:text-emerald-300/80">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
                      <span>{language === 'en' 
                        ? "Include your full name for proper credit" 
                        : "Incluez votre nom complet pour un crédit approprié"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
                      <span>{language === 'en' 
                        ? "Accepted formats: JPG, PNG, PDF, MP4 (for videos)" 
                        : "Formats acceptés : JPG, PNG, PDF, MP4 (pour les vidéos)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
                      <span>{language === 'en' 
                        ? "Keep content educational and inspiring about environmental topics" 
                        : "Gardez le contenu éducatif et inspirant sur les thèmes environnementaux"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes orb-float {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.3;
          }
          33% { 
            transform: translate(30px, -40px) scale(1.1) rotate(120deg);
            opacity: 0.5;
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
            opacity: 0.4;
          }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
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

        /* Animation classes */
        .animate-orb-float {
          animation: orb-float 20s ease-in-out infinite;
        }

        .animate-particle-float {
          animation: particle-float var(--duration, 3s) ease-in-out infinite var(--delay, 0s);
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 300% auto;
          animation: gradient 8s ease-in-out infinite;
        }

        .animate-card-enter {
          animation: card-enter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2.5s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .scroll-reveal.scroll-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Utility classes */
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

        .animation-delay-300 { animation-delay: 300ms !important; }
        .animation-delay-500 { animation-delay: 500ms !important; }
        .animation-delay-600 { animation-delay: 600ms !important; }
        .animation-delay-800 { animation-delay: 800ms !important; }
        .animation-delay-1000 { animation-delay: 1000ms !important; }

        /* Group delays */
        .group-hover\\:delay-100 {
          transition-delay: 100ms;
        }
      `}</style>
    </div>
  );
}
