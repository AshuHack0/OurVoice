import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { OurVoiceBrand } from '@/components/our-voice-brand';

const SPLASH_DURATION_MS = 2200;

type SplashScreenProps = {
  onFinish?: () => void;
};

/**
 * Full-screen branded splash: OurVoice wordmark with fade-in, then callback.
 */
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    opacity.value = withDelay(60, withTiming(1, { duration: 380 }));
    scale.value = withDelay(60, withTiming(1, { duration: 380 }));

    const t = setTimeout(() => {
      onFinish?.();
    }, SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, [onFinish]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <OurVoiceBrand variant="full" size="splash" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
