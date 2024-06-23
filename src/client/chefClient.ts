import { getInputFromClient } from "../utils/promptMessage";
import { MenuItem } from "../interface/menuItem";
import { MealType, RolloutItem } from "../interface/mealType";

export class ChefClient {
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

        const existingItem = itemsToRollout.find(
          (item) => item.itemId === itemId
        );
        if (existingItem) {
          console.error(
            `Item with ID ${itemId} is already added for ${existingItem.mealType}.`
          );
          i--; 
          continue;
        }

        itemsToRollout.push({ itemId, mealType});
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
