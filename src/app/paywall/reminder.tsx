import { addDays, format } from 'date-fns';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { usePaywall } from '@/components/paywall/PaywallProvider';
import { PaywallScaffold, RestoreLink } from '@/components/paywall/PaywallScaffold';
import { TrialTimeline } from '@/components/paywall/TrialTimeline';
import { DEFAULT_TRIAL_DAYS } from '@/lib/revenuecat';

const BELL_WIDTH = 150;
const BELL_ASPECT = 529 / 561; // paywall-bell.png height / width

export default function PaywallReminder() {
  const router = useRouter();
  const { introTrialDays, loading, restore, restoring } = usePaywall();

  // Not eligible for a free trial → the reminder promise doesn't apply
  if (!loading && introTrialDays === null) return <Redirect href="/paywall/plans" />;

  const trialDays = introTrialDays ?? DEFAULT_TRIAL_DAYS;
  const billingDate = format(addDays(new Date(), trialDays), 'd MMM yyyy');

  return (
    <PaywallScaffold
      onBack={() => router.back()}
      showNoPaymentDue
      ctaLabel="Continue for FREE"
      onCta={() => router.push('/paywall/plans')}
      footer={<RestoreLink onPress={restore} restoring={restoring} showAction={false} />}
    >
      <Text className="text-[28px] leading-[34px] font-extrabold text-[#111111] text-center tracking-tight">
        {"We'll send you a\nreminder before your\nfree trial ends"}
      </Text>

      <View className="items-center my-6">
        <Image
          source={require('@/assets/images/paywall-bell.png')}
          style={{ width: BELL_WIDTH, height: BELL_WIDTH * BELL_ASPECT }}
          contentFit="contain"
        />
      </View>

      <TrialTimeline variant="tiles" trialDays={trialDays} billingDate={billingDate} />
    </PaywallScaffold>
  );
}
