import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { calculateDailyCalories } from '@/lib/calculations';
import { useOnboarding } from './_layout';

export default function StepCalorieTarget() {
  const router = useRouter();
  const { data } = useOnboarding();
  const calories = calculateDailyCalories(data);

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <ProgressDots current={8} />

      <View style={s.content}>
        <View style={s.textWrap}>
          <Text style={s.title}>Your daily calorie target</Text>
          <Text style={s.subtitle}>Based on your details, we recommend:</Text>
        </View>

        <View style={s.calorieWrap}>
          <Text style={s.flame}>🔥</Text>
          <Text style={s.calorieNumber}>{calories.toLocaleString()}</Text>
          <Text style={s.calorieUnit}>Calories / day</Text>
        </View>

        <View style={s.infoCard}>
          <Text style={s.infoIcon}>ⓘ</Text>
          <View style={s.infoText}>
            <Text style={s.infoTitle}>Surplus +500 kcal</Text>
            <Text style={s.infoSub}>For healthy weight gain</Text>
          </View>
        </View>
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => router.push('/(onboarding)/step-plan-included')}
          activeOpacity={0.85}
        >
          <Text style={s.btnLabel}>Looks Good!  →</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <Text style={s.adjustText}>Adjust Manually</Text>
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
  content: { flex: 1, justifyContent: 'center', gap: 40, alignItems: 'center' },
  textWrap: { gap: 8, alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: { fontSize: 14, color: '#888888', textAlign: 'center' },
  calorieWrap: { alignItems: 'center', gap: 4 },
  flame: { fontSize: 48, marginBottom: 4 },
  calorieNumber: {
    fontSize: 80,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -2,
    lineHeight: 88,
  },
  calorieUnit: { fontSize: 17, color: '#888888', fontWeight: '500' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignSelf: 'stretch',
  },
  infoIcon: { fontSize: 20, color: '#888888' },
  infoText: { gap: 2 },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#111111' },
  infoSub: { fontSize: 12, color: '#888888' },
  bottom: { gap: 16, paddingBottom: 8 },
  btn: {
    height: 58,
    backgroundColor: '#111111',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  adjustText: { fontSize: 14, color: '#888888', textAlign: 'center', fontWeight: '500' },
});
