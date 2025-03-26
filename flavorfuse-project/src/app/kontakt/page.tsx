'use client';

import React from 'react';
import Image from 'next/image';

const ContactPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4">
      {/* Main container with subtle animation */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden transform transition-all hover:shadow-2xl">
        {/* Left side - Image with overlay */}
        <div className="md:w-1/2 hidden md:block relative group">
          <Image 
            src="/images/slika.jpg" 
            alt="Kontaktirajte nas"
            layout="fill"
            objectFit="cover"
            className="brightness-90 transition-all duration-300 group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent flex items-end">
            <p className="text-white p-6 text-lg font-medium">Pošaljite nam poruku danas!</p>
          </div>
        </div>

        {/* Right side - Form with enhanced styling */}
        <div className="md:w-1/2 w-full p-8 md:p-12 flex flex-col justify-center bg-white">
          <h1 className="text-4xl md:text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Kontaktirajte nas
          </h1>
          <p className="text-gray-600 mb-8 text-lg">Povežimo se i stvorimo nešto ukusno zajedno!</p>

          <form className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                placeholder="Ime i prezime" 
                required 
                className="w-full md:w-1/2 p-4 bg-amber-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
              />
              <input 
                type="email" 
                placeholder="Email adresa" 
                required 
                className="w-full md:w-1/2 p-4 bg-amber-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
              />
            </div>
            <textarea 
              placeholder="Vaša poruka" 
              required 
              rows={5}
              className="w-full p-4 bg-amber-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none transition-all duration-300"
            />
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-xl font-semibold text-white hover:from-amber-700 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Pošalji Poruku
            </button>
          </form>

          {/* Contact Info with icons */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">FlavorFuse</h2>
            <div className="space-y-3">
              <p className="flex items-center text-gray-700">
                <span className="w-6 h-6 mr-2 text-amber-600">✉️</span>
                <span>info@flavorfuse.com</span>
              </p>
              <p className="flex items-center text-gray-700">
                <span className="w-6 h-6 mr-2 text-amber-600">📞</span>
                <span>+385 99 123 4567</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;