import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { AuthController } from "./controllers/authController";
import { AdminController } from "./controllers/adminController";
import { ChefController } from "./controllers/chefController";
import { EmployeeController } from "./controllers/employeeController";
import { MenuItem } from "./interface/menuItem";

const app = express();
const server = createServer(app);
const io = new Server(server);
const authController = new AuthController();
const adminController = new AdminController();
const chefController = new ChefController();

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
        async (
          index: number,
          functionalities: string[],
          payload: any
        ) => {
          const { role } = result;
          if (index >= 0 && index < functionalities.length) {
            console.log(`Executing functionality: ${functionalities[index]}`);
            let response;
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
                     payload
                   );
                break;
              case "Employee":
                response = await employeeController.executeEmployeeFunctionality(index);
                break;
              default:
                socket.emit("error", "Unknown user role");
            }
            // socket.emit("result", response);
            socket.emit("result", { role: role, data: response });
          } else {
            socket.emit("error", "Invalid functionality index");
          }
        }
      );
      socket.on("fetchFunctionalities", (role: string) => {
        socket.emit("functionalities", result.functionalities, role);
      });
    }
  });

  

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
