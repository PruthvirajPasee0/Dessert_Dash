import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import userRoutes from './routes/userRoutes';
import purchaseRoutes from './routes/purchaseRoutes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dessert-dash.vercel.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/purchases', purchaseRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;


// import express from 'express';
// import cors, { CorsOptions } from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import authRoutes from './routes/authRoutes';
// import sweetRoutes from './routes/sweetRoutes';
// import userRoutes from './routes/userRoutes';
// import purchaseRoutes from './routes/purchaseRoutes';

// // Load environment variables
// dotenv.config();

// const app = express();

// /**
//  * Configure allowed origins:
//  * - You can set ALLOWED_ORIGINS as a comma-separated env var in your deployment (e.g.
//  *   ALLOWED_ORIGINS=https://dessert-dash.vercel.app,https://dessert-dash-backend.onrender.com,http://localhost:5173)
//  * - If ALLOWED_ORIGINS is not set, we fall back to http://localhost:5173 to preserve current behaviour.
//  */
// const envOrigins = (process.env.ALLOWED_ORIGINS || '')
//   .split(',')
//   .map(s => s.trim())
//   .filter(Boolean);

// // Keep localhost dev origin by default so existing local dev flow is preserved.
// const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

// // Merge env-specified origins with defaults (env takes precedence but we keep defaults if none provided)
// const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

// /**
//  * CORS options with dynamic origin checking.
//  * - Allows requests from origins listed in ALLOWED_ORIGINS (or localhost by default).
//  * - Allows non-browser requests without Origin header (e.g., curl, Postman).
//  * - Allows credentials (cookies) to be used across origins when permitted.
//  */
// const corsOptions: CorsOptions = {
//   origin: (origin, callback) => {
//     // Allow requests with no origin (mobile apps, curl, server-to-server)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     // If origin is not in the whitelist, reject with an error.
//     return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With']
// };

// // Apply CORS middleware
// app.use(cors(corsOptions));
// // Ensure preflight requests are handled with the same cors options
// app.options('*', cors(corsOptions));

// app.use(express.json());

// // Serve static files from uploads directory
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/sweets', sweetRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/purchases', purchaseRoutes);

// // Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   // If this error came from the CORS origin check we return 403 with a helpful message
//   if (err && err.message && err.message.startsWith('CORS policy')) {
//     console.error('CORS error:', err.message);
//     return res.status(403).json({ message: err.message });
//   }

//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// export default app;
