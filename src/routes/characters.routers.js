import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 캐릭터 생성 API 구현
router.post("/characters", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { characterName } = req.body;

    // 캐릭터 닉네임 중복 조사
    const isExistCharterName = await prisma.characters.findFirst({
      where: { characterName },
    });

    if (isExistCharterName) {
      return res.status(404).json({ message: "이미 존재하는 닉네임 입니다." });
    }

    const character = await prisma.characters.create({
      data: {
        userId: +userId,
        characterName: characterName,
        health: 500,
        power: 100,
        money: 10000,
        characterInventory: {
          create: [],
        },
        characterItems: {
          create: [],
        },
      },
      include: {
        characterInventory: true,
        characterInventory: true,
      },
    });

    return res.status(201).json({ characterId: character.characterId });
  } catch (err) {
    next(err);
  }
});

// 캐릭터 삭제 API 구현
router.delete(
  "/characters/:characterId",
  authMiddleware,
  async (req, res, next) => {
    const { characterId } = req.params;
    const { userId } = req.user;

    try {
      const character = await prisma.characters.findFirst({
        where: { characterId: +characterId },
      });

      if (!character)
        return res.status(404).json({ message: "캐릭터가 존재하지 않습니다." });

      if (character.userId !== userId) {
        return res
          .status(403)
          .json({ message: "해당 캐릭터를 삭제할 권한이 없습니다." });
      }

      await prisma.characters.delete({
        where: {
          characterId: +characterId,
        },
      });

      return res
        .status(202)
        .json({ message: "캐릭터가 정상적으로 삭제 되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

//캐릭터 상세 조회 API
router.get(
  "/characters/:characterId",
  authMiddleware,
  async (req, res, next) => {
    const { characterId } = req.params;
    const { userId } = req.user;

    try {
      const character = await prisma.characters.findFirst({
        where: {
          characterId: +characterId,
        },
      });

      if (!character)
        return res.status(404).json({ message: "캐릭터가 존재하지 않습니다." });

      const isOwner = character.userId === userId;

      const characterData = {
        characterName: character.characterName,
        characterHealth: character.health,
        characterPower: character.power,
      };

      if (isOwner) {
        characterData.money = character.money;
      }

      return res.status(200).json({ data: characterData });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
