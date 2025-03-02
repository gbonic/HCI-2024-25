"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie"; // Import js-cookie for handling cookies
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";

export default function Prijava() {
  const { setUserInitials, setUserName } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

 
  useEffect(() => {
    const userToken = Cookies.get("auth_token");
    const userName = localStorage.getItem("user_name");

    if (userToken && userName) {
      // If the user is already logged in, redirect them to the homepage
      router.push("/prijava");
    }
  }, [router]);

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

      // Store user name in localStorage after registration
      localStorage.setItem("user_name", name);

      // Set user initials and name in context
      const nameParts = name.split(' ');
      const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1]?.charAt(0).toUpperCase() || '');
      setUserInitials(initials);
      setUserName(name);

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

      // Store user name in localStorage after login
      localStorage.setItem("user_name", user.name);

      // Set user initials and name in context
      const nameParts = user.name.split(' ');
      const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1]?.charAt(0).toUpperCase() || '');
      setUserInitials(initials);
      setUserName(user.name);

      setSuccess("Prijava uspješna!");
      router.push("/");
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
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Ime i prezime
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Unesite ime i prezime"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Unesite email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Lozinka
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Unesite lozinku"
              />
            </div>
            {isRegistering && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Potvrdite lozinku
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Potvrdite lozinku"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isRegistering ? "Registracija" : "Prijava"}
              </button>
              {isRegistering ? (
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  Nazad na prijavu
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  Registracija
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}