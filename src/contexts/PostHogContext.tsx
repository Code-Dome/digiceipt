import React, { createContext, useContext, useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { supabase } from '@/integrations/supabase/client';

interface PostHogContextType {
  isInitialized: boolean;
}

const PostHogContext = createContext<PostHogContextType>({ isInitialized: false });

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializePostHog = async () => {
      try {
        const { data, error } = await supabase
          .from('secrets')
          .select('value')
          .eq('name', 'POSTHOG_API_KEY')
          .maybeSingle();

        if (error) {
          console.error('Error fetching PostHog API key:', error);
          return;
        }

        if (data?.value) {
          posthog.init(data.value, {
            api_host: 'https://us.i.posthog.com',
            capture_pageview: true,
            disable_session_recording: false,
          });
          setIsInitialized(true);
        } else {
          console.warn('PostHog API key not found in secrets table');
        }
      } catch (error) {
        console.error('Error initializing PostHog:', error);
      }
    };

    initializePostHog();

    return () => {
      posthog.reset();
    };
  }, []);

  return (
    <PostHogContext.Provider value={{ isInitialized }}>
      {children}
    </PostHogContext.Provider>
  );
};

export const usePostHog = () => {
  const context = useContext(PostHogContext);
  if (!context) {
    throw new Error('usePostHog must be used within a PostHogProvider');
  }
  return posthog;
};
