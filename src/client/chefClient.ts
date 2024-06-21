import { getInputFromClient } from "../utils/promptMessage";
import { MenuItem } from "../interface/menuItem";
import { MealTypes } from "../interface/mealType";

export class ChefClient {
  async handleChefFunctionalities(index: number): Promise<any> {
    const chefFunctions = [
      this.viewMenuRollout,
      this.recommendation,
      this.viewFeedbackReport,
    ];

    const selectedFunction = chefFunctions[index];
    if (selectedFunction) {
      return selectedFunction();
    } else {
      console.error("Invalid functionality index");
    }
  }

  async viewMenuRollout() {
    return;
  }

  async recommendation(): Promise<void> {
    console.log("Recommendation functionality not implemented yet.");
    return;
  }

  async viewFeedbackReport(): Promise<void> {
    console.log("View feedback report functionality not implemented yet.");
    return;
  }
}
