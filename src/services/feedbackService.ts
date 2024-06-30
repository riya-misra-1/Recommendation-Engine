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

  async takeRating(userId: number, payload: any): Promise<string> {
    const { breakfast, lunch, dinner } = payload;
    const date = new Date().toISOString().slice(0, 10);

    try {
      const existingRatings = await feedbackRepository.getUserRatings(
        userId,
        date
      );
      console.log(existingRatings);
      let responseMessage = "";

      if (breakfast) {
        const breakfastResponse = await this.recordRating(
          userId,
          breakfast.id,
          breakfast.rating,
          date,
          existingRatings
        );
        if (breakfastResponse.includes("User already provided rating")) {
          responseMessage = breakfastResponse;
        }
      }

      if (lunch) {
        const lunchResponse = await this.recordRating(
          userId,
          lunch.id,
          lunch.rating,
          date,
          existingRatings
        );
        if (lunchResponse.includes("User already provided rating")) {
          responseMessage = lunchResponse;
        }
      }

      if (dinner) {
        const dinnerResponse = await this.recordRating(
          userId,
          dinner.id,
          dinner.rating,
          date,
          existingRatings
        );
        if (dinnerResponse.includes("User already provided rating")) {
          responseMessage = dinnerResponse;
        }
      }

      if (responseMessage) {
        return responseMessage;
      }

      return "Rating recorded successfully.";
    } catch (error) {
      console.error("Error in takeRating service:", error);
      throw error;
    }
  }

  private async recordFeedback(
    userId: number,
    itemId: number,
    feedback: string,
    date: string,
    existingFeedback: { itemId: number; feedback: boolean }[]
  ): Promise<string> {
    if (existingFeedback.some((food) => food.itemId === itemId)) {
      console.error("User already provided feedback for today's item.");
      return "User already provided feedback for today's item.";
    }

    await feedbackRepository.takeFeedback(userId, itemId, feedback, date);
    return "Feedback recorded successfully.";
  }

  private async recordRating(
    userId: number,
    itemId: number,
    rating: number,
    date: string,
    existingRatings: { itemId: number; rating: number | null }[]
  ): Promise<string> {
    const itemRating = existingRatings.find(
      (food) => food.itemId === itemId && food.rating !== null
    );
    console.log(itemRating);

    if (itemRating) {
      console.error("User already provided rating for today's item.");
      return "User already provided rating for today's item.";
    }

    try {
      await feedbackRepository.takeRating(userId, itemId, rating, date);
      return "Rating recorded successfully.";
    } catch (error) {
      console.error("Error taking rating:", error);
      throw error;
    }
  }
}
