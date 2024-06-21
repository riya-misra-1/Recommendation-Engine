import { MenuItem } from "../interface/menuItem";
import { ItemRepository } from "../repository/itemRepository";

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async addItem(menuItem: MenuItem): Promise<string> {
    try {
      await this.itemRepository.addItem(menuItem);
      return "Menu item added successfully";
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  async viewMenu(): Promise<{ menu?: MenuItem[]; error?: string }> {
    try {
      const menu = await this.itemRepository.getMenuItems();
      if (menu.length > 0) {
        return { menu };
      } else {
        return { error: "No menu items found" };
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
      return { error: "Database error" };
    }
  }

  async updateItem(
    name: string,
    field: string,
    value: string | number
  ): Promise<string> {
    try {
      await this.itemRepository.updateItem(name, field, value);
      return `${field} updated successfully for item ${name}`;
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  async deleteItem(name: string): Promise<string> {
    try {
      await this.itemRepository.deleteItem(name);
      return "Menu item deleted successfully";
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }

  async showMenu(): Promise<MenuItem[]> {
    try {
      return await this.itemRepository.getMenuItems();
    } catch (error) {
      console.error("Error fetching menu items by category:", error);
      throw error;
    }
  }
}
