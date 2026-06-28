import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Platform, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const handleGoogleSignIn = async () => {
    try {
      setLoading('google');
      const { createdSessionId, setActive } = await startGoogleFlow({
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId) await setActive!({ session: createdSessionId });
    } catch (err) {
      console.error('Google OAuth error:', err);
    } finally {
      setLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading('apple');
      const { createdSessionId, setActive } = await startAppleFlow({
        redirectUrl: Linking.createURL('/'),
      });
      if (createdSessionId) await setActive!({ session: createdSessionId });
    } catch (err) {
      console.error('Apple OAuth error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5">
        {/* Hero Section */}
        <View className="flex-1 items-center justify-center gap-6">
          <Image
            source={require('@/assets/images/logo-black.png')}
            style={{ width: 56, height: 56 }}
            contentFit="contain"
          />

          <View className="items-center gap-2">
            <Text className="text-primary text-4xl font-bold tracking-tight text-center">
              Bulky AI
            </Text>
            <Text className="text-muted text-base text-center leading-6">
              Build the body you deserve.{'\n'}Track calories. Build streaks. Gain weight.
            </Text>
          </View>

          <Image
            source={require('@/assets/images/welcome-screen-demo-image.png')}
            style={{ width: '100%', height: 220, borderRadius: 20 }}
            contentFit="cover"
          />
        </View>

        {/* Auth Buttons */}
        <View className="pb-8 gap-3">
          {/* Google */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={!!loading}
            className="h-14 flex-row items-center justify-center rounded-xl border border-border bg-white gap-3"
            activeOpacity={0.8}
          >
            {loading === 'google' ? (
              <ActivityIndicator size="small" color="#1A1A2E" />
            ) : (
              <>
                <Text className="text-lg">G</Text>
                <Text className="text-primary font-semibold text-base">Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Apple — only show on iOS */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              onPress={handleAppleSignIn}
              disabled={!!loading}
              className="h-14 flex-row items-center justify-center rounded-xl bg-primary gap-3"
              activeOpacity={0.8}
            >
              {loading === 'apple' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text className="text-white text-lg"></Text>
                  <Text className="text-white font-semibold text-base">Continue with Apple</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-1">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-muted text-sm">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Email */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signup')}
            className="h-14 items-center justify-center rounded-xl border border-border bg-white"
            activeOpacity={0.8}
          >
            <Text className="text-primary font-semibold text-base">Continue with Email</Text>
          </TouchableOpacity>

          {/* Sign in link */}
          <View className="flex-row items-center justify-center gap-1 mt-2">
            <Text className="text-muted text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
              <Text className="text-accent font-semibold text-sm">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
