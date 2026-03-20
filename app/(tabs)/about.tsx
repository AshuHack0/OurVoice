import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, FooterColors, Shadows, Spacing, Typography, TAB_BAR_HEIGHT } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getAboutContent } from '@/data';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, View, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';

const CARD_RADIUS = 18;

const CARD_ICONS = [
  'bubble.left.and.text.bubble.right.fill',
  'eye.fill',
  'book.fill',
  'heart.fill',
  'clock.fill',
] as const;

const FOOTER_LINKS = [
  { label: 'About OurVoice', icon: 'info.circle.fill' as const, action: 'about' as const },
  { label: 'Community Guidelines', icon: 'doc.text.fill' as const, action: 'guidelines' as const },
  { label: 'Contact', icon: 'envelope.fill' as const, action: 'mailto' as const },
  { label: 'Get Involved', icon: 'hand.raised.fill' as const, action: 'get-involved' as const },
];

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { paragraphs } = getAboutContent();
  const lastIndex = paragraphs.length - 1;

  const handleFooterAction = (action: string) => {
    if (action === 'about') return;
    if (action === 'guidelines') router.push('/guidelines' as any);
    else if (action === 'mailto') Linking.openURL('mailto:contact@ourvoice.example.com');
    else if (action === 'get-involved') router.push('/(tabs)/get-involved' as any);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24 },
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
          const iconName = CARD_ICONS[i] ?? 'info.circle.fill';
          return (
            <View
              key={i}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: isLast ? theme.tint : theme.border,
                },
                isLast && styles.cardHighlight,
              ]}>
              <View style={styles.cardTop}>
                <View
                  style={[
                    styles.cardIconWrap,
                    { backgroundColor: isLast ? theme.tint : theme.accentHover },
                  ]}>
                  <IconSymbol
                    name={iconName as any}
                    size={20}
                    color={isLast ? '#fff' : theme.tint}
                  />
                </View>
                <View style={styles.cardTopMeta}>
                  {isLast ? (
                    <ThemedText style={[styles.cardLabel, { color: theme.tint }]}>
                      Time's Up
                    </ThemedText>
                  ) : (
                    <ThemedText style={[styles.cardStep, { color: theme.textSecondary }]}>
                      {i + 1} of {paragraphs.length}
                    </ThemedText>
                  )}
                </View>
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
              borderColor: theme.border,
            },
          ]}>
          {FOOTER_LINKS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => handleFooterAction(item.action)}
              style={({ pressed }) => [
                styles.footerRow,
                pressed && styles.footerRowPressed,
              ]}>
              <View style={[styles.footerIconWrap, { backgroundColor: theme.accentHover }]}>
                <IconSymbol name={item.icon as any} size={16} color={theme.tint} />
              </View>
              <ThemedText style={[styles.footerItemText, { color: colorScheme === 'dark' ? theme.text : FooterColors.text }]}>
                {item.label}
              </ThemedText>
              <IconSymbol name="chevron.right" size={12} color={theme.textSecondary} />
            </Pressable>
          ))}
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
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.cardBetween,
    ...Shadows.card,
  },
  cardHighlight: {
    borderWidth: 1.5,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
  },
  cardTopMeta: {
    flex: 1,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  cardStep: {
    ...Typography.caption,
    fontWeight: '600',
  },
  cardLabel: {
    ...Typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  paragraph: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 25,
  },
  paragraphHighlight: {
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  footerRowPressed: {
    opacity: 0.7,
  },
  footerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerItemText: {
    ...Typography.footerLink,
    flex: 1,
  },
});
