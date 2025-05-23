import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/page";
import '@fortawesome/fontawesome-free/css/all.min.css';


// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />

      <body
        className="grid grid-rows-[auto_1fr_auto] min-h-screen sm:grid-rows-[auto_1fr_auto] text-gray-900"
      >
        <UserProvider>
          <div>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
