import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert } from 'react-native';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { useSubscription } from '@/hooks/useSubscription';
import { errorMessage, getTrialDays, hasPremium, isPurchaseCancelled } from '@/lib/revenuecat';

export type PurchaseOutcome = 'success' | 'cancelled' | 'not_entitled';

type PaywallContextValue = {
  monthly: PurchasesPackage | null;
  annual: PurchasesPackage | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  trialDaysFor: (pkg: PurchasesPackage) => number | null;
  /** Trial length shown on the intro screens (yearly plan first, then monthly). */
  introTrialDays: number | null;
  /** Resolves 'success' once premium is active; throws on store errors. */
  purchase: (pkg: PurchasesPackage) => Promise<PurchaseOutcome>;
  restore: () => Promise<void>;
  restoring: boolean;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const { applyCustomerInfo } = useSubscription();
  const [monthly, setMonthly] = useState<PurchasesPackage | null>(null);
  const [annual, setAnnual] = useState<PurchasesPackage | null>(null);
  const [trialDays, setTrialDays] = useState<Record<string, number | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (!current || (!current.monthly && !current.annual)) {
        throw new Error('No current offering with $rc_monthly / $rc_annual packages');
      }
      const packages = [current.annual, current.monthly].filter((p): p is PurchasesPackage => p !== null);
      setTrialDays(await getTrialDays(packages));
      setMonthly(current.monthly);
      setAnnual(current.annual);
    } catch (e) {
      console.warn('[RevenueCat] failed to load offerings', e);
      const detail = __DEV__ ? `\n${errorMessage(e, '')}` : '';
      setError(`Couldn't load plans.${detail}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const purchase = useCallback(
    async (pkg: PurchasesPackage): Promise<PurchaseOutcome> => {
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        // The paywall layout redirects to the app as soon as premium is active
        applyCustomerInfo(customerInfo);
        return hasPremium(customerInfo) ? 'success' : 'not_entitled';
      } catch (e) {
        if (isPurchaseCancelled(e)) return 'cancelled';
        throw e;
      }
    },
    [applyCustomerInfo],
  );

  const restore = useCallback(async () => {
    setRestoring(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      applyCustomerInfo(customerInfo);
      if (!hasPremium(customerInfo)) {
        Alert.alert('No subscription found', "We couldn't find an active subscription for this Apple ID.");
      }
    } catch (e) {
      Alert.alert('Restore failed', errorMessage(e, 'Please try again.'));
    } finally {
      setRestoring(false);
    }
  }, [applyCustomerInfo]);

  const value = useMemo<PaywallContextValue>(() => {
    const trialDaysFor = (pkg: PurchasesPackage) => trialDays[pkg.product.identifier] ?? null;
    const introPackage = annual ?? monthly;
    return {
      monthly,
      annual,
      loading,
      error,
      reload: load,
      trialDaysFor,
      introTrialDays: introPackage ? trialDaysFor(introPackage) : null,
      purchase,
      restore,
      restoring,
    };
  }, [monthly, annual, trialDays, loading, error, load, purchase, restore, restoring]);

  return <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>;
}

export function usePaywall() {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall must be used inside PaywallProvider');
  return ctx;
}
