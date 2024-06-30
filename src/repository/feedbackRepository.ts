import { RowDataPacket } from "mysql2";
import pool from "../db-connection";
import { getSentimentAnalysis } from "../recommendationEngine";

export class FeedbackRepository {
  async takeFeedback(
    userId: number,
    itemId: number,
    feedback: string,
    date: string
  ): Promise<void> {
    try {
      await pool.execute(
        `INSERT INTO Feedback (user_id, food_item, feedback, date_of_feedback)
         VALUES (?, ?, ?, ?)`,
        [userId, itemId, feedback, date]
      );

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT sentiments, feedback_count FROM Food_Item WHERE id = ?`,
      [itemId]
    );
    const newSentimentScore = await getSentimentAnalysis(feedback);

    if (rows.length === 0) {
      throw new Error("Food item not found");
    }

    const currentSentiments = rows[0].sentiments || 0;
    const feedbackCount = rows[0].feedback_count || 0;

    const updatedSentimentScore =
      (currentSentiments * feedbackCount + newSentimentScore) /
      (feedbackCount + 1);

    await pool.execute(
      `UPDATE Food_Item 
         SET sentiments = ?, feedback_count = feedback_count + 1
         WHERE id = ?`,
      [updatedSentimentScore, itemId]
    );
    } catch (error) {
      console.error("Error taking feedback:", error);
      throw error;
    }
  }

  async getUserFeedback(
    userId: number,
    date: string
  ): Promise<{ itemId: number }[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT food_item AS itemId FROM Feedback WHERE user_id = ? AND date_of_feedback = ?",
        [userId, date]
      );

      const userFeedback = rows.map((row) => ({
        itemId: row.itemId,
      }));

      return userFeedback;
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      throw error;
    }
  }
}