import { Bell, BellRing, CalendarDays, Crown, Lock, type LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

type Variant = 'tiles' | 'connected';

type Step = { icon: LucideIcon; title: string; body: string; emphasis?: boolean };

function dayLabel(n: number) {
  return n === 1 ? '1 Day' : `${n} Days`;
}

function buildSteps(variant: Variant, trialDays: number, billingDate: string): Step[] {
  const reminderDay = Math.max(1, trialDays - 1);
  if (variant === 'tiles') {
    return [
      { icon: CalendarDays, title: 'Today', body: 'Unlock all premium features and start your transformation' },
      { icon: BellRing, title: `In ${dayLabel(reminderDay)} – Reminder`, body: "We'll remind you that your free trial is ending soon" },
      { icon: Crown, title: `In ${dayLabel(trialDays)} – Billing Starts`, body: `You'll be charged on ${billingDate} unless you cancel anytime.`, emphasis: true },
    ];
  }
  return [
    { icon: Lock, title: 'Today', body: 'You get full access to all premium features.' },
    { icon: Bell, title: `In ${dayLabel(reminderDay)} – Reminder`, body: "We'll notify you before your trial ends." },
    { icon: Crown, title: `In ${dayLabel(trialDays)} – Billing Starts`, body: `You'll be charged on ${billingDate} unless you cancel.`, emphasis: true },
  ];
}

export function TrialTimeline({
  variant,
  trialDays,
  billingDate,
}: {
  variant: Variant;
  trialDays: number;
  billingDate: string;
}) {
  const steps = buildSteps(variant, trialDays, billingDate);

  if (variant === 'tiles') {
    return (
      <View>
        {steps.map((step, i) => {
          const Icon = step.icon;
          const last = i === steps.length - 1;
          return (
            <View key={step.title} className="flex-row gap-4">
              <View
                className={
                  step.emphasis
                    ? 'w-[44px] h-[44px] rounded-md items-center justify-center bg-[#111111]'
                    : 'w-[44px] h-[44px] rounded-md items-center justify-center bg-surface border border-border'
                }
              >
                <Icon size={22} color={step.emphasis ? '#FFFFFF' : '#111111'} strokeWidth={2} />
              </View>
              <View className={last ? 'flex-1' : 'flex-1 pb-4 mb-4 border-b border-border'}>
                <Text className="text-[16px] font-bold text-[#111111]">{step.title}</Text>
                <Text className="text-[14px] leading-[20px] text-[#777777] mt-1">{step.body}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View>
      {steps.map((step, i) => {
        const Icon = step.icon;
        const last = i === steps.length - 1;
        return (
          <View key={step.title} className="flex-row gap-4">
            <View className="items-center">
              <View
                className={
                  step.emphasis
                    ? 'w-10 h-10 rounded-full items-center justify-center bg-[#111111]'
                    : 'w-10 h-10 rounded-full items-center justify-center bg-[#FFE8DC]'
                }
              >
                <Icon size={20} color={step.emphasis ? '#FFFFFF' : '#FF6B35'} strokeWidth={2.2} />
              </View>
              {!last ? <View className="flex-1 w-[2px] bg-[#FFE8DC] my-1" /> : null}
            </View>
            <View className={last ? 'flex-1 pt-2' : 'flex-1 pt-2 pb-5'}>
              <Text className="text-[16px] font-bold text-[#111111]">{step.title}</Text>
              <Text className="text-[14px] leading-[20px] text-[#777777] mt-1">{step.body}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
