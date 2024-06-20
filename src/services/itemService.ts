import { Pool } from "mysql2/promise";
import pool from "../db-connection";
import { MenuItem } from "../interface/menuItem";

export class ItemService {
  async addItem(menuItem: MenuItem): Promise<string> {
    const { category, name, price, availability } = menuItem;
    try {
      await pool.execute(
        "INSERT INTO Food_Item(category, name, price, availability_status) VALUES (?, ?, ?, ?)",
        [category, name, price, availability]
      );
      return "Menu item added successfully";
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  async viewMenu(): Promise<{ menu?: MenuItem[]; error?: string }> {
    try {
      const [rows] = await pool.execute(
        "SELECT name, price, availability_status FROM Food_Item"
      );
      const menu = rows as MenuItem[];

      if (menu.length > 0) {
        return { menu };
      } else {
        return { error: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { error: "Database error" };
    }
  }

  async updateItem(
    name: string,
    field: string,
    value: string | number
  ): Promise<string> {
    try {
      if (field === "price") {
        await pool.execute("UPDATE Food_Item SET price = ? WHERE name = ?", [
          value,
          name,
        ]);
      } else if (field === "availability_status") {
        await pool.execute(
          "UPDATE Food_Item SET availability_status = ? WHERE name = ?",
          [value, name]
        );
      }
      return `${field} updated successfully for item ${name}`;
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  async deleteItem(name: string): Promise<string> {
    try {
      await pool.execute("DELETE FROM Food_Item WHERE name = ?", [name]);
      return "Menu item deleted successfully";
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }
}
