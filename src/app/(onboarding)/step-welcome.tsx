import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '@/components/onboarding/ProgressDots';

const { width: W, height: H } = Dimensions.get('window');

export default function StepWelcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <ProgressDots current={1} />

      <View style={s.mascotWrap}>
        <Image
          source={require('@/assets/images/welcome-screen-demo-image.png')}
          style={s.mascot}
          contentFit="contain"
        />
      </View>

      <View style={s.textWrap}>
        <Text style={s.headline}>{`Let's build\na stronger you.`}</Text>
        <Text style={s.subtitle}>
          {`Tell us a few things about yourself\nand we'll create your perfect plan.`}
        </Text>
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => router.push('/(onboarding)/step-gender')}
          activeOpacity={0.85}
        >
          <Text style={s.btnLabel}>{"Let's Start  →"}</Text>
        </TouchableOpacity>
        <View style={s.timerRow}>
          <Text style={s.timerText}>⏱  Takes less than 2 minutes</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  mascotWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: { width: W * 0.58, height: H * 0.32 },
  textWrap: { alignItems: 'center', gap: 12, paddingBottom: 16 },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 21,
  },
  bottom: { gap: 16, paddingBottom: 8 },
  btn: {
    height: 58,
    backgroundColor: '#111111',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  timerRow: { alignItems: 'center', paddingBottom: 4 },
  timerText: { fontSize: 13, color: '#999999' },
});
