import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  targetClass: { type: String, default: 'All Classes' },
  isImportant: { type: Boolean, default: false },
  attachmentUrl: { type: String, default: '' },
}, { timestamps: true });

noticeSchema.index({ createdAt: -1 });

export const Notice = mongoose.model('Notice', noticeSchema);
