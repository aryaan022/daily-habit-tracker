/**
 * Local Storage Utilities
 * 
 * WHY: Centralized storage management with error handling and type safety
 * WHAT: Handles reading/writing data to localStorage with JSON serialization
 * 
 * NOTE: This will be replaced with Supabase database calls when backend is added
 */

import { STORAGE_KEYS } from '@/types';

export { STORAGE_KEYS };

// Generic storage functions with error handling
export const storage = {
  /**
   * Get data from localStorage with type safety
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  },

  /**
   * Set data to localStorage with error handling
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clear all app data from localStorage
   */
  clearAll(): boolean {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};