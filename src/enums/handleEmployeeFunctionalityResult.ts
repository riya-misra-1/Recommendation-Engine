import { Votes } from "../interface/votes";

export type FunctionResult =
  | Votes
  | void
  | {
      breakfast: { id: number; feedback: string };
      lunch: { id: number; feedback: string };
      dinner: { id: number; feedback: string };
    }
  | {
      breakfast: { id: number; rating: number };
      lunch: { id: number; rating: number };
      dinner: { id: number; rating: number };
    }
  | { itemId: number; feedback: string }
  | { feedback: { answer1: string; answer2: string; answer3: string } }
  | {
      foodPreference: number;
      spiceLevel: number;
      foodType: number;
      isSweetTooth: boolean;
    };

    
