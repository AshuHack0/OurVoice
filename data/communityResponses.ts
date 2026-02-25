import type { CommunityResponse } from './types';

/** Temporary local data. Each response is tied to a question by questionId. Replace with MongoDB fetch later. */
const SEED_RESPONSES: CommunityResponse[] = [
  {
    id: '1',
    questionId: '1',
    text: "I'd like to see more green spaces and safer sidewalks so families can walk and bike without worry.",
    timeAgo: '2h ago',
  },
  {
    id: '2',
    questionId: '1',
    text: "Safety and housing are the two things I hear about most.",
    timeAgo: '5h ago',
  },
  {
    id: '3',
    questionId: '2',
    text: "Better public transit options would make a huge difference for people who don't drive.",
    timeAgo: '5h ago',
  },
  {
    id: '4',
    questionId: '3',
    text: 'Affordable childcare and after-school programs so parents can work and kids have a place to learn.',
    timeAgo: 'Yesterday',
  },
];

/** In-memory store (code-level only; replace with MongoDB later). */
let responses: CommunityResponse[] = [...SEED_RESPONSES];

export function getCommunityResponses(): CommunityResponse[] {
  return responses;
}

/** Get responses for a single question, or all grouped by questionId. */
export function getResponsesForQuestion(questionId: string): CommunityResponse[] {
  return responses.filter((r) => r.questionId === questionId);
}

/** Get all responses grouped by questionId. Useful for "question → responses" sections. */
export function getResponsesGroupedByQuestion(): Record<string, CommunityResponse[]> {
  const map: Record<string, CommunityResponse[]> = {};
  for (const r of responses) {
    if (!map[r.questionId]) map[r.questionId] = [];
    map[r.questionId].push(r);
  }
  return map;
}

export function addCommunityResponse(text: string, questionId: string): CommunityResponse {
  const newResponse: CommunityResponse = {
    id: `local-${Date.now()}`,
    questionId,
    text,
    timeAgo: 'Just now',
  };
  responses = [newResponse, ...responses];
  return newResponse;
}
