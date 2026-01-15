
import { Badge } from './types';

// Color Palette based on requirements
export const COLORS = {
  primaryBlue: '#6ECFF6', // Soft Blue
  primaryYellow: '#FFD84D', // Bright Yellow
  primaryGreen: '#76C66E', // Warm Green
  accentOrange: '#FFA552', // Orange
  accentRed: '#FF6F6F', // Soft Red
  accentPurple: '#A98CE5', // Purple
  bgLight: '#F0F9FF', // Light sky blue background
  textDark: '#2D3748',
  correct: '#48BB78', // Bright green
  incorrect: '#FFA552', // Soft orange (never harsh red)
};

export const BADGES: Badge[] = [
  { id: 'math_star', name: 'Math Star', icon: '⭐', criteria: 'Answer 5 Math questions correctly', color: COLORS.primaryYellow },
  { id: 'reading_hero', name: 'Reading Hero', icon: '📚', criteria: 'Complete 5 English exercises', color: COLORS.primaryBlue },
  { id: 'life_legend', name: 'Life Skills Legend', icon: '🦁', criteria: 'Master a Life Skills session', color: COLORS.primaryGreen },
  { id: 'streak_master', name: 'On Fire!', icon: '🔥', criteria: 'Get a streak of 3', color: COLORS.accentOrange },
];

export const MASCOT_MESSAGES = {
  welcome: ["Sawubona , I'm La-Mila your friend.Ready to learn ?"],
  correct: ["Yebo! You got it!", "High five! That was awesome.", "You're shining like a star!", "Spot on!"],
  incorrect: ["Good effort! Try again — you’re getting closer.", "Almost! Let’s think about it together.", "No worries, mistakes help us learn!", "Try one more time, friend."],
  loading: ["Fetching some brain food...", "Thinking up a challenge...", "Just a sec..."],
};
