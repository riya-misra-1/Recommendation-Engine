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
    const success = await itemService.rolloutMenuItems(itemsToRollout);
    if(success){
    return { success: true, message: "Menu rolled out successfully" };
    }else{
      return { success: false, message: "Error rolling out menu items" };
    }
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
    const receiverStatusCode = "1";
    const result = await notificationService.viewNotifications(receiverStatusCode);
        console.log("Notifications chef:", result.message);

    return {
      success: result.success,
      message: result.message,
    };
  }

  async discardMenuItem(
    name: string | number,
    action: string
  ): Promise<{ success: boolean; message: string }> {
    if (action === "remove") {
      await itemService.deleteItem(name.toString());
      return {
        success: true,
        message: `Menu item '${name}' has been removed successfully.`,
      };
    } else if (action === "feedback") {
      const itemId = typeof name === "string" ? parseInt(name) : name;
      const result = await itemService.notifyForDetailFeedback(itemId);
      return {
        success: result.success,
        message: result.message,
      };
    } else {
      return { success: false, message: "Invalid action" };
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
      case 5:
        return this.discardMenuItem(payload.name, payload.action);
      default:
        return Promise.resolve({
          success: false,
          message: "Invalid chef functionality index",
        });
    }
  }
}
