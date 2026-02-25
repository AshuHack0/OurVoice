import type { Poll, PollOption } from './types';

function percent(votes: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((votes / total) * 100);
}

/** All polls. User can vote once per poll; results shown immediately after voting. Replace with MongoDB later. */
const POLLS_DATA: Omit<Poll, 'totalVotes'>[] = [
  {
    id: '1',
    question: 'Do you feel your voice is heard in your community?',
    options: [
      { id: 'yes', label: 'Yes', votes: 42 },
      { id: 'no', label: 'No', votes: 28 },
      { id: 'unsure', label: 'Unsure', votes: 15 },
    ],
    status: 'active',
  },
  {
    id: '2',
    question: 'Should civic education be more accessible to everyone?',
    options: [
      { id: 'yes', label: 'Yes', votes: 68 },
      { id: 'no', label: 'No', votes: 12 },
      { id: 'unsure', label: 'Unsure', votes: 8 },
    ],
    status: 'active',
  },
  {
    id: '3',
    question: 'How connected do you feel to your community?',
    options: [
      { id: 'very', label: 'Very connected', votes: 35 },
      { id: 'somewhat', label: 'Somewhat connected', votes: 38 },
      { id: 'not', label: 'Not connected', votes: 22 },
    ],
    status: 'active',
  },
  {
    id: '4',
    question: 'Do you believe meaningful change starts with awareness?',
    options: [
      { id: 'yes', label: 'Yes', votes: 72 },
      { id: 'no', label: 'No', votes: 10 },
      { id: 'unsure', label: 'Unsure', votes: 5 },
    ],
    status: 'active',
    optional: true,
  },
];

/** In-memory poll state (code-level only; replace with MongoDB later). */
const polls: Poll[] = POLLS_DATA.map((p) => ({
  ...p,
  totalVotes: p.options.reduce((s, o) => s + o.votes, 0),
}));

/** Which poll ids the current user has voted in (one vote per poll). In production, key by user/session. */
const votedPollIds = new Set<string>();

export function getPolls(): Poll[] {
  return polls.map((p) => ({
    ...p,
    totalVotes: p.options.reduce((s, o) => s + o.votes, 0),
  }));
}

export function getPollOptionPercent(option: PollOption, total: number): number {
  return percent(option.votes, total);
}

export function hasVoted(pollId: string): boolean {
  return votedPollIds.has(pollId);
}

export function votePoll(pollId: string, optionId: string): boolean {
  if (votedPollIds.has(pollId)) return false;
  const poll = polls.find((p) => p.id === pollId);
  const opt = poll?.options.find((o) => o.id === optionId);
  if (opt) {
    opt.votes += 1;
    votedPollIds.add(pollId);
    return true;
  }
  return false;
}
