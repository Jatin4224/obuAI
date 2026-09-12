import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Values match what the onboarding screens actually store.
export const onboardingProfileValidator = v.object({
  gender: v.union(v.literal("male"), v.literal("female")),
  heightCm: v.number(),
  currentWeightKg: v.number(),
  goalWeightKg: v.number(),
  activityLevel: v.union(
    v.literal("low"),
    v.literal("moderate"),
    v.literal("active"),
    v.literal("very_active"),
  ),
  gymExperience: v.union(
    v.literal("beginner"),
    v.literal("intermediate"),
    v.literal("advanced"),
  ),
  dailyCalorieGoal: v.number(),
  dailyProteinGoalG: v.number(),
  dailyCarbsG: v.number(),
  dailyFatsG: v.number(),
  estimatedWeeksToGoal: v.number(),
});

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    clerkId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),

    ...onboardingProfileValidator.fields,

    xpTotal: v.number(),
    currentStreakDays: v.number(),
    longestStreakDays: v.number(),

    onboardingComplete: v.boolean(),
    notificationsEnabled: v.boolean(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  weightLogs: defineTable({
    userId: v.id("users"),
    date: v.string(), // "YYYY-MM-DD"
    weightKg: v.number(),
    loggedAt: v.number(),
  }).index("by_userId_and_date", ["userId", "date"]),
});
