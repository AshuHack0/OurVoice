/**
 * API Service for OurVoice
 * Connects React Native app to the Node.js backend
 */

import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { getDeviceId } from '@/lib/deviceId';

// Determine base URL based on environment and platform
const getBaseURL = () => {
  // In development, use different URLs for iOS/Android/Web
  if (__DEV__) {
    return Platform.select({
      ios: 'https://our-voice-backend.vercel.app/api/v1',
      android: 'https://our-voice-backend.vercel.app/api/v1',
      web: 'https://our-voice-backend.vercel.app/api/v1',
      default: 'https://our-voice-backend.vercel.app/api/v1', // Fallback
    });
  }
  // Production URL - Vercel deployment
  return 'https://our-voice-backend.vercel.app/api/v1';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include device ID for one-vote-per-device
api.interceptors.request.use(
  async (config) => {
    try {
      const deviceId = await getDeviceId();
      config.headers['X-Device-ID'] = deviceId;
    } catch {
      // Ignore - backend will fall back to IP+User-Agent
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// QUESTIONS API
// ============================================================================

/**
 * Get today's daily questions (uses device timezone for USA/location-based "today")
 */
export const getDailyQuestions = async () => {
  const timezone =
    typeof Intl !== 'undefined' && Intl.DateTimeFormat?.().resolvedOptions?.()
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'America/New_York';
  const response = await api.get('/questions/daily', {
    headers: { 'X-Timezone': timezone },
  });
  return response.data;
};

/**
 * Get all questions with pagination
 */
export const getAllQuestions = async (page = 1, limit = 20) => {
  const response = await api.get(`/questions?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Get a single question by ID
 */
export const getQuestionById = async (questionId: string) => {
  const response = await api.get(`/questions/${questionId}`);
  return response.data;
};

/**
 * Create a new question (admin)
 */
export const createQuestion = async (data: {
  question: string;
  date?: string;
  order?: number;
  category?: string;
}) => {
  const response = await api.post('/questions', data);
  return response.data;
};

// ============================================================================
// RESPONSES API
// ============================================================================

/**
 * Get responses for a specific question
 */
export const getResponsesByQuestion = async (
  questionId: string,
  page = 1,
  limit = 50
) => {
  const response = await api.get(
    `/responses/${questionId}?page=${page}&limit=${limit}`
  );
  return response.data;
};

/**
 * Submit an anonymous response to a question
 */
export const submitResponse = async (questionId: string, text: string) => {
  const response = await api.post('/responses', {
    questionId,
    text,
  });
  return response.data;
};

/**
 * Get response count for a question
 */
export const getResponseCount = async (questionId: string) => {
  const response = await api.get(`/responses/${questionId}/count`);
  return response.data;
};

/**
 * Check if device has already responded to a question
 */
export const checkAlreadyResponded = async (questionId: string) => {
  const response = await api.get(`/responses/${questionId}/check`);
  return response.data;
};

/**
 * Flag a response for moderation
 */
export const flagResponse = async (responseId: string) => {
  const response = await api.post(`/responses/${responseId}/flag`);
  return response.data;
};

// ============================================================================
// POLLS API
// ============================================================================

/**
 * Get all active polls
 */
export const getPolls = async () => {
  const response = await api.get('/polls');
  return response.data;
};

/**
 * Get a single poll by ID
 */
export const getPollById = async (pollId: string) => {
  const response = await api.get(`/polls/${pollId}`);
  return response.data;
};

/**
 * Vote on a poll
 */
export const votePoll = async (pollId: string, optionId: string) => {
  const response = await api.post(`/polls/${pollId}/vote`, {
    optionId,
  });
  return response.data;
};

/**
 * Check if user has already voted on a poll
 */
export const checkVoted = async (pollId: string) => {
  const response = await api.get(`/polls/${pollId}/voted`);
  return response.data;
};

/**
 * Create a new poll (admin)
 */
export const createPoll = async (data: {
  question: string;
  options: Array<{ label: string }>;
  category?: string;
  optional?: boolean;
}) => {
  const response = await api.post('/polls', data);
  return response.data;
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check API health status
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Export the axios instance for custom requests
export default api;
