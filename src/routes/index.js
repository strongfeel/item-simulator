import express from "express";
import UserRouter from "./users.routers.js";
import CharacterRouter from "./characters.routers.js";
import ItemRouter from "./items.routers.js";

const router = express.Router();

router.use(UserRouter);
router.use(CharacterRouter);
router.use(ItemRouter);

export default router;
