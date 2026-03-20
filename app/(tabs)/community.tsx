import { useState, useCallback, useMemo, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import { BrandColors, Colors, Shadows, Spacing, Typography, TAB_BAR_HEIGHT } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllQuestions, getResponsesByQuestion } from '@/services/api';
import type { CommunityResponse } from '@/data/types';
import type { DailyQuestion } from '@/data/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  StyleSheet,
  SectionList,
  View,
  Pressable,
  Platform,
  RefreshControl,
  type SectionListRenderItemInfo,
} from 'react-native';

type Section = {
  question: DailyQuestion;
  questionIndex: number;
  data: CommunityResponse[];
  totalCount: number;
  hasMore: boolean;
  remaining: number;
};

const INITIAL_VISIBLE_RESPONSES = 8;
const SHOW_MORE_STEP = 10;

export default function CommunityResponsesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide } = useResponsive();
  const insets = useSafeAreaInsets();
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [responsesMap, setResponsesMap] = useState<Record<string, CommunityResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingResponses, setLoadingResponses] = useState<Record<string, boolean>>({});
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [expandedCount, setExpandedCount] = useState<Record<string, number>>({});

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions(false);
  }, []);

  const fetchQuestions = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setResponsesMap({});
      } else {
        setLoading(true);
      }
      const response = await getAllQuestions(1, 50);
      const fetchedQuestions = response.data;
      setQuestions(fetchedQuestions);
      setCollapsedIds(new Set(fetchedQuestions.map((q: DailyQuestion) => q.id)));
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchQuestions(true);
  }, []);

  const fetchResponses = async (questionId: string) => {
    if (responsesMap[questionId] || loadingResponses[questionId]) return;
    
    try {
      setLoadingResponses((prev) => ({ ...prev, [questionId]: true }));
      const response = await getResponsesByQuestion(questionId, 1, 50);
      setResponsesMap((prev) => ({
        ...prev,
        [questionId]: response.data,
      }));
    } catch (err) {
      console.error('Error fetching responses:', err);
    } finally {
      setLoadingResponses((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  const sections = useMemo(() => {
    return questions.map((question, index) => {
      const responses = responsesMap[question.id] ?? [];
      const isCollapsed = collapsedIds.has(question.id);
      const visibleCount = expandedCount[question.id] ?? INITIAL_VISIBLE_RESPONSES;
      const visible = isCollapsed ? [] : responses.slice(0, visibleCount);
      const hasMore = responses.length > visibleCount;
      return {
        question,
        questionIndex: index + 1,
        data: visible,
        totalCount: responses.length,
        hasMore,
        remaining: responses.length - visibleCount,
      };
    });
  }, [questions, responsesMap, collapsedIds, expandedCount]);

  useFocusEffect(
    useCallback(() => {
      fetchQuestions(false);
    }, [])
  );

  const toggleCollapsed = useCallback((questionId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      const wasCollapsed = next.has(questionId);
      if (wasCollapsed) {
        next.delete(questionId);
        // Fetch responses when expanding
        fetchResponses(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }, [responsesMap, loadingResponses]);

  const showMore = useCallback((questionId: string) => {
    setExpandedCount((prev) => {
      const current = prev[questionId] ?? INITIAL_VISIBLE_RESPONSES;
      return { ...prev, [questionId]: current + SHOW_MORE_STEP };
    });
  }, []);

  const formatQuestionDate = useCallback((dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const qDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffDays = Math.round((today.getTime() - qDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  }, []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => {
      const { question, questionIndex, totalCount } = section;
      const isCollapsed = collapsedIds.has(question.id);
      const countLabel = totalCount === 0 ? 'No replies' : `${totalCount} repl${totalCount !== 1 ? 'ies' : 'y'}`;
      const dateLabel = question.date ? formatQuestionDate(question.date) : '';

      return (
        <Pressable
          onPress={() => toggleCollapsed(question.id)}
          style={({ pressed }) => [
            styles.threadStarterWrap,
            isCollapsed && styles.threadStarterCollapsed,
            {
              backgroundColor: pressed ? theme.accentHover : theme.cardGray,
              borderColor: theme.border,
            },
          ]}>
          <View style={styles.threadStarterTop}>
            <View style={[styles.threadStarterIconWrap, { backgroundColor: theme.tint }]}>
              <IconSymbol name="questionmark.circle.fill" size={18} color="#fff" />
            </View>
            <View style={styles.threadStarterMeta}>
              <View style={styles.threadStarterLabelRow}>
                <ThemedText style={[styles.threadStarterLabel, { color: theme.tint }]}>
                  Question {questionIndex}
                </ThemedText>
                {dateLabel !== '' && (
                  <View style={[styles.dateBadge, { backgroundColor: theme.background }]}>
                    <ThemedText style={[styles.dateBadgeText, { color: theme.textSecondary }]}>
                      {dateLabel}
                    </ThemedText>
                  </View>
                )}
              </View>
              <View style={styles.threadStarterCountRow}>
                <View style={[styles.replyCountChip, { backgroundColor: theme.background }]}>
                  <ThemedText style={[styles.replyCountChipText, { color: theme.textSecondary }]}>
                    {countLabel}
                  </ThemedText>
                </View>
                {isCollapsed && totalCount > 0 && (
                  <ThemedText style={[styles.tapHint, { color: theme.textSecondary }]}>
                    Tap to view
                  </ThemedText>
                )}
              </View>
            </View>
            <View style={[styles.chevronWrap, { backgroundColor: theme.background }]}>
              <IconSymbol
                name={isCollapsed ? 'chevron.right' : 'chevron.up'}
                size={12}
                color={theme.tint}
              />
            </View>
          </View>
          <ThemedText
            style={[styles.threadStarterText, isCollapsed && styles.threadStarterTextCollapsed]}
            numberOfLines={isCollapsed ? 2 : undefined}>
            {question.question}
          </ThemedText>
          {isCollapsed && (
            <ThemedText style={[styles.tapHintBottom, { color: theme.textSecondary }]}>
              {totalCount > 0 ? 'Tap to expand and read replies' : 'Tap to expand'}
            </ThemedText>
          )}
        </Pressable>
      );
    },
    [theme, collapsedIds, toggleCollapsed, formatQuestionDate]
  );

  const renderItem = useCallback(
    ({ item, index }: SectionListRenderItemInfo<CommunityResponse, Section>) => {
      return (
        <View style={[styles.chatRow, index === 0 && styles.chatRowFirst]}>
          <View style={[styles.chatAvatar, { backgroundColor: theme.border }]}>
            <IconSymbol name="person.fill" size={14} color={theme.textSecondary} />
          </View>
          <View style={[styles.chatBubble, { backgroundColor: theme.cardGray, borderColor: theme.border }]}>
            <ThemedText style={styles.chatBubbleText} selectable>
              {item.text}
            </ThemedText>
            <ThemedText style={[styles.chatBubbleTime, { color: theme.textSecondary }]}>
              {item.timeAgo}
            </ThemedText>
          </View>
        </View>
      );
    },
    [theme]
  );

  const renderSectionFooter = useCallback(
    ({ section }: { section: Section }) => {
      if (!section.hasMore || section.data.length === 0) return null;
      return (
        <Pressable
          onPress={() => showMore(section.question.id)}
          style={({ pressed }) => [
            styles.loadMoreWrap,
            pressed && { backgroundColor: theme.accentHover },
          ]}>
          <View style={[styles.loadMoreLine, { backgroundColor: theme.border }]} />
          <ThemedText style={[styles.loadMoreText, { color: theme.textSecondary }]}>
            Load {Math.min(SHOW_MORE_STEP, section.remaining)} more replies
          </ThemedText>
          <View style={[styles.loadMoreLine, { backgroundColor: theme.border }]} />
        </Pressable>
      );
    },
    [theme, showMore]
  );

  const keyExtractor = useCallback((item: CommunityResponse) => item.id, []);

  const listHeader = useMemo(
    () => (
      <ThemedView style={[styles.listHeader, { paddingHorizontal: 0 }]}>
        <ThemedText
          style={[
            styles.headerTitle,
            { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
          ]}>
          Community
        </ThemedText>
        <ThemedText style={[styles.headerSub, { color: theme.textSecondary }]}>
          All questions and anonymous replies
        </ThemedText>
      </ThemedView>
    ),
    [theme, colorScheme]
  );

  const listEmpty = useMemo(
    () => (
      <ThemedView style={styles.emptyWrap}>
        <View style={[styles.emptyIconWrap, { backgroundColor: theme.accentHover }]}>
          <IconSymbol name="bubble.left.and.bubble.right" size={44} color={theme.tint} />
        </View>
        <ThemedText style={[styles.emptyTitle, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>
          No responses yet
        </ThemedText>
        <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
          Share your thoughts on the Daily Question tab and come back to see what others are saying.
        </ThemedText>
      </ThemedView>
    ),
    [theme, colorScheme]
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
        <View
          style={[
            styles.listContent,
            { paddingHorizontal, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
            isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
          ]}>
          <ThemedView style={styles.listHeader}>
            <Skeleton width={100} height={24} style={{ marginBottom: Spacing.xs }} />
            <Skeleton width={260} height={16} />
          </ThemedView>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.threadStarterWrap,
                { backgroundColor: theme.cardGray, borderColor: theme.border },
              ]}>
              <View style={styles.threadStarterTop}>
                <Skeleton width={36} height={36} borderRadius={18} />
                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                  <Skeleton width={70} height={12} style={{ marginBottom: 4 }} />
                  <Skeleton width={90} height={10} />
                </View>
                <Skeleton width={28} height={28} borderRadius={14} />
              </View>
              <Skeleton width="100%" height={18} style={{ marginBottom: 4 }} />
              <Skeleton width="75%" height={16} />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        stickySectionHeadersEnabled
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
        }
      />
    </SafeAreaView>
  );
}

const BUBBLE_RADIUS = 18;
const AVATAR_SIZE = 32;

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
  list: { flex: 1 },
  listContent: {
    paddingBottom: Spacing.screenBottom,
  },
  listHeader: {
    paddingTop: Spacing.headerTop,
    paddingBottom: Spacing.headerBottom,
    marginBottom: Spacing.flowSectionGap,
  },
  headerTitle: { ...Typography.headline, marginBottom: Spacing.xs },
  headerSub: { ...Typography.subtitle },
  // Thread starter (question) — chat-style card
  threadStarterWrap: {
    borderWidth: 1,
    borderRadius: BUBBLE_RADIUS,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.card,
    marginTop: Spacing.cardBetween,
    marginBottom: Spacing.sm + 2,
    ...Shadows.card,
  },
  threadStarterCollapsed: {
    paddingVertical: Spacing.sm,
  },
  sectionHeaderPressed: { opacity: 0.92 },
  threadStarterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  threadStarterIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  threadStarterMeta: { flex: 1 },
  threadStarterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  threadStarterLabel: { ...Typography.overline, textTransform: 'uppercase', letterSpacing: 0.5 },
  dateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dateBadgeText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '500',
  },
  threadStarterCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  replyCountChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  replyCountChipText: { ...Typography.caption, fontWeight: '600' },
  tapHint: { ...Typography.caption, fontSize: 11 },
  tapHintBottom: { ...Typography.caption, fontSize: 11, marginTop: Spacing.xs },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadStarterText: { ...Typography.paragraph, fontWeight: '600' },
  threadStarterTextCollapsed: { marginBottom: 0 },
  // Chat message row: avatar + bubble
  chatRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  chatRowFirst: {
    marginTop: Spacing.xs,
  },
  chatAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBubble: {
    flex: 1,
    maxWidth: '88%',
    borderWidth: 1,
    borderRadius: BUBBLE_RADIUS,
    borderTopLeftRadius: 4,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md + 2,
  },
  chatBubbleText: { ...Typography.body, marginBottom: Spacing.xs, lineHeight: 23 },
  chatBubbleTime: { ...Typography.caption },
  // Load more replies (chat-style divider)
  loadMoreWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 2,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: 12,
  },
  loadMoreLine: {
    flex: 1,
    height: 1,
    maxWidth: 60,
  },
  loadMoreText: { ...Typography.footerLink },
  showMorePressed: { opacity: 0.8 },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 3,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.bodyBold,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  emptyText: { ...Typography.body, textAlign: 'center', lineHeight: 23, maxWidth: 300 },
});
