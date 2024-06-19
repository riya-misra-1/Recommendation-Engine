import pool from "../db-connection";

export class AdminService {
  async addMenuItem(menuItem: {
    category: string;
    name: string;
    price: number;
    availability: boolean;
  }) {
    const { category, name, price, availability } = menuItem;
    try {
      await pool.execute(
        "INSERT INTO food_items (category, name, price, availability) VALUES (?, ?, ?, ?)",
        [category, name, price, availability]
      );
      console.log("Menu item added successfully");
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  }

  updateMenuItem() {
    console.log("Update menu item functionality executed");
    // Implement update menu item functionality here
  }

  deleteMenuItem() {
    console.log("Delete menu item functionality executed");
    // Implement delete menu item functionality here
  }

  viewMenu() {
    console.log("View menu functionality executed");
    // Implement view menu functionality here
  }

  executeAdminFunctionality(index: number) {
    switch (index) {
      case 0:
        // this.addMenuItem();
        break;
      case 1:
        this.updateMenuItem();
        break;
      case 2:
        this.deleteMenuItem();
        break;
      case 3:
        this.viewMenu();
        break;
      default:
        console.error("Invalid admin functionality index");
    }
  }
}
