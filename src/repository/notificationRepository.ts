import { RowDataPacket } from "mysql2";
import pool from "../db-connection";

export class NotificationRepository {
  async getNotificationsForToday(): Promise<string[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT notification FROM Notification WHERE DATE(date) = ?",
        [currentDate]
      );

      const notifications: string[] = rows.map((row) => row.notification);
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
}
