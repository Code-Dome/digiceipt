import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Check URL hash for password reset token
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const accessToken = hashParams.get('access_token');

    if (type === 'recovery' && accessToken) {
      // If we find a recovery token, redirect to reset password page with the hash intact
      navigate('/reset-password' + window.location.hash);
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-background dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-primary dark:text-primary mb-6">
          Digital Receipts Login
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                },
              },
            },
            className: {
              container: 'auth-container',
              button: 'auth-button',
              input: 'auth-input',
            },
            style: {
              button: {
                borderRadius: '0.375rem',
                height: '2.5rem',
              },
              input: {
                borderRadius: '0.375rem',
                backgroundColor: 'transparent',
                pointerEvents: 'auto',
              },
              anchor: {
                color: 'hsl(var(--primary))',
              },
            },
          }}
          theme="default"
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
              },
              forgotten_password: {
                email_label: 'Email',
                button_label: 'Send Reset Instructions',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;