import {PrismaClient} from "./generated/client";
import {Pool} from "pg";
import {PrismaPg} from "../node_modules/@prisma/adapter-pg/dist/index";
import config from './utils/env'

let prisma: PrismaClient;

const getPrisma = () => {
    if (!prisma) {
        const pool = new Pool({connectionString: config.DATABASE_URL})
        const adapter = new PrismaPg(pool)
        prisma = new PrismaClient({adapter})
    }
    return prisma;
};

export const prismaInstance = getPrisma()


export default prismaInstance