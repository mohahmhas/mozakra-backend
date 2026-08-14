    import type { Request, Response } from 'express';
    import { AuthService } from '../services/auth.service.js';

    import { AppError } from '../../../common/errors/app-error.js';
    import { HTTP_STATUS } from '../../../common/constants/http-status.js';
    import { ERROR_CODES } from '../../../common/constants/error-codes.js';

    import { env } from '../../../config/env.js';

    
    export class AuthController {
        constructor(private readonly service = new AuthService()) {}


        logout = async (req: Request, res: Response): Promise<void> => {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                await this.service.logout(refreshToken);    
            }
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.status(200).json({

                  success:true,

                  message:'Logout successful',

                });

        };

        refresh = async (req: Request, res: Response): Promise<void> => {
            const token =
        req.cookies.refreshToken;
        if (!token) {
            throw new AppError({
                statusCode: HTTP_STATUS.UNAUTHORIZED,
                code: ERROR_CODES.UNAUTHORIZED,
                message: 'Refresh token is missing.',
            });
        }
        const result =
        await this.service.refresh(
            token,
        );
        res.cookie(

        'refreshToken',

        result.refreshToken,// i have error here Property 'refreshToken' does not exist on type '{ accessToken: string; }'.

        {

            httpOnly:true,

            secure:
                env.NODE_ENV==='production',

            sameSite:'strict',

            maxAge:
                30*24*60*60*1000,

        },

    );
    res.status(200).json({

        success:true,

        message:'Token refreshed',

        data:{

            accessToken:
                result.accessToken,

        },

    });
        }

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
                env.NODE_ENV === 'production',
                sameSite: 'strict', 
                maxAge: env.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000, // 7 days
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
                secure: env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: env.JWT_REFRESH_EXPIRES_IN_DAYS  * 24 * 60 * 60 * 1000, // 7 days
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