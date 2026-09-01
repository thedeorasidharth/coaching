import { Request, Response } from 'express';
import { Notice } from '../models/Notice';

// Notice Controllers
export const createNotice = async (req: Request, res: Response) => {
  try {
    console.log("POST /api/notices - Request Body:", req.body);
    const { title, content, category, targetClass, isImportant, attachmentUrl } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Notice Title is required.' });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ message: 'Notice Content is required.' });
    }

    const notice = new Notice({
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      targetClass: targetClass || 'All Classes',
      isImportant: Boolean(isImportant),
      attachmentUrl: attachmentUrl || ''
    });

    await notice.save();
    console.log("Notice created successfully:", notice._id);
    return res.status(201).json(notice);
  } catch (error: any) {
    console.error("Notice creation error:", error);
    return res.status(400).json({ message: error.message || 'Failed to create notice.' });
  }
};

export const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    return res.json(notices);
  } catch (error: any) {
    console.error("Get notices error:", error);
    return res.status(500).json({ message: 'Server error fetching notices.' });
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }
    return res.json({ message: 'Notice removed successfully.' });
  } catch (error: any) {
    console.error("Delete notice error:", error);
    return res.status(500).json({ message: 'Server error deleting notice.' });
  }
};

export const updateNotice = async (req: Request, res: Response) => {
  try {
    const { title, content, category, targetClass, isImportant, attachmentUrl } = req.body;

    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ message: 'Notice Title cannot be empty.' });
    }

    if (content !== undefined && (!content || typeof content !== 'string' || !content.trim())) {
      return res.status(400).json({ message: 'Notice Content cannot be empty.' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (category !== undefined) updateData.category = category;
    if (targetClass !== undefined) updateData.targetClass = targetClass;
    if (isImportant !== undefined) updateData.isImportant = Boolean(isImportant);
    if (attachmentUrl !== undefined) updateData.attachmentUrl = attachmentUrl;

    const notice = await Notice.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }
    return res.json(notice);
  } catch (error: any) {
    console.error("Update notice error:", error);
    return res.status(500).json({ message: 'Server error updating notice.' });
  }
};
