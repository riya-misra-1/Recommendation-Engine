import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { AuthController } from "./controllers/authController";
import { AdminService } from "./services/adminService";
import { ChefService } from "./services/chefService";
import { EmployeeService } from "./services/employeeService";

const app = express();
const server = createServer(app);
const io = new Server(server);
const authController = new AuthController();
const adminService = new AdminService();
const chefService = new ChefService();
const employeeService = new EmployeeService();

io.on("connection", (socket: Socket) => {
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
        (index: number, functionalities: string[]) => {
          const { role } = result;
          if (index >= 0 && index < functionalities.length) {
            console.log(`Executing functionality: ${functionalities[index]}`);

            switch (role) {
              case "Admin":
                adminService.executeAdminFunctionality(index);
                break;
              case "Chef":
                chefService.executeChefFunctionality(index);
                break;
              case "Employee":
                employeeService.executeEmployeeFunctionality(index);
                break;
              default:
                socket.emit("error", "Unknown user role");
            }
          } else {
            socket.emit("error", "Invalid functionality index");
          }
        }
      );
    }
    // socket.on("addMenuItem", async (menuItem) => {
    //   if (result.role === "Admin") {
    //     try {
    //       await adminService.addMenuItem(menuItem);
    //       socket.emit("actionSuccess", "Menu item added successfully.");
    //     } catch (error) {
    //       socket.emit("actionFailure", "Failed to add menu item.");
    //     }
    //   } else {
    //     socket.emit("error", "Unauthorized action");
    //   }
    // });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
