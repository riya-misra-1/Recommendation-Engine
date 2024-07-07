import { MenuItem } from "../interface/menuItem";
import { ItemService } from "../services/itemService";

var itemService = new ItemService();

export class AdminController {
  async addMenuItem(
    menuItem: MenuItem
  ): Promise<{ success: boolean; message: string }> {
    return await itemService.addItem(menuItem);
  }

  async updateMenuItem(
    name: string,
    updates: { field: string; value: string | number }[]
  ): Promise<{ success: boolean; message: string }[]> {
    const messages = [];
    for (const update of updates) {
      const message = await itemService.updateItem(
        name,
        update.field,
        update.value
      );
      messages.push(message);
    }
    return messages;
  }

  async deleteMenuItem(
    name: string
  ): Promise<{ success: boolean; message: string }> {
    return await itemService.deleteItem(name);
  }

  async viewMenu(): Promise<{
    success: boolean;
    message: MenuItem[] | string;
  }> {
    return await itemService.viewMenu();
  }

  async executeAdminFunctionality(
    index: number,
    payload: any
  ): Promise<{ success: boolean; message: string | MenuItem[] }> {
    let result: { success: boolean; message: string | MenuItem[] };

    switch (index) {
      case 0:
        result = await this.addMenuItem(payload);
        break;
      case 1:
        const { name, updates } = payload;
        const updateResults = await this.updateMenuItem(name, updates);
        result = {
          success: true,
          message: updateResults.map((res) => res.message).join(", "),
        };
        break;
      case 2:
        const { name: deleteName } = payload;
        result = await this.deleteMenuItem(deleteName);
        break;
      case 3:
        result = await this.viewMenu();
        break;
      default:
        result = {
          success: false,
          message: "Invalid admin functionality index",
        };
    }
    return result;
  }
}
