/**
 * Habits Management Hook
 * 
 * WHY: Centralized habit state management with persistence
 * WHAT: Handles CRUD operations for habits and completion tracking
 * 
 * FEATURES:
 * - Local storage persistence
 * - Real streak calculation based on completion history
 * - Date-based completion tracking
 * - Optimistic updates for better UX
 */

import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitCompletion, HabitFormData, STORAGE_KEYS } from '@/types';
import { storage } from '@/utils/storage';
import { getTodayString, calculateStreak } from '@/utils/dateHelpers';
import { useAuth } from '@/contexts/AuthContext';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedHabits = storage.get<Habit[]>(STORAGE_KEYS.HABITS) || [];
      const savedCompletions = storage.get<HabitCompletion[]>(STORAGE_KEYS.COMPLETIONS) || [];
      
      setHabits(savedHabits);
      setCompletions(savedCompletions);
    } else {
      setHabits([]);
      setCompletions([]);
    }
    setIsLoading(false);
  }, [user]);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    if (!isLoading && user) {
      storage.set(STORAGE_KEYS.HABITS, habits);
    }
  }, [habits, isLoading, user]);

  // Save completions to localStorage whenever completions change
  useEffect(() => {
    if (!isLoading && user) {
      storage.set(STORAGE_KEYS.COMPLETIONS, completions);
    }
  }, [completions, isLoading, user]);

  /**
   * Get completion record for a specific habit and date
   */
  const getCompletion = useCallback((habitId: string, date: string): HabitCompletion | null => {
    return completions.find(c => c.habitId === habitId && c.date === date) || null;
  }, [completions]);

  /**
   * Check if habit is completed today
   */
  const isHabitCompletedToday = useCallback((habitId: string): boolean => {
    const today = getTodayString();
    const completion = getCompletion(habitId, today);
    return completion?.completed || false;
  }, [getCompletion]);

  /**
   * Calculate streak for a specific habit
   */
  const getHabitStreak = useCallback((habitId: string): number => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId && c.completed)
      .map(c => c.date);
    
    return calculateStreak(habitCompletions);
  }, [completions]);

  /**
   * Get habits with today's completion status and current streaks
   */
  const getHabitsWithStatus = useCallback((): Habit[] => {
    return habits.map(habit => ({
      ...habit,
      isCompleted: isHabitCompletedToday(habit.id),
      streak: getHabitStreak(habit.id),
    }));
  }, [habits, isHabitCompletedToday, getHabitStreak]);

  /**
   * Add a new habit
   */
  const addHabit = useCallback((habitData: HabitFormData) => {
    const newHabit: Habit = {
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...habitData,
      streak: 0,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      userId: user?.id,
    };
    
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, [user]);

  /**
   * Delete a habit and all its completions
   */
  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => prev.filter(c => c.habitId !== habitId));
  }, []);

  /**
   * Update habit details
   */
  const updateHabit = useCallback((habitId: string, updates: Partial<HabitFormData>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  }, []);

  /**
   * Toggle habit completion for today
   */
  const toggleHabitCompletion = useCallback((habitId: string) => {
    const today = getTodayString();
    const existingCompletion = getCompletion(habitId, today);
    
    if (existingCompletion) {
      // Update existing completion
      setCompletions(prev => prev.map(completion =>
        completion.id === existingCompletion.id
          ? {
              ...completion,
              completed: !completion.completed,
              completedAt: !completion.completed ? new Date().toISOString() : undefined,
            }
          : completion
      ));
    } else {
      // Create new completion record
      const newCompletion: HabitCompletion = {
        id: `completion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        habitId,
        date: today,
        completed: true,
        completedAt: new Date().toISOString(),
        userId: user?.id,
      };
      
      setCompletions(prev => [...prev, newCompletion]);
    }
  }, [getCompletion, user]);

  /**
   * Get completion stats for a specific date
   */
  const getDayStats = useCallback((date: string) => {
    const dayCompletions = completions.filter(c => c.date === date);
    const completed = dayCompletions.filter(c => c.completed).length;
    const total = habits.length;
    
    return {
      date,
      completed,
      total,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [completions, habits.length]);

  return {
    // Data
    habits: getHabitsWithStatus(),
    completions,
    isLoading,
    
    // Actions
    addHabit,
    deleteHabit,
    updateHabit,
    toggleHabitCompletion,
    
    // Utilities
    getDayStats,
    getHabitStreak,
    isHabitCompletedToday,
  };
}