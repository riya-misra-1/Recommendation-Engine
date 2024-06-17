export class AdminService {
  addMenuItem() {
    console.log("Add menu item functionality executed");
    // Implement add menu item functionality here
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
        this.addMenuItem();
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
