import type { Request, Response } from "express";
import prisma from "../database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { formatDateForFE } from "../utils/timeUtils.js";

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

    // Hitung streak real-time
    const streak = await calculateHabitStreakOptimized(habitId);

    successResponse(res, "Streak berhasil diambil", {
      habitId,
      streak,
      habitTitle: habit.title,
      startDate: formatDateForFE(habit.startDate),
    });
  },
);

async function calculateHabitStreakOptimized(habitId: string): Promise<number> {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  ninetyDaysAgo.setHours(0, 0, 0, 0);

  const checkIns = await prisma.checkIn.findMany({
    where: {
      habitId,
      date: { gte: ninetyDaysAgo },
    },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  const checkInDates = new Set<string>();
  checkIns.forEach((checkIn) => {
    const dateStr = formatDateForFE(checkIn.date);
    checkInDates.add(dateStr);
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 90; i++) {
    const dateStr = formatDateForFE(currentDate);
    if (checkInDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const getMonthlyStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const habits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    const checkIns = await prisma.checkIn.count({
      where: {
        userId,
        date: { gte: firstDay },
      },
    });

    const days = today.getDate();
    const completion =
      habits > 0 ? Math.round((checkIns / (habits * days)) * 100) : 0;

    // 🆕 Ambil semua habits aktif untuk hitung streak
    const allHabits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        category: {
          select: { name: true, color: true },
        },
      },
    });

    // 🆕 Hitung streak untuk setiap habit
    const habitsWithStreak = await Promise.all(
      allHabits.map(async (habit) => {
        const streak = await calculateHabitStreakOptimized(habit.id);
        return {
          id: habit.id,
          title: habit.title,
          streak,
          startDate: formatDateForFE(habit.startDate),
          category: habit.category?.name || "No category",
          color: habit.category?.color || "#6B7280",
        };
      }),
    );

    // Sort by streak desc dan ambil top 3
    const topHabits = habitsWithStreak
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);

    successResponse(res, "Statistik bulanan berhasil diambil", {
      habits,
      checkIns,
      completion,
      month: today.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
      topHabits,
    });
  },
);

export const getWeeklyProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.id;

    if (!userId || !habitId) {
      throw new Error("Bad request");
    }

    // Validasi ownership
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) throw new Error("Habit not found");

    // Ambil check-ins 7 hari terakhir
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const checkIns = await prisma.checkIn.findMany({
      where: {
        habitId,
        date: { gte: sevenDaysAgo },
      },
      select: { date: true },
    });

    // Group by day
    const checkInsByDay = new Set<string>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date);
      checkInsByDay.add(dateStr);
    });

    // Format response
    const weekProgress = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateStr = formatDateForFE(date);
      const hasCheckIn = checkInsByDay.has(dateStr);

      weekProgress.push({
        date: dateStr,
        day: date.toLocaleDateString("id-ID", { weekday: "short" }),
        completed: hasCheckIn,
        displayDate: date.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
      });
    }

    const completedDays = weekProgress.filter((day) => day.completed).length;
    const weeklyCompletion = Math.round((completedDays / 7) * 100);

    // 🆕 Hitung streak real-time untuk habit ini
    const streak = await calculateHabitStreakOptimized(habitId);

    successResponse(res, "Progress mingguan berhasil diambil", {
      habitId,
      habitTitle: habit.title,
      startDate: formatDateForFE(habit.startDate),
      weekProgress,
      completedDays,
      weeklyCompletion,
      streak,
    });
  },
);
