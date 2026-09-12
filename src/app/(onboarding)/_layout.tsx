import { Stack } from 'expo-router';
import { createContext, useContext, useState } from 'react';

export type OnboardingGoals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  estimatedWeeksToGoal: number;
};

export type OnboardingData = {
  gender: 'male' | 'female' | null;
  heightCm: number;
  currentWeightKg: number;
  goalWeightKg: number;
  activityLevel: 'low' | 'moderate' | 'active' | 'very_active' | null;
  gymExperience: 'beginner' | 'intermediate' | 'advanced' | null;
  goals: OnboardingGoals | null;
};

type OnboardingContextType = {
  data: OnboardingData;
  update: (partial: Partial<OnboardingData>) => void;
};

const DEFAULT_DATA: OnboardingData = {
  gender: null,
  heightCm: 175,
  currentWeightKg: 52,
  goalWeightKg: 70,
  activityLevel: null,
  gymExperience: null,
  goals: null,
};

export const OnboardingContext = createContext<OnboardingContextType>({
  data: DEFAULT_DATA,
  update: () => {},
});

export function useOnboarding() {
  return useContext(OnboardingContext);
}

const NO_HEADER = { headerShown: false } as const;

export default function OnboardingLayout() {
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);

  const update = (partial: Partial<OnboardingData>) =>
    setData(prev => ({ ...prev, ...partial }));

  return (
    <OnboardingContext.Provider value={{ data, update }}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="step-welcome" options={NO_HEADER} />
        <Stack.Screen name="step-gender" options={NO_HEADER} />
        <Stack.Screen name="step-height" options={NO_HEADER} />
        <Stack.Screen name="step-weight" options={NO_HEADER} />
        <Stack.Screen name="step-goal-weight" options={NO_HEADER} />
        <Stack.Screen name="step-activity" options={NO_HEADER} />
        <Stack.Screen name="step-gym-experience" options={NO_HEADER} />
        <Stack.Screen name="step-calorie-target" options={NO_HEADER} />
        <Stack.Screen name="step-plan-included" options={NO_HEADER} />
        <Stack.Screen name="step-save-progress" options={NO_HEADER} />
      </Stack>
    </OnboardingContext.Provider>
  );
}
