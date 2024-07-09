import { io, Socket } from "socket.io-client";
import { AdminClient } from "../src/client/adminClientUI";
import { User } from "./interface/user";
import { getInputFromClient } from "../src/utils/promptMessage";
import { ChefClient } from "./client/chefClient";
import { EmployeeClient } from "./client/employeeClient";

const socket: Socket = io("http://localhost:3000");
const adminClient = new AdminClient();
const chefClient = new ChefClient();
const employeeClient = new EmployeeClient();

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
        payload = await chefClient.handleChefFunctionalities(index,socket);
        console.log("Payload:", payload);
        break;
      case "Employee":
        payload = await employeeClient.handleEmployeeFunctionalities(index, socket);
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
  const { role, data } = message;
  // console.log("Result:", data);
  switch (role) {
    case "Employee":
     if (Array.isArray(data) && data.length > 0) {
       console.table(data);
     } else {
       console.log("Result:", data);
     }
      break;
    case "Admin":
      console.log("Result:", data);
      break;
    case "Chef":
     if (Array.isArray(data) && data.length > 0) {
        console.table(data);
     } else{
        console.log("Result:", data);     
     }
      
      break;
    default:
      console.error("Unknown role received from server");
  }
 socket.emit("fetchFunctionalities", role);
});

socket.on("disconnect", () => {
  console.error("Server disconnected or stopped.");
});

inputUserCredentials();
