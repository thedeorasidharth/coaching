import { Request, Response } from 'express';
import { Faculty } from '../models/Faculty';

export const createFaculty = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/faculty - Request Body:", req.body);
    const faculty = new Faculty(req.body);
    await faculty.save();
    console.log("Faculty created successfully:", faculty._id);
    res.status(201).json(faculty);
  } catch (error: any) {
    console.error("Faculty creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.find().sort('createdAt');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    console.log(`PATCH /api/faculty/${req.params.id} - Request Body:`, req.body);
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) {
      console.warn("Faculty not found for update:", req.params.id);
      return res.status(404).json({ message: 'Faculty not found' });
    }
    console.log("Faculty updated successfully:", faculty._id);
    res.json(faculty);
  } catch (error: any) {
    console.error("Faculty update error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json({ message: 'Faculty removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
