'use client';

import Link from 'next/link';
import React, { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const [activeLink, setActiveLink] = useState('/home');

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link); 
    if (isOpen) toggleNavbar(); 
  };

  const links = [
    { path: '/home', label: 'Home' },
    { path: '/display', label: 'TV Display' },
    { path: '/tvupload', label: 'Upload to TV' },
    { path: '/newtv', label: 'Register New TV' },
  ];

  return (
    <div>
    
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

      
      <div className="md:hidden fixed top-4 right-4">
        <button onClick={toggleNavbar} className="text-white text-2xl">
          &#9776;
        </button>
      </div>

   
      <div className="pt-16 md:pt-20">
   
      </div>
    </div>
  );
}

export default Navbar;
