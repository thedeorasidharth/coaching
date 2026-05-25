/*
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Changed to Admin to match current auth
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);
*/
