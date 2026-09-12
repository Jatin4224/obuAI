import { api } from '@convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { useConvexAuth, useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { Redirect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { useSubscription } from '@/hooks/useSubscription';
import { clearDraft, draftToProfile, loadDraft } from '@/lib/onboardingDraft';

type SyncState = 'idle' | 'checking' | 'syncing' | 'done' | 'error';

const AUTH_TIMEOUT_MS = 10_000;

/**
 * Single entry router:
 * signed out → welcome · pending onboarding draft → save to Convex ·
 * no profile → onboarding · not subscribed → paywall · subscribed → tabs
 */
export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : 'skip');
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const subscription = useSubscription();

  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [authTimedOut, setAuthTimedOut] = useState(false);

  const syncDraft = useCallback(async () => {
    setSyncState('checking');
    try {
      const draft = await loadDraft();
      if (!draft) {
        setSyncState('done');
        return;
      }
      setSyncState('syncing');
      await completeOnboarding({
        profile: draftToProfile(draft),
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      await clearDraft();
      setSyncState('done');
    } catch (e) {
      console.warn('[onboarding] failed to save onboarding data', e);
      setSyncState('error');
    }
  }, [completeOnboarding]);

  // Clerk's session is active before Convex has its JWT — only sync once Convex is authenticated.
  useEffect(() => {
    if (isAuthenticated && syncState === 'idle') syncDraft();
  }, [isAuthenticated, syncState, syncDraft]);

  useEffect(() => {
    if (!isSignedIn || isAuthenticated) {
      setAuthTimedOut(false);
      return;
    }
    const timer = setTimeout(() => setAuthTimedOut(true), AUTH_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isSignedIn, isAuthenticated]);

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Redirect href="/(auth)/welcome" />;

  if (!isAuthenticated) {
    if (authTimedOut && !convexAuthLoading) {
      return (
        <ErrorState
          title="Couldn't connect your account"
          message="Check your internet connection and try signing in again."
          actionLabel="Sign out"
          onAction={() => signOut()}
        />
      );
    }
    return <LoadingScreen />;
  }

  if (syncState === 'error') {
    return (
      <ErrorState
        title="Couldn't save your plan"
        message="Your answers are still on this device. Check your connection and try again."
        actionLabel="Try again"
        onAction={syncDraft}
      />
    );
  }
  if (syncState !== 'done') {
    return <LoadingScreen message={syncState === 'syncing' ? 'Saving your plan…' : undefined} />;
  }

  if (me === undefined) return <LoadingScreen />;
  if (!me?.onboardingComplete) return <Redirect href="/(onboarding)/step-welcome" />;

  if (subscription.isLoading) return <LoadingScreen />;
  if (!subscription.isPremium) return <Redirect href="/paywall" />;
  return <Redirect href="/(tabs)" />;
}

function ErrorState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6 gap-3">
      <Text className="text-[22px] font-extrabold text-[#111111] text-center">{title}</Text>
      <Text className="text-[15px] text-[#777777] text-center">{message}</Text>
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.85}
        className="h-14 self-stretch rounded-full bg-[#111111] items-center justify-center mt-4"
      >
        <Text className="text-white text-[16px] font-bold">{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
