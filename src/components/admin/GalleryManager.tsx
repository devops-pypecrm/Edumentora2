'use client';

import React, { useTransition, useState, useRef } from 'react';
import { createSection, deleteSection, addImages, removeImageUrl } from '@/app/admin/gallery/actions';
import { Trash2, Plus, Upload, Loader2, Link2, Check, AlertTriangle, ImageOff } from 'lucide-react';

type Gallery = {
  id: string;
  section: string;
  images: string[];
};

type UrlCheckStatus = 'idle' | 'checking' | 'valid' | 'invalid';

function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400 ${className}`}>
        <ImageOff className="w-6 h-6" />
        <span className="text-[10px] font-medium">Broken link</span>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

export default function GalleryManager({ initialGalleries }: { initialGalleries: Gallery[] }) {
  const [isPending, startTransition] = useTransition();
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [urlStatus, setUrlStatus] = useState<Record<string, UrlCheckStatus>>({});
  const checkTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleCreateSection = (formData: FormData) => {
    startTransition(() => {
      createSection(formData);
    });
  };

  const handleDeleteSection = (id: string) => {
    if (confirm('Are you sure you want to delete this entire section and all its images?')) {
      startTransition(() => {
        deleteSection(id);
      });
    }
  };

  const handleRemoveImage = (id: string, url: string, currentImages: string[]) => {
    if (confirm('Remove this image?')) {
      startTransition(() => {
        removeImageUrl(id, url, currentImages);
      });
    }
  };

  // Helper to compress image before converting to base64
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
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
          
          // Compress to webp for better sizing in MongoDB
          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingSectionId(sectionId);

    try {
      const base64Images: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedBase64 = await compressImage(files[i]);
        base64Images.push(compressedBase64);
      }

      startTransition(() => {
        addImages(sectionId, base64Images).finally(() => {
          setUploadingSectionId(null);
        });
      });
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Failed to process images.");
      setUploadingSectionId(null);
    }
    
    // Reset file input
    e.target.value = '';
  };

  const handleUrlInputChange = (sectionId: string, value: string) => {
    setUrlInputs((prev) => ({ ...prev, [sectionId]: value }));

    if (checkTimers.current[sectionId]) clearTimeout(checkTimers.current[sectionId]);

    const trimmed = value.trim();
    if (!trimmed) {
      setUrlStatus((prev) => ({ ...prev, [sectionId]: 'idle' }));
      return;
    }

    setUrlStatus((prev) => ({ ...prev, [sectionId]: 'checking' }));
    checkTimers.current[sectionId] = setTimeout(() => {
      const testImg = new Image();
      testImg.onload = () => setUrlStatus((prev) => ({ ...prev, [sectionId]: 'valid' }));
      testImg.onerror = () => setUrlStatus((prev) => ({ ...prev, [sectionId]: 'invalid' }));
      testImg.src = trimmed;
    }, 500);
  };

  const handleAddImageUrl = (sectionId: string) => {
    const url = (urlInputs[sectionId] || '').trim();
    if (!url || urlStatus[sectionId] !== 'valid') return;
    startTransition(() => {
      addImages(sectionId, [url]).then(() => {
        setUrlInputs((prev) => ({ ...prev, [sectionId]: '' }));
        setUrlStatus((prev) => ({ ...prev, [sectionId]: 'idle' }));
      });
    });
  };

  return (
    <div className="space-y-8">
      {/* Create Section Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[#002147] mb-4">Create New Section</h2>
        <form action={handleCreateSection} className="flex gap-4">
          <input
            type="text"
            name="sectionName"
            required
            className="flex-1 px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
          />
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2 bg-[#F9010D] text-white font-medium rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Section
          </button>
        </form>
      </div>

      {/* Existing Sections */}
      <div className="space-y-6">
        {initialGalleries.map((gallery) => (
          <div key={gallery.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{gallery.section}</h3>
                <p className="text-sm text-gray-500">{gallery.images.length} images</p>
              </div>
              <button
                onClick={() => handleDeleteSection(gallery.id)}
                disabled={isPending || uploadingSectionId === gallery.id}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Delete Section"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Add Image Form (File Upload) */}
            <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
              <label className="flex-1 flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-gray-100 rounded-lg transition-colors">
                {uploadingSectionId === gallery.id ? (
                  <div className="flex items-center gap-2 text-blue-600 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing and Uploading...
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">Click to select images</span>
                    <span className="text-xs text-gray-500 mt-1">Supports multiple JPG, PNG, WEBP</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, gallery.id)}
                  disabled={isPending || uploadingSectionId === gallery.id}
                />
              </label>
            </div>

            {/* Add Image via URL */}
            <div className="mb-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={urlInputs[gallery.id] || ''}
                    onChange={(e) => handleUrlInputChange(gallery.id, e.target.value)}
                    placeholder="Paste a direct image URL (ending in .jpg, .png, .webp…)"
                    className={`w-full pl-9 pr-9 py-2 border rounded-xl text-[#002147] focus:outline-none focus:ring-2 ${
                      urlStatus[gallery.id] === 'invalid'
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : urlStatus[gallery.id] === 'valid'
                          ? 'border-green-300 focus:ring-green-100 focus:border-green-400'
                          : 'border-gray-200 focus:ring-[#002147]/20 focus:border-[#002147]'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {urlStatus[gallery.id] === 'checking' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                    {urlStatus[gallery.id] === 'valid' && <Check className="w-4 h-4 text-green-500" />}
                    {urlStatus[gallery.id] === 'invalid' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddImageUrl(gallery.id)}
                  disabled={isPending || urlStatus[gallery.id] !== 'valid'}
                  className="px-4 py-2 bg-[#002147] text-white font-medium rounded-xl hover:bg-[#002147]/90 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add URL
                </button>
              </div>
              {urlStatus[gallery.id] === 'invalid' && (
                <p className="text-xs text-red-500 mt-1.5">
                  This doesn&rsquo;t look like a direct image link (e.g. a Google search or webpage URL won&rsquo;t work). Right-click the image itself and choose &ldquo;Copy image address&rdquo;.
                </p>
              )}
              {urlStatus[gallery.id] === 'valid' && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={urlInputs[gallery.id]} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  <span className="text-xs text-green-600 font-medium">Looks good — ready to add</span>
                </div>
              )}
            </div>

            {/* Images Grid */}
            {gallery.images.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No images in this section yet. Upload some files above!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.images.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <SafeImage
                      src={url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveImage(gallery.id, url, gallery.images)}
                        disabled={isPending}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transform scale-75 group-hover:scale-100 transition-all"
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {initialGalleries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Gallery Sections</h3>
            <p className="text-gray-500">Create your first section above to start building your gallery.</p>
          </div>
        )}
      </div>
    </div>
  );
}
