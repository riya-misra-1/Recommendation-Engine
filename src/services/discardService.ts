import { ItemRepository } from "../repository/itemRepository";
import { DiscardedItemRepository } from "../repository/discardItemRepositoyr";

const discardRepository = new DiscardedItemRepository();

export class DiscardedItemService {
  async getAllDiscardedItems() {
    try {
      const discardedItems = await discardRepository.getAllDiscardedItems();
      return discardedItems;
    } catch (error) {
      console.error("Error in getAllDiscardedItems service:", error);
      throw error;
    }
  }
}
