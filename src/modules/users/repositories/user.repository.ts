import type { promises } from "node:dns";
import { prisma } from "../../../config/prisma.js";

import type { Prisma, User } from "../../../generated/prisma/client.js";

export class UserRepository {
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
        
            where: {
                email,
            },
        });
    }

    async update(id: string,
        data: Prisma.UserUpdateInput,): Promise<User> {
        return prisma.user.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.user.delete({
            where: {
                id,
            },
        });
    }
}