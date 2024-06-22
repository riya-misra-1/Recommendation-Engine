export type MealType = "breakfast" | "lunch" | "dinner";

export interface RolloutItem {
  itemId: number;
  mealType: MealType;
}
