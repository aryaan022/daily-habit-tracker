/**
 * Date Helper Utilities
 * 
 * WHY: Consistent date handling across the application
 * WHAT: Functions for date formatting, manipulation, and calculations
 */

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get date string in YYYY-MM-DD format from Date object
 */
export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get formatted date for display (e.g., "Monday, January 15, 2024")
 */
export const getFormattedDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get array of date strings for the past 7 days (including today)
 */
export const getWeekDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(getDateString(date));
  }
  
  return dates;
};

/**
 * Check if two date strings represent the same day
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

/**
 * Get day name from date string (e.g., "Mon", "Tue")
 */
export const getDayName = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Calculate consecutive days streak
 */
export const calculateStreak = (completions: string[]): number => {
  if (completions.length === 0) return 0;
  
  // Sort dates in descending order (newest first)
  const sortedDates = [...completions].sort((a, b) => b.localeCompare(a));
  const today = getTodayString();
  
  let streak = 0;
  let currentDate = today;
  
  // Check each day backwards from today
  for (let i = 0; i < sortedDates.length; i++) {
    if (sortedDates[i] === currentDate) {
      streak++;
      // Move to previous day
      const date = new Date(currentDate + 'T00:00:00');
      date.setDate(date.getDate() - 1);
      currentDate = getDateString(date);
    } else {
      break; // Streak broken
    }
  }
  
  return streak;
};