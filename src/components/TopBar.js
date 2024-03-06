import React, { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link';

import SearchBar from './SearchBar'

import Logo from "../../public/Io.webp"


function TopBar() {

    return (
      <nav className="bg-gray-700 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
            <div className="p-2 space-x-8">
                <Link href="/">
                    <Image src={Logo} alt="Logo" className="w-12 h-12 rounded-md" />
                </Link>
            </div>
            
            <div className="p-2 flex space-x-12">
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
        

        <div className="p-2 items-center flex space-x-2">
            <label>Search</label>
            <SearchBar />
        </div>

      </nav>
    );
  }
  
  export default TopBar;
  