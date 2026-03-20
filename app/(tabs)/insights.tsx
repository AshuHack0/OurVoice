import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, Shadows, Spacing, Typography, TAB_BAR_HEIGHT } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, View } from 'react-native';

const CARD_RADIUS = 18;

const FEATURE_ICONS = [
  'calendar',
  'list.bullet.rectangle',
  'chart.line.uptrend.xyaxis',
  'person.2.fill',
  'bell.fill',
] as const;

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal,
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
          },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.header}>
          <ThemedText
            style={[
              styles.title,
              { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
            ]}>
            Insights
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Weekly summaries and participation overview
          </ThemedText>
        </ThemedView>

        <View
          style={[
            styles.chartCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}>
          <View style={styles.chartCardHeader}>
            <View style={[styles.chartIconWrap, { backgroundColor: theme.accentHover }]}>
              <IconSymbol name="chart.bar.fill" size={18} color={theme.tint} />
            </View>
            <View style={styles.chartHeaderMeta}>
              <ThemedText style={[styles.chartHeaderTitle, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>
                Participation
              </ThemedText>
              <View style={[styles.demoBadge, { backgroundColor: theme.border }]}>
                <ThemedText style={[styles.demoBadgeText, { color: theme.textSecondary }]}>
                  Sample data
                </ThemedText>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.barChart,
              { backgroundColor: colorScheme === 'dark' ? theme.cardGray : theme.background },
            ]}>
            {[65, 40, 80, 55, 90].map((pct, i) => (
              <View key={i} style={styles.barRow}>
                <ThemedText style={[styles.barLabel, { color: theme.textSecondary }]}>
                  Week {i + 1}
                </ThemedText>
                <View style={[styles.barTrack, { backgroundColor: theme.border }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: theme.tint,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.barPct, { color: theme.textSecondary }]}>{pct}%</ThemedText>
              </View>
            ))}
          </View>
          <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
            Your real participation trends will appear here
          </ThemedText>
        </View>

        <View
          style={[
            styles.comingSoonCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}>
          <View style={styles.comingSoonHeader}>
            <View style={[styles.chartIconWrap, { backgroundColor: theme.accentHover }]}>
              <IconSymbol name="sparkles" size={18} color={theme.tint} />
            </View>
            <ThemedText style={[styles.comingSoonTitle, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>
              Coming soon
            </ThemedText>
          </View>
          <ThemedText style={[styles.comingSoonSubtitle, { color: theme.textSecondary }]}>
            We're building more ways to see how your voice shapes the community.
          </ThemedText>
          <View style={styles.featureList}>
            {[
              'Weekly participation summaries',
              'Topic & question breakdown',
              'Trends over time (charts & export)',
              'Compare your views with community',
              'Insights digest (email or push)',
            ].map((label, i) => (
              <View key={i} style={[styles.featureRow, { borderColor: theme.border }]}>
                <View style={[styles.featureIconWrap, { backgroundColor: theme.accentHover }]}>
                  <IconSymbol
                    name={FEATURE_ICONS[i] as any}
                    size={16}
                    color={theme.tint}
                  />
                </View>
                <ThemedText style={[styles.featureLabel, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>{label}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {},
  header: {
    paddingTop: Spacing.headerTop,
    paddingBottom: Spacing.headerBottom,
    marginBottom: Spacing.flowSectionGap,
  },
  title: {
    ...Typography.headline,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.subtitle,
  },
  chartCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.cardBetween,
    ...Shadows.card,
  },
  chartCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  chartHeaderMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chartHeaderTitle: {
    ...Typography.bodyBold,
    fontSize: 17,
  },
  demoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  demoBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 11,
  },
  barChart: {
    borderRadius: 14,
    padding: Spacing.md,
    gap: Spacing.sm + 2,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: {
    ...Typography.caption,
    fontWeight: '500',
    width: 50,
  },
  barTrack: {
    flex: 1,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 11,
  },
  barPct: {
    ...Typography.caption,
    fontWeight: '600',
    width: 34,
    textAlign: 'right',
  },
  hint: {
    ...Typography.caption,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  comingSoonCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.card,
    ...Shadows.card,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  comingSoonTitle: {
    ...Typography.bodyBold,
    fontSize: 17,
  },
  comingSoonSubtitle: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: Spacing.md,
  },
  featureList: {
    gap: 0,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    ...Typography.paragraph,
    fontSize: 15,
    flex: 1,
  },
});
