import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import config from "../utils/env.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // ✅ TAMBAH RETURN!
    if (!authHeader) {
        return errorResponse(res, "token tidak ditemukan", 401);
    }
    const token = authHeader.split(" ")[1]; // ✅ Hapus optional chaining
    // ✅ VALIDASI TOKEN TIDAK KOSONG
    if (!token) {
        return errorResponse(res, "token tidak ditemukan", 401);
    }
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        // ✅ SET USER KE REQUEST
        req.user = payload;
        // ✅ LANJUT KE NEXT MIDDLEWARE/CONTROLLER
        next();
    }
    catch (error) {
        // ✅ TAMBAH RETURN!
        return errorResponse(res, "token tidak valid", 401);
    }
};
//# sourceMappingURL=auth.middleware.js.map
