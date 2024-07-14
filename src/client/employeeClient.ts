import { Socket } from "socket.io-client";
import { getInputFromClient } from "../utils/promptMessage";
import { RolledOutItem } from "../interface/rolledOutItem";
import { Votes } from "../interface/votes";
import {FunctionResult } from "../enums/handleEmployeeFunctionalityResult";
import { exit } from "process";
export class EmployeeClient {
  async handleEmployeeFunctionalities(
    index: number,
    socket: Socket
  ): Promise<FunctionResult> {
    const employeeFunctions = [
      this.viewNotifications,
      this.voteForFood,
      this.takeFeedback,
      this.takeRating,
      this.provideDetailFeedback,
      this.updateProfile,
      this.logOut,
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

  voteForFood = async (socket: Socket): Promise<Votes> => {
    try {
      const rolledOutItems = await new Promise<RolledOutItem[]>(
        (resolve, reject) => {
          socket.emit("requestRolledOutItemsForEmployee");
          socket.on(
            "responseRolledOutItemsForEmployee",
            (data: RolledOutItem[]) => {
              resolve(data);
            }
          );
        }
      );
      if (rolledOutItems.length === 0) {
        console.log("No items available for voting.");
        return { breakfast: 0, lunch: 0, dinner: 0 };
      } else {
        console.table(rolledOutItems);

        const votes = await this.promptForVotes(rolledOutItems);
        console.log("Votes:", votes);
        return votes;
      }
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
      const nthDayItems = await new Promise<RolledOutItem[]>(
        (resolve, reject) => {
          socket.emit("requestTodayMenu");
          socket.on("responseTodayMenu", (data: RolledOutItem[]) => {
            console.log(data);
            resolve(data);
          });
        }
      );
      if (nthDayItems.length === 0) {
        console.log("No items available for feedback.");
        return {
          breakfast: { id: 0, feedback: "" },
          lunch: { id: 0, feedback: "" },
          dinner: { id: 0, feedback: "" },
        };
      } else {
        console.table(nthDayItems);

        const feedback: {
          breakfast: { id: number; feedback: string };
          lunch: { id: number; feedback: string };
          dinner: { id: number; feedback: string };
        } = {
          breakfast: {
            id:
              nthDayItems.find((item) => item.mealType === "Breakfast")?.id ||
              0,
            feedback: await getInputFromClient(
              "Enter feedback for Breakfast: "
            ),
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
      }
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

  async provideDetailFeedback(socket: Socket): Promise<{
    feedback: { answer1: string; answer2: string; answer3: string };
  }> {
    try {
      const actionType = 3;

      const actionStatus = await new Promise<{
        success: boolean;
        message: string;
      }>((resolve, reject) => {
        socket.emit("checkDetailFeedbackAction", actionType);
        socket.on(
          "checkDetailFeedbackActionResponse",
          (data: { success: boolean; message: string }) => {
            resolve(data);
          }
        );
      });

      console.log(actionStatus);

      if (!actionStatus) {
        const answer1 = await getInputFromClient(
          `Q1. What didn’t you like about the food item?`
        );
        const answer2 = await getInputFromClient(
          `Q2. How would you like the food item to taste?`
        );
        const answer3 = await getInputFromClient(`Q3. Share your mom’s recipe`);

        return { feedback: { answer1, answer2, answer3 } };
      } else {
        console.log("You have already provided feedback for this item.");
        return {
          feedback: { answer1: "", answer2: "", answer3: "" },
        };
      }
    } catch (error) {
      console.error("Error in askForDetailFeedback:", error);
      throw error;
    }
  }

  async updateProfile(socket: Socket): Promise<{
    foodPreference: number;
    spiceLevel: number;
    foodType: number;
    isSweetTooth: boolean;
  }> {
    console.log("Please answer these questions to know your preferences");

    let foodPreference: number;
    while (true) {
      const foodPreferenceInput = await getInputFromClient(
        `1) Please select one-\n1. Vegetarian\n2. Non Vegetarian\n3. Eggetarian`
      );
      foodPreference = parseInt(foodPreferenceInput, 10);
      if ([1, 2, 3].includes(foodPreference)) {
        break;
      } else {
        console.error("Invalid food preference selection. Please try again.");
      }
    }

    let spiceLevel: number;
    while (true) {
      const spiceLevelInput = await getInputFromClient(
        `2) Please select your spice level-\n1. High\n2. Medium\n3. Low`
      );
      spiceLevel = parseInt(spiceLevelInput, 10);
      if ([1, 2, 3].includes(spiceLevel)) {
        break;
      } else {
        console.error("Invalid spice level selection. Please try again.");
      }
    }

    let foodType: number;
    while (true) {
      const foodTypeInput = await getInputFromClient(
        `3) What do you prefer most?\n1. North Indian\n2. South Indian\n3. Other`
      );
      foodType = parseInt(foodTypeInput, 10);
      if ([1, 2, 3].includes(foodType)) {
        break;
      } else {
        console.error("Invalid food type selection. Please try again.");
      }
    }

    let isSweetTooth: boolean;
    while (true) {
      const isSweetToothInput = await getInputFromClient(
        `4) Do you have a sweet tooth?\n1. Yes\n2. No`
      );
      if ([1, 2].includes(parseInt(isSweetToothInput, 10))) {
        isSweetTooth = parseInt(isSweetToothInput, 10) === 1;
        break;
      } else {
        console.error("Invalid sweet tooth selection. Please try again.");
      }
    }
    console.log("Profile updated successfully.");
    return { foodPreference, spiceLevel, foodType, isSweetTooth };
  }

  logOut(socket:Socket):void{
    console.log("Re run the application to login again.");
    exit();
  }
}
