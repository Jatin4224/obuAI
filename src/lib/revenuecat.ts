import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type IntroEligibility,
  type PurchasesPackage,
} from 'react-native-purchases';

export const ENTITLEMENT_ID = 'bulky_premium';
export const DEFAULT_TRIAL_DAYS = 3;

// Web runs RevenueCat in "browser mode" for testing, backed by the Test Store
const IS_WEB = Platform.OS === 'web';

let configured = false;

export function isRevenueCatConfigured() {
  return configured;
}

/** Configures the SDK on first sign-in, switches customers on later sign-ins. Clerk userId = RevenueCat appUserID. */
export async function configureRevenueCat(appUserID: string) {
  if (configured) {
    await Purchases.logIn(appUserID);
    return;
  }
  // The browser can only use the RevenueCat Test Store key (test_…); iOS uses the App Store key (appl_…)
  const apiKey = IS_WEB ? process.env.EXPO_PUBLIC_RC_TEST_KEY : process.env.EXPO_PUBLIC_RC_IOS_KEY;
  if (!apiKey) throw new Error(`${IS_WEB ? 'EXPO_PUBLIC_RC_TEST_KEY' : 'EXPO_PUBLIC_RC_IOS_KEY'} is not set`);
  if (__DEV__) Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey, appUserID });
  configured = true;
}

export function hasPremium(customerInfo: CustomerInfo | null) {
  return customerInfo?.entitlements.active[ENTITLEMENT_ID] !== undefined;
}

export function isPurchaseCancelled(error: unknown) {
  if (typeof error !== 'object' || error === null) return false;
  const e = error as { code?: string; userCancelled?: boolean | null };
  return e.userCancelled === true || e.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}

export function errorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }
  return fallback;
}

const DAYS_PER_UNIT: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };

function periodDays(unit: string, count: number) {
  return (DAYS_PER_UNIT[unit] ?? 1) * count;
}

/** Free-trial length from store metadata, or null when the product has no free trial. */
function freeTrialDays(pkg: PurchasesPackage): number | null {
  const intro = pkg.product.introPrice;
  if (intro && intro.price === 0) {
    return periodDays(intro.periodUnit, intro.periodNumberOfUnits) * Math.max(1, intro.cycles);
  }
  const freePhase = pkg.product.defaultOption?.freePhase;
  if (freePhase) return periodDays(freePhase.billingPeriod.unit, freePhase.billingPeriod.value);
  return null;
}

/**
 * Free-trial length per product id, or null when there's no free trial or the
 * Apple ID already used one in this subscription group (unknown counts as ineligible on iOS).
 */
export async function getTrialDays(packages: PurchasesPackage[]): Promise<Record<string, number | null>> {
  const result: Record<string, number | null> = {};

  // Browser mode can't check eligibility (always "unknown"), so trust the product metadata
  if (IS_WEB) {
    for (const pkg of packages) result[pkg.product.identifier] = freeTrialDays(pkg);
    return result;
  }

  let eligibility: Record<string, IntroEligibility> = {};
  try {
    eligibility = await Purchases.checkTrialOrIntroductoryPriceEligibility(packages.map(p => p.product.identifier));
  } catch (e) {
    console.warn('[RevenueCat] trial eligibility check failed', e);
  }

  for (const pkg of packages) {
    const eligible =
      eligibility[pkg.product.identifier]?.status ===
      Purchases.INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
    result[pkg.product.identifier] = eligible ? freeTrialDays(pkg) : null;
  }
  return result;
}
