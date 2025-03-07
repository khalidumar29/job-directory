"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb } from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference in localStorage when the component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Default theme: light
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode and save the preference to localStorage
  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm'>
      <div className='container-fluid d-flex justify-content-between align-items-center'>
        {/* Logo */}
        <Link href='https://allofdubai.com/' className='navbar-brand'>
          <Image
            src='/allofdubai_logo.png'
            alt='Dubai Skyline Logo'
            width={80}
            height={80}
            className='d-inline-block align-top'
          />
        </Link>

        {/* Brand Title */}
        <div className='mx-auto'>
          <span className='h4 text-black dark:text-white'>All Of Dubai</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          className='btn btn-light p-2 d-flex align-items-center justify-content-center'
          aria-label='Toggle theme'
          onClick={toggleTheme}
        >
          <Lightbulb className='w-6 h-6 text-black dark:text-white' />
        </button>
      </div>
    </nav>
  );
}
