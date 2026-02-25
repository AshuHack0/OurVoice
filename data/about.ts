import type { AboutContent } from './types';

/** Temporary local data. Replace with MongoDB fetch later. */
const ABOUT: AboutContent = {
  paragraphs: [
    'OurVoice is a guided civic reflection platform designed to help communities express perspectives on social and civic issues through thoughtful questions and polls.',
    'The app provides a simple, anonymous space where people can reflect, share insights, and understand how others in their community are feeling — without the noise or pressure of traditional social media.',
    'All questions and polls are curated to encourage awareness, learning, and respectful participation around issues that affect everyday life and the social fabric of our communities.',
    'OurVoice supports civic understanding, community dialogue, and collective reflection — one question at a time.',
    "This initiative is part of the Time's Up civic awareness movement.",
  ],
};

export function getAboutContent(): AboutContent {
  return ABOUT;
}
