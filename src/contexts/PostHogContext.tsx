import { createContext, useContext, useEffect, ReactNode } from 'react';
import posthog from 'posthog-js';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

  useEffect(() => {
    const initPostHog = async () => {
      try {
        const { data: { secret }, error } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'POSTHOG_API_KEY')
          .single();

        if (error) throw error;

        posthog.init(secret, {
          api_host: 'https://app.posthog.com',
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              // In development, let's be verbose
              posthog.debug();
            }
          },
        });
      } catch (error) {
        console.error('Error initializing PostHog:', error);
      }
    };

    initPostHog();

    return () => {
      posthog.shutdown();
    };
  }, []);

  // Identify user when session changes
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