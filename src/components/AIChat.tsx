import { useState, useEffect, useRef, useCallback } from "react";
import type React from "react";
import { X, Maximize2, Minimize2, GripVertical, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 600, height: 700 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<false | 'both' | 'height'>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { resolvedTheme, theme, setTheme } = useTheme();
  const windowRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const embedInitializedRef = useRef(false);

  const currentTheme = resolvedTheme || theme || 'light';
  const isDark = currentTheme === 'dark';

  // Initialize position on open
  useEffect(() => {
    if (!open) return;

    const calculateInitialPosition = () => {
      const padding = 32;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const targetWidth = Math.min(600, vw - padding);
      const targetHeight = Math.min(700, vh - padding);

      const centerX = (vw - targetWidth) / 2;
      const centerY = (vh - targetHeight) / 2;

      setDimensions({ width: targetWidth, height: targetHeight });
      setPosition({ x: centerX, y: centerY });
      setIsMaximized(false);
    };

    setTimeout(calculateInitialPosition, 10);
  }, [open]);

  // Load Pickaxe script and initialize embed
  useEffect(() => {
    if (!open) return;

    let script: HTMLScriptElement | null = null;

    const initializeEmbed = () => {
      if (!embedContainerRef.current) return;

      // Clear existing content
      embedContainerRef.current.innerHTML = '';

      // Create new embed div
      const embedDiv = document.createElement('div');
      embedDiv.id = isDark 
        ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
        : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947';
      embedDiv.className = 'w-full h-full';
      embedDiv.style.width = '100%';
      embedDiv.style.height = '100%';
      embedDiv.style.minHeight = '0';
      
      embedContainerRef.current.appendChild(embedDiv);

      // If script is already loaded, check if we need to reinitialize
      if (scriptLoadedRef.current && (window as any).PickaxeEmbed) {
        const embedApi = (window as any).PickaxeEmbed;
        
        // Destroy any existing embed
        if (embedInitializedRef.current) {
          try {
            embedApi.destroy(`#${embedDiv.id}`);
          } catch (e) {
            console.log('No existing embed to destroy');
          }
        }
        
        // Initialize new embed
        setTimeout(() => {
          try {
            embedApi.initialize(`#${embedDiv.id}`);
            embedInitializedRef.current = true;
            setIsLoading(false);
          } catch (error) {
            console.error('Failed to initialize Pickaxe embed:', error);
            setIsLoading(false);
          }
        }, 100);
      }
    };

    if (!scriptLoadedRef.current) {
      // Load script if not already loaded
      script = document.createElement('script');
      script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
      script.defer = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        setTimeout(() => {
          initializeEmbed();
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Pickaxe embed script');
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
    } else {
      // Script already loaded, just initialize embed
      initializeEmbed();
    }

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [open, isDark]);

  // Cleanup when closing
  useEffect(() => {
    if (!open && embedInitializedRef.current) {
      // Clean up embed when closing
      embedInitializedRef.current = false;
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = '';
      }
    }
  }, [open]);

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

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
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      setDimensions(prev => {
        const minWidth = 400;
        const minHeight = 400;
        const maxWidth = window.innerWidth - 32;
        const maxHeight = window.innerHeight - 32;

        const newWidth = Math.max(minWidth, Math.min(prev.width + deltaX, maxWidth));
        const newHeight = Math.max(minHeight, Math.min(prev.height + deltaY, maxHeight));

        // Adjust position to keep window in bounds
        if (windowRef.current && position) {
          const rect = windowRef.current.getBoundingClientRect();
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
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos, position]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing('both');
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChange(false);
  };

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDark, setTheme]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-50 pointer-events-auto"
        onClick={handleClose}
      />
      
      {/* Chat Window */}
      <div
        ref={windowRef}
        className="fixed z-50 bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col pointer-events-auto"
        style={{
          left: isMaximized ? '1rem' : `${position.x}px`,
          top: isMaximized ? '1rem' : `${position.y}px`,
          width: isMaximized ? 'calc(100vw - 2rem)' : `${dimensions.width}px`,
          height: isMaximized ? 'calc(100vh - 2rem)' : `${dimensions.height}px`,
          minWidth: isMaximized ? 'auto' : '280px',
          minHeight: isMaximized ? 'auto' : '400px',
          maxWidth: 'calc(100vw - 2rem)',
          maxHeight: 'calc(100vh - 2rem)',
        }}
        onMouseDown={(e) => {
          // Bring window to front when clicked
          if (windowRef.current) {
            windowRef.current.style.zIndex = '51';
          }
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 shrink-0 cursor-move select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">Assistant IA</h2>
              <p className="text-xs text-muted-foreground truncate">Recyclage Maria</p>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
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

            {/* Maximize/Minimize Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center bg-background/50">
            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">
                {isDark ? 'Chargement du mode sombre...' : 'Chargement du mode clair...'}
              </p>
            </div>
          </div>
        )}

        {/* Embed Container */}
        <div 
          ref={embedContainerRef}
          className={`flex-1 overflow-hidden bg-background ${isLoading ? 'hidden' : ''}`}
          style={{ minHeight: 0 }}
        />

        {/* Resize Handle */}
        {!isMaximized && (
          <div
            onMouseDown={handleResizeStart}
            className="h-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-t border-border/50 cursor-nwse-resize hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/20 hover:to-primary/10 transition-colors flex items-center justify-center gap-1"
            title="Redimensionner"
          >
            <GripVertical className="w-3 h-3 text-primary/40" />
          </div>
        )}
      </div>

      {/* Global Styles for animation */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        #deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec,
        #deployment-856e4e42-a135-4ce5-aeda-7a915c379947 {
          width: 100% !important;
          height: 100% !important;
          min-height: 0 !important;
        }
      `}</style>
    </>
  );
}

// Extend Window interface for PickaxeEmbed
declare global {
  interface Window {
    PickaxeEmbed?: {
      initialize: (selector: string) => void;
      destroy: (selector: string) => void;
    };
  }
}
