import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSweets = async (req: Request, res: Response) => {
    try {
        const { search, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

        let where: any = {};

        if (search) {
            where.name = {
                contains: String(search)
            };
        }

        if (category) {
            where.category = String(category);
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(String(minPrice));
            if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sortBy) {
            const validSortFields = ['name', 'price'];
            const validSortOrders = ['asc', 'desc'];
            
            if (validSortFields.includes(String(sortBy))) {
                orderBy = {
                    [String(sortBy)]: validSortOrders.includes(String(sortOrder)) ? sortOrder : 'asc'
                };
            }
        }

        const sweets = await prisma.sweet.findMany({
            where,
            orderBy,
            select: {
                id: true,
                name: true,
                category: true,
                price: true,
                quantity: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json(sweets);
    } catch (error) {
        console.error('Error fetching sweets:', error);
        res.status(500).json({ message: 'Failed to fetch sweets' });
    }
};

export const createSweet = async (req: Request, res: Response) => {
    try {
        const { name, category, price, quantity, imageUrl } = req.body;

        if (!name || !category || !price || quantity === undefined) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Validate image URL if provided
        if (imageUrl && !isValidUrl(imageUrl)) {
            return res.status(400).json({ message: 'Invalid image URL' });
        }

        const sweet = await prisma.sweet.create({
            data: {
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                imageUrl
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
        const { name, category, price, quantity, imageUrl } = req.body;

        if (!name || !category || !price || quantity === undefined) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Validate image URL if provided
        if (imageUrl && !isValidUrl(imageUrl)) {
            return res.status(400).json({ message: 'Invalid image URL' });
        }

        const sweet = await prisma.sweet.update({
            where: { id },
            data: {
                name,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                imageUrl
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

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};