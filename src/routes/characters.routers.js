import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 캐릭터 생성 API 구현
router.post("/characters", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { characterName, health, power, money } = req.body;

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
    },
  });

  return res.status(201).json({ data: character });
});

// 캐릭터 삭제 API 구현
router.delete(
  "/characters/:characterId",
  authMiddleware,
  async (req, res, next) => {
    const { characterId } = req.params;
    const { userId } = req.user;

    const character = await prisma.characters.findFirst({
      where: { characterId: +characterId },
    });
    if (!character)
      return res.status(404).json({ message: "캐릭터가 존재하지 않습니다." });

    const deleteCharacter = await prisma.characters.delete({
      where: {
        characterId: +characterId,
        userId: +userId,
      },
    });

    return res.status(200).json({ data: deleteCharacter });
  }
);

export default router;
