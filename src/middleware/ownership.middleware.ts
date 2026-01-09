// middleware/ownership.middleware.ts
import type { Request, Response, NextFunction } from "express";
import prisma from "../database";
import { errorResponse } from "../utils/response";

export const checkHabitOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    // Ambil habitId dari berbagai sumber
    const habitId = req.params.habitId || 
                    req.params.id || 
                    req.body.habitId;

    if (!habitId) {
      return errorResponse(res, "Habit ID diperlukan", 400);
    }

    // Validasi format UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habitId)) {
      return errorResponse(res, "Format Habit ID tidak valid", 400);
    }

    // Cek di database
    const habit = await prisma.habit.findFirst({
      where: { 
        id: habitId,
        userId: userId
      },
      select: { id: true } // Hanya ambil id untuk efisiensi
    });

    if (!habit) {
      return errorResponse(res, "Habit tidak ditemukan atau bukan milik Anda", 403);
    }

    // Simpan habitId di request untuk dipakai di controller
    req.habitId = habitId;
    next();
  } catch (error) {
    console.error("Ownership middleware error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const checkCheckInOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    // Ambil checkInId dari berbagai sumber
    const checkInId = req.params.checkInId || 
                      req.params.id || 
                      req.body.checkInId;

    if (!checkInId) {
      return errorResponse(res, "CheckIn ID diperlukan", 400);
    }

    // Validasi format UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(checkInId)) {
      return errorResponse(res, "Format CheckIn ID tidak valid", 400);
    }

    // Cek di database
    const checkIn = await prisma.checkIn.findFirst({
      where: { 
        id: checkInId,
        userId: userId
      },
      select: { id: true, habitId: true }
    });

    if (!checkIn) {
      return errorResponse(res, "CheckIn tidak ditemukan atau bukan milik Anda", 403);
    }

    req.checkInId = checkInId;
    req.habitId = checkIn.habitId;
    next();
  } catch (error) {
    console.error("CheckIn ownership middleware error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const checkProfileOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  const profileUserId = req.params.id; // ID dari URL parameter
  
  if (!userId) {
    return errorResponse(res, "Unauthorized", 401);
  }

  // Jika mengakses profile sendiri (biasanya /api/profile/me)
  if (!profileUserId || profileUserId === 'me') {
    return next();
  }

  // Jika mengakses profile dengan ID spesifik
  if (profileUserId !== userId) {
    return errorResponse(res, "Anda hanya bisa mengakses profile sendiri", 403);
  }

  next();
};

/**
 * Middleware untuk validasi user bisa mengakses habit sebelum check-in
 */
export const checkHabitAccessForCheckIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const habitId = req.body.habitId || req.params.habitId;
    
    if (!habitId) {
      return errorResponse(res, "Habit ID diperlukan", 400);
    }

    // Cek apakah habit ada dan aktif
    const habit = await prisma.habit.findFirst({
      where: { 
        id: habitId,
        userId: userId,
        isActive: true
      },
      select: { id: true }
    });

    if (!habit) {
      return errorResponse(res, "Habit tidak ditemukan, tidak aktif, atau bukan milik Anda", 403);
    }

    req.habitId = habitId;
    next();
  } catch (error) {
    console.error("Habit access middleware error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

export const enforceUserScope = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  
  // Tambah userId ke query untuk filter otomatis
  if (userId && req.method === 'GET') {
    req.query.userId = userId;
  }
  
  // Untuk POST/PUT, pastikan body memiliki userId yang sesuai
  if (userId && (req.method === 'POST' || req.method === 'PUT')) {
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("UserId dalam request tidak sesuai dengan user login");
    }
    req.body.userId = userId;
  }
  
  next();
};