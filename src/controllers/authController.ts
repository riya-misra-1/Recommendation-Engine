import { User } from "../interface/user";
import pool from "../db-connection";
import { RoleFunctionalities } from "../interface/functionalities";
import { RoleService } from "../services/roleService";
import { Role } from "../enums/role";

const roleService = new RoleService();


export class AuthController {
  public async handleLogin(
    email: string,
    password: string
  ): Promise<{
    user?: User;
    functionalities?: string[];
    role?: string;
    error?: string;
  }> {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM Users WHERE email = ? AND password = ?",
        [email, password]
      );
      const userData = rows as User[];

      if (userData.length > 0) {
        const user = userData[0];
        const role: Role | null = await roleService.getUserRole(user.email);

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

  
  
}
