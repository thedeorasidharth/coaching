import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes';
import studentAuthRoutes from './routes/studentAuthRoutes';
import studentRoutes from './routes/studentRoutes';
import quizRoutes from './routes/quizRoutes';
// import noteRoutes from './routes/noteRoutes';
import noticeRoutes from './routes/noticeRoutes';
import galleryRoutes from './routes/galleryRoutes';
import facultyRoutes from './routes/facultyRoutes';
import resultRoutes from './routes/resultRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());


// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentAuthRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/analytics', analyticsRoutes);
// app.use('/api/notes', noteRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/faculty', facultyRoutes);

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduspark';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB Connection error:', err));
