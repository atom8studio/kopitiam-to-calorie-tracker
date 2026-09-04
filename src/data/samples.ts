import { LocalizedWorkout } from "../types";

export interface SampleMealPreset {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  suggestedCalories: number;
}

export const SAMPLE_MEAL_PRESETS: SampleMealPreset[] = [
  {
    id: "nasi-lemak",
    name: "Nasi Lemak Special",
    subtitle: "Coconut rice, sambal, fried chicken & boiled egg",
    imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    suggestedCalories: 680,
  },
  {
    id: "roti-canai",
    name: "Roti Canai with Dhal",
    subtitle: "2 pieces fluffy Roti Canai with curry dhal",
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80",
    suggestedCalories: 520,
  },
  {
    id: "char-kway-teow",
    name: "Char Kway Teow",
    subtitle: "Wok-hei flat noodles with prawns & cockles",
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    suggestedCalories: 740,
  },
  {
    id: "teh-tarik",
    name: "Iced Teh Tarik Kaw",
    subtitle: "Frothy pulled milk tea (Extra manis!)",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    suggestedCalories: 230,
  },
  {
    id: "chicken-rice",
    name: "Hainanese Chicken Rice",
    subtitle: "Steamed chicken with fragrant oily rice",
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    suggestedCalories: 610,
  }
];

export const LOCALIZED_MALAYSIAN_WORKOUTS: LocalizedWorkout[] = [
  {
    title: "Climb Batu Caves Rainbow Stairs 4 Times",
    description: "Conquer all 272 steps up and down while dodging curious monkeys!",
    location: "Gombak, Selangor",
    caloriesPer30Min: 280,
    iconName: "Mountain",
    emoji: "🧗‍♂️",
  },
  {
    title: "Play Smash Badminton at Dewana Community Hall",
    description: "45 minutes of intense jump smashes and rallies with your kawan.",
    location: "Neighborhood Sports Complex",
    caloriesPer30Min: 260,
    iconName: "Activity",
    emoji: "🏸",
  },
  {
    title: "Swim Laps at Bukit Jalil National Aquatic Center",
    description: "Full-body workout swimming 20 laps in Olympic standard pool.",
    location: "Bukit Jalil, Kuala Lumpur",
    caloriesPer30Min: 240,
    iconName: "Waves",
    emoji: "🏊‍♂️",
  },
  {
    title: "Jog 3 Loops Around KLCC Park Greenery",
    description: "Pristine evening jog past the Petronas Twin Towers and fountain.",
    location: "KLCC Park, City Center",
    caloriesPer30Min: 250,
    iconName: "Footprints",
    emoji: "🏃‍♂️",
  },
  {
    title: "Cycle Around Putrajaya Botanical Lake",
    description: "Scenic 40-minute sunset bicycle ride across Seri Wawasan Bridge.",
    location: "Putrajaya Lake",
    caloriesPer30Min: 220,
    iconName: "Bike",
    emoji: "🚴‍♂️",
  },
  {
    title: "Hike Broga Hill Sunrise Trail",
    description: "Brisk uphill hike to Peak 1 & Peak 2 for fresh air and views.",
    location: "Semenyih, Selangor",
    caloriesPer30Min: 310,
    iconName: "Compass",
    emoji: "⛰️",
  },
  {
    title: "High-Energy Dikir Barat or Joget Dance Session",
    description: "Rhythmic Malaysian traditional folk dance workout with high beats.",
    location: "Cultural Dance Studio",
    caloriesPer30Min: 210,
    iconName: "Music",
    emoji: "💃",
  },
  {
    title: "Power Mall-Walking at Pavilion KL During Mega Sale",
    description: "1.5 hours of rapid walking across 7 floors carrying shopping bags!",
    location: "Bukit Bintang, KL",
    caloriesPer30Min: 150,
    iconName: "ShoppingBag",
    emoji: "🛍️",
  }
];

export const FUNNY_ANALYZING_MESSAGES: string[] = [
  "Sniffing out the sambal oil level...",
  "Counting the rice grains in your Nasi Lemak...",
  "Measuring Roti Canai crispiness vs fluffiness...",
  "Asking Kopitiam Uncle if Teh Tarik is Kurang Manis...",
  "Calculating how many Batu Caves stairs you need to climb...",
  "Detecting hidden ghee and fried chicken skin...",
  "Checking if got extra fried egg (Telur Mata) or not...",
  "Consulting Malaysian Fitness Guru..."
];
