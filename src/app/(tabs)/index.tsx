import { useAuth, useUser } from '@clerk/clerk-expo';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-6 gap-6">
        <View className="gap-1">
          <Text className="text-muted text-sm">Good morning 👋</Text>
          <Text className="text-primary text-2xl font-bold tracking-tight">
            {user?.firstName ?? 'Athlete'}
          </Text>
        </View>

        <View className="bg-surface rounded-lg p-4 items-center justify-center" style={{ height: 200 }}>
          <Text className="text-muted text-base">Calorie ring coming soon</Text>
        </View>

        <TouchableOpacity
          onPress={() => signOut()}
          className="h-14 border border-border rounded-xl items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-muted font-medium text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
