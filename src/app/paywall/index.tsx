import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, View, useWindowDimensions } from 'react-native';

import { usePaywall } from '@/components/paywall/PaywallProvider';
import { PaywallScaffold, RestoreLink } from '@/components/paywall/PaywallScaffold';
import { DEFAULT_TRIAL_DAYS } from '@/lib/revenuecat';

// Phone frame bounds inside paywall-demo.png (1024×1024) — used to crop away the grey backdrop
const SOURCE_SIZE = 1024;
const FRAME = { left: 204, top: 41, width: 614, cornerRadius: 104 };

export default function PaywallIntro() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { introTrialDays, loading, restore, restoring } = usePaywall();

  // Most users are trial-eligible, so show trial copy while plans load
  const trialDays = loading ? DEFAULT_TRIAL_DAYS : introTrialDays;
  const hasTrial = trialDays !== null;

  const scale = Math.min(width * 0.68, 300) / FRAME.width;
  const cropWidth = FRAME.width * scale;
  const cropHeight = Math.min(cropWidth * 1.2, height * 0.42);

  return (
    <PaywallScaffold
      showNoPaymentDue={hasTrial}
      ctaLabel={hasTrial ? `Try ${trialDays} Days Free` : 'Continue'}
      onCta={() => router.push(hasTrial ? '/paywall/reminder' : '/paywall/plans')}
      footer={<RestoreLink onPress={restore} restoring={restoring} />}
    >
      <Text className="text-[28px] leading-[34px] font-extrabold text-[#111111] text-center tracking-tight">
        {hasTrial ? 'We want you to\ntry obuAI for free' : 'Unlock the full\npower of obuAI'}
      </Text>
      <Text className="text-[15px] leading-[21px] text-[#777777] text-center mt-3 px-2">
        {hasTrial
          ? `Experience the full power of AI nutrition coaching — free for ${trialDays} days.`
          : 'AI food scanning, personalized goals and progress tracking — everything you need to gain.'}
      </Text>

      <View className="flex-1 items-center justify-end mt-6">
        <View
          style={{
            width: cropWidth,
            height: cropHeight,
            overflow: 'hidden',
            borderTopLeftRadius: FRAME.cornerRadius * scale,
            borderTopRightRadius: FRAME.cornerRadius * scale,
          }}
        >
          <Image
            source={require('@/assets/images/paywall-demo.png')}
            style={{
              position: 'absolute',
              width: SOURCE_SIZE * scale,
              height: SOURCE_SIZE * scale,
              left: -FRAME.left * scale,
              top: -FRAME.top * scale,
            }}
            contentFit="fill"
          />
          <LinearGradient
            colors={['rgba(255,255,255,0)', '#FFFFFF']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: cropHeight * 0.25 }}
          />
        </View>
      </View>
    </PaywallScaffold>
  );
}
