"use client";

import React, { useState, useRef } from "react";
import { 
  ImageIcon, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Loader2, 
  X, 
  RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";

interface QuestionImageUploaderProps {
  questionId?: string;
  image?: { url: string; publicId: string };
  disabled?: boolean;
  onImageChange: (newImage?: { url: string; publicId: string }) => void;
}

export const QuestionImageUploader: React.FC<QuestionImageUploaderProps> = ({
  questionId,
  image,
  disabled = false,
  onImageChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isBusy = loading || disabled;

  const clearStagedFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate MIME type
    const validMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("Unsupported format. Please select a JPG, PNG, or WEBP image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 2. Validate File Size (<= 2 MB)
    const maxSizeBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg("File size exceeds maximum allowed limit of 2 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Create local preview
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadStagedFile = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      let uploadedImage: { url: string; publicId: string } | null = null;

      if (questionId) {
        // Upload directly to existing question in DB
        const res = await api.post(`/questions/${questionId}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImage = res.data.questionImage;
      } else {
        // Standalone upload for unsaved question in test builder
        const res = await api.post("/quizzes/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedImage = res.data.questionImage || {
          url: res.data.url,
          publicId: res.data.publicId,
        };
      }

      if (uploadedImage && uploadedImage.url) {
        // If replacing an unsaved image, delete the old Cloudinary asset
        if (!questionId && image?.publicId && image.publicId !== uploadedImage.publicId) {
          api.delete("/quizzes/delete-image", { data: { publicId: image.publicId } }).catch(() => {});
        }
        onImageChange(uploadedImage);
        setSuccessMsg("Diagram uploaded to Cloudinary successfully!");
        clearStagedFile();
      } else {
        throw new Error("Cloudinary did not return a valid image URL.");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to upload image. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!image?.publicId && !image?.url) return;

    const confirmed = window.confirm("Are you sure you want to remove this image from the question?");
    if (!confirmed) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (questionId) {
        await api.delete(`/questions/${questionId}/image`);
      } else if (image.publicId) {
        await api.delete("/quizzes/delete-image", {
          data: { publicId: image.publicId },
        });
      }

      onImageChange(undefined);
      clearStagedFile();
      setSuccessMsg("Diagram removed successfully.");
    } catch (err: any) {
      console.error("Image removal error:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to remove image. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentDisplayUrl = previewUrl || image?.url;

  return (
    <div className="space-y-2 p-3 bg-navy/[0.02] border border-navy/10 rounded-2xl">
      {/* Label & Format Specs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-[10px] font-black text-navy/50 uppercase tracking-widest flex items-center gap-1.5">
          <ImageIcon size={13} className="text-primary" /> Question Diagram (Optional)
        </label>
        <span className="text-[9px] font-bold text-navy/40 uppercase tracking-wider">
          JPG, PNG, WEBP • Max 2 MB
        </span>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Message */}
      {successMsg && (
        <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-bold flex items-center gap-2">
          <Check size={15} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        id="question-image-file-input"
        data-testid="question-image-input"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isBusy}
      />

      {/* Image Preview & Controls */}
      {currentDisplayUrl ? (
        <div className="space-y-3 pt-1">
          <div className="relative inline-block border border-navy/10 rounded-xl overflow-hidden bg-white shadow-sm max-w-full">
            <img
              src={currentDisplayUrl}
              alt="Question preview"
              className="max-h-44 max-w-full object-contain p-2"
            />
            {selectedFile && (
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-black uppercase shadow">
                Unsaved Preview
              </span>
            )}
          </div>

          {selectedFile && (
            <p className="text-[10px] font-bold text-navy/50">
              Selected: <span className="text-navy">{selectedFile.name}</span> (
              {(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {selectedFile ? (
              <>
                <Button
                  id="upload-save-diagram-btn"
                  type="button"
                  size="sm"
                  disabled={isBusy}
                  onClick={handleUploadStagedFile}
                  className="h-9 px-4 text-xs font-black gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Uploading to Cloudinary...
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload / Save Diagram
                    </>
                  )}
                </Button>
                <Button
                  id="cancel-staged-diagram-btn"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={clearStagedFile}
                  className="h-9 px-3 text-xs font-bold border-navy/10 rounded-xl"
                >
                  <X size={14} /> Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  id="replace-diagram-btn"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 px-3 text-xs font-bold gap-1.5 border-navy/15 rounded-xl hover:border-primary/40 hover:text-primary"
                >
                  <RefreshCw size={13} /> Replace Image
                </Button>
                <Button
                  id="remove-diagram-btn"
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isBusy}
                  onClick={handleRemoveImage}
                  className="h-9 px-3 text-xs font-bold gap-1.5 border-red-500/20 text-red-600 hover:bg-red-50 rounded-xl"
                >
                  {loading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  Remove Image
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Empty State: Choose Image Button */
        <div className="flex items-center gap-3 pt-1">
          <Button
            id="choose-image-btn"
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 px-4 text-xs font-bold gap-1.5 border-navy/15 text-navy hover:border-primary/40 hover:text-primary rounded-xl"
          >
            <Upload size={14} /> Choose Image
          </Button>
          <span className="text-[10px] text-navy/40 font-medium italic">
            Diagram will be attached to this question.
          </span>
        </div>
      )}
    </div>
  );
};
