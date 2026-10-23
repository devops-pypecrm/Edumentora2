'use client';

import React, { useTransition, useState, useEffect } from 'react';
import { createUniversity, deleteUniversity, updateUniversity, removeBrochure } from '@/app/admin/university/actions';
import { Trash2, Plus, Upload, MapPin, Edit2, X, Eye, Save, FileText, Download } from 'lucide-react';

type University = {
  id: string;
  name: string;
  location: string;
  description: string;
  mainImage?: string | null;
  logo?: string | null;
  certificates: string[];
  visionHeading?: string | null;
  visionPara?: string | null;
  facilitiesHeading?: string | null;
  facilitiesPara?: string | null;
  featuresHeading?: string | null;
  featuresPara?: string | null;
  whyChooseHeading?: string | null;
  whyChoosePara?: string | null;
  btechProgramsHeading?: string | null;
  btechProgramsPara?: string | null;
  brochure?: { id: string; fileName: string; fileUrl: string } | null;
};

const hasText = (v?: string | null) => !!v && v.trim().length > 0;

export default function UniversityManager({ initialUniversities }: { initialUniversities: University[] }) {
  const [isPending, startTransition] = useTransition();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [mainImageBase64, setMainImageBase64] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [textCertificates, setTextCertificates] = useState<string[]>(['']);
  const [brochureFile, setBrochureFile] = useState<{ fileName: string; fileUrl: string } | null>(null);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);

  // Lock body scroll while a modal is open
  useEffect(() => {
    const isOpen = isFormOpen || !!viewingUniversity;
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isFormOpen, viewingUniversity]);

  const handleCreateOrUpdateUniversity = (formData: FormData) => {
    startTransition(() => {
      if (editingUniversity) {
        updateUniversity(editingUniversity.id, formData).then(() => {
          closeForm();
        });
      } else {
        createUniversity(formData);
        closeForm();
      }
    });
  };

  const openCreateForm = () => {
    setEditingUniversity(null);
    setMainImageBase64(null);
    setLogoBase64(null);
    setTextCertificates(['']);
    setBrochureFile(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (uni: University) => {
    setEditingUniversity(uni);
    setMainImageBase64(uni.mainImage || null);
    setLogoBase64(uni.logo || null);
    setTextCertificates(uni.certificates.length > 0 ? [...uni.certificates, ''] : ['']);
    setBrochureFile(uni.brochure ? { fileName: uni.brochure.fileName, fileUrl: uni.brochure.fileUrl } : null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUniversity(null);
    setMainImageBase64(null);
    setLogoBase64(null);
    setTextCertificates(['']);
    setBrochureFile(null);
  };

  const handleDeleteUniversity = (id: string) => {
    if (confirm('Are you sure you want to delete this university and all its certificates?')) {
      startTransition(() => {
        deleteUniversity(id);
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

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const compressedBase64 = await compressImage(files[0]);
      setLogoBase64(compressedBase64);
    } catch (error) {
      console.error("Error processing logo:", error);
      alert("Failed to process logo.");
    }
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file for the brochure.');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setBrochureFile({ fileName: file.name, fileUrl: event.target?.result as string });
    };
    reader.onerror = () => alert('Failed to read the brochure file.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveBrochure = () => {
    setBrochureFile(null);
    if (editingUniversity?.brochure) {
      startTransition(() => {
        removeBrochure(editingUniversity.id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#002147]">Universities</h2>
        <button
          onClick={openCreateForm}
          className="bg-[#F9010D] hover:bg-[#F9010D] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New University
        </button>
      </div>

      {/* Universities Rows */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {initialUniversities.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Universities Yet</h3>
            <p className="text-gray-500">Click &ldquo;Create New University&rdquo; to add one.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {initialUniversities.map((uni) => (
              <div key={uni.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50 flex items-center justify-center">
                  {uni.logo || uni.mainImage ? (
                    <img src={uni.logo || uni.mainImage || ''} alt={uni.name} className={uni.logo ? 'w-full h-full object-contain p-1' : 'w-full h-full object-cover'} />
                  ) : (
                    <span className="text-gray-300 text-xs font-bold">N/A</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{uni.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{uni.location}</span>
                  </div>
                </div>

                <div className="hidden sm:block flex-shrink-0 text-sm text-gray-600 font-medium">
                  Certificates &amp; Approvals ({uni.certificates.length})
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setViewingUniversity(uni)}
                    className="text-gray-400 hover:text-[#002147] hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    title="View More"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleEditClick(uni)}
                    disabled={isPending}
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Update University"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUniversity(uni.id)}
                    disabled={isPending || uploadingId === uni.id}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete University"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Update Modal */}
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
                <h2 className="text-xl font-bold text-white">
                  {editingUniversity ? `Update University: ${editingUniversity.name}` : 'Add New University'}
                </h2>
                <button type="button" onClick={closeForm} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <form key={editingUniversity ? editingUniversity.id : 'new'} id="add-university-form" action={handleCreateOrUpdateUniversity} className="flex flex-col gap-4">
                  <input type="hidden" name="mainImage" value={mainImageBase64 || ''} />
                  <input type="hidden" name="logo" value={logoBase64 || ''} />
                  <input type="hidden" name="brochureFileName" value={brochureFile?.fileName || ''} />
                  <input type="hidden" name="brochureFileUrl" value={brochureFile?.fileUrl || ''} />
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingUniversity?.name || ''}
                      required
                      placeholder="University Name"
                      className="flex-1 px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                    />
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingUniversity?.location || ''}
                      required
                      placeholder="Location (e.g. Kochi, Kerala)"
                      className="flex-1 px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 h-32">
                    <textarea
                      name="description"
                      defaultValue={editingUniversity?.description || ''}
                      required
                      placeholder="Short description of the university"
                      className="flex-1 px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] resize-none h-full"
                    />
                    <div className="w-full md:w-1/4 h-full flex flex-col items-center justify-center p-2 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
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
                          <span className="text-sm font-medium">Add Logo/Image</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMainImageChange} />
                    </div>
                  </div>

                  {/* University Logo Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">University Logo (shown on card, top-right corner)</label>
                    <div className="w-28 h-28 flex flex-col items-center justify-center p-2 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden">
                      {logoBase64 ? (
                        <>
                          <img src={logoBase64} alt="Logo Preview" className="absolute inset-0 w-full h-full object-contain p-2 bg-white" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">Change Logo</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500">
                          <Upload className="w-5 h-5 mb-1 text-gray-400" />
                          <span className="text-xs font-medium text-center">Add Logo</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} />
                    </div>
                  </div>

                  {/* Dynamic Certificates Text Fields */}
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-gray-700">Certificates & Approvals</label>
                    {textCertificates.map((cert, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          name="certificates"
                          value={cert}
                          onChange={(e) => {
                            const newCerts = [...textCertificates];
                            newCerts[index] = e.target.value;
                            setTextCertificates(newCerts);
                          }}
                          placeholder="e.g. UGC Approved"
                          className="flex-1 px-4 py-2 border border-gray-200 text-[#002147] placeholder-[#002147]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                        />
                        {index === textCertificates.length - 1 && (
                          <button
                            type="button"
                            onClick={() => setTextCertificates([...textCertificates, ''])}
                            className="px-4 py-2 bg-gray-100 text-[#002147] font-medium rounded-xl hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Brochure (PDF) Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">University Brochure (PDF)</label>
                    {brochureFile ? (
                      <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50">
                        <FileText className="w-6 h-6 text-[#F9010D] flex-shrink-0" />
                        <span className="flex-1 text-sm font-medium text-[#002147] truncate">{brochureFile.fileName}</span>
                        <label className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                          Replace
                          <input type="file" accept="application/pdf" className="hidden" onChange={handleBrochureChange} />
                        </label>
                        <button type="button" onClick={handleRemoveBrochure} className="text-xs font-semibold text-red-500 hover:text-red-600">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">Upload brochure PDF</span>
                        <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBrochureChange} />
                      </div>
                    )}
                  </div>

                  {/* Extra Details Sections */}
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                    {/* Vision */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">University Vision</label>
                      <input type="text" name="visionHeading" defaultValue={editingUniversity?.visionHeading || ''} placeholder="Vision Heading" className="px-4 py-2 border border-gray-200 rounded-xl text-[#002147] placeholder-[#002147]/40" />
                      <textarea name="visionPara" defaultValue={editingUniversity?.visionPara || ''} placeholder="Describe the university's vision" className="px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none text-[#002147] placeholder-[#002147]/40" />
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Our Facilities</label>
                      <input type="text" name="facilitiesHeading" defaultValue={editingUniversity?.facilitiesHeading || ''} placeholder="Facilities Heading" className="px-4 py-2 border border-gray-200 rounded-xl text-[#002147] placeholder-[#002147]/40" />
                      <textarea name="facilitiesPara" defaultValue={editingUniversity?.facilitiesPara || ''} placeholder="Describe the facilities offered" className="px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none text-[#002147] placeholder-[#002147]/40" />
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Our Features</label>
                      <input type="text" name="featuresHeading" defaultValue={editingUniversity?.featuresHeading || ''} placeholder="Features Heading" className="px-4 py-2 border border-gray-200 rounded-xl text-[#002147] placeholder-[#002147]/40" />
                      <textarea name="featuresPara" defaultValue={editingUniversity?.featuresPara || ''} placeholder="Describe key features" className="px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none text-[#002147] placeholder-[#002147]/40" />
                    </div>

                    {/* Why Choose */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Why Choose University?</label>
                      <input type="text" name="whyChooseHeading" defaultValue={editingUniversity?.whyChooseHeading || ''} placeholder="Why Choose Heading" className="px-4 py-2 border border-gray-200 rounded-xl text-[#002147] placeholder-[#002147]/40" />
                      <textarea name="whyChoosePara" defaultValue={editingUniversity?.whyChoosePara || ''} placeholder="Explain why students should choose this university" className="px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none text-[#002147] placeholder-[#002147]/40" />
                    </div>

                    {/* B.Tech Programs */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">B.Tech Programs</label>
                      <input type="text" name="btechProgramsHeading" defaultValue={editingUniversity?.btechProgramsHeading || ''} placeholder="B.Tech Programs Heading" className="px-4 py-2 border border-gray-200 rounded-xl text-[#002147] placeholder-[#002147]/40" />
                      <textarea name="btechProgramsPara" defaultValue={editingUniversity?.btechProgramsPara || ''} placeholder="Describe available B.Tech programs" className="px-4 py-2 border border-gray-200 rounded-xl h-24 resize-none text-[#002147] placeholder-[#002147]/40" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="self-end px-6 py-2 bg-[#F9010D] text-white font-medium rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingUniversity ? 'Update University' : 'Add University'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View More Modal (read-only, hides empty sections) */}
      {viewingUniversity && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-[2px]"
          style={{ overscrollBehavior: 'contain' }}
          onClick={() => setViewingUniversity(null)}
        >
          <div className="flex items-start justify-center min-h-full p-4 py-8">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
                <h2 className="text-xl font-bold text-white">{viewingUniversity.name}</h2>
                <button type="button" onClick={() => setViewingUniversity(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {viewingUniversity.mainImage && (
                  <img src={viewingUniversity.mainImage} alt={viewingUniversity.name} className="w-full h-56 object-cover rounded-2xl border border-gray-100" />
                )}

                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{viewingUniversity.location}</span>
                </div>

                <p className="text-gray-700 leading-relaxed">{viewingUniversity.description}</p>

                {viewingUniversity.brochure && (
                  <a
                    href={viewingUniversity.brochure.fileUrl}
                    download={viewingUniversity.brochure.fileName}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F9010D]/5 text-[#F9010D] font-semibold text-sm rounded-xl hover:bg-[#F9010D]/10 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Brochure
                  </a>
                )}

                {viewingUniversity.certificates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">Certificates &amp; Approvals ({viewingUniversity.certificates.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingUniversity.certificates.map((cert, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#002147]/10 text-[#002147] text-sm font-medium rounded-full">{cert}</span>
                      ))}
                    </div>
                  </div>
                )}

                {(hasText(viewingUniversity.visionHeading) || hasText(viewingUniversity.visionPara)) && (
                  <div className="pt-4 border-t border-gray-100">
                    {hasText(viewingUniversity.visionHeading) && <h4 className="font-bold text-[#002147] mb-1">{viewingUniversity.visionHeading}</h4>}
                    {hasText(viewingUniversity.visionPara) && <p className="text-gray-600 text-sm leading-relaxed">{viewingUniversity.visionPara}</p>}
                  </div>
                )}

                {(hasText(viewingUniversity.facilitiesHeading) || hasText(viewingUniversity.facilitiesPara)) && (
                  <div className="pt-4 border-t border-gray-100">
                    {hasText(viewingUniversity.facilitiesHeading) && <h4 className="font-bold text-[#002147] mb-1">{viewingUniversity.facilitiesHeading}</h4>}
                    {hasText(viewingUniversity.facilitiesPara) && <p className="text-gray-600 text-sm leading-relaxed">{viewingUniversity.facilitiesPara}</p>}
                  </div>
                )}

                {(hasText(viewingUniversity.featuresHeading) || hasText(viewingUniversity.featuresPara)) && (
                  <div className="pt-4 border-t border-gray-100">
                    {hasText(viewingUniversity.featuresHeading) && <h4 className="font-bold text-[#002147] mb-1">{viewingUniversity.featuresHeading}</h4>}
                    {hasText(viewingUniversity.featuresPara) && <p className="text-gray-600 text-sm leading-relaxed">{viewingUniversity.featuresPara}</p>}
                  </div>
                )}

                {(hasText(viewingUniversity.whyChooseHeading) || hasText(viewingUniversity.whyChoosePara)) && (
                  <div className="pt-4 border-t border-gray-100">
                    {hasText(viewingUniversity.whyChooseHeading) && <h4 className="font-bold text-[#002147] mb-1">{viewingUniversity.whyChooseHeading}</h4>}
                    {hasText(viewingUniversity.whyChoosePara) && <p className="text-gray-600 text-sm leading-relaxed">{viewingUniversity.whyChoosePara}</p>}
                  </div>
                )}

                {(hasText(viewingUniversity.btechProgramsHeading) || hasText(viewingUniversity.btechProgramsPara)) && (
                  <div className="pt-4 border-t border-gray-100">
                    {hasText(viewingUniversity.btechProgramsHeading) && <h4 className="font-bold text-[#002147] mb-1">{viewingUniversity.btechProgramsHeading}</h4>}
                    {hasText(viewingUniversity.btechProgramsPara) && <p className="text-gray-600 text-sm leading-relaxed">{viewingUniversity.btechProgramsPara}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
