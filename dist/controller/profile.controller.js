import { errorResponse, successResponse } from "../utils/response.js";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
        this.getProfileByIdHandler = this.getProfileByIdHandler.bind(this);
        this.updateProfileHandler = this.updateProfileHandler.bind(this);
    }
    async getProfileByIdHandler(req, res) {
        if (!req.params.id) {
            throw new Error("tidak ada param");
        }
        const profile = await this.profileService.getProfileById(req.params.id);
        successResponse(res, "profile sudah diambil", profile);
    }
    async updateProfileHandler(req, res) {
        try {
            const userId = req.params.id;
            const updateData = { ...req.body };
            // ✅ Handle uploaded file
            if (req.file) {
                // File path relatif dari public folder
                updateData.avatar = `/uploads/${req.file.filename}`;
            }
            const profile = await this.profileService.updateProfile(userId, updateData);
            successResponse(res, "profile berhasil di update", profile);
        }
        catch (error) {
            errorResponse(res, error.message, 400);
        }
    }
}
//# sourceMappingURL=profile.controller.js.map
