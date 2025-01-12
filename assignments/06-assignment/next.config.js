/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com', // Domen s koje učitavaš slike
        port: '', // Ako nema porta, ostavi prazno
        pathname: '/**', // Dozvoljava učitavanje svih putanja
      },
    ],
  },
  // druge konfiguracije...
};