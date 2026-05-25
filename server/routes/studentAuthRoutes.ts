import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Student } from '../models/Student';
import { protect, studentOnly } from '../middleware/auth';

const router = express.Router();

// Student Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne({ username });
    if (student && (await bcrypt.compare(password, student.password))) {
      const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({ _id: student._id, name: student.name, username: student.username, role: 'student' });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out' });
});

// Get Student Profile
router.get('/me', protect, studentOnly, async (req: any, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
