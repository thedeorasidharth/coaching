import { Request, Response } from 'express';
import { Gallery } from '../models/Gallery';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/gallery - Request Body:", req.body);
    const { imageUrl, caption } = req.body;
    const image = new Gallery({ imageUrl, caption });
    await image.save();
    console.log("Gallery image uploaded successfully:", image._id);
    res.status(201).json(image);
  } catch (error: any) {
    console.error("Gallery upload error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getGallery = async (req: Request, res: Response) => {
  try {
    const images = await Gallery.find().sort('-createdAt');
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
