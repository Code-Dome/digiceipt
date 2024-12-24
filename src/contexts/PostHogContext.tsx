import { createContext, useContext, useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { supabase } from '@/integrations/supabase/client';

const PostHogContext = createContext<typeof posthog | null>(null);

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initPostHog = async () => {
      try {
        const { data, error } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'POSTHOG_API_KEY')
          .single();

        if (error) {
          console.error('Error fetching PostHog API key:', error);
          return;
        }

        if (data?.value) {
          posthog.init(data.value, {
            api_host: 'https://app.posthog.com',
            loaded: (posthog) => {
              if (process.env.NODE_ENV === 'development') posthog.debug();
            }
          });
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing PostHog:', error);
      }
    };

    if (!isInitialized) {
      initPostHog();
    }

    // Instead of using shutdown, we'll use reset
    return () => {
      if (isInitialized) {
        posthog.reset(); // This is a standard method in PostHog for cleanup
      }
    };
  }, [isInitialized]);

  return (
    <PostHogContext.Provider value={posthog}>
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return context;
};