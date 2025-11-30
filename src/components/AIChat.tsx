import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Bot, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const currentTheme = resolvedTheme || theme || 'light';
  const deploymentId = currentTheme === 'dark'
    ? 'deployment-afcd3047-9cd1-4849-bea0-4a67ad07f5ec'
    : 'deployment-856e4e42-a135-4ce5-aeda-7a915c379947';

  useEffect(() => {
    if (!open) return;

    const loadScript = () => {
      const existingScript = document.querySelector('script[src="https://studio.pickaxe.co/api/embed/bundle.js"]');

      if (existingScript) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://studio.pickaxe.co/api/embed/bundle.js';
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Pickaxe embed script');
      };

      document.body.appendChild(script);
      scriptRef.current = script;
    };

    loadScript();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open || !scriptLoaded || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = `<div id="${deploymentId}" class="w-full h-full"></div>`;

    const timer = setTimeout(() => {
      if (window.Pickaxe && window.Pickaxe.init) {
        window.Pickaxe.init();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      container.innerHTML = '';
    };
  }, [open, scriptLoaded, deploymentId, currentTheme]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`p-0 gap-0 transition-all duration-300 ease-in-out flex flex-col ${
          isMaximized
            ? 'max-w-[95vw] w-[95vw] h-[95vh]'
            : 'max-w-4xl w-full h-[85vh]'
        }`}
      >
        <DialogDescription className="sr-only">
          AI Assistant for Maria School Recycling Project
        </DialogDescription>
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0 bg-background/95 backdrop-blur-sm shrink-0 gap-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Assistant IA</div>
              <div className="text-[10px] text-muted-foreground font-normal">Recyclage Maria</div>
            </div>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaximized(!isMaximized)}
            className="hover:bg-primary/10 transition-colors h-8 w-8 p-0 shrink-0"
            title={isMaximized ? "Réduire" : "Agrandir"}
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden min-h-0">
          <div
            ref={containerRef}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

declare global {
  interface Window {
    Pickaxe?: {
      init: () => void;
    };
  }
}
