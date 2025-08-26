import { motion } from 'framer-motion';

interface GradientCardProps {
  gradient: {
    id: number;
    name: string;
    css: string;
    colors: string[];
    description: string;
    usage: string;
  };
  onClick: () => void;
}

export function GradientCard({ gradient, onClick }: GradientCardProps) {
  return (
    <motion.div
      className="aspect-square rounded-2xl cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{
        background: gradient.css,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layoutId={`gradient-${gradient.id}`}
    />
  );
}