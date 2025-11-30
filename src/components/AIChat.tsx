import { useState, useEffect, useRef } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme, theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentTheme = resolvedTheme || theme || 'light';
  const deploymentId = currentTheme === 'dark'
    ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
    : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947';

  const embedUrl = `https://studio.pickaxe.co/api/embed?deploymentId=${deploymentId}`;

  useEffect(() => {
    if (!open) {
      setIsLoading(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
    script.async = true;

    const handleLoad = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div id="${deploymentId}" style="width: 100%; height: 100%;"></div>`;
        if (window.Pickaxe?.render) {
          window.Pickaxe.render(deploymentId);
        }
      }
      setIsLoading(false);
    };

    script.onload = handleLoad;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [open, deploymentId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4 sm:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full sm:w-full max-w-2xl h-[80vh] sm:h-[80vh] md:h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div
          className={`flex flex-col h-full bg-background rounded-t-lg sm:rounded-lg shadow-2xl border border-border overflow-hidden transition-all duration-300 ${
            isMaximized ? 'fixed inset-4 sm:inset-0 max-w-none' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50 shrink-0">
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

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors rounded-md"
                title={isMaximized ? "Réduire" : "Agrandir"}
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
            ref={containerRef}
            className={`flex-1 overflow-auto bg-background ${isLoading ? 'hidden' : ''}`}
            style={{
              minHeight: 0,
              display: isLoading ? 'none' : 'block',
            }}
          />
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    Pickaxe?: {
      render: (id: string) => void;
      init?: () => void;
    };
  }
}
