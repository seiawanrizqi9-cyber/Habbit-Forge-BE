import express from "express";
import {
  getHabitStreak,
  getMonthlyStats,
  getWeeklyProgress,
} from "../controller/stat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /stat/habits/{id}/streak:
 *   get:
 *     summary: Get habit streak count
 *     description: Calculate current streak for a specific habit (last consecutive days with check-ins)
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Streak berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     habitId:
 *                       type: string
 *                       format: uuid
 *                     streak:
 *                       type: integer
 *                       example: 14
 *                     habitTitle:
 *                       type: string
 *                       example: "Minum Air 8 Gelas"
 *                     currentStreak:
 *                       type: integer
 *                       example: 14
 *                     longestStreak:
 *                       type: integer
 *                       example: 30
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized
 */
router.get("/habits/:id/streak", authenticate, getHabitStreak);

/**
 * @swagger
 * /stat/habits/{id}/weekly:
 *   get:
 *     summary: Get weekly progress for habit
 *     description: Get check-in status for last 7 days for a specific habit
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
 *         description: Weekly progress data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Progress mingguan berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     habitId:
 *                       type: string
 *                       format: uuid
 *                     habitTitle:
 *                       type: string
 *                       example: "Minum Air 8 Gelas"
 *                     weekProgress:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                           day:
 *                             type: string
 *                             example: "Sen"
 *                           completed:
 *                             type: boolean
 *                             example: true
 *                           displayDate:
 *                             type: string
 *                             example: "15 Jan"
 *                     completedDays:
 *                       type: integer
 *                       example: 5
 *                     weeklyCompletion:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 100
 *                       example: 71
 *                     streak:
 *                       type: integer
 *                       example: 14
 *       404:
 *         description: Habit not found
 *       401:
 *         description: Unauthorized
 */
router.get("/habits/:id/weekly", authenticate, getWeeklyProgress);

/**
 * @swagger
 * /stat/monthly:
 *   get:
 *     summary: Get monthly statistics
 *     description: Get overall statistics for current month including completion rate and top habits
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Statistik bulanan berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     habits:
 *                       type: integer
 *                       description: Total active habits
 *                       example: 5
 *                     checkIns:
 *                       type: integer
 *                       description: Total check-ins this month
 *                       example: 45
 *                     completion:
 *                       type: integer
 *                       description: Completion rate percentage (0-100)
 *                       minimum: 0
 *                       maximum: 100
 *                       example: 75
 *                     month:
 *                       type: string
 *                       example: "Januari 2024"
 *                     topHabits:
 *                       type: array
 *                       description: Top 3 habits with highest streaks
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           title:
 *                             type: string
 *                             example: "Minum Air 8 Gelas"
 *                           streak:
 *                             type: integer
 *                             example: 14
 *                           category:
 *                             type: string
 *                             example: "HEALTHY"
 *                           color:
 *                             type: string
 *                             example: "#10B981"
 *       401:
 *         description: Unauthorized
 */
router.get("/monthly", authenticate, getMonthlyStats);

export default router;
