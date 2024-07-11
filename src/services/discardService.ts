import { ItemRepository } from "../repository/itemRepository";
import { DiscardedItemRepository } from "../repository/discardItemRepositoyr";
import { ItemService } from "./itemService";

const discardRepository = new DiscardedItemRepository();
const itemService = new ItemService();
export class DiscardedItemService {
  async getAllDiscardedItems() {
    try {
      const discardedItems = await discardRepository.getAllDiscardedItems();
      return discardedItems;
    } catch (error) {
      console.error("Error in getAllDiscardedItems service:", error);
      throw error;
    }
  }
  async removeItem(payload: any, userId: number) {
    try {
      const success = await discardRepository.checkUserRemoveAction(userId);
      if (success) {
        const data = await itemService.deleteItem(payload);
        if (data.success === true) {
          return { success: true, message: data.message };
        } else {
          return { success: false, message: data.message };
        }
      } else {
        return {
          success: true,
          message:
            "You already deleted an item once in this month. Try again next month.",
        };
      }
    } catch (error) {
      console.error("Error removing item:", error);
      return {
        success: false,
        message: "An error occurred while trying to remove the item.",
      };
    }
  }
  async askForDetailFeedback(itemId: number, userId: number) {
    try {
      const success = await discardRepository.checkUserFeedbackAction(userId);
      console.log("Success:", success);
      if (success) {
        await discardRepository.insertFeedbackRequest(itemId);
        await discardRepository.addNotification(
          `Detailed feedback requested for item ${itemId}`,
          2,
          userId
        );
        return { success: true, message: "Feedback request sent successfully" };
      } else {
        return {
          success: true,
          message:
            "You have already requested feedback for an item this month. Try again next month.",
        };
      }
    } catch (error) {
      console.error("Error requesting feedback:", error);
      return {
        success: false,
        message: "An error occurred while trying to request feedback.",
      };
    }
  }
}
