'use client';
import React, { useState } from 'react';

interface EnquiryFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  className?: string;
  isGrid?: boolean;
  compact?: boolean;
}

export default function EnquiryForm({ 
  onSuccess, 
  buttonText = "Send Message", 
  className = "space-y-6",
  isGrid = false,
  compact = false,
}: EnquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');

    const payload = {
      ...Object.fromEntries(new FormData(form).entries()),
      source: window.location.pathname,
    };
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        setStatus('success');
        form.reset();
        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Lead submission failed:', error);
      setStatus('error');
      setErrorMessage('Unable to submit your enquiry. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
        <h3 className="text-xl font-bold mb-2">Thank you!</h3>
        <p>Your message has been sent successfully. We will be in touch soon.</p>
        {!onSuccess && (
          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Send another message
          </button>
        )}
      </div>
    );
  }

  const fieldClass = compact
    ? "peer w-full px-3.5 pt-5 pb-2 text-sm text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent"
    : "peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent";
  const labelClass = compact
    ? "absolute left-3.5 top-2 text-[11px] font-semibold text-[#002147] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-2.5 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none"
    : "absolute left-4 top-3 text-xs font-semibold text-[#002147] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none";
  const TopFields = (
    <>
      <div className="relative">
        <input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="First name"
          className={fieldClass}
          required
        />
        <label
          htmlFor="firstName"
          className={labelClass}
        >First name</label>
      </div>
      <div className="relative">
        <input type="text" id="lastName" name="lastName" placeholder="Last name" className={fieldClass} />
        <label htmlFor="lastName" className={labelClass}>Last name</label>
      </div>
      <div className="relative">
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Phone"
          className={fieldClass}
          required
        />
        <label
          htmlFor="phone"
          className={labelClass}
        >Phone</label>
      </div>
    </>
  );

  return (
    <form className={`w-full ${className}`} style={{ display: 'block' }} onSubmit={handleSubmit}>
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center mb-6">
          {errorMessage}
        </div>
      )}
      
      <div className={`grid grid-cols-1 md:grid-cols-2 ${compact ? 'gap-3' : 'gap-6'}`}>
        {TopFields}

      <div className="relative">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className={fieldClass}
          required
        />
        <label
          htmlFor="email"
          className={labelClass}
        >Email</label>
      </div>

      <div className="relative md:col-span-2">
        <input type="text" id="company" name="company" placeholder="Company" className={fieldClass} />
        <label htmlFor="company" className={labelClass}>Company</label>
      </div>

      <div className="relative md:col-span-2">
        <textarea
          id="message"
          name="message"
          rows={compact || isGrid ? 3 : 4}
          placeholder="Enquiry / Message"
          className={`${fieldClass} resize-none`}
          required
        ></textarea>
        <label
          htmlFor="message"
          className={labelClass}
        >Enquiry / Message</label>
      </div>

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className={`w-full md:col-span-2 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold ${compact ? 'py-3' : 'py-4'} rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        {status === 'loading' ? 'Sending...' : buttonText}
      </button>
      </div>
    </form>
  );
}
