import { Router } from "express";
import { CheckInController } from "../controller/checkIn.controller";
import { CheckInRepository } from "../repository/checkIn.repository";
import { CheckInService } from "../service/checkIn.service";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../utils/validation";
import { createCheckInValidation, updateCheckInValidation } from "../middleware/checkIn.validation";
import prismaInstance from "../database";

const repo = new CheckInRepository(prismaInstance);
const service = new CheckInService(repo);
const controller = new CheckInController(service);

const router = Router();

router.get("/:id", authenticate, controller.getCheckInByIdHandler); // ⭐ HAPUS checkCheckInOwnership
router.post("/", authenticate, validate(createCheckInValidation), controller.createCheckInHandler); // ⭐ HAPUS checkHabitAccessForCheckIn
router.put("/:id", authenticate, validate(updateCheckInValidation), controller.updateCheckInHandler); // ⭐ HAPUS checkCheckInOwnership
router.delete("/:id", authenticate, controller.deleteCheckInHandler); // ⭐ HAPUS checkCheckInOwnership

export default router;