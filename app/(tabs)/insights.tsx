import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, Spacing, Typography, TAB_BAR_HEIGHT } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

/**
 * Insights — weekly summaries placeholder. Desktop: bar/pie charts; mobile: simplified.
 */
export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
      <ThemedView
        style={[
          styles.header,
          { paddingHorizontal, marginBottom: Spacing.flowSectionGap },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}>
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
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            marginHorizontal: paddingHorizontal,
            paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 24,
          },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}>
        <View style={styles.chartPlaceholder}>
          <View style={[styles.demoBadge, { backgroundColor: theme.border }]}>
            <ThemedText style={[styles.demoBadgeText, { color: theme.textSecondary }]}>
              Demo — sample data
            </ThemedText>
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
        </View>
        <ThemedText style={[styles.hint, { color: theme.textSecondary }]}>
          This chart shows sample data. Your real participation trends will appear here  
        </ThemedText>

        <View style={[styles.comingSoonDivider, { backgroundColor: theme.border }]} />
        <ThemedText style={[styles.comingSoonTitle, { color: theme.text }]}>
          Features coming soon
        </ThemedText>
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
              <IconSymbol
                name="checkmark.circle.fill"
                size={20}
                color={theme.tint}
                style={styles.featureIcon}
              />
              <ThemedText style={[styles.featureLabel, { color: theme.text }]}>{label}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.card,
    paddingTop: Spacing.headerTop,
    paddingBottom: Spacing.headerBottom,
  },
  title: {
    ...Typography.headline,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.subtitle,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.card,
    marginTop: Spacing.sm,
  },
  chartPlaceholder: {
    flex: 1,
    minHeight: 220,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  demoBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  barChart: {
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  barLabel: {
    ...Typography.caption,
    width: 48,
  },
  barTrack: {
    flex: 1,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  barPct: {
    ...Typography.caption,
    fontWeight: '600',
    width: 32,
    textAlign: 'right',
  },
  hint: {
    ...Typography.caption,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  comingSoonDivider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  comingSoonTitle: {
    ...Typography.headline,
    fontSize: 18,
    marginBottom: Spacing.xs,
  },
  comingSoonSubtitle: {
    ...Typography.paragraph,
    marginBottom: Spacing.md,
  },
  featureList: {
    gap: Spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  featureIcon: {
    marginRight: Spacing.sm,
  },
  featureLabel: {
    ...Typography.paragraph,
    flex: 1,
  },
});
