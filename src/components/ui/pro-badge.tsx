import { cn } from '@/lib/utils';
import { useSubscription } from '@/hooks/useSubscription';

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProBadge = ({ className, size = 'sm' }: ProBadgeProps) => {
  const { isPro, isLoading } = useSubscription();

  if (isLoading || !isPro) return null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold uppercase tracking-wider rounded-full',
        'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600',
        'text-amber-950 shadow-lg',
        'animate-pulse-subtle',
        'ring-1 ring-amber-300/50',
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow: '0 0 12px rgba(251, 191, 36, 0.5), 0 0 24px rgba(251, 191, 36, 0.3)',
      }}
    >
      PRO
    </span>
  );
};
