"use client";

import { useState } from "react";

type RegistrationModalProps = {
  onClose: () => void; // Funkcija za zatvaranje modala
  onRegister: (name: string) => void; // Funkcija za registraciju korisnika
  //className?: string; // Opcionalna klasa za stiliziranje
  //disabled?: boolean; // Opcionalna oznaka za onemogućavanje
};


const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onClose,
  onRegister,
  //className,
  //disabled,
  ...rest
}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validatePassword = (password: string, confirmPassword: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

    if (!password.match(passwordRegex)) {
      setError("Lozinka mora sadržavati: barem jedno veliko slovo, jedno malo slovo, broj i specijalni znak.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return false;
    }

    setError("");
    return true;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePassword(formData.password, formData.confirmPassword)) {
      onRegister(formData.name); // Pošaljemo ime roditeljskoj komponenti
      onClose(); // Zatvaramo modal
    }
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Potvrda lozinke
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#2E6431] focus:border-[#2E6431]"
              required
            />
          </div>

          {/* Obavijest o grešci */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

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

export default RegistrationModal;
