import React from 'react';
import { View, Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, Shadows } from '@/constants/theme';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  noPadding?: boolean;
};

/**
 * Elevated card with theme background, border, and optional press.
 */
export function Card({ children, onPress, style, noPadding }: CardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const cardStyle = [
    styles.card,
    { backgroundColor: theme.surface, borderColor: theme.border },
    Shadows.card,
    !noPadding && styles.padding,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        accessibilityRole="button">
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padding: {
    padding: Spacing.card,
  },
  pressed: { opacity: 0.96 },
});
