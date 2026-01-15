import { Router } from "express";
import { HabitController } from "../controller/habit.controller.js";
import { HabitRepository } from "../repository/habit.repository.js";
import { HabitService } from "../service/habit.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaIntance from "../database.js";
const repo = new HabitRepository(prismaIntance);
const service = new HabitService(repo);
const controller = new HabitController(service);
const router = Router();
/**
 * @swagger
 * tags:
 *  name: Book
 *  description: Manajemen book pengguna
 */
/**
 * @swagger
 * /book:
 *   get:
 *     summary: mengambil semua book
 *     tags: [Book]
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
router.get("/", authenticate, controller.getAllHabitHandler);
/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: mencari book berdasarkan ID
 *     tags: [Book]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID book yang dicari
 *         schema:
 *           type: integer
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
router.get("/:id", authenticate, controller.getHabitByIdHandler);
/**
 * @swagger
 * /book/{id}:
 *   post:
 *     summary: membuat Book baru
 *     tags: [Book]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *
 *             properties:
 *               title:
 *                 type: string
 *                 format: title
 *                 example:  "hina pemerintah 12 reps"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 format: description
 *                 example: "rutinitas ini diperlukan untuk memperlancar peredaran darah"
 *               isActive:
 *                 type: boolean
 *                 format: isActive
 *                 example: true
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               categoryId:
 *                  type: string
 *                  format: uuid
 *                  example: "660e8400-e29b-41d4-a716-446655440001"
 *
 *     responses:
 *       200:
 *         description: data berhasil masuk
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
router.post("/", authenticate, controller.createHabitHandler);
router.put("/:id", authenticate, controller.updateHabitHandler);
router.delete("/:id", authenticate, controller.deleteHabitHandler);
router.put("/api/habits/:id/toggle", authenticate, controller.toggleHabitHandler);
export default router;
//# sourceMappingURL=habit.route.js.map
