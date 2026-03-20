import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { BrandHeader } from '@/components/brand-header';
import { SplashScreen as OurVoiceSplash } from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

// Keep native splash visible until we're ready to show our custom splash
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    // Hide native splash and show our branded splash
    SplashScreen.hideAsync();
  }, []);

  if (!showApp) {
    return (
      <View style={{ flex: 1 }}>
        <OurVoiceSplash onFinish={() => setShowApp(true)} />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            header: () => <BrandHeader />,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="guidelines"
          options={{
            title: 'Community Guidelines',
            headerBackTitle: 'Back',
            headerStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].surface,
            },
            headerTintColor: Colors[colorScheme ?? 'light'].tint,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 17,
              color: Colors[colorScheme ?? 'light'].text,
            },
            headerShadowVisible: true,
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
