import { ItemService } from "../services/itemService";
import { MenuItem } from "../interface/menuItem";
import { ItemRepository } from "../repository/itemRepository";

const itemService = new ItemService();
const itemRepository = new ItemRepository();

export class ChefController {
  viewMenuRollout(): Promise<MenuItem[]> {
    try {
      return itemService.showMenu();
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  }

  recommendation() {
    console.log("Recommendation functionality executed");
  }

  viewFeedbackReport() {
    console.log("View feedback report functionality executed");
  }
  // async saveMenuItemsToDatabase(
  //   mealType: string,
  //   items: MenuItem[]
  // ): Promise<string> {
  //   try {
  //     const result = await itemRepository.saveMenuItems(mealType, items);
  //     return result;
  //   } catch (error) {
  //     console.error("Error saving menu items:", error);
  //     throw error;
  //   }
  // }
  executeChefFunctionality(index: number) {
    switch (index) {
      case 0:
        return this.viewMenuRollout();

      case 1:
        this.recommendation();
        break;
      case 2:
        this.viewFeedbackReport();
        break;
      default:
        console.error("Invalid chef functionality index");
        return Promise.reject("Invalid chef functionality index");
    }
  }
}
