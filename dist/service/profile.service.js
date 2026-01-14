export class ProfileService {
    profileRepo;
    constructor(profileRepo) {
        this.profileRepo = profileRepo;
    }
    async getProfileByUserId(userId) {
        const profile = await this.profileRepo.findByUserId(userId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return profile;
    }
    async updateProfile(userId, data) {
        return await this.profileRepo.updateByUserId(userId, data);
    }
}
//# sourceMappingURL=profile.service.js.map