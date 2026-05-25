export interface FacultyMember {
  _id: string;
  name: string;
  qualifications: string[];
  experience: string;
  subject: string;
  imageUrl: string;
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  isImportant: boolean;
  createdAt: string;
}

export interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  createdAt: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: any[];
  duration: number;
  isPublished: boolean;
  category: string;
  createdAt: string;
}

export interface StudyNote {
  _id: string;
  title: string;
  category: string;
  fileUrl: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
}
