import { NotificationRepository } from "../repository/notificationRepository";

const notificationRepository = new NotificationRepository();

export class NotificationService {

 async viewNotifications(receiverStatusCode: string): Promise<{
  success: boolean;
  message: string | string[];
}> {
  try {
    const notifications = await notificationRepository.getNotifications(receiverStatusCode);
      console.log("Notifications fetched:", notifications);

    return { success: true, message: notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, message: "Error fetching notifications" };
  }
}

}
