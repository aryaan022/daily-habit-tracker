import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  timePreference: "morning" | "evening" | "anytime";
  streak: number;
}

interface DayProgress {
  date: string;
  completed: number;
  total: number;
}

interface WeeklyCalendarProps {
  weekProgress: DayProgress[];
}

export default function WeeklyCalendar({ weekProgress }: WeeklyCalendarProps) {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const getWeekDates = (offset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (offset * 7));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeekOffset);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDayProgress = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return weekProgress.find(p => p.date === dateStr) || { date: dateStr, completed: 0, total: 0 };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    return date > today;
  };

  const getCompletionRate = (progress: DayProgress) => {
    return progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  };

  const getWeekTitle = () => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    if (currentWeekOffset === 0) return "This Week";
    if (currentWeekOffset === -1) return "Last Week";
    if (currentWeekOffset === 1) return "Next Week";
    
    return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Progress
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium min-w-[100px] text-center">
              {getWeekTitle()}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const progress = getDayProgress(date);
            const completionRate = getCompletionRate(progress);
            const today = isToday(date);
            const future = isFuture(date);
            
            return (
              <div
                key={index}
                className={cn(
                  "text-center p-3 rounded-lg border transition-all duration-200",
                  today && "ring-2 ring-primary bg-primary/5",
                  future && "opacity-50",
                  !future && completionRate === 100 && "bg-gradient-success border-success/20",
                  !future && completionRate > 0 && completionRate < 100 && "bg-accent/10 border-accent/20"
                )}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {dayNames[index]}
                </div>
                
                <div className={cn(
                  "text-lg font-semibold mb-2",
                  today && "text-primary",
                  !future && completionRate === 100 && "text-success"
                )}>
                  {date.getDate()}
                </div>
                
                {!future && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {progress.completed}/{progress.total}
                    </div>
                    
                    <Badge 
                      variant={completionRate === 100 ? "default" : "secondary"}
                      className={cn(
                        "text-xs px-1 py-0",
                        completionRate === 100 && "bg-success text-success-foreground",
                        completionRate > 0 && completionRate < 100 && "bg-accent text-accent-foreground"
                      )}
                    >
                      {completionRate}%
                    </Badge>
                  </div>
                )}
                
                {future && (
                  <div className="text-xs text-muted-foreground opacity-50">
                    Upcoming
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {weekProgress.every(day => day.total === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Add habits to see weekly progress</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}