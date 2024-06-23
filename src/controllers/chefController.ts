import { ItemService } from "../services/itemService";
import { MenuItem } from "../interface/menuItem";
import { ItemRepository } from "../repository/itemRepository";
import { MealType, RolloutItem } from "../interface/mealType";
import { getInputFromClient } from "../utils/promptMessage";

const itemService = new ItemService();
const itemRepository = new ItemRepository();

export class ChefController {
  viewMenu(): Promise<MenuItem[]> {
    try {
      return itemService.showMenu();
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  }
  
  async rolloutItems(itemsToRollout: RolloutItem[]): Promise<string> {
    try {
      await itemService.rolloutMenuItems(itemsToRollout);
      return "Menu rolled out successfully";
    } catch (error) {
      console.error("Error rolling out menu items:", error);
      throw error;
    }
  }

  
  recommendation() {
    console.log("Recommendation functionality executed");
  }

  viewFeedbackReport() {
    console.log("View feedback report functionality executed");
  }

  executeChefFunctionality(index: number, payload: any) {
    switch (index) {
      case 0:
        return this.viewMenu();
      case 1:
        return this.rolloutItems(payload);
      case 2:
        this.recommendation();
        break;
      case 3:
        this.viewFeedbackReport();
        break;
      default:
        console.error("Invalid chef functionality index");
        return Promise.reject("Invalid chef functionality index");
    }
  }
}
