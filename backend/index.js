import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { db } from './db.js';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import departmentRoutes from './routes/departments.js';
import analyticsRoutes from './routes/analytics.js';
import rewardRoutes from './routes/rewards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Enable proxy trust for Render / Cloudflare
app.set('trust proxy', 1);

// Allowed origins whitelist
const allowedOrigins = [
  'https://citizen-complaint-management-system-rho.vercel.app',
  /\.vercel\.app$/,                 // any Vercel preview or production deployment
  /^http:\/\/localhost(:\d+)?$/,    // local dev (any port)
  /^http:\/\/127\.0\.0\.1(:\d+)?$/  // local dev alt
];

// CORS Configuration — full support for cross-origin credentials and preflight
const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(pattern => {
      if (typeof pattern === 'string') return pattern.toLowerCase() === origin.toLowerCase();
      if (pattern instanceof RegExp) return pattern.test(origin);
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // Cache preflight response for 24 hours
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for user uploaded photos with CORS
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rewards', rewardRoutes);

// Serve built static frontend files if dist exists
const frontendDist = path.join(__dirname, '../frontend/dist');
const legacyDist = path.join(__dirname, '../dist');
const distPath = fs.existsSync(frontendDist) ? frontendDist : legacyDist;
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CCMS API Server',
    database: db.isConnected ? 'MongoDB (Connected)' : 'Local Persistent Storage (Fallback Mode)',
    timestamp: new Date().toISOString()
  });
});

// SPA Fallback for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({ message: 'CCMS Backend API is active. Frontend is not built yet.' });
});

// Connect Database & Start Express Server
const startServer = async () => {
  await db.connect();
  app.listen(PORT, () => {
    console.log(`🚀 CCMS Application running at http://localhost:${PORT}`);
    console.log(`📊 DB Status: ${db.isConnected ? '🍃 MongoDB Active' : '💾 Local Fallback Active'}`);
  });
};

startServer();
