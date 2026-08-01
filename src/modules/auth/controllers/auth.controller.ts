import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
    constructor(private readonly service = new AuthService()) {}

    login = async (req: Request, res: Response): Promise<void> => {
        const result =await this.service.login(req.body);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: result,
        });
    }

    register = async (req: Request, res: Response) :Promise<void>=>{

        const result = await this.service.register(req.body);
        
        res.status(201).json({
             success: true,
             message: 'User registered successfully',
             data: result,
        });
  

    } 
    
}