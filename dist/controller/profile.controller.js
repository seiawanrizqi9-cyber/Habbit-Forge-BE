import { successResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
    }
    getProfileByIdHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const profile = await this.profileService.getProfileByUserId(userId);
        successResponse(res, "Profile berhasil diambil", profile);
    });
    updateProfileHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        // Build update data
        const updateData = { ...req.body };
        // Handle file upload if exists
        if (req.file) {
            updateData.avatar = `/uploads/${req.file.filename}`;
            // 🆕 Optional: Delete old avatar file if exists
            // Bisa implement di service layer nanti
        }
        // Validate input
        if (updateData.fullName && updateData.fullName.length > 100) {
            throw new Error("Nama lengkap maksimal 100 karakter");
        }
        if (updateData.bio && updateData.bio.length > 500) {
            throw new Error("Bio maksimal 500 karakter");
        }
        const profile = await this.profileService.updateProfile(userId, updateData);
        successResponse(res, "Profile berhasil diupdate", profile);
    });
}
