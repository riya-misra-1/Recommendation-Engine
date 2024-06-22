import { getInputFromClient } from "../utils/promptMessage";
import { MenuItem } from "../interface/menuItem";
import { MealType, RolloutItem } from "../interface/mealType";

export class ChefClient {
  private selectedItems: { [mealType: string]: number[] } = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };
  
  async handleChefFunctionalities(index: number): Promise<any> {
    const chefFunctions = [
      this.viewMenu,
      this.rolloutItems,
      this.recommendation,
      this.viewFeedbackReport,
    ];

    const selectedFunction = chefFunctions[index];
    if (selectedFunction) {
      return selectedFunction();
    } else {
      console.error("Invalid functionality index");
    }
  }

  async viewMenu() {
    return;
  }

  async rolloutItems(): Promise<RolloutItem[]> {
    const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];
    const itemsToRollout: RolloutItem[] = [];

    for (const mealType of mealTypes) {
      const count = parseInt(
        await getInputFromClient(`How many items for ${mealType}? `),
        10
      );

      for (let i = 0; i < count; i++) {
        const itemId = parseInt(
          await getInputFromClient(`Enter ID for ${mealType} item ${i + 1}: `),
          10
        );
        itemsToRollout.push({ itemId, mealType });
      }
    }

    return itemsToRollout;
  }

  async recommendation(): Promise<void> {
    console.log("Recommendation functionality not implemented yet.");
    return;
  }

  async viewFeedbackReport(): Promise<void> {
    console.log("View feedback report functionality not implemented yet.");
    return;
  }
}
