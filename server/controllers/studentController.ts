import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Notice } from '../models/Notice';
import bcrypt from 'bcryptjs';

export const createStudent = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/students - Request Body:", req.body);
    const { phone, username } = req.body;
    const searchPhone = phone || username;

    if (searchPhone) {
      const existingStudent = await Student.findOne({
        $or: [{ phone: searchPhone }, { username: searchPhone }]
      });
      if (existingStudent) {
        console.warn("Student creation failed: Mobile number exists", searchPhone);
        return res.status(400).json({ message: 'Student with this mobile number already exists' });
      }
    }

    const student = new Student(req.body);
    await student.save();
    console.log("Student created successfully:", student._id);
    res.status(201).json(student);
  } catch (error: any) {
    console.error("Student creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const { className, class: classFilter, course, search } = req.query;
    let query: any = {};

    const targetClass = classFilter || className;
    if (targetClass && targetClass !== 'All Classes' && targetClass !== 'all') {
      query.class = targetClass;
    }
    if (course && course !== 'All Courses' && course !== 'all') {
      query.course = course;
    }
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query).select('-password').sort('-createdAt');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Validate phone uniqueness if phone is being changed
    if (req.body.phone && req.body.phone.trim() !== student.phone) {
      const cleanPhone = req.body.phone.trim();
      const duplicate = await Student.findOne({
        phone: cleanPhone,
        _id: { $ne: req.params.id }
      });
      if (duplicate) {
        return res.status(400).json({ message: 'Another student with this mobile number already exists' });
      }
      req.body.phone = cleanPhone;
    }

    // Never expose or allow password modification via this route
    if (req.body.password) delete req.body.password;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).select('-password');

    res.json(updatedStudent);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Server error' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.deleteOne();
    res.json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.password = password; // Will be hashed by pre-save hook
    await student.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.status = student.status === 'active' ? 'inactive' : 'active';
    await student.save();
    res.json({ message: 'Status updated', status: student.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
