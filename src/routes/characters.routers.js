import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 캐릭터 생성 API 구현
router.post("/characters", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { characterName, health, power, money } = req.body;

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

export default router;
