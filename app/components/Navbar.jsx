'use client';

import Link from 'next/link';
import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to toggle the mobile navbar
  const [activeLink, setActiveLink] = useState('/home'); // State to track active link

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set the active link when clicked
    if (isOpen) toggleNavbar(); // Close mobile navbar after clicking a link
  };

  const links = [
    { path: '/home', label: 'Home' },
    { path: '/display', label: 'TV Display' },
    { path: '/tvupload', label: 'Upload to TV' },
    { path: '/newtv', label: 'Register New TV' },
  ];

  return (
    <div>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex bg-blue-500 fixed top-0 left-0 w-full z-50">
        <ul className="flex justify-center mx-auto gap-8 text-xl min-h-16 items-center text-white">
          {links.map(({ path, label }) => (
            <li key={path}>
              <Link
                href={path}
                className={`py-2 px-4 rounded-lg hover:bg-yellow-400 ${
                  activeLink === path ? 'bg-yellow-500' : ''
                }`}
                onClick={() => handleLinkClick(path)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navbar */}
      <div
        className={`md:hidden fixed top-0 right-0 w-2/3 h-full z-10 bg-blue-500 transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300`}
      >
        <div className="p-4">
          <button className="text-white text-2xl" onClick={toggleNavbar}>
            X
          </button>
          <ul className="mt-10 text-xl text-white space-y-3">
            {links.map(({ path, label }) => (
              <li key={path}>
                <Link
                  href={path}
                  className={`block py-2 px-4 rounded-lg hover:bg-yellow-400 ${
                    activeLink === path ? 'bg-yellow-500' : ''
                  }`}
                  onClick={() => handleLinkClick(path)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Button to toggle mobile navbar */}
      <div className="md:hidden fixed top-4 right-4">
        <button onClick={toggleNavbar} className="text-white text-2xl">
          &#9776; {/* Hamburger icon */}
        </button>
      </div>

      {/* Main content area with padding to prevent overlap */}
      <div className="pt-16 md:pt-20">
        {/* Page content goes here */}
      </div>
    </div>
  );
}

export default Navbar;
