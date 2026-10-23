'use client';

import React, { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { createNotification, updateNotification, deleteNotification, setNotificationStatus } from '@/app/admin/notifications/actions';

type Notification = {
  id: string;
  text: string;
  status: string;
};

export default function NotificationManager({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [isPending, startTransition] = useTransition();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

  const handleCreate = (formData: FormData) => {
    startTransition(() => {
      createNotification(formData).then(() => {
        setIsFormOpen(false);
      });
    });
  };

  const handleUpdate = (formData: FormData) => {
    if (!editingNotification) return;
    startTransition(() => {
      updateNotification(editingNotification.id, formData).then(() => {
        setEditingNotification(null);
      });
    });
  };

  const handleSetStatus = (id: string, status: 'SHOW' | 'HIDE') => {
    startTransition(() => {
      setNotificationStatus(id, status);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      startTransition(() => {
        deleteNotification(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#002147]">Notifications</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#F9010D] hover:bg-[#F9010D] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Notification
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Notification</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialNotifications.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No notifications yet. Create one to show it in the hero section&rsquo;s bottom marquee.
                  </td>
                </tr>
              ) : (
                initialNotifications.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-lg">{n.text}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        n.status === 'SHOW' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {n.status === 'SHOW' ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleSetStatus(n.id, 'SHOW')}
                          disabled={isPending || n.status === 'SHOW'}
                          className="text-gray-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-30 disabled:hover:bg-transparent p-2 rounded-lg transition-colors"
                          title="Show in marquee"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSetStatus(n.id, 'HIDE')}
                          disabled={isPending || n.status === 'HIDE'}
                          className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent p-2 rounded-lg transition-colors"
                          title="Hide from marquee"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingNotification(n)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Update Notification"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete Notification"
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

      {/* Create Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsFormOpen(false)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Create Notification</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Notification</label>
                <input
                  type="text"
                  name="text"
                  required
                  autoFocus
                  className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#F9010D] text-white font-medium py-3 rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-70"
              >
                <Plus className="w-4 h-4" />
                Create Notification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingNotification && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditingNotification(null)}>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl" data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl">
              <h2 className="text-xl font-bold text-white">Update Notification</h2>
              <button onClick={() => setEditingNotification(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form action={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Notification</label>
                <input
                  type="text"
                  name="text"
                  defaultValue={editingNotification.text}
                  required
                  className="w-full px-4 py-2 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
                />
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
