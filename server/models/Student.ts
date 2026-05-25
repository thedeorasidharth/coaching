import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  class: { type: String, required: true },
  phone: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  enrolledCourses: [{ type: String }],
  profileImage: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  role: { type: String, default: 'student' },
}, { timestamps: true });

studentSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const Student = mongoose.model('Student', studentSchema);
