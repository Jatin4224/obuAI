# Bulky AI — Complete Product Specification & Build Plan

> **Version:** 1.0 MVP  
> **Date:** 2026-06-26  
> **Status:** Pre-build specification  
> **Prepared for:** Small startup team (1–3 engineers)

---

## Table of Contents

1. [App Overview](#1-app-overview)
2. [Target Audience](#2-target-audience)
3. [UX Philosophy & Design System](#3-ux-philosophy--design-system)
4. [Tech Stack](#4-tech-stack)
5. [Monetization Strategy](#5-monetization-strategy)
6. [App Architecture](#6-app-architecture)
7. [Folder Structure](#7-folder-structure)
8. [Convex Database Schema](#8-convex-database-schema)
9. [Clerk Authentication Flow](#9-clerk-authentication-flow)
10. [RevenueCat Integration Strategy](#10-revenuecat-integration-strategy)
11. [AI Food Analysis Flow](#11-ai-food-analysis-flow)
12. [Gamification Strategy](#12-gamification-strategy)
13. [Notification Strategy](#13-notification-strategy)
14. [Full User Flow](#14-full-user-flow)
15. [Onboarding Flow](#15-onboarding-flow)
16. [Screen Specifications](#16-screen-specifications)
17. [MVP Scope](#17-mvp-scope)
18. [Future Features (Post-MVP)](#18-future-features-post-mvp)
19. [App Store Launch Plan](#19-app-store-launch-plan)
20. [Retention Strategy](#20-retention-strategy)
21. [Viral & Social Media Strategy](#21-viral--social-media-strategy)
22. [Scalability Considerations](#22-scalability-considerations)

---

## 1. App Overview

**Bulky AI** is a calorie surplus and weight gain companion app built specifically for skinny people who want to gain healthy weight and build muscle. It is not a diet app. It is not a macro-obsession app. It is a daily consistency tool that makes eating enough calories feel achievable, motivating, and even addictive.

The core loop is simple:
1. Open the app → see how many calories you still need today
2. Scan a meal with AI → log it in one tap
3. Check your streak → feel proud → come back tomorrow

Everything in the app is designed to reinforce one behavior: **eat enough, every single day.**

**App Name:** Bulky AI  
**Platform:** iOS + Android  
**Category:** Health & Fitness  
**App Store Rating Target:** 4.7+  
**Primary KPI:** Day-30 retention  
**Revenue Model:** Subscription (freemium trial → paid)

---

## 2. Target Audience

### Primary User
- Male, 16–28 years old
- Underweight or naturally skinny (ectomorph body type)
- Has tried to gain weight before and failed due to not eating enough
- Gym beginner or someone just starting to care about their body
- Lives a busy student or early-career lifestyle
- Comfortable with mobile apps, responds to gamification

### Secondary User
- Female, 18–26 years old, seeking a "toned" or "athletic" build
- Post-illness recovery users trying to regain weight
- Fitness-curious people who want structure without complexity

### What the user does NOT want
- Complicated meal plans
- Macro spreadsheets
- Intimidating gym programming
- To feel judged or ashamed
- Overly scientific language

### What the user DOES want
- To know exactly how many more calories they need today
- Quick meal ideas that are actually high calorie
- A streak they don't want to break
- To feel like they're making progress
- Simple, visual feedback on their journey

---

## 3. UX Philosophy & Design System

### Design Philosophy
The design of Bulky AI should feel like the intersection of a premium fitness app and a modern productivity tool. Clean, focused, zero clutter.

> Reference: `/design` folder (to be populated with mockups)

### Core Design Principles

**1. Light Mode First**  
The app is primarily light mode. White and off-white backgrounds (`#FFFFFF`, `#F8F9FA`). Dark text for hierarchy. Color accents used sparingly.

**2. Minimal Color Palette**
```
Primary:       #1A1A2E  (deep navy — headlines, icons, key elements)
Accent:        #FF6B35  (energetic orange — CTAs, progress rings, streaks)
Secondary:     #4ECDC4  (teal — protein indicators, secondary stats)
Success:       #2ECC71  (green — goals met, streaks maintained)
Warning:       #F39C12  (amber — approaching goal, reminders)
Background:    #FFFFFF  (primary background)
Surface:       #F8F9FA  (card backgrounds, input fields)
Muted:         #9B9B9B  (secondary text, placeholders)
Border:        #EBEBEB  (dividers, card borders)
```

**3. Typography**
```
Font Family: System default (SF Pro on iOS, Roboto on Android)
Headings:    700 weight, -0.5 letter spacing
Body:        400 weight, 1.5 line height
Numbers:     Tabular figures, 600–700 weight (critical for stats)
```

**4. Spacing System**
```
Base unit: 4px
XS:  4px
SM:  8px
MD:  16px
LG:  24px
XL:  32px
2XL: 48px
3XL: 64px
```

**5. Border Radius**
```
SM:   8px   (chips, small buttons)
MD:   12px  (cards, inputs)
LG:   16px  (modal sheets, large cards)
XL:   24px  (bottom sheets, paywall cards)
Full: 9999px (pills, avatar circles, progress rings)
```

**6. Component Style Guide**

*Cards:* White background, `border-radius: 16px`, subtle shadow (`0 2px 12px rgba(0,0,0,0.06)`), 16px internal padding.

*Buttons — Primary:* Full width, `border-radius: 14px`, `height: 56px`, accent orange background, white text, 600 weight.

*Buttons — Secondary:* White background, `border: 1.5px solid #EBEBEB`, same radius/height.

*Progress Ring:* Circular SVG/Reanimated ring, thick stroke (~12px), accent orange fill on dark navy track.

*Input Fields:* Surface background (`#F8F9FA`), `border-radius: 12px`, `height: 52px`, no visible border until focused.

*Bottom Navigation:* White background, very subtle top shadow, 4 icons only, active icon uses accent color, inactive uses muted gray.

**7. Animation Principles**
- All transitions: 250–350ms easing
- Spring physics on progress rings and XP bars
- Subtle scale transforms on button press (0.97 scale)
- Skeleton loaders (not spinners) for loading states
- Confetti or subtle pulse animation when a daily goal is hit

---

## 4. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Expo | ~56.0.12 | Cross-platform mobile framework |
| React Native | 0.85.3 | UI rendering engine |
| TypeScript | ~6.0.3 | Type safety |
| NativeWind | ^4.x | Tailwind CSS utility classes for RN |
| Expo Router | ~56.2.11 | File-based navigation |
| React Native Reanimated | 4.3.1 | Smooth animations |
| Expo Image | ~56.0.11 | Performant image loading |
| React Native Gesture Handler | ~2.31.1 | Gesture interactions |

### Backend
| Technology | Purpose |
|---|---|
| Convex | Real-time backend, database, serverless functions |

### Authentication
| Technology | Purpose |
|---|---|
| Clerk | Auth provider (Google, Apple, email/password) |
| `@clerk/expo` | Clerk Expo SDK |

### Payments
| Technology | Purpose |
|---|---|
| RevenueCat | Subscription management, trial handling, paywall |
| `react-native-purchases` | RevenueCat React Native SDK |

### AI
| Technology | Purpose |
|---|---|
| OpenAI Vision API (`gpt-4o`) | Food image analysis, calorie/macro estimation |

### Notifications
| Technology | Purpose |
|---|---|
| Expo Notifications | Push notification scheduling and delivery |
| Convex Scheduled Functions | Server-side notification triggers |

### Additional Libraries
```
expo-camera          — camera access for AI food scan
expo-image-picker    — photo library access
expo-haptics         — tactile feedback on interactions
expo-linear-gradient — gradient backgrounds
victory-native       — charts (weight graph, calorie charts)
date-fns             — date manipulation
react-hook-form      — form management in onboarding
zod                  — schema validation
```

---

## 5. Monetization Strategy

### Subscription Tiers

| Plan | Price | Billing |
|---|---|---|
| Free Trial | $0 | 3 days, auto-converts |
| Monthly | $8.99 | Per month |
| Yearly | $24.99 | Per year (~$2.08/month, 77% off) |

### Trial Flow
1. User completes onboarding → immediately shown paywall
2. User selects a plan → 3-day free trial starts via RevenueCat
3. **48 hours before trial ends** → push notification: "Your free trial ends in 2 days — keep your streak going 🔥"
4. **24 hours before trial ends** → in-app banner reminder on home screen
5. **Trial end** → RevenueCat auto-charges unless cancelled
6. If subscription lapses → features gracefully degrade (read-only mode, no AI scans, no log entries)

### Paywall Psychology
- Show yearly plan first (best value anchor)
- Display monthly price equivalent for yearly (`$2.08/month`)
- "Most Popular" badge on yearly
- Bullet list of premium benefits (not features — outcomes)
- Social proof line ("Join 10,000+ people building their physique")
- Free trial CTA: "Start Free Trial — Cancel Anytime"
- No credit card required messaging (Handled by Apple/Google Pay)

### Free vs. Paid Feature Gating

| Feature | Free Trial | Paid |
|---|---|---|
| Onboarding + calorie goal | ✅ | ✅ |
| Daily calorie tracking | ✅ | ✅ |
| Foods inspiration page | ✅ (view only) | ✅ |
| AI food scan | 3 scans limit | Unlimited |
| Weight tracking | ✅ | ✅ |
| Progress charts | 7 days | Unlimited history |
| Streak tracking | ✅ | ✅ |
| XP system | ✅ | ✅ |
| Push notifications | ✅ | ✅ |
| Advanced progress analytics | ❌ | ✅ |

---

## 6. App Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Expo / React Native               │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Clerk   │  │RevenueCat│  │  Expo Router     │  │
│  │  Auth    │  │  Paywall │  │  Navigation      │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌────────────────────────────────────────────────┐ │
│  │              Convex Client                     │ │
│  │   (real-time queries + mutations + actions)    │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                   Convex Backend                    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Database │  │ Actions  │  │ Scheduled Fns    │  │
│  │ (tables) │  │(OpenAI,  │  │(notifications,   │  │
│  │          │  │ etc.)    │  │ streak resets)   │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │    OpenAI API       │
              │  (GPT-4o Vision)    │
              └─────────────────────┘
```

### Navigation Architecture (Expo Router)
```
app/
├── _layout.tsx              ← Root layout (Clerk + Convex + RevenueCat providers)
├── index.tsx                ← Entry redirect (auth check → onboarding or tabs)
├── (auth)/
│   ├── _layout.tsx
│   ├── welcome.tsx          ← Welcome / landing screen
│   ├── login.tsx
│   └── signup.tsx
├── (onboarding)/
│   ├── _layout.tsx
│   ├── step-gender.tsx
│   ├── step-height.tsx
│   ├── step-weight.tsx
│   ├── step-target.tsx
│   ├── step-activity.tsx
│   ├── step-experience.tsx
│   ├── step-goal.tsx
│   └── step-results.tsx     ← Calculated goals summary
├── (paywall)/
│   └── index.tsx            ← Paywall / subscription screen
└── (tabs)/
    ├── _layout.tsx          ← Bottom tab navigator
    ├── index.tsx            ← Home tab
    ├── foods.tsx            ← Foods tab
    ├── progress.tsx         ← Progress tab
    └── profile.tsx          ← Profile tab
```

### State Management
- **Server state:** All via Convex `useQuery` / `useMutation` hooks (real-time, no Redux needed)
- **Auth state:** Clerk `useUser`, `useAuth` hooks
- **Local UI state:** React `useState` / `useReducer` for component-level state
- **Subscription state:** RevenueCat `useCustomerInfo` hook
- **No global state library needed** — Convex + Clerk cover all persistent state

---

## 7. Folder Structure

```
e:\obuAI\
├── app.json
├── package.json
├── tsconfig.json
├── convex/                          ← Convex backend
│   ├── _generated/                  ← Auto-generated (do not edit)
│   ├── schema.ts                    ← Database schema
│   ├── users.ts                     ← User mutations & queries
│   ├── meals.ts                     ← Meal logging queries & mutations
│   ├── weight.ts                    ← Weight tracking
│   ├── streaks.ts                   ← Streak logic
│   ├── foods.ts                     ← Curated foods data
│   ├── ai.ts                        ← OpenAI Vision action
│   ├── notifications.ts             ← Scheduled notification logic
│   └── http.ts                      ← HTTP routes (webhooks)
├── src/
│   ├── app/                         ← Expo Router screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── (auth)/
│   │   ├── (onboarding)/
│   │   ├── (paywall)/
│   │   └── (tabs)/
│   ├── components/
│   │   ├── ui/                      ← Base UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Typography.tsx
│   │   ├── home/
│   │   │   ├── CalorieRing.tsx
│   │   │   ├── DailyTasks.tsx
│   │   │   ├── MealLogList.tsx
│   │   │   ├── QuickScanButton.tsx
│   │   │   └── StreakBadge.tsx
│   │   ├── foods/
│   │   │   ├── CategoryTabs.tsx
│   │   │   ├── FoodCard.tsx
│   │   │   └── FoodModal.tsx
│   │   ├── progress/
│   │   │   ├── WeightChart.tsx
│   │   │   ├── StreakCalendar.tsx
│   │   │   └── CalorieConsistencyChart.tsx
│   │   ├── onboarding/
│   │   │   ├── OnboardingStep.tsx
│   │   │   ├── OnboardingProgress.tsx
│   │   │   └── GoalsSummary.tsx
│   │   ├── paywall/
│   │   │   ├── PlanCard.tsx
│   │   │   └── FeatureList.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── SafeLayout.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingScreen.tsx
│   ├── constants/
│   │   ├── theme.ts                 ← Colors, spacing, typography tokens
│   │   ├── foods.ts                 ← Curated food data (static seed)
│   │   └── notifications.ts         ← Notification copy strings
│   ├── hooks/
│   │   ├── useCalorieGoal.ts
│   │   ├── useStreak.ts
│   │   ├── useSubscription.ts
│   │   ├── useNotifications.ts
│   │   └── useOnboarding.ts
│   ├── lib/
│   │   ├── calculations.ts          ← BMR, TDEE, protein goal, timeline
│   │   ├── revenuecat.ts            ← RevenueCat helpers
│   │   ├── clerk.ts                 ← Clerk helpers
│   │   └── openai.ts               ← OpenAI Vision call wrapper
│   └── global.css                   ← NativeWind global styles
├── assets/
│   ├── images/
│   │   └── foods/                   ← Curated food photography
│   └── icons/
└── design/                          ← UI design references (mockups, screens)
```

---

## 8. Convex Database Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Core user profile — created after onboarding
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),

    // Onboarding data
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    heightCm: v.number(),
    currentWeightKg: v.number(),
    targetWeightKg: v.number(),
    activityLevel: v.union(
      v.literal("sedentary"),
      v.literal("lightly_active"),
      v.literal("moderately_active"),
      v.literal("very_active")
    ),
    gymExperience: v.union(
      v.literal("never"),
      v.literal("beginner"),
      v.literal("intermediate")
    ),
    goalType: v.union(v.literal("lean_bulk"), v.literal("aggressive_bulk")),

    // Calculated goals (set during onboarding)
    dailyCalorieGoal: v.number(),
    dailyProteinGoalG: v.number(),
    estimatedWeeksToGoal: v.number(),

    // Gamification
    xpTotal: v.number(),
    currentStreakDays: v.number(),
    longestStreakDays: v.number(),
    lastActiveDate: v.optional(v.string()), // ISO date string "YYYY-MM-DD"

    // App state
    onboardingComplete: v.boolean(),
    pushToken: v.optional(v.string()),
    notificationsEnabled: v.boolean(),
    reminderTime: v.optional(v.string()), // "HH:MM" format

    // Subscription (mirrored from RevenueCat webhook)
    subscriptionStatus: v.union(
      v.literal("trial"),
      v.literal("active"),
      v.literal("expired"),
      v.literal("cancelled")
    ),
    trialEndsAt: v.optional(v.number()), // Unix timestamp
    subscriptionEndsAt: v.optional(v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  // Daily meal log entries
  mealLogs: defineTable({
    userId: v.id("users"),
    date: v.string(),             // "YYYY-MM-DD"
    loggedAt: v.number(),         // Unix timestamp

    // Source
    source: v.union(
      v.literal("ai_scan"),
      v.literal("manual"),
      v.literal("curated_food")
    ),

    // Meal info
    mealName: v.string(),
    imageUrl: v.optional(v.string()),
    mealCategory: v.optional(v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack"),
      v.literal("shake")
    )),

    // Macros (estimated)
    calories: v.number(),
    proteinG: v.number(),
    carbsG: v.number(),
    fatsG: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  // Weight log entries
  weightLogs: defineTable({
    userId: v.id("users"),
    date: v.string(),             // "YYYY-MM-DD"
    weightKg: v.number(),
    loggedAt: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  // Daily summaries (computed at EOD or on-demand)
  dailySummaries: defineTable({
    userId: v.id("users"),
    date: v.string(),
    totalCalories: v.number(),
    totalProteinG: v.number(),
    totalCarbsG: v.number(),
    totalFatsG: v.number(),
    calorieGoalMet: v.boolean(),   // >= 90% of goal
    streakContributes: v.boolean(),
    xpEarned: v.number(),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user", ["userId"]),

  // Curated high-calorie foods (seeded, admin-managed)
  curatedFoods: defineTable({
    name: v.string(),
    category: v.union(
      v.literal("breakfast"),
      v.literal("lunch"),
      v.literal("dinner"),
      v.literal("snack"),
      v.literal("shake")
    ),
    description: v.string(),
    imageUrl: v.string(),
    calories: v.number(),
    proteinG: v.number(),
    carbsG: v.number(),
    fatsG: v.number(),
    tags: v.array(v.string()),   // ["easy", "cheap", "high-protein"]
    featured: v.boolean(),
    sortOrder: v.number(),
  }).index("by_category", ["category"]),

  // AI scan sessions (for usage tracking / rate limiting)
  aiScans: defineTable({
    userId: v.id("users"),
    scannedAt: v.number(),
    imageUrl: v.string(),
    result: v.optional(v.object({
      mealName: v.string(),
      calories: v.number(),
      proteinG: v.number(),
      carbsG: v.number(),
      fatsG: v.number(),
      confidence: v.string(),
    })),
    status: v.union(v.literal("pending"), v.literal("complete"), v.literal("failed")),
  }).index("by_user", ["userId"]),
});
```

---

## 9. Clerk Authentication Flow

### Setup
```
npm install @clerk/expo
```

In `app.json`, add Clerk publishable key to `extra`:
```json
{
  "expo": {
    "extra": {
      "clerkPublishableKey": "pk_..."
    }
  }
}
```

### Root Provider Setup (`src/app/_layout.tsx`)
```typescript
import { ClerkProvider, useAuth } from "@clerk/expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Slot />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

### Auth Guard Pattern
In `src/app/index.tsx`, implement routing logic:
```
1. Not signed in → redirect to (auth)/welcome
2. Signed in + onboarding incomplete → redirect to (onboarding)/step-gender
3. Signed in + onboarding complete + no subscription → redirect to (paywall)
4. Signed in + onboarding complete + subscription active → redirect to (tabs)
```

### Social Auth Flow
- **Google:** Use `@clerk/expo` `useOAuth` hook with `strategy: "oauth_google"`
- **Apple:** Use `@clerk/expo` `useOAuth` hook with `strategy: "oauth_apple"` (required on iOS)
- **Email/Password:** Use Clerk `useSignIn` / `useSignUp` hooks with `emailAddress` + `password`

### Convex Identity
Convex automatically receives the Clerk JWT via `ConvexProviderWithClerk`. In Convex functions, use `ctx.auth.getUserIdentity()` to get `subject` (Clerk user ID) for all authenticated mutations.

---

## 10. RevenueCat Integration Strategy

### Setup
```
npm install react-native-purchases
```

### Initialization (`src/lib/revenuecat.ts`)
```typescript
import Purchases, { LOG_LEVEL } from "react-native-purchases";

export const initRevenueCat = async (userId: string) => {
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  await Purchases.configure({
    apiKey: Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_RC_IOS_KEY!
      : process.env.EXPO_PUBLIC_RC_ANDROID_KEY!,
    appUserID: userId,  // Use Clerk user ID as RevenueCat user ID
  });
};
```

### Products to Configure in RevenueCat Dashboard
```
Identifier: bulky_monthly   → $8.99/month, 3-day trial
Identifier: bulky_yearly    → $24.99/year, 3-day trial
Entitlement: bulky_premium  → grants access to all paid features
```

### Trial Reminder Flow (via Convex Scheduled Functions)
```
convex/notifications.ts:
- When user starts trial → schedule notification 48h before trial end
- When user starts trial → schedule notification 24h before trial end
- Use Expo Push API to deliver
```

### Subscription Status Sync
- RevenueCat webhook → Convex HTTP endpoint (`convex/http.ts`)
- On `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION` events
- Update `users.subscriptionStatus` in Convex
- This keeps the app's gating logic fast (no RC round-trip on every screen)

### Paywall Presentation
- Show paywall immediately after onboarding completes
- Also show paywall if user tries to use a gated feature after trial expires
- Use RevenueCat `presentPaywallIfNeeded` or custom paywall UI (custom preferred for design control)

---

## 11. AI Food Analysis Flow

### Overview
When user taps the AI scan button:
1. Camera opens (via `expo-camera`) or image picker opens
2. User takes/selects a photo of their meal
3. Image is uploaded to Convex storage
4. Convex action calls OpenAI GPT-4o Vision API
5. Result is returned and displayed for user review
6. User taps "Add to Today" → meal is logged

### Convex Action (`convex/ai.ts`)
```typescript
export const analyzeFoodImage = action({
  args: { imageStorageId: v.id("_storage") },
  handler: async (ctx, { imageStorageId }) => {
    const imageUrl = await ctx.storage.getUrl(imageStorageId);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "low" },
            },
            {
              type: "text",
              text: `Analyze this food image. Return ONLY valid JSON with these fields:
              {
                "mealName": "string (short, friendly name)",
                "calories": number (estimated total),
                "proteinG": number (grams),
                "carbsG": number (grams),
                "fatsG": number (grams),
                "confidence": "low|medium|high"
              }
              If you cannot identify food, return null.
              Be generous with calorie estimates — the user is trying to gain weight.`,
            },
          ],
        }],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    return JSON.parse(content);
  },
});
```

### UI States for AI Scan
- **Idle:** FAB scan button visible on home screen
- **Camera open:** Full-screen camera UI with shutter button
- **Analyzing:** Skeleton card with "Analyzing your meal..." message + subtle animation
- **Result:** Preview card with meal name + macro estimates + confidence indicator
- **Confirm:** Two buttons — "Add to Today" (primary) + "Retake" (secondary)
- **Error:** "Couldn't identify that meal. Try again?" with retry button
- **Gated (trial expired):** "Upgrade to scan unlimited meals" → paywall

### Cost Control
- Store image in Convex Storage (not pass base64 to OpenAI)
- Use `detail: "low"` in OpenAI vision request (cheaper, sufficient)
- Log all scans in `aiScans` table
- Free tier: cap at 3 scans per user (check before invoking action)

---

## 12. Gamification Strategy

### XP System
| Action | XP Earned |
|---|---|
| Complete onboarding | +100 XP |
| Log first meal | +25 XP |
| Hit daily calorie goal (≥90%) | +50 XP |
| Log weight | +15 XP |
| AI scan a meal | +20 XP |
| 7-day streak | +200 XP bonus |
| 30-day streak | +500 XP bonus |

### Streak Rules
- A day "counts" if user logs ≥90% of their daily calorie goal
- Streak resets at midnight local time if goal not met
- One "grace day" per month (streak protection) — post-MVP feature
- Streak displayed prominently on home screen with fire emoji-style indicator

### XP Levels (Titles)
```
0–499 XP:     Beginner
500–1499 XP:  Grinder
1500–3499 XP: Gaining Machine
3500–6999 XP: Bulk Master
7000+ XP:     Bulky Elite
```

### Motivational Moments
- Confetti animation when daily goal is hit
- "Streak saved!" animation when user logs final meal to reach 90%
- Level-up screen overlay with new title
- Weekly summary push notification: "Week 3 done. You're up Xkg. Keep going."

---

## 13. Notification Strategy

### Notification Types

**1. Daily Calorie Reminder**
- Time: User's configured reminder time (default 7:30 PM)
- Condition: Daily calorie < 70% of goal
- Message examples:
  - "You still need 800 calories today. Time to eat! 💪"
  - "Don't break your streak — you're 600 calories short"

**2. Morning Motivation**
- Time: 8:00 AM daily
- Always delivered
- Message examples:
  - "Day {N}. Let's eat. 🔥"
  - "Consistency beats motivation. Open up and log breakfast."
  - "Your body is waiting. Feed it."

**3. Streak Milestone**
- Triggered: On hitting 7, 14, 21, 30, 60, 90 day streaks
- Message: "Day {N} streak achieved! You're a machine 🏋️"

**4. Trial Ending Reminder**
- 48h before trial end: "Your free trial ends in 2 days. Keep your momentum going →"
- 24h before trial end: "Last day of your trial. Don't lose access to your streak!"

**5. Weight Log Prompt**
- Weekly, Sunday morning: "Time to weigh in. Track your progress 📊"

**6. Shake Reminder (Optional)**
- User-configurable
- "Time for your shake. Easy +500 calories 🥤"

### Implementation
```typescript
// Schedule nightly check via Convex cron
// convex/crons.ts
export const dailyNotificationCheck = cron.daily(
  "daily-calorie-reminder",
  { hourUTC: 19, minuteUTC: 30 },  // 7:30 PM UTC default
  internal.notifications.sendCalorieReminders
);
```

---

## 14. Full User Flow

```
Download App
     ↓
Welcome Screen
     ↓
Sign Up / Sign In
  ├── Google OAuth
  ├── Apple OAuth
  └── Email + Password
     ↓
Onboarding (7 steps)
     ↓
Goal Summary Screen (calorie goal, protein goal, timeline)
     ↓
Paywall (3-day free trial CTA)
     ↓
[Trial / Subscription Active]
     ↓
HOME SCREEN (daily dashboard)
  ├── Log meal manually
  ├── AI scan meal → review → add to today
  ├── View calorie/protein progress
  ├── Check streak + XP
  └── Complete daily tasks
     ↓
FOODS SCREEN (browse curated high-calorie foods)
  ├── Browse by category
  ├── Tap food → view details
  └── Add to today's log
     ↓
PROGRESS SCREEN
  ├── Log today's weight
  ├── View weight graph
  ├── View streak calendar
  └── View calorie consistency chart
     ↓
PROFILE SCREEN
  ├── View/edit goals
  ├── Manage subscription
  ├── Notification settings
  └── Logout
```

---

## 15. Onboarding Flow

### Design Direction
- Full-screen slides, one question per screen
- Large bold headline, sub-text for context
- Input or selection below
- Progress dots at top (7 steps)
- "Continue" primary button at bottom
- Back arrow (top-left) for non-destructive navigation
- Smooth horizontal slide transitions between steps

### Step 1 — Gender
- **Headline:** "Let's build your plan"
- **Sub:** "We'll personalize your calorie goals based on your body"
- **Input:** 3 large selection cards: Male / Female / Prefer not to say
- **State:** One must be selected before Continue activates

### Step 2 — Height
- **Headline:** "How tall are you?"
- **Input:** Scrollable drum picker (cm) or toggle cm/ft
- **Default:** 175cm

### Step 3 — Current Weight
- **Headline:** "What do you weigh right now?"
- **Sub:** "Be honest — this is just between you and the app"
- **Input:** Number input with kg/lbs toggle
- **Tone:** Non-judgmental, encouraging

### Step 4 — Target Weight
- **Headline:** "What's your goal weight?"
- **Sub:** "How heavy do you want to be?"
- **Input:** Number input
- **Validation:** Must be > current weight (this is a bulking app)
- **Helper:** "You want to gain {X}kg — let's make it happen"

### Step 5 — Activity Level
- **Headline:** "How active are you?"
- **Options (selection cards):**
  - Mostly sitting (office/student)
  - Light movement (walking, occasional sport)
  - Moderately active (gym 3–4x/week)
  - Very active (gym 5–6x/week or physical job)

### Step 6 — Gym Experience
- **Headline:** "How long have you been training?"
- **Options:**
  - Complete beginner (never lifted)
  - Beginner (0–1 year)
  - Intermediate (1–3 years)

### Step 7 — Goal Type
- **Headline:** "How fast do you want to bulk?"
- **Options (2 large cards with description):**
  - **Lean Bulk** — "+250–300 kcal surplus. Slower, cleaner gains. Less fat."
  - **Aggressive Bulk** — "+500 kcal surplus. Faster gains. Some fat is fine."

### Goal Summary Screen (Post-Onboarding)
- **Headline:** "Your personal plan is ready 🎯"
- **Display:**
  ```
  Daily Calorie Goal:    3,200 kcal
  Daily Protein Goal:    160g
  Estimated Timeline:    ~12 weeks to reach 75kg
  ```
- **Calculation logic (`src/lib/calculations.ts`):**
  ```typescript
  // Mifflin-St Jeor BMR
  const bmr = gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const tdee = bmr * activityMultipliers[activityLevel];

  const surplus = goalType === "aggressive_bulk" ? 500 : 275;
  const dailyCalorieGoal = Math.round(tdee + surplus);

  // Protein: 1.6g per kg of bodyweight (evidence-based minimum for muscle gain)
  const dailyProteinGoalG = Math.round(weightKg * 1.6);

  // Timeline: 1kg of fat ≈ 7700 kcal. At surplus:
  const weeklyGainKg = (surplus * 7) / 7700;
  const kgToGain = targetWeightKg - weightKg;
  const estimatedWeeksToGoal = Math.round(kgToGain / weeklyGainKg);
  ```
- **CTA:** "Let's Start Bulking →" → goes to paywall

---

## 16. Screen Specifications

---

### 16.1 — Auth: Welcome Screen

**Purpose:** First impression. Convert a new download into a signed-up user.

**UI Sections:**
- Full-screen background: gradient or premium hero image (muscle/fitness vibe, not intimidating)
- App logo + "Bulky AI" wordmark (top center)
- Hero headline: "Built to gain. Made for you."
- Sub-copy: "The calorie app for people who actually want to weigh more."
- Social proof: "10,000+ people gaining weight smarter"

**Components:**
- `Button` (primary): "Get Started Free" → goes to signup
- `Button` (secondary/text): "Already have an account? Log in"

**States:**
- Default (single state, no loading needed)

---

### 16.2 — Auth: Sign Up Screen

**Purpose:** Account creation with minimal friction.

**UI Sections:**
- "Create your account" headline
- Social auth buttons (Google, Apple — Apple first on iOS)
- Divider: "or continue with email"
- Email input field
- Password input field (with show/hide toggle)
- Terms text (small, below button)

**Components:**
- `SocialAuthButton` (Google icon + label)
- `SocialAuthButton` (Apple icon + label)
- `Input` (email)
- `Input` (password, secureTextEntry)
- `Button` (primary): "Create Account"

**States:**
- Default
- Loading (button shows spinner, inputs disabled)
- Error (inline error text below field: "Email already in use")

---

### 16.3 — Auth: Login Screen

**Purpose:** Return user re-authentication.

**UI Sections:** Same pattern as signup but with "Welcome back" headline, no terms text, add "Forgot password?" link.

**CTA:** "Log In"

---

### 16.4 — Paywall Screen

**Purpose:** Convert trial user to subscriber. Highest-leverage screen in the app.

**UI Sections:**

**Top (hero area):**
- Gradient background (navy → black or accent color)
- "Go Premium" badge
- Headline: "Fuel Your Gains. Every Day."
- Sub: "Everything you need to build the body you want."

**Feature list (3–4 bullet points with icons):**
- 🔥 Unlimited AI food scans
- 📊 Full progress history & charts
- 🎯 Personalized calorie goals
- 🔔 Smart consistency reminders

**Plan selector (toggle or 2 cards):**
- Yearly card (shown first): "$24.99/year — $2.08/month" — "BEST VALUE" badge
- Monthly card: "$8.99/month"

**Bottom CTA area:**
- Primary button: "Start 3-Day Free Trial"
- Sub-text: "Cancel anytime. No charge today."
- Restore Purchases link (required by Apple)

**States:**
- Default
- Loading (after tapping trial button — waiting for RevenueCat)
- Error (payment failed — show inline error)
- Already subscribed (shows "Manage Subscription" instead)

---

### 16.5 — Home Screen (Tab 1)

**Purpose:** The daily command center. User opens this every single morning and evening.

**UI Layout (top to bottom):**

**Header row:**
- Left: "Good morning, {name} 👋" or time-appropriate greeting
- Right: Streak badge (fire icon + number)

**Calorie Progress Ring (large, center):**
- Circular progress ring (thick, ~12px stroke)
- Center text: "{calories consumed}" large bold
- Below center: "of {goal} kcal"
- Ring fills clockwise in accent orange
- Below ring: "{calories remaining} kcal to go"

**Macro bars (horizontal, below ring):**
- Protein: progress bar with gram count
- Carbs: progress bar
- Fats: progress bar

**Daily Tasks card:**
- Small card with checkboxes
- Example tasks: "Log breakfast ✓", "Hit 3000 kcal", "Log weight"
- XP reward shown next to each task

**Today's Meals list:**
- Compact list of logged meals
- Each item: meal name, calorie count, time logged, delete swipe action
- "+" button to add meal manually

**Motivational message:**
- Single line, changes daily
- Examples: "Consistency beats motivation every time." / "Feed the machine. 🏋️"

**Floating Action Button (AI Scan):**
- Fixed bottom-right (or prominent center-bottom button)
- Camera icon + "Scan Meal" label
- Accent orange, large, circular

**Empty State (no meals logged today):**
- Illustration or icon
- "Nothing logged yet today"
- "Tap Scan to add your first meal"

**Loading State:**
- Skeleton loaders for ring, macro bars, meal list

---

### 16.6 — Foods Screen (Tab 2)

**Purpose:** Browse curated high-calorie meal ideas when users don't know what to eat.

**UI Layout:**

**Header:** "High Calorie Foods"
**Sub:** "Meal ideas to hit your goal"

**Category tabs (horizontal scroll):**
- All | Breakfast | Lunch | Dinner | Snacks | Shakes
- Active tab: accent underline or filled pill

**Food cards grid (2 columns or full-width list — list preferred for readability):**
Each card contains:
- Food photo (rounded corners, 16:9 thumbnail)
- Food name (bold)
- Calorie count (large, accent color)
- Protein badge (teal/secondary color)
- Short description (1 line, muted)
- "Add to Today" button (compact, secondary style)

**Food Detail Modal (bottom sheet on tap):**
- Larger photo
- Full name + description
- Macro breakdown (calories, protein, carbs, fats)
- Tags (e.g., "Easy to make", "Cheap", "High Protein")
- "Add to Today's Log" CTA (full-width primary button)

**Empty State:** "More foods coming soon! Check back."

**Loading State:** Grid of skeleton food cards (gray placeholder shapes)

---

### 16.7 — Progress Screen (Tab 3)

**Purpose:** Show the user that their hard work is paying off.

**UI Layout:**

**Header:** "Your Progress"

**Weight Section:**
- "Current Weight" metric card: shows latest log
- Weight trend chart (line graph via `victory-native`)
  - X-axis: dates
  - Y-axis: weight in kg/lbs
  - Smooth curve, accent color line
- "Log Today's Weight" button (appears if no weight logged today)
- Weight input modal (bottom sheet with number input)

**Streak Calendar:**
- Monthly calendar grid
- Each day: green dot = goal met, orange dot = partial, empty = nothing logged
- Current streak counter above calendar

**Calorie Consistency Chart:**
- Bar chart (7-day view)
- Each bar height = calories consumed that day
- Horizontal dashed line = daily goal
- Days above the line are accent color, below are muted

**Weekly Summary card:**
- "This week: X days goal met out of 7"
- Average calories
- Total XP earned this week

**Empty State (new user, no data):**
- "Start logging meals to see your progress"
- Illustration of progress graph

---

### 16.8 — Profile Screen (Tab 4)

**Purpose:** Account management and app settings.

**UI Layout:**

**User section:**
- Avatar circle (initials or uploaded photo)
- Name + email
- Current level + XP badge ("Grinder — 1,240 XP")

**Goals section (card):**
- Daily calorie goal
- Protein goal
- Current weight
- Target weight
- "Edit Goals" link → re-opens relevant onboarding steps

**Subscription card:**
- Status: "Premium — Active" or "Trial — X days left"
- "Manage Subscription" button → RevenueCat management URL or paywall

**Notifications section:**
- Toggle: Enable push notifications
- Reminder time picker
- Shake reminder toggle + time picker

**Account section:**
- Account settings (change email/password)
- "Restore Purchases" (RevenueCat)
- Privacy Policy link
- Terms of Service link
- "Log Out" button (secondary/danger style)

---

## 17. MVP Scope

### In Scope (Must Ship)
- [ ] Expo + NativeWind project setup with theme system
- [ ] Clerk auth (Google, Apple, email)
- [ ] Convex backend with full schema
- [ ] 7-step onboarding with calorie calculator
- [ ] RevenueCat paywall (3-day trial, monthly, yearly)
- [ ] Home screen with calorie ring, macro bars, meal list, AI scan FAB
- [ ] AI food scan flow (camera → OpenAI Vision → review → log)
- [ ] Manual meal logging (name + calorie entry)
- [ ] Foods screen with 5 categories and curated food cards (seed with 20–30 items)
- [ ] "Add to Today" from curated foods
- [ ] Progress screen (weight graph, streak calendar, calorie chart)
- [ ] Weight logging
- [ ] Profile screen with subscription management
- [ ] Streak tracking (Convex daily cron)
- [ ] XP system (basic — earn XP on key actions)
- [ ] Push notifications (calorie reminder, morning motivation, streak milestone)
- [ ] Trial ending reminders (48h + 24h)
- [ ] Subscription gating (graceful degradation post-trial)

### Out of Scope for MVP
- Meal plan generation
- Social features (sharing, friends)
- Barcode scanner
- Custom food creation by user
- Apple Health / Google Fit sync
- Wearable integrations
- Custom workout tracker
- In-app chat / support
- Referral system
- Admin dashboard (use Convex dashboard directly)

---

## 18. Future Features (Post-MVP)

### Phase 2 (Month 2–3)
- **Barcode scanner** — scan packaged food barcodes (Open Food Facts API)
- **Custom food library** — user can save their own frequently eaten meals
- **Streak protection tokens** — earn/buy "grace days"
- **Body photo comparisons** — before/after transformation tracker
- **Apple Health / Google Fit integration** — sync weight data

### Phase 3 (Month 4–6)
- **AI meal suggestions** — "You need 800 more calories — here's what to eat"
- **Weekly AI coaching messages** — personalized progress summaries from GPT
- **Social sharing** — share streak milestones to Instagram/TikTok
- **Referral program** — "Invite a friend, get 1 month free"
- **Leaderboard** — streak leaderboard among friends
- **Widget** — iOS/Android home screen widget showing daily progress ring

### Phase 4 (Long-term)
- Web app companion
- Coach / trainer tier (B2B)
- Multi-language support
- Meal delivery integration partnerships
- Community challenges

---

## 19. App Store Launch Plan

### Pre-Launch (4 weeks before)
- Create App Store Connect + Google Play Console accounts
- Prepare App Store assets:
  - App icon (1024x1024, no alpha channel)
  - Screenshots (6.5" iPhone, 12.9" iPad, Android phone)
  - Preview video (optional but high-converting)
  - App description (keyword-optimized)
  - Keywords list (50 chars on iOS)
- Set up TestFlight for beta testing
- Beta test with 20–30 target users

### App Store Metadata
**Name:** Bulky AI: Weight Gain Tracker  
**Subtitle:** Calorie & Muscle Building App  
**Category:** Health & Fitness  
**Keywords:** weight gain, bulk, calorie tracker, muscle building, skinny, ectomorph, food scanner, AI calories, protein tracker, gym beginner

**Description Opening:**
> "Finally, a calorie app built for people who need to EAT MORE, not less. Bulky AI helps skinny people gain healthy weight through simple daily tracking, AI food scanning, and a streak system that keeps you consistent."

### ASO Optimization
- A/B test app icon (2 variants)
- A/B test first screenshot headline
- Monitor keyword rankings weekly
- Encourage early users to leave reviews (prompt at streak milestone)

### Launch Day
- Product Hunt launch (schedule for Tuesday/Wednesday)
- Reddit posts: r/gainit, r/Fitness, r/ectomorph, r/leangains
- TikTok "Day 1" post from founder account
- Twitter/X announcement thread
- Discord servers for gym beginners

---

## 20. Retention Strategy

### Day 1
- Completion of onboarding → gives user a goal they care about
- Calorie ring on home screen creates immediate habit anchor
- First AI scan is "wow" moment → motivates return

### Day 3 (end of trial)
- Two notifications remind user of trial ending
- In-app banner on home screen
- Yearly plan anchoring makes monthly seem cheap

### Week 1
- Daily morning notification creates habit loop
- Streak counter makes missing a day feel costly
- Progress ring satisfaction (dopamine on completion)

### Week 2–4
- Weight logging shows actual progress → emotional investment
- XP level-up creates sense of advancement
- Weekly summary notification: "Week 2 done. You're up 0.8kg."

### Month 1+
- Streak milestones (7, 14, 30 days) with push + in-app celebration
- Calorie consistency chart shows the user their own improvement
- Before/after weight graph visualization is deeply motivating

### Churn Prevention
- Push "streak at risk" notification if no meal logged by 8 PM
- Graceful downgrade (don't hard-lock app — let user see their data but prompt upgrade)
- Re-engagement campaign: "You last opened 5 days ago. Your streak is gone. Start fresh →"

---

## 21. Viral & Social Media Strategy

### TikTok / Instagram Reels (Primary Channel)
**Content pillars:**
1. **Transformation content** — before/after user stories (with permission)
2. **"What I eat in a day" series** — using Bulky AI to track
3. **AI scan demos** — satisfying videos of scanning food with instant results
4. **Skinny guy relatability** — "When you eat all day and still don't gain weight"
5. **Quick tips** — "Add this one food to gain 500 extra calories easily"

**Hook formula:** "POV: You've been skinny your whole life and finally found an app that actually helps"

### Reddit (Highly Targeted)
- Subreddits: r/gainit (1.4M members), r/ectomorph, r/Fitness, r/BulkOrCut, r/leangains
- Authentic problem/solution posts from founder
- Answer questions and mention the app contextually (no spamming)
- "Built an app specifically for skinny guys" post on launch day

### App-Side Virality
- Streak sharing card: shareable graphic "I'm on a 30-day streak with Bulky AI"
- Progress share: "I gained 5kg in 8 weeks" with chart visualization
- Deep links in shares bring friends back to download

### Influencer Strategy
- Target micro-influencers (50K–500K): fitness beginner content creators
- Provide free premium access for authentic review
- "Day in my life" sponsored posts showing real app usage

---

## 22. Scalability Considerations

### Convex
- Convex auto-scales without any infrastructure management
- Database indexes on `by_user_date` for all frequently queried tables
- Use `ctx.scheduler` for async work (AI scans, notifications) — never block queries

### OpenAI API
- Rate limiting: store scan count in Convex, enforce limit in action before calling OpenAI
- Cost monitoring: set up OpenAI usage alerts
- Caching: if same user scans very similar image, consider caching result (future optimization)
- Fallback: if OpenAI is down, show "AI scan unavailable" — let user log manually

### Image Storage
- Use Convex Storage for AI scan images
- Set cleanup policy: delete AI scan images after 30 days (privacy + cost)
- Curated food images: host on CDN (e.g., Cloudflare Images) for performance

### Push Notifications
- Expo Push API handles scale automatically
- Batch daily notification sends via Convex scheduled functions
- Rate limit: max 3 push notifications per day per user (avoid becoming spam)

### Multi-Region
- Convex handles this automatically
- RevenueCat handles multi-currency and regional pricing
- Consider regional App Store pricing (set up via App Store Connect)

### Database Growth
- `mealLogs` and `weightLogs` are write-heavy tables — indexed properly
- `dailySummaries` should be computed and cached (not re-computed on every read)
- Archive old `aiScans` records after 90 days to keep table lean

---

## Appendix A — Calorie Goal Calculation Reference

```typescript
// src/lib/calculations.ts

type ActivityLevel = "sedentary" | "lightly_active" | "moderately_active" | "very_active";
type GoalType = "lean_bulk" | "aggressive_bulk";
type Gender = "male" | "female" | "other";

interface OnboardingData {
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  ageYears: number; // estimated: 22 if not collected (ask in onboarding v2)
  activityLevel: ActivityLevel;
  goalType: GoalType;
}

interface CalculatedGoals {
  dailyCalorieGoal: number;
  dailyProteinGoalG: number;
  estimatedWeeksToGoal: number;
}

export function calculateGoals(data: OnboardingData): CalculatedGoals {
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  };

  const surplusKcal = data.goalType === "aggressive_bulk" ? 500 : 275;

  const bmr =
    data.gender === "male"
      ? 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.ageYears + 5
      : 10 * data.weightKg + 6.25 * data.heightCm - 5 * data.ageYears - 161;

  const tdee = bmr * activityMultipliers[data.activityLevel];
  const dailyCalorieGoal = Math.round(tdee + surplusKcal);
  const dailyProteinGoalG = Math.round(data.weightKg * 1.6);

  const weeklyGainKg = (surplusKcal * 7) / 7700;
  const kgToGain = data.targetWeightKg - data.weightKg;
  const estimatedWeeksToGoal = Math.round(kgToGain / weeklyGainKg);

  return { dailyCalorieGoal, dailyProteinGoalG, estimatedWeeksToGoal };
}
```

---

## Appendix B — Curated Foods Seed Data (Sample)

```typescript
// src/constants/foods.ts (static seed, also seed into Convex curatedFoods table)

export const CURATED_FOODS = [
  // BREAKFAST
  { name: "Peanut Butter Oats", category: "breakfast", calories: 650, proteinG: 22, carbsG: 80, fatsG: 28, description: "Rolled oats with 2 tbsp PB and banana. Easy 650 cal breakfast.", tags: ["easy", "cheap"] },
  { name: "Mass Gainer Pancakes", category: "breakfast", calories: 800, proteinG: 35, carbsG: 95, fatsG: 20, description: "Protein pancakes with syrup and berries.", tags: ["high-protein"] },
  { name: "Avocado Toast + Eggs", category: "breakfast", calories: 550, proteinG: 28, carbsG: 40, fatsG: 28, description: "Whole grain toast, 2 eggs, full avocado.", tags: ["easy"] },

  // LUNCH
  { name: "Chicken Rice Bowl", category: "lunch", calories: 720, proteinG: 52, carbsG: 75, fatsG: 18, description: "200g chicken breast, 1 cup rice, olive oil drizzle.", tags: ["high-protein", "meal-prep"] },
  { name: "Tuna Pasta", category: "lunch", calories: 680, proteinG: 45, carbsG: 80, fatsG: 14, description: "Pasta with 2 cans tuna, olive oil, garlic.", tags: ["cheap", "easy"] },

  // DINNER
  { name: "Beef & Rice", category: "dinner", calories: 850, proteinG: 58, carbsG: 70, fatsG: 28, description: "Ground beef with jasmine rice and vegetables.", tags: ["high-protein"] },
  { name: "Salmon + Sweet Potato", category: "dinner", calories: 700, proteinG: 46, carbsG: 55, fatsG: 22, description: "Baked salmon fillet with roasted sweet potato.", tags: ["healthy-fats"] },

  // SNACKS
  { name: "Peanut Butter Banana", category: "snack", calories: 380, proteinG: 10, carbsG: 48, fatsG: 18, description: "2 tbsp PB on a large banana. Quick 380 cal snack.", tags: ["easy", "cheap"] },
  { name: "Greek Yogurt + Granola", category: "snack", calories: 420, proteinG: 18, carbsG: 55, fatsG: 12, description: "Full-fat greek yogurt with granola and honey.", tags: ["easy"] },
  { name: "Mixed Nuts", category: "snack", calories: 350, proteinG: 9, carbsG: 12, fatsG: 30, description: "A 60g handful of mixed nuts. Calorie dense and portable.", tags: ["easy", "portable"] },

  // SHAKES
  { name: "Classic Mass Shake", category: "shake", calories: 900, proteinG: 50, carbsG: 100, fatsG: 25, description: "2 scoops whey, 2 cups whole milk, 2 tbsp PB, 1 banana.", tags: ["easy", "high-protein"] },
  { name: "Oat & Milk Shake", category: "shake", calories: 650, proteinG: 30, carbsG: 90, fatsG: 15, description: "Rolled oats blended with whole milk and protein powder.", tags: ["cheap"] },
  { name: "Avocado Protein Shake", category: "shake", calories: 700, proteinG: 35, carbsG: 55, fatsG: 32, description: "Avocado, banana, protein, whole milk. Creamy and calorie dense.", tags: ["healthy-fats"] },
];
```

---

*End of Bulky AI Product Specification v1.0*
