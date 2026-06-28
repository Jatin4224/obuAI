# Bulky AI — Claude Development Guide

## Critical: Read Versioned Docs First
Expo has changed significantly. Before writing any Expo or React Native code, read the **exact versioned docs**:
- Expo v56: https://docs.expo.dev/versions/v56.0.0/
- Expo Router v56: https://docs.expo.dev/router/introduction/
- NativeWind v4: https://www.nativewind.dev/v4/overview

---

## Project Identity

**App:** Bulky AI — a calorie surplus & weight gain app for skinny beginners.  
**Goal:** Help underweight people eat consistently more calories through streaks, AI food scanning, and simple daily tracking.  
**Design:** Light mode, minimalistic, motivational, premium. NOT cluttered. NOT intimidating.  
**Full spec:** See `plan.md` in the project root.

---

## Tech Stack (exact versions)

| Layer | Library | Version |
|---|---|---|
| Framework | Expo | ~56.0.12 |
| Navigation | expo-router | ~56.2.11 |
| Language | TypeScript | ~6.0.3 |
| Styling | NativeWind | ^4.2.6 (Tailwind for RN) |
| Backend | Convex | ^1.42.0 |
| Auth | @clerk/clerk-expo | ^2.19.31 |
| Payments | react-native-purchases (RevenueCat) | ^10.4.0 |
| Animation | react-native-reanimated | 4.3.1 |
| Charts | victory-native | ^41.26.0 |
| Forms | react-hook-form + @hookform/resolvers + zod | latest |
| Camera | expo-camera + expo-image-picker | ^56.x |
| AI | OpenAI GPT-4o Vision API (called from Convex actions) | — |

---

## File & Folder Structure

```
e:\obuAI\
├── src/
│   ├── app/                      ← Expo Router screens
│   │   ├── _layout.tsx           ← Root layout (ClerkProvider + ConvexProvider)
│   │   ├── index.tsx             ← Auth guard / redirect entry
│   │   ├── (auth)/               ← welcome, login, signup
│   │   ├── (onboarding)/         ← step-gender through step-results (7 steps)
│   │   ├── (paywall)/            ← subscription paywall
│   │   └── (tabs)/               ← index (Home), foods, progress, profile
│   ├── components/
│   │   ├── ui/                   ← Button, Card, Input, ProgressRing, Skeleton, Badge
│   │   ├── home/                 ← CalorieRing, DailyTasks, MealLogList, StreakBadge
│   │   ├── foods/                ← CategoryTabs, FoodCard, FoodModal
│   │   ├── progress/             ← WeightChart, StreakCalendar, CalorieConsistencyChart
│   │   ├── onboarding/           ← OnboardingStep, OnboardingProgress, GoalsSummary
│   │   ├── paywall/              ← PlanCard, FeatureList
│   │   └── shared/               ← Header, SafeLayout, EmptyState, LoadingScreen
│   ├── constants/
│   │   ├── theme.ts              ← Color tokens, spacing, typography
│   │   ├── foods.ts              ← Static curated foods seed data
│   │   └── notifications.ts      ← Notification message strings
│   ├── hooks/
│   │   ├── useCalorieGoal.ts
│   │   ├── useStreak.ts
│   │   ├── useSubscription.ts
│   │   └── useNotifications.ts
│   ├── lib/
│   │   ├── calculations.ts       ← BMR/TDEE/protein/timeline formulas
│   │   ├── revenuecat.ts         ← RC init + helpers
│   │   └── clerk.ts              ← Clerk helpers
│   └── global.css                ← NativeWind @tailwind directives
├── convex/                       ← Backend (DO NOT put in src/)
│   ├── schema.ts
│   ├── users.ts
│   ├── meals.ts
│   ├── weight.ts
│   ├── streaks.ts
│   ├── foods.ts
│   ├── ai.ts
│   ├── notifications.ts
│   ├── crons.ts
│   └── http.ts
├── assets/
├── design/                       ← UI mockups (reference for design decisions)
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
└── plan.md                       ← Full product spec
```

**Path alias:** `@/` maps to `./src/`. Always use `@/` imports, never relative `../../`.

---

## Design System — Use These Exactly

### Colors (use in NativeWind classes or StyleSheet)
```typescript
// src/constants/theme.ts
primary:    '#1A1A2E'  // Deep navy — headlines, icons
accent:     '#FF6B35'  // Orange — CTAs, progress ring, streaks
secondary:  '#4ECDC4'  // Teal — protein bars, secondary stats
success:    '#2ECC71'  // Green — goals met
warning:    '#F39C12'  // Amber — reminders, partial progress
background: '#FFFFFF'  // Page background
surface:    '#F8F9FA'  // Card background, inputs
muted:      '#9B9B9B'  // Secondary text, placeholders
border:     '#EBEBEB'  // Dividers, card outlines
```

### NativeWind Class Conventions
```tsx
// Card
<View className="bg-surface rounded-lg p-4 shadow-sm">

// Primary button
<TouchableOpacity className="bg-accent rounded-xl h-14 items-center justify-center w-full">
  <Text className="text-white font-semibold text-base">Continue</Text>
</TouchableOpacity>

// Secondary button
<TouchableOpacity className="border border-border rounded-xl h-14 items-center justify-center w-full bg-white">

// Muted label
<Text className="text-muted text-sm">

// Headline
<Text className="text-primary text-2xl font-bold tracking-tight">
```

### Spacing
- Base unit: 4px. Use Tailwind scale: `p-1`=4px, `p-2`=8px, `p-4`=16px, `p-6`=24px, `p-8`=32px
- Screen horizontal padding: `px-5` (20px)
- Card internal padding: `p-4` (16px)
- Section gaps: `gap-4` or `gap-6`

### Border Radius
- `rounded-lg` = 16px (cards)
- `rounded-xl` = 24px (buttons, modals)
- `rounded-full` (progress rings, avatars, pills)

---

## NativeWind v4 Setup (already configured)

Config files are at root level:
- `tailwind.config.js` — content points to `./src/**/*.{js,jsx,ts,tsx}`
- `babel.config.js` — uses `nativewind/babel` preset + `jsxImportSource: "nativewind"`
- `metro.config.js` — wraps with `withNativeWind`, input is `./src/global.css`
- `src/global.css` — must contain `@tailwind` directives, imported in root `_layout.tsx`

**NativeWind v4 gotchas:**
- Import `global.css` in `src/app/_layout.tsx`, not anywhere else
- `className` works on all RN primitives in v4 — no need to wrap
- For dynamic classes, use template literals but make sure the full class name is a static string Tailwind can detect: prefer `selected ? 'bg-accent' : 'bg-surface'` over building strings with string interpolation
- Use `cssInterop` from `nativewind` only when wrapping third-party components

---

## Convex Patterns

### Backend lives in `convex/` at root (NOT in `src/`)

### Query pattern
```typescript
// convex/meals.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTodayMeals = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];
    return ctx.db
      .query("mealLogs")
      .withIndex("by_user_date", (q) => q.eq("userId", user._id).eq("date", date))
      .collect();
  },
});
```

### Mutation pattern
```typescript
export const logMeal = mutation({
  args: {
    date: v.string(),
    mealName: v.string(),
    calories: v.number(),
    proteinG: v.number(),
    carbsG: v.number(),
    fatsG: v.number(),
    source: v.union(v.literal("ai_scan"), v.literal("manual"), v.literal("curated_food")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");
    await ctx.db.insert("mealLogs", { userId: user._id, loggedAt: Date.now(), ...args });
  },
});
```

### Action pattern (for external API calls like OpenAI)
```typescript
import { action } from "./_generated/server";
// Actions can call fetch, use environment variables, call mutations/queries
export const analyzeFoodImage = action({
  args: { imageStorageId: v.id("_storage") },
  handler: async (ctx, { imageStorageId }) => {
    const imageUrl = await ctx.storage.getUrl(imageStorageId);
    // call OpenAI here
  },
});
```

### Client-side usage
```typescript
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/../../convex/_generated/api"; // adjust path if needed

const meals = useQuery(api.meals.getTodayMeals, { date: todayStr });
const logMeal = useMutation(api.meals.logMeal);
const analyze = useAction(api.ai.analyzeFoodImage);
```

### Convex environment variables
Set in the Convex dashboard. Access in actions/functions via `process.env.OPENAI_API_KEY`.
Client-side env vars use `EXPO_PUBLIC_` prefix in `.env.local`.

---

## Clerk Auth Patterns

### Providers (root `_layout.tsx`)
```typescript
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Slot />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Auth guard (`src/app/index.tsx`)
```typescript
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Redirect href="/(auth)/welcome" />;
  return <Redirect href="/(tabs)" />;
}
```

### OAuth (Google/Apple)
```typescript
import { useOAuth } from "@clerk/clerk-expo";

const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" }); // or "oauth_apple"

const onPress = async () => {
  const { createdSessionId, setActive } = await startOAuthFlow();
  if (createdSessionId) await setActive({ session: createdSessionId });
};
```

### Email/Password
```typescript
import { useSignUp } from "@clerk/clerk-expo";
const { signUp, setActive, isLoaded } = useSignUp();
await signUp.create({ emailAddress, password });
await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
// Then verify with code:
await signUp.attemptEmailAddressVerification({ code });
```

---

## RevenueCat Patterns

### Initialization (call once after user signs in)
```typescript
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";

export const initRevenueCat = async (userId: string) => {
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({
    apiKey: Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_RC_IOS_KEY!
      : process.env.EXPO_PUBLIC_RC_ANDROID_KEY!,
    appUserID: userId, // use Clerk userId
  });
};
```

### Check subscription status
```typescript
const customerInfo = await Purchases.getCustomerInfo();
const isPremium = customerInfo.entitlements.active["bulky_premium"] !== undefined;
```

### Purchase
```typescript
const offerings = await Purchases.getOfferings();
const pkg = offerings.current?.availablePackages[0];
if (pkg) {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
}
```

### Product identifiers (configure in RC dashboard)
- `bulky_monthly` — $8.99/month, 3-day trial
- `bulky_yearly` — $24.99/year, 3-day trial
- Entitlement: `bulky_premium`

---

## Calorie Calculation Logic

Always use `src/lib/calculations.ts` for goal calculations. Never inline these formulas in components.

```typescript
export function calculateGoals(data: OnboardingData): CalculatedGoals {
  const surplusKcal = data.goalType === "aggressive_bulk" ? 500 : 275;
  // Mifflin-St Jeor BMR
  const bmr = data.gender === "male"
    ? 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.ageYears + 5
    : 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.ageYears - 161;
  const activityMultipliers = { sedentary: 1.2, lightly_active: 1.375, moderately_active: 1.55, very_active: 1.725 };
  const tdee = bmr * activityMultipliers[data.activityLevel];
  const dailyCalorieGoal = Math.round(tdee + surplusKcal);
  const dailyProteinGoalG = Math.round(data.weightKg * 1.6); // 1.6g/kg evidence-based
  const weeklyGainKg = (surplusKcal * 7) / 7700;
  const estimatedWeeksToGoal = Math.round((data.targetWeightKg - data.weightKg) / weeklyGainKg);
  return { dailyCalorieGoal, dailyProteinGoalG, estimatedWeeksToGoal };
}
```

---

## Key Business Rules

- **Streak:** A day counts if user logs ≥90% of daily calorie goal. Resets at midnight.
- **AI scan cap (free):** 3 scans total before paywall. Check `aiScans` table count before calling OpenAI action.
- **Subscription gating:** Gate AI scans (>3), progress history >7 days, and advanced analytics behind `bulky_premium` entitlement.
- **Paywall timing:** Show paywall immediately after onboarding step-results screen. Also show on any gated feature tap post-trial.
- **Calorie goal met threshold:** ≥90% of `dailyCalorieGoal` = success for streak purposes.

### XP Awards (apply in Convex mutations, not client)
| Action | XP |
|---|---|
| Complete onboarding | +100 |
| Log first meal | +25 |
| Hit daily calorie goal | +50 |
| Log weight | +15 |
| AI scan | +20 |
| 7-day streak bonus | +200 |
| 30-day streak bonus | +500 |

### XP Level titles
```
0–499     → Beginner
500–1499  → Grinder
1500–3499 → Gaining Machine
3500–6999 → Bulk Master
7000+     → Bulky Elite
```

---

## Notification Message Copy

Use these exact strings (from `src/constants/notifications.ts`):

```typescript
export const NOTIFICATION_COPY = {
  morningMotivation: [
    "Consistency beats motivation. Open up and log breakfast.",
    "Your body is waiting. Feed it.",
    "Day {streak}. Let's eat. 🔥",
  ],
  calorieReminder: [
    "You still need {remaining} calories today. Time to eat! 💪",
    "Don't break your streak — you're {remaining} calories short.",
    "Time to drink your shake 🥤",
  ],
  streakMilestone: "Day {streak} streak! You're a machine 🏋️",
  trialEnding48h: "Your free trial ends in 2 days. Keep your momentum going →",
  trialEnding24h: "Last day of your trial. Don't lose access to your streak!",
  weeklyWeighIn: "Time to weigh in. Track your progress 📊",
};
```

---

## Curated Foods Categories
`breakfast | lunch | dinner | snack | shake`

See `src/constants/foods.ts` for the full seed list (13+ items across all categories). Each item has: `name`, `category`, `calories`, `proteinG`, `carbsG`, `fatsG`, `description`, `tags[]`.

---

## Common Patterns & Conventions

### Date strings
Always use `YYYY-MM-DD` format for date keys in Convex (never timestamps for date identity):
```typescript
import { format } from "date-fns";
const todayStr = format(new Date(), "yyyy-MM-dd");
```

### Screen layout shell
```tsx
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";

export default function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerClassName="px-5 pb-8">
        {/* content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Loading state — use skeletons, not spinners
```tsx
if (data === undefined) return <SkeletonLoader />;
```

### Empty state — always provide one
```tsx
if (meals.length === 0) return <EmptyState message="Nothing logged yet today" cta="Tap Scan to add your first meal" />;
```

### Form validation with zod + react-hook-form
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

---

## Environment Variables

Create `.env.local` at project root (never commit):
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CONVEX_URL=https://...convex.cloud
EXPO_PUBLIC_RC_IOS_KEY=appl_...
EXPO_PUBLIC_RC_ANDROID_KEY=goog_...
```

Convex backend env vars (set in Convex dashboard, not .env):
```
OPENAI_API_KEY=sk-...
```

---

## What NOT to Build (MVP scope)

- No meal plan generation
- No barcode scanner
- No social/friends features
- No Apple Health / Google Fit integration
- No custom food creation by users
- No workout tracker
- No dark mode (light mode only for MVP)
- No web support (mobile only)

---

## App Store Requirements (build-time)

- iOS: must include Apple Sign-In if any social auth is present
- RevenueCat: must include "Restore Purchases" button on paywall (App Store requirement)
- Privacy: camera + photo library usage descriptions required in `app.json`
- Notifications: must request permission before scheduling

Add to `app.json` plugins section:
```json
["expo-camera", { "cameraPermission": "Bulky AI uses your camera to scan meals for calorie tracking." }],
["expo-image-picker", { "photosPermission": "Bulky AI accesses your photos to analyze meals." }],
["expo-notifications", {}]
```
