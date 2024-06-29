import { getInputFromClient } from "../utils/promptMessage";
import { MenuItem } from "../interface/menuItem";
import { MealType, RolloutItem } from "../interface/mealType";
import { ItemRepository } from "../repository/itemRepository";
import { RolledOutItem } from "../interface/rolledOutItem";

const itemRepository = new ItemRepository();
export class ChefClient {
  async handleChefFunctionalities(index: number): Promise<any> {
    const chefFunctions = [
      this.viewMenu,
      this.rolloutItems,
      this.viewUserRecommendedItems,
      this.finalizeMenu,
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

        itemsToRollout.push({ itemId, mealType });
      }
    }

    return itemsToRollout;
  }

  async viewUserRecommendedItems(): Promise<void> {
    return;
  }

  async viewFeedbackReport(): Promise<void> {
    console.log("View feedback report functionality not implemented yet.");
    return;
  }

  finalizeMenu = async (): Promise<
    | {
        breakfast: number;
        lunch: number;
        dinner: number;
      }
    | undefined
  > => {
    try {
      const rolledOutItems = await itemRepository.getRolledOutItemsForToday();
      console.table(rolledOutItems);

      const breakfastItemId = await this.validateItemSelection(
        "breakfast",
        rolledOutItems
      );
      const lunchItemId = await this.validateItemSelection(
        "lunch",
        rolledOutItems
      );
      const dinnerItemId = await this.validateItemSelection(
        "dinner",
        rolledOutItems
      );

      console.log("Menu finalized successfully.");
      return {
        breakfast: breakfastItemId,
        lunch: lunchItemId,
        dinner: dinnerItemId,
      };
    } catch (error) {
      console.error("Error finalizing menu:", error);
      throw error;
    }
  };

  validateItemSelection = async (
    mealType: MealType,
    rolledOutItems: RolledOutItem[]
  ): Promise<number> => {
    const mealTypeKey = mealType.toLowerCase();
    const rolledOutItemsIds = rolledOutItems
      .filter((item) => item.mealType.toLowerCase() === mealTypeKey) 
      .map((item) => item.id);

    while (true) {
      const input = await getInputFromClient(
        `Enter the item ID for ${mealType}: `
      );
      const itemId = parseInt(input, 10);


      if (!rolledOutItemsIds.includes(itemId)) {
        console.error(`Invalid ${mealType} item ID: ${itemId}`);
      } else {
        return itemId;
      }
    }
  };
}
