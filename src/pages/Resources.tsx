import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Palette, 
  Video, 
  ImageIcon, 
  ArrowRight, 
  Sparkles, 
  BookOpen,
  Download,
  PlayCircle,
  Gamepad2,
  ChevronRight,
  ExternalLink,
  Star,
  TrendingUp,
  Users
} from "lucide-react";

export default function Resources() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const resources = [
    { 
      icon: FileText, 
      key: "guides", 
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      gradient: "from-blue-500/10 to-cyan-500/10",
      description: language === "fr" ? "Apprenez les bases du tri sélectif" : "Learn the basics of sorting",
      stats: language === "fr" ? "3 guides disponibles" : "3 guides available",
      actionIcon: Download,
      path: "/guide"
    },
    { 
      icon: Palette, 
      key: "activities", 
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      gradient: "from-purple-500/10 to-pink-500/10",
      description: language === "fr" ? "Jeux et activités interactifs" : "Interactive games and activities",
      stats: language === "fr" ? "4 activités interactives" : "4 interactive activities",
      actionIcon: Gamepad2,
      path: "/activities"
    },
    { 
      icon: Video, 
      key: "videos", 
      color: "text-red-500", 
      bg: "bg-red-500/10",
      borderColor: "border-red-500/20",
      gradient: "from-red-500/10 to-orange-500/10",
      description: language === "fr" ? "Vidéos éducatives sur le recyclage" : "Educational videos on recycling",
      stats: language === "fr" ? "9 vidéos" : "9 videos",
      actionIcon: PlayCircle,
      path: "/videos"
    },
    { 
      icon: ImageIcon, 
      key: "posters", 
      color: "text-green-500", 
      bg: "bg-green-500/10",
      borderColor: "border-green-500/20",
      gradient: "from-green-500/10 to-emerald-500/10",
      description: language === "fr" ? "Affiches à imprimer et partager" : "Posters to print and share",
      stats: language === "fr" ? "7 modèles gratuits" : "7 free templates",
      actionIcon: Download,
      path: "/posters"
    },
  ];

  const featuredStats = [
    { icon: Users, label: language === "fr" ? "Utilisateurs" : "Users", value: "114" },
    { icon: Star, label: language === "fr" ? "Évaluations" : "Ratings", value: "4/5" },
    { icon: TrendingUp, label: language === "fr" ? "Engagement" : "Engagement", value: "100%" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 overflow-hidden">
      {/* Animated background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header with enhanced animations */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-primary/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === "fr" ? "Centre de Ressources" : "Resource Center"}</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-primary via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("resources.title")}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {t("resources.subtitle")}
            </motion.p>

            {/* Stats bar */}
            <motion.div 
              className="flex flex-wrap justify-center gap-6 md:gap-12 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {featuredStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-bold text-xl">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Resources Grid with enhanced animations */}
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={resource.key}
                variants={itemVariants}
                custom={index}
              >
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredCard(resource.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="h-full"
                >
                  <Card
                    className={`
                      h-full border-2 ${resource.borderColor} 
                      cursor-pointer overflow-hidden 
                      backdrop-blur-sm bg-card/50
                      transition-all duration-300
                      hover:shadow-2xl hover:shadow-primary/10
                      group
                    `}
                    onClick={() => navigate(resource.path)}
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-br ${resource.gradient}`} />
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                      <div className={`absolute -inset-1 bg-gradient-to-r ${resource.gradient} blur-lg`} />
                    </div>

                    <CardContent className="p-6 md:p-8 relative h-full flex flex-col">
                      {/* Icon container with animation */}
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl ${resource.bg} flex items-center justify-center mb-6 
                          shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        animate={{ 
                          rotate: hoveredCard === resource.key ? [0, 10, -10, 0] : 0,
                          scale: hoveredCard === resource.key ? 1.1 : 1
                        }}
                        transition={{ 
                          rotate: { duration: 0.6 },
                          scale: { type: "spring", stiffness: 200 }
                        }}
                      >
                        <resource.icon className={`w-7 h-7 ${resource.color}`} />
                      </motion.div>

                      <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                        {t(`resources.${resource.key}`)}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 flex-grow">
                        {resource.description}
                      </p>

                      {/* Stats badge */}
                      <div className="mb-6">
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground">
                          <resource.actionIcon className="w-3 h-3" />
                          {resource.stats}
                        </span>
                      </div>

                      {/* Action button with animation */}
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Button 
                          variant="outline" 
                          className="w-full group/btn border-2 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          <span className="flex items-center justify-center w-full">
                            {t("resources.view")}
                            <motion.span
                              animate={{ 
                                x: hoveredCard === resource.key ? 5 : 0 
                              }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </motion.span>
                          </span>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-16"
          >
            <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-sm bg-card/50">
              <div className="bg-gradient-to-r from-primary/10 via-green-500/10 to-primary/10 p-8 md:p-12 relative">
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-primary/20 rounded-full"
                      animate={{
                        y: [0, -30, 0],
                        x: [0, Math.sin(i) * 20, 0],
                        opacity: [0.2, 0.5, 0.2]
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + i * 10}%`
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                  >
                    <Sparkles className="w-12 h-12 text-primary" />
                  </motion.div>
                  
                  <h2 className="text-2xl md:text-4xl font-bold mb-4">
                    {language === "fr" ? "Prêt à commencer ?" : "Ready to start?"}
                  </h2>
                  
                  <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
                    {language === "fr" 
                      ? "Explorez nos ressources et devenez un champion du recyclage !"
                      : "Explore our resources and become a recycling champion!"}
                  </p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="px-10 py-7 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                      onClick={() => navigate("/guide")}
                    >
                      <span className="flex items-center">
                        {language === "fr" ? "Commencer le guide" : "Start the guide"}
                        <ArrowRight className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-2" />
                      </span>
                    </Button>
                  </motion.div>
                  
                  <p className="text-sm text-muted-foreground mt-6">
                    {language === "fr" 
                      ? "Accès gratuit à toutes les ressources"
                      : "Free access to all resources"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-8">
              {language === "fr" ? "Navigation rapide" : "Quick Navigation"}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                className="gap-2 hover:bg-secondary"
                onClick={() => navigate("/")}
              >
                {language === "fr" ? "Accueil" : "Home"}
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 hover:bg-secondary"
                onClick={() => navigate("/project")}
              >
                {language === "fr" ? "Notre projet" : "Our project"}
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="gap-2 hover:bg-secondary"
                onClick={() => navigate("/contact")}
              >
                {language === "fr" ? "Contact" : "Contact"}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
