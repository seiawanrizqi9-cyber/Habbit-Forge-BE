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

    // Hitung streak habit (OPTIMIZED)
    const streak = await calculateHabitStreakOptimized(habitId);

    successResponse(res, "Streak berhasil diambil", {
      habitId,
      streak,
      habitTitle: habit.title,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
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

    // 1. Hitung habits aktif (1 query)
    const habits = await prisma.habit.count({
      where: { userId, isActive: true },
    });

    // 2. Hitung check-ins bulan ini (1 query)
    const checkIns = await prisma.checkIn.count({
      where: {
        userId,
        date: { gte: startOfMonth },
      },
    });

    const days = today.getDate();
    const completion =
      habits > 0 ? Math.round((checkIns / (habits * days)) * 100) : 0;

    // 3. Ambil top 3 habits dengan streak tertinggi (1 query)
    const topHabits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
        currentStreak: { gt: 0 },
      },
      select: {
        id: true,
        title: true,
        currentStreak: true,
        category: {
          select: { name: true, color: true },
        },
      },
      orderBy: { currentStreak: "desc" },
      take: 3,
    });

    successResponse(res, "Statistik bulanan berhasil diambil", {
      habits,
      checkIns,
      completion,
      month: today.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
      }),
      topHabits: topHabits.map((habit) => ({
        id: habit.id,
        title: habit.title,
        streak: habit.currentStreak,
        category: habit.category?.name || "No category",
        color: habit.category?.color || "#6B7280",
      })),
    });
  },
);

// ========== HELPER FUNCTIONS ==========

/**
 * Safe method untuk get date key
 */
function getDateKey(date: Date): string | null {
  try {
    const isoString = date.toISOString();
    const parts = isoString.split("T");
    if (parts.length < 2) return null;

    const dateKey = parts[0];
    return dateKey || null;
  } catch (error) {
    return null;
  }
}

/**
 * Hitung streak untuk habit tertentu (OPTIMIZED)
 */
async function calculateHabitStreakOptimized(habitId: string): Promise<number> {
  // Ambil 90 hari terakhir sekaligus
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  ninetyDaysAgo.setHours(0, 0, 0, 0);

  // 1 QUERY untuk semua check-in
  const checkIns = await prisma.checkIn.findMany({
    where: {
      habitId,
      date: { gte: ninetyDaysAgo },
    },
    select: { date: true },
    orderBy: { date: "desc" },
  });

  // Convert ke Set of dates
  const checkInDates = new Set<string>();
  checkIns.forEach((checkIn) => {
    const dateKey = getDateKey(new Date(checkIn.date));
    if (dateKey) {
      checkInDates.add(dateKey);
    }
  });

  // Hitung streak
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 90; i++) {
    const dateKey = getDateKey(currentDate);
    if (!dateKey) break; // Guard clause

    if (checkInDates.has(dateKey)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get weekly progress (bonus function)
 */
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

    // Ambil 7 hari terakhir sekaligus
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
    const checkInsByDay = new Map<string, boolean>();
    checkIns.forEach((checkIn) => {
      const dateKey = getDateKey(new Date(checkIn.date));
      if (dateKey) {
        checkInsByDay.set(dateKey, true);
      }
    });

    // Format response
    const weekProgress = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateKey = getDateKey(date);
      if (!dateKey) continue; // Guard clause

      const hasCheckIn = checkInsByDay.has(dateKey);

      weekProgress.push({
        date: dateKey,
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

    successResponse(res, "Progress mingguan berhasil diambil", {
      habitId,
      habitTitle: habit.title,
      weekProgress,
      completedDays,
      weeklyCompletion,
      streak: habit.currentStreak,
    });
  },
);
