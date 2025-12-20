import { Instagram, Mail, Globe, Heart, MessageCircle, RefreshCw, Info, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
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

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-20 border-t border-gray-800 bg-[#0e1b15]"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Logo & Description */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-xl">RM</span>
            </motion.div>
            <h3 className="text-2xl font-bold text-white">
              {t("footer.projectName", "Recyclage Maria")}
            </h3>
          </div>
          <p className="text-gray-300 max-w-md mx-auto text-lg">
            {t("footer.tagline", "Promoting sustainable practices at Maria School, Agadir")}
          </p>
        </motion.div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {[
            {
              icon: Instagram,
              label: "Instagram",
              color: "pink",
              onClick: () => window.open("https://instagram.com/recyclage_projet", "_blank"),
              hoverClass: "hover:bg-pink-500/10 hover:border-pink-400 hover:scale-105 hover:shadow-pink-500/20"
            },
            {
              icon: Globe,
              label: t("footer.website", "Website"),
              color: "blue",
              onClick: () => window.open("https://ecolemaria.com", "_blank"),
              hoverClass: "hover:bg-blue-500/10 hover:border-blue-400 hover:scale-105 hover:shadow-blue-500/20"
            },
            {
              icon: Mail,
              label: "Email",
              color: "red",
              onClick: () => window.location.href = "mailto:recyclagemaria@gmail.com",
              hoverClass: "hover:bg-red-500/10 hover:border-red-400 hover:scale-105 hover:shadow-red-500/20"
            },
            {
              icon: Heart,
              label: t("footer.support", "Support"),
              color: "green",
              onClick: handleSupport,
              hoverClass: "hover:bg-green-500/10 hover:border-green-400 hover:scale-105 hover:shadow-green-500/20"
            },
            {
              icon: MessageCircle,
              label: t("footer.contact", "Contact"),
              color: "purple",
              onClick: handleContact,
              hoverClass: "hover:bg-purple-500/10 hover:border-purple-400 hover:scale-105 hover:shadow-purple-500/20"
            },
            {
              icon: RefreshCw,
              label: t("footer.refresh", "Refresh"),
              color: "orange",
              onClick: handleRefresh,
              hoverClass: "hover:bg-orange-500/10 hover:border-orange-400 hover:scale-105 hover:shadow-orange-500/20"
            }
          ].map((button, index) => (
            <motion.div
              key={button.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
              whileHover={{ y: -4 }}
            >
              <Button
                variant="outline"
                className={`
                  group relative flex flex-col h-auto py-5 gap-3
                  border-gray-700 bg-gray-900/30 backdrop-blur-sm
                  text-white transition-all duration-300 ease-out
                  ${button.hoverClass}
                  hover:shadow-lg
                `}
                onClick={button.onClick}
              >
                <button.icon className={`
                  w-6 h-6 transition-all duration-300
                  group-hover:scale-110
                  ${button.color === 'pink' ? 'text-pink-400' : ''}
                  ${button.color === 'blue' ? 'text-blue-400' : ''}
                  ${button.color === 'red' ? 'text-red-400' : ''}
                  ${button.color === 'green' ? 'text-green-400' : ''}
                  ${button.color === 'purple' ? 'text-purple-400' : ''}
                  ${button.color === 'orange' ? 'text-orange-400' : ''}
                `} />
                <span className="text-sm font-medium tracking-wide">
                  {button.label}
                </span>
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Copyright */}
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Maria School, Agadir • {t("footer.rights", "All rights reserved")}
          </div>

          {/* Credits Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="group text-gray-300 hover:text-white border border-gray-700 hover:border-emerald-500/50 bg-gray-900/30 backdrop-blur-sm transition-all duration-300"
              onClick={() => setShowCredits(true)}
            >
              <Info className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              {t("footer.credits", "Credits")}
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

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
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-gradient-to-b from-gray-900 to-[#0e1b15] border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {t("footer.projectCredits", "Project Credits")}
                    </h3>
                    <p className="text-emerald-300 mt-1">Recycling Initiative</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCredits(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {[
                  { label: "Project Title", value: "Recycling within Maria School" },
                  { label: "Developer", value: "Yahia Ikni" },
                  { label: "Hosting Platform", value: "Vercel" },
                  { label: "Analytics", value: "Google Analytics" },
                  { label: "Project Launch", value: "November 2025" },
                  { label: "School", value: "Maria School, Agadir" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0 group"
                  >
                    <span className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {item.label}:
                    </span>
                    <span className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {item.value}
                    </span>
                  </motion.div>
                ))}

                {/* Tech Stack */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-6 border-t border-gray-800"
                >
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Built With</h4>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs rounded-full bg-emerald-900/30 text-emerald-300 border border-emerald-800/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-gray-800 bg-black/20">
                <div className="text-center">
                  <p className="text-sm text-gray-300">
                    {t("footer.thankYou", "Thank you for supporting sustainable education!")}
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block mt-2"
                  >
                    <span className="text-2xl">🌱</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.footer>
  );
}
