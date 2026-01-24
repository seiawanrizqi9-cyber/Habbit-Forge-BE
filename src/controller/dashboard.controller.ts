import type { Request, Response } from "express";
import { DashboardService } from "../service/dashboard.service.js";
import { DashboardRepository } from "../repository/dashboard.repository.js";
import prismaInstance from "../database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

const prisma = prismaInstance;
const dashboardRepo = new DashboardRepository(prisma);
const dashboardService = new DashboardService(dashboardRepo);

export const getDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const dashboardData = await dashboardService.getDashboard(userId);

    successResponse(res, "Dashboard data retrieved", dashboardData);
  },
);

export const getTodayHabits = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const todayHabits = await dashboardService.getTodayHabits(userId);

    successResponse(res, "Today's habits retrieved", todayHabits);
  },
);

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const stats = await dashboardService.getStats(userId);

  successResponse(res, "Statistics retrieved", stats);
});
