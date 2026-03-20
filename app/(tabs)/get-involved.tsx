import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import {
  BrandColors,
  ButtonColors,
  Colors,
  Shadows,
  Spacing,
  Typography,
  TAB_BAR_HEIGHT,
} from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, View, Pressable, Linking, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const COMMUNITY_FORM_URL = 'https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_FORM_ID';
const SUBMIT_INTEREST_URL = 'https://forms.office.com/Pages/ResponsePage.aspx?id=YOUR_INTEREST_FORM_ID';

const CARD_RADIUS = 18;

export default function GetInvolvedScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const insets = useSafeAreaInsets();

  const handleJoinCommunity = () => Linking.openURL(COMMUNITY_FORM_URL);
  const handleSubmitInterest = () => Linking.openURL(SUBMIT_INTEREST_URL);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Join OurVoice — a structured civic dialogue space for respectful, constructive participation.',
        url: 'https://ourvoice.example.com',
        title: 'OurVoice - Civic Dialogue',
      });
    } catch {
      // User cancelled or share failed
    }
  };

  const socialLinks: { icon: keyof typeof Ionicons.glyphMap; url: string }[] = [
    { icon: 'logo-twitter', url: 'https://twitter.com/intent/tweet?text=Check%20out%20OurVoice%20-%20a%20civic%20dialogue%20platform' },
    { icon: 'logo-facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=https://ourvoice.example.com' },
    { icon: 'logo-linkedin', url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://ourvoice.example.com' },
  ];

  const textColor = colorScheme === 'dark' ? theme.text : BrandColors.charcoal;
  const mutedColor = theme.textSecondary;

  const SectionCard = ({
    step,
    icon,
    title,
    children,
    primaryAction,
    secondaryActions,
  }: {
    step: number;
    icon: string;
    title: string;
    children: React.ReactNode;
    primaryAction?: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' };
    secondaryActions?: React.ReactNode;
  }) => (
    <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.stepBadge, { backgroundColor: theme.accentHover }]}>
          <ThemedText style={[styles.stepNum, { color: theme.tint }]}>{step}</ThemedText>
        </View>
        <View style={[styles.iconWrap, { backgroundColor: theme.accentHover }]}>
          <IconSymbol name={icon as any} size={22} color={theme.tint} />
        </View>
      </View>
      <ThemedText style={[styles.sectionTitle, { color: textColor }]}>{title}</ThemedText>
      {children}
      {primaryAction && (
        <Pressable
          onPress={primaryAction.onPress}
          style={({ pressed }) => [
            primaryAction.variant === 'primary' ? styles.primaryBtn : styles.secondaryBtn,
            { backgroundColor: primaryAction.variant === 'primary' ? ButtonColors.primaryYellow : theme.tint },
            pressed && styles.btnPressed,
          ]}>
          <ThemedText
            style={[
              styles.primaryBtnText,
              { color: primaryAction.variant === 'primary' ? BrandColors.charcoal : '#fff' },
            ]}>
            {primaryAction.label}
          </ThemedText>
        </Pressable>
      )}
      {secondaryActions}
    </View>
  );

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
        <View style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.heroIconWrap, { backgroundColor: theme.accentHover }]}>
            <IconSymbol name="hand.raised.fill" size={40} color={theme.tint} />
          </View>
          <ThemedText style={[styles.title, { color: textColor }]}>
            How to get involved
          </ThemedText>
          <ThemedText style={[styles.lead, { color: mutedColor }]}>
            Progress does not happen by accident. It happens when citizens choose to engage with intention.
          </ThemedText>
          <ThemedText style={[styles.intro, { color: textColor }]}>
            If you believe that we deserve a structured, respectful civic dialogue space — you can help build it.
          </ThemedText>
        </View>

        <SectionCard
          step={1}
          icon="person.3.fill"
          title="Join the OurVoice Community"
          primaryAction={{ label: 'Join OurVoice Community', onPress: handleJoinCommunity, variant: 'primary' }}>
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Become part of the Civic Circle. Receive participation updates. Stay informed on civic insights. Help shape the future.
          </ThemedText>
        </SectionCard>

        <SectionCard
          step={2}
          icon="megaphone.fill"
          title="Share / Amplify OurVoice"
          secondaryActions={
            <View style={styles.actions}>
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  { backgroundColor: theme.tint },
                  pressed && styles.btnPressed,
                ]}>
                <IconSymbol name="square.and.arrow.up" size={18} color="#fff" />
                <ThemedText style={styles.secondaryBtnText}>Share</ThemedText>
              </Pressable>
              <View style={[styles.socialRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
                {socialLinks.map(({ icon, url }) => (
                  <Pressable
                    key={icon}
                    onPress={() => Linking.openURL(url)}
                    style={({ pressed }) => [styles.socialIcon, pressed && { opacity: 0.7 }]}>
                    <Ionicons name={icon} size={22} color={theme.tint} />
                  </Pressable>
                ))}
              </View>
            </View>
          }>
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            If you value respectful civic dialogue, consider sharing OurVoice with individuals who value calm discussion, responsible participation, and constructive reflection.
          </ThemedText>
        </SectionCard>

        <SectionCard
          step={3}
          icon="pencil.and.list.clipboard"
          title="Civic Contributors / Community Organizers"
          primaryAction={{ label: 'Submit Interest', onPress: handleSubmitInterest, variant: 'secondary' }}>
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Ideas shape direction and change. We welcome thoughtful individuals who are interested in contributing educational, analytical, or reflective content aligned with our standards.
          </ThemedText>
          <ThemedText style={[styles.bullets, { color: mutedColor }]}>
            We are particularly open to contributors focused on: Youth civic education · Civic responsibility · Data & insights · National development perspectives
          </ThemedText>
        </SectionCard>

        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.stepBadge, { backgroundColor: theme.accentHover }]}>
              <ThemedText style={[styles.stepNum, { color: theme.tint }]}>4</ThemedText>
            </View>
            <View style={[styles.iconWrap, { backgroundColor: theme.accentHover }]}>
              <IconSymbol name="shield.checkered" size={22} color={theme.tint} />
            </View>
          </View>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>Uphold the Standard</ThemedText>
          <ThemedText style={[styles.body, { color: mutedColor }]}>
            Being involved also means protecting the culture of this space. We ask every participant to:
          </ThemedText>
          <ThemedText style={[styles.bullets, { color: mutedColor }]}>
            Engage respectfully · Avoid inflammatory language · Focus on solutions · Strengthen dialogue standards
          </ThemedText>
          <ThemedText style={[styles.body, { color: mutedColor, marginTop: Spacing.sm }]}>
            Culture is shaped by participation. This is a community space for citizens who want progress, not insults and noise. If you are here to build — you are welcome.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.screenBottom },
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
  title: {
    ...Typography.headline,
    fontSize: 26,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  lead: {
    ...Typography.subtitle,
    marginBottom: Spacing.sm,
    lineHeight: 22,
    textAlign: 'center',
  },
  intro: {
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
  body: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  bullets: {
    ...Typography.paragraph,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  primaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
  },
  secondaryBtnText: {
    ...Typography.primaryButton,
    color: '#fff',
    fontSize: 15,
  },
  primaryBtnText: {
    ...Typography.primaryButton,
  },
  btnPressed: { opacity: 0.9 },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  socialIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
