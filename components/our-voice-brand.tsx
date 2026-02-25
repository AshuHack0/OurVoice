import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BrandColors, Colors, Typography } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

type OurVoiceBrandProps = {
  variant?: 'full' | 'wordmark-only' | 'compact';
  size?: 'splash' | 'header' | 'inline';
  /** When 'left', logo and tagline align left (e.g. header). Default 'center'. */
  align?: 'left' | 'center';
  /** Show the civic voice-bubble icon. Default true for full/header. */
  showIcon?: boolean;
};

const TAGLINE = 'Shaping Tomorrow. Together.';

// Clean sans-serif — use system on native; web can use Inter if loaded
const fontFamily = Platform.select({
  web: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  default: undefined,
});

/**
 * OurVoice branding: [OurVoice] + tagline + optional voice-bubble icon.
 * Logo: Charcoal, bold. Tagline: Charcoal, medium. Icon: civic blue.
 */
export function OurVoiceBrand({
  variant = 'full',
  size = 'inline',
  align = 'center',
  showIcon = variant !== 'wordmark-only',
}: OurVoiceBrandProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  // Charcoal per spec on light; use theme text in dark for readability
  const textColor = colorScheme === 'dark' ? theme.text : BrandColors.charcoal;
  const civicBlue = BrandColors.civicBlue;
  const isSplash = size === 'splash';

  const logoTypography =
    size === 'splash' ? Typography.logoSplash : size === 'header' ? Typography.logoHeader : Typography.logo;
  const taglineTypography =
    size === 'splash' ? Typography.taglineSplash : size === 'header' ? Typography.taglineHeader : Typography.tagline;

  const logoStyle = [
    logoTypography,
    { color: textColor },
    fontFamily && { fontFamily },
  ];

  const taglineStyle = [
    taglineTypography,
    { color: textColor },
    fontFamily && { fontFamily },
  ];

  const iconSize = size === 'splash' ? 28 : size === 'header' ? 20 : 18;
  const iconWrapSize = size === 'splash' ? 44 : size === 'header' ? 32 : 28;

  return (
    <View
      style={[
        styles.container,
        align === 'left' && styles.containerLeft,
        isSplash && styles.containerSplash,
      ]}>
      <View style={[styles.row, align === 'left' && styles.rowLeft]}>
        {showIcon && (
          <View
            style={[
              styles.iconWrap,
              { width: iconWrapSize, height: iconWrapSize, borderRadius: iconWrapSize / 2, backgroundColor: civicBlue },
            ]}>
            <IconSymbol
              name="bubble.left.and.bubble.right.fill"
              size={iconSize}
              color="#fff"
            />
          </View>
        )}
        <Text style={logoStyle} numberOfLines={1}>
          OurVoice
        </Text>
      </View>
      {variant === 'full' && (
        <Text
          style={[styles.tagline, taglineStyle]}
          numberOfLines={1}>
          {TAGLINE}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  containerSplash: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLeft: {
    alignSelf: 'flex-start',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tagline: {
    marginTop: 4,
  },
});
