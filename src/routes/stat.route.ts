import express from "express";
import { getHabitStreak, getMonthlyStats } from "../controller/stat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);
router.get("/habits/:id/streak", getHabitStreak);
router.get("/monthly", getMonthlyStats);

export default router;
