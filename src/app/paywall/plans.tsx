import { addDays, format } from 'date-fns';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';

import { PaywallScaffold } from '@/components/paywall/PaywallScaffold';
import { PlanCard } from '@/components/paywall/PlanCard';
import { usePaywall } from '@/components/paywall/PaywallProvider';
import { TrialTimeline } from '@/components/paywall/TrialTimeline';
import { LEGAL_LINKS } from '@/constants/links';
import { errorMessage } from '@/lib/revenuecat';

type PlanKey = 'annual' | 'monthly';

const NO_TRIAL_FEATURES = [
  'Unlimited AI food scans',
  'Personalized calorie & protein goals',
  'Full progress history & smart reminders',
];

export default function PaywallPlans() {
  const router = useRouter();
  const { monthly, annual, loading, error, reload, trialDaysFor, purchase, restore, restoring } = usePaywall();

  const [selectedKey, setSelectedKey] = useState<PlanKey>('annual');
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const selected: PurchasesPackage | null =
    selectedKey === 'annual' ? (annual ?? monthly) : (monthly ?? annual);
  const selectedIsAnnual = selected !== null && selected === annual;

  // While plans load, assume the default trial so the layout doesn't jump
  const trialDays = selected ? trialDaysFor(selected) : loading ? 3 : null;
  const hasTrial = trialDays !== null;
  const billingDate = format(addDays(new Date(), trialDays ?? 0), 'd MMM yyyy');

  const savingsPct =
    annual && monthly && monthly.product.price > 0
      ? Math.round((1 - annual.product.price / (monthly.product.price * 12)) * 100)
      : 0;

  const onPurchase = async () => {
    if (!selected) return;
    setPurchaseError(null);
    setPurchasing(true);
    try {
      const outcome = await purchase(selected);
      if (outcome === 'not_entitled') {
        setPurchaseError('Your purchase went through but premium isn\'t active yet. Tap Restore to refresh.');
      }
    } catch (e) {
      setPurchaseError(errorMessage(e, 'Purchase failed. Please try again.'));
    } finally {
      setPurchasing(false);
    }
  };

  const periodWord = selectedIsAnnual ? 'year' : 'month';
  const billedWord = selectedIsAnnual ? 'yearly' : 'monthly';
  const finePrint = selected
    ? `${hasTrial ? `${trialDays} days free, then ` : ''}${selected.product.priceString} per ${periodWord}. Billed ${billedWord}. Plan auto-renews unless you cancel.`
    : null;

  return (
    <PaywallScaffold
      onBack={() => router.back()}
      showNoPaymentDue={hasTrial && !error}
      ctaLabel={hasTrial ? `Start My ${trialDays}-Day Free Trial` : 'Subscribe'}
      onCta={onPurchase}
      ctaLoading={purchasing}
      ctaDisabled={loading || !!error || !selected}
      aboveCta={
        purchaseError ? (
          <Text className="text-[13px] text-danger text-center">{purchaseError}</Text>
        ) : null
      }
      footer={
        <View className="gap-3">
          {finePrint ? (
            <Text className="text-[12px] leading-[17px] text-[#777777] text-center">{finePrint}</Text>
          ) : null}
          <View className="flex-row items-center justify-center gap-4 pb-1">
            <FooterLink label="Terms" onPress={() => WebBrowser.openBrowserAsync(LEGAL_LINKS.terms)} />
            <Text className="text-muted">•</Text>
            <FooterLink label="Privacy" onPress={() => WebBrowser.openBrowserAsync(LEGAL_LINKS.privacy)} />
            <Text className="text-muted">•</Text>
            <FooterLink label={restoring ? 'Restoring…' : 'Restore'} onPress={restore} disabled={restoring} />
          </View>
        </View>
      }
    >
      <Text className="text-[28px] leading-[34px] font-extrabold text-[#111111] text-center tracking-tight">
        {hasTrial ? `Start your ${trialDays}-day\nFREE trial to continue` : 'Choose your plan\nto continue'}
      </Text>
      <Text className="text-[15px] text-[#777777] text-center mt-2">Cancel anytime. You're in control.</Text>

      <View className="mt-7">
        {hasTrial ? (
          <TrialTimeline variant="connected" trialDays={trialDays} billingDate={billingDate} />
        ) : (
          <View className="gap-4">
            {NO_TRIAL_FEATURES.map(feature => (
              <View key={feature} className="flex-row items-center gap-3">
                <View className="w-7 h-7 rounded-full bg-[#FFE8DC] items-center justify-center">
                  <Check size={16} color="#FF6B35" strokeWidth={3} />
                </View>
                <Text className="text-[16px] font-semibold text-[#111111]">{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mt-8 flex-row gap-3">
        {loading ? (
          <>
            <View className="flex-1 h-[118px] rounded-lg bg-surface" />
            <View className="flex-1 h-[118px] rounded-lg bg-surface" />
          </>
        ) : error ? (
          <TouchableOpacity
            onPress={reload}
            activeOpacity={0.8}
            className="flex-1 rounded-lg border-2 border-border p-4 items-center gap-1"
          >
            <Text className="text-[14px] text-[#111111] text-center">{error}</Text>
            <Text className="text-[14px] font-bold text-accent">Tap to retry</Text>
          </TouchableOpacity>
        ) : (
          <>
            {monthly ? (
              <PlanCard
                title="Monthly"
                price={monthly.product.priceString}
                period="/mo"
                selected={selected === monthly}
                onPress={() => setSelectedKey('monthly')}
              />
            ) : null}
            {annual ? (
              <PlanCard
                title="Yearly"
                price={annual.product.priceString}
                period="/yr"
                selected={selected === annual}
                onPress={() => setSelectedKey('annual')}
                badge="BEST VALUE"
                savingsLabel={savingsPct > 0 ? `Save ${savingsPct}%` : undefined}
              />
            ) : null}
          </>
        )}
      </View>
    </PaywallScaffold>
  );
}

function FooterLink({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} hitSlop={8} activeOpacity={0.7}>
      <Text className="text-[13px] text-[#555555]">{label}</Text>
    </TouchableOpacity>
  );
}
