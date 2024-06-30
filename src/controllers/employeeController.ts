import { Socket } from "socket.io-client";
import { ItemRepository } from "../repository/itemRepository";
import { NotificationService } from "../services/notificationService";
import { Votes } from "../interface/votes";
import { ItemService } from "../services/itemService";
import { FeedbackService } from "../services/feedbackService";

const notificationService = new NotificationService();
const itemService = new ItemService();
const feedbackService = new FeedbackService();
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

  async takeFeedback(userId: number, payload: any): Promise<string> {
    try {
      const feedbackResponses = await feedbackService.takeFeedback(
        userId,
        payload
      );
      return feedbackResponses;
    } catch (error) {
      console.error("Error recording feedback:", error);
      throw error;
    }
  }

  executeEmployeeFunctionality(index: number, userId: number, payload: Votes | string) {
    switch (index) {
      case 0:
        return this.viewNotifications();
      case 1:
        return this.voteForFood(userId, payload as Votes);
      case 2:
        return this.takeFeedback(userId,payload);
      default:
        console.error("Invalid employee functionality index");
    }
  }
}
