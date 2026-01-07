import type { Request, Response } from "express"
import { successResponse } from "../utils/response"
import type { ICategoryService } from "../service/category.service"


export interface ICategoryController {
  getAllCategoryHandler(req: Request, res: Response) : Promise<void>
  getCategoryByIdHandler(req: Request, res: Response) : Promise<void>
}

export class CategoryController implements ICategoryController {
  constructor (private categoryService : ICategoryService) {
    this.getAllCategoryHandler = this.getAllCategoryHandler.bind(this)
    this.getCategoryByIdHandler = this.getCategoryByIdHandler.bind(this)
  }


async getAllCategoryHandler  (req: Request, res: Response)  {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = req.query.search as any
    const sortBy = req.query.sortBy as string
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc' ) || 'desc'

    const result = await this.categoryService.getAll({
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
        'buku berhasil ditambahkan',
        result.category,
        pagination
    )
    
}
async  getCategoryByIdHandler (req: Request, res: Response)  {
    if (!req.params.id) {
       throw new Error('tidak ada param')
    }

    const category = await this.categoryService.getCategoryById(req.params.id)
    

    successResponse(
      res,
      "kategori sudah ditemukan",
      category
   )
}


}
