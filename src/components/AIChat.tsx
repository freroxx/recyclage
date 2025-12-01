import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Minimize2, GripVertical } from "lucide-react";
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
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState<false | 'both' | 'height'>(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { resolvedTheme, theme } = useTheme();
  const windowRef = useRef<HTMLDivElement>(null);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  const currentTheme = resolvedTheme || theme || 'light';
  const deploymentId = currentTheme === 'dark'
    ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
    : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947';

  // Load Pickaxe script
  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      setIsLoading(false);
    };
    script.onerror = () => {
      console.error('Failed to load Pickaxe embed script');
      setIsLoading(false);
    };
    
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Re-render embed when theme changes or dialog opens
  useEffect(() => {
    if (!open || !embedContainerRef.current || !scriptLoadedRef.current) return;

    // Clear existing embed
    embedContainerRef.current.innerHTML = '';

    // Create new embed div
    const embedDiv = document.createElement('div');
    embedDiv.id = deploymentId;
    embedDiv.className = 'w-full h-full';
    embedContainerRef.current.appendChild(embedDiv);

    // Small delay to ensure script picks up the new div
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [open, deploymentId]);

  // Handle dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!windowRef.current) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setPosition(prev => {
        if (!prev) return prev;

        const rect = windowRef.current!.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 32; // 32px for padding
        const maxY = window.innerHeight - rect.height - 32;

        return {
          x: Math.min(Math.max(prev.x + deltaX, 16), maxX),
          y: Math.min(Math.max(prev.y + deltaY, 16), maxY),
        };
      });

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Handle resizing
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      setDimensions(prev => ({
        width: Math.min(Math.max(prev.width + deltaX, 400), 2500),
        height: Math.min(Math.max(prev.height + deltaY, 500), 2500),
      }));

      setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startPos]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    // Initialize position if not set
    if (!position && windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing('both');
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={windowRef}
        className="pointer-events-auto bg-background rounded-lg shadow-2xl border border-border overflow-hidden flex flex-col"
        style={{
          position: 'absolute',
          left: isMaximized ? '1rem' : position ? `${position.x}px` : '50%',
          top: isMaximized ? '1rem' : position ? `${position.y}px` : '50%',
          transform: position ? 'none' : 'translate(-50%, -50%)',
          width: isMaximized ? 'calc(100vw - 2rem)' : `${dimensions.width}px`,
          height: isMaximized ? 'calc(100vh - 2rem)' : `${dimensions.height}px`,
          maxWidth: 'calc(100vw - 2rem)',
          minWidth: '400px',
          minHeight: '500px',
          maxHeight: 'calc(100vh - 2rem)',
          animation: position ? 'none' : 'fadeInScale 0.3s ease-out',
          transition: isDragging ? 'none' : 'width 0.3s, height 0.3s',
        }}
      >
        <div 
          className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 shrink-0 cursor-move select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-md"
              title="Fermer"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center bg-background/50">
            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Chargement de l&apos;assistant...</p>
            </div>
          </div>
        )}

        <div 
          ref={embedContainerRef}
          className={`flex-1 overflow-hidden bg-background ${isLoading ? 'hidden' : ''}`}
          style={{ minHeight: 0 }}
        />

        <div
          onMouseDown={handleResizeStart}
          className="h-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-t border-border/50 cursor-nwse-resize hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/20 hover:to-primary/10 transition-colors flex items-center justify-center gap-1"
          title="Redimensionner"
        >
          <GripVertical className="w-3 h-3 text-primary/40" />
        </div>
      </div>
    </div>
  );
}
