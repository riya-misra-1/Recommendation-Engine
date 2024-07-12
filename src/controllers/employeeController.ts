import { Votes } from "../interface/votes";
import { ItemService } from "../services/itemService";
import { FeedbackService } from "../services/feedbackService";
import { NotificationService } from "../services/notificationService";
import { MenuItem } from "../interface/menuItem";
import { ProfileService } from "../services/profileService";

const notificationService = new NotificationService();
const itemService = new ItemService();
const feedbackService = new FeedbackService();
const profileService = new ProfileService();

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
     try {
       if (
         votes.breakfast === 0 &&
          votes.lunch === 0 &&
          votes.dinner === 0
       ) {
         return { success: true, message: "" };
       } else {
         var result  = await itemService.saveVotes(userId, votes);
         if(result.success){
         return { success: true, message: "Votes saved successfully" };
         }else{
            return { success: true, message: result.message };
         }
       }
     } catch (error) {
       console.error("Error in votes:", error);
       return { success: false, message: "Error saving votes" };
     }
  }

  async takeFeedback(
    userId: number,
    payload: {
      breakfast: { id: number; feedback: string };
      lunch: { id: number; feedback: string };
      dinner: { id: number; feedback: string };
    }
  ): Promise<{ success: boolean; message: string }> {
    if (
      payload.breakfast.feedback === "" &&
      payload.lunch.feedback === "" &&
      payload.dinner.feedback === ""
    ) {
      return { success: true, message: "" };
    } else {
      return await feedbackService.takeFeedback(userId, payload);
    }
  }

  async takeRating(
    userId: number,
    payload: any
  ): Promise<{ success: boolean; message: string }> {
    return await feedbackService.takeRating(userId, payload);
  }

  async provideFeedback(response: {
    feedback: { answer1: string; answer2: string; answer3: string };
  }) {
    try {
      if (
        response.feedback.answer1 === "" ||
        response.feedback.answer2 === "" ||
        response.feedback.answer3 === ""
      ) {
        return { success: true, message: "" };
      } else {
        await feedbackService.saveFeedback(response.feedback);
        return { success: true, message: "Feedback saved successfully" };
      }
    } catch (error) {
      console.error("Error in provideFeedback:", error);
      return { success: false, message: "Error saving feedback" };
    }
  }

  async updateProfile(
    userId:number,
    payload: {
      foodPreference: number;
      spiceLevel: number;
      foodType: number;
      isSweetTooth: boolean;
    }
  ) {
    try {
      const employeeId = userId;
      const { foodPreference, spiceLevel, foodType, isSweetTooth } = payload;

      const result = await profileService.updateEmployeeProfile(
        employeeId,
        foodPreference,
        spiceLevel,
        foodType,
        isSweetTooth
      );

      if (result.success) {
        return { success: true, message: "Profile updated successfully" };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return { success: false, message: "Internal server error" };
    }
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
      case 4:
        return this.provideFeedback(payload);
      case 5:
        return this.updateProfile(userId, payload);
      default:
        return Promise.resolve({
          success: false,
          message: "Invalid employee functionality index",
        });
    }
  }
}
