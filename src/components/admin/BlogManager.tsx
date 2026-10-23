'use client';

import React, { useTransition, useState } from 'react';
import { createBlog, updateBlog, deleteBlog } from '@/app/admin/blogs/actions';
import { Plus, Trash2, Calendar, LayoutList, Upload, X, Pencil } from 'lucide-react';

type BlogSection = {
  subHeading: string;
  subPara: string;
};

type Blog = {
  id: string;
  date: Date;
  category: string;
  sectionDis: string;
  author?: string | null;
  mainImage?: string | null;
  mainDis: BlogSection[];
};

export default function BlogManager({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [mainDis, setMainDis] = useState<BlogSection[]>([{ subHeading: '', subPara: '' }]);
  const [mainImageBase64, setMainImageBase64] = useState<string | null>(null);

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
    setMainDis([{ subHeading: '', subPara: '' }]);
    setMainImageBase64(null);
  };

  const openCreateForm = () => {
    setEditingBlog(null);
    setMainDis([{ subHeading: '', subPara: '' }]);
    setMainImageBase64(null);
    setIsFormOpen(true);
  };

  const openEditForm = (blog: Blog) => {
    setEditingBlog(blog);
    setMainDis(blog.mainDis.length > 0 ? blog.mainDis : [{ subHeading: '', subPara: '' }]);
    setMainImageBase64(blog.mainImage || null);
    setIsFormOpen(true);
  };

  const handleSubmitBlog = (formData: FormData) => {
    // Inject the mainDis JSON string into the form data
    formData.set('mainDis', JSON.stringify(mainDis));

    startTransition(async () => {
      try {
        if (editingBlog) {
          await updateBlog(editingBlog.id, formData);
          closeForm();
          alert('Blog updated successfully!');
        } else {
          await createBlog(formData);
          closeForm();
          alert('Blog published successfully!');
        }
      } catch (error) {
        console.error('Error saving blog:', error);
        alert('Failed to save blog! Please check the terminal for errors. You may need to restart the server.');
      }
    });
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      startTransition(() => {
        deleteBlog(id);
      });
    }
  };

  const addMainDisSection = () => {
    setMainDis([...mainDis, { subHeading: '', subPara: '' }]);
  };

  const updateMainDisSection = (index: number, field: keyof BlogSection, value: string) => {
    const updated = [...mainDis];
    updated[index][field] = value;
    setMainDis(updated);
  };

  const removeMainDisSection = (index: number) => {
    if (mainDis.length === 1) return;
    const updated = mainDis.filter((_, i) => i !== index);
    setMainDis(updated);
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

          const dataUrl = canvas.toDataURL('image/webp', 0.8);
          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const compressedBase64 = await compressImage(files[0]);
      setMainImageBase64(compressedBase64);
    } catch (error) {
      console.error("Error processing main image:", error);
      alert("Failed to process main image.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#002147]">Blogs</h2>
        <button
          onClick={openCreateForm}
          className="bg-[#F9010D] hover:bg-[#F9010D] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New Blog
        </button>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Content Blocks</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No blogs created yet. Click &ldquo;Create New Blog&rdquo; to publish your first one.
                  </td>
                </tr>
              ) : (
                initialBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {blog.mainImage ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                          <img src={blog.mainImage} alt={blog.sectionDis} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300 text-xs font-bold">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-sm truncate">{blog.sectionDis}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5"><LayoutList className="w-3.5 h-3.5" /> {blog.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(blog.date).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{blog.mainDis.length}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                      <button
                        onClick={() => openEditForm(blog)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-[#002147] hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Update Blog"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Blog"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Blog Modal */}
      {isFormOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-[2px]"
          style={{ overscrollBehavior: 'contain' }}
          onClick={closeForm}
        >
          <div className="flex items-start justify-center min-h-full p-4 py-8">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
                <h2 className="text-xl font-bold text-white">{editingBlog ? 'Update Blog' : 'Create New Blog'}</h2>
                <button type="button" onClick={closeForm} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form id="add-blog-form" action={handleSubmitBlog} className="flex flex-col gap-6" key={editingBlog?.id ?? 'new'}>
                  <input type="hidden" name="mainImage" value={mainImageBase64 || ''} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Date</label>
                      <input
                        type="date"
                        name="date"
                        required
                        defaultValue={editingBlog ? new Date(editingBlog.date).toISOString().slice(0, 10) : undefined}
                        className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Category</label>
                      <input
                        type="text"
                        name="category"
                        placeholder="e.g. Technology, Education"
                        required
                        defaultValue={editingBlog?.category}
                        className="w-full px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Author (optional)</label>
                      <input
                        type="text"
                        name="author"
                        placeholder="e.g. Jane Doe, Academic Counselor"
                        defaultValue={editingBlog?.author ?? ''}
                        className="w-full px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 h-32">
                    <div className="flex-1 space-y-2 h-full">
                      <label className="text-sm font-semibold text-gray-700">Section Description (Intro)</label>
                      <textarea
                        name="sectionDis"
                        placeholder="Short description or intro paragraph..."
                        required
                        defaultValue={editingBlog?.sectionDis}
                        className="w-full px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] resize-none h-[calc(100%-28px)]"
                      />
                    </div>
                    <div className="w-full md:w-1/4 h-full flex flex-col items-center justify-center p-2 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden mt-7 md:mt-0">
                      {mainImageBase64 ? (
                        <>
                          <img src={mainImageBase64} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload className="w-5 h-5 mb-1 text-gray-400" />
                          <span className="text-sm font-medium">Add Image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMainImageChange} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">Main Description Blocks</label>
                    </div>

                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      {mainDis.map((section, index) => (
                        <div key={index} className="flex gap-4 items-start relative bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              placeholder="Sub Heading"
                              value={section.subHeading}
                              onChange={(e) => updateMainDisSection(index, 'subHeading', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                            />
                            <textarea
                              placeholder="Sub Paragraph"
                              value={section.subPara}
                              onChange={(e) => updateMainDisSection(index, 'subPara', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] resize-none"
                            />
                          </div>

                          {mainDis.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMainDisSection(index)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors mt-1"
                              title="Remove Block"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addMainDisSection}
                        className="w-full py-3 bg-white border border-dashed border-gray-300 text-gray-500 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Block
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="self-end px-8 py-3 bg-[#F9010D] text-white font-medium rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {editingBlog ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingBlog ? 'Update Blog' : 'Publish Blog'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
