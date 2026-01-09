import express from "express";
import { getHabitStreak, getMonthlyStats } from "../controller/stat.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Advanced statistics
 */

/**
 * @swagger
 * /api/stat/habits/{id}/streak:
 *   get:
 *     summary: Get habit streak
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit streak data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     habitId:
 *                       type: string
 *                     streak:
 *                       type: integer
 *       404:
 *         description: Habit not found
 *       403:
 *         description: Forbidden (not owner)
 *       401:
 *         description: Unauthorized
 */
router.get("/habits/:id/streak", authenticate, getHabitStreak);

/**
 * @swagger
 * /api/stat/monthly:
 *   get:
 *     summary: Get monthly statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     habits:
 *                       type: integer
 *                     checkIns:
 *                       type: integer
 *                     completion:
 *                       type: integer
 *                       description: Completion percentage
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly", authenticate, getMonthlyStats);

export default router;