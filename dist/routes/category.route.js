import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../service/category.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaIntance from "../database.js";
const repo = new CategoryRepository(prismaIntance);
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
//# sourceMappingURL=category.route.js.map
