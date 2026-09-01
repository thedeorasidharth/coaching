import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  course: { type: String, required: true, default: 'JEE' },
  class: { type: String, required: true },
  username: { type: String, required: false },
  parentName: { type: String, default: '' },
  parentPhone: { type: String, default: '' },
  enrolledCourses: [{ type: String }],
  profileImage: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  role: { type: String, default: 'student' },
}, { timestamps: true });

studentSchema.pre('save', async function (this: any) {
  if (!this.username) {
    this.username = this.phone;
  }
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const Student = mongoose.model('Student', studentSchema);
