import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bot } from "lucide-react";

interface AIChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChat({ open, onOpenChange }: AIChatProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Assistant IA - Recyclage Maria
          </DialogTitle>
        </DialogHeader>
        <iframe
          src="https://studio.pickaxe.co/STUDIOL44F5RXZ1VD9FX9/Q9EUMKWZHV"
          className="w-full h-full rounded-b-lg"
          title="Assistant IA Recyclage"
          allow="clipboard-write"
        />
      </DialogContent>
    </Dialog>
  );
}
