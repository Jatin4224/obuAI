import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { RulerPicker } from '@/components/onboarding/RulerPicker';
import { useOnboarding } from './_layout';

export default function StepWeight() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <ProgressDots current={4} />

      <View style={s.content}>
        <View style={s.textWrap}>
          <Text style={s.title}>{"What's your\ncurrent weight?"}</Text>
          <Text style={s.subtitle}>Enter your weight in kg.</Text>
        </View>

        <View style={s.valueRow}>
          <Text style={s.valueNumber}>{data.currentWeightKg}</Text>
          <Text style={s.valueUnit}>kg</Text>
        </View>
      </View>

      <View style={s.rulerWrap}>
        <RulerPicker
          min={30}
          max={150}
          value={data.currentWeightKg}
          onChange={v => update({ currentWeightKg: v })}
          unitWidth={16}
          labelEvery={5}
          tickEvery={1}
        />
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => router.push('/(onboarding)/step-goal-weight')}
          activeOpacity={0.85}
        >
          <Text style={s.btnLabel}>Next  →</Text>
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
    justifyContent: 'space-between',
  },
  content: { flex: 1, justifyContent: 'center', gap: 48 },
  textWrap: { gap: 8 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: { fontSize: 15, color: '#888888', textAlign: 'center' },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
  },
  valueNumber: {
    fontSize: 88,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -2,
    lineHeight: 96,
  },
  valueUnit: {
    fontSize: 26,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 8,
  },
  rulerWrap: { paddingBottom: 32 },
  bottom: { paddingBottom: 8 },
  btn: {
    height: 58,
    backgroundColor: '#111111',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
