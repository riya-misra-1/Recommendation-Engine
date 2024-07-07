import { NotificationRepository } from "../repository/notificationRepository";

const notificationRepository = new NotificationRepository();

export class NotificationService {
  async getNotificationsForToday(): Promise<{
    success: boolean;
    message: string[] | string;
  }> {
    try {
      const notification =
        await notificationRepository.getNotificationsForToday();
      return { success: true, message: notification };
    } catch (error) {
      console.error("Error in NotificationService:", error);
      return {
        success: false,
        message: "Error fetching today's notifications",
      };
    }
  }

  async getHistoricalNotifications(): Promise<{
    success: boolean;
    message: string[] | string;
  }> {
    try {
      const notifications =
        await notificationRepository.getHistoricalNotifications();
      const formattedNotifications = notifications.map(
        (notificationObject) =>
          `${notificationObject.notification} on ${notificationObject.date}`
      );
      return { success: true, message: formattedNotifications };
    } catch (error) {
      console.error("Error in NotificationService:", error);
      return {
        success: false,
        message: "Error fetching historical notifications",
      };
    }
  }
}
