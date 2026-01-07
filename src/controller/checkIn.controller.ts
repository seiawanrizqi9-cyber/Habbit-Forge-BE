import type { Request, Response } from "express"
import { successResponse } from "../utils/response"
import type { ICheckInService } from "../service/checkIn.service"


export interface ICheckInController {
  getCheckInByIdHandler(req: Request, res: Response) : Promise<void>
  createCheckInHandler(req: Request, res: Response) : Promise<void>
  updateCheckInHandler(req: Request, res: Response) : Promise<void>
  deleteCheckInHandler (req: Request, res: Response) : Promise<void>

}

export class CheckInController implements ICheckInController {
  constructor (private checkInService : ICheckInService) {
    this.getCheckInByIdHandler = this.getCheckInByIdHandler.bind(this)
    this.createCheckInHandler = this.createCheckInHandler.bind(this)
    this.updateCheckInHandler = this.updateCheckInHandler.bind(this)
    this.deleteCheckInHandler = this.deleteCheckInHandler.bind(this)
  }

  
async  getCheckInByIdHandler (req: Request, res: Response)  {
    if (!req.params.id) {
       throw new Error('tidak ada param')
    }

    const checkIn = await this.checkInService.getCheckInById(req.params.id)
    

    successResponse(
      res,
      "checkIn sudah diambil",
      checkIn
   )
}

async createCheckInHandler (req: Request, res: Response )  {

    const { habitId, userId, note} = req.body
    const data = {
      habitId: habitId.toString(),
      userId: userId.toString(),
      note: note.toString(), 
    }

    const checkIns = await this.checkInService.createCheckIn(data)

  successResponse(
    res,
    "checkIn berhasil ditambakan",
    checkIns,
    null,
    201
  )

}

async updateCheckInHandler (req: Request, res: Response)  {
  const checkIn = await this.checkInService.updateCheckIn(req.params.id!, req.body)

  successResponse(
    res,
    "checkIn berhasil di update",
    checkIn
  );
}

async deleteCheckInHandler  (req: Request, res: Response) {
  const deleted = await this.checkInService.deleteCheckIn(req.params.id!)

  res.json({
    success: true,
    message: "kategoti berhasil dihapus",
    data: deleted
  });
}

}

