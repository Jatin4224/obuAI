import { useSignUp } from '@clerk/clerk-expo';
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

type Step = 'form' | 'verify';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();

  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded || !email || !password) return;
    try {
      setLoading(true);
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: any) {
      const message = err.errors?.[0]?.longMessage ?? 'Sign up failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !code) return;
    try {
      setLoading(true);
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId! });
      }
    } catch (err: any) {
      const message = err.errors?.[0]?.longMessage ?? 'Invalid code. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Code sent', 'A new verification code has been sent to your email.');
    } catch (err: any) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  if (step === 'verify') {
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
            <TouchableOpacity
              onPress={() => setStep('form')}
              className="mt-4 mb-8 self-start"
              activeOpacity={0.7}
            >
              <Text className="text-accent font-semibold text-base">← Back</Text>
            </TouchableOpacity>

            <View className="gap-2 mb-8">
              <Text className="text-primary text-3xl font-bold tracking-tight">Check your email</Text>
              <Text className="text-muted text-base">
                We sent a 6-digit code to{'\n'}
                <Text className="text-primary font-medium">{email}</Text>
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-1.5">
                <Text className="text-primary text-sm font-medium">Verification Code</Text>
                <TextInput
                  className="h-14 bg-surface border border-border rounded-xl px-4 text-primary text-xl font-semibold text-center tracking-widest"
                  placeholder="000000"
                  placeholderTextColor="#9B9B9B"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={loading || code.length < 6}
                className="h-14 bg-accent rounded-xl items-center justify-center mt-2"
                activeOpacity={0.8}
                style={{ opacity: code.length < 6 ? 0.5 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-semibold text-base">Verify Email</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center gap-1 mt-8">
              <Text className="text-muted text-sm">Didn't receive a code?</Text>
              <TouchableOpacity onPress={resendCode} activeOpacity={0.7}>
                <Text className="text-accent font-semibold text-sm">Resend</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
            <Text className="text-primary text-3xl font-bold tracking-tight">Create account</Text>
            <Text className="text-muted text-base">
              Start your journey to a bigger, stronger you.
            </Text>
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
                placeholder="Min. 8 characters"
                placeholderTextColor="#9B9B9B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading || !email || password.length < 8}
              className="h-14 bg-accent rounded-xl items-center justify-center mt-2"
              activeOpacity={0.8}
              style={{ opacity: !email || password.length < 8 ? 0.5 : 1 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold text-base">Create Account</Text>
              )}
            </TouchableOpacity>

            <Text className="text-muted text-xs text-center leading-5 mt-1">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-1 mt-8">
            <Text className="text-muted text-sm">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/login')} activeOpacity={0.7}>
              <Text className="text-accent font-semibold text-sm">Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
