import { motion } from 'framer-motion';
import { Dialog, DialogContent } from './ui/dialog';
import { X, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface ColorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradient: {
    id: number;
    name: string;
    css: string;
    colors: string[];
    description: string;
    usage: string;
  } | null;
}

export function ColorDetailModal({ isOpen, onClose, gradient }: ColorDetailModalProps) {
  if (!gradient) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} copied to clipboard!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <motion.div
          layoutId={`gradient-${gradient.id}`}
          className="w-full h-64 relative"
          style={{
            background: gradient.css,
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h2 className="mb-2">{gradient.name}</h2>
            <p className="text-muted-foreground">{gradient.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3">Colors</h3>
              <div className="flex gap-2 flex-wrap">
                {gradient.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => copyToClipboard(color, 'Color code')}
                    >
                      {color}
                      <Copy className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3">CSS Gradient</h3>
              <div className="bg-muted rounded-lg p-3 relative">
                <code className="text-sm break-all">{gradient.css}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => copyToClipboard(gradient.css, 'CSS gradient')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3">Usage Suggestions</h3>
              <p className="text-muted-foreground">{gradient.usage}</p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}