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

  async takeRating(
    userId: number,
    itemId: number,
    rating: number,
    date: string
  ): Promise<void> {
    try {
      const [existingRows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM Feedback 
       WHERE user_id = ? AND food_item = ? AND date_of_feedback = ?`,
        [userId, itemId, date]
      );

      if (existingRows.length > 0) {
        await pool.execute(
          `UPDATE Feedback 
         SET rating = ?
         WHERE user_id = ? AND food_item = ? AND date_of_feedback = ?`,
          [rating, userId, itemId, date]
        );
      } else {
        await pool.execute(
          `INSERT INTO Feedback (user_id, food_item, rating, date_of_feedback)
         VALUES (?, ?, ?, ?)`,
          [userId, itemId, rating, date]
        );
      }
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT AVG(rating) AS average_rating, COUNT(rating) AS rating_count 
       FROM Feedback 
       WHERE food_item = ?`,
        [itemId]
      );

      if (rows.length === 0 || rows[0].average_rating === null) {
        throw new Error("No ratings found for the item");
      }

      const updatedAverageRating = rows[0].average_rating;
      const ratingCount = rows[0].rating_count;

      await pool.execute(
        `UPDATE Food_Item 
       SET average_rating = ?, rating_count = ?
       WHERE id = ?`,
        [updatedAverageRating, ratingCount, itemId]
      );
    } catch (error) {
      console.error("Error taking rating:", error);
      throw error;
    }
  }

  async getUserFeedback(userId: number, date: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT food_item AS itemId, feedback 
         FROM Feedback 
         WHERE user_id = ? AND date_of_feedback = ?`,
        [userId, date]
      );

      return rows.map((row) => ({
        itemId: row.itemId,
        feedback: row.feedback,
      }));
    } catch (error) {
      console.error("Error fetching user feedback:", error);
      throw error;
    }
  }

  async getUserRatings(userId: number, date: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT food_item AS itemId, rating 
       FROM Feedback 
       WHERE user_id = ? AND date_of_feedback = ?`,
        [userId, date]
      );

      return rows.map((row) => ({
        itemId: row.itemId,
        rating: row.rating !== null ? row.rating : null,
      }));
    } catch (error) {
      console.error("Error fetching user ratings:", error);
      throw error;
    }
  }
}