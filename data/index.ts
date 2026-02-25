/**
 * Local data layer for OurVoice.
 * All section data lives here (code-level only). Replace with MongoDB/API later.
 */

export * from './types';
export { getDailyQuestion, getDailyQuestions } from './dailyQuestion';
export {
  getCommunityResponses,
  getResponsesForQuestion,
  getResponsesGroupedByQuestion,
  addCommunityResponse,
} from './communityResponses';
export { getPolls, getPollOptionPercent, hasVoted, votePoll } from './polls';
export { getAboutContent } from './about';
