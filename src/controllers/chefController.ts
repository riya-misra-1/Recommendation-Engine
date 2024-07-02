import { ItemService } from "../services/itemService";
import { MenuItem } from "../interface/menuItem";
import { ItemRepository } from "../repository/itemRepository";
import { MealType, RolloutItem } from "../interface/mealType";
import { getInputFromClient } from "../utils/promptMessage";
import { NotificationService } from "../services/notificationService";

const itemService = new ItemService();
const notificationService = new NotificationService();

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

  async viewUserRecommendedItems(): Promise<MenuItem[]> {
    try {
      return await itemService.getUserRecommendedItems();
    } catch (error) {
      console.error("Error fetching user recommended items:", error);
      throw error;
    }
  }

  async finalizeMenu(
    breakfast: number,
    lunch: number,
    dinner: number
  ): Promise<string> {
    try {
      await itemService.finalizeMenu(breakfast, lunch, dinner);
      return "Menu finalized successfully";
    } catch (error) {
      console.error("Error finalizing menu:", error);
      throw error;
    }
  }

  async viewNotifications(): Promise<string[]> {
    try {
      const historicalNotifications =
        await notificationService.getHistoricalNotifications();
      return historicalNotifications;
    } catch (error) {
      console.error(
        "Error fetching notifications in EmployeeController:",
        error
      );
      throw error;
    }
  }
  executeChefFunctionality(index: number, payload: any) {
    switch (index) {
      case 0:
        return this.viewMenu();
      case 1:
        return this.rolloutItems(payload);
      case 2:
        return this.viewUserRecommendedItems();
      case 3:
        return this.finalizeMenu(
          payload.breakfast,
          payload.lunch,
          payload.dinner
        );
      case 4:
        return this.viewNotifications();
      default:
        console.error("Invalid chef functionality index");
        return Promise.reject("Invalid chef functionality index");
    }
  }
}
