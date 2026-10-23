'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Edit2, Trash2, X, Save, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { updateEnquiry, deleteEnquiry } from '@/app/admin/enquiries/actions';
import { updateEligibilityRequest, deleteEligibilityRequest } from '@/app/admin/eligibility-request/actions';

type Enquiry = {
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

type FilterMode = 'ALL' | 'ENQUIRY' | 'ELIGIBILITY';

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function LeadsManager({
  initialEnquiries,
  initialRequests,
}: {
  initialEnquiries: Enquiry[];
  initialRequests: EligibilityRequest[];
}) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<FilterMode>('ALL');
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [editingRequest, setEditingRequest] = useState<EligibilityRequest | null>(null);

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f === 'ENQUIRY' || f === 'ELIGIBILITY' || f === 'ALL') setFilter(f);
  }, [searchParams]);

  const handleUpdateEnquiry = (formData: FormData) => {
    if (!editingEnquiry) return;
    startTransition(() => {
      updateEnquiry(editingEnquiry.id, formData).then(() => setEditingEnquiry(null));
    });
  };

  const handleDeleteEnquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      startTransition(() => deleteEnquiry(id));
    }
  };

  const handleUpdateRequest = (formData: FormData) => {
    if (!editingRequest) return;
    startTransition(() => {
      updateEligibilityRequest(editingRequest.id, formData).then(() => setEditingRequest(null));
    });
  };

  const handleDeleteRequest = (id: string) => {
    if (confirm('Are you sure you want to delete this eligibility request?')) {
      startTransition(() => deleteEligibilityRequest(id));
    }
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    const showEnquiry = filter === 'ALL' || filter === 'ENQUIRY';
    const showEligibility = filter === 'ALL' || filter === 'ELIGIBILITY';

    if (showEnquiry) {
      const rows = initialEnquiries.map((e) => ({
        Date: formatDate(e.createdAt),
        'First Name': e.firstName,
        'Last Name': e.lastName || '',
        Phone: e.phone,
        Email: e.email,
        Company: e.company || '',
        Message: e.message,
        Source: e.source,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Your Enquiry');
    }

    if (showEligibility) {
      const rows = initialRequests.map((r) => ({
        Date: formatDate(r.createdAt),
        'First Name': r.firstName,
        'Last Name': r.lastName || '',
        Email: r.email,
        Phone: r.phone,
        Company: r.company || '',
        Message: r.message,
        Source: r.source,
      }));
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Eligibility Request');
    }

    const filename = filter === 'ALL' ? 'all-leads' : filter === 'ENQUIRY' ? 'your-enquiry' : 'eligibility-request';
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const showEnquiry = filter === 'ALL' || filter === 'ENQUIRY';
  const showEligibility = filter === 'ALL' || filter === 'ELIGIBILITY';

  return (
    <div className="space-y-6">
      {/* Filters + Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              filter === 'ALL' ? 'bg-[#002147] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All Leads ({initialEnquiries.length + initialRequests.length})
          </button>
          <button
            onClick={() => setFilter('ENQUIRY')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              filter === 'ENQUIRY' ? 'bg-[#002147] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Your Enquiry ({initialEnquiries.length})
          </button>
          <button
            onClick={() => setFilter('ELIGIBILITY')}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
              filter === 'ELIGIBILITY' ? 'bg-[#002147] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Eligibility Request ({initialRequests.length})
          </button>
        </div>

        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F9010D] text-white font-semibold text-sm rounded-xl hover:bg-[#F9010D]/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download as Excel
        </button>
      </div>

      {/* Your Enquiry Table */}
      {showEnquiry && (
        <div className="space-y-3">
          {filter === 'ALL' && <h3 className="text-lg font-bold text-[#002147]">Your Enquiry</h3>}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">First Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Last Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {initialEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No enquiries found. Submissions from the contact form will appear here.
                      </td>
                    </tr>
                  ) : (
                    initialEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(enquiry.createdAt)}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{enquiry.firstName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.lastName || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">{enquiry.email}</a>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.company || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate" title={enquiry.message}>{enquiry.message}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={enquiry.source}>{enquiry.source}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingEnquiry(enquiry)}
                              disabled={isPending}
                              className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                              title="Update Enquiry"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEnquiry(enquiry.id)}
                              disabled={isPending}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Delete Enquiry"
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
        </div>
      )}

      {/* Eligibility Request Table */}
      {showEligibility && (
        <div className="space-y-3">
          {filter === 'ALL' && <h3 className="text-lg font-bold text-[#002147]">Eligibility Request</h3>}
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
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(request.createdAt)}</td>
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
                              onClick={() => handleDeleteRequest(request.id)}
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
          </div>
        </div>
      )}

      {/* Edit Enquiry Modal */}
      {editingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingEnquiry(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Update Enquiry</h2>
              <button onClick={() => setEditingEnquiry(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleUpdateEnquiry} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">First Name</label>
                <input type="text" name="firstName" defaultValue={editingEnquiry.firstName} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                <input type="text" name="lastName" defaultValue={editingEnquiry.lastName || ''} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Phone</label>
                <input type="text" name="phone" defaultValue={editingEnquiry.phone} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input type="email" name="email" defaultValue={editingEnquiry.email} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Company</label>
                <input type="text" name="company" defaultValue={editingEnquiry.company || ''} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Message</label>
                <textarea name="message" defaultValue={editingEnquiry.message} required rows={4} className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Source</label>
                <input type="text" name="source" defaultValue={editingEnquiry.source} required className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]" />
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

      {/* Edit Eligibility Request Modal */}
      {editingRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingRequest(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Update Eligibility Request</h2>
              <button onClick={() => setEditingRequest(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleUpdateRequest} className="p-6 space-y-4">
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
