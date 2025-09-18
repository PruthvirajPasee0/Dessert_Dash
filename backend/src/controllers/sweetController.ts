import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await prisma.sweet.findMany();
        res.json(sweets);
    } catch (error) {
        console.error('Error fetching sweets:', error);
        res.status(500).json({ message: 'Error fetching sweets' });
    }
};