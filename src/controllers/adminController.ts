import pool from "../db-connection";
import { MenuItem } from "../interface/menuItem";
import { ItemService } from "../services/itemService";

var itemService = new ItemService()
export class AdminController {
  async addMenuItem(menuItem: MenuItem) {
    try {
      const message: string = await itemService.addItem(menuItem);
      return message;
    } catch (error) {
      throw error;
    }
  }

  async updateMenuItem(
    name: string,
    updates: { field: string; value: string | number }[]
  ) {
    try {
      const messages = [];
      for (const update of updates) {
        const message: string = await itemService.updateItem(
          name,
          update.field,
          update.value
        );
        messages.push(message);
      }
      return messages.join(", ");
    } catch (error) {
      throw error;
    }
  }

  async deleteMenuItem(name: string) {
    try {
      const message: string = await itemService.deleteItem(name);
      return message;
    } catch (error) {
      throw error;
    }
  }

  async viewMenu() {
    try {
      const menu = await itemService.viewMenu();
      return menu;
    } catch (error) {
      throw error;
    }
  }

  async executeAdminFunctionality(index: number, payload: any) {
    let result;
    switch (index) {
      case 0:
        result = await this.addMenuItem(payload);
        break;
      case 1:
        const { name, updates } = payload;
        result = await this.updateMenuItem(name, updates);
        break;
      case 2:
        const { name: deleteName } = payload;
        result = await this.deleteMenuItem(deleteName);
        break;
      case 3:
        result = await this.viewMenu();
        break;
      default:
        console.error("Invalid admin functionality index");
    }
    return result;
  }
}
