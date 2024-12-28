import React, { createContext, useContext, useState, useEffect } from 'react';
import posthog from 'posthog-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PostHogContextType {
  isInitialized: boolean;
}

const PostHogContext = createContext<PostHogContextType>({ isInitialized: false });

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

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
          try {
            posthog.init(data.value, {
              api_host: 'https://us.i.posthog.com',
              loaded: (posthog) => {
                setIsInitialized(true);
              },
              capture_pageview: true,
              disable_session_recording: true, // Disable session recording to reduce errors
              autocapture: false, // Disable autocapture to reduce errors
            });
          } catch (initError) {
            console.error('Error initializing PostHog:', initError);
            toast({
              title: "Analytics Error",
              description: "Failed to initialize analytics. This won't affect the app's functionality.",
              variant: "destructive",
            });
          }
        } else {
          console.warn('PostHog API key not found in secrets table');
        }
      } catch (error) {
        console.error('Error initializing PostHog:', error);
      }
    };

    initializePostHog();

    return () => {
      if (isInitialized) {
        posthog.reset();
      }
    };
  }, [toast]);

  // Provide a mock posthog object if initialization fails
  const safePostHog = {
    capture: (...args: any[]) => {
      if (!isInitialized) {
        console.warn('PostHog not initialized, skipping event capture');
      } else {
        posthog.capture(...args);
      }
    },
    identify: (...args: any[]) => {
      if (isInitialized) {
        posthog.identify(...args);
      }
    },
    reset: () => {
      if (isInitialized) {
        posthog.reset();
      }
    },
  };

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