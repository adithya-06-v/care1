import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AppRole = 'therapist' | 'user';

interface RoleContextType {
  roles: AppRole[];
  isTherapist: boolean;
  isLoading: boolean;
  refreshRoles: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType>({
  roles: [],
  isTherapist: false,
  isLoading: true,
  refreshRoles: async () => {},
});

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    if (!user) {
      setRoles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      } else {
        setRoles(data?.map(r => r.role as AppRole) || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch roles when user changes
  useEffect(() => {
    if (!authLoading) {
      fetchRoles();
    }
  }, [user, authLoading, fetchRoles]);

  // Re-fetch roles on window focus to ensure fresh data
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchRoles();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, fetchRoles]);

  const isTherapist = roles.includes('therapist');

  return (
    <RoleContext.Provider value={{ roles, isTherapist, isLoading, refreshRoles: fetchRoles }}>
      {children}
    </RoleContext.Provider>
  );
};
