"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie"; // Import js-cookie for handling cookies

export default function Prijava() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check cookies on page load
  useEffect(() => {
    const userToken = Cookies.get("auth_token");
    if (userToken) {
      // User is already logged in, handle accordingly if needed
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset errors on each form submission

    if (isRegistering) {
      // Registration validation
      if (!name || !email || !password || !confirmPassword) {
        setError("Sva polja su obavezna.");
        return;
      }

      if (!validateEmail(email)) {
        setError("Unesite ispravan email.");
        return;
      }

      if (!validatePassword(password)) {
        setError("Lozinka mora sadržavati: barem jedno veliko slovo, jedno malo slovo, broj i specijalni znak.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Lozinke se ne poklapaju.");
        return;
      }

      // Store user data in local storage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user) => user.email === email);

      if (userExists) {
        setError("Korisnik s ovim emailom već postoji.");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Store token in cookies on registration
      const userToken = "exampleAuthToken"; // In a real case, this would be a generated token
      Cookies.set("auth_token", userToken, { expires: 7, path: "/" });

      setSuccess("Uspješno ste se registrirali!");
      setIsRegistering(false); // Switch to login form after successful registration
    } else {
      // Login validation
      if (!email || !password) {
        setError("Molimo unesite email i lozinku.");
        return;
      }

      if (!validateEmail(email)) {
        setError("Unesite ispravan email.");
        return;
      }

      // Check user data in local storage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((user) => user.email === email && user.password === password);

      if (!user) {
        setError("Neispravan email ili lozinka.");
        return;
      }

      // Store token in cookies on login
      const userToken = "exampleAuthToken"; // In a real case, this would be a generated token
      Cookies.set("auth_token", userToken, { expires: 7, path: "/" });

      setSuccess("Prijava uspješna!");
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleBackToLogin = () => {
    setIsRegistering(false); // Return to login
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Overlay container */}
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
        <div className="md:w-[40%] w-full p-10 flex flex-col justify-center">
          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {!isRegistering ? (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Dobrodošli natrag!</h1>
              <p className="text-slate-950 mb-6">
                Nemaš račun?{" "}
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-amber-900 hover:underline"
                >
                  Registriraj se
                </button>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Unesite email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64]"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Unesite lozinku"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-[#6d4c3d] placeholder-[#a27e64]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8b5e34] p-3 rounded-lg font-semibold text-white hover:bg-[#6d4c3d] transition"
                >
                  Prijavi se
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Registracija</h1>
              <button
                onClick={handleBackToLogin} // Return to login
                className="text-sm text-left text-amber-900 hover:text-amber-950 mb-4"
              >
                &larr; Natrag na prijavu
              </button>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Unesite ime"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64]"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Unesite email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-gray-900 placeholder-[#a27e64]"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Unesite lozinku"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-[#6d4c3d] placeholder-[#a27e64]"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Potvrdite lozinku"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-[#8b5e34] rounded-lg text-[#6d4c3d] placeholder-[#a27e64]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8b5e34] p-3 rounded-lg font-semibold text-white hover:bg-[#6d4c3d] transition"
                >
                  Registriraj se
                </button>
              </form>
            </>
          )}

          {/* Alternative logins */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-[#8b5e34]" />
            <span className="mx-2 text-slate-950">ILI</span>
            <hr className="flex-grow border-[#8b5e34]" />
          </div>

          <div className="flex justify-center space-x-4">
            <i className="fab fa-google p-3 text-gray-700 hover:text-black"></i>
            <i className="fab fa-facebook-f p-3 text-gray-700 hover:text-black"></i>
            <i className="fab fa-instagram p-3 text-gray-700 hover:text-black"></i>
          </div>
        </div>
      </div>
    </div>
  );
}