export declare const register: (data: import("./user.service.js").RegisterData) => Promise<{
    user: import("./user.service.js").UserProfile;
    token: string;
}>;
export declare const login: (data: import("./user.service.js").LoginData) => Promise<{
    user: import("./user.service.js").UserProfile;
    token: string;
}>;
export declare const getCurrentUser: (userId: string) => Promise<import("./user.service.js").UserProfile>;
//# sourceMappingURL=auth.service.d.ts.map
