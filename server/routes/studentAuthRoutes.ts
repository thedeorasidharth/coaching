import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Student } from '../models/Student';
import { protect, studentOnly } from '../middleware/auth';

const router = express.Router();

// Student Signup / Self-Registration
router.post('/signup', async (req, res) => {
  const { fullName, phone, password, course, class: className } = req.body;
  try {
    if (!fullName || !phone || !password || !course || !className) {
      return res.status(400).json({ message: 'All fields (Full Name, Mobile Number, Password, Course, Class) are required' });
    }

    const cleanPhone = phone.trim();
    const existingStudent = await Student.findOne({ phone: cleanPhone });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student account with this mobile number already exists' });
    }

    const student = new Student({
      fullName: fullName.trim(),
      phone: cleanPhone,
      username: cleanPhone,
      password,
      course,
      class: className,
      status: 'active',
      role: 'student'
    });

    await student.save();

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: student._id,
      name: student.fullName,
      fullName: student.fullName,
      phone: student.phone,
      course: student.course,
      class: student.class,
      role: 'student'
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Error registering student' });
  }
});

// Student Login (Mobile Number + Password)
router.post('/login', async (req, res) => {
  const { phone, username, password } = req.body;
  const inputPhone = (phone || username || '').trim();

  if (!inputPhone || !password) {
    return res.status(400).json({ message: 'Mobile number and password are required' });
  }

  try {
    const student = await Student.findOne({
      $or: [{ phone: inputPhone }, { username: inputPhone }]
    });

    if (student && (await bcrypt.compare(password, student.password))) {
      const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({
        _id: student._id,
        name: student.fullName,
        fullName: student.fullName,
        phone: student.phone,
        course: student.course,
        class: student.class,
        role: 'student'
      });
    } else {
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Logout
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

// Get Student Profile
router.get('/me', protect, studentOnly, async (req: any, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({
      _id: student._id,
      name: student.fullName,
      fullName: student.fullName,
      phone: student.phone,
      course: student.course,
      class: student.class,
      role: 'student'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
