import type {
    Request,
    Response,
} from "express"; 

import { UserService } from "../services/user.service.js";
import { success } from "zod";

export class UserController {
    constructor(
        private readonly service = new UserService(),

    ){}


    getProfile = async (req:Request,res:Response):Promise<void> =>{
        const user=await this.service.getProfile(req.user!.id); 
        res.status(200).json({
            success:true,
                 message:
        'User profile retrieved successfully.',
      data: user,
        });
        
    }

    updateProfile = async (req:Request,res:Response) : Promise<void> => {
        const user =
      await this.service.updateProfile(
        req.user!.id,
        req.body,
      );
      res.status(200).json({
        success: true,
        message:
          'User profile updated successfully.',
        data: user,
      });
    };

    deletedAccount= async (req:Request,res:Response):Promise<void>=>{
        await this.service.deleteAccount(req.user!.id);
        res.status(200).json({
            success:true,
            message:"Account deleted successfully"
        })
    }
}