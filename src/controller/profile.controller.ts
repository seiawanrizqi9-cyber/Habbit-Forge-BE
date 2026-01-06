import type { Request, Response } from "express"
import { successResponse } from "../utils/response"
import type { IProfileService } from "../service/profile.service"


export interface IProfileController {
  getProfileByIdHandler(req: Request, res: Response) : Promise<void>
  updateProfileHandler(req: Request, res: Response) : Promise<void>
  

}

export class ProfileController implements IProfileController {
  constructor (private profileService : IProfileService) {
    this.getProfileByIdHandler = this.getProfileByIdHandler.bind(this)
    this.updateProfileHandler = this.updateProfileHandler.bind(this)
    
  }



async  getProfileByIdHandler (req: Request, res: Response)  {
    if (!req.params.id) {
       throw new Error('tidak ada param')
    }

    const profile = await this.profileService.getProfileById(req.params.id)
    

    successResponse(
      res,
      "profile sudah diambil",
      profile
   )
}



async updateProfileHandler (req: Request, res: Response)  {
  const profile = await this.profileService.updateProfile(req.params.id!, req.body)

  successResponse(
    res,
    "buku berhasil di update",
    profile
  );
}


}