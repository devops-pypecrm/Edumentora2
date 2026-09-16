'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PageBanner from '@/components/PageBanner';

type Contact = {
  id: string;
  department: string | null;
  description: string | null;
  lanphone: string | null;
  mob: string | null;
  email: string | null;
};

export default function ContactClient({ contacts }: { contacts: Contact[] }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('loading');

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
        form.reset();
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setStatus('error');
      setErrorMessage('Unable to submit your enquiry. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] font-[Poppins]">
      <Header />
      <div id="contact-hero" className="scroll-mt-24">
        <PageBanner
          badge="Our Offices"
          title="Get In Touch"
          subtitle="Reach out to our offices in Calicut and Kochi for expert guidance and academic credit transfer solutions. We are here to help you achieve your educational goals."
          isGradientText={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24">

        {/* 2-Column Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">

          {/* Calicut Section */}
          <div className="bg-[linear-gradient(135deg,_#F7EFE1_0%,_#F0E3CC_50%,_#EAD9BA_100%)] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#DDC7A0] flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-[#002147] mb-4 flex items-center gap-3">
              <span className="w-8 h-1.5 bg-[#D2B48C] rounded-full inline-block"></span>
              CALICUT
            </h2>
            <div className="text-gray-700 leading-relaxed mb-8 flex-grow text-lg">
              <p>YMCA Cross Road,</p>
              <p>Kozhikode</p>
              <p>Kerala – 673001</p>
            </div>
            {/* Google Map */}
            <div className="w-full h-72 rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
              <iframe
                src="https://maps.google.com/maps?q=YMCA%20Cross%20Road,%20Kozhikode,%20Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=YMCA%20Cross%20Road%2C%20Kozhikode%2C%20Kerala"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 self-start px-5 py-2.5 rounded-full bg-[#002147] text-white text-sm font-semibold hover:bg-[#002147]/90 transition-colors"
            >
              Get Directions
            </a>
          </div>

          {/* Kochi Section */}
          <div className="bg-[linear-gradient(135deg,_#F7EFE1_0%,_#F0E3CC_50%,_#EAD9BA_100%)] rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#DDC7A0] flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-[#002147] mb-4 flex items-center gap-3">
              <span className="w-8 h-1.5 bg-[#D2B48C] rounded-full inline-block"></span>
              KOCHI
            </h2>
            <div className="text-gray-700 leading-relaxed mb-8 flex-grow text-lg">
              <p>6th Floor, National Pearl Star building,</p>
              <p>Near Changampuzha park Metro Station, Edappally,</p>
              <p>Kochi, Ernakulam, Kerala 682024</p>
            </div>
            {/* Google Map */}
            <div className="w-full h-72 rounded-2xl overflow-hidden shadow-inner border border-gray-100 bg-gray-50">
              <iframe
                src="https://maps.google.com/maps?q=National%20Pearl%20Star%20building,%20Edappally,%20Kochi,%20Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=National%20Pearl%20Star%20building%2C%20Edappally%2C%20Kochi%2C%20Kerala"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 self-start px-5 py-2.5 rounded-full bg-[#002147] text-white text-sm font-semibold hover:bg-[#002147]/90 transition-colors"
            >
              Get Directions
            </a>
          </div>

        </div>
      </div>

      {/* Dynamic Contacts Section */}
      {contacts && contacts.length > 0 && (
        <div id="contacts-section" className="max-w-7xl mx-auto px-4 md:px-8 py-16 border-t border-gray-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">Contacts</h2>
            <div className="w-24 h-1.5 bg-[#D2B48C] rounded-full mx-auto"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {contacts
              .filter((contact) => contact.department || contact.description || contact.lanphone || contact.mob || contact.email)
              .map((contact) => (
              <div key={contact.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] flex flex-col items-center text-center space-y-4">
                {contact.department && (
                  <h3 className="text-xl font-bold text-[#002147]">
                    {contact.department}
                  </h3>
                )}

                {contact.description && (
                  <p className="text-gray-600 text-sm -mt-2">{contact.description}</p>
                )}

                <div className="space-y-2 w-full">
                  {contact.lanphone && (
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D2B48C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-medium text-base">{contact.lanphone}</span>
                    </div>
                  )}

                  {contact.mob && (
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D2B48C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-base">{contact.mob}</span>
                    </div>
                  )}

                  {contact.email && (
                    <div className="flex items-center justify-center gap-2 text-gray-700 break-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#D2B48C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-base">{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Form Section */}
      <div className="bg-[#F9F9F9] py-16 lg:py-24 border-t border-[#DDC7A0] dot-grid">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="bg-[linear-gradient(135deg,_#F7EFE1_0%,_#F0E3CC_50%,_#EAD9BA_100%)] rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#DDC7A0]">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002147] mb-4">Start Your Journey with Edumentora</h2>
              <div className="w-24 h-1.5 bg-[#D2B48C] rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Fill out the form below and our academic advisors will get back to you shortly.</p>
            </div>

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                <p>Your message has been sent successfully. We will be in touch soon.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center mb-6">
                    {errorMessage}
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      className="peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent"
                      required
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute left-4 top-3 text-xs font-semibold text-[#002147] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none"
                    >
                      First name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last name"
                      className="peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent"
                    />
                    <label htmlFor="lastName" className="absolute left-4 top-3 text-xs font-semibold text-[#002147] peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs pointer-events-none">Last name</label>
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      className="peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent"
                      required
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-4 top-3 text-xs font-semibold text-[#002147] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none"
                    >
                      Enter phone number
                    </label>
                  </div>
                </div>

                <div className="relative md:col-span-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    className="peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent"
                    required
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-4 top-3 text-xs font-semibold text-[#002147] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none"
                  >
                    Enter email
                  </label>
                </div>

                <div className="relative">
                  <input type="text" id="company" name="company" placeholder="Company" className="peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white placeholder-transparent" />
                  <label htmlFor="company" className="absolute left-4 top-3 text-xs font-semibold text-[#002147] peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs pointer-events-none">Company</label>
                </div>

                <div className="relative md:col-span-2">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Message"
                    className="peer w-full px-4 pt-7 pb-3 text-[#002147] font-medium rounded-xl border border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-gray-50 focus:bg-white resize-none placeholder-transparent"
                    required
                  ></textarea>
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-3 text-xs font-semibold text-[#002147] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#002147] peer-placeholder-shown:top-4 peer-focus:top-3 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[#002147] pointer-events-none"
                  >
                    Enquiry / Message
                  </label>
                </div>

                <input type="hidden" name="source" value="Contact page" />

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full md:col-span-2 bg-[#8B0000] hover:bg-[#5C0000] text-white font-bold py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
