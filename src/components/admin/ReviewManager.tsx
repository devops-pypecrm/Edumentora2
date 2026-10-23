'use client';

import React, { useState, useTransition, useRef } from 'react';
import { Star, Trash2, Calendar, User, MessageSquare, Edit2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { createReview, deleteReview, updateReview } from '@/app/admin/reviews/actions';

type Review = {
  id: string;
  username: string;
  postedDate: Date;
  rating: number;
  comment: string;
  image?: string | null;
  createdAt: Date;
};

export default function ReviewManager({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState<Review[]>(
    initialReviews.map(r => ({
      ...r,
      postedDate: new Date(r.postedDate),
      createdAt: new Date(r.createdAt)
    }))
  );
  
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [username, setUsername] = useState('');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [hoverRating, setHoverRating] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setUsername('');
    setPostedDate(new Date().toISOString().split('T')[0]);
    setRating(5);
    setComment('');
    setImageBase64(null);
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setUsername(review.username);
    setPostedDate(review.postedDate.toISOString().split('T')[0]);
    setRating(review.rating);
    setComment(review.comment);
    setImageBase64(review.image || null);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality JPEG
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File is too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      const compressedBase64 = await compressImage(file);
      setImageBase64(compressedBase64);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image');
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be uploaded again if removed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('rating', rating.toString());
    if (imageBase64) {
      formData.append('image', imageBase64);
    }
    
    startTransition(async () => {
      let result;
      if (editingId) {
        result = await updateReview(editingId, formData);
      } else {
        result = await createReview(formData);
      }
      
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    setDeleteId(id);
    
    startTransition(async () => {
      const result = await deleteReview(id);
      if (result.success) {
        setReviews(prev => prev.filter(r => r.id !== id));
        if (editingId === id) resetForm();
      } else {
        alert(result.error || 'Failed to delete review');
      }
      setDeleteId(null);
    });
  };

  return (
    <div className="space-y-8">
      {/* Create / Edit Review Form */}
      <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-colors ${editingId ? 'border-yellow-400/50' : 'border-gray-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#002147] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#F9010D]" />
            {editingId ? 'Edit Review' : 'Add New Review'}
          </h2>
          
          {editingId && (
            <button 
              onClick={resetForm}
              className="text-sm flex items-center gap-1 text-gray-500 hover:text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" /> Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>

            {/* Posted Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" /> Posted Date
              </label>
              <input
                type="date"
                name="postedDate"
                value={postedDate}
                onChange={(e) => setPostedDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Rating */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Rating</label>
              <div className="flex gap-1 bg-gray-50 p-3 rounded-xl border border-gray-100 w-max">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-white text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-gray-400" /> Profile Image (Optional)
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                    id="profile-image-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {isUploading ? 'Compressing...' : 'Click to upload'}
                      </p>
                    </div>
                  </label>
                </div>
                
                {imageBase64 && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                    <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageBase64(null)}
                      className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Comment</label>
            <textarea
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isPending || isUploading}
            className={`w-full sm:w-auto px-8 py-3 text-white font-medium rounded-xl transition-colors disabled:opacity-70 ${
              editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#002147] hover:bg-[#002147]/90'
            }`}
          >
            {isPending ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[#002147] mb-6">All Reviews</h2>
        
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            No reviews created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className={`border p-5 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] relative group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all ${editingId === review.id ? 'border-yellow-400/50 bg-yellow-50/20' : 'border-gray-100'}`}>
                
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(review)}
                    disabled={isPending}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Review"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={isPending && deleteId === review.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-white text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  {review.image && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <img src={review.image} alt={review.username} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 italic text-sm mb-4 line-clamp-4">"{review.comment}"</p>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col">
                  <span className="font-semibold text-[#002147]">{review.username}</span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {review.postedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
