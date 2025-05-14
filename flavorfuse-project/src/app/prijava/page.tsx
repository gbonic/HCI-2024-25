"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Prijava() {
  const { setUserInitials, setUserName, setUserEmail } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  let logoutTimer: NodeJS.Timeout;

  const resetLogoutTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => handleLogout(), 10 * 60 * 1000); // 10 minuta
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_initials");
    setUserInitials(null);
    setUserName(null);
    setUserEmail(null);
    router.push("/prijava");
  };

  useEffect(() => {
    const handleActivity = () => resetLogoutTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetLogoutTimer();
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  useEffect(() => {
    const userToken = Cookies.get("auth_token");
    const userEmail = localStorage.getItem("user_email");
    const userName = localStorage.getItem("user_name");
    const userInitials = localStorage.getItem("user_initials");
    if (userToken && userEmail && userName && userInitials) {
      setUserEmail(userEmail);
      setUserName(userName);
      setUserInitials(userInitials);
      router.push("/");
    }
    setIsLoading(false);
  }, [router, setUserEmail, setUserName, setUserInitials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isRegistering) {
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
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user) => user.email === email);
      if (userExists) {
        setError("Korisnik s ovim emailom već postoji.");
        return;
      }
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      const userToken = "exampleAuthToken";
      Cookies.set("auth_token", userToken, { path: "/" }); // Session cookie, briše se kad se zatvori preglednik
      const nameParts = name.split(' ');
      const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1]?.charAt(0).toUpperCase() || '');
      setUserInitials(initials);
      setUserName(name);
      setUserEmail(email);
      setSuccess("Uspješno ste se registrirali!");
      router.push("/");
    } else {
      if (!email || !password) {
        setError("Molimo unesite email i lozinku.");
        return;
      }
      if (!validateEmail(email)) {
        setError("Unesite ispravan email.");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((user) => user.email === email && user.password === password);
      if (!user) {
        setError("Neispravan email ili lozinka.");
        return;
      }
      const userToken = "exampleAuthToken";
      Cookies.set("auth_token", userToken, { path: "/" }); // Session cookie
      const nameParts = user.name.split(' ');
      const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1]?.charAt(0).toUpperCase() || '');
      setUserInitials(initials);
      setUserName(user.name);
      setUserEmail(user.email);
      setSuccess("Prijava uspješna!");
      router.push("/");
    }
  };

  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(password);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Učitavanje...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white shadow-lg">
        <div className="md:w-1/2 hidden md:block relative group">
          <Image
            src="/images/backgroundprijava.jpg"
            alt="Pozadinska slika hrane"
            layout="fill"
            objectFit="cover"
            className="brightness-75 transition-all duration-300 group-hover:brightness-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 MGM to-transparent flex items-center justify-center">
            <h2 className="text-white text-3xl font-bold px-6 text-center">Pridruži se FlavorFuse zajednici!</h2>
          </div>
        </div>
        <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 font-sans bg-clip-text text-transparent">
              {isRegistering ? "Registracija" : "Prijava"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isRegistering ? "Pridruži se" : "Dobrodošli natrag"} u FlavorFuse!
            </p>
          </div>
          {success && <p className="text-green-600 bg-green-50 p-3 rounded-xl mb-4 text-center">{success}</p>}
          {error && <p className="text-red-600 bg-red-50 p-3 rounded-xl mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div>
                <input
                  type="text"
                  placeholder="Unesite ime"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-amber-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 placeholder-gray-400"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Unesite email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-amber-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 placeholder-gray-400"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Unesite lozinku"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-amber-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 placeholder-gray-400"
              />
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-amber-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>
            {isRegistering && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Potvrdite lozinku"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 bg-amber-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 placeholder-gray-400"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-amber-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-xl font-semibold text-white hover:from-amber-700 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
              {isRegistering ? "Registriraj se" : "Prijavi se"}
            </button>
          </form>
          <p className="text-center mt-4">
            {isRegistering ? "Već imaš račun?" : "Nemaš račun?"}{" "}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              {isRegistering ? "Prijavi se" : "Registriraj se"}
            </button>
          </p>
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              <hr className="w-1/4 border-gray-300" />
              <span className="text-gray-500 text-sm">ILI</span>
              <hr className="w-1/4 border-gray-300" />
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaGoogle className="text-red-500 text-xl" />
              </button>
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaFacebookF className="text-blue-600 text-xl" />
              </button>
              <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <FaInstagram className="text-pink-500 text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}