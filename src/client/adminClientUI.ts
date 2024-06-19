import { MenuItem } from "../interface/menuItem";
import { getInputFromClient } from "../utils/promptMessage";

export class AdminClient {
  async handleAdminFunctionalities(index: number): Promise<MenuItem | void> {
    const adminFunctions = [
      this.addMenuItem,
      this.updateMenuItem,
      this.deleteMenuItem,
      this.viewMenu,
    ];

    const selectedFunction = adminFunctions[index];
    if (selectedFunction) {
      return selectedFunction();
    } else {
      console.error("Invalid functionality index");
    }
  }

  async addMenuItem(): Promise<MenuItem> {
    const category = await getInputFromClient("Enter category of the item: ");
    const name = await getInputFromClient("Enter name of the item: ");
    const priceInput = await getInputFromClient("Enter price of the item: ");
    const price = parseFloat(priceInput);
    const status = await getInputFromClient(
      "Enter availability status (true/false): "
    );
    const availability = status === "true";

    const foodItem: MenuItem = { category, name, price, availability };
    console.log("Item details:", foodItem);
    return foodItem;
  }

  async updateMenuItem(): Promise<void> {
    console.log("Update");
  }

  async deleteMenuItem(): Promise<void> {
    console.log("Delete");
  }

  async viewMenu(): Promise<void> {
    console.log("View");
  }
}
