/**
 * Shared types for OurVoice data.
 * Structure is kept compatible with future MongoDB/API responses.
 */

export type DailyQuestion = {
  id: string;
  question: string;
  date: string; // ISO date (e.g. day this set belongs to)
  order?: number; // 1-based order within the day
};

/** Multiple questions shown in one day; user answers one, then swipes to the next. */
export type DailyQuestionsDay = {
  date: string; // YYYY-MM-DD
  questions: DailyQuestion[];
};

/** Anonymous text response only. No replies, usernames, or profiles. Tied to a question by questionId. */
export type CommunityResponse = {
  id: string;
  questionId: string; // which daily question this response answers
  text: string; // anonymous response body
  timeAgo: string;
};

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Poll = {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'ended';
  optional?: boolean; // e.g. Poll 4 optional
};

export type AboutContent = {
  paragraphs: string[];
};
