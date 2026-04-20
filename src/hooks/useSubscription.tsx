import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type SubscriptionContextType = {
  subscription: any;
  isLoading: boolean;
  isPro: boolean;
  refreshSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openBillingPortal: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSubscription(null);
    setIsLoading(false);
  }, []);

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    isPro: false,
    refreshSubscription: async () => {},
    createCheckout: async () => {},
    openBillingPortal: async () => {},
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
};
