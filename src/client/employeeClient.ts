import { Socket } from "socket.io-client";
import { getInputFromClient } from "../utils/promptMessage";
import { ItemRepository } from "../repository/itemRepository";
import { RolledOutItem } from "../interface/rolledOutItem";
import { Votes } from "../interface/votes";
const itemRepository = new ItemRepository();
export class EmployeeClient {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.listenForNotifications();
  }

  private listenForNotifications() {
    this.socket.on("notification", (message: string) => {
      console.log("Notification received:", message);
    });
  }

  async handleEmployeeFunctionalities(
    index: number,
    socket: Socket
  ): Promise<Votes | void> {
    const employeeFunctions = [this.viewNotifications, this.voteForFood];

    const selectedFunction = employeeFunctions[index];
    if (selectedFunction) {
      return selectedFunction();
    } else {
      console.error("Invalid functionality index");
    }
  }

  async viewNotifications() {
    console.log("Fetching notifications...");
    return;
  }

  async promptForItemSelection(
    items: RolledOutItem[],
    mealType: string
  ): Promise<number> {
    let valid = false;
    let itemId: number = 0;

    while (!valid) {
      const input = await getInputFromClient(`Enter ID for ${mealType} item: `);
      itemId = Number(input);
      if (items.some((item) => item.id === itemId)) {
        valid = true;
      } else {
        console.log(
          `Invalid selection. Please select a valid ${mealType.toLowerCase()} item.`
        );
      }
    }

    return itemId;
  }

  async promptForBreakfast(breakfastItems: RolledOutItem[]): Promise<number> {
    return this.promptForItemSelection(breakfastItems, "Breakfast");
  }

  async promptForLunch(lunchItems: RolledOutItem[]): Promise<number> {
    return this.promptForItemSelection(lunchItems, "Lunch");
  }

  async promptForDinner(dinnerItems: RolledOutItem[]): Promise<number> {
    return this.promptForItemSelection(dinnerItems, "Dinner");
  }

  promptForVotes = async (rolledOutItems: RolledOutItem[]): Promise<Votes> => {
    const breakfastItems = rolledOutItems.filter(
      (item) => item.mealType === "Breakfast"
    );
    const lunchItems = rolledOutItems.filter(
      (item) => item.mealType === "Lunch"
    );
    const dinnerItems = rolledOutItems.filter(
      (item) => item.mealType === "Dinner"
    );

    const breakfastId = await this.promptForBreakfast(breakfastItems);
    const lunchId = await this.promptForLunch(lunchItems);
    const dinnerId = await this.promptForDinner(dinnerItems);

    return {
      breakfast: breakfastId,
      lunch: lunchId,
      dinner: dinnerId,
    };
  };

  voteForFood = async (): Promise<Votes> => {
    try {
      const rolledOutItems = await itemRepository.getRolledOutItemsForToday();
      console.table(rolledOutItems);

      const votes = await this.promptForVotes(rolledOutItems);
      console.log("Votes:", votes);
      return votes;
    } catch (error) {
      console.error("Error in voteForFood:", error);
      throw error;
    }
  };
}
