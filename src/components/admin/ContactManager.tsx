'use client';

import React, { useTransition, useState } from 'react';
import { createContact, updateContact, deleteContact } from '@/app/admin/contacts/actions';
import { Plus, Trash2, Edit2, Building, Phone, Smartphone, Mail, FileText } from 'lucide-react';

type Contact = {
  id: string;
  department: string | null;
  description: string | null;
  lanphone: string | null;
  mob: string | null;
  email: string | null;
};

export default function ContactManager({ initialContacts }: { initialContacts: Contact[] }) {
  const [isPending, startTransition] = useTransition();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleCreateOrUpdateContact = (formData: FormData) => {
    startTransition(() => {
      if (editingContact) {
        updateContact(editingContact.id, formData).then(() => {
          setEditingContact(null);
        });
      } else {
        createContact(formData);
        const form = document.getElementById('add-contact-form') as HTMLFormElement;
        if (form) form.reset();
      }
    });
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      startTransition(() => {
        deleteContact(id);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Create / Update Contact Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#002147]">
            {editingContact ? `Update Contact: ${editingContact.department || 'Untitled'}` : 'Add New Contact'}
          </h2>
          {editingContact && (
            <button onClick={handleCancelEdit} className="text-sm text-red-500 hover:text-red-600 font-medium">
              Cancel Edit
            </button>
          )}
        </div>
        <form key={editingContact ? editingContact.id : 'new'} id="add-contact-form" action={handleCreateOrUpdateContact} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Department Name</label>
              <input
                type="text"
                name="department"
                defaultValue={editingContact?.department || ''}
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editingContact?.description || ''}
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Landline Phone</label>
              <input
                type="text"
                name="lanphone"
                defaultValue={editingContact?.lanphone || ''}
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mob"
                defaultValue={editingContact?.mob || ''}
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                defaultValue={editingContact?.email || ''}
                className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="self-end px-6 py-2 bg-[#8B0000] text-white font-medium rounded-xl hover:bg-[#8B0000]/90 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {editingContact ? 'Update Contact' : 'Add Contact'}
          </button>
        </form>
      </div>

      {/* Existing Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {initialContacts.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full relative">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <button
                onClick={() => handleEditClick(contact)}
                disabled={isPending}
                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                title="Update Contact"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteContact(contact.id)}
                disabled={isPending}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Delete Contact"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {contact.department && (
              <h3 className="text-xl font-bold text-gray-900 mb-2 pr-20">{contact.department}</h3>
            )}

            {contact.description && (
              <p className="text-sm text-gray-500 mb-4 flex items-start gap-2">
                <FileText className="w-4 h-4 text-[#E91D24] flex-shrink-0 mt-0.5" />
                <span>{contact.description}</span>
              </p>
            )}

            <div className="space-y-3 mt-auto">
              {contact.lanphone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-[#002147]/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#002147]" />
                  </div>
                  <span className="text-sm font-medium">{contact.lanphone}</span>
                </div>
              )}

              {contact.mob && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-[#002147]/5 flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4 text-[#002147]" />
                  </div>
                  <span className="text-sm font-medium">{contact.mob}</span>
                </div>
              )}

              {contact.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-[#002147]/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#002147]" />
                  </div>
                  <span className="text-sm font-medium truncate" title={contact.email}>{contact.email}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {initialContacts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
            No contacts created yet.
          </div>
        )}
      </div>
    </div>
  );
}
