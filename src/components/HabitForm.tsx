/**
 * Habit Creation Form Component
 * 
 * WHY: Allows users to add new habits with validation
 * WHAT: Form with habit name and time preference selection
 * 
 * FEATURES:
 * - Form validation
 * - Time preference icons
 * - Loading state during submission
 * - Responsive design
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Sun, Moon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HabitFormData } from "@/types";

interface HabitFormProps {
  onAddHabit: (habit: HabitFormData) => void;
}

const timeOptions = [
  { value: "morning", label: "Morning", icon: Sun, color: "text-habit-morning" },
  { value: "evening", label: "Evening", icon: Moon, color: "text-habit-evening" },
  { value: "anytime", label: "Anytime", icon: Clock, color: "text-habit-anytime" },
] as const;

export default function HabitForm({ onAddHabit }: HabitFormProps) {
  const [name, setName] = useState("");
  const [timePreference, setTimePreference] = useState<"morning" | "evening" | "anytime">("morning");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    onAddHabit({
      name: name.trim(),
      timePreference,
    });
    
    setName("");
    setTimePreference("morning");
    setIsSubmitting(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Add New Habit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              type="text"
              placeholder="e.g., Drink water, Exercise, Read..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="transition-all duration-200 focus:shadow-habit"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-preference">Preferred Time</Label>
            <Select value={timePreference} onValueChange={(value: "morning" | "evening" | "anytime") => setTimePreference(value)}>
              <SelectTrigger className="transition-all duration-200 focus:shadow-habit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", option.color)} />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            disabled={!name.trim() || isSubmitting}
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200"
          >
            {isSubmitting ? "Adding..." : "Add Habit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}