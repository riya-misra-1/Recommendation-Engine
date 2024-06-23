import { NotificationRepository } from "../repository/notificationRepository";
  const notificationRepository = new NotificationRepository();

export class NotificationService {

  async getNotificationsForToday(): Promise<string[]> {
    try {
        const notification = await notificationRepository.getNotificationsForToday();
      return notification;
    } catch (error) {
      console.error("Error in NotificationService:", error);
      throw error;
    }
  }
}
