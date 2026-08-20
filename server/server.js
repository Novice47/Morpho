import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import assetRoutes from './routes/assetRoutes.js';
import userRoutes from './routes/userRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite client dev server
app.use(cors({
  origin: true,
  credentials: true
}));

app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// API route mounts
app.use('/api/assets', assetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/creators', creatorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString() });
});

// Serve Vite-built frontend static files
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Catch-all: send index.html for any non-API route (React SPA client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Setup server and connect to MongoDB Atlas
const startServer = async () => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.warn("WARNING: MONGODB_URI is not set. Express server running without database connection (falling back to mockup data responses).");
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);

    // Keep-alive: ping /health every 14 minutes so Render free tier never spins down
    const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
    if (RENDER_URL) {
      const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
      setInterval(async () => {
        try {
          const res = await fetch(`${RENDER_URL}/health`);
          console.log(`[KEEP-ALIVE] Pinged ${RENDER_URL}/health — status: ${res.status}`);
        } catch (err) {
          console.error(`[KEEP-ALIVE] Ping failed:`, err.message);
        }
      }, PING_INTERVAL_MS);
      console.log(`[KEEP-ALIVE] Self-ping active every 14 min → ${RENDER_URL}/health`);
    }
  });
};

startServer();

