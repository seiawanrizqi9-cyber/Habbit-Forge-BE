import { Prisma } from "@prisma/client";
import prisma from "../database.js";
import { parseDateFromFE, formatDateForFE, getTodayDateString, isValidDateString, } from "../utils/timeUtils.js";
export class CheckInService {
    checkInRepo;
    constructor(checkInRepo) {
        this.checkInRepo = checkInRepo;
    }
    async getCheckInById(id, userId) {
        const checkIn = await this.checkInRepo.findById(id);
        if (!checkIn) {
            throw new Error("CheckIn tidak ditemukan");
        }
        if (checkIn.userId !== userId) {
            throw new Error("Akses ditolak");
        }
        return this.formatCheckInResponse(checkIn);
    }
    async createCheckIn(data) {
        const checkInDateStr = data.date && isValidDateString(data.date)
            ? data.date
            : getTodayDateString(); // 🆕 UTC date string
        const checkInDate = parseDateFromFE(checkInDateStr); // 🆕 UTC Date
        // Validasi habit exists, active, dan milik user
        const habit = await prisma.habit.findFirst({
            where: {
                id: data.habitId,
                userId: data.userId,
                isActive: true,
            },
        });
        if (!habit) {
            throw new Error("Habit tidak ditemukan atau tidak aktif");
        }
        // Validasi habit start date (UTC comparison)
        if (checkInDate < habit.startDate) {
            const habitStartStr = formatDateForFE(habit.startDate);
            throw new Error(`Tidak bisa check-in sebelum ${habitStartStr}`);
        }
        try {
            // Database constraint akan handle race condition & duplikasi
            const input = {
                date: checkInDate,
                habit: { connect: { id: data.habitId } },
                user: { connect: { id: data.userId } },
            };
            if (data.note !== undefined) {
                input.note = data.note;
            }
            const checkIn = await this.checkInRepo.create(input);
            return this.formatCheckInResponse(checkIn);
        }
        catch (error) {
            // Tangkap Prisma constraint violation error
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new Error(`Sudah check-in pada tanggal ${checkInDateStr}`);
                }
            }
            throw error;
        }
    }
    async updateCheckIn(id, data, userId) {
        await this.getCheckInById(id, userId);
        const updateData = {};
        if (data.note !== undefined) {
            updateData.note = data.note;
        }
        const updated = await this.checkInRepo.update(id, updateData);
        return this.formatCheckInResponse(updated);
    }
    async deleteCheckIn(id, userId) {
        await this.getCheckInById(id, userId);
        const deleted = await this.checkInRepo.delete(id);
        return this.formatCheckInResponse(deleted);
    }
    formatCheckInResponse(checkIn) {
        const response = {
            id: checkIn.id,
            habitId: checkIn.habitId,
            userId: checkIn.userId,
            date: formatDateForFE(checkIn.date), // 🆕 UTC to string
            note: checkIn.note,
            createdAt: checkIn.createdAt,
        };
        // Include relations jika ada
        const checkInWithRelations = checkIn;
        if (checkInWithRelations.habit) {
            response.habit = checkInWithRelations.habit;
        }
        if (checkInWithRelations.user) {
            response.user = checkInWithRelations.user;
        }
        return response;
    }
}
