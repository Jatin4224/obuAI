import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

import { PaywallProvider } from '@/components/paywall/PaywallProvider';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { useSubscription } from '@/hooks/useSubscription';

export default function PaywallLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading, isPremium } = useSubscription();

  if (!isLoaded || isLoading) return <LoadingScreen />;
  if (!isSignedIn) return <Redirect href="/" />;
  // Fires right after a successful purchase/restore too
  if (isPremium) return <Redirect href="/(tabs)" />;

  return (
    <PaywallProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {/* Hard paywall: no swiping back out of the first screen */}
        <Stack.Screen name="index" options={{ gestureEnabled: false }} />
        <Stack.Screen name="reminder" />
        <Stack.Screen name="plans" />
      </Stack>
    </PaywallProvider>
  );
}
