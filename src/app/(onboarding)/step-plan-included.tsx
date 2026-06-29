import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from './_layout';

type Feature = { icon: string; label: string; sub: string };

const FEATURES: Feature[] = [
  { icon: '🎯', label: 'Calorie Tracking',    sub: 'Track effortlessly and stay on target' },
  { icon: '📷', label: 'AI Food Scanner',      sub: 'Scan meals and get instant nutrition' },
  { icon: '🍽️', label: 'High Calorie Recipes', sub: 'Easy, delicious meals to fuel gains' },
  { icon: '📊', label: 'Progress Tracking',    sub: 'Monitor your progress and stay motivated' },
  { icon: '🔔', label: 'Smart Reminders',      sub: 'Daily reminders to keep you consistent' },
];

export default function StepPlanIncluded() {
  const router = useRouter();
  const { data } = useOnboarding();

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* Header row: back arrow */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={s.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.textWrap}>
          <Text style={s.title}>{"Here's what your\nplan includes"}</Text>
          <Text style={s.subtitle}>
            Your personalized plan to help you reach{' '}
            <Text style={s.goalKg}>{data.goalWeightKg}.0 kg.</Text>
          </Text>
        </View>

        <View style={s.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={s.featureRow}>
              <View style={s.iconWrap}>
                <Text style={s.featureIcon}>{f.icon}</Text>
              </View>
              <View style={s.featureText}>
                <Text style={s.featureLabel}>{f.label}</Text>
                <Text style={s.featureSub}>{f.sub}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={s.bottom}>
        <TouchableOpacity
          style={s.btn}
          onPress={() => router.push('/(onboarding)/step-save-progress')}
          activeOpacity={0.85}
        >
          <Text style={s.btnLabel}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 24, color: '#111111', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 32 },
  textWrap: { gap: 10, paddingTop: 8 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: { fontSize: 14, color: '#888888', lineHeight: 20 },
  goalKg: { color: '#111111', fontWeight: '700' },
  featureList: { gap: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { fontSize: 22 },
  featureText: { flex: 1, gap: 2 },
  featureLabel: { fontSize: 15, fontWeight: '700', color: '#111111' },
  featureSub: { fontSize: 13, color: '#888888', lineHeight: 18 },
  bottom: { paddingHorizontal: 24, paddingBottom: 8 },
  btn: {
    height: 58,
    backgroundColor: '#111111',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
