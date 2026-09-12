import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { onboardingProfileValidator } from "./schema";

const ONBOARDING_XP = 100;

export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
}

export const me = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

function assertInRange(label: string, value: number, min: number, max: number) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new ConvexError(`${label} must be between ${min} and ${max}`);
  }
}

/**
 * Saves the onboarding answers + calculated goals for the signed-in user.
 * Idempotent: creates the user on first call, updates profile/goals afterwards
 * (XP and streaks are preserved).
 */
export const completeOnboarding = mutation({
  args: {
    profile: onboardingProfileValidator,
    date: v.string(), // client's local "YYYY-MM-DD", used for the starting weight log
  },
  handler: async (ctx, { profile, date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new ConvexError("Invalid date");
    assertInRange("Height", profile.heightCm, 100, 250);
    assertInRange("Current weight", profile.currentWeightKg, 25, 300);
    assertInRange("Goal weight", profile.goalWeightKg, 25, 300);
    assertInRange("Calorie goal", profile.dailyCalorieGoal, 1200, 6000);
    assertInRange("Protein goal", profile.dailyProteinGoalG, 20, 400);
    assertInRange("Carbs goal", profile.dailyCarbsG, 0, 1000);
    assertInRange("Fats goal", profile.dailyFatsG, 0, 400);
    assertInRange("Weeks to goal", profile.estimatedWeeksToGoal, 0, 520);

    const existing = await getCurrentUser(ctx);
    if (existing) {
      await ctx.db.patch("users", existing._id, { ...profile, onboardingComplete: true });
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      clerkId: identity.subject,
      email: identity.email,
      name: identity.name,
      ...profile,
      xpTotal: ONBOARDING_XP,
      currentStreakDays: 0,
      longestStreakDays: 0,
      onboardingComplete: true,
      notificationsEnabled: false,
    });

    await ctx.db.insert("weightLogs", {
      userId,
      date,
      weightKg: profile.currentWeightKg,
      loggedAt: Date.now(),
    });

    return userId;
  },
});
