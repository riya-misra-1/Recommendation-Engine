import { FeedbackRepository } from "../repository/feedbackRepository";

const feedbackRepository = new FeedbackRepository();

export class FeedbackService {
  async takeFeedback(userId: number, payload: any): Promise<string> {
    const { breakfast, lunch, dinner } = payload;
    const date = new Date().toISOString().slice(0, 10);

    try {
      const existingFeedback = await feedbackRepository.getUserFeedback(
        userId,
        date
      );
      let responseMessage = "";

      if (breakfast) {
        const breakfastResponse = await this.recordFeedback(
          userId,
          breakfast.id,
          breakfast.feedback,
          date,
          existingFeedback
        );
        if (breakfastResponse.includes("User already provided feedback")) {
          responseMessage = breakfastResponse;
        }
      }

      if (lunch) {
        const lunchResponse = await this.recordFeedback(
          userId,
          lunch.id,
          lunch.feedback,
          date,
          existingFeedback
        );
        if (lunchResponse.includes("User already provided feedback")) {
          responseMessage = lunchResponse;
        }
      }

      if (dinner) {
        const dinnerResponse = await this.recordFeedback(
          userId,
          dinner.id,
          dinner.feedback,
          date,
          existingFeedback
        );
        if (dinnerResponse.includes("User already provided feedback")) {
          responseMessage = dinnerResponse;
        }
      }

      if (responseMessage) {
        return responseMessage;
      }

      return "Feedback recorded successfully.";
    } catch (error) {
      console.error("Error in takeFeedback service:", error);
      throw error;
    }
  }

  private async recordFeedback(
    userId: number,
    itemId: number,
    feedback: string,
    date: string,
    existingFeedback: { itemId: number }[]
  ): Promise<string> {
    if (existingFeedback.some((food) => food.itemId === itemId)) {
      console.error("User already provided feedback for today's item.");
      return "User already provided feedback for today's item.";
    }

    await feedbackRepository.takeFeedback(userId, itemId, feedback, date);
    return "Feedback recorded successfully.";
  }
}
