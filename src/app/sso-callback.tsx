import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function SSOCallbackPage() {
  const { handleRedirectCallback } = useClerk();
  const router = useRouter();

  useEffect(() => {
    async function finish() {
      try {
        await handleRedirectCallback({
          afterSignInUrl: '/',
          afterSignUpUrl: '/',
        });
      } catch {
        // If callback handling fails (e.g. session already active), go home
        router.replace('/');
      }
    }
    finish();
  }, []);

  return (
    <View style={s.root}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={s.label}>Signing you in…</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 14, fontSize: 14, color: '#9B9B9B' },
});
