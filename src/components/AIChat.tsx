import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type React from "react";
import { X, Maximize2, Minimize2, GripVertical, Moon, Sun, Loader2, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

declare global {
  interface Window {
    Pickaxe?: any;
    PickaxeEmbed?: any;
  }
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  const isMobile = useIsMobile();
  const [isMaximized, setIsMaximized] = useState(false);
  const [dimensions, setDimensions] = useState({ 
    width: isMobile ? window.innerWidth - 32 : 800, 
    height: isMobile ? window.innerHeight - 100 : 700 
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<false | 'both' | 'height'>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [embedError, setEmbedError] = useState(false);
  const { resolvedTheme, theme, setTheme } = useTheme();
  const windowRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadAttemptRef = useRef(0);
  const embedInitializedRef = useRef(false);
  const checkEmbedIntervalRef = useRef<NodeJS.Timeout>();
  const lastDeploymentIdRef = useRef<string>('');

  const currentTheme = resolvedTheme || theme || 'light';
  const isDark = currentTheme === 'dark';
  const deploymentId = useMemo(() => 
    isDark 
      ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
      : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947',
    [isDark]
  );

  // Calculate initial position and dimensions
  const calculateInitialPosition = useCallback(() => {
    if (isMobile) {
      setIsMaximized(true);
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
      setPosition({ x: 0, y: 0 });
      return;
    }

    const padding = 32;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetWidth = Math.min(800, vw - padding);
    const targetHeight = Math.min(700, vh - padding);
    const centerX = (vw - targetWidth) / 2;
    const centerY = (vh - targetHeight) / 2;

    setDimensions({ width: targetWidth, height: targetHeight });
    setPosition({ x: centerX, y: centerY });
    setIsMaximized(false);
  }, [isMobile]);

  // Initialize position on open
  useEffect(() => {
    if (!open) return;
    
    // Reset states
    setIsLoading(true);
    setEmbedError(false);
    embedInitializedRef.current = false;
    scriptLoadAttemptRef.current = 0;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(calculateInitialPosition, 50);
    
    return () => clearTimeout(timer);
  }, [open, calculateInitialPosition]);

  // Cleanup when closing
  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      setEmbedError(false);
      embedInitializedRef.current = false;
      scriptLoadAttemptRef.current = 0;
      lastDeploymentIdRef.current = '';
      
      // Clear intervals
      if (checkEmbedIntervalRef.current) {
        clearInterval(checkEmbedIntervalRef.current);
        checkEmbedIntervalRef.current = undefined;
      }
      
      // Clean up the embed container
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = '';
      }
      
      // Remove any Pickaxe iframes
      document.querySelectorAll('iframe[src*="pickaxe"]').forEach(iframe => {
        iframe.remove();
      });
    }
  }, [open]);

  // Function to check if embed has loaded properly
  const checkEmbedLoaded = useCallback(() => {
    if (!embedContainerRef.current) return false;
    
    const embedDiv = document.getElementById(deploymentId);
    if (!embedDiv) return false;
    
    // Check for iframes or any content inside the embed div
    const hasIframes = embedDiv.querySelector('iframe');
    const hasChildren = embedDiv.children.length > 0;
    const hasStyle = embedDiv.style.cssText.length > 0;
    
    return hasIframes || hasChildren || hasStyle;
  }, [deploymentId]);

  // Function to initialize Pickaxe embed
  const initializePickaxeEmbed = useCallback(() => {
    if (!open || !embedContainerRef.current) {
      return;
    }

    // If we already initialized this deployment, skip
    if (lastDeploymentIdRef.current === deploymentId && embedInitializedRef.current) {
      setIsLoading(false);
      return;
    }

    // Clear previous content
    embedContainerRef.current.innerHTML = '';
    lastDeploymentIdRef.current = deploymentId;
    setIsLoading(true);
    setEmbedError(false);
    scriptLoadAttemptRef.current++;

    // Show loading toast only on first attempt
    if (scriptLoadAttemptRef.current === 1) {
      toast.info("Chargement de l'assistant IA...", {
        duration: 2000,
      });
    }

    // Create container for Pickaxe embed
    const container = document.createElement('div');
    container.id = `pickaxe-container-${deploymentId}`;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.minHeight = '400px';
    container.style.background = isDark ? '#0f172a' : '#f8fafc';

    // Create the embed div with the exact deployment ID
    const embedDiv = document.createElement('div');
    embedDiv.id = deploymentId;
    embedDiv.setAttribute('data-pickaxe', 'embed');
    embedDiv.style.width = '100%';
    embedDiv.style.height = '100%';
    embedDiv.style.minHeight = '400px';
    embedDiv.style.background = 'transparent';
    embedDiv.style.border = 'none';
    embedDiv.style.overflow = 'hidden';

    container.appendChild(embedDiv);
    embedContainerRef.current.appendChild(container);

    // Check if Pickaxe script is already loaded in the global scope
    if (window.Pickaxe || window.PickaxeEmbed) {
      console.log('Pickaxe already loaded in window, waiting for auto-init...');
      
      // Pickaxe should auto-initialize when it sees the div with deployment ID
      // Start checking for embed content
      const checkInterval = setInterval(() => {
        if (checkEmbedLoaded()) {
          clearInterval(checkInterval);
          setIsLoading(false);
          embedInitializedRef.current = true;
          toast.success("Assistant IA chargé !", { duration: 2000 });
        }
      }, 300);
      
      // Timeout after 8 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!embedInitializedRef.current) {
          console.log('Pickaxe did not auto-initialize, loading script...');
          loadPickaxeScript();
        }
      }, 8000);
      
      return;
    }

    // Load the Pickaxe script
    loadPickaxeScript();
  }, [open, deploymentId, isDark, checkEmbedLoaded]);

  // Function to load Pickaxe script
  const loadPickaxeScript = useCallback(() => {
    // Remove existing Pickaxe scripts
    document.querySelectorAll('script[src*="pickaxe"]').forEach(script => {
      script.remove();
    });

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('Pickaxe script loaded successfully');
      
      // Pickaxe should automatically initialize when it sees the div with the deployment ID
      // Start checking for embed content
      if (checkEmbedIntervalRef.current) {
        clearInterval(checkEmbedIntervalRef.current);
      }
      
      checkEmbedIntervalRef.current = setInterval(() => {
        if (checkEmbedLoaded()) {
          if (checkEmbedIntervalRef.current) {
            clearInterval(checkEmbedIntervalRef.current);
            checkEmbedIntervalRef.current = undefined;
          }
          setIsLoading(false);
          embedInitializedRef.current = true;
          toast.success("Assistant IA chargé !", { duration: 2000 });
        }
      }, 500);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (checkEmbedIntervalRef.current) {
          clearInterval(checkEmbedIntervalRef.current);
          checkEmbedIntervalRef.current = undefined;
        }
        
        if (!embedInitializedRef.current) {
          console.error('Pickaxe embed failed to load within timeout');
          setEmbedError(true);
          setIsLoading(false);
          
          // Try direct iframe approach as fallback
          loadDirectIframeFallback();
        }
      }, 10000);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Pickaxe script:', error);
      setIsLoading(false);
      setEmbedError(true);
      toast.error("Erreur de chargement. Veuillez réessayer.");
    };
    
    document.head.appendChild(script);
  }, [checkEmbedLoaded]);

  // Direct iframe fallback method
  const loadDirectIframeFallback = useCallback(() => {
    if (!embedContainerRef.current) return;
    
    // Clear existing content
    embedContainerRef.current.innerHTML = '';
    
    // Create direct iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://studio.pickaxe.co/embed/${deploymentId}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.minHeight = '400px';
    iframe.title = "Assistant IA Recyclage Maria";
    iframe.allow = "clipboard-write";
    
    embedContainerRef.current.appendChild(iframe);
    
    // Check if iframe loads
    iframe.onload = () => {
      setIsLoading(false);
      embedInitializedRef.current = true;
      toast.success("Assistant IA chargé (mode de secours) !");
    };
    
    iframe.onerror = () => {
      setEmbedError(true);
      setIsLoading(false);
    };
  }, [deploymentId]);

  // Initialize embed when open changes or deploymentId changes
  useEffect(() => {
    if (!open) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializePickaxeEmbed();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (checkEmbedIntervalRef.current) {
        clearInterval(checkEmbedIntervalRef.current);
        checkEmbedIntervalRef.current = undefined;
      }
    };
  }, [open, deploymentId, initializePickaxeEmbed]);

  // Handle dragging
  useEffect(() => {
    if (!isDragging || isMaximized || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!windowRef.current) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setPosition(prev => {
        const rect = windowRef.current!.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        const newX = Math.max(0, Math.min(prev.x + deltaX, maxX));
        const newY = Math.max(0, Math.min(prev.y + deltaY, maxY));

        return { x: newX, y: newY };
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, isMaximized, isMobile]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing || isMaximized || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      setDimensions(prev => {
        const minWidth = isMobile ? 300 : 600;
        const minHeight = isMobile ? 400 : 500;
        const maxWidth = window.innerWidth - 32;
        const maxHeight = window.innerHeight - 32;

        const newWidth = Math.max(minWidth, Math.min(prev.width + deltaX, maxWidth));
        const newHeight = Math.max(minHeight, Math.min(prev.height + deltaY, maxHeight));

        // Adjust position if window would go off-screen
        if (windowRef.current) {
          const maxX = window.innerWidth - newWidth;
          const maxY = window.innerHeight - newHeight;
          
          setPosition(prevPos => ({
            x: Math.min(prevPos.x, maxX),
            y: Math.min(prevPos.y, maxY)
          }));
        }

        return { width: newWidth, height: newHeight };
      });

      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'nwse-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos, isMaximized, isMobile]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMobile || isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isMobile, isMaximized]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMobile || isMaximized) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing('both');
    setStartPos({ x: e.clientX, y: e.clientY });
  }, [isMobile, isMaximized]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChange(false);
  }, [onOpenChange]);

  const toggleTheme = useCallback(() => {
    // Reset states when theme changes
    setIsLoading(true);
    setEmbedError(false);
    embedInitializedRef.current = false;
    scriptLoadAttemptRef.current = 0;
    lastDeploymentIdRef.current = '';
    
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    
    toast.info(`Passage en mode ${newTheme === 'dark' ? 'sombre' : 'clair'}...`);
  }, [isDark, setTheme]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  const handleRetryLoad = useCallback(() => {
    setIsLoading(true);
    setEmbedError(false);
    scriptLoadAttemptRef.current = 0;
    embedInitializedRef.current = false;
    lastDeploymentIdRef.current = '';
    
    toast.info("Rechargement de l'assistant...");
    
    // Clear existing content
    if (embedContainerRef.current) {
      embedContainerRef.current.innerHTML = '';
    }
    
    // Reinitialize
    initializePickaxeEmbed();
  }, [initializePickaxeEmbed]);

  // Handle window resize for responsiveness
  useEffect(() => {
    if (!open) return;

    const handleWindowResize = () => {
      if (isMaximized) {
        setDimensions({
          width: window.innerWidth - (isMobile ? 0 : 32),
          height: window.innerHeight - (isMobile ? 0 : 32)
        });
      } else if (isMobile) {
        // On mobile, adjust dimensions to fit screen
        const newWidth = Math.min(dimensions.width, window.innerWidth - 32);
        const newHeight = Math.min(dimensions.height, window.innerHeight - 100);
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [open, isMaximized, isMobile, dimensions]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 pointer-events-auto backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Chat Window */}
      <div
        ref={windowRef}
        className={`fixed z-50 bg-background shadow-2xl border border-border/50 overflow-hidden flex flex-col pointer-events-auto transition-all duration-200 ${
          isMobile ? 'rounded-lg' : 'rounded-xl'
        } ${isMaximized ? (isMobile ? 'inset-4' : 'ins-2') : ''}`}
        style={{
          left: isMaximized ? (isMobile ? '1rem' : '0.5rem') : `${position.x}px`,
          top: isMaximized ? (isMobile ? '1rem' : '0.5rem') : `${position.y}px`,
          width: isMaximized ? 
            (isMobile ? 'calc(100vw - 2rem)' : 'calc(100vw - 1rem)') : 
            `${dimensions.width}px`,
          height: isMaximized ? 
            (isMobile ? 'calc(100vh - 2rem)' : 'calc(100vh - 1rem)') : 
            `${dimensions.height}px`,
          minWidth: isMaximized ? 'auto' : (isMobile ? '300px' : '600px'),
          minHeight: isMaximized ? 'auto' : (isMobile ? '400px' : '500px'),
          maxWidth: isMaximized ? 'none' : (isMobile ? 'calc(100vw - 2rem)' : 'calc(100vw - 32px)'),
          maxHeight: isMaximized ? 'none' : (isMobile ? 'calc(100vh - 2rem)' : 'calc(100vh - 32px)'),
        }}
      >
        {/* Header */}
        <div 
          className={`flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 shrink-0 select-none ${
            isMobile || isMaximized ? '' : 'cursor-move'
          }`}
          onMouseDown={isMobile || isMaximized ? undefined : handleDragStart}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : embedError ? (
                <MessageSquare className="w-5 h-5 text-destructive" />
              ) : (
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">
                Assistant IA Gemini
                {isLoading && " (Chargement...)"}
                {embedError && " (Erreur)"}
              </h2>
              <p className="text-xs text-muted-foreground truncate">Recyclage Maria • Pickaxe</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Retry Button - show when error or loading takes too long */}
            {(embedError || scriptLoadAttemptRef.current > 1) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetryLoad}
                className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors rounded-md"
                title="Réessayer le chargement"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              disabled={isLoading}
              className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors rounded-md"
              title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Maximize/Minimize Button - hide on mobile */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMaximize}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors rounded-md"
                title={isMaximized ? "Réduire" : "Agrandir"}
                onMouseDown={(e) => e.stopPropagation()}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
              title="Fermer"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Embed Container */}
        <div 
          ref={embedContainerRef}
          className={`flex-1 w-full h-full overflow-auto relative
            /* Custom scrollbar styling */
            scrollbar-thin scrollbar-thumb-rounded-full
            ${isDark 
              ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-900' 
              : 'scrollbar-thumb-gray-400 scrollbar-track-gray-100'
            }
            hover:scrollbar-thumb-gray-500
          `}
          style={{ 
            minHeight: isMobile ? '300px' : '400px',
            minWidth: isMobile ? 'auto' : '600px',
            scrollbarWidth: 'thin',
            scrollbarGutter: 'stable'
          }}
        >
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-background/95 border border-border shadow-lg">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {scriptLoadAttemptRef.current === 0 
                        ? "Initialisation de l'assistant Gemini..."
                        : scriptLoadAttemptRef.current === 1
                        ? "Chargement de l'embed Pickaxe..."
                        : "Rechargement en cours..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cette opération peut prendre quelques secondes
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryLoad}
                    className="gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Réessayer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {embedError && !isLoading && (
            <div className="absolute inset-0 bg-background flex items-center justify-center p-4">
              <div className="text-center p-6 max-w-sm border border-destructive/20 rounded-xl bg-destructive/5">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Assistant non disponible
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  L'assistant Gemini n'a pas pu être chargé. Cela peut être dû à une connexion lente ou à un problème temporaire.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleRetryLoad}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Réessayer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClose}
                  >
                    Fermer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  ID: {deploymentId} • Pickaxe/Gemini
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-3 py-2 border-t border-border/50 bg-background/50 text-xs text-muted-foreground flex justify-between items-center">
          <span>Assistant IA alimenté par Gemini via Pickaxe</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {embedInitializedRef.current ? 'Connecté' : 'Connexion...'}
          </span>
        </div>

        {/* Resize Handle - hide when maximized or on mobile */}
        {!isMaximized && !isMobile && (
          <div
            onMouseDown={handleResizeStart}
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center z-20"
            title="Redimensionner"
          >
            <div className="w-3 h-3 border-r-2 border-b-2 border-primary/40 rounded-br" />
          </div>
        )}
      </div>
    </>
  );
}
