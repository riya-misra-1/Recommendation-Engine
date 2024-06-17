import { User } from "../interface/user";
import pool from "../db-connection";
import { RoleFunctionalities } from "../interface/functionalities";

export class AuthController {
  public async handleLogin(
    email: string,
    password: string
  ): Promise<{ user?: User; functionalities?: string[]; role?:string; error?: string }> {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE email = ? AND password = ?",
        [email, password]
      );
      const userData = rows as User[];

      if (userData.length > 0) {
        const user = userData[0];
        const role = await this.getUserRole(user.email);

        if (role && RoleFunctionalities[role]) {
          const functionalities = RoleFunctionalities[role];
          return { user, functionalities, role };
        } else {
          return { error: "User role not found" };
        }
      } else {
        return { error: "Invalid email or password" };
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { error: "Database error" };
    }
  }

  private async getUserRole(email: string): Promise<string | null> {
    try {
      const [rows] = await pool.execute(
        "SELECT r.role FROM Users u JOIN Role r ON u.role = r.id WHERE u.email = ?",
        [email]
      );
      const roleData = rows as { role: string }[];

      if (roleData.length > 0) {
        return roleData[0].role;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }
}
