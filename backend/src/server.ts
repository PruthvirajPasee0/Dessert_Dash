import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 8000;

async function startServer() {
  // Start server first
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    // Then connect to database
    await prisma.$connect();
    console.log('Connected to database');
  } catch (error) {
    console.error('Database connection failed:', error);
    // Don't exit the process, just log the error
    console.log('Server will continue running without database connection');
  }

  // Error handling for server
  server.on('error', (error: any) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

startServer();