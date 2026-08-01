import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
    constructor(private readonly service = new AuthService()) {}

    me = async (req: Request, res: Response): Promise<void> => {
        const user = await this.service.me(req.user!.id);
        res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: user,
        });
    }

    login = async (req: Request, res: Response): Promise<void> => {
        const result =await this.service.login(req.body);
        res.cookie('refreshToken',
         result.refreshToken,{
            httpOnly: true,
             secure:
            process.env.NODE_ENV === 'production',
            sameSite: 'strict', 
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
         });
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                user:result.user,
                accessToken: result.accessToken
            },
        });
    }

    register = async (req: Request, res: Response) :Promise<void>=>{

        const result = await this.service.register(req.body);
        res.cookie('refreshToken',
         result.refreshToken,{
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
        res.status(201).json({
             success: true,
             message: 'User registered successfully',
             data: {
              user: result.user,
              accessToken: result.accessToken,
            },
        });
  

    } 
    
}