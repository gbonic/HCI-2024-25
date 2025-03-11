import Link from 'next/link';
import '@fortawesome/fontawesome-free';
import Image from 'next/image';


export default function FooterComponent() {
  return (
    <footer className="bg-cream py-4 [grid-area:footer]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/">
          <Image src="/images/FlavorFuse-dark-logo.png" alt="FlavorFuse Logo" className="h-10 m-4" width={60} height={50}/>
          </Link>
        </div>
        <div className="text-zinc-900 text-center md:text-left md:mt-0 flex-1">
          <Link href="/">
            info@flavorfuse.com
          </Link>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link href="/">
            <i className="fab fa-facebook-f text-gray-700 hover:text-black"></i>
          </Link>
          <Link href="/">
            <i className="fab fa-instagram text-gray-700 hover:text-black"></i>
          </Link>
          <Link href="/">
            <i className="fab fa-twitter text-gray-700 hover:text-black"></i>
          </Link>
          <Link href="/">
            <i className="fab fa-linkedin text-gray-700 hover:text-black"></i>
          </Link>
          <Link href="/">
            <i className="fab fa-youtube text-gray-700 hover:text-black"></i>
          </Link>
        </div>
      </div>
      <hr className="my-4 border-gray-300" />
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p className='text-zinc-900'>© 2024 FlavorFuse. All rights reserved.</p>
        <div className="text-zinc-900 flex justify-center space-x-4 mt-2">
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Terms of Service</Link>
          <Link href="/">Cookies Settings</Link>
        </div>
      </div>
    </footer>
  );
}
