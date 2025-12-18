import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { lazy, Suspense } from "react";
import Support from "./pages/Support";

// ✅ Vercel Analytics + Speed Insights
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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

// Loader component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem 
      disableTransitionOnChange={false}
    >
      <LanguageProvider>
        <TooltipProvider>

          {/* Shadcn Toaster */}
          <Toaster />

          {/* Sonner Toaster */}
          <Sonner position="top-right" />

          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-background theme-transition">
              <Navigation />

              <main className="flex-1 pt-16 sm:pt-20">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/project" element={<Project />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/guide" element={<Guide />} />
                    <Route path="/posters" element={<Posters />} />
                    <Route path="/videos" element={<Videos />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
              <ScrollToTop />

              {/* ✅ Vercel Analytics */}
              <Analytics />

              {/* ✅ Vercel Speed Insights */}
              <SpeedInsights />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
