// routes/profile.route.ts - UPDATE
import { Router } from "express";
import { ProfileController } from "../controller/profile.controller.js";
import { ProfileRepository } from "../repository/profile.repository.js";
import { ProfileService } from "../service/profile.service.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import prismaIntance from "../database.js";
const repo = new ProfileRepository(prismaIntance);
const service = new ProfileService(repo);
const controller = new ProfileController(service);
const router = Router();
router.get("/", authenticate, controller.getProfileByIdHandler);
router.put("/:id", authenticate, upload.single("avatar"), controller.updateProfileHandler);
export default router;
//# sourceMappingURL=profile.route.js.map
