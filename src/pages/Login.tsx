import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-violet-700 dark:text-violet-400 mb-6">
          Digital Receipts Login
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#8b5cf6',
                  brandAccent: '#7c3aed',
                },
              },
            },
          }}
          theme="default"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;