import { Check, ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
  onBack?: () => void;
  ctaLabel: string;
  onCta: () => void;
  ctaLoading?: boolean;
  ctaDisabled?: boolean;
  showNoPaymentDue?: boolean;
  /** Rendered between the "No Payment Due" row and the CTA (e.g. inline errors). */
  aboveCta?: ReactNode;
  footer?: ReactNode;
};

export function PaywallScaffold({
  children,
  onBack,
  ctaLabel,
  onCta,
  ctaLoading = false,
  ctaDisabled = false,
  showNoPaymentDue = false,
  aboveCta,
  footer,
}: Props) {
  const disabled = ctaDisabled || ctaLoading;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="h-12 px-4 justify-center">
        {onBack ? (
          <TouchableOpacity onPress={onBack} hitSlop={12} activeOpacity={0.7} className="self-start p-1">
            <ChevronLeft size={28} color="#111111" strokeWidth={2.2} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-6 pb-4"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      <View className="px-6 pt-3 pb-2 gap-3">
        {showNoPaymentDue ? (
          <View className="flex-row items-center justify-center gap-2">
            <Check size={18} color="#111111" strokeWidth={2.6} />
            <Text className="text-[15px] font-semibold text-[#111111]">No Payment Due Now</Text>
          </View>
        ) : null}

        {aboveCta}

        <TouchableOpacity
          onPress={onCta}
          disabled={disabled}
          activeOpacity={0.85}
          className="h-14 rounded-full bg-[#111111] items-center justify-center"
          style={{ opacity: ctaDisabled ? 0.45 : 1 }}
        >
          {ctaLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-[17px] font-bold">{ctaLabel}</Text>
          )}
        </TouchableOpacity>

        {footer}
      </View>
    </SafeAreaView>
  );
}

export function RestoreLink({
  onPress,
  restoring,
  showAction = true,
}: {
  onPress: () => void;
  restoring: boolean;
  showAction?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={restoring}
      activeOpacity={0.7}
      className="items-center justify-center min-h-[40px]"
    >
      {restoring ? (
        <ActivityIndicator size="small" color="#9B9B9B" />
      ) : (
        <>
          <Text className="text-[13px] text-[#777777]">Already purchased?</Text>
          {showAction ? (
            <Text className="text-[13px] text-[#111111] font-semibold underline mt-0.5">
              Restore Purchase
            </Text>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}
