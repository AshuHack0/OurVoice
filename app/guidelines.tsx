import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CARD_RADIUS = 18;

const SECTION_ICONS: Record<number, string> = {
  1: 'hand.wave.fill',
  2: 'star.fill',
  3: 'checkmark.shield.fill',
  4: 'square.grid.2x2.fill',
  5: 'bubble.left.and.bubble.right.fill',
  6: 'heart.circle.fill',
  7: 'flag.fill',
  8: 'exclamationmark.bubble.fill',
};

export default function GuidelinesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const isDark = colorScheme === 'dark';
  const textColor = isDark ? theme.text : BrandColors.charcoal;
  const mutedColor = theme.textSecondary;

  const SectionCard = ({
    step,
    title,
    children,
  }: {
    step: number;
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.stepBadge, { backgroundColor: theme.accentHover }]}>
          <ThemedText style={[styles.stepNum, { color: theme.tint }]}>{step}</ThemedText>
        </View>
        <View style={[styles.iconWrap, { backgroundColor: theme.accentHover }]}>
          <IconSymbol name={(SECTION_ICONS[step] || 'doc.text.fill') as any} size={22} color={theme.tint} />
        </View>
      </View>
      <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{title}</ThemedText>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal,
            paddingTop: Spacing.md,
            paddingBottom: Spacing.xl * 2,
          },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}>

        <View style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.heroIconWrap, { backgroundColor: theme.accentHover }]}>
            <IconSymbol name="doc.text.fill" size={40} color={theme.tint} />
          </View>
          <ThemedText style={[styles.heroTitle, { color: textColor }]}>
            Community Guidelines
          </ThemedText>
          <ThemedText style={[styles.heroLead, { color: mutedColor }]}>
            User Terms, Safety & Community Handbook
          </ThemedText>
          <ThemedText style={[styles.heroIntro, { color: textColor }]}>
            Our shared standards for respectful, constructive civic participation.
          </ThemedText>
        </View>

        <SectionCard step={1} title="Welcome to OurVoice">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            OurVoice is a structured civic platform designed for respectful dialogue, shared reflection, and responsible participation.
            {'\n\n'}
            By using this platform, you agree to:
          </ThemedText>
          <BulletList items={['Treat all individuals and communities with dignity', 'Use the platform responsibly', 'Comply with the standards outlined below']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            OurVoice exists to strengthen civic culture through disciplined, solution-focused engagement.
          </ThemedText>
        </SectionCard>

        <SectionCard step={2} title="Core Community Values">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            All participation must align with the following principles:
          </ThemedText>
          <BulletList items={['Peace & Non-Violence', 'Respect for All Communities and Tribes', 'Civic Responsibility', 'Youth Protection & Empowerment', 'Constructive, Informed Expression']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Freedom of expression is protected. Harmful expression is not.
          </ThemedText>
        </SectionCard>

        <SectionCard step={3} title="User Conduct Standards">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Expected Conduct
          </ThemedText>
          <BulletList items={['Engage respectfully, even in disagreement', 'Critique ideas, not identities', 'Contribute constructively to discussions', 'Consider impact before posting']} color={textColor} theme={theme} />
          <ThemedText style={[styles.subsection, { color: textColor }]}>Prohibited Conduct</ThemedText>
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            The following is not permitted:
          </ThemedText>
          <BulletList items={['Hate speech or demeaning language', 'Tribal, ethnic, or regional targeting', 'Personal attacks or harassment', 'Incitement, threats, or advocacy of violence', 'Sexual or exploitative content', 'Content endangering minors or vulnerable individuals']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Violations may result in:
          </ThemedText>
          <BulletList items={['Content removal', 'Temporary suspension', 'Permanent removal from the platform']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Enforcement decisions are made to protect the integrity of the community.
          </ThemedText>
        </SectionCard>

        <SectionCard step={4} title="Platform Use Overview">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            OurVoice is designed to support structured civic participation through:
          </ThemedText>
          <BulletList items={['Guided Questions', 'Constructive Polls', 'Moderated Dialogue Spaces', 'Community Reflection Content']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Users are expected to engage in ways that strengthen dialogue rather than inflame division.
          </ThemedText>
        </SectionCard>

        <SectionCard step={5} title="Social Media & Content Conduct">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            When sharing or engaging with content:
          </ThemedText>
          <ThemedText style={[styles.subsection, { color: textColor }]}>Appropriate content:</ThemedText>
          <BulletList items={['Encourages reflection or learning', 'Focuses on solutions', 'Preserves dignity']} color={textColor} theme={theme} />
          <ThemedText style={[styles.subsection, { color: textColor }]}>Inappropriate content:</ThemedText>
          <BulletList items={['Targets individuals or tribes', 'Spreads rumors or inflammatory material', 'Uses graphic, exploitative, or degrading imagery', 'Encourages hostility or division']} color={textColor} theme={theme} />
        </SectionCard>

        <SectionCard step={6} title="Youth Protection & Responsible Representation">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Protection of minors is mandatory.
          </ThemedText>
          <BulletList items={['No sexualized content involving minors', 'No exploitation, manipulation, or coercion', 'No adult content directed toward under-age users']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Users are responsible for ensuring their content does not place young individuals at risk.
            {'\n\n'}
            All personal images and representations should reflect dignity and responsibility.
          </ThemedText>
        </SectionCard>

        <SectionCard step={7} title="Political Dialogue & Tribal Respect">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Political discussion is permitted.
            {'\n\n'}
            Tribal hostility is not.
            {'\n\n'}
            The following behaviors undermine civic stability and are prohibited:
          </ThemedText>
          <BulletList items={['Generalizing entire tribes or states', 'Sharing content that attacks communities', 'Amplifying narratives that encourage hostility']} color={textColor} theme={theme} />
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Individual actions do not define entire communities.
            {'\n\n'}
            OurVoice maintains a neutral, citizen-centered position and does not align with political parties or candidates.
          </ThemedText>
        </SectionCard>

        <SectionCard step={8} title="Engagement on Sensitive Issues">
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Discussions involving political, social, or regional tensions must remain solution-focused and respectful.
            {'\n\n'}
            Users are accountable for the tone and impact of their contributions.
            {'\n\n'}
            Participation that escalates hostility, spreads fear, or encourages collective targeting will be removed.
          </ThemedText>
        </SectionCard>

        <View style={[styles.finalBox, { backgroundColor: theme.surface, borderColor: theme.tint }]}>
          <View style={[styles.finalIconWrap, { backgroundColor: theme.accentHover }]}>
            <IconSymbol name="heart.fill" size={28} color={theme.tint} />
          </View>
          <ThemedText style={[styles.finalTitle, { color: textColor }]}>Final Statement</ThemedText>
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            OurVoice is a shared civic responsibility.
            {'\n'}
            Every contribution influences the national conversation.
            {'\n\n'}
            We uphold:
          </ThemedText>
          <BulletList items={['Peace over provocation', 'Responsibility over reaction', 'Unity over division']} color={textColor} theme={theme} />
          <ThemedText style={[styles.tagline, { color: theme.tint }]}>
            Our Voice. Our Responsibility. Together.
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

function BulletList({ items, color, theme }: { items: string[]; color: string; theme: (typeof Colors)['light'] }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={[styles.bulletDot, { backgroundColor: theme.tint }]} />
          <ThemedText style={[styles.bulletText, { color }]}>{item}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {},
  hero: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.flowSectionGap,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    alignItems: 'center',
    ...Shadows.card,
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    ...Typography.headline,
    fontSize: 26,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroLead: {
    ...Typography.subtitle,
    marginBottom: Spacing.sm,
    lineHeight: 22,
    textAlign: 'center',
  },
  heroIntro: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.cardBetween,
    ...Shadows.card,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: {
    ...Typography.overline,
    fontSize: 18,
    fontWeight: '700',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.sm,
    fontSize: 17,
  },
  subsection: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  body: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  bulletList: {
    marginBottom: Spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm + 2,
    marginBottom: Spacing.xs + 2,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
    flexShrink: 0,
  },
  bulletText: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
  finalBox: {
    borderWidth: 1.5,
    borderRadius: CARD_RADIUS,
    padding: Spacing.card + 4,
    marginTop: Spacing.md,
    alignItems: 'center',
    ...Shadows.card,
  },
  finalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  finalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.primaryButton,
    fontSize: 17,
    marginTop: Spacing.lg,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
