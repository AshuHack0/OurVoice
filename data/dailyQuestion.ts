import type { DailyQuestion, DailyQuestionsDay } from './types';

/** All questions — each day can show multiple (e.g. all, or a subset). Replace with MongoDB fetch later. */
const QUESTIONS: Omit<DailyQuestion, 'date'>[] = [
  { id: '1', question: 'What is the biggest issue affecting your community right now?', order: 1 },
  {
    id: '2',
    question: 'Do you feel people have a real voice in decisions that impact their daily lives?',
    order: 2,
  },
  { id: '3', question: 'What change would most improve trust within your community?', order: 3 },
  { id: '4', question: 'What does a healthy and united community look like to you?', order: 4 },
  {
    id: '5',
    question: 'Do you feel informed about issues that affect your rights and responsibilities?',
    order: 5,
  },
  {
    id: '6',
    question: 'What challenges do people in your community avoid talking about?',
    order: 6,
  },
  { id: '7', question: 'What gives you hope for positive change?', order: 7 },
];

/**
 * Returns today's set of daily questions. Multiple questions per day;
 * user answers one, submits, then swipes to the next.
 */
export function getDailyQuestions(): DailyQuestionsDay {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  const questions: DailyQuestion[] = QUESTIONS.map((q) => ({ ...q, date: dateStr }));
  return { date: dateStr, questions };
}

/** Single question (e.g. for backward compatibility). Returns first question of the day. */
export function getDailyQuestion(): DailyQuestion {
  const { questions } = getDailyQuestions();
  return questions[0] ?? { id: '1', question: 'What matters most to you in your community?', date: new Date().toISOString().slice(0, 10) };
}
