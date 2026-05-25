import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
}, { timestamps: true });

export const Gallery = mongoose.model('Gallery', gallerySchema);
