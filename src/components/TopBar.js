import React, { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link';

import Logo from "../../public/Io.webp"


function TopBar() {
    return (
      <nav className="bg-gray-800 text-white py-4 flex">

        <div className="p-2">
            <Link href="/">
                <Image src={Logo} alt="Logo" className="w-12 h-12" />
            </Link>
        </div>
        
        <div className="p-2 flex space-x-12">
            <Link href="/heroes">
                Heroes
            </Link>
            <Link href="/tier-list">
                Tier List
            </Link>
        </div>

      </nav>
    );
  }
  
  export default TopBar;
  