import express from "express";
import {
  getDashboard,
  getTodayHabits,
  getStats,
} from "../controller/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard data aggregation
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
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
 *                     totalHabits:
 *                       type: integer
 *                     activeHabits:
 *                       type: integer
 *                     totalCheckIns:
 *                       type: integer
 *                     streak:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getDashboard);

/**
 * @swagger
 * /api/dashboard/today:
 *   get:
 *     summary: Get today's habits with check-in status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's habits list
 *       401:
 *         description: Unauthorized
 */
router.get("/today", authenticate, getTodayHabits);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get detailed statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
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
 *                     habitsByCategory:
 *                       type: object
 *                     last7Days:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           checkIns:
 *                             type: integer
 *                     monthlyCompletion:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", authenticate, getStats);

export default router;