import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isImportant: { type: Boolean, default: false },
}, { timestamps: true });

export const Notice = mongoose.model('Notice', noticeSchema);
