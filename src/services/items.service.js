export class ItemsService {
  constructor(itemsRepository) {
    this.itemsRepository = itemsRepository;
  }

  createItem = async (itemName, itemPrice, itemHealth, itemPower) => {
    const getItemName = await this.itemsRepository.getItemName(itemName);

    if (getItemName) {
      throw new Error("이미 존재하는 아이템 이름 입니다.");
    }

    const createItem = await this.itemsRepository.createItem(
      itemName,
      itemPrice,
      itemHealth,
      itemPower
    );

    return {
      itemName: createItem.itemName,
      itemPrice: createItem.itemPrice,
      itemHealth: createItem.itemHealth,
      itemPower: createItem.itemPower,
    };
  };

  getItems = async () => {
    const getItems = await this.itemsRepository.getItemsData();

    if (!getItems) {
      throw new Error("생성된 아이템이 없습니다.");
    }

    // return getItems.map((item) => {
    //   return {
    //     itemId: item.itemId,
    //     itemName: item.itemName,
    //     itemPrice: item.itemPrice,
    //   };
    // });

    return getItems;
  };

  getItem = async (itemId) => {
    const getItem = await this.itemsRepository.getItemData(itemId);

    if (!getItem) {
      throw new Error("생성된 아이템이 없습니다.");
    }

    return getItem;
  };

  updateItem = async (itemId, itemName, itemHealth, itemPower, itemPrice) => {
    const itemExist = await this.itemsRepository.getItemData(itemId);

    if (!itemExist) {
      throw new Error("생성된 아이템이 없습니다.");
    }

    const updateItem = await this.itemsRepository.updateItem(
      itemId,
      itemName,
      itemHealth,
      itemPower,
      itemPrice
    );

    return updateItem;
  };
}
