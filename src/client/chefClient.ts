import { getInputFromClient } from "../utils/promptMessage";
import { MenuItem } from "../interface/menuItem";
import { MealType, RolloutItem } from "../interface/mealType";
import { ItemRepository } from "../repository/itemRepository";
import { RolledOutItem } from "../interface/rolledOutItem";
import { Socket } from "socket.io-client";
import { DiscardedItem } from "../interface/discardedItem";
import { exit } from "process";

const itemRepository = new ItemRepository();
export class ChefClient {
  // private socket: Socket;

  // constructor(socket: Socket) {
  //   this.socket = socket;
  // }
  async handleChefFunctionalities(index: number, socket: Socket): Promise<any> {
    const chefFunctions = [
      this.viewMenu,
      this.rolloutItems,
      this.viewUserRecommendedItems,
      this.finalizeMenu,
      this.viewNotifications,
      this.discardMenuItem,
    ];

    const selectedFunction = chefFunctions[index];
    if (selectedFunction) {
      return selectedFunction(socket);
    } else {
      console.error("Invalid functionality index");
    }
  }

  async viewMenu() {
    return;
  }

  async rolloutItems(socket: Socket): Promise<RolloutItem[]> {
    const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];
    const itemsToRollout: RolloutItem[] = [];

    const menuItems = await new Promise<MenuItem[]>((resolve, reject) => {
      socket.emit("requestMenuItems");
      socket.on("responseMenuItems", (data: MenuItem[]) => {
        resolve(data);
      });
    });

    console.table(menuItems);

    for (const mealType of mealTypes) {
      let count = parseInt(
        await getInputFromClient(`How many items for ${mealType}? `),
        10
      );

      while (count > 0) {
        let itemId = parseInt(
          await getInputFromClient(`Enter ID for ${mealType} item ${count}: `),
          10
        );

        const menuItem = menuItems.find((item) => item.id === itemId);
        if (!menuItem) {
          console.error(`Item with ID ${itemId} does not exist in the menu.`);
          continue;
        }

        const existingItem = itemsToRollout.find(
          (item) => item.itemId === itemId && item.mealType === mealType
        );
        if (existingItem) {
          console.error(
            `Item with ID ${itemId} is already added for ${existingItem.mealType}.`
          );
          continue;
        }

        itemsToRollout.push({ itemId, mealType });
        count--;
      }
    }

    return itemsToRollout;
  }

  async viewUserRecommendedItems(socket: Socket): Promise<void> {
    return;
  }

  async viewFeedbackReport(): Promise<void> {
    console.log("View feedback report functionality not implemented yet.");
    return;
  }

  finalizeMenu = async (
    socket: Socket
  ): Promise<
    | {
        breakfast: number;
        lunch: number;
        dinner: number;
      }
    | undefined
  > => {
    try {
      // const rolledOutItems = await itemRepository.getRolledOutItemsForToday();
      const rolledOutItems = await new Promise<RolledOutItem[]>(
        (resolve, reject) => {
          socket.emit("requestRolledOutItems");
          socket.on("responseRolledOutItems", (data: RolledOutItem[]) => {
            console.log(data);
            resolve(data);
          });
        }
      );
      console.table(rolledOutItems);

      const breakfastItemId = await this.validateItemSelection(
        "breakfast",
        rolledOutItems,
        socket
      );
      const lunchItemId = await this.validateItemSelection(
        "lunch",
        rolledOutItems,
        socket
      );
      const dinnerItemId = await this.validateItemSelection(
        "dinner",
        rolledOutItems,
        socket
      );

      console.log("Menu finalized successfully.");
      return {
        breakfast: breakfastItemId,
        lunch: lunchItemId,
        dinner: dinnerItemId,
      };
    } catch (error) {
      console.error("Error finalizing menu:", error);
      throw error;
    }
  };

  validateItemSelection = async (
    mealType: MealType,
    rolledOutItems: RolledOutItem[],
    socket: Socket
  ): Promise<number> => {
    const mealTypeKey = mealType.toLowerCase();
    const rolledOutItemsIds = rolledOutItems
      .filter((item) => item.mealType.toLowerCase() === mealTypeKey)
      .map((item) => item.id);

    while (true) {
      const input = await getInputFromClient(
        `Enter the item ID for ${mealType}: `
      );
      const itemId = parseInt(input, 10);

      if (!rolledOutItemsIds.includes(itemId)) {
        console.error(`Invalid ${mealType} item ID: ${itemId}`);
      } else {
        return itemId;
      }
    }
  };
  async viewNotifications(socket: Socket) {
    console.log("Fetching notifications...");
    return;
  }

  discardMenuItem = async (
    socket: Socket
  ): Promise<{ name: string | number; action: string }> => {
    const action = await getInputFromClient(
      "Choose an action: 1. Remove item from menu, 2. Get detailed feedback from employee "
    );
    if (action !== "1" && action !== "2") {
      console.log("Invalid action selected");
      return { name: "", action: "" };
    }
    const discardedItems: DiscardedItem[] = await new Promise(
      (resolve, reject) => {
        socket.emit("requestDiscardedItems");
        socket.on("responseDiscardedItems", (data: DiscardedItem[]) => {
          resolve(data);
        });
      }
    );

    if (discardedItems.length === 0) {
      console.log("No item present that have rating less than 2");
      return { name: "", action: "" };
    }
    console.log("Discarded Items:");
    console.table(discardedItems);

    let actionResult: string = "";
    let itemName = "";
    let itemId = 0;

    while (true) {
      if (action === "1") {
        itemName = await getInputFromClient(
          "Enter the name of the item to discard: "
        );

        const foundItem = discardedItems.find(
          (item) => item.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!foundItem) {
          console.log(`Item '${itemName}' does not exist in discarded items.`);
          continue;
        } else {
          actionResult = "remove";
          break;
        }
      } else if (action === "2") {
        itemId = parseInt(
          await getInputFromClient(
            "Enter the item ID for which you want detailed feedback: "
          ),
          10
        );

        const foundItem = discardedItems.find((item) => item.id === itemId);

        if (!foundItem) {
          console.error(
            `Item ID '${itemId}' does not exist in discarded items.`
          );
          continue;
        } else {
          actionResult = "feedback";
          break;
        }
      }
    }

    return { name: itemName ? itemName : itemId, action: actionResult };
  };

  logOut(socket: Socket): void {
    console.log("Re run the application to login again.");
    exit();
  }
}
