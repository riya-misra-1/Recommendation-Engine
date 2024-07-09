import { RowDataPacket } from "mysql2";
import pool from "../db-connection";

export class DiscardedItemRepository {
  async storeDiscardedItems(): Promise<void> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "INSERT INTO DiscardedItem (item_id) " +
          "SELECT id FROM Food_Item WHERE average_rating < 2 AND id NOT IN (SELECT item_id FROM DiscardedItem)"
      );
    } catch (error) {
      console.error("Error storing discarded items:", error);
    }
  }

  async getAllDiscardedItems(): Promise<RowDataPacket[]> {
    try {
      await this.storeDiscardedItems();
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT di.item_id, fi.name, fi.price
         FROM DiscardedItem di
         JOIN Food_Item fi ON di.item_id = fi.id`
      );
      return rows;
    } catch (error) {
      console.error("Error fetching discarded items:", error);
      throw error;
    }
  }
}
