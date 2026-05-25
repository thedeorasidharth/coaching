import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  qualifications: [{ type: String }],
  experience: { type: String },
  subject: { type: String },
  imageUrl: { type: String },
}, { timestamps: true });

export const Faculty = mongoose.model('Faculty', facultySchema);
