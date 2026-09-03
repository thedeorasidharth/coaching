import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Logout
router.post('/logout', (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  };
  res.clearCookie('token', cookieOptions);
  res.cookie('token', '', {
    ...cookieOptions,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out' });
});

// Get Admin Profile
router.get('/me', protect, adminOnly, async (req: any, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
