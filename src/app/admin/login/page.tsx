'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateAdmin } from '../actions';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authenticateAdmin(password);
      if (res.success) {
        router.push('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-[Poppins] overflow-hidden bg-[#002147]">
      {/* Blurred decorative backdrop — nothing else is shown behind the form */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-[#E91D24]/40 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-[#8B0000]/40 rounded-full blur-[100px]" />
        <div className="absolute inset-0 backdrop-blur-2xl bg-[#002147]/40" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#E91D24]" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-[#002147] mb-2">Admin Access</h1>
        <p className="text-center text-gray-500 mb-8">Enter your secure password to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-[#002147] placeholder-[#002147] focus:outline-none focus:ring-2 focus:ring-[#E91D24]/20 focus:border-[#E91D24] transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#002147] transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#8B0000] hover:bg-[#5C0000] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Login'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
