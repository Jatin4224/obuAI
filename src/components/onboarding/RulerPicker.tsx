import { useEffect, useRef } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const SCREEN_W = Dimensions.get('window').width;

type Props = {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  unitWidth?: number;
  labelEvery?: number;
  tickEvery?: number;
};

export function RulerPicker({
  min,
  max,
  value,
  onChange,
  unitWidth = 8,
  labelEvery = 10,
  tickEvery = 2,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const half = SCREEN_W / 2;

  useEffect(() => {
    const offset = (value - min) * unitWidth;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: offset, animated: false });
    }, 80);
    return () => clearTimeout(t);
  }, []);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const newValue = Math.round(min + x / unitWidth);
    const clamped = Math.max(min, Math.min(max, newValue));
    if (clamped !== value) onChange(clamped);
  };

  const units = max - min;

  return (
    <View style={s.container}>
      {/* Fixed center marker */}
      <View style={[s.marker, { left: half - 1 }]} />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: half }}
        onScroll={onScroll}
        scrollEventThrottle={8}
        snapToInterval={unitWidth}
        decelerationRate="fast"
      >
        <View style={s.rulerRow}>
          {Array.from({ length: units + 1 }, (_, i) => {
            const v = min + i;
            const isLabel = v % labelEvery === 0;
            const isTick = v % tickEvery === 0;

            if (!isLabel && !isTick) {
              return <View key={i} style={{ width: unitWidth }} />;
            }

            return (
              <View key={i} style={{ width: unitWidth, alignItems: 'center' }}>
                <View style={[s.tick, { height: isLabel ? 22 : 12 }]} />
                {isLabel && <Text style={s.label}>{v}</Text>}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { height: 60, position: 'relative' },
  marker: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 28,
    backgroundColor: '#111111',
    borderRadius: 1,
    zIndex: 10,
  },
  rulerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  tick: { width: 1.5, backgroundColor: '#CCCCCC' },
  label: { fontSize: 10, color: '#AAAAAA', marginTop: 4, fontWeight: '500' },
});
