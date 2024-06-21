import { Pool, RowDataPacket } from "mysql2/promise";
import pool from "../db-connection";
import { MenuItem } from "../interface/menuItem";

export class ItemRepository {
  async addItem(menuItem: MenuItem): Promise<void> {
    const { category, name, price, availability } = menuItem;
    try {
      await pool.execute(
        "INSERT INTO Food_Item(category, name, price, availability_status) VALUES (?, ?, ?, ?)",
        [category, name, price, availability]
      );
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT name, price, availability_status FROM Food_Item"
      );

      const menuItems: any = rows.map((row) => ({
        name: row.name,
        price: parseFloat(row.price),
        availability: row.availability_status === 1,
      }));

      return menuItems;
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  }

  async updateItem(
    name: string,
    field: string,
    value: string | number
  ): Promise<void> {
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
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }

  async deleteItem(name: string): Promise<void> {
    try {
      await pool.execute("DELETE FROM Food_Item WHERE name = ?", [name]);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }

  
}
