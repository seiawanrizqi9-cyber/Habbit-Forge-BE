import { Router } from "express"
import { ProfileController } from "../controller/profile.controller";
import { ProfileRepository } from "../repository/profile.repository";
import { ProfileService } from "../service/profile.service";
import { authenticate } from "../middleware/auth.middleware";
import prismaIntance from "../database";

const repo = new ProfileRepository(prismaIntance)
const service = new ProfileService(repo)
const controller = new ProfileController(service)

const router = Router()

router.get('/', authenticate, controller.getProfileByIdHandler)
router.put('/:id', authenticate, controller.updateProfileHandler)

export default router