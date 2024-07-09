import { Socket } from "socket.io-client";
import { getInputFromClient } from "../utils/promptMessage";
import { RolledOutItem } from "../interface/rolledOutItem";
import { Votes } from "../interface/votes";
export class EmployeeClient {
  async handleEmployeeFunctionalities(
    index: number,
    socket: Socket
  ): Promise<
    | Votes
    | void
    | {
        breakfast: { id: number; feedback: string };
        lunch: { id: number; feedback: string };
        dinner: { id: number; feedback: string };
      }
    | {
        breakfast: { id: number; rating: number };
        lunch: { id: number; rating: number };
        dinner: { id: number; rating: number };
      }
  > {
    const employeeFunctions = [
      this.viewNotifications,
      this.voteForFood,
      this.takeFeedback,
      this.takeRating,
    ];

    const selectedFunction = employeeFunctions[index];
    if (selectedFunction) {
      return selectedFunction(socket);
    } else {
      console.error("Invalid functionality index");
    }
  }

  async viewNotifications(socket: Socket) {
    console.log("Fetching notifications...");
    return;
  }

  async promptForItemSelection(
    items: RolledOutItem[],
    mealType: string,
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

  async promptForBreakfast(
    breakfastItems: RolledOutItem[],
  ): Promise<number> {
    return this.promptForItemSelection(breakfastItems, "Breakfast");
  }

  async promptForLunch(lunchItems: RolledOutItem[]): Promise<number> {
    return this.promptForItemSelection(lunchItems, "Lunch");
  }

  async promptForDinner(dinnerItems: RolledOutItem[]): Promise<number> {
    return this.promptForItemSelection(dinnerItems, "Dinner");
  }

  promptForVotes = async (
    rolledOutItems: RolledOutItem[],
  ): Promise<Votes> => {
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

  voteForFood = async (socket: Socket): Promise<Votes> => {
    try {
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

      const votes = await this.promptForVotes(rolledOutItems);
      console.log("Votes:", votes);
      return votes;
    } catch (error) {
      console.error("Error in voteForFood:", error);
      throw error;
    }
  };

  async takeFeedback(socket: Socket): Promise<{
    breakfast: { id: number; feedback: string };
    lunch: { id: number; feedback: string };
    dinner: { id: number; feedback: string };
  }> {
    try {
      // const nthDayItems = await itemRepository.showMenuForToday();
      const nthDayItems = await new Promise<RolledOutItem[]>(
        (resolve, reject) => {
          socket.emit("requestTodayMenu");
          socket.on("responseTodayMenu", (data: RolledOutItem[]) => {
            console.log(data);
            resolve(data);
          });
        }
      );
      console.table(nthDayItems);

      const feedback: {
        breakfast: { id: number; feedback: string };
        lunch: { id: number; feedback: string };
        dinner: { id: number; feedback: string };
      } = {
        breakfast: {
          id:
            nthDayItems.find((item) => item.mealType === "Breakfast")?.id || 0,
          feedback: await getInputFromClient("Enter feedback for Breakfast: "),
        },
        lunch: {
          id: nthDayItems.find((item) => item.mealType === "Lunch")?.id || 0,
          feedback: await getInputFromClient("Enter feedback for Lunch: "),
        },
        dinner: {
          id: nthDayItems.find((item) => item.mealType === "Dinner")?.id || 0,
          feedback: await getInputFromClient("Enter feedback for Dinner: "),
        },
      };

      return feedback;
    } catch (error) {
      console.error("Error in takeFeedback:", error);
      throw error;
    }
  }

  async takeRating(socket: Socket): Promise<{
    breakfast: { id: number; rating: number };
    lunch: { id: number; rating: number };
    dinner: { id: number; rating: number };
  }> {
    try {
      // const nthDayItems = await itemRepository.showMenuForToday();
      const nthDayItems = await new Promise<RolledOutItem[]>(
        (resolve, reject) => {
          socket.emit("requestTodayMenu");
          socket.on("responseTodayMenu", (data: RolledOutItem[]) => {
            console.log(data);
            resolve(data);
          });
        }
      );
      console.table(nthDayItems);

      const rating: {
        breakfast: { id: number; rating: number };
        lunch: { id: number; rating: number };
        dinner: { id: number; rating: number };
      } = {
        breakfast: {
          id:
            nthDayItems.find((item) => item.mealType === "Breakfast")?.id || 0,
          rating: Number(
            await getInputFromClient("Enter rating for Breakfast: ")
          ),
        },
        lunch: {
          id: nthDayItems.find((item) => item.mealType === "Lunch")?.id || 0,
          rating: Number(await getInputFromClient("Enter rating for Lunch: ")),
        },
        dinner: {
          id: nthDayItems.find((item) => item.mealType === "Dinner")?.id || 0,
          rating: Number(await getInputFromClient("Enter rating for Dinner: ")),
        },
      };

      return rating;
    } catch (error) {
      console.error("Error in takeRating:", error);
      throw error;
    }
  }
}
