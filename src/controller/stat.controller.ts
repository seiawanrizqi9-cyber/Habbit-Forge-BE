import type { Request, Response } from "express";
import prisma from "../database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";
import { formatDateForFE, parseDateFromFE } from "../utils/timeUtils.js";

export const getHabitStreak = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.id;

    if (!userId || !habitId) {
      throw new Error("Bad request");
    }

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) throw new Error("Habit not found");

    const streak = await calculateHabitStreakOptimized(habitId);

    successResponse(res, "Streak berhasil diambil", {
      habitId,
      streak,
      habitTitle: habit.title,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      startDate: formatDateForFE(habit.startDate), // 🆕 String
    });
  },
);

export const getMonthlyStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonth = parseDateFromFE(formatDateForFE(firstDay));

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
        startDate: true, // 🆕 Ambil startDate
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
        startDate: formatDateForFE(habit.startDate), // 🆕 String
        category: habit.category?.name || "No category",
        color: habit.category?.color || "#6B7280",
      })),
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
    const dateKey = formatDateForFE(checkIn.date); // Langsung pakai formatDateForFE
    checkInDates.add(dateKey);
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 90; i++) {
    const dateKey = formatDateForFE(currentDate); // Langsung pakai formatDateForFE
    if (checkInDates.has(dateKey)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export const getWeeklyProgress = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const habitId = req.params.id;

    if (!userId || !habitId) {
      throw new Error("Bad request");
    }

    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId },
    });

    if (!habit) throw new Error("Habit not found");

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

    const checkInsByDay = new Set<string>();
    checkIns.forEach((checkIn) => {
      const dateStr = formatDateForFE(checkIn.date); // 🆕 String
      checkInsByDay.add(dateStr);
    });

    const weekProgress = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dateStr = formatDateForFE(date);
      const hasCheckIn = checkInsByDay.has(dateStr);

      weekProgress.push({
        date: dateStr, // 🆕 String
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
      startDate: formatDateForFE(habit.startDate), // 🆕 String
      weekProgress,
      completedDays,
      weeklyCompletion,
      streak: habit.currentStreak,
    });
  },
);
