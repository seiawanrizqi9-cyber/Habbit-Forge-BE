import type { Request, Response } from "express";
import prisma from "../database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { getStartOfDate } from "../utils/timeUtils.js";

export const getHabitStreak = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.id;

    if (!userId || !habitId) {
      throw new Error("Bad request");
    }

    // Validasi habit milik user
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) throw new Error("Habit not found");

    // Ambil 60 hari terakhir sekaligus (lebih efisien)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    sixtyDaysAgo.setHours(0, 0, 0, 0);

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habitId,
        date: { gte: sixtyDaysAgo },
      },
      select: { date: true },
      orderBy: { date: "desc" },
    });

    // Kelompokkan per hari
    const checkInDays = new Set(
      checkIns.map((checkIn) => {
        const date = new Date(checkIn.date);
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      }),
    );

    // Hitung streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];

      if (checkInDays.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    successResponse(res, "Streak berhasil diambil", {
      habitId,
      streak,
      habitTitle: habit.title,
    });
  },
);

export const getMonthlyStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonth = getStartOfDate(firstDay);

    const habits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    const checkIns = await prisma.checkIn.count({
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    const days = today.getDate();
    const completion =
      habits > 0 ? Math.round((checkIns / (habits * days)) * 100) : 0;

    successResponse(res, "Statistik bulanan berhasil diambil", {
      habits,
      checkIns,
      completion,
      month: today.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
    });
  },
);
