import { Request, Response } from 'express';
import { Student } from '../models/Student';
import { Notice } from '../models/Notice';
import bcrypt from 'bcryptjs';

export const createStudent = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/students - Request Body:", req.body);
    const { fullName, phone, username, password, class: targetClass, course, parentName, parentPhone, enrolledCourses, profileImage } = req.body;

    if (!fullName || !phone || !password || !targetClass) {
      return res.status(400).json({ message: 'Full Name, Mobile Number, Password, and Class are required.' });
    }

    const cleanPhone = phone.trim();
    const cleanUsername = username && username.trim() !== '' ? username.trim() : cleanPhone;
    const cleanName = fullName.trim();
    const cleanClass = targetClass.trim();

    // Derive course if not explicitly supplied
    let derivedCourse = course ? course.trim() : 'JEE';
    if (!course) {
      if (cleanClass.toUpperCase().includes('NEET')) {
        derivedCourse = 'NEET';
      } else if (cleanClass.toUpperCase().includes('FOUNDATION')) {
        derivedCourse = 'Foundation';
      } else {
        derivedCourse = 'JEE';
      }
    }

    // Check existing student by phone or username
    const existingStudent = await Student.findOne({
      $or: [
        { phone: cleanPhone },
        { username: cleanPhone },
        { phone: cleanUsername },
        { username: cleanUsername }
      ]
    });

    if (existingStudent) {
      if (existingStudent.phone === cleanPhone) {
        return res.status(400).json({ message: 'A student account with this mobile number already exists.' });
      }
      return res.status(400).json({ message: 'A student account with this username already exists.' });
    }

    const student = new Student({
      fullName: cleanName,
      phone: cleanPhone,
      username: cleanUsername,
      password: password,
      class: cleanClass,
      course: derivedCourse,
      parentName: parentName ? parentName.trim() : '',
      parentPhone: parentPhone ? parentPhone.trim() : '',
      enrolledCourses: Array.isArray(enrolledCourses) ? enrolledCourses : [],
      profileImage: profileImage || '',
      status: 'active',
      role: 'student'
    });

    await student.save();
    console.log("Student created successfully:", student._id);
    
    // Return sanitized student record without password
    const studentData = student.toObject();
    delete (studentData as any).password;
    res.status(201).json(studentData);
  } catch (error: any) {
    console.error("Student creation error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      if (field === 'phone') {
        return res.status(400).json({ message: 'A student account with this mobile number already exists.' });
      }
      if (field === 'username') {
        return res.status(400).json({ message: 'A student account with this username already exists.' });
      }
      return res.status(400).json({ message: 'A student record with duplicate credentials already exists.' });
    }
    res.status(400).json({ message: error.message || 'Error creating student account.' });
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
