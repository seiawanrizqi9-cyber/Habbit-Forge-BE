import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
let prisma = null;
function getPrisma() {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    return prisma;
}
router.post("/seed/categories", async (req, res) => {
    const secret = req.headers["x-seed-secret"];
    if (secret !== process.env.SEED_SECRET) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const prisma = getPrisma();
    const categories = [
        { name: "Health", color: "#4CAF50" },
        { name: "Productivity", color: "#2196F3" },
        { name: "Learning", color: "#FF9800" },
    ];
    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: category,
        });
    }
    res.json({ message: "✅ Categories seeded" });
});
export default router;
