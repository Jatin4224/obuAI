import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded || !email || !password) return;
    try {
      setLoading(true);
      const result = await signIn.create({
        identifier: email,
        password,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      const message = err.errors?.[0]?.longMessage ?? 'Sign in failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 mb-8 self-start"
            activeOpacity={0.7}
          >
            <Text className="text-accent font-semibold text-base">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="gap-2 mb-8">
            <Text className="text-primary text-3xl font-bold tracking-tight">Welcome back</Text>
            <Text className="text-muted text-base">Sign in to continue your bulk journey.</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View className="gap-1.5">
              <Text className="text-primary text-sm font-medium">Email</Text>
              <TextInput
                className="h-14 bg-surface border border-border rounded-xl px-4 text-primary text-base"
                placeholder="you@example.com"
                placeholderTextColor="#9B9B9B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View className="gap-1.5">
              <Text className="text-primary text-sm font-medium">Password</Text>
              <TextInput
                className="h-14 bg-surface border border-border rounded-xl px-4 text-primary text-base"
                placeholder="••••••••"
                placeholderTextColor="#9B9B9B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading || !email || !password}
              className="h-14 bg-accent rounded-xl items-center justify-center mt-2"
              activeOpacity={0.8}
              style={{ opacity: !email || !password ? 0.5 : 1 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-base">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer links */}
          <View className="items-center gap-4 mt-8">
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-muted text-sm">Forgot password?</Text>
            </TouchableOpacity>

            <View className="flex-row items-center gap-1">
              <Text className="text-muted text-sm">Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/signup')} activeOpacity={0.7}>
                <Text className="text-accent font-semibold text-sm">Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
