import { useAuth, useSSO, useSignInWithApple } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleG, SignInSheet } from '@/components/auth/SignInSheet';
import { saveDraft } from '@/lib/onboardingDraft';
import { useOnboarding } from './_layout';

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function StepSaveProgress() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { data } = useOnboarding();
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const [loading, setLoading] = useState(false);
  const [showEmailSheet, setShowEmailSheet] = useState(false);

  // Persist answers on-device so they survive the sign-in handoff; the root index syncs them to Convex.
  const draftSaved = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(() => {
    draftSaved.current = saveDraft(data).catch(() => false);
  }, [data]);

  // Every sign-in method (Apple, Google, email sheet) ends up here
  useEffect(() => {
    if (!isSignedIn) return;
    draftSaved.current.finally(() => router.replace('/'));
  }, [isSignedIn]);

  const handleApple = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not available', 'Apple sign-in is only available on iOS.');
      return;
    }
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startAppleAuthenticationFlow();
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (err: any) {
      if (err?.code !== 'ERR_CANCELED')
        Alert.alert('Error', err.errors?.[0]?.longMessage ?? 'Apple sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google' });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.longMessage ?? 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
        <Text style={s.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={s.title}>Save your progress</Text>

      {/* Center illustration */}
      <View style={s.illustrationWrap}>
        <Text style={s.illustrationIcon}>🔍</Text>
      </View>

      {/* Auth buttons */}
      <View style={s.buttons}>
        <TouchableOpacity
          style={s.btnApple}
          onPress={handleApple}
          disabled={loading}
          activeOpacity={0.88}
        >
          <Text style={s.appleIcon}></Text>
          <Text style={s.btnAppleLabel}>Sign in with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnOutline}
          onPress={handleGoogle}
          disabled={loading}
          activeOpacity={0.88}
        >
          <GoogleG size={20} />
          <Text style={s.btnOutlineLabel}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.btnOutline}
          onPress={() => setShowEmailSheet(true)}
          disabled={loading}
          activeOpacity={0.88}
        >
          <Text style={s.emailIcon}>✉</Text>
          <Text style={s.btnOutlineLabel}>Continue with email</Text>
        </TouchableOpacity>
      </View>

      <SignInSheet
        visible={showEmailSheet}
        onClose={() => setShowEmailSheet(false)}
        initialView="signup"
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  backBtn: { paddingVertical: 8, alignSelf: 'flex-start' },
  backIcon: { fontSize: 24, color: '#111111', fontWeight: '600' },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    marginTop: 16,
  },
  illustrationWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationIcon: { fontSize: 72 },
  buttons: {
    gap: 12,
    paddingBottom: 16,
  },
  btnApple: {
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appleIcon: { fontSize: 19, color: '#FFFFFF', lineHeight: 23 },
  btnAppleLabel: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  btnOutline: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnOutlineLabel: { fontSize: 15, fontWeight: '600', color: '#111111' },
  emailIcon: { fontSize: 16, color: '#444444' },
});
