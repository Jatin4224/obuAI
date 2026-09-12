import { useAuth } from '@clerk/clerk-expo';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo } from 'react-native-purchases';

import { configureRevenueCat, hasPremium, isRevenueCatConfigured } from '@/lib/revenuecat';

type SubscriptionContextValue = {
  isLoading: boolean;
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  refresh: () => Promise<void>;
  /** Apply CustomerInfo returned by a purchase/restore immediately. */
  applyCustomerInfo: (info: CustomerInfo) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

// iOS ships to the App Store; web is supported for browser testing with the RevenueCat Test Store
const IS_SUPPORTED = Platform.OS === 'ios' || Platform.OS === 'web';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isLoaded, userId } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_SUPPORTED || !isLoaded) return;

    if (!userId) {
      setCustomerInfo(null);
      setLoadedForUserId(null);
      if (isRevenueCatConfigured()) Purchases.logOut().catch(() => {});
      return;
    }

    let active = true;
    const listener = (info: CustomerInfo) => {
      if (active) setCustomerInfo(info);
    };

    (async () => {
      try {
        await configureRevenueCat(userId);
        Purchases.addCustomerInfoUpdateListener(listener);
        const info = await Purchases.getCustomerInfo();
        if (active) setCustomerInfo(info);
      } catch (e) {
        console.warn('[RevenueCat] failed to load customer info', e);
        if (active) setCustomerInfo(null);
      } finally {
        if (active) setLoadedForUserId(userId);
      }
    })();

    return () => {
      active = false;
      if (isRevenueCatConfigured()) Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [isLoaded, userId]);

  const refresh = useCallback(async () => {
    if (!IS_SUPPORTED || !isRevenueCatConfigured()) return;
    setCustomerInfo(await Purchases.getCustomerInfo());
  }, []);

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      isLoading: IS_SUPPORTED && (!isLoaded || (!!userId && loadedForUserId !== userId)),
      isPremium: IS_SUPPORTED && hasPremium(customerInfo),
      customerInfo,
      refresh,
      applyCustomerInfo: setCustomerInfo,
    }),
    [isLoaded, userId, loadedForUserId, customerInfo, refresh],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}
