export class ItemsController {
  constructor(itemsService) {
    this.itemsService = itemsService;
  }

  createItem = async (req, res, next) => {
    try {
      const { itemName, itemPrice, itemHealth, itemPower } = req.body;

      if (!itemName || !itemPrice || !itemHealth || !itemPower) {
        throw new Error("InvalidParamsError");
      }

      const createItem = await this.itemsService.createItem(
        itemName,
        itemPrice,
        itemHealth,
        itemPower
      );

      return res
        .status(201)
        .json({ message: "아이템이 생성 되었습니다.", data: createItem });
    } catch (error) {
      next(error);
    }
  };

  getItems = async (req, res, next) => {
    try {
      const items = await this.itemsService.getItems();

      return res.status(200).json({ data: items });
    } catch (error) {
      next(error);
    }
  };

  getItem = async (req, res, next) => {
    try {
      const { itemId } = req.body;

      const getItem = await this.itemsService.getItem(itemId);

      return res.status(200).json({ data: getItem });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req, res, next) => {
    try {
      const { itemId, itemName, itemHealth, itemPower, itemPrice } = req.body;

      const updateItem = await this.itemsService.updateItem(
        itemId,
        itemName,
        itemHealth,
        itemPower,
        itemPrice
      );

      return res.status(200).json({
        message: "아이템이 정상적으로 업데이트 됬습니다.",
        updateItem,
      });
    } catch (error) {
      next(error);
    }
  };
}
