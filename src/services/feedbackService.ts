import { FeedbackRepository } from "../repository/feedbackRepository";

const feedbackRepository = new FeedbackRepository
export class FeedbackService {
  async takeFeedback(
    userId: number,
    itemId: number,
    feedback: string,
    date: string
  ): Promise<void> {
    try {
      await feedbackRepository.takeFeedback(userId, itemId, feedback, date);
    } catch (error) {
      console.error("Error in takeFeedback service:", error);
      throw error;
    }
  }
}