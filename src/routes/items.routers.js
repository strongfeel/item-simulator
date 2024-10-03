import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { ItemsController } from "../controller/items.controller.js";
import { ItemsService } from "../services/items.service.js";
import { ItemsRepository } from "../repositories/items.repository.js";

const router = express.Router();

const itemsRepository = new ItemsRepository(prisma);
const itemsService = new ItemsService(itemsRepository);
const itemsController = new ItemsController(itemsService);

// 아이템 생성 API 구현
router.post("/items", itemsController.createItem);
// 아이템 목록 조회 API 구현
router.get("/items", itemsController.getItems);
//아이템 상세 조회 API 구현
router.get("/itemDetail", itemsController.getItem);
// 아이템 업데이트 API 구현
router.put("/items", itemsController.updateItem);

export default router;
