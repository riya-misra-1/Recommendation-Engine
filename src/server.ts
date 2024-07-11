import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { AuthController } from "./controllers/authController";
import { AdminController } from "./controllers/adminController";
import { ChefController } from "./controllers/chefController";
import { EmployeeController } from "./controllers/employeeController";
import { MenuItem } from "./interface/menuItem";
import { Votes } from "./interface/votes";
import { ItemService } from "./services/itemService";
import { RolledOutItem } from "./interface/rolledOutItem";
import { DiscardedItemService } from "./services/discardService";

const app = express();
const server = createServer(app);
const io = new Server(server);
const authController = new AuthController();
const adminController = new AdminController();
const chefController = new ChefController();
const itemService = new ItemService();
const discardService = new DiscardedItemService();
io.on("connection", (socket: Socket) => {
  const employeeController = new EmployeeController();

  console.log("User connected");

  socket.on("login", async (email: string, password: string) => {
    const result = await authController.handleLogin(email, password);

    if (result.error) {
      socket.emit("loginFailure", result.error);
    } else if (result.functionalities && result.role) {
      socket.emit("loginSuccess", result.user);
      socket.emit("functionalities", result.functionalities, result.role);
      socket.on(
        "executeFunctionality",
        async (index: number, functionalities: string[], payload: any) => {
          const { role } = result;
          if (index >= 0 && index < functionalities.length) {
            console.log(`Executing functionality: ${functionalities[index]}`);
            let response: { success: boolean; message: string | string[] | MenuItem[] } = { success: false, message: "" };
            switch (role) {
              case "Admin":
                response = await adminController.executeAdminFunctionality(
                  index,
                  payload
                );
                break;
              case "Chef":
                response = await chefController.executeChefFunctionality(
                  index,
                  result.user?.id as number,
                  payload
                );
                break;
              case "Employee":
                  response =
                    await employeeController.executeEmployeeFunctionality(
                      index,
                      result.user?.id as number,
                      payload 
                    );
                    console.log('Response:', response);
                break;
              default:
                socket.emit("error", "Unknown user role");
            }
            if(response.success === true){
              socket.emit("result", { role: role, data: response.message });
            }else{
              socket.emit("error", response.message);
            }
          } else {
            socket.emit("error", "Invalid functionality index");
          }
        }
      );
      socket.on("fetchFunctionalities", (role: string) => {
        socket.emit("functionalities", result.functionalities, role);
      });
      
    }

     socket.on("requestRolledOutItems", async () => {
       try {
         const rolledOutItems = await itemService.getRolledOutItems();

         socket.emit("responseRolledOutItems", rolledOutItems);
       } catch (error) {
         console.error("Error fetching rolled-out items:", error);
         socket.emit("error", "Failed to fetch rolled-out items");
       }
     });
      socket.on("requestTodayMenu", async () => {
        try {
          const todayMenu: RolledOutItem[] | string =
            await itemService.showMenuForToday();
          socket.emit("responseTodayMenu", todayMenu);
        } catch (error) {
          console.error("Error fetching today's menu:", error);
          socket.emit("responseTodayMenu", []);
        }
      });
      socket.on("requestDiscardedItems", async () => {
        try {
          const discardedItems = await discardService.getAllDiscardedItems();
          socket.emit("responseDiscardedItems", discardedItems);
        } catch (error) {
          console.error("Error fetching discarded items:", error);
          socket.emit("responseDiscardedItems", []);
        }
      });
      socket.on("requestMenuItems", async () => {
        try {
          const menuItems = (await itemService.showMenu()).message;
          socket.emit("responseMenuItems", menuItems);
        } catch (error) {
          console.error("Error fetching menu items:", error);
          socket.emit("responseMenuItems", []);
        }
      });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
