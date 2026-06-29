import { StyleSheet, View } from 'react-native';

const TOTAL = 8;

export function ProgressDots({ current }: { current: number }) {
  return (
    <View style={s.row}>
      {Array.from({ length: TOTAL }, (_, i) => (
        <View
          key={i}
          style={[
            s.dot,
            i < current - 1 && s.dotDone,
            i === current - 1 && s.dotActive,
          ]}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, alignSelf: 'center', marginTop: 16 },
  dot: { width: 28, height: 4, borderRadius: 2, backgroundColor: '#E5E5E5' },
  dotDone: { backgroundColor: '#BBBBBB' },
  dotActive: { backgroundColor: '#1A1A2E', width: 28 },
});
