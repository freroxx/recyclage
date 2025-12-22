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
  skipOnboardingNoJS?: boolean;
}

const ProtectedRoute = ({ children, skipOnboardingNoJS = false }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = () => {
      try {
        const onboardingData = localStorage.getItem('app:onboarding');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          const onboarded = !!data.onboarded;
          setIsOnboarded(onboarded);
          
          // Apply theme immediately if data exists
          if (data.theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          }
          
          // Apply language immediately
          if (data.language) {
            document.documentElement.lang = data.language;
          }
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsOnboarded(false);
      } finally {
        setTimeout(() => {
          setIsChecking(false);
          setIsLoading(false);
        }, 300);
      }
    };

    // Skip onboarding check if skipOnboardingNoJS is true
    if (skipOnboardingNoJS) {
      setIsOnboarded(true);
      setIsChecking(false);
      setIsLoading(false);
      return;
    }

    checkOnboarding();
  }, [skipOnboardingNoJS]);

  if (isChecking || isLoading) {
    return <AppLoader />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

// Main App Layout (with Navigation & Footer)
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background theme-transition">
    <Navigation />
    <main className="flex-1 pt-16 sm:pt-20">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <Footer />
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

// Interface for App props
interface AppProps {
  skipOnboardingNoJS?: boolean;
}

const App = ({ skipOnboardingNoJS = false }: AppProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialTheme, setInitialTheme] = useState<'light' | 'dark'>('light');
  const [initialLanguage, setInitialLanguage] = useState<'en' | 'fr'>('fr');
  const [userName, setUserName] = useState<string>('');
  
  // Memoized query client
  const queryClient = useMemo(() => createQueryClient(), []);

  // Initialize app state from localStorage - SIMPLIFIED
  const initializeApp = useCallback(() => {
    try {
      const onboardingData = localStorage.getItem('app:onboarding');
      
      if (onboardingData) {
        const data: OnboardingData = JSON.parse(onboardingData);
        
        // Update states
        setInitialTheme(data.theme || 'light');
        setInitialLanguage(data.language || 'fr');
        setUserName(data.name || '');
      } else {
        // No data found, use system preferences
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const systemLanguage = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
        
        setInitialTheme(systemIsDark ? 'dark' : 'light');
        setInitialLanguage(systemLanguage);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      // Fallback to defaults
      setInitialTheme('light');
      setInitialLanguage('fr');
    } finally {
      setTimeout(() => setIsInitializing(false), 500);
    }
  }, []);

  // Initialize app on mount
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Handle onboarding completion
  const handleOnboardingComplete = useCallback((data: OnboardingData) => {
    try {
      // Save to localStorage
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
      
      // Force reload to apply all changes properly
      setTimeout(() => {
        window.location.href = '/';
      }, 600);
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  }, []);

  if (isInitializing) {
    return <AppLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        defaultTheme={initialTheme}
        enableSystem={true}
        storageKey="eco-school-theme"
        themes={["light", "dark"]}
        forcedTheme={isInitializing ? initialTheme : undefined}
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
                {skipOnboardingNoJS ? (
                  // Skip onboarding completely - render all routes without protection
                  <>
                    <Route path="/" element={
                      <MainLayout>
                        <Home />
                      </MainLayout>
                    } />
                    
                    <Route path="/project" element={
                      <MainLayout>
                        <Project />
                      </MainLayout>
                    } />
                    
                    <Route path="/resources" element={
                      <MainLayout>
                        <Resources />
                      </MainLayout>
                    } />
                    
                    <Route path="/guide" element={
                      <MainLayout>
                        <Guide />
                      </MainLayout>
                    } />
                    
                    <Route path="/posters" element={
                      <MainLayout>
                        <Posters />
                      </MainLayout>
                    } />
                    
                    <Route path="/videos" element={
                      <MainLayout>
                        <Videos />
                      </MainLayout>
                    } />
                    
                    <Route path="/activities" element={
                      <MainLayout>
                        <Activities />
                      </MainLayout>
                    } />
                    
                    <Route path="/contact" element={
                      <MainLayout>
                        <Contact />
                      </MainLayout>
                    } />
                    
                    <Route path="/support" element={
                      <MainLayout>
                        <Support />
                      </MainLayout>
                    } />
                    
                    {/* Catch-all route for 404 */}
                    <Route path="*" element={
                      <MainLayout>
                        <NotFound />
                      </MainLayout>
                    } />
                  </>
                ) : (
                  // Normal flow with onboarding
                  <>
                    {/* Onboarding Route (Public) */}
                    <Route 
                      path="/onboarding" 
                      element={
                        <Onboarding onComplete={handleOnboardingComplete} />
                      } 
                    />
                    
                    {/* Main App Routes (Protected) */}
                    <Route path="/" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Home />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/project" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Project />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/resources" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Resources />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/guide" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Guide />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/posters" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Posters />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/videos" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Videos />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/activities" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Activities />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/contact" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Contact />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/support" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <Support />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route for 404 */}
                    <Route path="*" element={
                      <ProtectedRoute skipOnboardingNoJS={skipOnboardingNoJS}>
                        <MainLayout>
                          <NotFound />
                        </MainLayout>
                      </ProtectedRoute>
                    } />
                  </>
                )}
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
