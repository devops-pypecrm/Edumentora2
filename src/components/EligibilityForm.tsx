'use client';

import React, { useState } from 'react';

interface EligibilityFormProps {
  className?: string;
}

export default function EligibilityForm({ className = 'space-y-6' }: EligibilityFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupState, setPopupState] = useState<'checking' | 'success' | 'error'>('checking');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');
    setErrorMessage('');
    setPopupState('checking');
    setShowPopup(true);

    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setPopupState('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
        setPopupState('error');
      }
    } catch (error) {
      console.error('Eligibility submission failed:', error);
      setStatus('error');
      setErrorMessage('Unable to submit your eligibility request. Please try again.');
      setPopupState('error');
    }
  };

  return (
    <>
      <form className={`w-full ${className}`} onSubmit={handleSubmit}>
        {status === 'error' && !showPopup && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center mb-4">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Name"
              className="peer w-full px-3.5 pt-5 pb-1.5 text-sm text-[#002147] font-medium rounded-xl border border-slate-200 bg-white shadow-sm hover:border-[#E91D24]/40 focus:outline-none focus:ring-2 focus:ring-[#E91D24]/15 focus:border-[#E91D24] transition-all placeholder-transparent"
              required
            />
            <label
              htmlFor="firstName"
              className="absolute left-3.5 top-1.5 text-[10px] font-semibold text-[#002147] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-2.5 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none"
            >
              First name
            </label>
          </div>

          <div className="relative">
            <input type="text" id="lastName" name="lastName" placeholder="Last name" className="peer w-full px-3.5 pt-5 pb-1.5 text-sm text-[#002147] font-medium rounded-xl border border-slate-200 bg-white shadow-sm placeholder-transparent" />
            <label htmlFor="lastName" className="absolute left-3.5 top-1.5 text-[10px] font-semibold text-[#002147] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-2.5 pointer-events-none">Last name</label>
          </div>

          <div className="relative">
            <input type="tel" id="phone" name="phone" placeholder="Phone" className="peer w-full px-3.5 pt-5 pb-1.5 text-sm text-[#002147] font-medium rounded-xl border border-slate-200 bg-white shadow-sm placeholder-transparent" required />
            <label htmlFor="phone" className="absolute left-3.5 top-1.5 text-[10px] font-semibold text-[#002147] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-2.5 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none">Phone</label>
          </div>

          <div className="relative">
            <input type="email" id="email" name="email" placeholder="Email" className="peer w-full px-3.5 pt-5 pb-1.5 text-sm text-[#002147] font-medium rounded-xl border border-slate-200 bg-white shadow-sm placeholder-transparent" required />
            <label htmlFor="email" className="absolute left-3.5 top-1.5 text-[10px] font-semibold text-[#002147] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-2.5 pointer-events-none">Email</label>
          </div>

          <div className="relative md:col-span-2">
            <input type="text" id="company" name="company" placeholder="Company" className="peer w-full px-3.5 pt-5 pb-1.5 text-sm text-[#002147] font-medium rounded-xl border border-slate-200 bg-white shadow-sm placeholder-transparent" />
            <label htmlFor="company" className="absolute left-3.5 top-1.5 text-[10px] font-semibold text-[#002147] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-2.5 pointer-events-none">Company</label>
          </div>

          <div className="relative md:col-span-2">
            <textarea id="message" name="message" rows={3} placeholder="Enquiry / Message" className="peer w-full px-3.5 pt-5 pb-1.5 text-sm text-[#002147] font-medium rounded-xl border border-slate-200 bg-white shadow-sm resize-none placeholder-transparent" required />
            <label htmlFor="message" className="absolute left-3.5 top-1.5 text-[10px] font-semibold text-[#002147] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-2.5 pointer-events-none">Enquiry / Message</label>
          </div>

        </div>

        <input type="hidden" name="source" value="Eligibility form" />

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#E91D24] hover:bg-[#B8151B] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#E91D24]/25 hover:shadow-xl hover:-translate-y-0.5 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Checking...' : 'Check Eligibility Now'}
        </button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
            <div className="flex flex-col gap-4">
              {popupState === 'checking' && (
                <>
                  <h3 className="text-2xl font-bold text-[#002147]">Checking Eligibility</h3>
                  <p className="text-gray-600">We are checking your details now. Please wait a moment.</p>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full w-3/4 bg-[#E91D24] animate-pulse" />
                  </div>
                </>
              )}

              {popupState === 'success' && (
                <>
                  <h3 className="text-2xl font-bold text-[#002147]">Request Submitted</h3>
                  <p className="text-gray-600">Your eligibility request has been saved. We will contact you shortly.</p>
                </>
              )}

              {popupState === 'error' && (
                <>
                  <h3 className="text-2xl font-bold text-[#002147]">Submission Failed</h3>
                  <p className="text-gray-600">{errorMessage || 'Something went wrong. Please try again.'}</p>
                </>
              )}

              <button
                onClick={() => {
                  if (popupState === 'success') {
                    setShowPopup(false);
                    setStatus('idle');
                  } else {
                    setShowPopup(false);
                  }
                }}
                className="mt-4 w-full bg-[#002147] hover:bg-[#001529] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {popupState === 'checking' ? 'Close' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
