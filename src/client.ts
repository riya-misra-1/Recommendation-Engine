import { io, Socket } from "socket.io-client";
import { AdminClient } from "../src/client/adminClientUI";
import { User } from "./interface/user";
import { getInputFromClient } from "../src/utils/promptMessage";

const socket: Socket = io("http://localhost:3000");
const adminClient = new AdminClient();

async function inputUserCredentials() {
  const email = await getInputFromClient("Enter your email: ");
  const password = await getInputFromClient("Enter your password: ");
  socket.emit("login", email, password);
}

socket.on(
  "functionalities",
  async (functionalities: string[], role: string) => {
    console.log("Available functionalities:");
    functionalities.forEach((func, index) => {
      console.log(`${index + 1}. ${func}`);
    });

    const input = await getInputFromClient(
      "Enter the functionality number to execute: "
    );
    const index = parseInt(input) - 1;

    if (index >= 0 && index < functionalities.length) {
      let foodItem;

      switch (role) {
        case "Admin":
          foodItem = await adminClient.handleAdminFunctionalities(index);
          console.log('FoodItemm is received',foodItem);
          break;
        // Add cases for Chef and Employee
        default:
          console.error("Unknown role");
          return;
      }

        socket.emit("executeFunctionality", index, functionalities, foodItem);
    } else {
      console.log("Invalid input. Please enter a valid functionality number.");
    }
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

socket.on("disconnect", () => {
  console.error("Server disconnected or stopped.");
});

inputUserCredentials();
