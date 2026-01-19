import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ProFeatureGateProps {
  children: ReactNode;
  featureName: string;
  showPreview?: boolean;
}

export const ProFeatureGate = ({ children, featureName, showPreview = false }: ProFeatureGateProps) => {
  const { isPro, isLoading, createCheckout } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await createCheckout();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded-xl h-32" />
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  if (showPreview) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
          <Card className="bg-card border-primary/20 shadow-card max-w-sm mx-4">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{featureName}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This feature is available on the Pro plan
              </p>
              <Button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="rounded-pill shadow-button"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isUpgrading ? 'Loading...' : 'Upgrade to Pro'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-card">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{featureName}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unlock this feature with CareVoice Pro
        </p>
        <Button 
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="rounded-pill shadow-button"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isUpgrading ? 'Loading...' : 'Upgrade to Pro — $20/mo'}
        </Button>
      </CardContent>
    </Card>
  );
};
