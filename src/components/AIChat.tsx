import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, Maximize2, Minimize2, Moon, Sun, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  const isMobile = useIsMobile();
  const [isMaximized, setIsMaximized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme, setTheme } = useTheme();
  
  const windowRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const dimensionsRef = useRef(dimensions);
  const scriptLoadedRef = useRef(false);

  const currentTheme = resolvedTheme || 'light';
  const isDark = currentTheme === 'dark';
  
  const deploymentId = useMemo(() => 
    isDark 
      ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
      : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947',
    [isDark]
  );

  // Initialize position and dimensions
  useEffect(() => {
    if (!open) return;

    const updateDimensions = () => {
      if (isMobile) {
        setIsMaximized(true);
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
        setPosition({ x: 0, y: 0 });
      } else {
        const width = Math.min(800, window.innerWidth - 64);
        const height = Math.min(700, window.innerHeight - 64);
        const x = (window.innerWidth - width) / 2;
        const y = (window.innerHeight - height) / 2;
        
        setDimensions({ width, height });
        setPosition({ x, y });
        setIsMaximized(false);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [open, isMobile]);

  // Update refs when state changes
  useEffect(() => {
    positionRef.current = position;
    dimensionsRef.current = dimensions;
  }, [position, dimensions]);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      scriptLoadedRef.current = false;
      if (embedContainerRef.current) {
        embedContainerRef.current.innerHTML = '';
      }
    }
  }, [open]);

  // Load Pickaxe embed
  useEffect(() => {
    if (!open || !embedContainerRef.current || scriptLoadedRef.current) return;

    let mounted = true;
    const container = embedContainerRef.current;

    const loadEmbed = async () => {
      try {
        setIsLoading(true);
        
        // Clear container
        container.innerHTML = '';
        
        // Create embed div
        const embedDiv = document.createElement('div');
        embedDiv.id = deploymentId;
        embedDiv.style.width = '100%';
        embedDiv.style.height = '100%';
        embedDiv.style.minHeight = '400px';
        embedDiv.style.background = 'transparent';
        container.appendChild(embedDiv);

        // Check if script already exists
        const existingScript = document.querySelector('script[src*="pickaxe"]');
        if (existingScript && window.PickaxeEmbed) {
          // Script already loaded, just update
          scriptLoadedRef.current = true;
          setIsLoading(false);
          return;
        }

        // Remove existing script if any
        if (existingScript) {
          existingScript.remove();
        }

        // Load Pickaxe script
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            if (!mounted) return;
            scriptLoadedRef.current = true;
            
            // Small delay for embed to initialize
            setTimeout(() => {
              if (mounted) {
                setIsLoading(false);
                toast.success("Assistant IA chargé");
              }
              resolve();
            }, 800);
          };
          
          script.onerror = (error) => {
            if (!mounted) return;
            console.error('Failed to load Pickaxe:', error);
            toast.error("Erreur de chargement");
            reject(error);
          };
          
          document.head.appendChild(script);
        });
      } catch (error) {
        if (mounted) {
          setIsLoading(false);
          toast.error("Échec du chargement");
        }
      }
    };

    loadEmbed();

    return () => {
      mounted = false;
    };
  }, [open, deploymentId]);

  // Dragging functionality
  useEffect(() => {
    if (isMaximized || isMobile || !isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      setPosition(prev => {
        const newX = prev.x + deltaX;
        const newY = prev.y + deltaY;
        
        // Boundary check
        const maxX = window.innerWidth - dimensionsRef.current.width;
        const maxY = window.innerHeight - dimensionsRef.current.height;
        
        return {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        };
      });
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized, isMobile]);

  // Resizing functionality
  useEffect(() => {
    if (isMaximized || isMobile || !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      
      setDimensions(prev => {
        const minWidth = isMobile ? 300 : 400;
        const minHeight = isMobile ? 400 : 500;
        const maxWidth = window.innerWidth - positionRef.current.x;
        const maxHeight = window.innerHeight - positionRef.current.y;
        
        const newWidth = Math.max(minWidth, Math.min(prev.width + deltaX, maxWidth));
        const newHeight = Math.max(minHeight, Math.min(prev.height + deltaY, maxHeight));
        
        return { width: newWidth, height: newHeight };
      });
      
      resizeStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'nwse-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isMaximized, isMobile]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isMaximized, isMobile]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized || isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isMaximized, isMobile]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChange(false);
  }, [onOpenChange]);

  const toggleTheme = useCallback(() => {
    setIsLoading(true);
    scriptLoadedRef.current = false;
    setTheme(isDark ? 'light' : 'dark');
    toast.info(`Passage au mode ${isDark ? 'clair' : 'sombre'}`);
  }, [isDark, setTheme]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 pointer-events-auto backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Chat Window */}
      <div
        ref={windowRef}
        className={`fixed z-50 bg-background border border-border overflow-hidden flex flex-col pointer-events-auto shadow-2xl transition-all duration-200 ${
          isMobile || isMaximized ? 'rounded-none' : 'rounded-lg'
        }`}
        style={{
          left: isMaximized ? 0 : `${position.x}px`,
          top: isMaximized ? 0 : `${position.y}px`,
          width: isMaximized ? '100vw' : `${dimensions.width}px`,
          height: isMaximized ? '100vh' : `${dimensions.height}px`,
          minWidth: isMaximized ? 'auto' : (isMobile ? '100%' : '400px'),
          minHeight: isMaximized ? 'auto' : (isMobile ? '100%' : '500px'),
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-transparent border-b border-border shrink-0 select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Assistant IA {isLoading && "(Chargement...)"}
              </h2>
              <p className="text-xs text-muted-foreground">Recyclage Maria</p>
            </div>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              disabled={isLoading}
              className="h-8 w-8 p-0"
              title={isDark ? "Mode clair" : "Mode sombre"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMaximize}
                disabled={isLoading}
                className="h-8 w-8 p-0"
                title={isMaximized ? "Réduire" : "Agrandir"}
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Embed Container with Custom Scrollbar */}
        <div 
          ref={embedContainerRef}
          className={`flex-1 w-full h-full overflow-auto bg-background
            scrollbar-thin scrollbar-thumb-rounded-full
            ${isDark 
              ? 'scrollbar-thumb-gray-700 scrollbar-track-gray-900' 
              : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
            }
            hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-600
          `}
          style={{ 
            minHeight: isMobile ? '300px' : '400px',
            scrollbarWidth: 'thin',
          }}
        />

        {/* Resize Handle - Only show when not maximized and not on mobile */}
        {!isMaximized && !isMobile && (
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-10"
            onMouseDown={handleResizeStart}
            title="Redimensionner"
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-primary/50" />
          </div>
        )}

        {/* Visual resize indicator in bottom-right corner */}
        {!isMaximized && !isMobile && (
          <div className="absolute bottom-0 right-0 w-20 h-6 cursor-nwse-resize flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-primary/40" />
          </div>
        )}
      </div>
    </>
  );
}
