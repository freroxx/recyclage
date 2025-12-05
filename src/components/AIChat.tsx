import { useState, useEffect, useRef, useCallback } from "react";
import type React from "react";
import { X, Maximize2, Minimize2, GripVertical, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner"; // or your preferred toast library

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

declare global {
  interface Window {
    PickaxeEmbed?: any;
  }
}

export function AIChat({ open, onOpenChange, isMobile = false }: AIChatProps) {
  const [isMaximized, setIsMaximized] = useState(isMobile);
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 }); // Increased default width
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<false | 'both' | 'height'>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { resolvedTheme, theme, setTheme } = useTheme();
  const windowRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const currentDeploymentIdRef = useRef<string>('');
  const toastShownRef = useRef(false);

  const currentTheme = resolvedTheme || theme || 'light';
  const isDark = currentTheme === 'dark';
  const deploymentId = isDark 
    ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
    : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947';

  // Show toast notifications
  const showLoadingToast = useCallback(() => {
    const message = isDark 
      ? "Chargement du mode sombre..." 
      : "Chargement du mode clair...";
    toast.info(message, {
      duration: 2000,
    });
  }, [isDark]);

  const showSuccessToast = useCallback(() => {
    if (!toastShownRef.current) {
      toast.success("L'assistant IA a été chargé avec succès", {
        duration: 3000,
      });
      toastShownRef.current = true;
    }
  }, []);

  // Initialize position on open
  useEffect(() => {
    if (!open) return;

    // On mobile, always start maximized (fullscreen)
    if (isMobile) {
      setIsMaximized(true);
      return;
    }

    const calculateInitialPosition = () => {
      const padding = 32;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Use larger width for better embed display
      const targetWidth = Math.min(800, vw - padding);
      const targetHeight = Math.min(700, vh - padding);

      const centerX = (vw - targetWidth) / 2;
      const centerY = (vh - targetHeight) / 2;

      setDimensions({ width: targetWidth, height: targetHeight });
      setPosition({ x: centerX, y: centerY });
      setIsMaximized(false);
    };

    setTimeout(calculateInitialPosition, 10);
  }, [open, isMobile]);

  // Cleanup when closing
  useEffect(() => {
    if (!open) {
      // Clean up the embed container
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = '';
      }
      currentDeploymentIdRef.current = '';
      toastShownRef.current = false;
    }
  }, [open]);

  // Handle embed initialization
  useEffect(() => {
    if (!open || !embedContainerRef.current) {
      return;
    }

    // If we're already showing the correct deployment, do nothing
    if (currentDeploymentIdRef.current === deploymentId) {
      showSuccessToast();
      return;
    }

    // Show loading toast
    showLoadingToast();

    // Clean up previous embed
    if (embedContainerRef.current) {
      embedContainerRef.current.innerHTML = '';
    }

    // Create container for the embed with proper styling
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.position = 'relative';
    container.style.overflow = isMobile ? 'auto' : 'hidden';
    if (!isMobile) {
      container.style.minWidth = '600px';
    }
    
    // Create the embed div with the correct ID
    const embedDiv = document.createElement('div');
    embedDiv.id = deploymentId;
    embedDiv.style.width = '100%';
    embedDiv.style.height = '100%';
    embedDiv.style.minHeight = isMobile ? '300px' : '400px';
    if (!isMobile) {
      embedDiv.style.minWidth = '600px';
    }
    
    container.appendChild(embedDiv);
    embedContainerRef.current.appendChild(container);
    
    // Update current deployment ID
    currentDeploymentIdRef.current = deploymentId;
    
    // Load or reload the Pickaxe script
    const loadPickaxeScript = () => {
      // Remove existing script if present
      const existingScript = document.querySelector('script[src*="pickaxe"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      
      // Create new script
      const script = document.createElement('script');
      script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
      script.defer = true;
      
      script.onload = () => {
        console.log('Pickaxe script loaded for:', deploymentId);
        
        // Wait a bit for the script to initialize the embed
        setTimeout(() => {
          showSuccessToast();
        }, 1500);
      };
      
      script.onerror = () => {
        console.error('Failed to load Pickaxe script');
        toast.error("Erreur lors du chargement de l'assistant");
      };
      
      document.body.appendChild(script);
      scriptRef.current = script;
    };

    // Load the script
    loadPickaxeScript();

    return () => {
      // Cleanup if component unmounts before script loads
    };
  }, [open, deploymentId, showLoadingToast, showSuccessToast, isMobile]);

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
        const minWidth = 600; // Increased minimum width for better embed display
        const minHeight = 500;
        const maxWidth = window.innerWidth - 32;
        const maxHeight = window.innerHeight - 32;

        const newWidth = Math.max(minWidth, Math.min(prev.width + deltaX, maxWidth));
        const newHeight = Math.max(minHeight, Math.min(prev.height + deltaY, maxHeight));

        if (windowRef.current && position) {
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
    // Reset toast shown flag when theme changes
    toastShownRef.current = false;
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
        className={`fixed z-50 bg-background shadow-2xl border border-border overflow-hidden flex flex-col pointer-events-auto ${isMobile ? 'rounded-none' : 'rounded-lg'}`}
        style={{
          left: isMaximized ? (isMobile ? '0' : '1rem') : `${position.x}px`,
          top: isMaximized ? (isMobile ? '0' : '1rem') : `${position.y}px`,
          width: isMaximized ? (isMobile ? '100vw' : 'calc(100vw - 2rem)') : `${dimensions.width}px`,
          height: isMaximized ? (isMobile ? '100vh' : 'calc(100vh - 2rem)') : `${dimensions.height}px`,
          minWidth: isMaximized || isMobile ? 'auto' : '600px',
          minHeight: isMaximized || isMobile ? 'auto' : '500px',
          maxWidth: isMobile ? '100vw' : 'calc(100vw - 2rem)',
          maxHeight: isMobile ? '100vh' : 'calc(100vh - 2rem)',
        }}
      >
        {/* Header */}
        <div 
          className={`flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 shrink-0 select-none ${isMobile ? '' : 'cursor-move'}`}
          onMouseDown={isMobile ? undefined : handleDragStart}
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

            {/* Maximize/Minimize Button - hide on mobile */}
            {!isMobile && (
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

        {/* Embed Container - Always visible */}
        <div 
          ref={embedContainerRef}
          className="flex-1 w-full h-full bg-background overflow-auto"
          style={{ 
            minHeight: isMobile ? '200px' : '400px',
            minWidth: isMobile ? 'auto' : '600px'
          }}
        />

        {/* Resize Handle - hide on mobile */}
        {!isMaximized && !isMobile && (
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
