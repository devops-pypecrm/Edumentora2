'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { Trash2, Plus, Upload, X, Save, Edit2, Eye } from 'lucide-react';
import { createProgram, deleteProgram, updateProgram } from '@/app/admin/programs/actions';
import { compressImage } from '@/utils/imageCompression';

type Program = {
  id: string;
  topic: string;
  heroImage: string | null;
  heading: string;
  subHeading: string | null;
  paragraph: string;
  blocks: any[];
  createdAt: Date;
};

export default function ApprenticeshipProgramManager({ initialPrograms }: { initialPrograms: Program[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);

  // Lock body scroll when modal is open to prevent scroll interference/lag
  useEffect(() => {
    if (isModalOpen || viewingProgram) {
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
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isModalOpen, viewingProgram]);

  const defaultFormData = {
    topic: '',
    heroHeading: '',
    heroParagraph: '',
    heroImage: '',

    overviews: [
      { heading: '', subHeading: '', paragraph: '' }
    ],

    howItWorksBlocks: [
      {
        sectionTitle: 'How it Works',
        steps: [
          { heading: '', description: '' },
          { heading: '', description: '' },
          { heading: '', description: '' },
        ]
      }
    ],

    programsBlocks: [
      {
        sectionTitle: 'Programs & Eligibility',
        ugPrograms: [''],
        pgPrograms: [''],
        whoCanApply: ['']
      }
    ],

    whyChooseBlocks: [
      {
        sectionTitle: 'Why Choose?',
        points: [''],
        conclusion: ''
      }
    ]
  };

  const [formData, setFormData] = useState(defaultFormData);

  const handleEdit = (program: Program) => {
    const block = program.blocks.find(b => b.type === 'apprenticeship-layout');
    const data = block?.data || {};

    // OVERVIEWS
    let overviews = [];
    if (data.overviews && Array.isArray(data.overviews) && data.overviews.length > 0) {
      overviews = data.overviews;
    } else if (data.overview) {
      // Legacy single object migration
      overviews = [{
        heading: data.overview.heading || '',
        subHeading: data.overview.subHeading || '',
        paragraph: data.overview.paragraph || ''
      }];
    } else {
      overviews = [...defaultFormData.overviews];
    }

    // HOW IT WORKS
    let howItWorksBlocks = [];
    if (data.howItWorksBlocks && Array.isArray(data.howItWorksBlocks) && data.howItWorksBlocks.length > 0) {
      howItWorksBlocks = data.howItWorksBlocks;
    } else if (data.howItWorks) {
      // Legacy single array migration
      let steps = data.howItWorks && data.howItWorks.length > 0 ? data.howItWorks : [...defaultFormData.howItWorksBlocks[0].steps];
      while (steps.length < 3) steps.push({ heading: '', description: '' });
      howItWorksBlocks = [{
        sectionTitle: data.howItWorksSectionTitle || 'How it Works',
        steps: steps
      }];
    } else {
      howItWorksBlocks = [...defaultFormData.howItWorksBlocks];
    }

    // PROGRAMS
    let programsBlocks = [];
    if (data.programsBlocks && Array.isArray(data.programsBlocks) && data.programsBlocks.length > 0) {
      programsBlocks = data.programsBlocks;
    } else if (data.programsAndEligibility) {
      // Legacy single object migration
      programsBlocks = [{
        sectionTitle: data.programsAndEligibility.title || 'Programs & Eligibility',
        ugPrograms: data.programsAndEligibility.ugPrograms?.length ? data.programsAndEligibility.ugPrograms : [''],
        pgPrograms: data.programsAndEligibility.pgPrograms?.length ? data.programsAndEligibility.pgPrograms : [''],
        whoCanApply: data.programsAndEligibility.whoCanApply?.length ? data.programsAndEligibility.whoCanApply : ['']
      }];
    } else {
      programsBlocks = [...defaultFormData.programsBlocks];
    }

    // WHY CHOOSE
    let whyChooseBlocks = [];
    if (data.whyChooseBlocks && Array.isArray(data.whyChooseBlocks) && data.whyChooseBlocks.length > 0) {
      whyChooseBlocks = data.whyChooseBlocks;
    } else if (data.whyChoose) {
      // Legacy single object migration
      whyChooseBlocks = [{
        sectionTitle: data.whyChoose.title || 'Why Choose?',
        points: data.whyChoose.points?.length ? data.whyChoose.points : [''],
        conclusion: data.whyChoose.conclusion || ''
      }];
    } else {
      whyChooseBlocks = [...defaultFormData.whyChooseBlocks];
    }

    setFormData({
      topic: program.topic || '',
      heroHeading: program.heading || '',
      heroParagraph: program.paragraph || '',
      heroImage: program.heroImage || '',
      overviews,
      howItWorksBlocks,
      programsBlocks,
      whyChooseBlocks
    });

    setEditingProgramId(program.id);
    setIsModalOpen(true);
  };

  const handleHeroImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const url = await compressImage(files[0]);
      setFormData(prev => ({ ...prev, heroImage: url }));
    }
  };

  const handleStringArrayChange = (blockField: 'programsBlocks' | 'whyChooseBlocks', blockIndex: number, arrayField: string, itemIndex: number, value: string) => {
    setFormData(prev => {
      const newBlocks = [...prev[blockField]] as any[];
      const newArray = [...newBlocks[blockIndex][arrayField]];
      newArray[itemIndex] = value;
      newBlocks[blockIndex] = { ...newBlocks[blockIndex], [arrayField]: newArray };
      return { ...prev, [blockField]: newBlocks };
    });
  };

  const addStringArrayItem = (blockField: 'programsBlocks' | 'whyChooseBlocks', blockIndex: number, arrayField: string) => {
    setFormData(prev => {
      const newBlocks = [...prev[blockField]] as any[];
      newBlocks[blockIndex] = { ...newBlocks[blockIndex], [arrayField]: [...newBlocks[blockIndex][arrayField], ''] };
      return { ...prev, [blockField]: newBlocks };
    });
  };

  const removeStringArrayItem = (blockField: 'programsBlocks' | 'whyChooseBlocks', blockIndex: number, arrayField: string, itemIndex: number) => {
    setFormData(prev => {
      const newBlocks = [...prev[blockField]] as any[];
      const newArray = [...newBlocks[blockIndex][arrayField]];
      newArray.splice(itemIndex, 1);
      newBlocks[blockIndex] = { ...newBlocks[blockIndex], [arrayField]: newArray };
      return { ...prev, [blockField]: newBlocks };
    });
  };

  const addBlock = (blockField: 'overviews' | 'howItWorksBlocks' | 'programsBlocks' | 'whyChooseBlocks') => {
    setFormData(prev => {
      return { ...prev, [blockField]: [...prev[blockField], defaultFormData[blockField][0]] };
    });
  };

  const removeBlock = (blockField: 'overviews' | 'howItWorksBlocks' | 'programsBlocks' | 'whyChooseBlocks', blockIndex: number) => {
    setFormData(prev => {
      if (prev[blockField].length <= 1) return prev; // Keep at least one
      const newBlocks = [...prev[blockField]];
      newBlocks.splice(blockIndex, 1);
      return { ...prev, [blockField]: newBlocks };
    });
  };

  // Removes the whole section (all blocks under it) so it's excluded from the saved
  // program and won't render on the public page at all.
  const deleteSection = (blockField: 'overviews' | 'howItWorksBlocks' | 'programsBlocks' | 'whyChooseBlocks') => {
    if (!confirm('Delete this section? It will no longer be shown on the program page.')) return;
    setFormData(prev => ({ ...prev, [blockField]: [] }));
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.set('topic', formData.topic || 'General');
    data.set('heroImage', formData.heroImage);
    data.set('heading', formData.heroHeading);
    // Backward compatibility for old UI renderers, pick the first sub-heading if available
    data.set('subHeading', formData.overviews[0]?.subHeading || '');
    data.set('paragraph', formData.heroParagraph);

    const structuredBlocks = [
      {
        type: 'apprenticeship-layout',
        data: {
          // New repeatable structure
          overviews: formData.overviews,
          howItWorksBlocks: formData.howItWorksBlocks,
          programsBlocks: formData.programsBlocks.map(b => ({
            ...b,
            ugPrograms: b.ugPrograms.filter(p => p.trim()),
            pgPrograms: b.pgPrograms.filter(p => p.trim()),
            whoCanApply: b.whoCanApply.filter(p => p.trim())
          })),
          whyChooseBlocks: formData.whyChooseBlocks.map(b => ({
            ...b,
            points: b.points.filter(p => p.trim())
          }))
        }
      }
    ];

    data.set('blocks', JSON.stringify(structuredBlocks));

    startTransition(async () => {
      try {
        if (editingProgramId) {
          await updateProgram(editingProgramId, data);
          alert('Program Updated!');
        } else {
          await createProgram(data);
          alert('Program Saved!');
        }
        setIsModalOpen(false);
        setEditingProgramId(null);
        setFormData(defaultFormData);
      } catch (err) {
        console.error(err);
        alert('Failed to save program');
      }
    });
  };

  // Extracts the same structured block data as handleEdit, for read-only viewing.
  const parseProgramBlocks = (program: Program) => {
    const block = program.blocks.find((b: any) => b.type === 'apprenticeship-layout');
    const data = block?.data || {};

    const overviews = (data.overviews && Array.isArray(data.overviews) && data.overviews.length > 0)
      ? data.overviews
      : data.overview
        ? [{ heading: data.overview.heading || '', subHeading: data.overview.subHeading || '', paragraph: data.overview.paragraph || '' }]
        : [];

    const howItWorksBlocks = (data.howItWorksBlocks && Array.isArray(data.howItWorksBlocks) && data.howItWorksBlocks.length > 0)
      ? data.howItWorksBlocks
      : data.howItWorks
        ? [{ sectionTitle: data.howItWorksSectionTitle || 'How it Works', steps: data.howItWorks }]
        : [];

    const programsBlocks = (data.programsBlocks && Array.isArray(data.programsBlocks) && data.programsBlocks.length > 0)
      ? data.programsBlocks
      : data.programsAndEligibility
        ? [{
            sectionTitle: data.programsAndEligibility.title || 'Programs & Eligibility',
            ugPrograms: data.programsAndEligibility.ugPrograms || [],
            pgPrograms: data.programsAndEligibility.pgPrograms || [],
            whoCanApply: data.programsAndEligibility.whoCanApply || [],
          }]
        : [];

    const whyChooseBlocks = (data.whyChooseBlocks && Array.isArray(data.whyChooseBlocks) && data.whyChooseBlocks.length > 0)
      ? data.whyChooseBlocks
      : data.whyChoose
        ? [{ sectionTitle: data.whyChoose.title || 'Why Choose?', points: data.whyChoose.points || [], conclusion: data.whyChoose.conclusion || '' }]
        : [];

    return { overviews, howItWorksBlocks, programsBlocks, whyChooseBlocks };
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      startTransition(() => {
        deleteProgram(id);
      });
    }
  };

  return (
    <div className="font-[Poppins] space-y-6">
      
      {/* ── SAVED PROGRAMS ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#002147]">Saved Programs</h2>
          <button 
            onClick={() => {
              setEditingProgramId(null);
              setFormData(defaultFormData);
              setIsModalOpen(true);
            }}
            className="bg-[#F9010D] hover:bg-[#F9010D] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Program
          </button>
        </div>

        {initialPrograms.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
            No programs saved yet. Create one to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {initialPrograms.map(program => (
              <div key={program.id} className="flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors">
                <span className="flex-shrink-0 px-3 py-1 bg-[#002147]/10 text-[#002147] text-xs font-bold uppercase rounded-full">
                  {program.topic}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#002147] truncate">{program.heading}</h3>
                  <p className="text-sm text-gray-500 truncate">{program.paragraph}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setViewingProgram(program)}
                    className="text-gray-400 hover:text-[#002147] hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    title="View More"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(program)}
                    disabled={isPending}
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Update Program"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    disabled={isPending}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── CREATE/EDIT MODAL ── */}
      {isModalOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-[2px]"
          style={{ overscrollBehavior: 'contain' }}
        >
          <div className="flex items-start justify-center min-h-full p-4 py-8">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">{editingProgramId ? 'Edit Apprenticeship Program' : 'Create New Program'}</h2>
              <button type="button" onClick={() => { setIsModalOpen(false); setEditingProgramId(null); }} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <form id="apprenticeship-form" onSubmit={handleCreateProgram} className="space-y-12">
                
                {/* 1. HERO SECTION */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-[#F9010D]">Hero Section</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1"><span>Topic</span><span className="font-normal text-gray-400 tracking-normal normal-case">{formData.topic.length}/50</span></label>
                        <input required value={formData.topic} maxLength={50} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                      </div>
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1"><span>Main Heading</span><span className="font-normal text-gray-400 tracking-normal normal-case">{formData.heroHeading.length}/100</span></label>
                        <input required value={formData.heroHeading} maxLength={100} onChange={e => setFormData({...formData, heroHeading: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                      </div>
                      <div>
                        <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1"><span>Paragraph</span><span className="font-normal text-gray-400 tracking-normal normal-case">{formData.heroParagraph.length}/300</span></label>
                        <textarea required value={formData.heroParagraph} maxLength={300} onChange={e => setFormData({...formData, heroParagraph: e.target.value})} rows={3} className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Image</label>
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl relative flex items-center justify-center bg-white overflow-hidden">
                        {formData.heroImage ? (
                          <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center text-gray-400">
                            <Upload className="w-6 h-6 mx-auto mb-2" />
                            <span className="text-sm font-semibold">Upload Image</span>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleHeroImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. OVERVIEW SECTION (Repeatable) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-[#F9010D]">Overview Section</h3>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => addBlock('overviews')} className="text-[#F9010D] font-bold text-sm flex items-center gap-1 hover:text-[#F9010D] bg-[#F9010D]/10 px-3 py-1.5 rounded-lg"><Plus className="w-4 h-4"/> Add Overview</button>
                      {formData.overviews.length > 0 && (
                        <button type="button" onClick={() => deleteSection('overviews')} className="text-gray-500 font-bold text-sm flex items-center gap-1 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"><Trash2 className="w-4 h-4"/> Delete Section</button>
                      )}
                    </div>
                  </div>
                  {formData.overviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-sm">
                      This section has been deleted and won&rsquo;t appear on the program page.
                    </div>
                  ) : (
                  <div className="space-y-6">
                    {formData.overviews.map((overview, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                        {formData.overviews.length > 1 && (
                          <button type="button" onClick={() => removeBlock('overviews', index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200"><Trash2 className="w-4 h-4"/></button>
                        )}
                        <div className="space-y-4">
                          <div>
                            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1 w-full max-w-[90%]"><span>Heading</span><span className="font-normal text-gray-400 tracking-normal normal-case">{overview.heading.length}/100</span></label>
                            <input required value={overview.heading} maxLength={100} onChange={e => {
                              const newArr = [...formData.overviews];
                              newArr[index].heading = e.target.value;
                              setFormData({...formData, overviews: newArr});
                            }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                          </div>
                          <div>
                            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1"><span>Sub Heading (Red text)</span><span className="font-normal text-gray-400 tracking-normal normal-case">{overview.subHeading.length}/150</span></label>
                            <input required value={overview.subHeading} maxLength={150} onChange={e => {
                              const newArr = [...formData.overviews];
                              newArr[index].subHeading = e.target.value;
                              setFormData({...formData, overviews: newArr});
                            }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                          </div>
                          <div>
                            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1"><span>Paragraph</span><span className="font-normal text-gray-400 tracking-normal normal-case">{overview.paragraph.length}/600</span></label>
                            <textarea required value={overview.paragraph} maxLength={600} onChange={e => {
                              const newArr = [...formData.overviews];
                              newArr[index].paragraph = e.target.value;
                              setFormData({...formData, overviews: newArr});
                            }} rows={4} className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </section>

                {/* 3. HOW IT WORKS (Repeatable) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-[#F9010D]">How it Works</h3>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => addBlock('howItWorksBlocks')} className="text-[#F9010D] font-bold text-sm flex items-center gap-1 hover:text-[#F9010D] bg-[#F9010D]/10 px-3 py-1.5 rounded-lg"><Plus className="w-4 h-4"/> Add Section</button>
                      {formData.howItWorksBlocks.length > 0 && (
                        <button type="button" onClick={() => deleteSection('howItWorksBlocks')} className="text-gray-500 font-bold text-sm flex items-center gap-1 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"><Trash2 className="w-4 h-4"/> Delete Section</button>
                      )}
                    </div>
                  </div>
                  {formData.howItWorksBlocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-sm">
                      This section has been deleted and won&rsquo;t appear on the program page.
                    </div>
                  ) : (
                  <div className="space-y-8">
                    {formData.howItWorksBlocks.map((block, blockIndex) => (
                      <div key={blockIndex} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                        {formData.howItWorksBlocks.length > 1 && (
                          <button type="button" onClick={() => removeBlock('howItWorksBlocks', blockIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200"><Trash2 className="w-4 h-4"/></button>
                        )}
                        <div className="mb-6">
                          <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1 w-full max-w-[90%]"><span>Section Title</span><span className="font-normal text-gray-400 tracking-normal normal-case">{block.sectionTitle.length}/50</span></label>
                          <input required value={block.sectionTitle} maxLength={50} onChange={e => {
                            const newArr = [...formData.howItWorksBlocks];
                            newArr[blockIndex].sectionTitle = e.target.value;
                            setFormData({...formData, howItWorksBlocks: newArr});
                          }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {block.steps.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm">
                              <div className="w-8 h-8 bg-[#F9010D] text-white font-bold rounded-lg flex items-center justify-center">{index + 1}</div>
                              <div>
                                <label className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase mb-1 w-full"><span>Step Heading</span><span className="font-normal text-gray-400 tracking-normal normal-case">{item.heading.length}/80</span></label>
                                <input required value={item.heading} maxLength={80} onChange={e => {
                                  const newBlocks = [...formData.howItWorksBlocks];
                                  newBlocks[blockIndex].steps[index].heading = e.target.value;
                                  setFormData({...formData, howItWorksBlocks: newBlocks});
                                }} className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none text-[#002147]" />
                              </div>
                              <div>
                                <label className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase mb-1 w-full"><span>Step Description</span><span className="font-normal text-gray-400 tracking-normal normal-case">{item.description.length}/300</span></label>
                                <textarea required value={item.description} maxLength={300} onChange={e => {
                                  const newBlocks = [...formData.howItWorksBlocks];
                                  newBlocks[blockIndex].steps[index].description = e.target.value;
                                  setFormData({...formData, howItWorksBlocks: newBlocks});
                                }} rows={3} className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none outline-none text-[#002147]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </section>

                {/* 4. PROGRAMS & ELIGIBILITY (Repeatable) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-[#F9010D]">Programs & Eligibility</h3>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => addBlock('programsBlocks')} className="text-[#F9010D] font-bold text-sm flex items-center gap-1 hover:text-[#F9010D] bg-[#F9010D]/10 px-3 py-1.5 rounded-lg"><Plus className="w-4 h-4"/> Add Section</button>
                      {formData.programsBlocks.length > 0 && (
                        <button type="button" onClick={() => deleteSection('programsBlocks')} className="text-gray-500 font-bold text-sm flex items-center gap-1 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"><Trash2 className="w-4 h-4"/> Delete Section</button>
                      )}
                    </div>
                  </div>
                  {formData.programsBlocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-sm">
                      This section has been deleted and won&rsquo;t appear on the program page.
                    </div>
                  ) : (
                  <div className="space-y-8">
                    {formData.programsBlocks.map((block, blockIndex) => (
                      <div key={blockIndex} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                        {formData.programsBlocks.length > 1 && (
                          <button type="button" onClick={() => removeBlock('programsBlocks', blockIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 z-10"><Trash2 className="w-4 h-4"/></button>
                        )}
                        <div className="mb-6">
                          <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1 w-full max-w-[90%]"><span>Section Title</span><span className="font-normal text-gray-400 tracking-normal normal-case">{block.sectionTitle.length}/50</span></label>
                          <input required value={block.sectionTitle} maxLength={50} onChange={e => {
                            const newArr = [...formData.programsBlocks];
                            newArr[blockIndex].sectionTitle = e.target.value;
                            setFormData({...formData, programsBlocks: newArr});
                          }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                        </div>
                        <div className="space-y-6">

                            {/* UG Programs */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">UG Programs</label>
                                <button type="button" onClick={() => addStringArrayItem('programsBlocks', blockIndex, 'ugPrograms')} className="text-[#F9010D] text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
                              </div>
                              <div className="space-y-2">
                                {block.ugPrograms.map((p, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                    <input value={p} maxLength={200} onChange={e => handleStringArrayChange('programsBlocks', blockIndex, 'ugPrograms', i, e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none text-[#002147] bg-white shadow-sm" />
                                    <button type="button" onClick={() => removeStringArrayItem('programsBlocks', blockIndex, 'ugPrograms', i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                    <span className="text-[10px] text-gray-400 w-[45px] text-right shrink-0">{p.length}/200</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* PG Programs */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">PG Programs</label>
                                <button type="button" onClick={() => addStringArrayItem('programsBlocks', blockIndex, 'pgPrograms')} className="text-[#F9010D] text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
                              </div>
                              <div className="space-y-2">
                                {block.pgPrograms.map((p, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                    <input value={p} maxLength={200} onChange={e => handleStringArrayChange('programsBlocks', blockIndex, 'pgPrograms', i, e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none text-[#002147] bg-white shadow-sm" />
                                    <button type="button" onClick={() => removeStringArrayItem('programsBlocks', blockIndex, 'pgPrograms', i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                    <span className="text-[10px] text-gray-400 w-[45px] text-right shrink-0">{p.length}/200</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Who Can Apply */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Who Can Apply?</label>
                                <button type="button" onClick={() => addStringArrayItem('programsBlocks', blockIndex, 'whoCanApply')} className="text-[#F9010D] text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
                              </div>
                              <div className="space-y-2">
                                {block.whoCanApply.map((p, i) => (
                                  <div key={i} className="flex gap-2 items-center">
                                    <input value={p} maxLength={200} onChange={e => handleStringArrayChange('programsBlocks', blockIndex, 'whoCanApply', i, e.target.value)} className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none text-[#002147] bg-white shadow-sm" />
                                    <button type="button" onClick={() => removeStringArrayItem('programsBlocks', blockIndex, 'whoCanApply', i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                    <span className="text-[10px] text-gray-400 w-[45px] text-right shrink-0">{p.length}/200</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </section>

                {/* 5. WHY CHOOSE (Repeatable) */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-[#F9010D]">Why Choose?</h3>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => addBlock('whyChooseBlocks')} className="text-[#F9010D] font-bold text-sm flex items-center gap-1 hover:text-[#F9010D] bg-[#F9010D]/10 px-3 py-1.5 rounded-lg"><Plus className="w-4 h-4"/> Add Section</button>
                      {formData.whyChooseBlocks.length > 0 && (
                        <button type="button" onClick={() => deleteSection('whyChooseBlocks')} className="text-gray-500 font-bold text-sm flex items-center gap-1 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"><Trash2 className="w-4 h-4"/> Delete Section</button>
                      )}
                    </div>
                  </div>
                  {formData.whyChooseBlocks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-sm">
                      This section has been deleted and won&rsquo;t appear on the program page.
                    </div>
                  ) : (
                  <div className="space-y-8">
                    {formData.whyChooseBlocks.map((block, blockIndex) => (
                      <div key={blockIndex} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 relative">
                        {formData.whyChooseBlocks.length > 1 && (
                          <button type="button" onClick={() => removeBlock('whyChooseBlocks', blockIndex)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 bg-white p-1.5 rounded-lg shadow-sm border border-gray-200"><Trash2 className="w-4 h-4"/></button>
                        )}
                        <div className="mb-4">
                          <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-1 w-full max-w-[90%]"><span>Section Title</span><span className="font-normal text-gray-400 tracking-normal normal-case">{block.sectionTitle.length}/50</span></label>
                          <input required value={block.sectionTitle} maxLength={50} onChange={e => {
                            const newArr = [...formData.whyChooseBlocks];
                            newArr[blockIndex].sectionTitle = e.target.value;
                            setFormData({...formData, whyChooseBlocks: newArr});
                          }} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] outline-none text-[#002147]" />
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-xs font-bold text-gray-500 uppercase">Benefits (Bullet Points)</label>
                              <button type="button" onClick={() => addStringArrayItem('whyChooseBlocks', blockIndex, 'points')} className="text-[#F9010D] text-xs font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add Point</button>
                            </div>
                            <div className="space-y-2">
                              {block.points.map((p, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                  <input value={p} maxLength={200} onChange={e => handleStringArrayChange('whyChooseBlocks', blockIndex, 'points', i, e.target.value)} className="flex-1 p-3 border border-gray-200 rounded-xl text-sm outline-none text-[#002147] bg-gray-50" />
                                  <button type="button" onClick={() => removeStringArrayItem('whyChooseBlocks', blockIndex, 'points', i)} className="text-red-400 hover:text-red-600 px-2"><Trash2 className="w-5 h-5"/></button>
                                  <span className="text-[10px] text-gray-400 w-[45px] text-right shrink-0">{p.length}/200</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase mb-2"><span>Conclusion Paragraph</span><span className="font-normal text-gray-400 tracking-normal normal-case">{block.conclusion.length}/400</span></label>
                            <textarea value={block.conclusion} maxLength={400} onChange={e => {
                              const newArr = [...formData.whyChooseBlocks];
                              newArr[blockIndex].conclusion = e.target.value;
                              setFormData({...formData, whyChooseBlocks: newArr});
                            }} rows={3} className="w-full p-3 border border-gray-200 rounded-xl resize-none outline-none text-[#002147] bg-gray-50" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </section>

              </form>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end">
              <button 
                type="submit" 
                form="apprenticeship-form"
                disabled={isPending}
                className="bg-[#F9010D] hover:bg-[#F9010D] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isPending ? 'Saving...' : (editingProgramId ? 'Update Program' : 'Save Program')}
              </button>
            </div>

          </div>
          </div>
        </div>
      )}

      {/* ── VIEW MORE MODAL (read-only, hides empty sections) ── */}
      {viewingProgram && (() => {
        const { overviews, howItWorksBlocks, programsBlocks, whyChooseBlocks } = parseProgramBlocks(viewingProgram);
        const hasText = (v?: string) => !!v && v.trim().length > 0;
        const nonEmptyOverviews = overviews.filter((o: any) => hasText(o.heading) || hasText(o.subHeading) || hasText(o.paragraph));
        const nonEmptyHowItWorks = howItWorksBlocks.filter((b: any) => (b.steps || []).some((s: any) => hasText(s.heading) || hasText(s.description)));
        const nonEmptyPrograms = programsBlocks.filter((b: any) =>
          (b.ugPrograms || []).some((p: string) => hasText(p)) ||
          (b.pgPrograms || []).some((p: string) => hasText(p)) ||
          (b.whoCanApply || []).some((p: string) => hasText(p))
        );
        const nonEmptyWhyChoose = whyChooseBlocks.filter((b: any) => (b.points || []).some((p: string) => hasText(p)) || hasText(b.conclusion));

        return (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-[2px]"
            style={{ overscrollBehavior: 'contain' }}
            onClick={() => setViewingProgram(null)}
          >
            <div className="flex items-start justify-center min-h-full p-4 py-8">
              <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
                  <h2 className="text-xl font-bold text-white">{viewingProgram.heading}</h2>
                  <button type="button" onClick={() => setViewingProgram(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-8">
                  {viewingProgram.heroImage && (
                    <img src={viewingProgram.heroImage} alt={viewingProgram.heading} className="w-full h-56 object-cover rounded-2xl border border-gray-100" />
                  )}

                  <div>
                    <span className="px-3 py-1 bg-[#002147]/10 text-[#002147] text-xs font-bold uppercase rounded-full">{viewingProgram.topic}</span>
                    <p className="text-gray-700 leading-relaxed mt-3">{viewingProgram.paragraph}</p>
                  </div>

                  {nonEmptyOverviews.length > 0 && (
                    <div className="pt-6 border-t border-gray-100 space-y-5">
                      <h3 className="text-sm font-bold text-[#F9010D] uppercase tracking-wide">Overview</h3>
                      {nonEmptyOverviews.map((o: any, i: number) => (
                        <div key={i}>
                          {hasText(o.heading) && <h4 className="font-bold text-[#002147]">{o.heading}</h4>}
                          {hasText(o.subHeading) && <p className="text-sm font-semibold text-[#F9010D] mt-0.5">{o.subHeading}</p>}
                          {hasText(o.paragraph) && <p className="text-gray-600 text-sm leading-relaxed mt-1">{o.paragraph}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {nonEmptyHowItWorks.length > 0 && (
                    <div className="pt-6 border-t border-gray-100 space-y-5">
                      {nonEmptyHowItWorks.map((block: any, bi: number) => (
                        <div key={bi}>
                          <h3 className="text-sm font-bold text-[#F9010D] uppercase tracking-wide mb-3">{block.sectionTitle || 'How it Works'}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(block.steps || []).filter((s: any) => hasText(s.heading) || hasText(s.description)).map((s: any, i: number) => (
                              <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {hasText(s.heading) && <h4 className="font-bold text-[#002147] text-sm mb-1">{s.heading}</h4>}
                                {hasText(s.description) && <p className="text-gray-600 text-xs leading-relaxed">{s.description}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {nonEmptyPrograms.length > 0 && (
                    <div className="pt-6 border-t border-gray-100 space-y-5">
                      {nonEmptyPrograms.map((block: any, bi: number) => (
                        <div key={bi}>
                          <h3 className="text-sm font-bold text-[#F9010D] uppercase tracking-wide mb-3">{block.sectionTitle || 'Programs & Eligibility'}</h3>
                          <div className="space-y-3 text-sm text-gray-600">
                            {(block.ugPrograms || []).some((p: string) => hasText(p)) && (
                              <div><span className="font-semibold text-[#002147]">UG Programs: </span>{block.ugPrograms.filter((p: string) => hasText(p)).join(', ')}</div>
                            )}
                            {(block.pgPrograms || []).some((p: string) => hasText(p)) && (
                              <div><span className="font-semibold text-[#002147]">PG Programs: </span>{block.pgPrograms.filter((p: string) => hasText(p)).join(', ')}</div>
                            )}
                            {(block.whoCanApply || []).some((p: string) => hasText(p)) && (
                              <div><span className="font-semibold text-[#002147]">Who Can Apply: </span>{block.whoCanApply.filter((p: string) => hasText(p)).join(', ')}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {nonEmptyWhyChoose.length > 0 && (
                    <div className="pt-6 border-t border-gray-100 space-y-5">
                      {nonEmptyWhyChoose.map((block: any, bi: number) => (
                        <div key={bi}>
                          <h3 className="text-sm font-bold text-[#F9010D] uppercase tracking-wide mb-3">{block.sectionTitle || 'Why Choose?'}</h3>
                          {(block.points || []).some((p: string) => hasText(p)) && (
                            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                              {block.points.filter((p: string) => hasText(p)).map((p: string, i: number) => <li key={i}>{p}</li>)}
                            </ul>
                          )}
                          {hasText(block.conclusion) && <p className="text-gray-600 text-sm leading-relaxed mt-2 italic">{block.conclusion}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
