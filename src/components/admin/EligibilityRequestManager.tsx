'use client';

import React, { useState, useTransition } from 'react';
import { Edit2, Trash2, X, Save } from 'lucide-react';
import { updateEligibilityRequest, deleteEligibilityRequest } from '@/app/admin/eligibility-request/actions';

type EligibilityRequest = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  company: string | null;
  message: string;
  source: string;
  createdAt: Date;
};

export default function EligibilityRequestManager({ initialRequests }: { initialRequests: EligibilityRequest[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingRequest, setEditingRequest] = useState<EligibilityRequest | null>(null);

  const handleUpdate = (formData: FormData) => {
    if (!editingRequest) return;
    startTransition(() => {
      updateEligibilityRequest(editingRequest.id, formData).then(() => {
        setEditingRequest(null);
      });
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this eligibility request?')) {
      startTransition(() => {
        deleteEligibilityRequest(id);
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">First Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Message</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialRequests.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  No eligibility requests found.
                </td>
              </tr>
            ) : (
              initialRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(request.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{request.firstName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{request.lastName || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{request.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{request.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{request.company || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate" title={request.message}>{request.message}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={request.source}>{request.source}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingRequest(request)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Update Request"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Request"
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

      {/* Edit Modal */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingRequest(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Update Eligibility Request</h2>
              <button onClick={() => setEditingRequest(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">First Name</label>
                <input type="text" name="firstName" defaultValue={editingRequest.firstName} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                <input type="text" name="lastName" defaultValue={editingRequest.lastName || ''} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input type="email" name="email" defaultValue={editingRequest.email} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <input type="text" name="phone" defaultValue={editingRequest.phone} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Company</label>
                <input type="text" name="company" defaultValue={editingRequest.company || ''} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea name="message" defaultValue={editingRequest.message} required rows={4} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Source</label>
                <input type="text" name="source" defaultValue={editingRequest.source} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl" />
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
