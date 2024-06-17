import { io, Socket } from "socket.io-client";
import readline from "readline";

const socket: Socket = io("http://localhost:3000");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function inputUserCredentials() {
  rl.question("Enter your email: ", (email) => {
    rl.question("Enter your password: ", (password) => {
      socket.emit("login", email, password);
    });
  });
}

socket.on("functionalities", (functionalities: string[]) => {
  console.log("Available functionalities:");
  functionalities.forEach((func, index) => {
    console.log(`${index + 1}. ${func}`);
  });

  rl.question("Enter the functionality number to execute: ", (input) => {
    const index = parseInt(input) - 1;
    if (index >= 0 && index < functionalities.length) {
      socket.emit("executeFunctionality", index, functionalities);
    } else {
      console.log("Invalid input. Please enter a valid functionality number.");
      rl.close();
    }
  });
});

socket.on("loginSuccess", (user: any) => {
  console.log("Login successful.");
});

socket.on("loginFailure", (message: string) => {
  console.error(message);
  rl.close();
});

socket.on("error", (message: string) => {
  console.error("Error:", message);
  rl.close();
});

inputUserCredentials();
