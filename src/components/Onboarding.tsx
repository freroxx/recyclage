import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  User, 
  Globe, 
  Flag, 
  Check,
  Palette,
  Languages,
  ArrowRight,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

type Theme = 'light' | 'dark';
type Language = 'en' | 'fr';

interface OnboardingData {
  theme: Theme;
  language: Language;
  name: string;
  onboarded: boolean;
}

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('fr');
  const [name, setName] = useState<string>('');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [touched, setTouched] = useState({
    name: false,
    theme: false,
    language: false
  });

  // Steps configuration
  const steps = useMemo(() => [
    { id: 'language', icon: Globe, titleKey: 'languageLabel', subtitleKey: 'languageSubtitle' },
    { id: 'theme', icon: Palette, titleKey: 'themeLabel', subtitleKey: 'themeSubtitle' },
    { id: 'name', icon: User, titleKey: 'nameLabel', subtitleKey: 'nameSubtitle' },
    { id: 'complete', icon: Check, titleKey: 'ready', subtitleKey: 'readySubtitle' }
  ], []);

  // Auto-détection du thème système
  useEffect(() => {
    const detectSystemTheme = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light';
      
      // Petit délai pour l'animation d'entrée
      setTimeout(() => {
        setTheme(systemTheme);
        setIsLoading(false);
      }, 800);
    };

    detectSystemTheme();
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

  // Gestionnaire de soumission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setTouched(prev => ({ ...prev, name: true }));
      setStep(2);
      return;
    }

    setIsExiting(true);
    
    const onboardingData: OnboardingData = {
      theme,
      language,
      name: name.trim(),
      onboarded: true,
    };

    localStorage.setItem('app:onboarding', JSON.stringify(onboardingData));
    
    setTimeout(() => {
      onComplete();
      navigate('/', { replace: true });
    }, 600);
  }, [theme, language, name, navigate, onComplete]);

  // Traductions
  const translations = useMemo(() => ({
    en: {
      languageLabel: 'Select Language',
      languageSubtitle: 'Choose your preferred language',
      themeLabel: 'Choose Theme',
      themeSubtitle: 'Select your visual preference',
      nameLabel: 'Your Name',
      nameSubtitle: 'Enter your full name',
      namePlaceholder: 'Enter your name',
      getStarted: 'Continue to Dashboard',
      light: 'Light Mode',
      dark: 'Dark Mode',
      english: 'English',
      french: 'Français',
      profile: 'Profile',
      englishInterface: 'English',
      frenchInterface: 'Français',
      errorNameRequired: 'Please enter your name',
      ready: 'Setup Complete',
      readySubtitle: 'Your preferences have been saved',
      stepLanguage: 'Language',
      stepTheme: 'Theme',
      stepName: 'Profile',
      stepComplete: 'Complete',
      continue: 'Continue',
      back: 'Back'
    },
    fr: {
      languageLabel: 'Sélectionnez la langue',
      languageSubtitle: 'Choisissez votre langue préférée',
      themeLabel: 'Choisissez le thème',
      themeSubtitle: 'Sélectionnez votre préférence visuelle',
      nameLabel: 'Votre nom',
      nameSubtitle: 'Entrez votre nom complet',
      namePlaceholder: 'Entrez votre nom',
      getStarted: 'Continuer vers le tableau de bord',
      light: 'Mode Clair',
      dark: 'Mode Sombre',
      english: 'Anglais',
      french: 'Français',
      profile: 'Profil',
      englishInterface: 'Anglais',
      frenchInterface: 'Français',
      errorNameRequired: 'Veuillez entrer votre nom',
      ready: 'Configuration terminée',
      readySubtitle: 'Vos préférences ont été enregistrées',
      stepLanguage: 'Langue',
      stepTheme: 'Thème',
      stepName: 'Profil',
      stepComplete: 'Terminé',
      continue: 'Continuer',
      back: 'Retour'
    }
  }), []);

  const t = translations[language];

  // Écran de chargement amélioré
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-light via-white to-eco-light/30 dark:from-eco-dark dark:via-gray-900 dark:to-eco-dark/30">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            {/* Animation de chargement circulaire */}
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-eco-green border-r-eco-green/30 animate-spin-slow" />
            
            {/* Points de progression */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse delay-150" />
                <div className="w-2 h-2 rounded-full bg-eco-green animate-pulse delay-300" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse-slow">
              {language === 'en' ? 'Initializing your experience...' : 'Initialisation de votre expérience...'}
            </p>
            <p className="text-sm text-eco-green dark:text-eco-emerald">
              {language === 'en' ? 'Loading preferences' : 'Chargement des préférences'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-eco-light via-white to-eco-light/30 dark:from-eco-dark dark:via-gray-900 dark:to-eco-dark/30 transition-colors duration-500">
      {/* Effet de glow autour de la carte */}
      <div className={`
        absolute inset-0 pointer-events-none
        ${theme === 'dark' 
          ? 'bg-gradient-radial from-eco-dark/20 via-transparent to-transparent' 
          : 'bg-gradient-radial from-eco-light/20 via-transparent to-transparent'
        }
      `} />

      {/* Carte principale */}
      <div className={`
        relative w-full max-w-md md:max-w-lg
        transition-all duration-500 ease-out
        ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
        ${isMobile ? 'max-w-sm' : ''}
      `}>
        {/* Glow effect autour de la carte */}
        <div className={`
          absolute -inset-4 rounded-3xl blur-2xl opacity-50
          ${theme === 'dark' 
            ? 'bg-gradient-to-r from-eco-green/20 via-eco-emerald/20 to-eco-teal/20' 
            : 'bg-gradient-to-r from-eco-green/10 via-eco-emerald/10 to-eco-teal/10'
          }
          transition-all duration-700
        `} />

        <div className="
          relative
          backdrop-blur-xl backdrop-saturate-150
          bg-white/95 dark:bg-gray-800/95
          border border-white/40 dark:border-gray-700/40
          rounded-2xl md:rounded-3xl
          shadow-xl dark:shadow-2xl dark:shadow-black/30
          p-6 md:p-8
          transform-gpu
          transition-all duration-300
          group/card
          overflow-hidden
        ">
          {/* Barre de progression minimaliste */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.id}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${index <= step 
                        ? 'bg-eco-green text-white shadow-md' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      <stepItem.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-400 hidden md:block">
                      {t[`step${stepItem.id.charAt(0).toUpperCase() + stepItem.id.slice(1)}` as keyof typeof t]}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-2 transition-all duration-300
                      ${index < step 
                        ? 'bg-eco-green' 
                        : 'bg-gray-300 dark:bg-gray-700'
                      }
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* En-tête */}
          <div className="text-center mb-8 space-y-3">
            <h1 className="
              text-2xl md:text-3xl font-bold
              text-gray-900 dark:text-white
            ">
              {t[steps[step].titleKey as keyof typeof t]}
            </h1>
            <p className="
              text-gray-600 dark:text-gray-300
              text-sm md:text-base
            ">
              {t[steps[step].subtitleKey as keyof typeof t]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* Étape 0: Langue */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 gap-3">
                  {(['fr', 'en'] as Language[]).map((langOption) => (
                    <button
                      key={langOption}
                      type="button"
                      onClick={() => {
                        setLanguage(langOption);
                        setTouched(prev => ({ ...prev, language: true }));
                      }}
                      className={`
                        flex items-center justify-between
                        p-4 md:p-5
                        rounded-xl
                        border-2
                        transition-all duration-300
                        ${language === langOption 
                          ? 'border-eco-green bg-eco-green/5' 
                          : 'border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }
                        hover:scale-[1.02] active:scale-[0.98]
                        focus-ring
                      `}
                      aria-pressed={language === langOption}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${language === langOption 
                            ? 'bg-eco-green/10 text-eco-green' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }
                        `}>
                          <Flag className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {langOption === 'en' ? t.english : t.french}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {langOption === 'en' ? t.englishInterface : t.frenchInterface}
                          </div>
                        </div>
                      </div>
                      {language === langOption && (
                        <Check className="w-5 h-5 text-eco-green" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 1: Thème */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['light', 'dark'] as Theme[]).map((themeOption) => (
                    <button
                      key={themeOption}
                      type="button"
                      onClick={() => {
                        setTheme(themeOption);
                        setTouched(prev => ({ ...prev, theme: true }));
                      }}
                      className={`
                        flex items-center justify-between
                        p-4 md:p-5
                        rounded-xl
                        border-2
                        transition-all duration-300
                        ${theme === themeOption 
                          ? 'border-eco-green bg-eco-green/5' 
                          : 'border-gray-200 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }
                        hover:scale-[1.02] active:scale-[0.98]
                        focus-ring
                      `}
                      aria-pressed={theme === themeOption}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${theme === themeOption 
                            ? 'bg-eco-green/10 text-eco-green' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }
                        `}>
                          {themeOption === 'light' ? (
                            <Sun className="w-5 h-5" />
                          ) : (
                            <Moon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {themeOption === 'light' ? t.light : t.dark}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {themeOption === 'light' 
                              ? (language === 'en' ? 'Bright interface' : 'Interface claire')
                              : (language === 'en' ? 'Reduced eye strain' : 'Moins de fatigue oculaire')
                            }
                          </div>
                        </div>
                      </div>
                      {theme === themeOption && (
                        <Check className="w-5 h-5 text-eco-green" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 2: Nom */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setTouched(prev => ({ ...prev, name: true }));
                    }}
                    placeholder={t.namePlaceholder}
                    required
                    minLength={2}
                    maxLength={50}
                    autoComplete="name"
                    className={`
                      w-full px-4 py-3 md:py-4 pl-12
                      bg-white dark:bg-gray-800
                      border-2 ${touched.name && !name.trim() 
                        ? 'border-red-300 dark:border-red-400 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-700 focus:border-eco-green'
                      }
                      rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-eco-green/30
                      placeholder-gray-500 dark:placeholder-gray-400
                      text-gray-900 dark:text-white
                      transition-all duration-300
                      hover:border-gray-400 dark:hover:border-gray-600
                    `}
                  />
                  <div className="
                    absolute left-4 top-1/2 -translate-y-1/2 
                    text-gray-500 dark:text-gray-400 
                    transition-colors duration-300
                  ">
                    <User className="w-5 h-5" />
                  </div>
                  {touched.name && !name.trim() && (
                    <p className="
                      mt-2 text-sm text-red-500 
                      animate-fade-in flex items-center gap-1
                    ">
                      ⚠️ {t.errorNameRequired}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Étape 3: Prévisualisation */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className={`
                  p-4 md:p-5 rounded-xl
                  border border-gray-200 dark:border-gray-700
                  bg-gray-50 dark:bg-gray-800/50
                `}>
                  <div className="flex items-center gap-4">
                    <div className="
                      w-12 h-12 md:w-14 md:h-14
                      rounded-full
                      bg-gradient-to-br from-eco-green to-eco-emerald
                      flex items-center justify-center text-white font-bold text-lg
                      shadow-md
                    ">
                      {name.trim() ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {name.trim() || t.namePlaceholder}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${theme === 'light' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-blue-900/50 text-blue-200'
                          }
                        `}>
                          {theme === 'light' ? t.light : t.dark}
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                          {language === 'en' ? t.english : t.french}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {step > 0 && step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="
                      px-4 py-2
                      text-gray-600 dark:text-gray-400
                      hover:text-gray-900 dark:hover:text-white
                      transition-colors duration-300
                      flex items-center gap-2
                    "
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    {t.back}
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 2 && !name.trim()) {
                        setTouched(prev => ({ ...prev, name: true }));
                        return;
                      }
                      setStep(prev => prev + 1);
                    }}
                    className="
                      px-6 py-3
                      bg-eco-green
                      hover:bg-eco-emerald
                      text-white font-medium
                      rounded-xl
                      transition-all duration-300
                      hover:scale-[1.02] active:scale-[0.98]
                      focus-ring
                      flex items-center gap-2
                    "
                  >
                    {t.continue}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="
                      px-6 py-3
                      bg-eco-green
                      hover:bg-eco-emerald
                      text-white font-medium
                      rounded-xl
                      transition-all duration-300
                      hover:scale-[1.02] active:scale-[0.98]
                      focus-ring
                      flex items-center gap-2
                    "
                  >
                    {t.getStarted}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Écran de transition */}
      {isExiting && (
        <div className="
          fixed inset-0 
          bg-gradient-to-br from-eco-light to-eco-light/80 dark:from-eco-dark dark:to-eco-dark/80
          flex items-center justify-center
          animate-fade-in
          z-50
        ">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-eco-green flex items-center justify-center">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {t.ready}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {t.readySubtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
