import React, { useMemo } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Shadows } from '@/constants/theme';

const BASE_WIDTH = 390;

/**
 * Responsive values for the tab bar based on screen size.
 */
function useTabBarResponsive() {
  const { width } = useWindowDimensions();
  return useMemo(() => {
    const scale = Math.min(width / BASE_WIDTH, 1.4);
    const isNarrow = width < 360;
    const isWide = width > 500;

    return {
      horizontalMargin: Math.round(Math.min(24, Math.max(12, width * 0.04))),
      bottomMargin: isNarrow ? 4 : 6,
      pillRadius: Math.round(10 + scale * 6),
      minHeight: isNarrow ? 50 : isWide ? 60 : 56,
      maxWidth: isWide ? 480 : undefined,
    };
  }, [width]);
}

/** Bottom padding: use ~60% of safe area to avoid excess space, min 6px for Android */
function getBottomPadding(inset: number) {
  if (inset > 0) return Math.round(inset * 0.6);
  return 6;
}

/**
 * Floating pill-style tab bar — responsive, compact bottom spacing.
 */
export function CustomTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const responsive = useTabBarResponsive();
  const bottomPadding = getBottomPadding(insets.bottom);

  return (
    <View style={[styles.outer]}>
      <View
        style={[
          styles.pill,
          Shadows.tabBar,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            marginHorizontal: responsive.horizontalMargin,
            marginBottom: responsive.bottomMargin,
            borderRadius: responsive.pillRadius,
            minHeight: responsive.minHeight,
            maxWidth: responsive.maxWidth,
            alignSelf: 'center',
            paddingBottom: 10,
          },
        ]}>
        <BottomTabBar {...props} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexShrink: 0,
    backgroundColor: 'transparent',
  },
  pill: {
    width: '100%',
    borderWidth: 1,
    overflow: 'hidden',
  },
});
