'use client';

import React, { useState, useTransition } from 'react';
import { Edit2, Trash2, X, Save } from 'lucide-react';
import { updateEnquiry, deleteEnquiry } from '@/app/admin/enquiries/actions';

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

export default function EnquiryManager({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);

  const handleUpdate = (formData: FormData) => {
    if (!editingEnquiry) return;
    startTransition(() => updateEnquiry(editingEnquiry.id, formData).then(() => setEditingEnquiry(null)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      startTransition(() => deleteEnquiry(id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Date', 'First Name', 'Last Name', 'Phone', 'Email', 'Company', 'Message', 'Source', 'Actions'].map((heading) => (
                <th key={heading} className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialEnquiries.length === 0 ? (
              <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-500">No enquiries found.</td></tr>
            ) : initialEnquiries.map((enquiry) => (
              <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{enquiry.firstName}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.lastName || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{enquiry.company || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate" title={enquiry.message}>{enquiry.message}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={enquiry.source}>{enquiry.source}</td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                  <button onClick={() => setEditingEnquiry(enquiry)} disabled={isPending} className="text-gray-400 hover:text-blue-600 p-2 rounded-lg" title="Update Enquiry"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(enquiry.id)} disabled={isPending} className="text-gray-400 hover:text-red-500 p-2 rounded-lg" title="Delete Enquiry"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setEditingEnquiry(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between p-6 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Update Enquiry</h2>
              <button onClick={() => setEditingEnquiry(null)} className="text-white/70 hover:text-white p-2"><X className="w-5 h-5" /></button>
            </div>
            <form action={handleUpdate} className="p-6 space-y-4">
              <input type="text" name="firstName" defaultValue={editingEnquiry.firstName} placeholder="First name" required className="w-full px-4 py-2 border rounded-xl" />
              <input type="text" name="lastName" defaultValue={editingEnquiry.lastName || ''} placeholder="Last name" className="w-full px-4 py-2 border rounded-xl" />
              <input type="email" name="email" defaultValue={editingEnquiry.email} placeholder="Email" required className="w-full px-4 py-2 border rounded-xl" />
              <input type="text" name="phone" defaultValue={editingEnquiry.phone} placeholder="Phone" required className="w-full px-4 py-2 border rounded-xl" />
              <input type="text" name="company" defaultValue={editingEnquiry.company || ''} placeholder="Company" className="w-full px-4 py-2 border rounded-xl" />
              <textarea name="message" defaultValue={editingEnquiry.message} placeholder="Enquiry / Message" required rows={4} className="w-full px-4 py-2 border rounded-xl resize-none" />
              <input type="text" name="source" defaultValue={editingEnquiry.source} placeholder="Source" required className="w-full px-4 py-2 border rounded-xl" />
              <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 bg-[#F9010D] text-white py-3 rounded-xl disabled:opacity-70"><Save className="w-4 h-4" />Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
