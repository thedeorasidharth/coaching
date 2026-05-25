"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Plus, Trash2, Camera, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { GalleryImage } from "@/types";

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({ imageUrl: "", caption: "" });

  const fetchGallery = async () => {
    try {
      const { data } = await api.get("/gallery");
      setImages(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.imageUrl) return alert("Please provide an image URL");
    try {
      await api.post("/gallery", newImage);
      setNewImage({ imageUrl: "", caption: "" });
      setShowAddForm(false);
      fetchGallery();
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await api.delete(`/gallery/${id}`);
        fetchGallery();
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Manage <span className="text-primary italic">Gallery</span>
          </h1>
          <p className="text-navy/60 mt-1">Upload campus photos and event highlights.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2">
          {showAddForm ? <X size={20} /> : <Plus size={20} />} {showAddForm ? "Cancel" : "Add Photo URL"}
        </Button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 max-w-xl mx-auto border-primary/20 shadow-xl text-center">
            <form onSubmit={handleAddImage} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest px-2">Image URL</label>
                <input 
                  required
                  type="url" 
                  value={newImage.imageUrl}
                  onChange={(e) => setNewImage({...newImage, imageUrl: e.target.value})}
                  className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              {newImage.imageUrl && (
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden border-2 border-navy/10 mt-4">
                  <img src={newImage.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-2 text-left">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest px-2">Caption (Optional)</label>
                <input 
                  type="text" 
                  value={newImage.caption}
                  onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
                  className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. Physics Lab Session"
                />
              </div>
              <Button type="submit" className="w-full h-14 text-lg">Publish to Gallery</Button>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-48 rounded-[2rem] bg-navy/5 animate-pulse" />)
        ) : images.length > 0 ? (
          images.map((img) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-[2rem] overflow-hidden break-inside-avoid shadow-lg"
            >
              <img 
                src={img.imageUrl} 
                alt={img.caption || "Gallery"} 
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                 <button 
                  onClick={() => handleDeleteImage(img._id)}
                  className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center mb-4 transform scale-0 group-hover:scale-100 transition-transform duration-500"
                 >
                    <Trash2 size={24} />
                 </button>
                 {img.caption && (
                   <p className="text-white font-bold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                     {img.caption}
                   </p>
                 )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-navy/5 rounded-[3rem]">
            <ImageIcon size={48} className="mx-auto text-navy/20 mb-4" />
            <h3 className="text-xl font-bold text-navy/40">Your gallery is empty</h3>
          </div>
        )}
      </div>
    </div>
  );
}
