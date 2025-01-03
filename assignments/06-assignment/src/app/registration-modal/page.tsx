"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onRegister: (name: string) => void;
};

export default function RegistrationModal({ onClose, onRegister }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(formData.name); // Pošaljemo ime roditeljskoj komponenti
    onClose(); // Zatvaramo modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center text-[#2E6431] mb-6">
          Registracija
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ime */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Ime i prezime
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2E6431] focus:border-[#2E6431]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2E6431] focus:border-[#2E6431]"
              required
            />
          </div>

          {/* Lozinka */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Lozinka
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2E6431] focus:border-[#2E6431]"
              required
            />
          </div>

           {/* Potvrda lozinke */}
           <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Potvrda lozinke
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2E6431] focus:border-[#2E6431]"
              required
            />
          </div>

          {/* Gumb za potvrdu */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#2E6431] text-white font-semibold rounded-lg shadow-md hover:bg-[#1e1e1e21] hover:text-[#2E6431]"
          >
            Potvrdi
          </button>
        </form>

        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400"
        >
          Odustani
        </button>
      </div>
    </div>
  );
}
