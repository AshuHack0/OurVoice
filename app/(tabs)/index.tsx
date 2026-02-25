import { useState, useCallback, useEffect } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  BrandColors,
  ButtonColors,
  Colors,
  MIN_TOUCH_TARGET,
  OTHER_FIELD_MAX_LENGTH,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyQuestions as getDailyQuestionsAPI, submitResponse, checkAlreadyResponded } from '@/services/api';
import type { DailyQuestion } from '@/data/types';
import { useResponsive } from '@/hooks/use-responsive';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

const CARD_RADIUS = 18;

type CardState = { text: string; submitted: boolean };

export default function DailyQuestionScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { paddingHorizontal } = useResponsive();
  const [date, setDate] = useState('');
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<number, CardState>>({});
  const [showAppreciationModal, setShowAppreciationModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Offset so content sits above keyboard (stack header + brand header height)
  const keyboardVerticalOffset = Platform.OS === 'ios' ? insets.top + 56 : 0;

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions(false);
  }, []);

  const fetchQuestions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await getDailyQuestionsAPI();
      setDate(response.data.date);
      const fetchedQuestions = response.data.questions;
      setQuestions(fetchedQuestions);

      // Check which questions have already been answered
      const initialResponses: Record<number, CardState> = {};
      for (let i = 0; i < fetchedQuestions.length; i++) {
        try {
          const checkResponse = await checkAlreadyResponded(fetchedQuestions[i].id);
          if (checkResponse.data.hasResponded) {
            initialResponses[i] = { text: 'Already submitted', submitted: true };
          }
        } catch (err) {
          console.error('Error checking response status:', err);
        }
      }
      setResponses(initialResponses);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setError(err.response?.data?.error || 'Failed to load questions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchQuestions(true);
  }, []);

  const updateResponse = useCallback((index: number, text: string, submitted: boolean) => {
    const capped = text.length > OTHER_FIELD_MAX_LENGTH ? text.slice(0, OTHER_FIELD_MAX_LENGTH) : text;
    setResponses((prev) => ({ ...prev, [index]: { text: capped, submitted } }));
  }, []);

  const handleSubmit = useCallback(
    async (item: DailyQuestion, index: number) => {
      const state = responses[index];
      if (submitting || state?.submitted) return;
      const trimmed = (state?.text?.trim() ?? '').slice(0, OTHER_FIELD_MAX_LENGTH);

      try {
        setSubmitting(true);
        await submitResponse(item.id, trimmed || '(No additional comment)');
        updateResponse(index, state?.text ?? '', true);
        setShowAppreciationModal(true);
      } catch (err: any) {
        console.error('Error submitting response:', err);
        const errorMessage = err.response?.data?.error || 'Failed to submit response. Please try again.';
        alert(errorMessage);
        
        // If already responded, mark as submitted
        if (errorMessage.includes('already submitted')) {
          updateResponse(index, 'Already submitted', true);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [responses, updateResponse, submitting]
  );

  const dismissAppreciation = useCallback(() => {
    setShowAppreciationModal(false);
  }, []);

  const renderLoadingSkeleton = useCallback(
    () => (
      <View style={[styles.page, { width: '100%', paddingHorizontal }]}>
        <View style={styles.pageInner}>
          <View style={[styles.questionCard, { backgroundColor: theme.cardGray, borderColor: theme.border }]}>
            <View style={styles.questionCardTop}>
              <Skeleton width={36} height={36} borderRadius={18} />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Skeleton width={120} height={12} style={{ marginBottom: 4 }} />
                <Skeleton width={80} height={10} />
              </View>
            </View>
            <Skeleton width="100%" height={18} style={{ marginBottom: 6 }} />
            <Skeleton width="90%" height={18} />
          </View>
          <View style={[styles.responseCard, { backgroundColor: theme.cardGray, borderColor: theme.border }]}>
            <Skeleton width={100} height={12} style={{ marginBottom: Spacing.itemGap }} />
            <Skeleton width="100%" height={100} borderRadius={14} style={{ marginBottom: Spacing.sm }} />
            <Skeleton width={100} height={MIN_TOUCH_TARGET} borderRadius={14} />
          </View>
        </View>
      </View>
    ),
    [paddingHorizontal, theme]
  );

  const renderCard = useCallback(
    ({ item, index }: { item: DailyQuestion; index: number }) => {
      const state = responses[index] ?? { text: '', submitted: false };
      const submitted = state.submitted;

      const successGreen = theme.success;

      return (
        <View style={[styles.page, { width: '100%', paddingHorizontal }]}>
          <View style={styles.pageInner}>
            <View
              style={[
                styles.questionCard,
                {
                  backgroundColor: theme.cardGray,
                  borderColor: submitted ? successGreen : theme.border,
                  borderLeftWidth: submitted ? 4 : 1,
                },
              ]}>
              <View style={styles.questionCardTop}>
                <View
                  style={[
                    styles.questionIconWrap,
                    { backgroundColor: submitted ? successGreen : theme.tint },
                  ]}>
                  <IconSymbol
                    name={submitted ? 'checkmark.circle.fill' : 'questionmark.circle.fill'}
                    size={18}
                    color="#fff"
                  />
                </View>
                <ThemedText
                  style={[styles.questionLabel, { color: submitted ? successGreen : theme.tint }]}>
                  Question {index + 1} of {questions.length}
                  {submitted ? ' · Submitted' : ''}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.questionText,
                  { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
                ]}>
                {item.question}
              </ThemedText>
            </View>

            {submitted ? (
              <View
                style={[
                  styles.submittedResponseCard,
                  {
                    backgroundColor: theme.cardGray,
                    borderColor: successGreen,
                  },
                ]}>
                <View style={[styles.submittedResponseHeader, { backgroundColor: successGreen }]}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
                  <ThemedText style={styles.submittedResponseBadge}>Your response</ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.submittedResponseText,
                    { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
                  ]}
                  selectable>
                  {state.text}
                </ThemedText>
                <View style={[styles.submittedResponseFooter, { borderTopColor: theme.border }]}>
                  <View style={[styles.submittedPill, { backgroundColor: successGreen }]}>
                    <IconSymbol name="checkmark" size={12} color="#fff" />
                    <ThemedText style={styles.submittedPillText}>Submitted</ThemedText>
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.responseCard,
                  { backgroundColor: theme.cardGray, borderColor: theme.border },
                ]}>
                <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  Other (optional, max {OTHER_FIELD_MAX_LENGTH} characters)
                </ThemedText>
                <View style={[styles.inputCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <TextInput
                    style={[styles.input, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}
                    placeholder="Add your own answer..."
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    numberOfLines={3}
                    maxLength={OTHER_FIELD_MAX_LENGTH}
                    textAlignVertical="top"
                    value={state.text}
                    onChangeText={(t) => updateResponse(index, t, false)}
                    editable
                  />
                  <ThemedText style={[styles.charCount, { color: theme.textSecondary }]}>
                    {state.text.length}/{OTHER_FIELD_MAX_LENGTH}
                  </ThemedText>
                </View>
                <Pressable
                  onPress={() => handleSubmit(item, index)}
                  style={({ pressed }) => [
                    styles.submitButton,
                    {
                      backgroundColor:
                        pressed && !submitting ? theme.accentHover : ButtonColors.primaryBlue,
                    },
                    submitting && styles.submitButtonDisabled,
                  ]}
                  disabled={submitting}>
                  {({ pressed }) =>
                    submitting ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <ThemedText
                        style={[
                          styles.submitButtonText,
                          pressed && { color: ButtonColors.primaryBlue },
                        ]}>
                        Submit response
                      </ThemedText>
                    )
                  }
                </Pressable>
              </View>
            )}

            {submitted && index < questions.length - 1 && (
              <ThemedText style={[styles.swipeHint, { color: theme.textSecondary }]}>
                Scroll for next question ↓
              </ThemedText>
            )}
          </View>
        </View>
      );
    },
    [theme, colorScheme, questions.length, responses, updateResponse, handleSubmit, paddingHorizontal]
  );

  if (loading) {
    return (
      <View style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <SafeAreaView style={styles.safeArea} edges={[]}>
          <ThemedView style={[styles.header, { paddingHorizontal }]}>
            <Skeleton width={140} height={12} style={{ marginBottom: Spacing.xs }} />
            <Skeleton width={200} height={14} />
          </ThemedView>
          <View style={[styles.listContent, { flex: 1 }]}>
            {renderLoadingSkeleton()}
          </View>
          <ThemedText
            style={[
              styles.footerHint,
              {
                color: colorScheme === 'dark' ? theme.textSecondary : BrandColors.charcoal,
                paddingHorizontal,
                paddingBottom: insets.bottom + 16,
              },
            ]}>
            Responses are shared anonymously. Scroll to answer more questions.
          </ThemedText>
        </SafeAreaView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <SafeAreaView style={[styles.safeArea, styles.centerContainer]} edges={[]}>
          <ThemedText style={[styles.errorText, { color: theme.text }]}>{error}</ThemedText>
          <Pressable
            onPress={() => fetchQuestions(false)}
            style={[styles.retryButton, { backgroundColor: theme.tint }]}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  // No questions for today — beautiful empty state
  if (questions.length === 0) {
    const formattedDate = date
      ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
    return (
      <View style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <SafeAreaView style={[styles.safeArea, styles.centerContainer]} edges={[]}>
          <View
            style={[
              styles.emptyIconWrap,
              {
                backgroundColor: colorScheme === 'dark' ? 'rgba(123,163,199,0.15)' : 'rgba(30,58,95,0.08)',
              },
            ]}>
            <IconSymbol
              name="moon.stars.fill"
              size={56}
              color={theme.tint}
            />
          </View>
          <ThemedText
            style={[
              styles.emptyTitle,
              { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
            ]}>
            No questions today
          </ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            It’s {formattedDate} and there aren’t any new questions to answer right now. Take a moment
            to breathe — your voice will be back tomorrow.
          </ThemedText>
          <ThemedText style={[styles.emptyHint, { color: theme.textSecondary }]}>
            Check back later or pull down to refresh
          </ThemedText>
          <Pressable
            onPress={onRefresh}
            style={({ pressed }) => [
              styles.emptyRefreshButton,
              { backgroundColor: pressed ? theme.accentHover : ButtonColors.primaryBlue },
            ]}>
            {({ pressed }) => (
              <>
                <IconSymbol
                  name="arrow.clockwise"
                  size={18}
                  color={pressed ? ButtonColors.primaryBlue : '#fff'}
                />
                <ThemedText
                  style={[
                    styles.emptyRefreshButtonText,
                    pressed && { color: ButtonColors.primaryBlue },
                  ]}>
                  Refresh
                </ThemedText>
              </>
            )}
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <ThemedView style={[styles.header, { paddingHorizontal, marginBottom: Spacing.flowSectionGap }]}>
        <ThemedText style={[styles.headerLabel, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>
          Today’s questions
        </ThemedText>
        <ThemedText style={[styles.headerDate, { color: theme.textSecondary }]}>
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </ThemedText>
      </ThemedView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
        }>
        {questions.map((item, index) => (
          <View key={item.id}>{renderCard({ item, index })}</View>
        ))}
      </ScrollView>

      <ThemedText
        style={[
          styles.footerHint,
          {
            color: colorScheme === 'dark' ? theme.textSecondary : BrandColors.charcoal,
            paddingHorizontal,
            paddingBottom: insets.bottom + 16,
          },
        ]}>
        Responses are shared anonymously. Scroll to answer more questions.
      </ThemedText>

      <Modal
        visible={showAppreciationModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={dismissAppreciation}>
        <View style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissAppreciation} />
          <View style={styles.modalCenterWrap}>
            <View
              style={[
                styles.appreciationCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.success,
                },
              ]}>
              <View
                style={[
                  styles.appreciationIconWrap,
                  { backgroundColor: theme.success },
                ]}>
                <IconSymbol name="checkmark.circle.fill" size={52} color="#fff" />
              </View>
              <ThemedText style={styles.appreciationTitle}>Thank you!</ThemedText>
              <ThemedText style={[styles.appreciationSub, { color: theme.textSecondary }]}>
                Your response has been shared anonymously with the community. Your voice matters.
              </ThemedText>
              <Pressable
                onPress={dismissAppreciation}
                style={({ pressed }) => [
                  styles.appreciationButton,
                  {
                    backgroundColor: pressed ? theme.accentHover : theme.success,
                  },
                ]}>
                {({ pressed }) => (
                  <ThemedText
                    style={[
                      styles.appreciationButtonText,
                      pressed && { color: BrandColors.charcoal },
                    ]}>
                    Continue
                  </ThemedText>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: Spacing.sm,
  },
  retryButtonText: {
    color: '#fff',
    ...Typography.button,
  },
  emptyIconWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.headline,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.paragraph,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
    marginBottom: Spacing.xs,
  },
  emptyHint: {
    ...Typography.caption,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyRefreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  emptyRefreshButtonPressed: { opacity: 0.9 },
  emptyRefreshButtonText: { color: '#fff', ...Typography.primaryButton },
  header: {
    paddingTop: Spacing.headerTop,
    paddingBottom: Spacing.headerBottom,
  },
  headerLabel: {
    ...Typography.headline,
    marginBottom: Spacing.xs,
  },
  headerDate: { ...Typography.subtitle },
  scroll: { flex: 1 },
  listContent: { flexGrow: 1 },
  page: { paddingVertical: Spacing.cardBetween },
  pageInner: { paddingBottom: Spacing.sm },
  questionCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.cardBetween,
    ...Shadows.card,
  },
  questionCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  questionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  questionLabel: {
    ...Typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: { ...Typography.paragraph, fontWeight: '600' },
  responseCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.card,
    ...Shadows.card,
  },
  sectionTitle: {
    ...Typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.itemGap,
  },
  inputCard: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    minHeight: 100,
  },
  input: {
    ...Typography.body,
    minHeight: 84,
    padding: 0,
  },
  charCount: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    alignSelf: 'flex-end',
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MIN_TOUCH_TARGET,
  },
  submitButtonPressed: { opacity: 0.9 },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: '#fff', ...Typography.primaryButton },
  // Submitted state: single beautiful card
  submittedResponseCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    ...Shadows.card,
  },
  submittedResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.card,
  },
  submittedResponseBadge: {
    color: '#fff',
    ...Typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  submittedResponseText: {
    ...Typography.body,
    lineHeight: 22,
    paddingHorizontal: Spacing.card,
    paddingVertical: Spacing.md,
  },
  submittedResponseFooter: {
    borderTopWidth: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.card,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  submittedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 12,
  },
  submittedPillText: { color: '#fff', ...Typography.caption, fontWeight: '600' },
  swipeHint: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footerHint: {
    ...Typography.footerLink,
    lineHeight: 18,
    textAlign: 'center',
    paddingBottom: Spacing.screenBottom,
  },
  // Appreciation modal — centered overlay
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenterWrap: {
    width: '100%',
    maxWidth: 340,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appreciationCard: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    ...(Platform.OS === 'ios'
      ? {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 28,
        }
      : { elevation: 16 }),
  },
  appreciationIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  appreciationTitle: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginBottom: Spacing.sm,
  },
  appreciationSub: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: Spacing.sm,
  },
  appreciationButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 180,
    alignItems: 'center',
  },
  appreciationButtonPressed: { opacity: 0.9 },
  appreciationButtonText: { color: '#fff', ...Typography.secondaryButton },
});
