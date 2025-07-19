/**
 * Individual Habit Card Component
 * 
 * WHY: Reusable habit display with completion toggle and visual feedback
 * WHAT: Shows habit name, time preference, streak, and completion status
 * 
 * FEATURES:
 * - Animated completion toggle
 * - Time-based icons and colors
 * - Streak display with fire icon
 * - Responsive design with hover effects
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Flame, Sun, Moon, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  name: string;
  timePreference: "morning" | "evening" | "anytime";
  streak: number;
  isCompleted: boolean;
  onToggleComplete: (id: string) => void;
  onDelete?: (id: string) => void; // Optional delete functionality
}

const timeIcons = {
  morning: Sun,
  evening: Moon,
  anytime: Clock,
};

const timeColors = {
  morning: "bg-habit-morning text-white",
  evening: "bg-habit-evening text-white", 
  anytime: "bg-habit-anytime text-white",
};

export default function HabitCard({
  id,
  name,
  timePreference,
  streak,
  isCompleted,
  onToggleComplete,
  onDelete,
}: HabitCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const TimeIcon = timeIcons[timePreference];

  const handleToggleComplete = () => {
    if (!isCompleted) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    onToggleComplete(id);
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-habit",
      isCompleted && "bg-gradient-success shadow-success border-success/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Badge className={cn("px-2 py-1", timeColors[timePreference])}>
              <TimeIcon className="w-3 h-3 mr-1" />
              {timePreference}
            </Badge>
            {streak > 0 && (
              <div className="flex items-center gap-1 text-accent animate-streak-pulse">
                <Flame className="w-4 h-4" />
                <span className="font-semibold text-sm">{streak}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
            
            <Button
              variant={isCompleted ? "default" : "outline"}
              size="sm"
              onClick={handleToggleComplete}
              className={cn(
                "h-8 w-8 p-0 transition-all duration-300",
                isCompleted && "bg-success hover:bg-success/90",
                isAnimating && "animate-habit-complete"
              )}
            >
              <Check className={cn(
                "w-4 h-4 transition-all duration-200",
                isCompleted ? "text-success-foreground" : "text-muted-foreground"
              )} />
            </Button>
          </div>
        </div>
        
        <h3 className={cn(
          "font-medium transition-colors duration-200",
          isCompleted ? "text-success-foreground" : "text-foreground"
        )}>
          {name}
        </h3>
      </CardContent>
    </Card>
  );
}