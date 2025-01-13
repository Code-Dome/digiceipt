import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { id: string; email: string } | null;
  session: { user: { id: string; email: string } } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [session, setSession] = useState<{ user: { id: string; email: string } } | null>(null);
  const navigate = useNavigate();

  // Using a valid UUID format for the mock admin user
  const MOCK_ADMIN_UUID = 'd7bed21c-5a38-4c51-87d6-c8c6f129e84d';

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      // Set mock user and session data for admin/admin auth
      const mockUser = { id: MOCK_ADMIN_UUID, email: 'admin@example.com' };
      setUser(mockUser);
      setSession({ user: mockUser });
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Simple authentication logic for demo
    if (username === 'admin' && password === 'admin') {
      const mockUser = { id: MOCK_ADMIN_UUID, email: 'admin@example.com' };
      setIsAuthenticated(true);
      setIsAdmin(true);
      setUser(mockUser);
      setSession({ user: mockUser });
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    setSession(null);
    localStorage.removeItem('isAuthenticated');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin, 
      user,
      session,
      login, 
      logout 
    }}>
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