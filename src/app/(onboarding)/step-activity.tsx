import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { useOnboarding } from './_layout';

type ActivityLevel = 'low' | 'moderate' | 'active' | 'very_active';

type Option = {
  key: ActivityLevel;
  label: string;
  icon: string;
  sub: string;
};

const OPTIONS: Option[] = [
  { key: 'low',        label: 'Low',        icon: '🛋️', sub: 'Little or no exercise' },
  { key: 'moderate',   label: 'Moderate',   icon: '🚶', sub: '1–3 days / week' },
  { key: 'active',     label: 'Active',     icon: '🏋️', sub: '3–5 days / week' },
  { key: 'very_active', label: 'Very Active', icon: '🏃', sub: '6–7 days / week' },
];

export default function StepActivity() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const selected = data.activityLevel;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <ProgressDots current={6} />

      <View style={s.content}>
        <View style={s.textWrap}>
          <Text style={s.title}>How active are you?</Text>
          <Text style={s.subtitle}>Choose your daily activity level.</Text>
        </View>

        <View style={s.grid}>
          {OPTIONS.map(opt => {
            const active = selected === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[s.card, active && s.cardActive]}
                onPress={() => update({ activityLevel: opt.key })}
                activeOpacity={0.8}
              >
                {active && (
                  <View style={s.check}>
                    <Text style={s.checkIcon}>✓</Text>
                  </View>
                )}
                <Text style={s.cardEmoji}>{opt.icon}</Text>
                <Text style={[s.cardLabel, active && s.cardLabelActive]}>{opt.label}</Text>
                <Text style={s.cardSub}>{opt.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={[s.btn, !selected && s.btnDisabled]}
          onPress={() => selected && router.push('/(onboarding)/step-gym-experience')}
          disabled={!selected}
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
  content: { flex: 1, justifyContent: 'center', gap: 36 },
  textWrap: { gap: 8 },
  title: { fontSize: 26, fontWeight: '800', color: '#111111', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#888888' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 6,
    position: 'relative',
  },
  cardActive: { borderColor: '#111111', borderWidth: 2 },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  cardEmoji: { fontSize: 32 },
  cardLabel: { fontSize: 14, fontWeight: '700', color: '#111111' },
  cardLabelActive: { color: '#111111' },
  cardSub: { fontSize: 11, color: '#888888', textAlign: 'center', paddingHorizontal: 8 },
  bottom: { paddingBottom: 8 },
  btn: {
    height: 58,
    backgroundColor: '#111111',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.35 },
  btnLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
