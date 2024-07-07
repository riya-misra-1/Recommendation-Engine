import { RowDataPacket } from "mysql2";
import pool from "../db-connection";

export class NotificationRepository {
  async getNotificationsForToday(): Promise<string[]> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT notification FROM Notification WHERE DATE(date) = ? AND notification = ?",
        [currentDate, "Tomorrow's menu is rolled out by the chef."]
      );
      console.log("Notify", rows);

      const notifications: string[] = rows.map((row) => row.notification);
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  async getHistoricalNotifications(): Promise<
    { notification: string; date: string }[]
  > {
    try {
      const currentDate = new Date().toISOString();
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT notification, date FROM Notification WHERE date < ? ORDER BY date DESC LIMIT 5",
        [currentDate]
      );

      const notifications: { notification: string; date: string }[] = rows.map(
        (row) => ({
          notification: row.notification,
          date: row.date,
        })
      );

      const filteredNotifications = notifications.filter(
        (notification) =>
          !notification.notification.includes(
            "Tomorrow's menu is rolled out by the chef."
          )
      );
      return filteredNotifications;
    } catch (error) {
      console.error("Error fetching historical notifications:", error);
      throw error;
    }
  }
}
