import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js"; // ← TAMBAH INI
const router = Router();
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authenticate, authController.meController);
export default router;
//# sourceMappingURL=auth.route.js.map
