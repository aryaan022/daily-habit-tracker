/**
 * Today's Habits View Component
 * 
 * WHY: Central view for daily habit tracking and progress
 * WHAT: Displays today's habits grouped by time with completion stats
 * 
 * FEATURES:
 * - Daily progress overview
 * - Time-based habit grouping (morning, anytime, evening)
 * - Completion statistics
 * - Animated habit cards
 * - Empty state handling
 */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Target, TrendingUp } from "lucide-react";
import HabitCard from "./HabitCard";
import { cn } from "@/lib/utils";
import { getFormattedDate, getTodayString } from "@/utils/dateHelpers";
import type { Habit } from "@/types";

interface TodayViewProps {
  habits: Habit[];
  onToggleComplete: (id: string) => void;
  onDeleteHabit?: (id: string) => void;
}

export default function TodayView({ habits, onToggleComplete, onDeleteHabit }: TodayViewProps) {
  const completedCount = habits.filter(h => h.isCompleted).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);

  const today = getFormattedDate(getTodayString());

  const groupedHabits = {
    morning: habits.filter(h => h.timePreference === "morning"),
    anytime: habits.filter(h => h.timePreference === "anytime"),
    evening: habits.filter(h => h.timePreference === "evening"),
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {today}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-sm opacity-90">Progress</span>
              </div>
              <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
              <div className="text-sm opacity-75">{completionRate}%</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm opacity-90">Total Streaks</span>
              </div>
              <div className="text-2xl font-bold">{totalStreak}</div>
              <div className="text-sm opacity-75">days</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm opacity-90 mb-1">Status</div>
              <Badge 
                variant={completionRate === 100 ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  completionRate === 100 
                    ? "bg-success text-success-foreground" 
                    : "bg-primary-foreground/20 text-primary-foreground"
                )}
              >
                {completionRate === 100 ? "Complete!" : "In Progress"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Habits by Time */}
      {Object.entries(groupedHabits).map(([timeGroup, timeHabits]) => {
        if (timeHabits.length === 0) return null;
        
        return (
          <div key={timeGroup} className="space-y-3">
            <h3 className="text-lg font-semibold capitalize text-foreground flex items-center gap-2">
              {timeGroup} Habits
              <Badge variant="secondary" className="text-xs">
                {timeHabits.filter(h => h.isCompleted).length}/{timeHabits.length}
              </Badge>
            </h3>
            
            <div className="grid gap-3 animate-fade-in-up">
              {timeHabits.map((habit, index) => (
                <div 
                  key={habit.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-fade-in-up"
                >
                  <HabitCard
                    {...habit}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDeleteHabit}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {habits.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No habits yet</h3>
              <p className="text-sm">Add your first habit to get started on your journey!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}