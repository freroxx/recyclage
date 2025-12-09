import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Empêche le rendu côté serveur (hydration mismatch)
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const handleThemeToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    // Ajoute une transition de fond lors du changement de thème
    document.documentElement.style.transition = `
      background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
      color 0.5s cubic-bezier(0.4, 0, 0.2, 1)
    `;
    
    setTheme(isDark ? "light" : "dark");
    
    // Réinitialise l'animation après un délai
    setTimeout(() => {
      setIsAnimating(false);
      document.documentElement.style.transition = "";
    }, 500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Toggle theme"
      className={`
        relative w-10 h-10
        transition-all duration-300
        ${isHovered ? 'scale-110' : 'scale-100'}
        ${isAnimating ? 'cursor-wait' : 'cursor-pointer'}
        hover:bg-accent/10
        rounded-full
      `}
      disabled={isAnimating}
    >
      {/* Fond circulaire animé */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          scale: isHovered ? 1 : 0.8,
          opacity: isHovered ? 0.1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut"
        }}
      >
        <div className={`
          absolute inset-0 rounded-full
          ${isDark ? 'bg-blue-500' : 'bg-amber-500'}
        `} />
      </motion.div>

      {/* Animation de particules lors du changement */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="particles"
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`
                  absolute w-1 h-1 rounded-full
                  ${isDark ? 'bg-blue-400' : 'bg-amber-400'}
                `}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0.8,
                  scale: 0,
                }}
                animate={{
                  x: Math.cos((i * Math.PI) / 4) * 20,
                  y: Math.sin((i * Math.PI) / 4) * 20,
                  opacity: 0,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icône Soleil avec animations améliorées */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 90 : 0,
          scale: isDark ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          mass: 0.5,
        }}
        style={{
          transformOrigin: "center",
        }}
      >
        <motion.div
          animate={{
            rotate: isHovered && !isDark ? 180 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <Sun className="h-5 w-5 text-amber-600 dark:text-amber-500/80" />
        </motion.div>
      </motion.div>

      {/* Icône Lune avec animations améliorées */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          rotate: isDark ? 0 : -90,
          scale: isDark ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          mass: 0.5,
        }}
        style={{
          transformOrigin: "center",
        }}
      >
        <motion.div
          animate={{
            rotate: isHovered && isDark ? 180 : 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <Moon className="h-5 w-5 text-blue-700 dark:text-blue-400" />
        </motion.div>
      </motion.div>

      {/* Effet de halo */}
      <motion.div
        className="absolute -inset-2 rounded-full opacity-0"
        animate={{
          opacity: isHovered ? 0.2 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <div className={`
          absolute inset-0 rounded-full blur-md
          ${isDark ? 'bg-blue-500' : 'bg-amber-500'}
        `} />
      </motion.div>

      {/* Animation de transition de thème */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="transition-overlay"
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 2, 2, 0],
              opacity: [0, 0.3, 0.3, 0]
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <div className={`
              absolute inset-0 rounded-full
              ${isDark ? 'bg-blue-400/30' : 'bg-amber-400/30'}
              blur-sm
            `} />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

// Version alternative simplifiée pour une meilleure performance
export function ThemeToggleSimple() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Toggle theme"
      className={`
        relative w-9 h-9
        transition-all duration-300
        hover:scale-110 hover:bg-accent/10
        rounded-full
        group
      `}
    >
      {/* Animation de fond au hover */}
      <div className={`
        absolute inset-0 rounded-full
        transition-all duration-300
        ${isHovered ? 'opacity-10 scale-110' : 'opacity-0 scale-100'}
        ${isDark ? 'bg-blue-500' : 'bg-amber-500'}
      `} />

      {/* Soleil */}
      <Sun
        className={`
          absolute h-5 w-5
          transition-all duration-500
          ${isDark 
            ? "rotate-90 scale-0 opacity-0" 
            : "rotate-0 scale-100 opacity-100 group-hover:rotate-180"
          }
          ${isDark ? 'text-blue-400' : 'text-amber-600'}
        `}
      />
      
      {/* Lune */}
      <Moon
        className={`
          absolute h-5 w-5
          transition-all duration-500
          ${isDark 
            ? "rotate-0 scale-100 opacity-100 group-hover:rotate-180" 
            : "-rotate-90 scale-0 opacity-0"
          }
          ${isDark ? 'text-blue-400' : 'text-amber-600'}
        `}
      />

      {/* Effet de halo subtil */}
      <div className={`
        absolute -inset-1 rounded-full
        transition-opacity duration-300
        ${isHovered ? 'opacity-20' : 'opacity-0'}
        ${isDark 
          ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-sm' 
          : 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-sm'
        }
      `} />
    </Button>
  );
}

// Version avec gradient animé
export function ThemeToggleGradient() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Toggle theme"
      className={`
        relative w-10 h-10
        transition-all duration-500
        hover:scale-110
        rounded-full
        group
        overflow-hidden
      `}
    >
      {/* Gradient de fond animé */}
      <div className={`
        absolute inset-0
        transition-all duration-1000
        ${isHovered ? 'opacity-100' : 'opacity-60'}
        ${isDark 
          ? 'bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20' 
          : 'bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-yellow-400/20'
        }
        animate-pulse-slow
      `} />

      {/* Bordures animées */}
      <div className={`
        absolute inset-0 rounded-full
        transition-all duration-500
        ${isHovered ? 'border-2' : 'border'}
        ${isDark 
          ? 'border-blue-500/30 hover:border-blue-400/50' 
          : 'border-amber-500/30 hover:border-amber-400/50'
        }
      `} />

      {/* Icônes */}
      <div className="relative z-10">
        <Sun
          className={`
            absolute inset-0 m-auto h-5 w-5
            transition-all duration-700
            ${isDark 
              ? "rotate-180 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100"
            }
            ${isDark ? 'text-blue-300' : 'text-amber-600'}
            group-hover:scale-125
          `}
        />
        <Moon
          className={`
            absolute inset-0 m-auto h-5 w-5
            transition-all duration-700
            ${isDark 
              ? "rotate-0 scale-100 opacity-100" 
              : "rotate-180 scale-0 opacity-0"
            }
            ${isDark ? 'text-blue-300' : 'text-amber-600'}
            group-hover:scale-125
          `}
        />
      </div>

      {/* Effet de glow au hover */}
      <div className={`
        absolute -inset-2 rounded-full blur-xl
        transition-opacity duration-500
        ${isHovered ? 'opacity-40' : 'opacity-0'}
        ${isDark 
          ? 'bg-gradient-to-r from-blue-500/40 to-purple-500/40' 
          : 'bg-gradient-to-r from-amber-500/40 to-orange-500/40'
        }
      `} />
    </Button>
  );
}

// Ajouter ces styles CSS globaux pour les animations
const themeToggleStyles = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }

  /* Transition fluide pour tout le document lors du changement de thème */
  * {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  /* Transition spécifique pour les éléments qui changent radicalement */
  .theme-transition {
    transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

// Hook pour ajouter les styles globaux
export function useThemeToggleStyles() {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = themeToggleStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
}
