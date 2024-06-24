import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
      <div className="w-full h-20 sticky top-0 z-30">
        <div className="container px-4 h-full">
          <div className="flex items-center h-full z-20">
          
            <ul className="navbar flex gap-x-6 text-black">
              <li className={pathname === '/' ? 'active' : ''}>
                <Link href="/">
                  <p>home</p>
                </Link>
              </li>
              <li className={pathname === '/about' ? 'active' : ''}>
                <Link href="/about">
                  <p>about</p>
                </Link>
              </li>
              <li className={pathname === '/projects' ? 'active' : ''}>
                <Link href="/projects">
                  <p>projects</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;