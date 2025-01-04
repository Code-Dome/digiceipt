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
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Session expired or invalid
      await logout();
      return;
    }

    // Update session and user state
    setSession(session);
    setUser(session.user ?? null);
    setIsAuthenticated(true);

    if (session.user) {
      const isAdminUser = await checkAdminStatus(session.user.id);
      setIsAdmin(isAdminUser);
    }
  };

  useEffect(() => {
    // Initial session fetch
    validateSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        await logout();
        return;
      }

      setSession(session);
      setUser(session.user ?? null);
      setIsAuthenticated(true);
      const isAdminUser = await checkAdminStatus(session.user.id);
      setIsAdmin(isAdminUser);
    });

    // Check session validity on tab focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error logging in:', error.message);
      return false;
    }

    await validateSession();
    return true;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Check and remove the specific auth token
      const authToken = localStorage.getItem('sb-dgmdgcsiwatpebuxqnni-auth-token');
      if (authToken) {
        localStorage.removeItem('sb-dgmdgcsiwatpebuxqnni-auth-token');
      }
      
      // Clear state
      setIsAuthenticated(false);
      setIsAdmin(false);
      setSession(null);
      setUser(null);
      
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
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