import { useState, useEffect, createContext, useContext } from 'react';
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
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = async () => {
    if (!user) {
      setRoles([]);
      setIsLoading(false);
      return;
    }

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
  };

  useEffect(() => {
    fetchRoles();
  }, [user]);

  const isTherapist = roles.includes('therapist');

  return (
    <RoleContext.Provider value={{ roles, isTherapist, isLoading, refreshRoles: fetchRoles }}>
      {children}
    </RoleContext.Provider>
  );
};
