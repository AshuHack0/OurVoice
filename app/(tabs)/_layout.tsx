import React, { useState, useEffect } from 'react';
import { Keyboard, View, Platform } from 'react-native';
import { Tabs } from 'expo-router';

import { CustomTabBar } from '@/components/custom-tab-bar';
import { SidebarNav } from '@/components/sidebar-nav';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';

const ICON_SIZE = 24;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { isDesktop } = useResponsive();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const showSidebar = Platform.OS === 'web' && isDesktop;

  return (
    <View style={{ flex: 1, flexDirection: showSidebar ? 'row' : 'column' }}>
      {showSidebar && <SidebarNav />}
      <View style={{ flex: 1 }}>
        <Tabs
          tabBar={(props) =>
            keyboardVisible ? null : showSidebar ? null : <CustomTabBar {...props} />
          }
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.tint,
            tabBarInactiveTintColor: theme.tabIconDefault,
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              elevation: 0,
              shadowOpacity: 0,
              display: keyboardVisible ? 'none' : 'flex',
            },
            tabBarButton: HapticTab,
            tabBarLabelStyle: { ...Typography.footerLink, fontSize: 12 },
            tabBarItemStyle: { paddingVertical: 8 },
            tabBarShowLabel: true,
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Daily Question',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={ICON_SIZE} name="questionmark.circle.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="community"
            options={{
              title: 'Community',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={ICON_SIZE} name="bubble.left.and.bubble.right.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="polls"
            options={{
              title: 'Polls',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={ICON_SIZE} name="chart.bar.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="about"
            options={{
              title: 'About',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={ICON_SIZE} name="info.circle.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen name="explore" options={{ href: null }} />
          <Tabs.Screen
            name="insights"
            options={{
              title: 'Insights',
              href: showSidebar ? '/(tabs)/insights' : null,
              tabBarIcon: ({ color }) => (
                <IconSymbol size={ICON_SIZE} name="chart.bar.fill" color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
