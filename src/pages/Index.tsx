/**
 * Main Application Index Page
 * 
 * WHY: Central hub for habit tracking functionality
 * WHAT: Tabbed interface with today's view, calendar, and habit creation
 * 
 * ARCHITECTURE:
 * - Uses custom hooks for data management (useHabits)
 * - Integrates with auth context for user management
 * - Real data persistence via localStorage
 * - Optimistic UI updates for better user experience
 */

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Calendar, Plus } from "lucide-react";
import HabitForm from "@/components/HabitForm";
import TodayView from "@/components/TodayView";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import UserProfile from "@/components/UserProfile";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import { getWeekDates } from "@/utils/dateHelpers";

const Index = () => {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Custom hook for habit management with real persistence
  const {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    getDayStats,
    isLoading: habitsLoading,
  } = useHabits();

  // Generate week progress data from real habit completions
  const weekProgress = useMemo(() => {
    const weekDates = getWeekDates();
    return weekDates.map(date => getDayStats(date));
  }, [getDayStats]);

  // Handle adding new habit with toast notification
  const handleAddHabit = (habitData: { name: string; timePreference: "morning" | "evening" | "anytime" }) => {
    const newHabit = addHabit(habitData);
    toast({
      title: "Habit Added! 🎯",
      description: `"${habitData.name}" has been added to your ${habitData.timePreference} routine.`,
    });
  };

  // Handle completing habit with toast notification
  const handleToggleComplete = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    const wasCompleted = habit.isCompleted;
    toggleHabitCompletion(id);
    
    if (!wasCompleted) {
      toast({
        title: "Great job! 🔥", 
        description: `You completed "${habit.name}". Keep building that streak!`,
      });
    }
  };

  // Handle deleting habit with confirmation toast
  const handleDeleteHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    deleteHabit(id);
    toast({
      title: "Habit Removed",
      description: `"${habit.name}" has been deleted.`,
      variant: "destructive",
    });
  };

  // Show auth form if not authenticated
  if (!isAuthenticated && !isLoading) {
    return <AuthForm />;
  }

  // Show loading state
  if (isLoading || habitsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* User Profile */}
        <UserProfile />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Daily Habit Tracker
          </h1>
          <p className="text-muted-foreground">
            Build better habits, one day at a time
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Habit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <TodayView 
              habits={habits}
              onToggleComplete={handleToggleComplete}
              onDeleteHabit={handleDeleteHabit}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <WeeklyCalendar 
              weekProgress={weekProgress}
            />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <HabitForm onAddHabit={handleAddHabit} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
