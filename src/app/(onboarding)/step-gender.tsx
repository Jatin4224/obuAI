import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressDots } from '@/components/onboarding/ProgressDots';
import { useOnboarding } from './_layout';

type Gender = 'male' | 'female';

function GenderCard({
  label,
  symbol,
  selected,
  onPress,
}: {
  label: string;
  symbol: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.card, selected && s.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {selected && (
        <View style={s.checkCircle}>
          <Text style={s.checkIcon}>✓</Text>
        </View>
      )}
      <Text style={s.symbol}>{symbol}</Text>
      <Text style={s.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function StepGender() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const selected = data.gender;

  const handleNext = () => {
    if (!selected) return;
    router.push('/(onboarding)/step-height');
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <ProgressDots current={2} />

      <View style={s.content}>
        <View style={s.textWrap}>
          <Text style={s.title}>{"What's your gender?"}</Text>
          <Text style={s.subtitle}>This helps us personalize your plan.</Text>
        </View>

        <View style={s.cards}>
          <GenderCard
            label="Male"
            symbol="♂"
            selected={selected === 'male'}
            onPress={() => update({ gender: 'male' })}
          />
          <GenderCard
            label="Female"
            symbol="♀"
            selected={selected === 'female'}
            onPress={() => update({ gender: 'female' })}
          />
        </View>
      </View>

      <View style={s.bottom}>
        <TouchableOpacity
          style={[s.btn, !selected && s.btnDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={!selected}
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
  textWrap: { gap: 10 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 15, color: '#888888' },
  cards: { flexDirection: 'row', gap: 14 },
  card: {
    flex: 1,
    aspectRatio: 0.9,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#111111',
    borderWidth: 2,
  },
  checkCircle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  symbol: { fontSize: 42, color: '#111111' },
  cardLabel: { fontSize: 16, fontWeight: '600', color: '#111111' },
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
