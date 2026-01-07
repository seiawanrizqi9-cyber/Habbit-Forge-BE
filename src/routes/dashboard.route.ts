// routes/dashboardRoutes.ts
import express from 'express';
import { 
  getDashboard, 
  getTodayHabits, 
  getStats 
} from '../controller/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Semua route butuh authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *  name: dashboard
 *  description: Manajemen dashboard pengguna
 */



/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: mengambil semua dashboard
 *     tags: [Dashboard]
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

// GET /api/dashboard
router.get('/', getDashboard);



/**
 * @swagger
 * /dashboard/today:
 *   get:
 *     summary: mengambil semua Kategori
 *     tags: [Dashboard]
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
// GET /api/dashboard/today
router.get('/today', getTodayHabits);


/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: menyortir bagian dashboard
 *     tags: [Dashboard]
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
// GET /api/dashboard/stats
router.get('/stats', getStats);

export default router;