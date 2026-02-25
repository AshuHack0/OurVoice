import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, FooterColors, Shadows, Spacing, Typography, TAB_BAR_HEIGHT } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAboutContent } from '@/data';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, View, Pressable, Linking } from 'react-native';

const CARD_RADIUS = 18;

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const insets = useSafeAreaInsets();
  const { paragraphs } = getAboutContent();
  const lastIndex = paragraphs.length - 1;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText
            style={[styles.headerTitle, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>
            About
          </ThemedText>
          <ThemedText style={[styles.headerSub, { color: theme.textSecondary }]}>
            Our mission and how we work
          </ThemedText>
        </ThemedView>

        {paragraphs.map((paragraph, i) => {
          const isLast = i === lastIndex;
          return (
            <View
              key={i}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: isLast ? theme.tint : theme.border,
                },
              ]}>
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.cardIconWrap,
                    { backgroundColor: isLast ? theme.tint : theme.background },
                  ]}>
                  <IconSymbol
                    name="info.circle.fill"
                    size={20}
                    color={isLast ? '#fff' : theme.tint}
                  />
                </View>
                {isLast && (
                  <ThemedText style={[styles.cardLabel, { color: theme.tint }]}>
                    Time's Up
                  </ThemedText>
                )}
              </View>
              <ThemedText
                style={[
                  styles.paragraph,
                  { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
                  isLast && [styles.paragraphHighlight, { color: theme.tint }],
                ]}>
                {paragraph}
              </ThemedText>
            </View>
          );
        })}

        <View
          style={[
            styles.footer,
            {
              backgroundColor: colorScheme === 'dark' ? FooterColors.backgroundDark : FooterColors.backgroundLight,
            },
          ]}>
          <ThemedText style={[styles.footerItem, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
            About OurVoice
          </ThemedText>
          <ThemedText style={[styles.footerItem, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
            Community Guidelines
          </ThemedText>
          <Pressable onPress={() => Linking.openURL('mailto:contact@ourvoice.example.com')}>
            <ThemedText style={[styles.footerItem, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
              Contact
            </ThemedText>
          </Pressable>
          <ThemedText style={[styles.footerItem, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
            Partner Organizations
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: Spacing.screenBottom,
  },
  header: {
    paddingTop: Spacing.headerTop,
    paddingBottom: Spacing.headerBottom,
    marginBottom: Spacing.flowSectionGap,
  },
  headerTitle: { ...Typography.headline, marginBottom: Spacing.xs },
  headerSub: { ...Typography.subtitle },
  card: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.cardBetween,
    ...Shadows.card,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  cardLabel: {
    ...Typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paragraph: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 24,
  },
  paragraphHighlight: {
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.card,
    borderRadius: CARD_RADIUS,
  },
  footerItem: {
    ...Typography.footerLink,
    paddingVertical: Spacing.xs,
  },
});
