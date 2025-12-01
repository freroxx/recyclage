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
  const currentDeploymentIdRef = useRef<string>('');

  const currentTheme = resolvedTheme || theme || 'light';
  const isDark = currentTheme === 'dark';
  const deploymentId = isDark 
    ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
    : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947';

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

  // Load Pickaxe script once
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.defer = true;
    
    script.onload = () => {
      console.log('Pickaxe script loaded');
      scriptLoadedRef.current = true;
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Pickaxe embed script:', error);
      setIsLoading(false);
    };
    
    document.body.appendChild(script);

    return () => {
      // Don't remove the script, keep it loaded globally
    };
  }, []);

  // Initialize or update embed when theme or open state changes
  useEffect(() => {
    if (!open || !embedContainerRef.current) {
      setIsLoading(true);
      return;
    }

    // If deployment hasn't changed and we're already loaded, skip
    if (currentDeploymentIdRef.current === deploymentId && !isLoading) {
      return;
    }

    const initializeEmbed = () => {
      if (!embedContainerRef.current) return;

      // Clear existing content
      embedContainerRef.current.innerHTML = '';

      // Create embed container
      const container = document.createElement('div');
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.position = 'relative';
      container.style.overflow = 'hidden';
      
      // Create the embed div
      const embedDiv = document.createElement('div');
      embedDiv.id = deploymentId;
      embedDiv.style.width = '100%';
      embedDiv.style.height = '100%';
      embedDiv.style.minHeight = '0';
      
      container.appendChild(embedDiv);
      embedContainerRef.current.appendChild(container);

      currentDeploymentIdRef.current = deploymentId;
      
      // Check if script is loaded
      if (!scriptLoadedRef.current) {
        // Wait for script to load
        const checkScript = setInterval(() => {
          if (scriptLoadedRef.current) {
            clearInterval(checkScript);
            // Give a moment for the script to initialize
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
          clearInterval(checkScript);
          setIsLoading(false);
          console.warn('Pickaxe script loading timeout');
        }, 5000);
      } else {
        // Script already loaded
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    initializeEmbed();

    return () => {
      // Clean up when component unmounts or before re-initializing
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = '';
      }
    };
  }, [open, deploymentId, isLoading]);

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
    // Force re-initialization when theme changes
    setIsLoading(true);
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
          <div className="flex-1 flex flex-col items-center justify-center bg-background/50 p-4">
            <div className="space-y-4 text-center max-w-xs">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Chargement de l&apos;assistant...
                </p>
                <p className="text-xs text-muted-foreground">
                  {isDark ? 'Mode sombre' : 'Mode clair'}
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoading(false)}
                  className="text-xs"
                >
                  Annuler le chargement
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Embed Container */}
        <div 
          ref={embedContainerRef}
          className={`flex-1 w-full h-full ${isLoading ? 'hidden' : 'block'}`}
          style={{ minHeight: 0 }}
        />

        {/* Resize Handle */}
        {!isMaximized && !isLoading && (
          <div
            onMouseDown={handleResizeStart}
            className="h-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-t border-border/50 cursor-nwse-resize hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/20 hover:to-primary/10 transition-colors flex items-center justify-center gap-1 shrink-0"
            title="Redimensionner"
          >
            <GripVertical className="w-3 h-3 text-primary/40" />
          </div>
        )}
      </div>
    </>
  );
}
