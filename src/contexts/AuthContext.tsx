import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  session: Session | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.is_admin || false;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return false;
    }
  };

  const validateSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        await logout();
        return;
      }

      setSession(session);
      setUser(session.user);
      setIsAuthenticated(true);

      if (session.user) {
        const isAdminUser = await checkAdminStatus(session.user.id);
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
      console.error('Error validating session:', error);
      await logout();
    }
  };

  useEffect(() => {
    validateSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        await logout();
        return;
      }

      setSession(session);
      setUser(session.user);
      setIsAuthenticated(true);

      if (session.user) {
        const isAdminUser = await checkAdminStatus(session.user.id);
        setIsAdmin(isAdminUser);
      }
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateSession();
      }
    };

    const handleFocus = () => {
      validateSession();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        console.error('Error logging in:', error?.message);
        return false;
      }

      await validateSession();
      return true;
    } catch (error) {
      console.error('Error in login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();

      setIsAuthenticated(false);
      setIsAdmin(false);
      setSession(null);
      setUser(null);

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);

      setIsAuthenticated(false);
      setIsAdmin(false);
      setSession(null);
      setUser(null);

      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, session, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
