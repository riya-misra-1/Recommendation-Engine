import { RowDataPacket } from "mysql2";
import pool from "../db-connection";

export class DiscardedItemRepository {
  async getAllDiscardedItems(): Promise<RowDataPacket[] | string> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT id,name,price,average_rating FROM Food_Item WHERE average_rating < 2 AND id NOT IN (SELECT item_id FROM DiscardedItem)"
      );
        return rows;
    } catch (error) {
      console.error("Error storing discarded items:", error);
      throw error;
    }
  }

  async checkUserRemoveAction(userID: number): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT *
         FROM Usage_Log
         WHERE action_type = ?`,
        [1]
      );
      if (rows.length > 0) {
        const lastUsed = rows[0].last_used;
        const lastUsedDate = new Date(lastUsed);
        const currentDate = new Date();

        if (
          lastUsedDate.getMonth() === currentDate.getMonth() &&
          lastUsedDate.getFullYear() === currentDate.getFullYear()
        ) {
          return false;
        } else {
          await pool.execute(
            `UPDATE Usage_Log
           SET last_used = CURRENT_DATE(), user_id = ?
           WHERE action_type = ?`,
            [userID, 1]
          );
          return true;
        }
      } else {
        await pool.execute(
          `INSERT INTO Usage_Log (user_id, action_type, last_used)
           VALUES (?, ?, CURRENT_DATE())`,
          [userID, 1]
        );
        return true;
      }
    } catch (error) {
      console.error("Error checking remove action:", error);
      return false;
    }
  }

  async checkUserFeedbackAction(userID: number): Promise<boolean> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT *
       FROM Usage_Log
       WHERE action_type = ?`,
        [2]
      );
      if (rows.length > 0) {
        const lastUsed = rows[0].last_used;
        const lastUsedDate = new Date(lastUsed);
        const currentDate = new Date();

        if (
          lastUsedDate.getMonth() === currentDate.getMonth() &&
          lastUsedDate.getFullYear() === currentDate.getFullYear()
        ) {
          return false;
        } else {
          await pool.execute(
            `UPDATE Usage_Log
           SET last_used = CURRENT_DATE(), user_id = ?
           WHERE action_type = ?`,
            [userID, 2]
          );
          return true;
        }
      } else {
        await pool.execute(
          `INSERT INTO Usage_Log (user_id, action_type, last_used)
         VALUES (?, ?, CURRENT_DATE())`,
          [userID, 2]
        );
        return true;
      }
    } catch (error) {
      console.error("Error checking feedback action:", error);
      return false;
    }
  }

  async insertFeedbackRequest(itemId: number) {
    try {
      await pool.execute(`INSERT INTO DiscardedItem (item_id) VALUES (?)`, [
        itemId,
      ]);
    } catch (error) {
      console.error("Error inserting feedback request:", error);
      throw error;
    }
  }

  async addNotification(
    message: string,
    type: number,
    toWhom: number
  ): Promise<void> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      await pool.execute(
        "INSERT INTO Notification (notification, date, notification_type, to_whom) VALUES (?, ?, ?, ?)",
        [message, currentDate, type, toWhom]
      );
    } catch (error) {
      console.error("Error adding notification:", error);
      throw error;
    }
  }
}
