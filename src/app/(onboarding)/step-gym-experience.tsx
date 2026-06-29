import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { useOnboarding } from './_layout';

type GymExp = 'beginner' | 'intermediate' | 'advanced';

type Option = { key: GymExp; label: string; sub: string };

const OPTIONS: Option[] = [
  { key: 'beginner',     label: 'Beginner',     sub: '0–3 months' },
  { key: 'intermediate', label: 'Intermediate', sub: '3–12 months' },
  { key: 'advanced',     label: 'Advanced',     sub: '1+ year' },
];

export default function StepGymExperience() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const selected = data.gymExperience;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <ProgressDots current={7} />

      <View style={s.content}>
        <View style={s.textWrap}>
          <Text style={s.title}>{"What's your gym\nexperience?"}</Text>
          <Text style={s.subtitle}>Helps us plan your workouts.</Text>
        </View>

        <View style={s.list}>
          {OPTIONS.map(opt => {
            const active = selected === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[s.row, active && s.rowActive]}
                onPress={() => update({ gymExperience: opt.key })}
                activeOpacity={0.8}
              >
                <View style={s.rowText}>
                  <Text style={[s.rowLabel, active && s.rowLabelActive]}>{opt.label}</Text>
                  <Text style={s.rowSub}>{opt.sub}</Text>
                </View>
                {active && (
                  <View style={s.check}>
                    <Text style={s.checkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={[s.btn, !selected && s.btnDisabled]}
          onPress={() => selected && router.push('/(onboarding)/step-calorie-target')}
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
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: { fontSize: 15, color: '#888888' },
  list: { gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  rowActive: { borderColor: '#111111', borderWidth: 2 },
  rowText: { gap: 3 },
  rowLabel: { fontSize: 16, fontWeight: '700', color: '#111111' },
  rowLabelActive: { color: '#111111' },
  rowSub: { fontSize: 13, color: '#888888' },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
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
