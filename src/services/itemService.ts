import { RolloutItem } from "../interface/mealType";
import { MenuItem } from "../interface/menuItem";
import { Votes } from "../interface/votes";
import { ItemRepository } from "../repository/itemRepository";

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async addItem(
    menuItem: MenuItem
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.itemRepository.addItem(menuItem);
      return { success: true, message: "Menu item added successfully" };
    } catch (error) {
      return { success: false, message: "Error adding menu Item" };
    }
  }

  async viewMenu(): Promise<{
    success: boolean;
    message: MenuItem[] | string;
  }> {
    try {
      const menu = await this.itemRepository.getMenuItems();
      if (menu.length > 0) {
        // return { menu };
        return { success: true, message: menu };
      } else {
        // return { error: "No menu items found" };
        return { success: false, message: "No menu items found" };
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      return { success: false, message: "Error fetching menu:" };
    }
  }

  async updateItem(
    name: string,
    field: string,
    value: string | number
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.itemRepository.updateItem(name, field, value);
      // return `${field} updated successfully for item ${name}`;
      return {
        success: true,
        message: `${field} updated successfully for item ${name}`,
      };
    } catch (error) {
      console.error("Error updating menu item:", error);
      // throw error;
      return { success: false, message: "Error updating menu item" };
    }
  }

  async deleteItem(
    name: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.itemRepository.deleteItem(name);
      // return "Menu item deleted successfully";
      return { success: true, message: "Menu item deleted successfully" };
    } catch (error) {
      console.error("Error deleting menu item:", error);
      // throw error;
      return { success: false, message: "Error deleting menu item" };
    }
  }

  async showMenu(): Promise<{
    success: boolean;
    message: MenuItem[] | string;
  }> {
    try {
      // return await this.itemRepository.getMenuItems();
      const menuItems = await this.itemRepository.getMenuItems();
      return { success: true, message: menuItems };
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      // throw error;
      return {
        success: false,
        message: "Error fetching menu items by category",
      };
    }
  }
  async rolloutMenuItems(
    itemsToRollout: RolloutItem[]
  ): Promise<{ success: boolean; message: string | void }> {
    try {
      const rolledOutItem = await this.itemRepository.saveMenuRollout(
        itemsToRollout
      );
      return { success: true, message: rolledOutItem };
    } catch (error) {
      console.error("Error rolling out menu items:", error);
      // throw error;
      return { success: false, message: "Error rolling out menu items" };
    }
  }

  async saveVotes(
    userId: number,
    votes: Votes
  ): Promise<{ success: boolean; message: string }> {
    try {
      const existingVotes = await this.itemRepository.getUserVotes(userId);

      for (const itemId of Object.values(votes)) {
        if (existingVotes.some((vote) => vote.itemId === itemId)) {
          // return "User already voted for today.";
          return { success: false, message: "User already voted for today" };
        }
      }

      await this.itemRepository.saveVotes(userId, votes);
      // return "Votes saved successfully.";
      return { success: true, message: "Votes saved successfully" };
    } catch (error) {
      console.error("Error saving votes:", error);
      // throw error;
      return { success: false, message: "Error saving votes" };
    }
  }

  async getUserRecommendedItems(): Promise<{
    success: boolean;
    message: MenuItem[] | string;
  }> {
    try {
      const userRecommendation =
        await this.itemRepository.getUserRecommendedItems();
      return { success: true, message: userRecommendation };
    } catch (error) {
      console.error("Error fetching user recommended items:", error);
      // throw error;
      return {
        success: false,
        message: "Error fetching user recommended items",
      };
    }
  }

  async finalizeMenu(
    breakfast: number,
    lunch: number,
    dinner: number
  ): Promise<void> {
    const currentDate = new Date().toISOString().split("T")[0];
    await this.itemRepository.finalizeMenu(
      breakfast,
      lunch,
      dinner,
      currentDate
    );
  }
}
