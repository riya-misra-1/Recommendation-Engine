export interface Functionalities {
  Admin: string[];
  Chef: string[];
  Employee: string[];
}

export const RoleFunctionalities: Functionalities = {
  Admin: ["Add menu item", "Update menu item", "Delete menu item", "View menu"],
  Chef: ["View menu rollout", "Recommendation", "View feedback report"],
  Employee: [
    "View notifications",
    "Vote for food",
    "View ratings and comments",
  ],
};
