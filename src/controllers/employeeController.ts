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

  async takeFeedback(userId: number, payload: any): Promise<void> {
    const { breakfast, lunch, dinner } = payload;

    try {
      await feedbackService.takeFeedback(
        userId,
        breakfast,
        "Breakfast Feedback",
        new Date().toISOString().slice(0, 10)
      );
      await feedbackService.takeFeedback(
        userId,
        lunch,
        "Lunch Feedback",
        new Date().toISOString().slice(0, 10)
      );
      await feedbackService.takeFeedback(
        userId,
        dinner,
        "Dinner Feedback",
        new Date().toISOString().slice(0, 10)
      );

      console.log("Feedback recorded successfully.");
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
        this.takeFeedback(userId,payload);
        break;
      default:
        console.error("Invalid employee functionality index");
    }
  }
}
