export class ItemsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createItem = async (itemName, itemPrice, itemHealth, itemPower) => {
    const createItem = await this.prisma.items.create({
      data: {
        itemName: itemName,
        itemPrice: itemPrice,
        itemHealth: itemHealth,
        itemPower: itemPower,
      },
    });

    return createItem;
  };

  getItemName = async (itemName) => {
    const getItemName = await this.prisma.items.findFirst({
      where: { itemName: itemName },
    });

    return getItemName;
  };

  getItemData = async (itemId) => {
    const getItemData = await this.prisma.items.findUnique({
      where: { itemId: +itemId },
    });

    return getItemData;
  };

  getItemsData = async () => {
    const getItemData = await this.prisma.items.findMany({
      select: {
        itemId: true,
        itemName: true,
        itemPrice: true,
      },
      orderBy: {
        createdAt: "desc", // 아이템을 최신순으로 정렬
      },
    });

    return getItemData;
  };

  updateItem = async (itemId, itemName, itemHealth, itemPower, itemPrice) => {
    const updateItem = await this.prisma.items.update({
      where: { itemId: +itemId },
      data: {
        itemName: itemName,
        itemHealth: itemHealth,
        itemPower: itemPower,
        itemPrice: itemPrice,
      },
    });

    return updateItem;
  };
}
