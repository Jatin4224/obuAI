import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { OnboardingData } from './_layout';
import { useOnboarding } from './_layout';

const W = Dimensions.get('window').width;

// Reads EXPO_PUBLIC_GEMINI_SECRET_KEY from .env (rename your GEMINI_SECRET_KEY to add the EXPO_PUBLIC_ prefix)
const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_SECRET_KEY ?? '';

// ─── Types ────────────────────────────────────────────────────────────────────

type NutritionResult = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  surplusKcal: number;
  estimatedWeeksToGoal: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CHECKLIST = ['Calories', 'Carbs', 'Protein', 'Fats', 'Health Score'];

const STATUS_MESSAGES = [
  'Estimating your metabolic age...',
  'Calculating your daily needs...',
  'Optimizing your macros...',
  'Personalizing your plan...',
  'Almost there...',
];

const ANIM_DURATION_MS = 5000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fallbackCalc(d: OnboardingData): NutritionResult {
  const bmr =
    d.gender === 'female'
      ? 10 * d.currentWeightKg + 6.25 * d.heightCm - 5 * 25 - 161
      : 10 * d.currentWeightKg + 6.25 * d.heightCm - 5 * 25 + 5;
  const mult: Record<string, number> = {
    low: 1.2,
    moderate: 1.375,
    active: 1.55,
    very_active: 1.725,
  };
  const tdee = bmr * (mult[d.activityLevel ?? 'moderate'] ?? 1.375);
  const calories = Math.round(tdee + 500);
  const proteinG = Math.round(d.currentWeightKg * 1.8);
  const fatsG = Math.round((calories * 0.27) / 9);
  const carbsG = Math.round((calories - proteinG * 4 - fatsG * 9) / 4);
  const estimatedWeeksToGoal = Math.max(
    1,
    Math.round(((d.goalWeightKg - d.currentWeightKg) * 7700) / (500 * 7))
  );
  return { calories, proteinG, carbsG, fatsG, surplusKcal: 500, estimatedWeeksToGoal };
}

async function callGemini(d: OnboardingData): Promise<NutritionResult> {
  if (!GEMINI_KEY) throw new Error('No API key configured');

  const activityMap: Record<string, string> = {
    low: 'sedentary (little or no exercise)',
    moderate: 'lightly active (1–3 days/week)',
    active: 'moderately active (3–5 days/week)',
    very_active: 'very active (6–7 days/week)',
  };
  const gymMap: Record<string, string> = {
    beginner: 'beginner (0–3 months)',
    intermediate: 'intermediate (3–12 months)',
    advanced: 'advanced (1+ year)',
  };

  const prompt = `You are a sports nutrition expert. Calculate personalized daily macros for healthy weight gain.

User Profile:
- Gender: ${d.gender ?? 'male'}
- Height: ${d.heightCm} cm
- Current Weight: ${d.currentWeightKg} kg
- Goal Weight: ${d.goalWeightKg} kg
- Activity Level: ${activityMap[d.activityLevel ?? 'moderate']}
- Gym Experience: ${gymMap[d.gymExperience ?? 'beginner']}

Return ONLY a raw JSON object with no markdown, no code block, no explanation:
{"calories":2820,"proteinG":83,"carbsG":354,"fatsG":94,"surplusKcal":500,"estimatedWeeksToGoal":25}

Calculation rules:
- Target a 400–600 kcal daily surplus above TDEE for a lean bulk
- Protein: 1.6–2.2 g per kg of current body weight
- Fat: 25–30% of total calories
- Carbs: remaining calories after protein and fat
- estimatedWeeksToGoal: realistic weeks to reach goal weight at this surplus`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const json = await res.json();
  const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const parsed = JSON.parse(text) as NutritionResult;
  return parsed;
}

function goalDateLabel(weeks: number): string {
  const d = new Date();
  d.setDate(d.getDate() + Math.max(1, weeks) * 7);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ─── Calculating Screen ───────────────────────────────────────────────────────

function CalculatingView({
  checkedCount,
  progressAnim,
  statusMsg,
}: {
  checkedCount: number;
  progressAnim: Animated.Value;
  statusMsg: string;
}) {
  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, W - 48],
  });

  const pct = Math.round((checkedCount / CHECKLIST.length) * 100);

  return (
    <SafeAreaView style={cs.root} edges={['top', 'bottom']}>
      <View style={cs.topSection}>
        <Text style={cs.pct}>{pct}%</Text>
        <Text style={cs.heading}>{"We're setting everything\nup for you"}</Text>

        <View style={cs.trackWrap}>
          <View style={cs.track}>
            <Animated.View style={[cs.fill, { width: barWidth }]}>
              <LinearGradient
                colors={['#FF6B6B', '#C471ED', '#12C2E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>

        <Text style={cs.status}>{statusMsg}</Text>
      </View>

      <View style={cs.checklist}>
        <Text style={cs.checklistTitle}>Daily recommendation for</Text>
        {CHECKLIST.map((item, i) => {
          const done = i < checkedCount;
          return (
            <View key={item} style={cs.checkRow}>
              <Text style={cs.bullet}>•</Text>
              <Text style={[cs.checkItem, done && cs.checkItemDone]}>{item}</Text>
              {done && (
                <View style={cs.checkCircle}>
                  <Text style={cs.checkMark}>✓</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsView({
  result,
  data,
  onNext,
}: {
  result: NutritionResult;
  data: OnboardingData;
  onNext: () => void;
}) {
  const [showMicros, setShowMicros] = useState(false);

  const gainKg = Math.max(0, data.goalWeightKg - data.currentWeightKg);
  const targetDate = goalDateLabel(result.estimatedWeeksToGoal);

  const macros = [
    { value: `${result.proteinG}g`, label: 'Protein', dot: '#FF6B6B' },
    { value: `${result.carbsG}g`,   label: 'Carbs',   dot: '#FF9F43' },
    { value: `${result.fatsG}g`,    label: 'Fats',    dot: '#4ECDC4' },
  ];

  const micros = [
    { value: `${Math.round(result.calories / 1000 * 14)}g`, label: 'Fiber',  dot: '#6C5CE7' },
    { value: '2300mg',                                        label: 'Sodium', dot: '#FDCB6E' },
    { value: `${Math.round(result.carbsG * 0.25)}g`,         label: 'Sugar',  dot: '#FD79A8' },
  ];

  return (
    <SafeAreaView style={rs.root} edges={['top', 'bottom']}>
      <ScrollView
        style={rs.scroll}
        contentContainerStyle={rs.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success icon */}
        <View style={rs.iconCircle}>
          <Text style={rs.iconCheck}>✓</Text>
        </View>

        {/* Goal */}
        <Text style={rs.goalText}>
          {`Goal: gain ${gainKg} kg\nby ${targetDate}`}
        </Text>

        {/* Recommendation card */}
        <View style={rs.card}>
          <Text style={rs.cardTitle}>Your daily recommendation</Text>

          {/* Calories row */}
          <View style={rs.calRow}>
            <Text style={rs.flame}>🔥</Text>
            <View style={rs.calText}>
              <Text style={rs.calNumber}>{result.calories.toLocaleString()}</Text>
              <Text style={rs.calLabel}>Calories</Text>
            </View>
          </View>

          <View style={rs.divider} />

          {/* Macros */}
          <View style={rs.macroRow}>
            {macros.map(m => (
              <View key={m.label} style={rs.macroCard}>
                <View style={[rs.macroDot, { backgroundColor: m.dot }]} />
                <Text style={rs.macroValue}>{m.value}</Text>
                <Text style={rs.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowMicros(p => !p)}>
            <Text style={rs.microLink}>
              {showMicros ? 'Hide micronutrients ^' : 'View micronutrients ˅'}
            </Text>
          </TouchableOpacity>

          {showMicros && (
            <View style={rs.macroRow}>
              {micros.map(m => (
                <View key={m.label} style={rs.macroCard}>
                  <View style={[rs.macroDot, { backgroundColor: m.dot }]} />
                  <Text style={rs.macroValue}>{m.value}</Text>
                  <Text style={rs.macroLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Your info */}
        <View style={rs.infoSection}>
          <Text style={rs.infoTitle}>Your info</Text>
          <Text style={rs.infoSub}>Based on your inputs.</Text>
          <View style={rs.infoRow}>
            <Text style={rs.infoRowText}>👤  Starting weight: {data.currentWeightKg} kg</Text>
          </View>
        </View>
      </ScrollView>

      <View style={rs.bottom}>
        <TouchableOpacity style={rs.btn} onPress={onNext} activeOpacity={0.85}>
          <Text style={rs.btnLabel}>{"Looks Good!  →"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function StepCalorieTarget() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const [phase, setPhase] = useState<'calculating' | 'done'>('calculating');
  const [checkedCount, setCheckedCount] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [result, setResult] = useState<NutritionResult | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Keep the calculated goals in onboarding state so they're saved after sign-in
  useEffect(() => {
    if (!result) return;
    update({
      goals: {
        calories: Math.round(Number(result.calories)),
        proteinG: Math.round(Number(result.proteinG)),
        carbsG: Math.round(Number(result.carbsG)),
        fatsG: Math.round(Number(result.fatsG)),
        estimatedWeeksToGoal: Math.max(0, Math.round(Number(result.estimatedWeeksToGoal))),
      },
    });
  }, [result]);

  const pendingResult = useRef<NutritionResult | null>(null);
  const animDone = useRef(false);

  useEffect(() => {
    // Fire Gemini API call immediately
    callGemini(data)
      .then(r => {
        if (animDone.current) {
          setResult(r);
          setPhase('done');
        } else {
          pendingResult.current = r;
        }
      })
      .catch(() => {
        const fb = fallbackCalc(data);
        if (animDone.current) {
          setResult(fb);
          setPhase('done');
        } else {
          pendingResult.current = fb;
        }
      });

    // Animate checklist items at evenly spaced intervals
    CHECKLIST.forEach((_, i) => {
      setTimeout(() => {
        setCheckedCount(i + 1);
        Animated.timing(progressAnim, {
          toValue: (i + 1) / CHECKLIST.length,
          duration: 350,
          useNativeDriver: false,
        }).start();

        if (i === CHECKLIST.length - 1) {
          animDone.current = true;
          if (pendingResult.current) {
            setResult(pendingResult.current);
            setPhase('done');
          }
        }
      }, ((i + 1) / CHECKLIST.length) * ANIM_DURATION_MS);
    });

    // Rotate status messages
    const interval = setInterval(() => {
      setStatusIdx(p => (p + 1) % STATUS_MESSAGES.length);
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  if (phase === 'calculating' || !result) {
    return (
      <CalculatingView
        checkedCount={checkedCount}
        progressAnim={progressAnim}
        statusMsg={STATUS_MESSAGES[statusIdx]}
      />
    );
  }

  return (
    <ResultsView
      result={result}
      data={data}
      onNext={() => router.push('/(onboarding)/step-plan-included')}
    />
  );
}

// ─── Calculating Styles ───────────────────────────────────────────────────────

const cs = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  pct: {
    fontSize: 60,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -1.5,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    lineHeight: 26,
  },
  trackWrap: { width: '100%' },
  track: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: { height: 10, borderRadius: 5, overflow: 'hidden' },
  status: { fontSize: 13, color: '#888888', textAlign: 'center' },
  checklist: {
    paddingBottom: 40,
    gap: 12,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: { fontSize: 16, color: '#AAAAAA', width: 12 },
  checkItem: { flex: 1, fontSize: 15, color: '#AAAAAA' },
  checkItemDone: { color: '#111111' },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});

// ─── Results Styles ───────────────────────────────────────────────────────────

const rs = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
    alignItems: 'center',
    paddingTop: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  iconCheck: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  goalText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111111' },
  cardSub: { fontSize: 12, color: '#AAAAAA', marginTop: -8 },
  calRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flame: { fontSize: 28 },
  calText: { flex: 1, gap: 2 },
  calNumber: { fontSize: 36, fontWeight: '800', color: '#111111', letterSpacing: -1 },
  calLabel: { fontSize: 13, color: '#888888' },
  divider: { height: 1, backgroundColor: '#F0F0F0' },
  macroRow: { flexDirection: 'row', gap: 10 },
  macroCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    gap: 4,
    alignItems: 'flex-start',
  },
  macroDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 2 },
  macroValue: { fontSize: 18, fontWeight: '800', color: '#111111' },
  macroLabel: { fontSize: 11, color: '#888888' },
  microLink: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '500',
  },
  infoSection: { width: '100%', gap: 6 },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#111111' },
  infoSub: { fontSize: 13, color: '#AAAAAA' },
  infoRow: { marginTop: 4 },
  infoRowText: { fontSize: 14, color: '#111111' },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  btn: {
    height: 58,
    backgroundColor: '#111111',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
