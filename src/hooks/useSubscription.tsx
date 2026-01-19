import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Subscription {
  plan: 'starter' | 'pro';
  status: string;
  current_period_end?: string;
  stripe_customer_id?: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isPro: boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isPro: false,
  isLoading: true,
  refreshSubscription: async () => {},
  createCheckout: async () => {},
  openBillingPortal: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user || !session) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('get-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      setSubscription(data as Subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ plan: 'starter', status: 'active' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user, session]);

  const isPro = subscription?.plan === 'pro' && subscription?.status === 'active';

  const createCheckout = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const openBillingPortal = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      throw error;
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      subscription, 
      isPro, 
      isLoading, 
      refreshSubscription: fetchSubscription,
      createCheckout,
      openBillingPortal,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
