import { Router } from "express";
import { HabitController } from "../controller/habit.controller";
import { HabitRepository } from "../repository/habit.repository";
import { HabitService } from "../service/habit.service";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../utils/validation";
import { createHabitValidation, updateHabitValidation } from "../middleware/habit.validation";
import prismaInstance from "../database";

const repo = new HabitRepository(prismaInstance);
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

router.get("/", authenticate, controller.getAllHabitHandler);
router.post("/", authenticate, validate(createHabitValidation), controller.createHabitHandler);
router.get("/:id", authenticate, controller.getHabitByIdHandler); // ⭐ HAPUS checkHabitOwnership
router.put("/:id", authenticate, validate(updateHabitValidation), controller.updateHabitHandler); // ⭐ HAPUS checkHabitOwnership
router.delete("/:id", authenticate, controller.deleteHabitHandler); // ⭐ HAPUS checkHabitOwnership
router.put("/:id/toggle", authenticate, controller.toggleHabitHandler); // ⭐ HAPUS checkHabitOwnership

export default router;