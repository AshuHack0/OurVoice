import React from 'react';
import { View, StyleSheet, Pressable, Text, Linking, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BrandColors, Colors, FooterColors, Spacing, Typography } from '@/constants/theme';
import { OurVoiceBrand } from '@/components/our-voice-brand';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SIDEBAR_WIDTH = 240;

const MAIN_NAV = [
  { path: '/', href: '/(tabs)', label: 'Daily Question', icon: 'questionmark.circle.fill' as const },
  { path: '/community', href: '/(tabs)/community', label: 'Community', icon: 'bubble.left.and.bubble.right.fill' as const },
  { path: '/polls', href: '/(tabs)/polls', label: 'Polls', icon: 'chart.bar.fill' as const },
  { path: '/insights', href: '/(tabs)/insights', label: 'Insights', icon: 'chart.bar.fill' as const },
  { path: '/about', href: '/(tabs)/about', label: 'About', icon: 'info.circle.fill' as const },
];

const FOOTER_NAV = [
  { label: 'About OurVoice', href: '/(tabs)/about' },
  { label: 'Guidelines', href: '/(tabs)/about' },
  { label: 'Contact', action: 'mailto' as const },
  { label: 'Partners', href: '/(tabs)/about' },
];

/**
 * Desktop sidebar: full-width layout nav + Insights, About, Guidelines.
 */
export function SidebarNav() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname === path + '/' || (path === '/' && (pathname === '' || pathname === '/(tabs)'));

  return (
    <View
      style={[
        styles.sidebar,
        {
          width: SIDEBAR_WIDTH,
          backgroundColor: theme.surface,
          borderRightColor: theme.border,
          paddingTop: insets.top + Spacing.md,
          paddingBottom: insets.bottom + Spacing.md,
        },
      ]}>
      <View style={styles.brand}>
        <OurVoiceBrand variant="wordmark-only" size="header" align="left" />
      </View>
      <View style={styles.mainNav}>
        {MAIN_NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <Pressable
              key={item.href + item.label}
              onPress={() => item.href && router.push(item.href as any)}
              style={[
                styles.navItem,
                active && { backgroundColor: theme.accentHover },
              ]}>
              <IconSymbol
                name={item.icon}
                size={20}
                color={active ? theme.tint : theme.tabIconDefault}
              />
              <Text
                style={[
                  styles.navLabel,
                  { color: active ? theme.tint : (colorScheme === 'dark' ? theme.text : BrandColors.charcoal) },
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        {FOOTER_NAV.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => {
              if (item.action === 'mailto') Linking.openURL('mailto:contact@ourvoice.example.com');
              else if (item.href) router.push(item.href as any);
            }}
            style={styles.footerItem}>
            <Text style={[styles.footerLabel, { color: colorScheme === 'dark' ? theme.textSecondary : FooterColors.text }]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    borderRightWidth: 1,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
  },
  brand: {
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.xl,
  },
  mainNav: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    marginBottom: 2,
  },
  navLabel: {
    ...Typography.footerLink,
    fontSize: 15,
  },
  footer: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.card,
    borderTopWidth: 1,
  },
  footerItem: {
    paddingVertical: Spacing.xs,
  },
  footerLabel: {
    ...Typography.footerLink,
    fontSize: 13,
  },
});
