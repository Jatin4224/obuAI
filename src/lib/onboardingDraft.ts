import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { z } from 'zod';

import type { OnboardingData } from '@/app/(onboarding)/_layout';

// Onboarding answers are kept on-device until the user signs in, then synced to Convex.
const DRAFT_KEY = 'onboarding_draft_v1';

// expo-secure-store has no web implementation — use localStorage when testing in the browser
const storage =
  Platform.OS === 'web'
    ? {
        getItem: async (key: string) => globalThis.localStorage?.getItem(key) ?? null,
        setItem: async (key: string, value: string) => globalThis.localStorage?.setItem(key, value),
        deleteItem: async (key: string) => globalThis.localStorage?.removeItem(key),
      }
    : {
        getItem: SecureStore.getItemAsync,
        setItem: SecureStore.setItemAsync,
        deleteItem: SecureStore.deleteItemAsync,
      };

const draftSchema = z.object({
  gender: z.enum(['male', 'female']),
  heightCm: z.number(),
  currentWeightKg: z.number(),
  goalWeightKg: z.number(),
  activityLevel: z.enum(['low', 'moderate', 'active', 'very_active']),
  gymExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  goals: z.object({
    calories: z.number(),
    proteinG: z.number(),
    carbsG: z.number(),
    fatsG: z.number(),
    estimatedWeeksToGoal: z.number(),
  }),
});

export type OnboardingDraft = z.infer<typeof draftSchema>;

/** Returns false when onboarding isn't complete enough to save. */
export async function saveDraft(data: OnboardingData): Promise<boolean> {
  const parsed = draftSchema.safeParse(data);
  if (!parsed.success) return false;
  await storage.setItem(DRAFT_KEY, JSON.stringify(parsed.data));
  return true;
}

export async function loadDraft(): Promise<OnboardingDraft | null> {
  try {
    const raw = await storage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = draftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  await storage.deleteItem(DRAFT_KEY);
}

/** Shape expected by `api.users.completeOnboarding`. */
export function draftToProfile(draft: OnboardingDraft) {
  return {
    gender: draft.gender,
    heightCm: draft.heightCm,
    currentWeightKg: draft.currentWeightKg,
    goalWeightKg: draft.goalWeightKg,
    activityLevel: draft.activityLevel,
    gymExperience: draft.gymExperience,
    dailyCalorieGoal: draft.goals.calories,
    dailyProteinGoalG: draft.goals.proteinG,
    dailyCarbsG: draft.goals.carbsG,
    dailyFatsG: draft.goals.fatsG,
    estimatedWeeksToGoal: draft.goals.estimatedWeeksToGoal,
  };
}
