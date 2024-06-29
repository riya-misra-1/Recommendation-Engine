import pool from "../db-connection";

export class FeedbackRepository {
  async takeFeedback(
    userId: number,
    itemId: number,
    feedback: string,
    date: string
  ): Promise<void> {
    try {
      await pool.execute(
        `INSERT INTO Feedback (userId, itemId, feedback, date)
         VALUES (?, ?, ?, ?)`,
        [userId, itemId, feedback, date]
      );
    } catch (error) {
      console.error("Error taking feedback:", error);
      throw error;
    }
  }
}