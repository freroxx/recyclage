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
import { lazy, Suspense, useEffect, useState } from "react";
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

const queryClient = new QueryClient();

// Loader components
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse-slow flex items-center justify-center">
          <span className="text-2xl text-white">✨</span>
        </div>
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse-slow" />
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
        Préparation de votre expérience...
      </p>
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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [initialTheme, setInitialTheme] = useState<"light" | "dark" | "system">("light");
  const [initialLanguage, setInitialLanguage] = useState<"en" | "fr">("en");

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = () => {
      try {
        const onboardingData = localStorage.getItem("app:onboarding");
        
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          
          if (data.onboarded) {
            setIsOnboarded(true);
            setInitialTheme(data.theme);
            setInitialLanguage(data.language);
            
            // Apply saved theme to document
            if (data.theme === "dark") {
              document.documentElement.classList.add("dark");
              document.documentElement.style.colorScheme = "dark";
            } else {
              document.documentElement.classList.remove("dark");
              document.documentElement.style.colorScheme = "light";
            }
            
            // Apply language to document
            document.documentElement.lang = data.language;
          }
        }
      } catch (error) {
        console.error("Error reading onboarding data:", error);
      } finally {
        // Add a small delay for better UX
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    checkOnboarding();
  }, []);

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
    // Force a small delay for animation
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme={initialTheme}
        enableSystem={initialTheme === "system"}
        disableTransitionOnChange={false}
      >
        <LanguageProvider defaultLanguage={initialLanguage}>
          <TooltipProvider>
            {/* Shadcn Toaster */}
            <Toaster />
            
            {/* Sonner Toaster */}
            <Sonner position="top-right" />
            
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
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Home />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/project" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Project />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/resources" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Resources />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/guide" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Guide />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/posters" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Posters />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/videos" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Videos />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/activities" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Activities />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/contact" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Contact />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/support" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <Support />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route for 404 */}
                <Route 
                  path="*" 
                  element={
                    <ProtectedRoute isOnboarded={isOnboarded} isLoading={isLoading}>
                      <MainLayout>
                        <NotFound />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
