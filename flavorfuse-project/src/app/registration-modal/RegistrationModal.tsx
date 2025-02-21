"use client";

import { useState } from "react";
import Image from "next/image";

type RegistrationModalProps = {
  onClose: () => void; // Function to close the modal
  onRegister: (name: string) => void; // Function to register the user
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onClose,
  onRegister,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // To show the success message

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
      onRegister(formData.name); // Send name to parent component
      setIsSuccess(true); // Show success message
      setTimeout(() => {
        onClose(); // Close modal after a short delay
      }, 1500); // Delay to allow the user to see the success message
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-[#fffdf9] shadow-2xl rounded-lg overflow-hidden">
        {/* Left side - Image */}
        <div className="md:w-1/2 hidden md:block relative">
          <Image
            src="/images/backgroundprijava.jpg"
            alt="Pozadinska slika hrane"
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg brightness-[.9]"
          />
        </div>
        {/* Right side - Form */}
        <div className="md:w-1/2 w-full p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Registracija</h1>
          {isSuccess ? (
            <div className="text-center">
              <p className="text-green-500 font-semibold mb-4">Uspješno ste se registrirali!</p>
              <button
                onClick={onClose}
                className="w-full p-3 bg-[#8b5e34] text-white font-semibold rounded-lg hover:bg-[#6d4c3d] transition"
              >
                Zatvori
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64] focus:ring-[#8b5e34] focus:border-[#8b5e34]"
                  placeholder="Ime i prezime"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-[#6d4c3d] placeholder-[#a27e64] focus:ring-[#8b5e34] focus:border-[#8b5e34]"
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64] focus:ring-[#8b5e34] focus:border-[#8b5e34]"
                  placeholder="Lozinka"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64] focus:ring-[#8b5e34] focus:border-[#8b5e34]"
                  placeholder="Potvrda lozinke"
                  required
                />
              </div>

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-[#8b5e34] text-white font-semibold p-3 rounded-lg hover:bg-[#6d4c3d] transition"
              >
                Potvrdi
              </button>
            </form>
          )}

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="mt-4 w-full p-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
          >
            Odustani
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
