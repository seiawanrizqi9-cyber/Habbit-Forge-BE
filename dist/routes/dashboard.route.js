import express from "express";
import { getDashboard, getTodayHabits, getStats, } from "../controller/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
const router = express.Router();
/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard overview
 *     description: Get overall dashboard statistics including streak count
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dashboard data retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalHabits:
 *                       type: integer
 *                       example: 8
 *                     activeHabits:
 *                       type: integer
 *                       example: 5
 *                     totalCheckIns:
 *                       type: integer
 *                       example: 120
 *                     streak:
 *                       type: integer
 *                       description: "Current consecutive days with at least one check-in"
 *                       example: 14
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getDashboard);
/**
 * @swagger
 * /dashboard/today:
 *   get:
 *     summary: Get today's habits with check-in status
 *     description: List all active habits with today's check-in status
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's habits list
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
 *                   example: "Today's habits retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                         example: "Minum Air 8 Gelas"
 *                       description:
 *                         type: string
 *                         example: "Minimal 8 gelas air setiap hari"
 *                       category:
 *                         type: string
 *                         example: "HEALTHY"
 *                       isCompleted:
 *                         type: boolean
 *                         description: "Whether habit has been checked in today"
 *                         example: true
 *                       checkInTime:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2024-01-15T08:30:00.000Z"
 *       401:
 *         description: Unauthorized
 */
router.get("/today", authenticate, getTodayHabits);
/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get detailed statistics
 *     description: Get detailed statistics including category distribution and 7-day progress
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
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Statistics retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     habitsByCategory:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         HEALTHY: 3
 *                         LEARNING: 2
 *                         FINANCE: 1
 *                     last7Days:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-15"
 *                           dateDisplay:
 *                             type: string
 *                             example: "Sen, 15 Jan"
 *                           checkIns:
 *                             type: integer
 *                             example: 5
 *                     monthlyCompletion:
 *                       type: integer
 *                       minimum: 0
 *                       maximum: 100
 *                       example: 75
 *       401:
 *         description: Unauthorized
 */
router.get("/stats", authenticate, getStats);
export default router;
