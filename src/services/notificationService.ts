import { NotificationRepository } from "../repository/notificationRepository";
  const notificationRepository = new NotificationRepository();

export class NotificationService {
  async getNotificationsForToday(): Promise<string[]> {
    try {
      const notification =
        await notificationRepository.getNotificationsForToday();
      return notification;
    } catch (error) {
      console.error("Error in NotificationService:", error);
      throw error;
    }
  }
  async getHistoricalNotifications(): Promise<string[]> {
    try {
      const notifications =
        await notificationRepository.getHistoricalNotifications();
      return notifications.map(
        (notificationObject) =>
          `${notificationObject.notification} on ${notificationObject.date}`
      );
    } catch (error) {
      console.error("Error in NotificationService:", error);
      throw error;
    }
  }
}
