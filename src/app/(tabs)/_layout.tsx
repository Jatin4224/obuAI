import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';

import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { useSubscription } from '@/hooks/useSubscription';

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading, isPremium } = useSubscription();

  // Hard paywall: the app is only reachable with an active trial/subscription
  if (!isLoaded || isLoading) return <LoadingScreen />;
  if (!isSignedIn) return <Redirect href="/" />;
  if (!isPremium) return <Redirect href="/paywall" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EBEBEB',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#9B9B9B',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="foods"
        options={{
          title: 'Foods',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🍽️</Text>,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
