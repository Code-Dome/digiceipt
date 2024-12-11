import { useEffect, useState } from 'react';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin.toString());
  }, [isAdmin]);

  const login = (password: string) => {
    // In a real app, this would be a secure authentication process
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return {
    isAdmin,
    login,
    logout,
  };
};