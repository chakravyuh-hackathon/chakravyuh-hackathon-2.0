'use client';

import { useEffect, useState } from 'react';

export default function RocketScrollBtn() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // 1. Handle Scroll Visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 2. Handle Click & Launch Animation
  const scrollToTop = () => {
    setIsLaunching(true);

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100); // Reduced delay for better mobile responsiveness

    // Reset rocket position
    setTimeout(() => {
      setIsLaunching(false);
    }, 800);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to Top"
        /* FIX: Added 'overflow-hidden' to prevent the rocket from 
           expanding the page height during its -200vh translation.
        */
        className={`
          group relative flex items-center justify-center
          w-14 h-14 md:w-16 md:h-16 rounded-full cursor-pointer
          overflow-hidden 
          bg-linear-to-br from-violet-600 via-purple-500 to-indigo-800
          border-t border-white/30 border-b
          shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5),inset_0_-5px_10px_rgba(0,0,0,0.2)]
          hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
        `}
      >
        {/* Internal Glow */}
        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/30 opacity-100 rounded-full pointer-events-none" />

        {/* THE ROCKET EMOJI */}
        <span
          className={`
            text-2xl md:text-3xl filter drop-shadow-md select-none
            transition-transform duration-700 ease-in
            ${isLaunching ? '-translate-y-[150%] scale-75' : 'group-hover:-rotate-45'}
          `}
        >
          🚀
        </span>

        {/* Engine Fire */}
        <span
          className={`
            absolute bottom-1 text-xs md:text-sm opacity-0 transition-all duration-300
            ${isLaunching ? 'opacity-100 scale-150 translate-y-10' : 'group-hover:opacity-100 group-hover:translate-y-1'}
          `}
        >
          🔥
        </span>
      </button>
    </div>
  );
}