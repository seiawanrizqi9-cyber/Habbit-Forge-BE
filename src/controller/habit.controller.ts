import type { Request, Response } from "express"
import { successResponse } from "../utils/response"
import type { IHabitService } from "../service/habit.service"


export interface IHabitController {
  getAllHabitHandler(req: Request, res: Response) : Promise<void>
  getHabitByIdHandler(req: Request, res: Response) : Promise<void>
  createHabitHandler(req: Request, res: Response) : Promise<void>
  updateHabitHandler(req: Request, res: Response) : Promise<void>
  deleteHabitHandler (req: Request, res: Response) : Promise<void>

}

export class HabitController implements IHabitController {
  constructor (private habitService : IHabitService) {
    this.getAllHabitHandler = this.getAllHabitHandler.bind(this)
    this.getHabitByIdHandler = this.getHabitByIdHandler.bind(this)
    this.createHabitHandler = this.createHabitHandler.bind(this)
    this.updateHabitHandler = this.updateHabitHandler.bind(this)
    this.deleteHabitHandler = this.deleteHabitHandler.bind(this)
    
  }


async getAllHabitHandler  (req: Request, res: Response)  {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = req.query.search as any
    const sortBy = req.query.sortBy as string
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc' ) || 'desc'

    const result = await this.habitService.getAll({
      page,
      limit,
      search,
      sortBy,
      sortOrder
    })

    const pagination = {
      page: result.currentPage,
      limit,
      total: result.total,
      totalPages: result.totalPages
    }

    successResponse(
        res,
        'habit berhasil ditambahkan',
        result.habit,
        pagination
    )
    
}
async  getHabitByIdHandler (req: Request, res: Response)  {
    if (!req.params.id) {
       throw new Error('tidak ada param')
    }

    const habit = await this.habitService.getHabitById(req.params.id)
    

    successResponse(
      res,
      "habit sudah diambil",
      habit
   )
}

async createHabitHandler (req: Request, res: Response )  {

    const { title, description, isActive, userId} = req.body
    const data = {
      title: title.toString(),
      description: description.toString(),
      isActive: Boolean(isActive),
      userId: userId.toString() 
    }

    const habits = await this.habitService.createHabit(data)

  successResponse(
    res,
    "habit berhasil ditambakan",
    habits,
    null,
    201
  )

}

async updateHabitHandler (req: Request, res: Response)  {
  const habit = await this.habitService.updateHabit(req.params.id!, req.body)

  successResponse(
    res,
    "habit berhasil di update",
    habit
  );
}

async deleteHabitHandler  (req: Request, res: Response) {
  const deleted = await this.habitService.deleteHabit(req.params.id!)

  res.json({
    success: true,
    message: "habit berhasil dihapus",
    data: deleted
  });
}

  async toggleHabitHandler (req: Request, res: Response) {
    const toggledHabit = await this.habitService.toggleHabit(req.params.id!)

     res.json({
            success: true,
            message: `Habit status: ${toggledHabit.isActive ? 'Active' : 'Inactive'}`,
            data: toggledHabit
        })
  }
}
