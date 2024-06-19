import { Role } from "../enums/role";
import pool from "../db-connection";

export class RoleService {
  async getUserRole(email: string): Promise<Role | null> {
    try {
      const [rows] = await pool.execute(
        "SELECT r.role FROM Users u JOIN Role r ON u.role = r.id WHERE u.email = ?",
        [email]
      );
      const roleData = rows as { role: string }[];

      if (roleData.length > 0) {
        return roleData[0].role as Role;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }
}
