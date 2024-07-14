import { Pool, QueryResult, RowDataPacket } from "mysql2/promise";
import pool from "../db-connection";
import { MenuItem } from "../interface/menuItem";
import { MealType, RolloutItem } from "../interface/mealType";
import { RolledOutItem } from "../interface/rolledOutItem";
import { Votes } from "../interface/votes";

export class ItemRepository {
  // async addNotification(
  //   message: string,
  //   type: number,
  //   toWhom: number
  // ): Promise<void> {
  //   const currentDate = new Date().toISOString().slice(0, 10);
  //   await pool.execute(
  //     "INSERT INTO Notification (notification, date, notification_type, to_whom) VALUES (?, ?, ?, ?)",
  //     [message, currentDate, type, toWhom]
  //   );
  // }

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
        "SELECT id, name, price, availability_status, sentiments, average_rating FROM Food_Item ORDER BY sentiments DESC"
      );

      const menuItems: MenuItem[] = rows.map((row) => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        availability: row.availability_status === 1,
        sentiments: row.sentiments,
        averageRating: parseFloat(row.average_rating),
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

  async saveMenuRollout(itemsToRollout: RolloutItem[]): Promise<void> {
    const mealTypeMap: Record<MealType, number> = {
      breakfast: 1,
      lunch: 2,
      dinner: 3,
    };

    try {
      const currentDate = new Date().toISOString().slice(0, 10);
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
  async getRolledOutItemsForTodayForEmployee(
    employeeId: number
  ): Promise<RolledOutItem[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT fi.id AS food_item_id, fi.name AS item_name, fi.price, fi.sentiments, fi.average_rating, mt.type AS meal_type
      FROM RollOut_Menu rm
      INNER JOIN Food_Item fi ON rm.food_item = fi.id
      INNER JOIN Meal_Type mt ON rm.meal_type = mt.id
      INNER JOIN Employee_Preference ep ON ep.employee_id = ?
      WHERE DATE(rm.date) = ?
      ORDER BY
      CASE WHEN fi.food_preference = ep.food_preference THEN 0 ELSE 1 END,
      CASE WHEN fi.food_type = ep.food_type THEN 0 ELSE 1 END,
      CASE WHEN fi.spice_level = ep.spice_level THEN 0 ELSE 1 END,
      CASE WHEN fi.is_sweet = ep.is_sweet_tooth THEN 0 ELSE 1 END;`,
        [employeeId, currentDate]
      );

      const rolledOutItems: RolledOutItem[] = rows.map((row) => ({
        id: row.food_item_id,
        itemName: row.item_name,
        price: row.price,
        sentiments: row.sentiments,
        averageRating: row.average_rating,
        mealType: row.meal_type,
      }));

      return rolledOutItems;
    } catch (error) {
      console.error("Error fetching rolled out items:", error);
      throw error;
    }
  }

  async getRolledOutItemsForTodayForChef(): Promise<RolledOutItem[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT fi.id AS food_item_id, fi.name AS item_name, fi.price, fi.sentiments, fi.average_rating, mt.type AS meal_type
      FROM RollOut_Menu rm
      INNER JOIN Food_Item fi ON rm.food_item = fi.id
      INNER JOIN Meal_Type mt ON rm.meal_type = mt.id
      WHERE DATE(rm.date) = ?`,
        [currentDate]
      );

      const rolledOutItems: RolledOutItem[] = rows.map((row) => ({
        id: row.food_item_id,
        itemName: row.item_name,
        price: row.price,
        sentiments: row.sentiments,
        averageRating: row.average_rating,
        mealType: row.meal_type,
      }));

      return rolledOutItems;
    } catch (error) {
      console.error("Error fetching rolled out items:", error);
      throw error;
    }
  }

  async saveVotes(userId: number, votes: Votes): Promise<void> {
    try {
      const date = new Date().toISOString().slice(0, 10);
      const voteQueries = Object.entries(votes).map(([mealType, itemId]) => {
        const voteQuery = `
          INSERT INTO Vote (userId, itemId, date)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            itemId = VALUES(itemId), date = VALUES(date)`;
        return pool.execute(voteQuery, [userId, itemId, date]);
      });

      await Promise.all(voteQueries);

      const currentDate = new Date().toISOString().slice(0, 10);

      const incrementQueries = Object.entries(votes).map(
        ([mealType, itemId]) => {
          const incrementQuery = `
           UPDATE RollOut_Menu
            SET votes = COALESCE(votes, 0) + 1
            WHERE food_item = ?
             AND DATE(date) = ?`;

          return pool.execute(incrementQuery, [itemId, currentDate]);
        }
      );

      await Promise.all(incrementQueries);
    } catch (error) {
      console.error("Error saving votes and incrementing vote counts:", error);
      throw error;
    }
  }

  async getUserVotes(userId: number): Promise<{ itemId: number }[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT itemId AS itemId FROM Vote WHERE userId = ? AND date = ?",
        [userId, currentDate]
      );

      const userVotes = rows.map((row) => ({
        itemId: row.itemId,
      }));

      return userVotes;
    } catch (error) {
      console.error("Error fetching user votes:", error);
      throw error;
    }
  }

  async getUserRecommendedItems(): Promise<MenuItem[]> {
    try {
      const currentDate = new Date().toISOString().split("T")[0];

      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT FI.id, FI.name, FI.price, FI.availability_status, FI.sentiments, FI.average_rating, SUM(RI.votes) AS votes
       FROM Food_Item FI
       JOIN RollOut_Menu RI ON FI.id = RI.food_item
       WHERE RI.date = ?
       GROUP BY FI.id, FI.name, FI.price, FI.availability_status, FI.sentiments, FI.average_rating
       ORDER BY votes DESC`,
        [currentDate]
      );

      const recommendedItems: any = rows.map((row) => ({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price),
        availability: row.availability_status === 1,
        sentiments: row.sentiments,
        averageRating: row.average_rating,
        votes: row.votes,
      }));
      console.log("Recommended items:", recommendedItems);
      return recommendedItems;
    } catch (error) {
      console.error("Error fetching user recommended items:", error);
      throw error;
    }
  }

  async finalizeMenu(
    breakfast: number,
    lunch: number,
    dinner: number,
    date: string
  ): Promise<void> {
    try {
      await pool.execute(
        `INSERT INTO Nth_Day_Menu (meal_type, food_item, date)
         VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)`,
        [1, breakfast, date, 2, lunch, date, 3, dinner, date]
      );
    } catch (error) {
      console.error("Error finalizing menu:", error);
      throw error;
    }
  }

  async showMenuForToday(): Promise<RolledOutItem[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);

      const query = `
         SELECT FI.id, FI.name AS item_name, FI.price, MT.type AS meal_type
        FROM Nth_Day_Menu NDM
        INNER JOIN Food_Item FI ON NDM.food_item = FI.id
        INNER JOIN Meal_Type MT ON NDM.meal_type = MT.id
        WHERE DATE(NDM.date) = ?`;

      const [rows] = await pool.execute<RowDataPacket[]>(query, [currentDate]);

      const nthDayItems: RolledOutItem[] = rows.map((row) => ({
        id: row.id,
        itemName: row.item_name,
        price: row.price,
        mealType: row.meal_type,
      }));

      return nthDayItems;
    } catch (error) {
      console.error("Error in showMenuForToday:", error);
      throw error;
    }
  }

  async getItemNameById(itemId: number): Promise<string> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT name FROM Food_Item WHERE id = ?",
        [itemId]
      );

      if (rows.length > 0) {
        return rows[0].name;
      } else {
        throw new Error("Item not found");
      }
    } catch (error) {
      console.error("Error fetching item name:", error);
      throw error;
    }
  }
}

