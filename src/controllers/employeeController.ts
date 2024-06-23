import { Socket } from "socket.io-client";
import { ItemRepository } from "../repository/itemRepository";
import { NotificationService } from "../services/notificationService";

const notificationService = new NotificationService();
export class EmployeeController {
  async viewNotifications(): Promise<string[]> {
    try {
      const notifications =
        await notificationService.getNotificationsForToday();
      return notifications;
    } catch (error) {
      console.error(
        "Error fetching notifications in EmployeeController:",
        error
      );
      throw error;
    }
  }

  voteForFood() {
    console.log("Vote for food functionality executed");
  }

  viewRatingsAndComments() {
    console.log("View ratings and comments functionality executed");
  }

  executeEmployeeFunctionality(index: number) {
    switch (index) {
      case 0:
        return this.viewNotifications();
      case 1:
        this.voteForFood();
        break;
      case 2:
        this.viewRatingsAndComments();
        break;
      default:
        console.error("Invalid employee functionality index");
    }
  }
}
