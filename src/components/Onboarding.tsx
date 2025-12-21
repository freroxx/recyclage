import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type Theme = 'light' | 'dark';
type Language = 'en' | 'fr';

interface OnboardingData {
  theme: Theme;
  language: Language;
  name: string;
  onboarded: boolean;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [name, setName] = useState<string>('');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [touched, setTouched] = useState({
    name: false,
    theme: false,
    language: false
  });

  // Auto-détection du thème et langue système
  useEffect(() => {
    // Détecter le thème système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light';
    
    // Détecter la langue navigateur
    const browserLang = navigator.language.startsWith('fr') ? 'fr' : 'en';
    
    // Appliquer avec un léger délai pour l'animation
    setTimeout(() => {
      setTheme(systemTheme);
      setLanguage(browserLang);
    }, 300);
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Sauvegarder les données et naviguer
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setTouched(prev => ({ ...prev, name: true }));
      return;
    }

    setIsExiting(true);
    
    const onboardingData: OnboardingData = {
      theme,
      language,
      name: name.trim(),
      onboarded: true,
    };

    // Sauvegarder avec une clé unique
    localStorage.setItem('app:onboarding', JSON.stringify(onboardingData));
    
    // Redirection avec délai pour l'animation
    setTimeout(() => {
      navigate('/app', { replace: true });
    }, 500);
  }, [theme, language, name, navigate]);

  // Traductions
  const translations = {
    en: {
      welcome: 'Welcome',
      subtitle: 'Let\'s personalize your experience',
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your name',
      themeLabel: 'Theme',
      languageLabel: 'Language',
      getStarted: 'Get Started',
      light: 'Light',
      dark: 'Dark',
      english: 'English',
      french: 'Français',
      preview: 'Preview',
      englishInterface: 'English interface',
      frenchInterface: 'Interface française'
    },
    fr: {
      welcome: 'Bienvenue',
      subtitle: 'Personnalisons votre expérience',
      nameLabel: 'Votre nom',
      namePlaceholder: 'Entrez votre nom',
      themeLabel: 'Thème',
      languageLabel: 'Langue',
      getStarted: 'Commencer',
      light: 'Clair',
      dark: 'Sombre',
      english: 'Anglais',
      french: 'Français',
      preview: 'Aperçu',
      englishInterface: 'Interface anglaise',
      frenchInterface: 'Interface française'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 transition-colors duration-700">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-200/5 to-purple-200/5 rounded-full blur-3xl" />
      </div>

      {/* Carte principale */}
      <div className={`
        relative w-full max-w-md
        animate-scale-in animate-fade-in
        transition-all duration-500 ease-out
        ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
      `}>
        <div className="
          backdrop-blur-xl backdrop-saturate-150
          bg-white/85 dark:bg-gray-800/85
          border border-white/40 dark:border-gray-700/40
          rounded-3xl
          shadow-2xl shadow-black/5 dark:shadow-black/20
          p-6 sm:p-8
          transform-gpu
          transition-all duration-300
          hover:shadow-3xl hover:shadow-black/10 dark:hover:shadow-black/30
          hover:border-white/60 dark:hover:border-gray-600/60
          group/card
        ">
          {/* En-tête */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-2 group-hover/card:from-blue-500/15 group-hover/card:to-purple-500/15 transition-all duration-500">
              <div className="text-3xl">✨</div>
            </div>
            <h1 className="
              text-4xl font-bold tracking-tight
              bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 dark:from-blue-400 dark:via-blue-300 dark:to-purple-400
              bg-clip-text text-transparent
            ">
              {t.welcome}
            </h1>
            <p className="
              text-gray-600 dark:text-gray-300
              text-lg font-medium
              animate-fade-in-delay
            ">
              {t.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div className="space-y-2">
              <label className="
                block text-sm font-semibold 
                text-gray-700 dark:text-gray-200
                pl-1
              ">
                {t.nameLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTouched(prev => ({ ...prev, name: true }));
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  placeholder={t.namePlaceholder}
                  required
                  minLength={2}
                  maxLength={50}
                  className={`
                    w-full px-4 py-3.5
                    bg-white/60 dark:bg-gray-700/60
                    border ${touched.name && !name.trim() ? 'border-red-300 dark:border-red-400' : 'border-gray-300/60 dark:border-gray-600/60'}
                    rounded-xl
                    focus:outline-none focus:ring-3 focus:ring-blue-500/30
                    focus:border-blue-400 dark:focus:border-blue-300
                    placeholder-gray-500/70 dark:placeholder-gray-400/70
                    text-gray-900 dark:text-white
                    transition-all duration-200
                    hover:border-gray-400 dark:hover:border-gray-500
                    hover:bg-white/80 dark:hover:bg-gray-700/80
                    peer
                    pl-12
                  `}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 peer-focus:text-blue-500 transition-colors">
                  👤
                </div>
                {touched.name && !name.trim() && (
                  <p className="absolute -bottom-5 left-1 text-xs text-red-500 animate-fade-in">
                    Please enter your name
                  </p>
                )}
              </div>
            </div>

            {/* Sélecteur de thème */}
            <div className="space-y-3">
              <label className="
                block text-sm font-semibold 
                text-gray-700 dark:text-gray-200
                pl-1
              ">
                {t.themeLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['light', 'dark'] as Theme[]).map((themeOption) => (
                  <button
                    key={themeOption}
                    type="button"
                    onClick={() => {
                      setTheme(themeOption);
                      setTouched(prev => ({ ...prev, theme: true }));
                    }}
                    className={`
                      flex items-center justify-center gap-3
                      px-4 py-3.5
                      rounded-xl
                      border-2
                      transition-all duration-200
                      ${theme === themeOption 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-900/30 dark:to-blue-900/10' 
                        : 'border-transparent bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                      }
                      hover:scale-[1.02] active:scale-[0.98]
                      group/theme
                    `}
                    aria-pressed={theme === themeOption}
                  >
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${theme === themeOption 
                        ? 'scale-110' 
                        : 'scale-100 group-hover/theme:scale-110'
                      }
                    `}>
                      <div className={`
                        w-3 h-3 rounded-full
                        ${themeOption === 'light' 
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]' 
                          : 'bg-gradient-to-br from-gray-800 to-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        }
                      `} />
                    </div>
                    <span className="
                      font-semibold
                      text-gray-700 dark:text-gray-200
                    ">
                      {themeOption === 'light' ? t.light : t.dark}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sélecteur de langue */}
            <div className="space-y-3">
              <label className="
                block text-sm font-semibold 
                text-gray-700 dark:text-gray-200
                pl-1
              ">
                {t.languageLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['en', 'fr'] as Language[]).map((langOption) => (
                  <button
                    key={langOption}
                    type="button"
                    onClick={() => {
                      setLanguage(langOption);
                      setTouched(prev => ({ ...prev, language: true }));
                    }}
                    className={`
                      flex items-center justify-center gap-3
                      px-4 py-3.5
                      rounded-xl
                      border-2
                      transition-all duration-200
                      ${language === langOption 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/30 dark:to-purple-900/10' 
                        : 'border-transparent bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                      }
                      hover:scale-[1.02] active:scale-[0.98]
                      group/lang
                    `}
                    aria-pressed={language === langOption}
                  >
                    <span className={`
                      text-xl transition-transform duration-300
                      ${language === langOption 
                        ? 'scale-110' 
                        : 'scale-100 group-hover/lang:scale-110'
                      }
                    `}>
                      {langOption === 'en' ? '🇬🇧' : '🇫🇷'}
                    </span>
                    <span className="
                      font-semibold
                      text-gray-700 dark:text-gray-200
                    ">
                      {langOption === 'en' ? t.english : t.french}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="
                w-full
                py-3.5
                bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600
                hover:from-blue-700 hover:via-blue-600 hover:to-purple-700
                disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-500
                disabled:cursor-not-allowed
                text-white font-semibold
                rounded-xl
                shadow-lg shadow-blue-500/25
                hover:shadow-xl hover:shadow-blue-500/35
                transform-gpu
                transition-all duration-300
                hover:scale-[1.02] active:scale-[0.98]
                disabled:hover:scale-100
                disabled:opacity-50
                group/button
                overflow-hidden relative
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t.getStarted}
                <span className="
                  transition-transform duration-300
                  group-hover/button:translate-x-1
                ">
                  →
                </span>
              </span>
              {/* Effet de brillance au survol */}
              <span className="
                absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                -translate-x-full
                group-hover/button:translate-x-full
                transition-transform duration-700
              " />
            </button>
          </form>

          {/* Aperçu */}
          <div className="
            mt-8 pt-6
            border-t border-gray-300/40 dark:border-gray-600/40
            animate-fade-in-delay-2
          ">
            <p className="
              text-sm font-medium text-gray-600 dark:text-gray-400
              mb-3
            ">
              {t.preview}
            </p>
            <div className={`
              p-4 rounded-xl
              transition-all duration-300
              ${theme === 'dark' 
                ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 text-white' 
                : 'bg-gradient-to-br from-gray-100/80 to-white/80 text-gray-900'
              }
              border border-gray-300/30 dark:border-gray-700/30
              transform-gpu
              group-hover/card:scale-[1.02]
              group-hover/card:shadow-md
            `}>
              <div className="flex items-center gap-3">
                <div className="
                  w-10 h-10
                  rounded-full
                  bg-gradient-to-r from-blue-500 to-purple-500
                  flex items-center justify-center text-white font-bold
                  shadow-md
                ">
                  {name.trim() ? name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {name.trim() || t.namePlaceholder}
                  </p>
                  <p className="text-sm opacity-75 truncate">
                    {language === 'en' ? t.englishInterface : t.frenchInterface}
                  </p>
                </div>
                <div className={`
                  w-3 h-3 rounded-full
                  ${theme === 'light' 
                    ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
                    : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                  }
                `} />
              </div>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs flottants */}
        <div className="absolute -z-10 -top-6 -left-6 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -z-10 -bottom-6 -right-6 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl animate-float-slow-reverse" />
      </div>
    </div>
  );
};

export default Onboarding;
