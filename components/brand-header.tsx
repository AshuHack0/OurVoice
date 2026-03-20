import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Linking,
  useWindowDimensions,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, FooterColors, Shadows, Typography } from '@/constants/theme';
import { OurVoiceBrand } from '@/components/our-voice-brand';
import { IconSymbol } from '@/components/ui/icon-symbol';

const DRAWER_WIDTH_PERCENT = 0.82;

const MENU_ITEMS = [
  { label: 'About OurVoice', onPress: 'about' as const },
  { label: 'Community Guidelines', onPress: 'guidelines' as const },
  { label: 'Contact', onPress: 'mailto' as const },
  { label: 'Get Involved', onPress: 'get-involved' as const },
];

/**
 * Top header bar with OurVoice branding + drawer menu (slides in from right).
 */
export function BrandHeader() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { paddingHorizontal } = useResponsive();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const drawerWidth = Math.min(screenWidth * DRAWER_WIDTH_PERCENT, 320);
  const translateX = useSharedValue(drawerWidth);
  const backdropOpacity = useSharedValue(0);

  const openDrawer = () => {
    setMenuOpen(true);
    translateX.value = withTiming(0, { duration: 180 });
    backdropOpacity.value = withTiming(1, { duration: 160 });
  };

  const closeDrawer = () => {
    translateX.value = withTiming(
      drawerWidth,
      { duration: 160 },
      (finished) => {
        if (finished) runOnJS(setMenuOpen)(false);
      }
    );
    backdropOpacity.value = withTiming(0, { duration: 140 });
  };

  const handleMenuAction = (item: (typeof MENU_ITEMS)[0]) => {
    if (item.onPress === 'about') {
      router.push('/(tabs)/about');
    } else if (item.onPress === 'get-involved') {
      router.push('/(tabs)/get-involved');
    } else if (item.onPress === 'guidelines') {
      router.push('/guidelines');
    } else if (item.onPress === 'mailto') {
      Linking.openURL('mailto:contact@ourvoice.example.com');
    }
    closeDrawer();
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: backdropOpacity.value > 0 ? 'auto' : 'none',
  }));

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.wrapper,
        Shadows.header,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
          paddingTop: insets.top,
        },
      ]}>
      <View style={[styles.inner, { paddingHorizontal }]}>
        <OurVoiceBrand variant="full" size="header" align="left" />
        <Pressable onPress={() => (menuOpen ? closeDrawer() : openDrawer())} style={styles.hamburger} hitSlop={12}>
          <IconSymbol
            name={menuOpen ? 'xmark' : 'line.3.horizontal'}
            size={24}
            color={colorScheme === 'dark' ? theme.text : BrandColors.charcoal}
          />
        </Pressable>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDrawer}>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.backdrop, backdropStyle]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
          </Animated.View>
          <Animated.View
            style={[
              styles.drawer,
              {
                width: drawerWidth,
                backgroundColor: colorScheme === 'dark' ? FooterColors.backgroundDark : FooterColors.backgroundLight,
                paddingTop: insets.top + 16,
              },
              drawerStyle,
            ]}>
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
                Menu
              </Text>
              <Pressable onPress={closeDrawer} style={styles.closeArea} hitSlop={12}>
                <IconSymbol
                  name="xmark"
                  size={22}
                  color={colorScheme === 'dark' ? theme.text : FooterColors.text}
                />
              </Pressable>
            </View>
            <View style={styles.menuList}>
              {MENU_ITEMS.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => handleMenuAction(item)}
                  style={({ pressed }) => [
                    styles.menuItem,
                    {
                      backgroundColor: pressed
                        ? colorScheme === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.05)'
                        : 'transparent',
                    },
                  ]}>
                  <Text style={[styles.menuItemText, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
                    {item.label}
                  </Text>
                  <IconSymbol
                    name="chevron.right"
                    size={16}
                    color={colorScheme === 'dark' ? theme.textSecondary : BrandColors.charcoal}
                  />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  hamburger: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 32,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(0,0,0,0.1)',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: -2, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }
      : { elevation: 24 }),
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  drawerTitle: {
    ...Typography.headline,
    fontSize: 20,
  },
  closeArea: {
    padding: 6,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuItemText: {
    ...Typography.footerLink,
    fontSize: 15,
  },
});
