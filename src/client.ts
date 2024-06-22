import { io, Socket } from "socket.io-client";
import { AdminClient } from "../src/client/adminClientUI";
import { User } from "./interface/user";
import { getInputFromClient } from "../src/utils/promptMessage";
import { MenuItem } from "./interface/menuItem";
import { ChefClient } from "./client/chefClient";

const socket: Socket = io("http://localhost:3000");
const adminClient = new AdminClient();
const chefClient = new ChefClient();

async function inputUserCredentials() {
  const email = await getInputFromClient("Enter your email: ");
  const password = await getInputFromClient("Enter your password: ");
  socket.emit("login", email, password);
}

async function executeFunctionality(
  functionalities: string[],
  role: string
) {
  console.log("Available functionalities:");
  functionalities.forEach((func, index) => {
    console.log(`${index + 1}. ${func}`);
  });

  const input = await getInputFromClient(
    "Enter the functionality number to execute: "
  );
  const index = parseInt(input) - 1;

  if (index >= 0 && index < functionalities.length) {
    let payload;

    switch (role) {
      case "Admin":
        payload = await adminClient.handleAdminFunctionalities(index);
        break;
      case "Chef":
        payload = await chefClient.handleChefFunctionalities(index);
        break;
      default:
        console.error("Unknown role");
        return;
    }

    socket.emit("executeFunctionality", index, functionalities, payload);
  } else {
    console.log("Invalid input. Please enter a valid functionality number.");
    await executeFunctionality(functionalities, role); 
  }
}

socket.on(
  "functionalities",
  async (functionalities: string[], role: string) => {
    await executeFunctionality(functionalities, role);
  }
);
socket.on("loginSuccess", (user: User) => {
  console.log("Login successful.");
});

socket.on("loginFailure", (message: string) => {
  console.error(message);
});

socket.on("error", (message: string) => {
  console.error("Error:", message);
});

socket.on("result",async(message)=>{
  // console.log(message);
  const { role, data } = message;
  console.log("Result:", data);
 socket.emit("fetchFunctionalities", role);
  // if (role === "Admin") {
  //     console.log("Result:", data);
  // } else if (role === "Chef") {
  //   if (Array.isArray(data)) {
  //     handleMenuItems(data);
  //   } else {
  //     console.log("Chef Result:", data);
  //   }
  // }
  
  // async function handleMenuItems(menuItems: MenuItem[]) {
  //   console.log("Menu Items:", menuItems);

  //   const breakfastCount = parseInt(
  //     await getInputFromClient(
  //       "How many food items do you need for breakfast? "
  //     )
  //   );
  //   const breakfastItems = await getInputFromClientForItems(
  //     breakfastCount,
  //     "breakfast"
  //   );

  //   socket.emit("breakfastItems", breakfastItems);

  //   const lunchCount = parseInt(
  //     await getInputFromClient("How many food items do you need for lunch? ")
  //   );
  //   const lunchItems = await getInputFromClientForItems(lunchCount, "lunch");

  //   socket.emit("lunchItems", lunchItems);

  //   const dinnerCount = parseInt(
  //     await getInputFromClient("How many food items do you need for dinner? ")
  //   );
  //   const dinnerItems = await getInputFromClientForItems(dinnerCount, "dinner");

  //   socket.emit("dinnerItems", dinnerItems);
  // }
  
  //  async function getInputFromClientForItems(count: number, mealType: string) {
  //    const items = [];
  //    for (let i = 0; i < count; i++) {
  //      const itemName = await getInputFromClient(
  //        `Enter name for ${mealType} item ${i + 1}: `
  //      );
  //      items.push({ name: itemName, type: mealType });
  //    }
  //    return items;
  //  }
});

socket.on("disconnect", () => {
  console.error("Server disconnected or stopped.");
});

inputUserCredentials();
