import { Pool, RowDataPacket } from "mysql2/promise";
import pool from "../db-connection";
import { MenuItem } from "../interface/menuItem";
import { MealType, RolloutItem } from "../interface/mealType";
import { RolledOutItem } from "../interface/rolledOutItem";

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
        "SELECT id,name, price, availability_status FROM Food_Item"
      );

      const menuItems: any = rows.map((row) => ({
        id: row.id,
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
      await pool.execute(
        "DELETE FROM RollOut_Menu WHERE food_item = (SELECT id FROM Food_Item WHERE name = ?)",
        [name]
      );

      await pool.execute("DELETE FROM Food_Item WHERE name = ?", [name]);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      throw error;
    }
  }

  async saveMenuRollout(itemsToRollout: RolloutItem[]): Promise<void> {
    const mealTypeMap: Record<MealType, number> = {
      breakfast: 1,
      lunch: 2,
      dinner: 3,
    };

    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const notificationMessage = `Tomorrow's menu is rolled out by chef.`;
      await pool.execute(
        "INSERT INTO Notification (notification,date) VALUES (?, ?)",
        [notificationMessage, currentDate]
      );
      const queries = itemsToRollout.map(async ({ itemId, mealType }) => {
        const mealTypeId = mealTypeMap[mealType];

        return pool.execute(
          "INSERT INTO RollOut_Menu (food_item, meal_type, date) VALUES (?, ?, ?)",
          [itemId, mealTypeId, currentDate]
        );
      });

      await Promise.all(queries);
    } catch (error) {
      console.error("Error saving rolled out menu items:", error);
      throw error;
    }
  }
  async getRolledOutItemsForToday(): Promise<RolledOutItem[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT rm.id, fi.name AS item_name, fi.price, mt.type AS meal_type
        FROM RollOut_Menu rm
        INNER JOIN Food_Item fi ON rm.food_item = fi.id
        INNER JOIN Meal_Type mt ON rm.meal_type = mt.id
        WHERE DATE(rm.date) = ?`,
        [currentDate]
      );

      const rolledOutItems: RolledOutItem[] = rows.map((row) => ({
        id: row.id,
        itemName: row.item_name,
        price: row.price,
        mealType: row.meal_type,
      }));

      return rolledOutItems;
    } catch (error) {
      console.error("Error fetching rolled out items:", error);
      throw error;
    }
  }
}
