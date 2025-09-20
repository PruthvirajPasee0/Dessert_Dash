import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Validate stock availability
export const verifyStockAvailability = async (req: Request, res: Response) => {
    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                error: 'INVALID_DATA',
                message: 'Invalid items data provided'
            });
        }

        // Check stock for each item
        const stockChecks = await Promise.all(items.map(async (item) => {
            const sweet = await prisma.sweet.findUnique({
                where: { id: item.sweetId },
                select: { id: true, name: true, quantity: true, price: true }
            });

            if (!sweet) {
                return { 
                    sweetId: item.sweetId,
                    available: false, 
                    message: `Sweet not found` 
                };
            }

            return {
                sweetId: item.sweetId,
                name: sweet.name,
                available: sweet.quantity >= item.quantity,
                currentStock: sweet.quantity,
                requested: item.quantity,
                price: sweet.price
            };
        }));

        const unavailableItems = stockChecks.filter(item => !item.available);
        
        if (unavailableItems.length > 0) {
            return res.status(400).json({
                error: 'INSUFFICIENT_STOCK',
                message: 'Some items are out of stock',
                unavailableItems
            });
        }

        res.json({
            available: true,
            items: stockChecks
        });
    } catch (error) {
        console.error('Stock verification error:', error);
        res.status(500).json({
            error: 'DATABASE_ERROR',
            message: 'Failed to verify stock availability'
        });
    }
};

// Process purchase with transaction
export const processPurchase = async (req: Request, res: Response) => {
    try {
        const { orderId, items, paymentMethod, paymentDetails, totalAmount, tax, deliveryFee } = req.body;
        const userId = req.user?.id;

        if (!userId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'INVALID_DATA',
                message: 'Invalid purchase data'
            });
        }

        // Check if order already exists
        const existingOrder = await prisma.purchase.findFirst({
            where: { orderId }
        });

        if (existingOrder) {
            return res.status(409).json({
                error: 'DUPLICATE_ORDER',
                message: 'This order has already been processed. Please check your purchase history'
            });
        }

        // Process purchase within a transaction
        const result = await prisma.$transaction(async (tx) => {
            const purchaseRecords = [];
            let totalOrderAmount = new Prisma.Decimal(0);

            // Process each item
            for (const item of items) {
                const { sweetId, quantity } = item;

                // Get and verify sweet with a lock
                const sweet = await tx.sweet.findUnique({
                    where: { id: sweetId },
                    select: { id: true, name: true, quantity: true, price: true }
                });

                if (!sweet) {
                    throw new Error(`Sweet with ID ${sweetId} not found`);
                }

                if (sweet.quantity < quantity) {
                    throw new Error(`Insufficient stock for ${sweet.name}: requested ${quantity}, available ${sweet.quantity}`);
                }

                // Update sweet quantity
                const updatedSweet = await tx.sweet.update({
                    where: { id: sweetId },
                    data: { quantity: sweet.quantity - quantity }
                });

                if (updatedSweet.quantity < 0) {
                    throw new Error(`Invalid stock update for ${sweet.name}`);
                }

                // Calculate item total
                const itemTotal = new Prisma.Decimal(quantity * Number(sweet.price));
                totalOrderAmount = totalOrderAmount.add(itemTotal);

                // Create purchase record with a unique composite ID
                const purchaseRecord = await tx.purchase.create({
                    data: {
                        orderId: `${orderId}-${sweetId}`, // Make unique for each item
                        userId,
                        sweetId,
                        quantity,
                        total: itemTotal,
                        tax: new Prisma.Decimal(tax / items.length), // Distribute tax equally
                        paymentMethod,
                        paymentDetails,
                        status: 'completed',
                        pricePerUnit: sweet.price,
                        deliveryFee: new Prisma.Decimal(deliveryFee / items.length), // Distribute delivery fee equally
                    }
                });

                purchaseRecords.push(purchaseRecord);
            }

            return {
                records: purchaseRecords,
                totalAmount: totalOrderAmount
            };
        }, {
            timeout: 10000, // 10 second timeout
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable // Highest isolation level
        });

        return res.status(201).json({
            status: 'success',
            orderId,
            totalAmount: result.totalAmount,
            purchases: result.records
        });

    } catch (error: any) {
        console.error('Purchase processing error:', error);
        
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    error: 'DUPLICATE_ORDER',
                    message: 'This order has already been processed. Please check your purchase history'
                });
            }
        }

        if (error.message.includes('Insufficient stock')) {
            return res.status(400).json({
                error: 'INSUFFICIENT_STOCK',
                message: error.message
            });
        }

        if (error.message.includes('Invalid stock update')) {
            return res.status(400).json({
                error: 'INVALID_STOCK_UPDATE',
                message: error.message
            });
        }

        return res.status(500).json({
            error: 'DATABASE_ERROR',
            message: 'Failed to process purchase. Please try again.'
        });
    }
};

// Get purchase history for a user
export const getUserPurchases = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const purchases = await prisma.purchase.findMany({
            where: { userId },
            include: {
                sweet: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json(purchases);
    } catch (error) {
        console.error('Get user purchases error:', error);
        res.status(500).json({ message: 'Failed to fetch purchase history' });
    }
};