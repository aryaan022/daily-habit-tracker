/**
 * Type definitions for the Habit Tracker application
 * 
 * WHY: TypeScript types provide compile-time safety and better IDE support
 * WHAT: Defines all data structures used across the application
 */

// Base habit structure
export interface Habit {
  id: string;
  name: string;
  timePreference: "morning" | "evening" | "anytime";
  streak: number;
  isCompleted: boolean;
  createdAt: string; // ISO date string
  userId?: string; // For future multi-user support
}

// Individual habit completion record
export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: string; // ISO timestamp when marked complete
  userId?: string;
}

// User authentication state
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// Auth context state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Daily progress summary
export interface DayProgress {
  date: string; // YYYY-MM-DD
  completed: number;
  total: number;
  completionRate: number;
}

// Weekly calendar data
export interface WeekData {
  startDate: string;
  endDate: string;
  days: DayProgress[];
}

// Habit form input
export interface HabitFormData {
  name: string;
  timePreference: "morning" | "evening" | "anytime";
}

// Local storage keys
export const STORAGE_KEYS = {
  HABITS: 'habit_tracker_habits',
  COMPLETIONS: 'habit_tracker_completions',
  USER: 'habit_tracker_user',
  AUTH_TOKEN: 'habit_tracker_auth_token',
} as const;