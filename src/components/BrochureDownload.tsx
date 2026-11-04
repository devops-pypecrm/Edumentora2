'use client';

import React, { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, X } from 'lucide-react';

interface BrochureDownloadProps {
  source: string;
  fileUrl: string;
  fileName: string;
  buttonClassName: string;
  children: React.ReactNode;
}

const FIELD_CLASS =
  'peer w-full px-3.5 pt-5 pb-2 text-sm text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent';
const LABEL_CLASS =
  'absolute left-3.5 top-2 text-[11px] font-semibold text-[#002147] transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-2.5 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none';

const INPUT_FIELDS = [
  { name: 'firstName', label: 'First name', type: 'text', required: true, wide: false },
  { name: 'lastName', label: 'Last name', type: 'text', required: false, wide: false },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, wide: false },
  { name: 'email', label: 'Email', type: 'email', required: true, wide: false },
  { name: 'company', label: 'Company', type: 'text', required: false, wide: true },
];

async function downloadFile(fileUrl: string, fileName: string) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok || !response.headers.get('content-type')?.includes('pdf')) return false;

    const objectUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    return true;
  } catch (error) {
    console.error('Brochure download failed:', error);
    return false;
  }
}

export default function BrochureDownload({ source, fileUrl, fileName, buttonClassName, children }: BrochureDownloadProps) {
  const fieldId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'downloaded' | 'unavailable' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const close = () => {
    setIsOpen(false);
    setStatus('idle');
    setErrorMessage('');
  };

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const payload = { ...Object.fromEntries(new FormData(e.currentTarget).entries()), source };
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!result.success) {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
        return;
      }
    } catch (error) {
      console.error('Brochure enquiry submission failed:', error);
      setStatus('error');
      setErrorMessage('Unable to submit your details. Please try again.');
      return;
    }

    setStatus((await downloadFile(fileUrl, fileName)) ? 'downloaded' : 'unavailable');
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={buttonClassName}>
        {children}
      </button>

      {/* Portalled to <body>: callers sit inside transformed cards, which would otherwise trap position: fixed. */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-[Poppins]"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${fieldId}-title`}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl sm:p-6"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pr-10">
              <h2 id={`${fieldId}-title`} className="mb-2 text-xl font-bold text-[#002147]">
                Please share your details to download the brochure
              </h2>
              <div className="h-1 w-12 rounded-full bg-[#F9010D]"></div>
            </div>

            {status === 'downloaded' || status === 'unavailable' ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                <p>
                  {status === 'downloaded'
                    ? 'Your brochure download has started.'
                    : 'Your details have been saved. Our team will share the brochure with you shortly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center mb-4">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INPUT_FIELDS.map((field) => (
                    <div key={field.name} className={`relative ${field.wide ? 'md:col-span-2' : ''}`}>
                      <input
                        type={field.type}
                        id={`${fieldId}-${field.name}`}
                        name={field.name}
                        placeholder={field.label}
                        className={FIELD_CLASS}
                        required={field.required}
                      />
                      <label htmlFor={`${fieldId}-${field.name}`} className={LABEL_CLASS}>{field.label}</label>
                    </div>
                  ))}

                  <div className="relative md:col-span-2">
                    <textarea
                      id={`${fieldId}-message`}
                      name="message"
                      rows={3}
                      placeholder="Enquiry / Message"
                      className={`${FIELD_CLASS} resize-none`}
                      required
                    ></textarea>
                    <label htmlFor={`${fieldId}-message`} className={LABEL_CLASS}>Enquiry / Message</label>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full md:col-span-2 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Please wait...' : 'Download Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
