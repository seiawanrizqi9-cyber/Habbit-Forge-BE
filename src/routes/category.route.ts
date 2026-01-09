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
 *  name: Category
 *  description: Manajemen kategori pengguna
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: mengambil semua Kategori
 *     tags: [Category]
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *
 *     responses:
 *       200:
 *         description:  koneksi terhubung
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
 *                 pagination:
 *                   type: object
 *                 errors:
 *                   type: object
 *
 *       401:
 *         description: koneksi tidak terhubung
 */
router.get("/", authenticate, controller.getAllCategoryHandler);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: menyortir bagian kategori
 *     tags: [Category]
 *
 *     responses:
 *       200:
 *         description:  koneksi terhubung
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
 *                 pagination:
 *                   type: object
 *                 errors:
 *                   type: object
 *
 *       401:
 *         description: koneksi tidak terhubung
 */
router.get("/:id", authenticate, controller.getCategoryByIdHandler);

export default router;
