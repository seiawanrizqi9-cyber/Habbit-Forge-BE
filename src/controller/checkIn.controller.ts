import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { ICheckInService } from "../service/checkIn.service";
import { asyncHandler } from "../utils/asyncHandler";

export class CheckInController {
  constructor(private checkInService: ICheckInService) {}

  getCheckInByIdHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const checkIn = await this.checkInService.getCheckInByIdForUser(
      req.params.id!, 
      userId
    );
    successResponse(res, "CheckIn berhasil diambil", checkIn);
  });

  createCheckInHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const checkIn = await this.checkInService.createCheckIn({
      habitId: req.body.habitId,
      userId,
      note: req.body.note
    });
    
    successResponse(res, "CheckIn berhasil dibuat", checkIn, null, 201);
  });

  updateCheckInHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const checkIn = await this.checkInService.updateCheckIn(
      req.params.id!, 
      req.body, 
      userId
    );
    
    successResponse(res, "CheckIn berhasil diupdate", checkIn);
  });

  deleteCheckInHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const deleted = await this.checkInService.deleteCheckIn(
      req.params.id!, 
      userId
    );
    
    successResponse(res, "CheckIn berhasil dihapus", deleted);
  });
}