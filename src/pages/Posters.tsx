import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Card } from "@/components/ui/card";
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

  // Initialize mounted state with optimized loading
  useEffect(() => {
    setMounted(true);
    // Use requestIdleCallback for better performance
    const handle = requestIdleCallback(() => setIsLoading(false), { timeout: 800 });
    return () => cancelIdleCallback(handle);
  }, []);

  // Memoized poster data with optimized structure
  const { yahiaPosters, salsabilePosters } = useMemo(() => {
    const yahia: Poster[] = language === 'fr' ? [
      {
        id: 1,
        embedUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view?embed",
        viewUrl: "https://www.canva.com/design/DAG5KNBOplY/Ne4tr6huXflwQyGMv3_zXQ/view",
        title: t("posters.yahia.title1") || "Sauver la Terre avec les 3R",
        description: t("posters.yahia.desc1") || "Concept Réduire, Réutiliser, Recycler avec un design vibrant",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["3R", "environnement", "concept", "réduction"]
      },
      {
        id: 2,
        embedUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view?embed",
        viewUrl: "https://www.canva.com/design/DAG5KD43qYg/EosXIeHvs1gVf3UKtzN-Mg/view",
        title: t("posters.yahia.title2") || "Campagne de Recyclage Minimaliste",
        description: t("posters.yahia.desc2") || "Design épuré et minimaliste promouvant les habitudes de recyclage",
        author: "Yahia Ikni",
        language: "fr",
        tags: ["minimaliste", "campagne", "épuré", "habitudes"]
      }
    ] : [];

    const salsabile: Poster[] = language === 'en' ? [
      {
        id: 3,
        imageUrl: "https://i.ibb.co/TBjKSzDk/english1.jpg",
        title: t("posters.salsabile.title1") || "Earth Day Conversation Starters",
        description: t("posters.salsabile.desc1") || "Engaging questions to spark environmental discussions",
        author: "Salsabile",
        language: "en",
        tags: ["earth day", "conversation", "discussion", "engagement"]
      },
      {
        id: 4,
        imageUrl: "https://i.ibb.co/cKY4Rj0B/english2.jpg",
        title: t("posters.salsabile.title2") || "Cat and His Recycling Bins",
        description: t("posters.salsabile.desc2") || "Fun and educational poster featuring recycling mascot",
        author: "Salsabile",
        language: "en",
        tags: ["fun", "mascot", "educational", "playful"]
      },
      {
        id: 5,
        imageUrl: "https://i.ibb.co/1tyxTwJy/english3.jpg",
        title: t("posters.salsabile.title3") || "Easy Zero Waste",
        description: t("posters.salsabile.desc3") || "Simple steps to achieve zero waste lifestyle",
        author: "Salsabile",
        language: "en",
        tags: ["zero waste", "simple", "lifestyle", "eco-friendly"]
      }
    ] : [
      {
        id: 6,
        imageUrl: "https://i.ibb.co/FLg4Bk0b/fr1.jpg",
        title: t("posters.salsabile.title4") || "Recyclage au Quotidien",
        description: t("posters.salsabile.desc4") || "Guide pratique pour le recyclage de tous les jours",
        author: "Salsabile",
        language: "fr",
        tags: ["quotidien", "pratique", "guide", "recyclage"]
      },
      {
        id: 7,
        imageUrl: "https://i.ibb.co/YSbCfC6/fr2.jpg",
        title: t("posters.salsabile.title5") || "École Verte et Responsable",
        description: t("posters.salsabile.desc5") || "Poster éducatif pour une école plus respectueuse de l'environnement",
        author: "Salsabile",
        language: "fr",
        tags: ["école", "éducatif", "responsable", "vert"]
      }
    ];

    return { yahiaPosters: yahia, salsabilePosters: salsabile };
  }, [language, t]);

  const allPosters = useMemo(() => 
    [...yahiaPosters, ...salsabilePosters],
    [yahiaPosters, salsabilePosters]
  );

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
  const handleOpenNewTab = useCallback((url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  // Copy contact info to clipboard
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  }, []);

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-16 h-16 md:w-24 md:h-24 border-3 md:border-4 border-primary/10 rounded-full animate-spin">
            <div className="absolute inset-0 border-3 md:border-4 border-transparent border-t-emerald-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Simplified Background for Better Performance */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-background to-emerald-900/5 
                        dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20" />
        
        {/* Minimal animated elements */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] 
                        bg-gradient-to-r from-emerald-400/5 to-transparent rounded-full blur-3xl 
                        animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] md:w-[600px] md:h-[600px] 
                        bg-gradient-to-l from-emerald-600/5 to-transparent rounded-full blur-3xl 
                        animate-pulse animation-delay-2000" />
      </div>

      {/* Main Content Container - Fixed scrolling issue */}
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-8 md:mb-10 relative">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 
                             bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700 
                             dark:from-emerald-400 dark:via-emerald-300 dark:to-emerald-500 
                             bg-clip-text text-transparent tracking-tight">
                {t("posters.title")}
              </h1>
              <div className="h-0.5 w-32 md:w-64 mx-auto bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            </div>
            
            <p className="text-lg md:text-xl text-emerald-800/70 dark:text-emerald-200/70 
                          max-w-2xl md:max-w-3xl mx-auto leading-relaxed mb-8">
              {t("posters.subtitle")}
            </p>
            
            {/* Navigation Tabs - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-10 md:mb-12">
              <button
                onClick={() => setActiveSection("gallery")}
                className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base
                           ${activeSection === "gallery" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300"}`}
              >
                <Palette className="w-4 h-4 md:w-5 md:h-5" />
                {language === 'en' ? "Gallery" : "Galerie"}
              </button>
              <button
                onClick={() => setActiveSection("share")}
                className={`px-6 md:px-8 py-3 rounded-full font-semibold transition-all duration-300 
                           flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base
                           ${activeSection === "share" 
                             ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg" 
                             : "bg-white/80 dark:bg-gray-800/80 text-emerald-700 dark:text-emerald-300"}`}
              >
                <Upload className="w-4 h-4 md:w-5 md:h-5" />
                {language === 'en' ? "Share Your Art" : "Partagez votre art"}
              </button>
            </div>
          </div>

          {activeSection === "gallery" ? (
            <>
              {/* Search Section */}
              <div className="max-w-2xl md:max-w-3xl mx-auto mb-12 md:mb-16">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                                   text-emerald-600/70 dark:text-emerald-400/70 w-5 h-5 md:w-6 md:h-6" />
                  <input
                    type="text"
                    placeholder={language === 'en' 
                      ? "Search posters by title, description, or tags..." 
                      : "Rechercher des affiches..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 md:pl-16 pr-10 md:pr-12 py-3 md:py-4 bg-white/80 dark:bg-gray-900/80 
                             backdrop-blur-sm border border-emerald-500/20 dark:border-emerald-500/30 
                             rounded-xl md:rounded-2xl text-base md:text-lg 
                             text-emerald-900 dark:text-emerald-100 
                             placeholder:text-emerald-600/50 dark:placeholder:text-emerald-400/50 
                             focus:outline-none focus:border-emerald-500/40 dark:focus:border-emerald-400/40 
                             focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 
                               text-emerald-600/70 dark:text-emerald-400/70 hover:text-emerald-500"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              {filteredPosters.length === 0 ? (
                <div className="text-center py-16 md:py-24">
                  <div className="inline-flex flex-col items-center gap-4 md:gap-6 max-w-md">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-24 md:h-24 rounded-full 
                                    bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 
                                    flex items-center justify-center">
                        <Search className="w-8 h-8 md:w-12 md:h-12 text-emerald-500/50" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                        {language === 'en' ? "No posters found" : "Aucune affiche trouvée"}
                      </h3>
                      <p className="text-emerald-700/70 dark:text-emerald-300/70 text-sm md:text-base">
                        {language === 'en' 
                          ? "Try different keywords or browse all posters" 
                          : "Essayez d'autres mots-clés"}
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 md:px-8 py-2 md:py-3 rounded-full 
                               bg-gradient-to-r from-emerald-600 to-emerald-500 text-white 
                               font-semibold text-sm md:text-base hover:shadow-lg transition-all duration-300"
                    >
                      {language === 'en' ? "View All Posters" : "Voir toutes les affiches"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Results Header */}
                  <div className="mb-6 md:mb-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 md:p-2 rounded-full bg-emerald-500/10">
                          <Zap className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-emerald-900 dark:text-emerald-100">
                            {filteredPosters.length} {language === 'en' ? "community posters" : "affiches"}
                          </h3>
                          {searchQuery && (
                            <p className="text-xs md:text-sm text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">
                              {language === 'en' ? "Showing results for" : "Résultats pour"} "
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {searchQuery}
                              </span>"
                            </p>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-xs md:text-sm font-medium text-emerald-600 dark:text-emerald-400 
                                   hover:text-emerald-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full 
                                   bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                        >
                          {language === 'en' ? "Clear" : "Effacer"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Posters Grid - Mobile Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {filteredPosters.map((poster, index) => (
                      <div
                        key={poster.id}
                        className="scroll-reveal"
                        onMouseEnter={() => setHoveredPoster(poster.id)}
                        onMouseLeave={() => setHoveredPoster(null)}
                      >
                        <Card 
                          className="overflow-hidden border border-emerald-500/10 dark:border-emerald-500/20 
                                   bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full 
                                   transition-all duration-300 hover:shadow-lg"
                        >
                          {/* Poster Container */}
                          <div className="relative w-full pb-[140%] overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {poster.embedUrl ? (
                              <iframe
                                loading="lazy"
                                className="absolute inset-0 w-full h-full border-none"
                                src={poster.embedUrl}
                                allowFullScreen
                                allow="fullscreen"
                                title={poster.title}
                              />
                            ) : (
                              <img
                                src={poster.imageUrl}
                                alt={poster.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                            
                            {/* Overlay with View Button */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                                          opacity-0 hover:opacity-100 transition-opacity duration-300 
                                          flex items-end p-4">
                              <button
                                onClick={() => handleOpenNewTab(poster.viewUrl || poster.imageUrl || poster.embedUrl)}
                                className="w-full px-4 py-2.5 rounded-lg bg-white/90 dark:bg-gray-900/90 
                                         text-emerald-700 dark:text-emerald-300 font-medium 
                                         hover:bg-white dark:hover:bg-gray-800 transition-colors 
                                         flex items-center justify-center gap-2 text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {language === 'en' ? "View" : "Voir"}
                              </button>
                            </div>
                            
                            {/* Language Badge */}
                            <div className="absolute top-3 right-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                                poster.language === 'en' 
                                  ? 'bg-emerald-600/90 text-white'
                                  : 'bg-emerald-700/90 text-white'
                              }`}>
                                {poster.language.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Poster Info */}
                          <div className="p-4 md:p-5">
                            <div className="mb-3 md:mb-4">
                              <h3 className="font-bold text-lg md:text-xl text-emerald-900 dark:text-emerald-100 mb-1 md:mb-2 line-clamp-1">
                                {poster.title}
                              </h3>
                              <p className="text-sm text-emerald-800/70 dark:text-emerald-300/70 line-clamp-2">
                                {poster.description}
                              </p>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3 md:mb-4">
                              {poster.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 
                                           text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="pt-3 md:pt-4 border-t border-emerald-500/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                                    {t("home.presentation.by")}{" "}
                                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                                      {poster.author}
                                    </span>
                                  </div>
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
                <div className="mt-12 md:mt-20 text-center">
                  <div className="inline-block max-w-xl mx-auto p-6 rounded-2xl 
                                bg-gradient-to-br from-white/30 to-emerald-500/5 
                                dark:from-gray-900/50 dark:to-emerald-900/20 
                                backdrop-blur-sm border border-emerald-500/10">
                    <p className="text-base md:text-lg text-emerald-800/80 dark:text-emerald-200/80 mb-4">
                      {t("posters.communityNote")}
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {language === 'en' ? "Made with ♻️ by the community" : "Fait avec ♻️ par la communauté"}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Share Your Art Section */
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 dark:text-emerald-100 mb-4 md:mb-6">
                  {language === 'en' ? "Share Your Artwork" : "Partagez votre création"}
                </h2>
                <p className="text-base md:text-xl text-emerald-700/80 dark:text-emerald-300/80">
                  {language === 'en' 
                    ? "Join our community and inspire others with your environmental artwork" 
                    : "Rejoignez notre communauté et inspirez les autres"}
                </p>
              </div>

              {/* Steps - Mobile Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
                {[
                  {
                    step: 1,
                    icon: Palette,
                    title: language === 'en' ? "Create Your Art" : "Créez votre art",
                    description: language === 'en' 
                      ? "Design a poster or video about recycling, environment, or sustainability"
                      : "Créez une affiche ou une vidéo sur l'environnement"
                  },
                  {
                    step: 2,
                    icon: Send,
                    title: language === 'en' ? "Send to Us" : "Envoyez-nous",
                    description: language === 'en' 
                      ? "Share your creation via email or Instagram with your name"
                      : "Partagez votre création par email ou Instagram"
                  },
                  {
                    step: 3,
                    icon: User,
                    title: language === 'en' ? "Get Featured" : "Soyez mis en avant",
                    description: language === 'en' 
                      ? "We'll feature your work in our community gallery with credit"
                      : "Nous mettrons en avant votre travail avec crédit"
                  }
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl 
                             border border-emerald-500/10 dark:border-emerald-500/20"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 
                                   rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 
                                   text-white text-lg md:text-2xl font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-2 md:mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-emerald-700/80 dark:text-emerald-300/80">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-white/50 to-emerald-500/5 
                            dark:from-gray-900/50 dark:to-emerald-900/20 
                            backdrop-blur-sm rounded-xl md:rounded-3xl 
                            border border-emerald-500/10 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 text-center">
                  {language === 'en' ? "Contact Information" : "Coordonnées"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Email */}
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 md:p-6 rounded-xl 
                                border border-emerald-500/20">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-full bg-emerald-500/10">
                        <Mail className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm md:text-base">
                          {language === 'en' ? "Email" : "Courriel"}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm md:text-base font-mono text-emerald-800 dark:text-emerald-200 break-all">
                        recyclagemaria@gmail.com
                      </code>
                      <button
                        onClick={() => copyToClipboard("recyclagemaria@gmail.com")}
                        className="ml-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-emerald-500/10 
                                 text-emerald-600 hover:bg-emerald-500/20 transition-colors 
                                 text-xs md:text-sm whitespace-nowrap"
                        title={language === 'en' ? "Copy email" : "Copier l'email"}
                      >
                        {language === 'en' ? "Copy" : "Copier"}
                      </button>
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 md:p-6 rounded-xl 
                                border border-emerald-500/20">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="p-2 md:p-3 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10">
                        <Instagram className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 text-sm md:text-base">
                          Instagram
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <code className="text-sm md:text-base font-mono text-emerald-800 dark:text-emerald-200 break-all">
                        @recyclage_projet
                      </code>
                      <button
                        onClick={() => window.open("https://www.instagram.com/recyclage_projet", "_blank")}
                        className="ml-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg 
                                 bg-gradient-to-r from-pink-500 to-purple-500 text-white 
                                 font-semibold hover:shadow-lg transition-all duration-300 
                                 text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2"
                      >
                        <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                        {language === 'en' ? "Follow" : "Suivre"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-xl 
                              bg-emerald-500/5 border border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 md:mb-3 
                               flex items-center gap-2 text-sm md:text-base">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                    {language === 'en' ? "Submission Guidelines" : "Directives"}
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2 text-sm text-emerald-700/80 dark:text-emerald-300/80">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1 text-xs">•</span>
                      <span>{language === 'en' 
                        ? "Include your full name for proper credit" 
                        : "Incluez votre nom complet"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1 text-xs">•</span>
                      <span>{language === 'en' 
                        ? "Accepted formats: JPG, PNG, PDF, MP4" 
                        : "Formats acceptés : JPG, PNG, PDF, MP4"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 mt-1 text-xs">•</span>
                      <span>{language === 'en' 
                        ? "Keep content educational and inspiring" 
                        : "Contenu éducatif et inspirant"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
