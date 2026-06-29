import { useSSO, useSignInWithApple } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Google G icon ────────────────────────────────────────────────────────────
function GoogleG({ size = 20 }: { size?: number }) {
  const inner = size * 0.6;
  const off = (size - inner) / 2;
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#4285F4' }} />
          <View style={{ flex: 1, backgroundColor: '#EA4335' }} />
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#34A853' }} />
          <View style={{ flex: 1, backgroundColor: '#FBBC05' }} />
        </View>
      </View>
      <View style={{
        position: 'absolute', width: inner, height: inner,
        borderRadius: inner / 2, backgroundColor: '#fff',
        top: off, left: off, alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: size * 0.44, fontWeight: '900', color: '#4285F4', lineHeight: size * 0.5 }}>
          G
        </Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function StepSaveProgress() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const [loading, setLoading] = useState(false);

  const handleApple = async () => {
    if (Platform.OS !== 'ios') {
      Alert.alert('Not available', 'Apple sign-in is only available on iOS.');
      return;
    }
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startAppleAuthenticationFlow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
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
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.longMessage ?? 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = () => {
    router.push('/(auth)/welcome');
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
          onPress={handleEmail}
          disabled={loading}
          activeOpacity={0.88}
        >
          <Text style={s.emailIcon}>✉</Text>
          <Text style={s.btnOutlineLabel}>Continue with email</Text>
        </TouchableOpacity>
      </View>
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
