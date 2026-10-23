'use client';

import React, { useState, useTransition } from 'react';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import { changeAdminPassword } from '@/app/admin/actions';

export default function ProfileManager() {
  const [isPending, startTransition] = useTransition();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    startTransition(async () => {
      const res = await changeAdminPassword(oldPassword, newPassword);
      if (res.success) {
        setSuccess(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.error || 'Failed to change password.');
      }
    });
  };

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#002147]/5 rounded-2xl flex items-center justify-center">
            <KeyRound className="w-6 h-6 text-[#002147]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#002147]">Change Password</h2>
            <p className="text-sm text-gray-500">Update your admin login password.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-[#002147] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#002147] transition-colors"
          >
            {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPasswords ? 'Hide passwords' : 'Show passwords'}
          </button>

          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium bg-green-50 border border-green-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Password updated successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#F9010D] text-white font-medium py-3 rounded-xl hover:bg-[#F9010D]/90 transition-colors disabled:opacity-60"
          >
            {isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
