import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold mb-4 text-yellow-500">PureSphere</h2>
            <p className="text-gray-500 text-sm text-center md:text-left">Elevating your lifestyle with pure, natural products.</p>
            <div className="flex space-x-4 mt-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
                <a key={index} href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Contact Us</h3>
            <ul className="space-y-2 text-center md:text-left">
              {[
                { Icon: MdEmail, text: 'info@puresphere.com', href: 'mailto:info@puresphere.com' },
                { Icon: MdPhone, text: '+91 72008 86350', href: 'tel:+917200886350' },
                { Icon: MdLocationOn, text: 'Gujarat Based Startup', href: null },
              ].map(({ Icon, text, href }, index) => (
                <li key={index} className="flex items-center justify-center md:justify-start">
                  <Icon className="mr-2 text-yellow-500" size={18} />
                  {href ? (
                    <a href={href} className="text-gray-500 hover:text-yellow-500 transition-colors duration-300">{text}</a>
                  ) : (
                    <span className="text-gray-500">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center mb-10">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PureSphere. All rights reserved. | 
            <a href="#" className="text-yellow-500 hover:text-yellow-600 ml-1 transition-colors duration-300">Privacy Policy</a> |
            <a href="#" className="text-yellow-500 hover:text-yellow-600 ml-1 transition-colors duration-300">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;