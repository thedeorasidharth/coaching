import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

adminSchema.pre('save', async function (this: any) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const Admin = mongoose.model('Admin', adminSchema);
