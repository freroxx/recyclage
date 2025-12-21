import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { lazy, Suspense, useEffect, useState, useMemo, useCallback } from "react";
import Support from "./pages/Support";

// ✅ Vercel Analytics + Speed Insights
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Onboarding component
import Onboarding from "./components/Onboarding";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Project = lazy(() => import("./pages/Project"));
const Resources = lazy(() => import("./pages/Resources"));
const Guide = lazy(() => import("./pages/Guide"));
const Posters = lazy(() => import("./pages/Posters"));
const Videos = lazy(() => import("./pages/Videos"));
const Activities = lazy(() => import("./pages/Activities"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create query client with memo to prevent recreation
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loader components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-eco-green border-t-transparent rounded-full animate-spin-slow" />
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eco-light via-white to-eco-light/30 dark:from-eco-dark dark:via-gray-900 dark:to-eco-dark/30">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-eco-green to-eco-emerald animate-pulse-slow flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-eco-green/10 to-eco-emerald/10 rounded-3xl blur-xl animate-pulse-slow" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Préparation de votre expérience...
        </p>
        <div className="flex items-center justify-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-eco-green animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-eco-green animate-pulse delay-150" />
          <div className="w-1.5 h-1.5 rounded-full bg-eco-green animate-pulse delay-300" />
        </div>
      </div>
    </div>
  </div>
);

// Protected Route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  isOnboarded: boolean;
  isLoading: boolean;
}

const ProtectedRoute = ({ children, isOnboarded, isLoading }: ProtectedRouteProps) => {
  if (isLoading) {
    return <AppLoader />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

// Main App Layout (with Navigation & Footer)
interface MainLayoutProps {
  children: React.ReactNode;
  language: 'en' | 'fr';
}

const MainLayout = ({ children, language }: MainLayoutProps) => (
  <div className="min-h-screen flex flex-col bg-background theme-transition">
    <Navigation language={language} />
    <main className="flex-1 pt-16 sm:pt-20">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <Footer language={language} />
    <ScrollToTop />
    
    {/* ✅ Vercel Analytics */}
    <Analytics />
    {/* ✅ Vercel Speed Insights */}
    <SpeedInsights />
  </div>
);

// Interface for onboarding data
interface OnboardingData {
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  name: string;
  onboarded: boolean;
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [initialTheme, setInitialTheme] = useState<'light' | 'dark'>('light');
  const [initialLanguage, setInitialLanguage] = useState<'en' | 'fr'>('fr');
  const [userName, setUserName] = useState<string>('');
  
  // Memoized query client
  const queryClient = useMemo(() => createQueryClient(), []);

  // Function to save onboarding data
  const saveOnboardingData = useCallback((data: OnboardingData) => {
    try {
      localStorage.setItem('app:onboarding', JSON.stringify(data));
      
      // Apply theme immediately
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
      
      // Apply language to document
      document.documentElement.lang = data.language;
      
      // Update initial states
      setInitialTheme(data.theme);
      setInitialLanguage(data.language);
      setUserName(data.name);
      setIsOnboarded(data.onboarded);
      
      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      return false;
    }
  }, []);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = () => {
      try {
        const onboardingData = localStorage.getItem('app:onboarding');
        
        if (onboardingData) {
          const data: OnboardingData = JSON.parse(onboardingData);
          
          if (data.onboarded) {
            // Apply saved theme
            if (data.theme === 'dark') {
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.style.colorScheme = 'light';
            }
            
            // Apply language
            document.documentElement.lang = data.language;
            
            // Update states
            setInitialTheme(data.theme);
            setInitialLanguage(data.language);
            setUserName(data.name);
            setIsOnboarded(true);
          } else {
            // Not onboarded, use system preferences
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const systemLanguage = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
            
            setInitialTheme(systemIsDark ? 'dark' : 'light');
            setInitialLanguage(systemLanguage);
          }
        } else {
          // No data found, use system preferences
          const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const systemLanguage = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
          
          setInitialTheme(systemIsDark ? 'dark' : 'light');
          setInitialLanguage(systemLanguage);
        }
      } catch (error) {
        console.error('Error reading onboarding data:', error);
        // Fallback to system preferences
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemLanguage = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
        
        setInitialTheme(systemIsDark ? 'dark' : 'light');
        setInitialLanguage(systemLanguage);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    checkOnboarding();
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback((data: OnboardingData) => {
    saveOnboardingData(data);
    
    // Small delay for animation
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [saveOnboardingData]);

  // Memoized render function for routes
  const renderProtectedRoute = useMemo(() => (
    (children: React.ReactNode) => (
      <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
        <MainLayout language={initialLanguage}>
          {children}
        </MainLayout>
      </ProtectedRoute>
    )
  ), [isOnboarded, isLoading, initialLanguage]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme={initialTheme}
        enableSystem={false}
        disableTransitionOnChange={false}
        storageKey="eco-school-theme"
      >
        <LanguageProvider defaultLanguage={initialLanguage} userName={userName}>
          <TooltipProvider delayDuration={300}>
            {/* Shadcn Toaster */}
            <Toaster />
            
            {/* Sonner Toaster */}
            <Sonner 
              position="top-right"
              theme={initialTheme}
              className="font-sans"
              toastOptions={{
                classNames: {
                  toast: 'bg-background border-border',
                  title: 'text-foreground',
                  description: 'text-muted-foreground',
                  actionButton: 'bg-primary text-primary-foreground',
                  cancelButton: 'bg-muted text-muted-foreground',
                },
              }}
            />
            
            <BrowserRouter>
              <Routes>
                {/* Onboarding Route (Public) */}
                <Route 
                  path="/onboarding" 
                  element={
                    !isOnboarded ? (
                      <Onboarding onComplete={handleOnboardingComplete} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                
                {/* Main App Routes (Protected) */}
                <Route path="/" element={renderProtectedRoute(<Home />)} />
                <Route path="/project" element={renderProtectedRoute(<Project />)} />
                <Route path="/resources" element={renderProtectedRoute(<Resources />)} />
                <Route path="/guide" element={renderProtectedRoute(<Guide />)} />
                <Route path="/posters" element={renderProtectedRoute(<Posters />)} />
                <Route path="/videos" element={renderProtectedRoute(<Videos />)} />
                <Route path="/activities" element={renderProtectedRoute(<Activities />)} />
                <Route path="/contact" element={renderProtectedRoute(<Contact />)} />
                <Route path="/support" element={renderProtectedRoute(<Support />)} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={renderProtectedRoute(<NotFound />)} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
