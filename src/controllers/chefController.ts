import { MenuItem } from "../interface/menuItem";
import { ItemService } from "../services/itemService";
import { NotificationService } from "../services/notificationService";
import { RolloutItem } from "../interface/mealType";

const itemService = new ItemService();
const notificationService = new NotificationService();

export class ChefController {
  async viewMenu(): Promise<{
    success: boolean;
    message: MenuItem[] | string;
  }> {
    return await itemService.showMenu();
  }

  async rolloutItems(
    itemsToRollout: RolloutItem[]
  ): Promise<{ success: boolean; message: string }> {
    await itemService.rolloutMenuItems(itemsToRollout);
    return { success: true, message: "Menu rolled out successfully" };
  }

  async viewUserRecommendedItems(): Promise<{
    success: boolean;
    message: MenuItem[] | string;
  }> {
    return await itemService.getUserRecommendedItems();
  }

  async finalizeMenu(
    breakfast: number,
    lunch: number,
    dinner: number
  ): Promise<{ success: boolean; message: string }> {
    await itemService.finalizeMenu(breakfast, lunch, dinner);
    return { success: true, message: "Menu finalized successfully" };
  }

  async viewNotifications(): Promise<{
    success: boolean;
    message: string | string[];
  }> {
    const response = await notificationService.getHistoricalNotifications();
    if (response.success) {
      const messages: string[] = Array.isArray(response.message)
        ? response.message
        : [response.message];
      return { success: true, message: messages };
    } else {
      return { success: false, message: ["Error fetching notifications"] };
    }
  }

  executeChefFunctionality(
    index: number,
    payload: any
  ): Promise<{ success: boolean; message: string | string[] | MenuItem[] }> {
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
        return Promise.resolve({
          success: false,
          message: "Invalid chef functionality index",
        });
    }
  }
}
