import { Router } from "express";
import { CheckInController } from "../controller/checkIn.controller.js";
import { CheckInRepository } from "../repository/checkIn.repository.js";
import { CheckInService } from "../service/checkIn.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import prismaIntance from "../database.js";
const repo = new CheckInRepository(prismaIntance);
const service = new CheckInService(repo);
const controller = new CheckInController(service);
const router = Router();
/**
 * @swagger
 * /CheckIn/{id}:
 *   get:
 *     summary: menyortir bagian checkIn
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
router.get("/:id", authenticate, controller.getCheckInByIdHandler);
/**
 * @swagger
 * /checkIn/{id}:
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
 *               - habitId
 *               - userId
 *               - date
 *
 *             properties:
 *               habitId:
 *                 type: habitId
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               userId:
 *                 type: userId
 *                 format: uuid
 *                 example: "456e4567-e89b-12d3-a456-426614174001"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "Tanggal check-in (format YYYY-MM-DD)"
 *               note:
 *                 type: string
 *                 format: note
 *                 example: "Hari ini berhasil olahraga 30 menit"
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
router.post("/", authenticate, controller.createCheckInHandler);
/**
 * @swagger
 * /checkIn/{id}:
 *   put:
 *     summary: melakukan update pada checkIn
 *     tags: [Book]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID checkIn yang akan diupdate
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               habitId:
 *                 type: habitId
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               userId:
 *                 type: userId
 *                 format: uuid
 *                 example: "456e4567-e89b-12d3-a456-426614174001"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "Tanggal check-in (format YYYY-MM-DD)"
 *               note:
 *                 type: string
 *                 format: note
 *                 example: "Hari ini berhasil olahraga 30 menit"
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
router.put("/:id", authenticate, controller.updateCheckInHandler);
/**
 * @swagger
 * /checkIn/{id}:
 *   delete:
 *     summary: menghapus checkIn
 *     tags: [Book]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID checkIn yang akan dihapus
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
router.delete("/:id", authenticate, controller.deleteCheckInHandler);
export default router;
//# sourceMappingURL=checkIn.route.js.map
