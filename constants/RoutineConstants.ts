import { TaskCategory } from '@/services/DataManager';

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: '#FF6B6B',
  break: '#4ECDC4',
  exercise: '#45B7D1',
  learning: '#96CEB4',
  other: '#FFEEAD'
};

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
  work: '💼',
  break: '☕',
  exercise: '🏃',
  learning: '📚',
  other: '✨'
};

export const TIME_SLOTS = [
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'
];

export const ROUTINE_ICONS = ['☕️', '💻', '🍱', '👥', '📚', '🏃', '🧘', '🎯', '💡', '✨'];

export const AFFIRMATIONS = [
  "Small steps lead to big wins!",
  "You're making progress every day!",
  "Your focus is your superpower!",
  "Every moment is a fresh start!",
  "You've got this!",
  "Celebrate your progress!",
  "You're stronger than you think!",
  "Today is full of possibilities!",
  "You're doing great!",
  "Keep going, you're amazing!",
]; 