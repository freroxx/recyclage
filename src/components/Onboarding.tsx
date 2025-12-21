import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  User, 
  Globe, 
  Flag, 
  Leaf, 
  Recycle, 
  Sparkles,
  Check,
  Palette,
  Languages,
  ArrowRight,
  Eye,
  Settings,
  Earth,
  Contrast
} from 'lucide-react';

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
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [name, setName] = useState<string>('');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'theme' | 'language'>('theme');
  const [touched, setTouched] = useState({
    name: false,
    theme: false,
    language: false
  });

  // Steps configuration
  const steps = useMemo(() => [
    { id: 'welcome', icon: Sparkles, titleKey: 'welcome', subtitleKey: 'subtitle' },
    { id: 'name', icon: User, titleKey: 'nameLabel', subtitleKey: 'nameSubtitle' },
    { id: 'settings', icon: Settings, titleKey: 'settingsLabel', subtitleKey: 'settingsSubtitle' },
    { id: 'complete', icon: Check, titleKey: 'ready', subtitleKey: 'readySubtitle' }
  ], []);

  // Auto-détection du thème et langue système avec animation progressive
  useEffect(() => {
    const detectPreferences = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light';
      const browserLang = navigator.language.toLowerCase();
      const systemLanguage: Language = browserLang.startsWith('fr') ? 'fr' : 'en';
      
      setTimeout(() => {
        setTheme(systemTheme);
        setLanguage(systemLanguage);
        setIsLoading(false);
        
        const stepInterval = setInterval(() => {
          setStep(prev => {
            if (prev < steps.length - 1) return prev + 1;
            clearInterval(stepInterval);
            return prev;
          });
        }, 800);
      }, 800);

      return () => clearTimeout(timer);
    };

    const timer = setTimeout(detectPreferences, 100);
    return () => clearTimeout(timer);
  }, [steps.length]);

  // Appliquer le thème vert écologique au document
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    };

    applyTheme();
  }, [theme]);

  // Gestionnaire de soumission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setTouched(prev => ({ ...prev, name: true }));
      setStep(1);
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
    
    setStep(steps.length - 1);
    
    setTimeout(() => {
      onComplete();
      navigate('/', { replace: true });
    }, 1500);
  }, [theme, language, name, navigate, onComplete, steps.length]);

  // Traductions avec memo pour éviter les re-renders
  const translations = useMemo(() => ({
    en: {
      welcome: 'Welcome to Eco-School',
      subtitle: 'Join our recycling revolution',
      nameLabel: 'What should we call you?',
      nameSubtitle: 'Enter your name to get started',
      namePlaceholder: 'Eco Warrior',
      settingsLabel: 'Customize Your Experience',
      settingsSubtitle: 'Choose your preferred theme and language',
      themeLabel: 'Theme',
      themeSubtitle: 'Choose your visual theme',
      languageLabel: 'Language',
      languageSubtitle: 'Select your preferred language',
      getStarted: 'Start Recycling Journey',
      light: 'Forest Light',
      dark: 'Eco Dark',
      english: 'English',
      french: 'Français',
      preview: 'Your Eco Profile',
      englishInterface: 'English interface',
      frenchInterface: 'Interface française',
      errorNameRequired: 'Please enter your name to continue',
      ready: 'All Set!',
      readySubtitle: 'Your eco profile is ready',
      stepWelcome: 'Welcome',
      stepProfile: 'Profile',
      stepSettings: 'Settings',
      stepComplete: 'Complete',
      ecoTip: 'Did you know? Recycling one aluminum can saves enough energy to run a TV for 3 hours!',
      tabTheme: 'Theme',
      tabLanguage: 'Language'
    },
    fr: {
      welcome: 'Bienvenue à Éco-École',
      subtitle: 'Rejoignez notre révolution du recyclage',
      nameLabel: 'Comment devrions-nous vous appeler?',
      nameSubtitle: 'Entrez votre nom pour commencer',
      namePlaceholder: 'Guerrier Écologique',
      settingsLabel: 'Personnalisez Votre Expérience',
      settingsSubtitle: 'Choisissez votre thème et langue préférés',
      themeLabel: 'Thème',
      themeSubtitle: 'Choisissez votre thème visuel',
      languageLabel: 'Langue',
      languageSubtitle: 'Sélectionnez votre langue préférée',
      getStarted: 'Commencer le Voyage Écologique',
      light: 'Forêt Claire',
      dark: 'Éco Sombre',
      english: 'Anglais',
      french: 'Français',
      preview: 'Votre Profil Écologique',
      englishInterface: 'Interface anglaise',
      frenchInterface: 'Interface française',
      errorNameRequired: 'Veuillez entrer votre nom pour continuer',
      ready: 'Tout est prêt!',
      readySubtitle: 'Votre profil écologique est prêt',
      stepWelcome: 'Bienvenue',
      stepProfile: 'Profil',
      stepSettings: 'Paramètres',
      stepComplete: 'Terminé',
      ecoTip: 'Saviez-vous? Recycler une canette en aluminium économise assez d\'énergie pour faire fonctionner une télévision pendant 3 heures!',
      tabTheme: 'Thème',
      tabLanguage: 'Langue'
    }
  }), []);

  const t = translations[language];

  // État de chargement initial
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-light/20 via-white to-green-50/30 dark:from-eco-dark/20 dark:via-gray-800 dark:to-green-900/10">
        <div className="flex flex-col items-center gap-6 animate-scale-in">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 animate-pulse-slow flex items-center justify-center">
              <Recycle className="w-12 h-12 text-white animate-spin-slow" />
            </div>
            <div className="absolute -inset-6 bg-gradient-to-r from-green-500/20 to-emerald-400/20 rounded-4xl blur-xl animate-pulse-slow" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-300 font-medium text-lg animate-pulse">
              {language === 'en' ? 'Preparing your eco-experience...' : 'Préparation de votre expérience écologique...'}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 animate-pulse">
              ♻️ {language === 'en' ? 'Loading sustainable features' : 'Chargement des fonctionnalités durables'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-eco-light/20 via-white to-green-50/30 dark:from-eco-dark/20 dark:via-gray-800 dark:to-green-900/10 transition-all duration-700 animate-gradient-flow overflow-hidden">
      {/* Arrière-plan écologique animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400/20 dark:text-green-500/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            ♻️
          </div>
        ))}
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-float-reverse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-green-200/5 via-emerald-200/5 to-teal-200/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      </div>

      {/* Carte principale */}
      <div className={`
        relative w-full max-w-2xl
        animate-scale-in
        transition-all duration-700 ease-spring
        ${isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}
      `}>
        <div className="
          relative
          backdrop-blur-2xl backdrop-saturate-150
          bg-white/90 dark:bg-gray-800/90
          border-2 border-white/30 dark:border-gray-700/30
          rounded-3xl
          shadow-2xl shadow-green-500/10 dark:shadow-green-900/20
          p-6 sm:p-8 md:p-10
          transform-gpu
          transition-all duration-500
          hover:shadow-3xl hover:shadow-green-500/20 dark:hover:shadow-green-900/30
          hover:border-white/50 dark:hover:border-gray-600/50
          group/card
          overflow-hidden
        ">
          {/* Bordure animée */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-emerald-500/0 rounded-3xl animate-gradient-flow" />

          {/* Barre de progression */}
          <div className="mb-8 md:mb-10">
            <div className="flex items-center justify-between mb-4">
              {steps.map((stepItem, index) => (
                <React.Fragment key={stepItem.id}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                      transition-all duration-500
                      ${index <= step 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-400 text-white scale-110 shadow-lg shadow-green-500/30' 
                        : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      <stepItem.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-xs mt-2 font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                      {t[`step${stepItem.id.charAt(0).toUpperCase() + stepItem.id.slice(1)}` as keyof typeof t]}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-1 mx-2 transition-all duration-500
                      ${index < step 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                        : 'bg-gray-300/50 dark:bg-gray-700/50'
                      }
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* En-tête dynamique */}
          <div className="text-center mb-8 md:mb-10 space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-400/10 mb-3 group-hover/card:from-green-500/15 group-hover/card:to-emerald-400/15 transition-all duration-500 animate-float-slow">
              <Recycle className="w-10 h-10 md:w-12 md:h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="
              text-3xl md:text-4xl font-bold tracking-tight
              bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 dark:from-green-400 dark:via-emerald-300 dark:to-teal-400
              bg-clip-text text-transparent
              animate-fade-in-up
            ">
              {t[steps[step].titleKey as keyof typeof t]}
            </h1>
            <p className="
              text-gray-600 dark:text-gray-300
              text-lg font-medium
              animate-fade-in-delay
            ">
              {t[steps[step].subtitleKey as keyof typeof t]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Étape 1: Nom */}
            {step >= 1 && (
              <div className={`space-y-3 ${step === 1 ? 'animate-slide-in-left' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <label className="
                    block text-sm font-semibold 
                    text-gray-700 dark:text-gray-200
                  ">
                    {t.nameLabel}
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setTouched(prev => ({ ...prev, name: true }));
                    }}
                    onFocus={() => setStep(1)}
                    placeholder={t.namePlaceholder}
                    required
                    minLength={2}
                    maxLength={50}
                    autoComplete="name"
                    className={`
                      w-full px-4 py-3.5 md:py-4 pl-12
                      bg-white/80 dark:bg-gray-700/80
                      border-2 ${touched.name && !name.trim() 
                        ? 'border-red-300 dark:border-red-400 focus:border-red-500' 
                        : 'border-green-300/50 dark:border-green-700/50 focus:border-green-500'
                      }
                      rounded-xl md:rounded-2xl
                      focus:outline-none focus:ring-3 focus:ring-green-500/30
                      placeholder-gray-500/70 dark:placeholder-gray-400/70
                      text-gray-900 dark:text-white
                      transition-all duration-300
                      hover:border-green-400 dark:hover:border-green-600
                      hover:bg-white dark:hover:bg-gray-700
                      peer
                    `}
                  />
                  <div className="
                    absolute left-4 top-1/2 -translate-y-1/2 
                    text-green-600 dark:text-green-400 
                    transition-colors duration-300
                  ">
                    <User className="w-5 h-5" />
                  </div>
                  {touched.name && !name.trim() && (
                    <p className="
                      absolute -bottom-6 left-1 
                      text-xs text-red-500 
                      animate-fade-in flex items-center gap-1
                    ">
                      ⚠️ {t.errorNameRequired}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Étape 2: Paramètres (Theme & Language Tabs) */}
            {step >= 2 && (
              <div className={`space-y-6 ${step === 2 ? 'animate-slide-in-right' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <label className="
                    block text-sm font-semibold 
                    text-gray-700 dark:text-gray-200
                  ">
                    {t.settingsLabel}
                  </label>
                </div>

                {/* Tabs pour Theme/Language */}
                <div className="flex border-b border-green-200 dark:border-green-800 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('theme')}
                    className={`
                      flex-1 py-3 px-4 text-center font-medium transition-all duration-300
                      border-b-2 ${activeTab === 'theme' 
                        ? 'border-green-500 text-green-600 dark:text-green-400' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Contrast className="w-4 h-4" />
                      <span>{t.tabTheme}</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('language')}
                    className={`
                      flex-1 py-3 px-4 text-center font-medium transition-all duration-300
                      border-b-2 ${activeTab === 'language' 
                        ? 'border-green-500 text-green-600 dark:text-green-400' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Earth className="w-4 h-4" />
                      <span>{t.tabLanguage}</span>
                    </div>
                  </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'theme' ? (
                  <div className="animate-fade-in-up">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.themeLabel}
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {t.themeSubtitle}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(['light', 'dark'] as Theme[]).map((themeOption) => (
                        <button
                          key={themeOption}
                          type="button"
                          onClick={() => {
                            setTheme(themeOption);
                            setTouched(prev => ({ ...prev, theme: true }));
                          }}
                          onFocus={() => setActiveTab('theme')}
                          className={`
                            flex items-center justify-between gap-4
                            px-5 py-4 md:py-5
                            rounded-xl md:rounded-2xl
                            border-2
                            transition-all duration-300
                            ${theme === themeOption 
                              ? 'border-green-500 shadow-lg shadow-green-500/20 bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-900/30 dark:to-green-900/10' 
                              : 'border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                            }
                            hover:scale-[1.02] active:scale-[0.98]
                            group/theme
                            focus-ring
                          `}
                          aria-pressed={theme === themeOption}
                        >
                          <div className="flex items-center gap-4">
                            {themeOption === 'light' ? (
                              <Sun className="w-6 h-6 text-amber-500" />
                            ) : (
                              <Moon className="w-6 h-6 text-indigo-400" />
                            )}
                            <div className="text-left">
                              <div className="font-semibold text-gray-700 dark:text-gray-200">
                                {themeOption === 'light' ? t.light : t.dark}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {themeOption === 'light' 
                                  ? (language === 'en' ? 'Bright and clean' : 'Clair et propre')
                                  : (language === 'en' ? 'Easy on the eyes' : 'Doux pour les yeux')
                                }
                              </div>
                            </div>
                          </div>
                          {theme === themeOption && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in-up">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.languageLabel}
                      </label>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {t.languageSubtitle}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(['en', 'fr'] as Language[]).map((langOption) => (
                        <button
                          key={langOption}
                          type="button"
                          onClick={() => {
                            setLanguage(langOption);
                            setTouched(prev => ({ ...prev, language: true }));
                          }}
                          onFocus={() => setActiveTab('language')}
                          className={`
                            flex items-center justify-between gap-4
                            px-5 py-4 md:py-5
                            rounded-xl md:rounded-2xl
                            border-2
                            transition-all duration-300
                            ${language === langOption 
                              ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/30 dark:to-emerald-900/10' 
                              : 'border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                            }
                            hover:scale-[1.02] active:scale-[0.98]
                            group/lang
                            focus-ring
                          `}
                          aria-pressed={language === langOption}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                              <span className="text-xl">
                                {langOption === 'en' ? '🇬🇧' : '🇫🇷'}
                              </span>
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-700 dark:text-gray-200">
                                {langOption === 'en' ? t.english : t.french}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {langOption === 'en' 
                                  ? (language === 'en' ? 'International English' : 'Anglais international')
                                  : (language === 'en' ? 'French - Français' : 'Français')
                                }
                              </div>
                            </div>
                          </div>
                          {language === langOption && (
                            <Check className="w-5 h-5 text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bouton de progression/soumission */}
            <div className={`pt-4 ${step >= 3 ? 'animate-fade-up' : ''}`}>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !name.trim()) {
                      setTouched(prev => ({ ...prev, name: true }));
                      return;
                    }
                    setStep(prev => Math.min(prev + 1, steps.length - 1));
                  }}
                  disabled={step === 1 && !name.trim()}
                  className="
                    w-full
                    py-3.5 md:py-4
                    bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
                    hover:from-green-600 hover:via-emerald-600 hover:to-teal-600
                    disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-500
                    disabled:cursor-not-allowed
                    text-white font-semibold text-lg
                    rounded-xl md:rounded-2xl
                    shadow-lg shadow-green-500/25
                    hover:shadow-xl hover:shadow-green-500/35
                    transform-gpu
                    transition-all duration-300
                    hover:scale-[1.02] active:scale-[0.98]
                    disabled:hover:scale-100
                    disabled:opacity-50
                    group/next
                    overflow-hidden relative
                    focus-ring
                    active-scale
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {step === 2 ? t.getStarted : (language === 'en' ? 'Continue' : 'Continuer')}
                    <ArrowRight className="
                      w-5 h-5
                      transition-transform duration-300
                      group-hover/next:translate-x-1
                    " />
                  </span>
                  <span className="
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                    -translate-x-full
                    group-hover/next:translate-x-full
                    transition-transform duration-700
                  " />
                </button>
              ) : (
                <button
                  type="submit"
                  className="
                    w-full
                    py-3.5 md:py-4
                    bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
                    hover:from-green-600 hover:via-emerald-600 hover:to-teal-600
                    text-white font-semibold text-lg
                    rounded-xl md:rounded-2xl
                    shadow-lg shadow-green-500/25
                    hover:shadow-xl hover:shadow-green-500/35
                    transform-gpu
                    transition-all duration-300
                    hover:scale-[1.02] active:scale-[0.98]
                    group/complete
                    overflow-hidden relative
                    focus-ring
                    active-scale
                    animate-bounce-in
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t.getStarted}
                    <ArrowRight className="
                      w-5 h-5
                      transition-transform duration-300
                      group-hover/complete:translate-x-1
                    " />
                  </span>
                </button>
              )}
            </div>
          </form>

          {/* Aperçu dynamique - Toujours visible */}
          {(name.trim() || theme || language) && (
            <div className="
              mt-8 md:mt-10 pt-6 md:pt-8
              border-t border-green-300/30 dark:border-green-700/30
              animate-fade-in-delay-2
            ">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <p className="
                    text-sm font-medium text-gray-600 dark:text-gray-400
                  ">
                    {t.preview}
                  </p>
                </div>
                <Leaf className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className={`
                p-4 md:p-5 rounded-xl md:rounded-2xl
                transition-all duration-500
                ${theme === 'dark' 
                  ? 'bg-gradient-to-br from-gray-900/80 to-green-900/20 text-white' 
                  : 'bg-gradient-to-br from-green-100/80 to-white/80 text-gray-900'
                }
                border border-green-300/30 dark:border-green-700/30
                transform-gpu
                group-hover/card:scale-[1.02]
                group-hover/card:shadow-md
              `}>
                <div className="flex items-center gap-4">
                  <div className="
                    w-10 h-10 md:w-12 md:h-12
                    rounded-full
                    bg-gradient-to-br from-green-500 to-emerald-400
                    flex items-center justify-center text-white font-bold text-lg md:text-xl
                    shadow-lg shadow-green-500/30
                    animate-float
                  ">
                    {name.trim() ? name.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base md:text-lg truncate">
                      {name.trim() || t.namePlaceholder}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 truncate">
                      ♻️ {language === 'en' ? 'Eco Student' : 'Élève Écologique'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`
                        px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1
                        ${theme === 'light' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-indigo-900/50 text-indigo-200'
                        }
                      `}>
                        {theme === 'light' ? (
                          <Sun className="w-3 h-3" />
                        ) : (
                          <Moon className="w-3 h-3" />
                        )}
                        {theme === 'light' ? t.light : t.dark}
                      </div>
                      <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {language === 'en' ? t.english : t.french}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info-bulle écologique */}
          <div className="
            mt-6 md:mt-8 pt-4 md:pt-6
            border-t border-green-300/20 dark:border-green-700/20
            animate-fade-in
          ">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/20">
              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                {t.ecoTip}
              </p>
            </div>
          </div>
        </div>

        {/* Éléments décoratifs écologiques */}
        <div className="absolute -z-10 -top-8 -left-8 w-56 h-56 bg-green-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -z-10 -bottom-8 -right-8 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl animate-float-reverse" />
      </div>

      {/* Écran de transition */}
      {isExiting && (
        <div className="
          fixed inset-0 
          bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900
          flex items-center justify-center
          animate-fade-in
          z-50
        ">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 animate-bounce-in flex items-center justify-center">
                <Check className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-6 bg-gradient-to-r from-green-500/30 to-emerald-400/30 rounded-4xl blur-xl animate-pulse-slow" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                {t.ready}
              </p>
              <p className="text-green-600 dark:text-green-300">
                {t.readySubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
