import { motion } from 'framer-motion';
import { Award, TrendingUp, Star } from 'lucide-react';

interface PerformanceBadgeProps {
  averageScore: number;
}

type PerformanceLevel = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
};

export const PerformanceBadge = ({ averageScore }: PerformanceBadgeProps) => {
  const getPerformanceLevel = (): PerformanceLevel => {
    if (averageScore >= 80) {
      return {
        label: 'Advanced',
        icon: <Star className="w-5 h-5" />,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10 border-green-500/20',
        description: 'Excellent pronunciation skills!',
      };
    }
    if (averageScore >= 60) {
      return {
        label: 'Improving',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        description: 'Great progress, keep it up!',
      };
    }
    return {
      label: 'Beginner',
      icon: <Award className="w-5 h-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      description: 'Building your foundation',
    };
  };

  const level = getPerformanceLevel();

  if (averageScore === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-3 p-3 rounded-xl border ${level.bgColor}`}
    >
      <div className={`p-2 rounded-full ${level.bgColor} ${level.color}`}>
        {level.icon}
      </div>
      <div>
        <p className={`font-semibold ${level.color}`}>{level.label}</p>
        <p className="text-xs text-muted-foreground">{level.description}</p>
      </div>
    </motion.div>
  );
};
