import { RowDataPacket } from "mysql2";
import pool from "../db-connection";

export class ProfileRepository {
  async getEmployeeProfile(employeeId: number) {
    const [rows]: RowDataPacket[] = await (pool.execute(
      `SELECT * FROM Employee_Preference WHERE employee_id = ?`,
      [employeeId]
    ) as Promise<RowDataPacket[]>);
    return rows[0];
  }

  async insertEmployeeProfile(
    employeeId: number,
    foodPreference: number,
    spiceLevel: number,
    foodType: number,
    isSweetTooth: boolean
  ) {
    try {
      await pool.execute(
        `INSERT INTO Employee_Preference (employee_id, food_preference, spice_level, food_type, is_sweet_tooth) VALUES (?, ?, ?, ?, ?)`,
        [employeeId, foodPreference, spiceLevel, foodType, isSweetTooth]
      );
      return { success: true, message: "Profile inserted successfully" };
    } catch (error) {
      console.error("Error inserting profile:", error);
      return { success: false, message: "Error inserting profile" };
    }
  }

  async updateEmployeeProfile(
    employeeId: number,
    foodPreference: number,
    spiceLevel: number,
    foodType: number,
    isSweetTooth: boolean
  ) {
    try {
      await pool.execute(
        `UPDATE Employee_Preference SET food_preference = ?, spice_level = ?, food_type = ?, is_sweet_tooth = ? WHERE employee_id = ?`,
        [foodPreference, spiceLevel, foodType, isSweetTooth, employeeId]
      );
      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: "Error updating profile" };
    }
  }
}
