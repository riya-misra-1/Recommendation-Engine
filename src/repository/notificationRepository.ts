import { RowDataPacket } from "mysql2";
import pool from "../db-connection";

export class NotificationRepository {
  async getNotifications(
    receiverStatusCode: string
  ): Promise<string[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      console.log("Current date:", currentDate);
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT DISTINCT notification 
       FROM Notification 
       WHERE to_whom = ? 
       OR (to_whom = '3' 
       AND ((notification_type IN (1)) 
       OR (notification_type = 2 AND date = ?)))`,
        [receiverStatusCode, currentDate]
      );

      const notifications: string[] = rows.map((row) => row.notification);
      console.log("Notifications:", notifications);
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
}
