import { Votes } from "../interface/votes";
import { ItemService } from "../services/itemService";
import { FeedbackService } from "../services/feedbackService";
import { NotificationService } from "../services/notificationService";
import { MenuItem } from "../interface/menuItem";

const notificationService = new NotificationService();
const itemService = new ItemService();
const feedbackService = new FeedbackService();

export class EmployeeController {
  async viewNotifications(): Promise<{
    success: boolean;
    message: string[] | string;
  }> {
    const receiverStatusCode = "2";
  const result = await notificationService.viewNotifications(
    receiverStatusCode
  );
        console.log("Notifications employee:", result.message);

  return {
    success: result.success,
    message: result.message,
  };
  }

  async voteForFood(
    userId: number,
    votes: Votes
  ): Promise<{ success: boolean; message: string }> {
    return await itemService.saveVotes(userId, votes);
  }

  async takeFeedback(
    userId: number,
    payload: any
  ): Promise<{ success: boolean; message: string }> {
    return await feedbackService.takeFeedback(userId, payload);
  }

  async takeRating(
    userId: number,
    payload: any
  ): Promise<{ success: boolean; message: string }> {
    return await feedbackService.takeRating(userId, payload);
  }

  executeEmployeeFunctionality(
    index: number,
    userId: number,
    payload: Votes | any
  ): Promise<{ success: boolean; message: string | string[] | MenuItem[] }> {
    switch (index) {
      case 0:
        return this.viewNotifications();
      case 1:
        return this.voteForFood(userId, payload as Votes);
      case 2:
        return this.takeFeedback(userId, payload);
      case 3:
        return this.takeRating(userId, payload);
      default:
        return Promise.resolve({
          success: false,
          message: "Invalid employee functionality index",
        });
    }
  }
}
