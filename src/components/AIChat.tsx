import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bot, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`p-0 gap-0 transition-all duration-300 ease-in-out ${
          isMaximized 
            ? 'max-w-[95vw] w-[95vw] h-[95vh]' 
            : 'max-w-4xl w-full h-[80vh]'
        }`}
      >
        <DialogHeader className="px-6 py-4 border-b flex-row items-center justify-between space-y-0 bg-background/95 backdrop-blur-sm">
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Assistant IA</div>
              <div className="text-xs text-muted-foreground font-normal">Recyclage Maria</div>
            </div>
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaximized(!isMaximized)}
            className="hover:bg-primary/10 transition-colors"
            title={isMaximized ? "Réduire" : "Agrandir"}
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src="https://studio.pickaxe.co/STUDIOL44F5RXZ1VD9FX9/Q9EUMKWZHV"
            className="w-full h-full rounded-b-lg"
            title="Assistant IA Recyclage"
            allow="clipboard-write"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
