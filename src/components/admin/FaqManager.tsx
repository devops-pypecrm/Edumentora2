'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { createFaq, updateFaq, deleteFaq, type FaqType } from '@/app/admin/faq/actions';

type Faq = {
  id: string;
  question: string;
  answer: string;
};

export default function FaqManager({ type, initialFaqs }: { type: FaqType; initialFaqs: Faq[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  const handleCreate = (formData: FormData) => {
    startTransition(() => {
      createFaq(type, formData);
      const form = document.getElementById('add-faq-form') as HTMLFormElement;
      if (form) form.reset();
    });
  };

  const handleUpdate = (formData: FormData) => {
    if (!editingFaq) return;
    startTransition(() => {
      updateFaq(editingFaq.id, type, formData).then(() => {
        setEditingFaq(null);
      });
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      startTransition(() => {
        deleteFaq(id, type);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Create FAQ Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-[#002147] mb-4">Add New FAQ</h2>
        <form id="add-faq-form" action={handleCreate} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Question</label>
            <input
              type="text"
              name="question"
              required
              className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Answer</label>
            <textarea
              name="answer"
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="self-end px-6 py-2 bg-[#F9010D] text-white font-medium rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add FAQ
          </button>
        </form>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Question</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Answer</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialFaqs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No FAQs added yet.
                  </td>
                </tr>
              ) : (
                initialFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">{faq.question}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate" title={faq.answer}>{faq.answer}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingFaq(faq)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Update FAQ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete FAQ"
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

      {/* Edit Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingFaq(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Update FAQ</h2>
              <button onClick={() => setEditingFaq(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Question</label>
                <input type="text" name="question" defaultValue={editingFaq.question} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Answer</label>
                <textarea name="answer" defaultValue={editingFaq.answer} required rows={5} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#F9010D] text-white font-medium py-3 rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
