export interface RegisterData {
    username: string;
    email: string;
    password: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface UserProfile {
    id: string;
    email: string;
    username: string;
    profile: {
        fullName?: string;
        bio?: string;
        avatar?: string;
    } | null;
    createdAt: Date;
}
export declare class UserService {
    register(data: RegisterData): Promise<{
        user: UserProfile;
        token: string;
    }>;
    login(data: LoginData): Promise<{
        user: UserProfile;
        token: string;
    }>;
    getCurrentUser(userId: string): Promise<UserProfile>;
    private generateToken;
    private formatUserResponse;
}
//# sourceMappingURL=user.service.d.ts.map