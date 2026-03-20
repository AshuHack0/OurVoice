import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useResponsive } from '@/hooks/use-responsive';
import {
  BrandColors,
  Colors,
  MIN_TOUCH_TARGET,
  Shadows,
  Spacing,
  Typography,
  TAB_BAR_HEIGHT,
} from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Skeleton } from '@/components/ui/skeleton';
import { getPolls as getPollsAPI, votePoll as votePollAPI, checkVoted } from '@/services/api';
import type { Poll } from '@/data/types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ScrollView, Pressable, View, Platform, ActivityIndicator, RefreshControl } from 'react-native';

const CARD_RADIUS = 18;

export default function PollsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { paddingHorizontal, maxContentWidth, isWide, isNarrow } = useResponsive();
  const insets = useSafeAreaInsets();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [voting, setVoting] = useState<Record<string, boolean>>({});
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  /** Desktop: selected option before submitting (fixed submit bar) */
  const [selectedForVote, setSelectedForVote] = useState<{ pollId: string; optionId: string } | null>(null);

  useEffect(() => {
    fetchPolls(false);
  }, []);

  const fetchPolls = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await getPollsAPI();
      const fetchedPolls = response.data;
      setPolls(fetchedPolls);
      
      // Check which polls user has voted on
      const votedSet = new Set<string>();
      for (const poll of fetchedPolls) {
        try {
          const votedResponse = await checkVoted(poll.id);
          if (votedResponse.data.hasVoted) {
            votedSet.add(poll.id);
          }
        } catch (err) {
          console.error('Error checking voted status:', err);
        }
      }
      setVotedIds(votedSet);
    } catch (err) {
      console.error('Error fetching polls:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    fetchPolls(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPolls(false);
    }, [])
  );

  const handleVote = useCallback(async (pollId: string, optionId: string) => {
    if (votedIds.has(pollId) || voting[pollId]) return;

    try {
      setVoting((prev) => ({ ...prev, [pollId]: true }));
      setSelectedForVote(null);
      const response = await votePollAPI(pollId, optionId);

      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId ? { ...poll, ...response.data } : poll
        )
      );
      setVotedIds((prev) => new Set(prev).add(pollId));
    } catch (err: any) {
      console.error('Error voting:', err);
      alert(err.response?.data?.error || 'Failed to submit vote. Please try again.');
    } finally {
      setVoting((prev) => ({ ...prev, [pollId]: false }));
    }
  }, [votedIds, voting]);

  const handleOptionSelect = useCallback((pollId: string, optionId: string) => {
    if (votedIds.has(pollId)) return;
    setSelectedForVote((prev) =>
      prev?.pollId === pollId && prev?.optionId === optionId ? null : { pollId, optionId }
    );
  }, [votedIds]);

  const getPollOptionPercent = (option: any, totalVotes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal },
            isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
          ]}
          showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.header}>
            <Skeleton width={80} height={24} style={{ marginBottom: Spacing.xs }} />
            <Skeleton width={220} height={16} />
          </ThemedView>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.pollCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}>
              <View style={styles.pollCardTop}>
                <Skeleton width={36} height={36} borderRadius={18} />
                <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                  <Skeleton width={60} height={12} style={{ marginBottom: 4 }} />
                  <Skeleton width={80} height={10} />
                </View>
              </View>
              <Skeleton width="100%" height={18} style={{ marginBottom: 6 }} />
              <Skeleton width="85%" height={18} style={{ marginBottom: Spacing.md }} />
              <Skeleton width="100%" height={48} borderRadius={14} style={{ marginBottom: Spacing.sm }} />
              <Skeleton width="100%" height={48} borderRadius={14} />
            </View>
          ))}
          <Skeleton width={280} height={14} style={{ marginTop: Spacing.sm }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal,
            paddingBottom:
              insets.bottom +
              TAB_BAR_HEIGHT +
              16 +
              (isWide && selectedForVote ? MIN_TOUCH_TARGET + 32 : 0),
          },
          isWide && { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
        }>
        <ThemedView style={[styles.header, { marginBottom: Spacing.flowSectionGap }]}>
          <ThemedText style={[styles.headerTitle, { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal }]}>
            Polls
          </ThemedText>
          <ThemedText style={[styles.headerSub, { color: theme.textSecondary }]}>
            One vote per poll. Results after you vote.
          </ThemedText>
        </ThemedView>

        {polls.map((poll) => {
          const userVoted = votedIds.has(poll.id);
          const voteLabel = poll.totalVotes === 0 ? 'No votes' : `${poll.totalVotes} vote${poll.totalVotes !== 1 ? 's' : ''}`;
          return (
            <View
              key={poll.id}
              style={[
                styles.pollCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}>
              <View style={styles.pollCardTop}>
                <View style={[styles.pollIconWrap, { backgroundColor: theme.tint }]}>
                  <IconSymbol name="chart.bar.fill" size={18} color="#fff" />
                </View>
                <View style={styles.pollMeta}>
                  <ThemedText style={[styles.pollBadge, { color: theme.tint }]}>
                    {poll.optional ? 'Optional' : 'Poll'}
                  </ThemedText>
                  <View style={[styles.voteCountChip, { backgroundColor: theme.background }]}>
                    <ThemedText style={[styles.voteCountChipText, { color: theme.textSecondary }]}>
                      {voteLabel}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <ThemedText style={styles.pollQuestion}>{poll.question}</ThemedText>

              {userVoted ? (
                <View style={styles.resultsBlock}>
                  <View style={[styles.votedBadge, { backgroundColor: theme.accentHover }]}>
                    <IconSymbol name="checkmark.circle.fill" size={14} color={theme.tint} />
                    <ThemedText style={[styles.votedBadgeText, { color: theme.tint }]}>
                      You voted
                    </ThemedText>
                  </View>
                  {poll.options.map((opt) => {
                    const pct = getPollOptionPercent(opt, poll.totalVotes);
                    return (
                      <View key={opt.id} style={styles.optionRow}>
                        <View style={styles.optionMeta}>
                          <ThemedText style={styles.optionLabel}>{opt.label}</ThemedText>
                          <ThemedText style={[styles.optionPercent, { color: theme.textSecondary }]}>
                            {pct}%
                          </ThemedText>
                        </View>
                        <View
                          style={[
                            styles.optionBarContainer,
                            { backgroundColor: theme.border },
                            isNarrow && styles.optionBarContainerNarrow,
                            isWide && styles.optionBarContainerWide,
                          ]}>
                          <View
                            style={[
                              styles.optionBarFill,
                              isNarrow && styles.optionBarFillNarrow,
                              isWide && styles.optionBarFillWide,
                              {
                                width: `${pct}%`,
                                backgroundColor: theme.tint,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.optionsList}>
                  {poll.options.map((opt) => {
                    const isSelected = isWide && selectedForVote?.pollId === poll.id && selectedForVote?.optionId === opt.id;
                    const onPress = isWide
                      ? () => handleOptionSelect(poll.id, opt.id)
                      : () => handleVote(poll.id, opt.id);
                    return (
                      <Pressable
                        key={opt.id}
                        onPress={onPress}
                        style={({ pressed }) => [
                          styles.optionButton,
                          {
                            borderColor: isSelected ? theme.tint : theme.border,
                            backgroundColor:
                              voting[poll.id]
                                ? theme.background
                                : isSelected
                                  ? theme.accentHover
                                  : pressed
                                    ? theme.accentHover
                                    : theme.background,
                          },
                          voting[poll.id] && styles.optionButtonDisabled,
                        ]}
                        disabled={voting[poll.id]}>
                        <ThemedText
                          style={[
                            styles.optionButtonLabel,
                            { color: colorScheme === 'dark' ? theme.text : BrandColors.charcoal },
                          ]}>
                          {opt.label}
                        </ThemedText>
                        {voting[poll.id] ? (
                          <ActivityIndicator size="small" color={theme.textSecondary} />
                        ) : isSelected && isWide ? (
                          <IconSymbol name="chevron.right" size={12} color={theme.tint} />
                        ) : (
                          <IconSymbol name="chevron.right" size={12} color={theme.textSecondary} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <ThemedText style={[styles.footerNote, { color: theme.textSecondary }]}>
          Your vote is anonymous. One vote per poll.
        </ThemedText>
      </ScrollView>

      {isWide && selectedForVote && (
        <View
          style={[
            styles.fixedSubmitBar,
            {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              paddingBottom: insets.bottom + Spacing.md,
            },
          ]}>
          <Pressable
            onPress={() =>
              selectedForVote && handleVote(selectedForVote.pollId, selectedForVote.optionId)
            }
            style={({ pressed }) => [
              styles.fixedSubmitButton,
              {
                backgroundColor: theme.tint,
                opacity: voting[selectedForVote.pollId] ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}
            disabled={voting[selectedForVote.pollId]}>
            {voting[selectedForVote.pollId] ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.fixedSubmitButtonText}>Submit vote</ThemedText>
            )}
          </Pressable>
        </View>
      )}
    </SafeAreaView>
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: Spacing.screenBottom,
  },
  fixedSubmitBar: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.card,
    paddingTop: Spacing.md,
    alignItems: 'center',
  },
  fixedSubmitButton: {
    minHeight: MIN_TOUCH_TARGET,
    paddingVertical: Spacing.md,
    paddingHorizontal: 32,
    borderRadius: 14,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedSubmitButtonText: {
    color: '#fff',
    ...Typography.primaryButton,
  },
  header: {
    paddingTop: Spacing.headerTop,
    paddingBottom: Spacing.headerBottom,
  },
  headerTitle: { ...Typography.headline, marginBottom: Spacing.xs },
  headerSub: { ...Typography.subtitle },
  pollCard: {
    borderWidth: 1,
    borderRadius: CARD_RADIUS,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.card,
    marginBottom: Spacing.cardBetween + 2,
    ...Shadows.card,
  },
  pollCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pollIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  pollMeta: { flex: 1 },
  pollBadge: { ...Typography.overline, textTransform: 'uppercase', letterSpacing: 0.5 },
  voteCountChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  voteCountChipText: { ...Typography.caption, fontWeight: '600' },
  pollQuestion: { ...Typography.paragraph, fontWeight: '600', marginBottom: Spacing.md, lineHeight: 25 },
  optionsList: { gap: Spacing.sm },
  votedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
    borderRadius: 10,
    marginBottom: Spacing.sm,
  },
  votedBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TOUCH_TARGET,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  optionButtonPressed: { opacity: 0.9 },
  optionButtonDisabled: { opacity: 0.5 },
  optionButtonLabel: { ...Typography.pollOption, flex: 1 },
  resultsBlock: { marginTop: Spacing.xs },
  optionRow: { marginBottom: Spacing.sm + 2 },
  optionBarContainer: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  optionBarContainerNarrow: {
    height: 6,
    borderRadius: 3,
  },
  optionBarContainerWide: {
    height: 16,
    borderRadius: 8,
  },
  optionBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 5,
  },
  optionBarFillNarrow: {
    borderRadius: 3,
  },
  optionBarFillWide: {
    borderRadius: 8,
  },
  optionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: { ...Typography.pollOption },
  optionPercent: { ...Typography.caption, fontWeight: '600' },
  footerNote: {
    ...Typography.caption,
    lineHeight: 18,
    marginTop: Spacing.sm,
    paddingBottom: Spacing.screenBottom,
  },
});
