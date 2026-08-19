import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import assetRoutes from './routes/assetRoutes.js';
import userRoutes from './routes/userRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';

dotenv.config();

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

// Setup server and connect to MongoDB Atlas
const startServer = async () => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  } else {
    console.warn("WARNING: MONGODB_URI is not set. Express server running without database connection (falling back to mockup data responses).");
  }
  
  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
};

startServer();
