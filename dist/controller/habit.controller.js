import { successResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Frequency, Category } from "@prisma/client";
import { isValidDateString } from "../utils/timeUtils.js";
export class HabitController {
    habitService;
    constructor(habitService) {
        this.habitService = habitService;
    }
    getAllHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || "desc";
        const date = req.query.date;
        const showInactive = req.query.showInactive === "true";
        if (date && !isValidDateString(date)) {
            throw new Error("Format tanggal harus YYYY-MM-DD");
        }
        const result = await this.habitService.getAll({
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            showInactive,
        }, userId);
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages,
        };
        successResponse(res, "Daftar habit berhasil diambil", result.habits, pagination);
    });
    getHabitByIdHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const habit = await this.habitService.getHabitById(habitId, userId);
        successResponse(res, "Habit berhasil diambil", habit);
    });
    createHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const { title, description, isActive, category, startDate, frequency } = req.body;
        if (!title)
            throw new Error("Title diperlukan");
        if (!startDate)
            throw new Error("startDate diperlukan");
        if (!frequency)
            throw new Error("frequency diperlukan");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
            throw new Error("Format startDate harus YYYY-MM-DD");
        }
        if (!isValidDateString(startDate)) {
            throw new Error("Tanggal tidak valid");
        }
        if (!Object.values(Frequency).includes(frequency)) {
            throw new Error("Frequency tidak valid");
        }
        // Validate category if provided
        if (category && !Object.values(Category).includes(category)) {
            throw new Error("Kategori tidak valid");
        }
        const habit = await this.habitService.createHabit({
            title,
            description,
            isActive,
            userId,
            category: category || null,
            startDate,
            frequency,
        });
        successResponse(res, "Habit berhasil dibuat", habit, null, 201);
    });
    updateHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        if (req.body.startDate) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.startDate)) {
                throw new Error("Format startDate harus YYYY-MM-DD");
            }
            if (!isValidDateString(req.body.startDate)) {
                throw new Error("Tanggal tidak valid");
            }
        }
        // Validate category if provided
        if (req.body.category &&
            !Object.values(Category).includes(req.body.category)) {
            throw new Error("Kategori tidak valid");
        }
        const habit = await this.habitService.updateHabit(habitId, req.body, userId);
        successResponse(res, "Habit berhasil diupdate", habit);
    });
    deleteHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const deleted = await this.habitService.deleteHabit(habitId, userId);
        successResponse(res, "Habit berhasil dihapus permanen", deleted);
    });
    toggleHabitHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitId = req.params.id;
        if (!habitId)
            throw new Error("Habit ID diperlukan");
        const toggledHabit = await this.habitService.toggleHabit(habitId, userId);
        const message = toggledHabit.isActive
            ? "Habit berhasil diaktifkan"
            : "Habit berhasil dinonaktifkan";
        successResponse(res, message, toggledHabit);
    });
    getHabitsWithTodayStatusHandler = asyncHandler(async (req, res) => {
        const userId = req.user?.id;
        if (!userId)
            throw new Error("Unauthorized");
        const habitsWithStatus = await this.habitService.getHabitsWithTodayStatus(userId);
        successResponse(res, "Habits dengan status check-in hari ini berhasil diambil", habitsWithStatus);
    });
    // ✅ New endpoint untuk get available categories
    getCategoriesHandler = asyncHandler(async (_req, res) => {
        const categories = this.habitService.getAvailableCategories();
        successResponse(res, "Daftar kategori berhasil diambil", categories);
    });
}
