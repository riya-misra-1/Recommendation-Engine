export interface Functionalities {
  Admin: string[];
  Chef: string[];
  Employee: string[];
}

export const RoleFunctionalities: Functionalities = {
  Admin: [
    "Add menu item",
    "Update menu item",
    "Delete menu item",
    "View menu",
    "Logout",
  ],
  Chef: [
    "View menu",
    "Roll out items",
    "View User Recommended Items",
    "Finalize menu",
    "View notifications",
    "Discard menu",
    "Logout",
  ],
  Employee: [
    "View notifications",
    "Vote for food",
    "Provide Feedback",
    "Provide Rating",
    "Provide Detailed Feedback",
    "Update Profile",
    "Logout",
  ],
};
