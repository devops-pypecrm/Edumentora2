'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { createUniversityProgram, updateUniversityProgram, deleteUniversityProgram } from '@/app/admin/university-programs/actions';

type University = {
  id: string;
  name: string;
};

type UniversityProgram = {
  id: string;
  universityId: string;
  programName: string | null;
  courseDescription: string | null;
  specializations: string[];
  courseDuration: string | null;
  eligibilityCriteria: string[];
  careerOpportunities: string[];
  feeStructure: string | null;
  university: University;
};

type FormState = {
  universityId: string;
  programName: string;
  courseDescription: string;
  specializations: string[];
  courseDuration: string;
  eligibilityCriteria: string[];
  careerOpportunities: string[];
  feeStructure: string;
};

const emptyForm: FormState = {
  universityId: '',
  programName: '',
  courseDescription: '',
  specializations: [''],
  courseDuration: '',
  eligibilityCriteria: [''],
  careerOpportunities: [''],
  feeStructure: '',
};

function BulletListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const addItem = () => onChange([...items, '']);

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      onChange(['']);
      return;
    }
    const next = [...items];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <button type="button" onClick={addItem} className="text-[#8B0000] text-xs font-bold flex items-center gap-1 hover:text-[#5C0000]">
          <Plus className="w-3.5 h-3.5" /> Add Bullet
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <span className="text-[#E91D24] font-bold">•</span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 text-[#002147] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
            />
            <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 p-1" title="Remove bullet">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UniversityProgramManager({
  initialPrograms,
  universities,
}: {
  initialPrograms: UniversityProgram[];
  universities: University[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<UniversityProgram | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreateForm = () => {
    setEditingProgram(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (program: UniversityProgram) => {
    setEditingProgram(program);
    setForm({
      universityId: program.universityId,
      programName: program.programName || '',
      courseDescription: program.courseDescription || '',
      specializations: program.specializations.length > 0 ? program.specializations : [''],
      courseDuration: program.courseDuration || '',
      eligibilityCriteria: program.eligibilityCriteria.length > 0 ? program.eligibilityCriteria : [''],
      careerOpportunities: program.careerOpportunities.length > 0 ? program.careerOpportunities : [''],
      feeStructure: program.feeStructure || '',
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProgram(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set('universityId', form.universityId);
    formData.set('programName', form.programName);
    formData.set('courseDescription', form.courseDescription);
    formData.set('courseDuration', form.courseDuration);
    formData.set('feeStructure', form.feeStructure);
    form.specializations.filter(v => v.trim()).forEach(v => formData.append('specializations', v));
    form.eligibilityCriteria.filter(v => v.trim()).forEach(v => formData.append('eligibilityCriteria', v));
    form.careerOpportunities.filter(v => v.trim()).forEach(v => formData.append('careerOpportunities', v));

    startTransition(() => {
      if (editingProgram) {
        updateUniversityProgram(editingProgram.id, formData).then(closeForm);
      } else {
        createUniversityProgram(formData).then(closeForm);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this university program?')) {
      startTransition(() => {
        deleteUniversityProgram(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#002147]">University Programs</h2>
        <button
          onClick={openCreateForm}
          className="bg-[#8B0000] hover:bg-[#5C0000] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create New University Program
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Program Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">University Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Specializations</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Course Duration</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Eligibility Criteria</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Career Opportunities</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Fee Structure</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialPrograms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    No university programs yet. Click &ldquo;Create New University Program&rdquo; to add one.
                  </td>
                </tr>
              ) : (
                initialPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{program.programName || '—'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{program.university?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={program.courseDescription || ''}>
                      {program.courseDescription || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={program.specializations.join(', ')}>
                      {program.specializations.length > 0 ? program.specializations.join(', ') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{program.courseDuration || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={program.eligibilityCriteria.join(', ')}>
                      {program.eligibilityCriteria.length > 0 ? program.eligibilityCriteria.join(', ') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={program.careerOpportunities.join(', ')}>
                      {program.careerOpportunities.length > 0 ? program.careerOpportunities.join(', ') : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{program.feeStructure || '—'}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditForm(program)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Update Program"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete Program"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
                <h2 className="text-xl font-bold text-white">
                  {editingProgram ? 'Update University Program' : 'Create New University Program'}
                </h2>
                <button type="button" onClick={closeForm} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* 0. Program Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Program Name</label>
                  <input
                    type="text"
                    value={form.programName}
                    onChange={(e) => setForm({ ...form, programName: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                  />
                </div>

                {/* 1. Select University */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Select University</label>
                  <select
                    value={form.universityId}
                    onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] bg-white"
                  >
                    <option value="" disabled>Select a university&hellip;</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Course Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Course Description</label>
                  <textarea
                    rows={4}
                    value={form.courseDescription}
                    onChange={(e) => setForm({ ...form, courseDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                  />
                </div>

                {/* Specializations */}
                <BulletListEditor
                  label="Specializations"
                  items={form.specializations}
                  onChange={(items) => setForm({ ...form, specializations: items })}
                />

                {/* Course Duration */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Course Duration</label>
                  <input
                    type="text"
                    value={form.courseDuration}
                    onChange={(e) => setForm({ ...form, courseDuration: e.target.value })}
                    placeholder="e.g. 4 Years"
                    className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                  />
                </div>

                {/* 3. Eligibility Criteria */}
                <BulletListEditor
                  label="Eligibility Criteria"
                  items={form.eligibilityCriteria}
                  onChange={(items) => setForm({ ...form, eligibilityCriteria: items })}
                />

                {/* 4. Career Opportunities */}
                <BulletListEditor
                  label="Career Opportunities"
                  items={form.careerOpportunities}
                  onChange={(items) => setForm({ ...form, careerOpportunities: items })}
                />

                {/* 5. Fee Structure (optional) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Fee Structure <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    value={form.feeStructure}
                    onChange={(e) => setForm({ ...form, feeStructure: e.target.value })}
                    placeholder="e.g. ₹1,20,000 per year"
                    className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 bg-[#8B0000] text-white font-medium py-3 rounded-xl hover:bg-[#8B0000]/90 transition-colors disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {editingProgram ? 'Update Program' : 'Save Program'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
