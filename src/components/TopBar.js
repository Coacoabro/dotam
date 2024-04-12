import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'
import Link from 'next/link';

import SearchBar from './SearchBar'

import Logo from "../../public/Io.webp"


function TopBar() {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const mobileMenuRef = useRef(null);

    useEffect(() => {
        // Function to close the mobile menu when clicking outside of it
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        // Add event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function to remove event listener when the component unmounts
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
      };
    

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-gray-700 text-white p-2 flex items-center justify-between space-x-10">
            <div className="p-2 flex items-center">
                <Link href="/">
                    <Image src={Logo} alt="Logo" className="w-12 h-12 rounded-md" />
                </Link>
                {/* Mobile menu */}
                <div className="relative md:hidden">
                    <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    {/* Mobile menu dropdown */}
                    <div className={`absolute w-36 top-full left-0 mobile-menu z-10 ${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} ref={mobileMenuRef}>
                        <div className="rounded-lg bg-gray-500 ">
                            <div className="py-1">
                                <Link href="/heroes" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Heroes</Link>
                                <Link href="/tier-list" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Tier List</Link>
                                <Link href="/basics" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Dota 2 Basics</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex">
                <SearchBar />
            </div>
            <div className="flex items-center">                               
                {/* Desktop menu */}
                <div className="hidden md:flex space-x-8">
                    <Link href="/heroes">
                        Heroes
                    </Link>
                    <Link href="/tier-list">
                        Tier List
                    </Link>
                    <Link href="/basics">
                        Dota 2 Basics
                    </Link>
                </div>
            </div>
            <div className="flex md:hidden">
                <SearchBar />
            </div>

            
        </nav>

        
    );

  }
  
  export default TopBar;
  