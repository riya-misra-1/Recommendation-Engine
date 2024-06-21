import { io, Socket } from "socket.io-client";
import { AdminClient } from "../src/client/adminClientUI";
import { User } from "./interface/user";
import { getInputFromClient } from "../src/utils/promptMessage";
import { MenuItem } from "./interface/menuItem";
import { ChefClient } from "./client/chefClient";
import { response } from "express";

const socket: Socket = io("http://172.16.0.222:8081");
const adminClient = new AdminClient();
const chefClient = new ChefClient();

socket.on("connect", () => {
  socket.send("Connected with sever");
});

async function inputUserCredentials() {
  const email = await getInputFromClient("Enter your email: ");
  const password = await getInputFromClient("Enter your password: ");
  socket.emit("Authenticate", { userId: email, password: password });
  socket.on("Authenticate", async (response) => {
    console.log("Response", response);
    response.options.forEach((functionality: any, index: number) => {
      console.log(`${index + 1}. ${functionality}`);
    });

    const selectedOption = await getInputFromClient("Select from above option : ");
    const categoryId = await getInputFromClient("Enter Category ID : ");
    const name = await getInputFromClient("Enter Item Name : ");
    const price = await getInputFromClient("Enter Item Price : ");
    const availabilityStatus = await getInputFromClient(
      "Enter Availability Status : "
    );
    socket.emit("Option selection", {
      selectedOption: selectedOption,
      payload: { categoryId, name, price, availabilityStatus },
    });

    socket.on("Option Selection", (response) => {
      console.log(response.message);
    });
  });
}

socket.on("disconnect", () => {
  console.error("Server disconnected or stopped.");
});

inputUserCredentials();
