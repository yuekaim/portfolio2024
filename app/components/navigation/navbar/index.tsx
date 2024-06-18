import React from "react";
import Link from "next/link";
import Button from "./button";
import { usePathname } from 'next/navigation';

const Navbar = ({
  toggle,
  isOpen,
}:{
  toggle: () => void;
  isOpen: boolean;
}) => {
  const pathname = usePathname();

  return (
    <>
      <div className="w-100 h-20 sticky top-0 z-30">
        <div className="container px-4 h-full">
          <div className="flex items-center h-full z-20">
          <Button toggle={toggle} isOpen={isOpen} />
            <ul className="navbar md:flex gap-x-6 text-black"
            style={{opacity: `${isOpen? 1:0}`}}>
              <li>
                <Link href="/" className={pathname === '/' ? 'active' : ''}>
                  <p>home</p>
                </Link>
              </li>
              <li>
                <Link href="/about" className={pathname === '/about' ? 'active' : ''}>
                  <p>about</p>
                </Link>
              </li>
              <li>
                <Link href="/projects" className={pathname === '/projects' ? 'active' : ''}>
                  <p>project</p>
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