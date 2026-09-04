export interface MealAnalysis {
  id: string;
  timestamp: string; // ISO date string
  date: string; // YYYY-MM-DD
  isFood: boolean;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  funnyComment: string;
  workoutRecommendation: string;
  imageUrl: string; // Base64 or URL
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  meals: MealAnalysis[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface LocalizedWorkout {
  title: string;
  description: string;
  location: string;
  caloriesPer30Min: number;
  iconName: string;
  emoji: string;
}
