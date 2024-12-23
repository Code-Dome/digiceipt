import { createContext, useContext, useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PostHogContext = createContext<typeof posthog | null>(null);

export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return context;
};

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    let isInitialized = false;

    const initPostHog = async () => {
      if (isInitialized) return;

      try {
        console.log('Fetching PostHog API key from Supabase secrets table...');
        const { data, error } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'POSTHOG_API_KEY')
          .maybeSingle();

        if (error) {
          console.error('Error fetching PostHog API key:', error);
          toast({
            title: "Error initializing analytics",
            description: "Could not fetch PostHog API key. Some features may be limited.",
            variant: "destructive",
          });
          return;
        }

        if (!data?.value) {
          console.error('PostHog API key not found in secrets table');
          toast({
            title: "Analytics not configured",
            description: "PostHog API key is not set. Some features may be limited.",
            variant: "destructive",
          });
          return;
        }

        console.log('PostHog API key found, initializing PostHog...');
        posthog.init(data.value, {
          api_host: 'https://app.posthog.com',
          loaded: (posthog) => {
            console.log('PostHog initialized successfully');
            isInitialized = true;
            if (process.env.NODE_ENV === 'development') {
              posthog.debug();
            }
          },
        });
      } catch (error) {
        console.error('Unexpected error initializing PostHog:', error);
        toast({
          title: "Error initializing analytics",
          description: "An unexpected error occurred. Some features may be limited.",
          variant: "destructive",
        });
      }
    };

    initPostHog();

    return () => {
      if (isInitialized) {
        posthog.reset();
      }
    };
  }, [toast]);

  useEffect(() => {
    if (session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
      });
    } else {
      posthog.reset();
    }
  }, [session]);

  return (
    <PostHogContext.Provider value={posthog}>
      {children}
    </PostHogContext.Provider>
  );
};