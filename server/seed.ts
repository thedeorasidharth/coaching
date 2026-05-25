import mongoose from 'mongoose';
import { Admin } from './models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduspark');
    
    const adminExists = await Admin.findOne({ email: 'admin@eduspark.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@eduspark.com',
      password: 'adminpassword',
      role: 'admin',
    });

    await admin.save();
    console.log('Admin created successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
