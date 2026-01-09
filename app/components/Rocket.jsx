'use client';

import { useEffect, useState } from 'react';

export default function RocketScrollBtn() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  // 1. Handle Scroll Visibility
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button if scrolled down more than 300px
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
    setIsLaunching(true); // Trigger fly animation

    // Wait for animation to start, then scroll
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 300);

    // Reset rocket position after scrolling is done
    setTimeout(() => {
      setIsLaunching(false);
    }, 1000);
  };

  return (
    <>
      {/* THIS COMPONENT TAKES 0 HEIGHT IN THE LAYOUT.
         'fixed' positioning removes it from the document flow completely.
      */}

      <div
        className={`fixed bottom-10 right-10 z-50 transition-all duration-500 ease-in-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          aria-label="Scroll to Top"
          className={`
            group relative flex items-center justify-center
            w-16 h-16 rounded-full cursor-pointer
                                           
            bg-linear-to-br from-violet-600 via-purple-500 to-indigo-800
            border-t border-white/30 border-b
            shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5),inset_0_-5px_10px_rgba(0,0,0,0.2)]
            /* --- HOVER EFFECTS --- */
            hover:scale-110 hover:shadow-[0_20px_35px_-5px_rgba(79,70,229,0.6)]
            transition-all duration-300 ease-out
            active:scale-95
          `}
        >
          {/* Internal Glow/Highlight for 3D depth */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/30 opacity-100 rounded-full pointer-events-none" />

          {/* THE ROCKET EMOJI */}
          <span
            className={`
              text-3xl filter drop-shadow-md select-none
              transition-transform duration-700
              ${isLaunching ? '-translate-y-[200vh] scale-75' : 'group-hover:-rotate-45'}
            `}
          >
            🚀
          </span>

          {/* Engine Fire (Only visible on hover or launch) */}
          <span
            className={`
              absolute -bottom-2 text-sm opacity-0 transition-all duration-300
              ${isLaunching ? 'opacity-100 scale-150 translate-y-10' : 'group-hover:opacity-100 group-hover:translate-y-1'}
            `}
          >
            🔥
          </span>
        </button>
      </div>
    </>
  );
}