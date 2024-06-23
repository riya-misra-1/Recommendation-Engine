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
  ): Promise<void> {
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

  async voteForFood(): Promise<void> {
    try {
      const rolledOutItems = await itemRepository.getRolledOutItemsForToday();
      console.table(rolledOutItems);

      //  const votes: Votes = await this.promptForVotes();
      //  console.log("Votes:", votes);

    } catch (error) {
      console.error("Error in voteForFood:", error);
      throw error;
    }
  }

  // async promptForVotes(): Promise<Votes> {
  //   const breakfast = await getInputFromClient("Enter ID for breakfast item: ");
  //   const lunch = await getInputFromClient("Enter ID for lunch item: ");
  //   const dinner = await getInputFromClient("Enter ID for dinner item: ");

  //   return {
  //     breakfast: Number(breakfast),
  //     lunch: Number(lunch),
  //     dinner: Number(dinner),
  //   };
  // }
}
