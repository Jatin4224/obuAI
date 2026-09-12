import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingScreen({ message }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-3">
      <ActivityIndicator size="large" color="#FF6B35" />
      {message ? <Text className="text-muted text-[14px]">{message}</Text> : null}
    </View>
  );
}
