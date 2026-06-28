import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FoodsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-6">
        <Text className="text-primary text-2xl font-bold tracking-tight">Foods</Text>
        <Text className="text-muted text-sm mt-2">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
