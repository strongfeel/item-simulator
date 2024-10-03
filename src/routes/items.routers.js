import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

// 아이템 생성 API 구현
router.post("/items", async (req, res, next) => {
  try {
    const { itemName, itemPrice, itemHealth, itemPower } = req.body;

    // 아이템 닉네임 중복 조사
    const isExistItemName = await prisma.items.findFirst({
      where: { itemName },
    });

    if (isExistItemName) {
      return res
        .status(404)
        .json({ message: "이미 존재하는 아이템 이름 입니다." });
    }

    await prisma.items.create({
      data: {
        itemName: itemName,
        itemPrice: itemPrice,
        itemHealth: itemHealth,
        itemPower: itemPower,
      },
    });

    return res.status(201).json({ message: "아이템이 생성 되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 아이템 목록 조회 API 구현
router.get("/items", async (req, res, next) => {
  const items = await prisma.items.findMany({
    select: {
      itemId: true,
      itemName: true,
      itemPrice: true,
    },
    orderBy: {
      createdAt: "desc", // 아이템을 최신순으로 정렬
    },
  });

  if (!items)
    return res.status(404).json({ message: "생성된 아이템이 없습니다." });

  return res.status(200).json({ data: items });
});

//아이템 상세 조회 API 구현
router.get("/itemDetail", async (req, res, next) => {
  const { itemId } = req.body;

  const item = await prisma.items.findUnique({
    where: {
      itemId: +itemId,
    },
  });

  if (!item)
    return res.status(404).json({ message: "생성된 아이템이 없습니다." });

  return res.status(200).json({ data: item });
});

// 아이템 업데이트 API 구현
router.put("/items", async (req, res, next) => {
  try {
    const { itemId, itemName, itemHealth, itemPower, itemPrice } = req.body;

    const itemExist = await prisma.items.findFirst({
      where: { itemId: +itemId },
    });

    if (!itemExist) {
      return res.status(404).json({ message: "생성된 아이템이 없습니다." });
    }

    const updateItem = await prisma.items.update({
      where: { itemId: +itemId },
      data: {
        itemName: itemName,
        itemHealth: itemHealth,
        itemPower: itemPower,
        itemPrice: itemPrice,
      },
    });

    return res.status(200).json({
      message: "아이템이 정상적으로 업데이트 됬습니다.",
      updateItem,
    });
  } catch (err) {
    console.log("에이템 수정중 오류 발생:", err);
    next(err);
  }
});

export default router;
