import { Router } from "express";
import { CategoryController } from "../controller/category.controller";
import { CategoryRepository } from "../repository/category.repository";
import { CategoryService } from "../service/category.service";
import { authenticate } from "../middleware/auth.middleware";
import prismaInstance from "../database";

const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo);
const controller = new CategoryController(service);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by category name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, controller.getAllCategoryHandler);

/**
 * @swagger
 * /api/category/{id}:
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
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authenticate, controller.getCategoryByIdHandler);

export default router;