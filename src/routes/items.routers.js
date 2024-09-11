import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

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

    const [item, itemInfo] = await prisma.$transaction(
      async (tx) => {
        const item = await tx.items.create({
          data: {
            itemName,
            itemPrice,
          },
        });

        const itemInfo = await tx.itemInfos.create({
          data: {
            itemId: item.itemId,
            itemHealth,
            itemPower,
          },
        });

        return [item, itemInfo];
      },
      {
        // 격리수준 설정
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

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
router.get("/items/:itemId", async (req, res, next) => {
  const { itemId } = req.params;

  const item = await prisma.items.findFirst({
    where: {
      itemId: +itemId,
    },
    select: {
      itemId: true,
      itemName: true,
      itemPrice: true,
      itemInfos: {
        select: { itemHealth: true, itemPower: true },
      },
    },
  });

  if (!item)
    return res.status(404).json({ message: "생성된 아이템이 없습니다." });

  return res.status(200).json({ data: item });
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
      createdAt: "desc", // 게시글을 최신순으로 정렬
    },
  });

  if (!items)
    return res.status(404).json({ message: "생성된 아이템이 없습니다." });

  return res.status(200).json({ data: items });
});

// 아이템 업데이트 API 구현
router.patch("/items/:itemId", async (req, res, next) => {
  try {
    const { itemName, itemHealth, itemPower } = req.body;
    const { itemId } = req.params;

    const itemExist = await prisma.items.findFirst({
      where: { itemId: +itemId },
    });

    if (!itemExist) {
      return res.status(404).json({ message: "생성된 아이템이 없습니다." });
    }

    const [item, itemInfo] = await prisma.$transaction(
      async (tx) => {
        const item = await tx.items.update({
          data: {
            itemName,
          },
          where: { itemId: itemExist.itemId },
        });

        if (!itemHealth) {
          const itemInfo = await tx.itemInfos.update({
            data: {
              itemId: item.itemId,
              itemHealth: 0,
              itemPower,
            },
            where: {
              itemId: itemExist.itemId,
            },
          });
          return [itemInfo];
        }

        if (!itemPower) {
          const itemInfo = await tx.itemInfos.update({
            data: {
              itemId: item.itemId,
              itemHealth,
              itemPower: 0,
            },
            where: {
              itemId: itemExist.itemId,
            },
          });
          return [itemInfo];
        }

        return [item];
      },
      {
        // 격리수준 설정
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return res.status(201).json({ message: "아이템이 업데이트 되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
