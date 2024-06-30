export interface Functionalities {
  Admin: string[];
  Chef: string[];
  Employee: string[];
}

export const RoleFunctionalities: Functionalities = {
  Admin: ["Add menu item", "Update menu item", "Delete menu item", "View menu"],
  Chef: ["View menu","Roll out items", "View User Recommended Items", "Finalize menu"],
  Employee: [
    "View notifications",
    "Vote for food",
    "Provide Feedback",
    "Provide Rating"
  ],
};
