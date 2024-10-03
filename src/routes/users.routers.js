import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { UsersController } from "../controller/users.controller.js";
import { UsersService } from "../services/users.service.js";
import { UsersRepository } from "../repositories/users.repository.js";

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

// 회원가입 API 구현
router.post("/sign-up", usersController.createUser);
// 로그인 API 구현
router.post("/sign-in", usersController.getUserId);

export default router;
