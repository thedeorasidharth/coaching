import mongoose from 'mongoose';
import { Admin } from './models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduspark';
    await mongoose.connect(mongodbUri);
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eduspark.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword';
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`[Seed Admin] Admin account already exists (${adminEmail}). No changes made.`);
      process.exit(0);
    }

    const admin = new Admin({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    await admin.save();
    console.log(`[Seed Admin] Initial Admin account created successfully for: ${adminEmail}`);
    process.exit(0);
  } catch (error: any) {
    console.error('[Seed Admin] Error setting up initial Admin account:', error.message || error);
    process.exit(1);
  }
};

seedAdmin();
