"use client";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useDarkMode } from "@/lib/Mode";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {mode,setMode}= useDarkMode();
  function toggleMode(){
    if (mode=="dark"){
      setMode("light");
    }else{
      setMode("dark");
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50 mb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Left Nav Items */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary dark:text-primary-light">
                DevEd
              </span>
            </div>
            <div className="hidden md:flex md:ml-6 space-x-8">
              <Link
                href="/my-courses"
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2 text-sm font-medium"
              >
                My Courses
              </Link>
              <Link
                href="/courses"
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light px-3 py-2 text-sm font-medium"
              >
                Courses
              </Link>
            </div>
          </div>

          <div onClick={toggleMode} className="flex items-center gap-5">
            {mode=="dark"?<Moon/>:<Sun/>}
            {/* Desktop Auth Buttons */}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>


          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <div
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-primary-light bg-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/my-courses"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            My Courses
          </Link>
          <Link
            href="/courses"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Courses
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
