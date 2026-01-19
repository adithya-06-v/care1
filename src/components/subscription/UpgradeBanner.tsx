import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { Sparkles, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UpgradeBannerProps {
  feature?: string;
}

export const UpgradeBanner = ({ feature }: UpgradeBannerProps) => {
  const { isPro, createCheckout } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isPro || dismissed) return null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      await createCheckout();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-xl p-4 mb-6 relative">
      <button 
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {feature ? `Unlock ${feature}` : 'Upgrade to Pro'}
            </p>
            <p className="text-sm text-muted-foreground">
              Get unlimited sessions, detailed analytics & more
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleUpgrade}
          disabled={isLoading}
          className="ml-auto rounded-pill shadow-button"
        >
          {isLoading ? 'Loading...' : 'Upgrade to Pro — $20/mo'}
        </Button>
      </div>
    </div>
  );
};
