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

        // Initialize PostHog with the correct configuration
        posthog.init(data.value, {
          api_host: 'https://app.posthog.com',
          loaded: (posthog) => {
            // Disable automatic capturing of pageviews and clicks for privacy
            posthog.config.autocapture = false;
            posthog.config.capture_pageview = false;
            posthog.config.capture_pageleave = false;
            setIsInitialized(true);
          },
          bootstrap: {
            distinctID: 'anonymous',
            isIdentifiedID: false,
          },
          persistence: 'memory',
          disable_session_recording: true,
          disable_persistence: true,
          secure_cookie: true,
        });

        // Add error handling for PostHog feature flags
        posthog.onFeatureFlags(() => {
          // Feature flags loaded successfully
        });

        try {
          posthog.reloadFeatureFlags();
        } catch (error) {
          console.warn('Failed to load PostHog feature flags');
        }

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
        try {
          // Just use reset() as shutdown() is not available
          posthog.reset();
          // Clear any remaining data
          posthog.opt_out_capturing();
        } catch (error) {
          console.error('Error cleaning up PostHog:', error);
        }
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