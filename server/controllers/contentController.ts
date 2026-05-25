import { Request, Response } from 'express';
import { Notice } from '../models/Notice';
import { Note } from '../models/Note';

// Notice Controllers
export const createNotice = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/notices - Request Body:", req.body);
    const { title, content, isImportant } = req.body;
    const notice = new Notice({ title, content, isImportant });
    await notice.save();
    console.log("Notice created successfully:", notice._id);
    res.status(201).json(notice);
  } catch (error: any) {
    console.error("Notice creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find().sort('-createdAt');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateNotice = async (req: Request, res: Response) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Note Controllers (TEMPORARILY DISABLED)
/*
export const createNote = async (req: any, res: Response) => {
  const { title, category, fileUrl } = req.body;
  try {
    const note = new Note({ title, category, fileUrl, uploadedBy: req.user.id });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().populate('uploadedBy', 'username').sort('-createdAt');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
*/
