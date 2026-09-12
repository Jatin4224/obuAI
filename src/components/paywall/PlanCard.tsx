import { Check } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  price: string;
  period: string;
  selected: boolean;
  onPress: () => void;
  badge?: string;
  savingsLabel?: string;
};

export function PlanCard({ title, price, period, selected, onPress, badge, savingsLabel }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={
        selected
          ? 'flex-1 min-h-[118px] rounded-lg border-2 border-[#111111] bg-white p-4'
          : 'flex-1 min-h-[118px] rounded-lg border-2 border-border bg-white p-4'
      }
    >
      {badge ? (
        <View className="absolute -top-3 right-3 rounded-full bg-[#111111] px-2 py-0.5">
          <Text className="text-[10px] font-extrabold text-white tracking-wide">{badge}</Text>
        </View>
      ) : null}

      <View className="flex-row items-start justify-between">
        <Text className="text-[15px] font-medium text-[#111111]">{title}</Text>
        {selected ? (
          <View className="w-6 h-6 rounded-full bg-[#111111] items-center justify-center">
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          </View>
        ) : (
          <View className="w-6 h-6 rounded-full border-2 border-border-strong" />
        )}
      </View>

      <Text className="mt-2 text-[#111111]" numberOfLines={1} adjustsFontSizeToFit>
        <Text className="text-[20px] font-extrabold">{price}</Text>
        <Text className="text-[13px] font-medium"> {period}</Text>
      </Text>

      {savingsLabel ? (
        <View className="mt-3 self-start rounded-sm bg-surface px-3 py-2">
          <Text className="text-[13px] font-semibold text-[#111111]">{savingsLabel}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
