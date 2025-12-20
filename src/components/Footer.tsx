import { Instagram, Mail, Globe, Heart, MessageCircle, RefreshCw, Info, X, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

export function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showCredits, setShowCredits] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Handle initial undefined state from useIsMobile
  const [isMobileFinal, setIsMobileFinal] = useState(false);
  
  useEffect(() => {
    if (isMobile !== undefined) {
      setIsMobileFinal(isMobile);
    }
  }, [isMobile]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSupport = () => {
    navigate("/support");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  // Action buttons configuration with enhanced animations
  const actionButtons = [
    {
      icon: Instagram,
      label: "Instagram",
      color: "#E4405F",
      gradient: "from-pink-500/20 to-rose-600/20",
      onClick: () => window.open("https://instagram.com/recyclage_projet", "_blank"),
    },
    {
      icon: Globe,
      label: t("footer.website", "Website"),
      color: "#2563EB",
      gradient: "from-blue-500/20 to-indigo-600/20",
      onClick: () => window.open("https://ecolemaria.com", "_blank"),
    },
    {
      icon: Mail,
      label: "Email",
      color: "#EA4335",
      gradient: "from-red-500/20 to-orange-600/20",
      onClick: () => window.location.href = "mailto:recyclagemaria@gmail.com",
    },
    {
      icon: Heart,
      label: t("footer.support", "Support"),
      color: "#10B981",
      gradient: "from-emerald-500/20 to-green-600/20",
      onClick: handleSupport,
    },
    {
      icon: MessageCircle,
      label: t("footer.contact", "Contact"),
      color: "#8B5CF6",
      gradient: "from-purple-500/20 to-violet-600/20",
      onClick: handleContact,
    },
    {
      icon: RefreshCw,
      label: t("footer.refresh", "Refresh"),
      color: "#F97316",
      gradient: "from-orange-500/20 to-amber-600/20",
      onClick: handleRefresh,
    },
  ];

  // Credits data with translations
  const creditsData = [
    {
      label: t("footer.credits.projectTitle", "Project Title"),
      value: t("footer.credits.projectTitleValue", "Recycling within Maria School"),
    },
    {
      label: t("footer.credits.developer", "Developer"),
      value: "Yahia Ikni",
    },
    {
      label: t("footer.credits.hosting", "Hosting Platform"),
      value: "Vercel",
    },
    {
      label: t("footer.credits.analytics", "Analytics"),
      value: "Google Analytics",
    },
    {
      label: t("footer.credits.launch", "Project Launch"),
      value: "November 2025",
    },
    {
      label: t("footer.credits.school", "School"),
      value: "Maria School, Agadir",
    },
  ];

  // Tech stack with icons
  const techStack = [
    { name: "React", icon: "⚛️" },
    { name: "TypeScript", icon: "📘" },
    { name: "Tailwind", icon: "🎨" },
    { name: "Vercel", icon: "▲" },
    { name: "Framer", icon: "✨" },
  ];

  return (
    <>
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1], // Custom easing for smoothness
          delay: 0.1 
        }}
        className="mt-16 border-t border-gray-800 bg-[#0e1b15]"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Logo and Description */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center justify-center mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="relative mb-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden">
                {logoError ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">RM</span>
                  </div>
                ) : (
                  <img 
                    src="/logo.png" 
                    alt="Recyclage Maria Logo"
                    className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                    onError={() => setLogoError(true)}
                    onLoad={() => setLogoError(false)}
                  />
                )}
              </div>
              {/* Animated ring effect */}
              <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110" />
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2 text-center bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
            >
              {t("footer.projectName", "Recyclage Maria")}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-gray-300 text-center max-w-md mx-auto"
            >
              {t("footer.tagline", "Promoting sustainable practices at Maria School, Agadir")}
            </motion.p>
          </motion.div>

          {/* Big Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
            {actionButtons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.2 + index * 0.05,
                  ease: "backOut" 
                }}
                whileHover={!isMobileFinal ? { 
                  y: -6,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 15 }
                } : {}}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className={`
                    group relative flex flex-col items-center justify-center
                    h-20 sm:h-24 w-full p-3 gap-2 sm:gap-3
                    border border-gray-700 bg-gray-900/30
                    hover:border-transparent hover:bg-black/40
                    transition-all duration-300 ease-out
                    overflow-hidden
                    before:absolute before:inset-0 before:bg-gradient-to-br ${button.gradient}
                    before:opacity-0 before:transition-opacity before:duration-300
                    hover:before:opacity-100
                    shadow-md hover:shadow-xl
                    ${!isMobileFinal ? 'hover:scale-105' : ''}
                  `}
                  onClick={button.onClick}
                >
                  {/* Animated background effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${button.color}20 0%, transparent 50%)`,
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
                    }}
                  />
                  
                  {/* Icon with enhanced animation */}
                  <button.icon 
                    className={`
                      relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500
                      ${!isMobileFinal ? 'group-hover:scale-125 group-hover:rotate-12' : ''}
                      drop-shadow-sm
                    `}
                    style={{ color: button.color }}
                  />
                  
                  {/* Label */}
                  <span className="relative z-10 text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                    {button.label}
                  </span>
                  
                  {/* Bottom glow effect */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-16 transition-all duration-300 ease-out"
                    style={{ 
                      background: `linear-gradient(90deg, transparent, ${button.color}, transparent)`,
                      boxShadow: `0 0 8px ${button.color}`
                    }}
                  />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Maria School, Agadir • {t("footer.rights", "All rights reserved")}
            </div>

            {/* Credits Button */}
            <motion.div 
              whileHover={!isMobileFinal ? { 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size={isMobileFinal ? "sm" : "default"}
                className="group relative text-gray-300 hover:text-white bg-gray-900/50 hover:bg-emerald-900/30 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden"
                onClick={() => setShowCredits(true)}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                
                <Info className="relative z-10 w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">{t("footer.credits", "Credits")}</span>
                {!isMobileFinal && (
                  <span className="relative z-10 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">✨</span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Enhanced Credits Modal */}
      <AnimatePresence mode="wait">
        {showCredits && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCredits(false)}
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20, rotateX: 5 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8
              }}
              className={`
                relative bg-gradient-to-b from-gray-900 to-[#0a1511] border border-gray-800 
                rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-hidden
                ${isMobileFinal ? 'max-w-sm mx-4' : 'max-w-2xl'}
                transform-gpu
              `}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.1)'
              }}
            >
              {/* Header with gradient */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-900/40 to-green-900/40 p-5 border-b border-gray-800 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ 
                        rotate: { 
                          duration: 20, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg"
                    >
                      {logoError ? (
                        <span className="text-white font-bold">RM</span>
                      ) : (
                        <img 
                          src="/logo.png" 
                          alt="Logo"
                          className="w-6 h-6 object-contain"
                          onError={() => setLogoError(true)}
                        />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {t("footer.projectCredits", "Project Credits")}
                      </h3>
                      <motion.p 
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-emerald-300 text-xs sm:text-sm mt-0.5"
                      >
                        {t("footer.credits.subtitle", "Sustainable Education Initiative")}
                      </motion.p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={!isMobileFinal ? { 
                      scale: 1.1, 
                      rotate: 90,
                      backgroundColor: "rgba(255,255,255,0.1)"
                    } : {}}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCredits(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                    aria-label={t("common.close", "Close")}
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-5">
                  {/* Credits Grid */}
                  <div className={`grid gap-3 ${isMobileFinal ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {creditsData.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={!isMobileFinal ? {
                          scale: 1.02,
                          y: -2,
                          transition: { type: "spring", stiffness: 400 }
                        } : {}}
                        className="group relative bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden"
                      >
                        {/* Hover effect background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        
                        <div className="relative flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform duration-300" />
                          <span className="text-xs font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                            {item.label}
                          </span>
                        </div>
                        <span className="relative text-white font-semibold block text-base group-hover:text-emerald-300 transition-colors">
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Source Code Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={!isMobileFinal ? { scale: 1.02 } : {}}
                    className="mt-6"
                  >
                    <Button
                      variant="outline"
                      className="w-full group relative bg-gray-800/50 border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-900/20 transition-all duration-300"
                      onClick={() => window.open("https://github.com/freroxx/recyclage", "_blank")}
                    >
                      <Github className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      <span>View Source Code on GitHub</span>
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                    </Button>
                  </motion.div>

                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 pt-5 border-t border-gray-800"
                  >
                    <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-3">
                      <span>⚡</span>
                      {t("footer.credits.builtWith", "Built With")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, index) => (
                        <motion.span
                          key={tech.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          whileHover={!isMobileFinal ? { 
                            scale: 1.1, 
                            y: -2,
                            transition: { type: "spring", stiffness: 400 }
                          } : {}}
                          className="px-3 py-2 text-xs rounded-lg bg-gray-800/50 text-gray-300 border border-gray-700 hover:border-emerald-500/30 hover:bg-emerald-900/20 hover:text-emerald-300 transition-all duration-300 flex items-center gap-2"
                        >
                          <span>{tech.icon}</span>
                          <span>{tech.name}</span>
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Thank you message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-900/10 to-green-900/10 border border-emerald-800/20"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ 
                          rotate: isMobileFinal ? [0, 0] : [0, 360],
                        }}
                        transition={{ 
                          rotate: { 
                            duration: 20, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }
                        }}
                        className="text-2xl"
                      >
                        ♻️
                      </motion.div>
                      <p className="text-sm text-gray-300">
                        {t("footer.thankYou", "Thank you for supporting sustainable education!")}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer with version */}
              <div className="sticky bottom-0 p-4 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {t("footer.credits.lastUpdated", "Updated")}: 20 Dec 2025
                  </span>
                  <span className="text-xs text-emerald-400 px-2 py-1 rounded-full bg-emerald-900/20">
                    v2.1
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
