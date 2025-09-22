import express from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import userRoutes from './routes/userRoutes';
import purchaseRoutes from './routes/purchaseRoutes';


dotenv.config();

const app = express();


const envOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);


const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];


const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));


const corsOptions: CorsOptions = {
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }


    return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
};


app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/purchases', purchaseRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {

  if (err && err.message && err.message.startsWith('CORS policy')) {
    console.error('CORS error:', err.message);
    return res.status(403).json({ message: err.message });
  }

  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
