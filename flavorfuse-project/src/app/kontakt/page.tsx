'use client';

import React from 'react';
import Image from 'next/image';

const ContactPage: React.FC = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white">
            {/* Overlay container */}
            <div className="w-full max-w-6xl flex flex-col md:flex-row bg-[#fffdf9] shadow-2xl rounded-lg overflow-hidden">
                {/* Left side - Image */}
                <div className="md:w-1/2 hidden md:block relative">
                    <Image 
                        src="/images/slika.jpg" 
                        alt="Kontaktirajte nas"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-l-lg  brightness-[.9]"
                    />
                </div>

                {/* Right side - Form */}
                <div className="md:w-1/2 w-full p-10 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Kontaktirajte nas</h1>
                    <p className="text-slate-950 mb-6">Tu smo za sva vaša pitanja i prijedloge!</p>
                    <form className="space-y-4">
                        <div className="flex gap-4">
                            <input type="text" placeholder="Ime i prezime" required className="w-1/2 p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64]" />
                            <input type="email" placeholder="Email adresa" required className="w-1/2 p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-[#6d4c3d] placeholder-[#a27e64]" />
                        </div>
                        <textarea placeholder="Vaša poruka" required className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-800 placeholder-[#a27e64]"></textarea>
                        <button type="submit" className="w-full bg-[#8b5e34] p-3 rounded-lg font-semibold text-white hover:bg-[#6d4c3d] transition">Pošalji</button>
                    </form>

                    <div className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-900">FlavorFuse</h2>
                        <p className='text-black'>Email: <span className="text-gray-950">info@flavorfuse.com</span></p>
                        <p className='text-black'>Telefon: <span className="text-slate-950">+385 99 123 4567</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
