import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type React from "react";
import { X, Maximize2, Minimize2, GripVertical, Moon, Sun, Loader2 } from "lucide-react";
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
  const { resolvedTheme, theme, setTheme } = useTheme();
  const windowRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const currentDeploymentIdRef = useRef<string>('');
  const toastShownRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const embedInitializedRef = useRef(false);

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
    
    // Reset loading state
    setIsLoading(true);
    embedInitializedRef.current = false;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(calculateInitialPosition, 50);
    
    return () => clearTimeout(timer);
  }, [open, calculateInitialPosition]);

  // Cleanup when closing
  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      embedInitializedRef.current = false;
      
      // Clean up the embed container
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = '';
      }
      
      // Clean up resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      
      currentDeploymentIdRef.current = '';
      toastShownRef.current = false;
      
      // Clean up script
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    }
  }, [open]);

  // Handle embed initialization with optimized loading
  useEffect(() => {
    if (!open || !embedContainerRef.current) {
      return;
    }

    // If we're already showing the correct deployment and it's initialized, do nothing
    if (currentDeploymentIdRef.current === deploymentId && embedInitializedRef.current) {
      setIsLoading(false);
      return;
    }

    // Show loading toast only once per session
    if (!toastShownRef.current) {
      toast.info("Chargement de l'assistant IA...", {
        duration: 1500,
      });
      toastShownRef.current = true;
    }

    // Clean up previous embed
    if (embedContainerRef.current) {
      embedContainerRef.current.innerHTML = '';
    }

    // Create container for the embed with proper styling
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    
    // Create the embed div with the correct ID
    const embedDiv = document.createElement('div');
    embedDiv.id = deploymentId;
    embedDiv.style.width = '100%';
    embedDiv.style.height = '100%';
    embedDiv.style.flex = '1';
    embedDiv.style.minHeight = '400px';
    embedDiv.style.background = 'transparent';
    
    container.appendChild(embedDiv);
    embedContainerRef.current.appendChild(container);
    
    // Update current deployment ID
    currentDeploymentIdRef.current = deploymentId;
    
    // Optimized script loading with preconnection hints
    const loadPickaxeScript = () => {
      // Remove existing script if present
      const existingScript = document.querySelector('script[src*="pickaxe"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      
      // Preconnect to improve loading speed
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = 'https://studio.pickaxe.co';
      document.head.appendChild(preconnect);
      
      // Create new script
      const script = document.createElement('script');
      script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Pickaxe script loaded for:', deploymentId);
        
        // Give time for embed to initialize
        setTimeout(() => {
          setIsLoading(false);
          embedInitializedRef.current = true;
          
          // Initialize resize observer for embed container
          if (embedContainerRef.current && !resizeObserverRef.current) {
            resizeObserverRef.current = new ResizeObserver(() => {
              // Force embed to resize on container change
              if (window.PickaxeEmbed && window.PickaxeEmbed.refresh) {
                try {
                  window.PickaxeEmbed.refresh();
                } catch (error) {
                  console.log('Embed refresh not available');
                }
              }
            });
            
            resizeObserverRef.current.observe(embedContainerRef.current);
          }
        }, 800);
      };
      
      script.onerror = () => {
        console.error('Failed to load Pickaxe script');
        setIsLoading(false);
        toast.error("Erreur lors du chargement de l'assistant");
      };
      
      document.body.appendChild(script);
      scriptRef.current = script;
    };

    // Load with a small delay to ensure DOM is ready
    const loadTimer = setTimeout(loadPickaxeScript, 100);
    
    return () => {
      clearTimeout(loadTimer);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [open, deploymentId]);

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
      
      // Refresh embed on resize complete
      if (embedInitializedRef.current && window.PickaxeEmbed && window.PickaxeEmbed.refresh) {
        setTimeout(() => {
          try {
            window.PickaxeEmbed.refresh();
          } catch (error) {
            console.log('Embed refresh error:', error);
          }
        }, 100);
      }
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
    // Reset loading state when theme changes
    setIsLoading(true);
    embedInitializedRef.current = false;
    toastShownRef.current = false;
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDark, setTheme]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
    
    // Refresh embed on maximize toggle
    if (embedInitializedRef.current && window.PickaxeEmbed && window.PickaxeEmbed.refresh) {
      setTimeout(() => {
        try {
          window.PickaxeEmbed.refresh();
        } catch (error) {
          console.log('Embed refresh error on maximize:', error);
        }
      }, 300);
    }
  }, []);

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
      
      // Refresh embed on window resize
      if (embedInitializedRef.current && window.PickaxeEmbed && window.PickaxeEmbed.refresh) {
        setTimeout(() => {
          try {
            window.PickaxeEmbed.refresh();
          } catch (error) {
            console.log('Embed refresh error on window resize:', error);
          }
        }, 200);
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
              ) : (
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">
                Assistant IA {isLoading && "(Chargement...)"}
              </h2>
              <p className="text-xs text-muted-foreground truncate">Recyclage Maria</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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

        {/* Embed Container with scrollbar */}
        <div 
          ref={embedContainerRef}
          className={`flex-1 w-full h-full bg-background overflow-auto relative
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
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Chargement de l'assistant...
                </p>
              </div>
            </div>
          )}
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
