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

        if (!data?.value) {
          console.warn('PostHog API key not found in secrets table');
          return;
        }

        // Initialize PostHog with more conservative options
        posthog.init(data.value, {
          api_host: 'https://app.posthog.com', // Changed from us.i.posthog.com
          loaded: () => {
            setIsInitialized(true);
          },
          capture_pageview: false, // Disable automatic page view capture
          disable_session_recording: true,
          autocapture: false,
          persistence: 'memory', // Use memory persistence to avoid localStorage issues
          bootstrap: {
            distinctID: 'anonymous',
          },
        });
      } catch (error) {
        console.error('Error initializing PostHog:', error);
        toast({
          title: "Analytics Error",
          description: "Failed to initialize analytics. This won't affect the app's functionality.",
          variant: "destructive",
        });
      }
    };

    initializePostHog();

    return () => {
      if (isInitialized) {
        posthog.reset();
      }
    };
  }, [toast]);

  // Create a safe wrapper for PostHog methods
  const safePostHog = {
    capture: (eventName: string, properties?: Record<string, any>) => {
      if (isInitialized) {
        try {
          posthog.capture(eventName, properties);
        } catch (error) {
          console.error('Error capturing PostHog event:', error);
        }
      }
    },
    identify: (distinctId: string, properties?: Record<string, any>) => {
      if (isInitialized) {
        try {
          posthog.identify(distinctId, properties);
        } catch (error) {
          console.error('Error identifying PostHog user:', error);
        }
      }
    },
    reset: () => {
      if (isInitialized) {
        try {
          posthog.reset();
        } catch (error) {
          console.error('Error resetting PostHog:', error);
        }
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