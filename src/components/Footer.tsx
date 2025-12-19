import { Instagram, Mail, Globe, Heart, MessageCircle, RefreshCw, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showCredits, setShowCredits] = useState(false);

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
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        
        {/* Top Section: Logo & Description */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">RM</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("footer.projectName", "Recyclage Maria")}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t("footer.tagline", "Promoting sustainable practices at Maria School, Agadir")}
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {/* Instagram */}
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-200 dark:hover:border-pink-800"
            onClick={() => window.open("https://instagram.com/recyclage_projet", "_blank")}
          >
            <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-500" />
            <span className="text-sm font-medium">Instagram</span>
          </Button>

          {/* School Website */}
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800"
            onClick={() => window.open("https://ecolemaria.com", "_blank")}
          >
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <span className="text-sm font-medium">{t("footer.website", "Website")}</span>
          </Button>

          {/* Email */}
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800"
            onClick={() => window.location.href = "mailto:recyclagemaria@gmail.com"}
          >
            <Mail className="w-5 h-5 text-red-600 dark:text-red-500" />
            <span className="text-sm font-medium">Email</span>
          </Button>

          {/* Support Us */}
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800"
            onClick={handleSupport}
          >
            <Heart className="w-5 h-5 text-green-600 dark:text-green-500" />
            <span className="text-sm font-medium">{t("footer.support", "Support")}</span>
          </Button>

          {/* Contact Us */}
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-200 dark:hover:border-purple-800"
            onClick={handleContact}
          >
            <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-500" />
            <span className="text-sm font-medium">{t("footer.contact", "Contact")}</span>
          </Button>

          {/* Refresh Page */}
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 gap-2 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 dark:hover:border-orange-800"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-5 h-5 text-orange-600 dark:text-orange-500" />
            <span className="text-sm font-medium">{t("footer.refresh", "Refresh")}</span>
          </Button>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Maria School, Agadir • {t("footer.rights", "All rights reserved")}
          </div>

          {/* Credits Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => setShowCredits(true)}
          >
            <Info className="w-4 h-4 mr-2" />
            {t("footer.credits", "Credits")}
          </Button>
        </div>
      </div>

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("footer.projectCredits", "Project Credits")}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCredits(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </Button>
            </div>

            {/* Credits List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Project Title:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Recycling within Maria School</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Developer:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Yahia Ikni</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Hosting Platform:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Vercel</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Analytics:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Google Analytics</span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Project Launch:</span>
                <span className="font-semibold text-gray-900 dark:text-white">November 2025</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">School:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Maria School, Agadir</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("footer.thankYou", "Thank you for supporting sustainable education!")}
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
