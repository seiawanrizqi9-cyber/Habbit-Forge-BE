import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../service/category.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaInstance from "../database.js";

const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo);
const controller = new CategoryController(service);

const router = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get all system categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all system categories
 */
router.get("/", authenticate, controller.getAllCategoryHandler);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
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
 *         description: Category details
 */
router.get("/:id", authenticate, controller.getCategoryByIdHandler);

export default router;
