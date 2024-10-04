import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { CharactersController } from "../controller/characters.controller.js";
import { CharactersService } from "../services/characters.service.js";
import { CharactersRepository } from "../repositories/characters.repository.js";

const router = express.Router();

const charactersRepository = new CharactersRepository(prisma);
const charactersService = new CharactersService(charactersRepository);
const charactersController = new CharactersController(charactersService);

// 캐릭터 생성 API 구현
router.post(
  "/characters",
  authMiddleware,
  charactersController.createCharacter
);

// 캐릭터 삭제 API 구현
router.delete(
  "/characters",
  authMiddleware,
  charactersController.deleteCharacter
);

//캐릭터 상세 조회 API
router.get("/characters", authMiddleware, charactersController.getCharacter);

export default router;
