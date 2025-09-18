import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const sweets = await prisma.sweet.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(sweets);
    } catch (error) {
        console.error('Error fetching sweets:', error);
        res.status(500).json({ message: 'Failed to fetch sweets' });
    }
};

export const createSweet = async (req: Request, res: Response) => {
    try {
        const { name, category, price, quantity } = req.body;

        if (!name || !category || !price || quantity === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const sweet = await prisma.sweet.create({
            data: {
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            }
        });

        res.status(201).json(sweet);
    } catch (error) {
        console.error('Error creating sweet:', error);
        res.status(500).json({ message: 'Failed to create sweet' });
    }
};

export const updateSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, price, quantity } = req.body;

        if (!name || !category || !price || quantity === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const sweet = await prisma.sweet.update({
            where: { id },
            data: {
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity)
            }
        });

        res.json(sweet);
    } catch (error) {
        console.error('Error updating sweet:', error);
        res.status(500).json({ message: 'Failed to update sweet' });
    }
};

export const deleteSweet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.sweet.delete({
            where: { id }
        });

        res.json({ message: 'Sweet deleted successfully' });
    } catch (error) {
        console.error('Error deleting sweet:', error);
        res.status(500).json({ message: 'Failed to delete sweet' });
    }
};

export const adjustQuantity = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({ message: 'Quantity is required' });
        }

        const sweet = await prisma.sweet.update({
            where: { id },
            data: { quantity: parseInt(quantity) }
        });

        res.json(sweet);
    } catch (error) {
        console.error('Error adjusting quantity:', error);
        res.status(500).json({ message: 'Failed to adjust quantity' });
    }
};