import { Instagram, Mail, Globe, Heart, MessageCircle, RefreshCw, Info, X } from "lucide-react";
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

  useEffect(() => {
    setIsVisible(true);
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

  // Action buttons configuration
  const actionButtons = [
    {
      icon: Instagram,
      label: "Instagram",
      color: "#E4405F",
      onClick: () => window.open("https://instagram.com/recyclage_projet", "_blank"),
    },
    {
      icon: Globe,
      label: t("footer.website", "Website"),
      color: "#2563EB",
      onClick: () => window.open("https://ecolemaria.com", "_blank"),
    },
    {
      icon: Mail,
      label: "Email",
      color: "#EA4335",
      onClick: () => window.location.href = "mailto:recyclagemaria@gmail.com",
    },
    {
      icon: Heart,
      label: t("footer.support", "Support"),
      color: "#10B981",
      onClick: handleSupport,
    },
    {
      icon: MessageCircle,
      label: t("footer.contact", "Contact"),
      color: "#8B5CF6",
      onClick: handleContact,
    },
    {
      icon: RefreshCw,
      label: t("footer.refresh", "Refresh"),
      color: "#F97316",
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

  return (
    <>
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-16 border-t border-gray-800 bg-[#0e1b15]"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-center justify-center mb-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <img 
                  src="/src/assets/logo.png" 
                  alt="Recyclage Maria Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/40/10B981/FFFFFF?text=RM";
                  }}
                />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold text-white mb-2 text-center"
            >
              {t("footer.projectName", "Recyclage Maria")}
            </motion.h3>
            
            <p className="text-gray-300 text-center max-w-md mx-auto">
              {t("footer.tagline", "Promoting sustainable practices at Maria School, Agadir")}
            </p>
          </div>

          {/* Big Action Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
            {actionButtons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className={`
                    group relative flex flex-col items-center justify-center
                    h-24 sm:h-28 w-full p-4 gap-3
                    border-2 border-gray-700 bg-gray-900/40
                    hover:border-current hover:bg-black/30
                    transition-all duration-300 ease-out
                    ${isMobile ? 'active:scale-95' : 'hover:scale-105'}
                    overflow-hidden
                  `}
                  onClick={button.onClick}
                  style={{
                    '--hover-color': button.color,
                  } as React.CSSProperties}
                >
                  {/* Background glow on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at center, ${button.color}15 0%, transparent 70%)`,
                    }}
                  />
                  
                  {/* Icon */}
                  <button.icon 
                    className={`
                      w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300
                      group-hover:scale-110 group-hover:rotate-3
                    `}
                    style={{ color: button.color }}
                  />
                  
                  {/* Label */}
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {button.label}
                  </span>
                  
                  {/* Hover effect line */}
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 group-hover:w-16 transition-all duration-300"
                    style={{ backgroundColor: button.color }}
                  />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Maria School, Agadir • {t("footer.rights", "All rights reserved")}
            </div>

            {/* Credits Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                variant="ghost"
                size={isMobile ? "sm" : "default"}
                className="group text-gray-300 hover:text-white bg-gray-900/50 hover:bg-emerald-900/30 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300"
                onClick={() => setShowCredits(true)}
              >
                <Info className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                {t("footer.credits", "Credits")}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>

      {/* Enhanced Credits Modal */}
      <AnimatePresence>
        {showCredits && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCredits(false)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                mass: 0.8 
              }}
              className={`
                relative bg-gray-900 border border-gray-700 rounded-2xl 
                shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden
                ${isMobile ? 'mx-4' : ''}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-900/50 to-green-900/50 p-6 border-b border-gray-800 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {t("footer.projectCredits", "Project Credits")}
                    </h3>
                    <p className="text-emerald-300 text-sm mt-1">
                      {t("footer.credits.subtitle", "Sustainable Education Initiative")}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCredits(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label={t("common.close", "Close")}
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
                <div className="p-6">
                  {/* Credits Grid - Two Columns on Desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {creditsData.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-gray-400">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-white font-semibold block text-lg">
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 pt-6 border-t border-gray-800"
                  >
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                      <span>⚡</span>
                      {t("footer.credits.builtWith", "Built With")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "TypeScript", "Tailwind", "Vercel"].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-2 text-sm rounded-lg bg-emerald-900/30 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-800/40 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Footer with CTA */}
              <div className="sticky bottom-0 p-6 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-3">
                    {t("footer.thankYou", "Thank you for supporting sustainable education!")}
                  </p>
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="inline-block"
                  >
                    <span className="text-3xl">♻️</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
