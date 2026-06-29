import type { OnboardingData } from '@/app/(onboarding)/_layout';

const ACTIVITY_MULTIPLIERS = {
  low: 1.2,
  moderate: 1.375,
  active: 1.55,
  very_active: 1.725,
} as const;

export function calculateDailyCalories(data: OnboardingData, age = 25): number {
  const bmr =
    data.gender === 'male'
      ? 10 * data.currentWeightKg + 6.25 * data.heightCm - 5 * age + 5
      : 10 * data.currentWeightKg + 6.25 * data.heightCm - 5 * age - 161;

  const multiplier = ACTIVITY_MULTIPLIERS[data.activityLevel ?? 'moderate'];
  const tdee = bmr * multiplier;
  return Math.round(tdee + 500);
}

export function calculateDailyProtein(weightKg: number): number {
  return Math.round(weightKg * 1.6);
}
