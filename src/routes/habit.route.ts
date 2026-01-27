import { Router } from "express";
import { HabitController } from "../controller/habit.controller.js";
import { HabitRepository } from "../repository/habit.repository.js";
import { HabitService } from "../service/habit.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.js";
import {
  createHabitValidation,
  updateHabitValidation,
} from "../middleware/habit.validation.js";
import prismaInstance from "../database.js";

const repo = new HabitRepository(prismaInstance);
const service = new HabitService(repo);
const controller = new HabitController(service);

const router = Router();

/**
 * @swagger
 * /habit:
 *   get:
 *     summary: Get all habits for current user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of habits
 */
router.get("/", authenticate, controller.getAllHabitHandler);

/**
 * @swagger
 * /habit/today-status:
 *   get:
 *     summary: Get habits with today's check-in status
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Habits with check-in status
 */
router.get(
  "/today-status",
  authenticate,
  controller.getHabitsWithTodayStatusHandler,
);

/**
 * @swagger
 * /habit/categories:
 *   get:
 *     summary: Get available category enum values
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available categories
 */
router.get("/categories", authenticate, controller.getCategoriesHandler);

/**
 * @swagger
 * /habit:
 *   post:
 *     summary: Create new habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - frequency
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               category:
 *                 type: string
 *                 enum: [HEALTHY, FINANCE, WORK, LEARNING, SOCIAL]
 *               startDate:
 *                 type: string
 *                 format: date
 *               frequency:
 *                 type: string
 *                 enum: [DAILY, WEEKLY, MONTHLY, YEARLY]
 *     responses:
 *       201:
 *         description: Habit created
 */
router.post(
  "/",
  authenticate,
  validate(createHabitValidation),
  controller.createHabitHandler,
);

/**
 * @swagger
 * /habit/{id}:
 *   get:
 *     summary: Get habit by ID
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Habit details
 */
router.get("/:id", authenticate, controller.getHabitByIdHandler);

/**
 * @swagger
 * /habit/{id}:
 *   put:
 *     summary: Update habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [HEALTHY, FINANCE, WORK, LEARNING, SOCIAL]
 *     responses:
 *       200:
 *         description: Habit updated
 */
router.put(
  "/:id",
  authenticate,
  validate(updateHabitValidation),
  controller.updateHabitHandler,
);

/**
 * @swagger
 * /habit/{id}:
 *   delete:
 *     summary: Delete habit permanently
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Habit deleted
 */
router.delete("/:id", authenticate, controller.deleteHabitHandler);

/**
 * @swagger
 * /habit/{id}/toggle:
 *   put:
 *     summary: Toggle habit active status
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Habit status toggled
 */
router.put("/:id/toggle", authenticate, controller.toggleHabitHandler);

export default router;
