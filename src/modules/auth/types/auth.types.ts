import type { User } from '../../../generated/prisma/client.js';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type AuthUser = Omit<User, 'password'>;
export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}