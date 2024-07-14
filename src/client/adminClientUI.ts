import { Socket } from "socket.io-client";
import { Categories } from "../interface/categories";
import { MenuItem } from "../interface/menuItem";
import { getInputFromClient } from "../utils/promptMessage";
import { exit } from "process";

export class AdminClient {
  async handleAdminFunctionalities(
    index: number,
    socket: Socket
  ): Promise<
    | MenuItem
    | { name: string; updates: { field: string; value: string | number }[] }
    | { name: string }
    | void
  > {
    const adminFunctions = [
      this.addMenuItem,
      this.updateMenuItem,
      this.deleteMenuItem,
      this.viewMenu,
    ];

    const selectedFunction = adminFunctions[index];
    if (selectedFunction) {
      return selectedFunction(socket);
    } else {
      console.error("Invalid functionality index");
    }
  }

  async addMenuItem(socket: Socket): Promise<MenuItem> {
    console.log("Available categories");
    Categories.forEach((category) => {
      console.log(category.category);
    });
    const category = await getInputFromClient(
      "Select the categories from the above options: "
    );

    const name = await getInputFromClient("Enter name of the item: ");
    const priceInput = await getInputFromClient("Enter price of the item: ");
    const price = parseFloat(priceInput);
    const status = await getInputFromClient(
      "Enter availability status (true/false): "
    );
    const availability = status === "true";

    const foodItem: MenuItem = {
      category,
      name,
      price,
      availability,
      id: 0,
    };
    console.log("Item details:", foodItem);
    return foodItem;
  }

  async updateMenuItem(socket: Socket): Promise<{
    name: string;
    updates: { field: string; value: string | number }[];
  }> {
    const menuItems = await new Promise<MenuItem[]>((resolve, reject) => {
      socket.emit("requestMenuItems");
      socket.on("responseMenuItems", (data: MenuItem[]) => {
        resolve(data);
      });
    });

    console.table(menuItems);

    const name = await getInputFromClient(
      "Enter the name of the item to update: "
    );
    const updates = [];

    const updatePrice = await getInputFromClient(
      "Would you like to update the price? (y/n): "
    );
    if (updatePrice.toLowerCase() === "y") {
      const priceInput = await getInputFromClient("Enter the new price: ");
      const price = parseFloat(priceInput);
      updates.push({ field: "price", value: price });
    }

    const updateAvailability = await getInputFromClient(
      "Would you like to update the availability? (y/n): "
    );
    if (updateAvailability.toLowerCase() === "y") {
      const availability = await getInputFromClient(
        "Enter the new availability (true/false): "
      );
      const availabilityStatus = availability === "true" ? 1 : 0;
      updates.push({ field: "availability_status", value: availabilityStatus });
    }

    return { name, updates };
  }

  async deleteMenuItem(socket: Socket): Promise<{ name: string }> {
    const name = await getInputFromClient(
      "Enter the name of the item to delete: "
    );
    return { name };
  }

  async viewMenu(socket: Socket): Promise<void> {
    return;
  }
  logOut(socket: Socket): void {
    console.log('Re run the application to login again.')
    exit();
  }
}
