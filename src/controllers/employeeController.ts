import { Socket } from "socket.io-client";
import { ItemRepository } from "../repository/itemRepository";
import { NotificationService } from "../services/notificationService";
import { Votes } from "../interface/votes";
import { ItemService } from "../services/itemService";

const notificationService = new NotificationService();
const itemService = new ItemService();
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

  async voteForFood(userId: number, votes: Votes): Promise<string | void> {
    try {
      const response = await itemService.saveVotes(userId, votes);
      return response;
    } catch (error: any) {
      console.error("Error saving votes:", error);
      throw error;
    }
  }

  viewRatingsAndComments() {
    console.log("View ratings and comments functionality executed");
  }

  executeEmployeeFunctionality(index: number, userId: number, votes: Votes) {
    switch (index) {
      case 0:
        return this.viewNotifications();
      case 1:
        return this.voteForFood(userId, votes);
      case 2:
        this.viewRatingsAndComments();
        break;
      default:
        console.error("Invalid employee functionality index");
    }
  }
}
