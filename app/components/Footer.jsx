"use client";

import React from "react";
import { Instagram, Linkedin, Youtube, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-between bg-black/70 px-8 md:px-16 py-12 md:py-16 border-gray-900 border-t min-h-[40vh] text-white">

      {/* Top Section */}
      <div className="gap-12 md:gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto w-full max-w-7xl">

      
        <div className="flex flex-col justify-center items-start">
         
          <div className="bg-black p-4 rounded-xl">
            <img
              src="/Logo/LOGOOOOO.png" 
              alt="Chakravyuh Logo"
              className="w-40 md:w-35 object-contain"
            />
          </div>
        </div>

        {/* 2. Documents */}
        <div className="flex flex-col mt-5">
          <h3 className="mb-6 pb-2 border-[#9d50bb] border-b-2 w-fit font-black text-sm md:text-base uppercase tracking-widest">
            Documents
          </h3>

          <ul className="space-y-4 font-medium text-gray-400 text-xs md:text-sm">
             <li>
              <a
                href="/Footer-pdf/CHAKRAVYUV 2.0-Official Code of Conduct.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:pl-2 hover:text-white transition-all duration-300"
              >
                — Code of Conduct
              </a>
            </li>
             <li>
              <a
                href="/Footer-pdf/CHAKRAVYUV 2.0-Official Event Guidlines.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:pl-2 hover:text-white transition-all duration-300"
              >
                — Official Event Guidelines
              </a>
            </li>
            <li>
              <a
                href="/Footer-pdf/CHAKRAVYUH 2.0-RULE BOOK.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:pl-2 hover:text-white transition-all duration-300"
              >
                — Chakravyuh 2.0 Rule Book
              </a>
            </li>
          </ul>
        </div>

        {/* 3. Social Media */}
        <div className="flex flex-col mt-5">
          <h3 className="mb-6 pb-2 border-[#9d50bb] border-b-2 w-fit font-black text-sm md:text-base uppercase tracking-widest">
            Connect
          </h3>

          <div className="flex gap-6 text-gray-400">
            <a
              href="https://www.instagram.com/chakravyuh_hack"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9d50bb] hover:scale-125 transition-all transform"
            >
              <Instagram size={28} />
            </a>

            <a
              href="https://www.linkedin.com/company/chakravyuh-hackathon/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9d50bb] hover:scale-125 transition-all transform"
            >
              <Linkedin size={28} />
            </a>

            <a
              href="https://www.youtube.com/@Chakravyuh-Hack"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#9d50bb] hover:scale-125 transition-all transform"
            >
              <Youtube size={28} />
            </a>

            <a
              href="tel:8669233747"
              className="hover:text-[#9d50bb] hover:scale-125 transition-all transform"
            >
              <Phone size={28} />
            </a>
          </div>
        </div>

        {/* 4. Support */}
        <div className="flex flex-col mt-5">
          <h3 className="mb-6 pb-2 border-[#9d50bb] border-b-2 w-fit font-black text-sm md:text-base uppercase tracking-widest">
            Support
          </h3>

          <a
            href="mailto:chakravyuh@coe.sveri.ac.in"
            className="font-bold text-[#9d50bb] hover:text-white text-xs md:text-sm break-all transition-colors"
          >
            chakravyuh@coe.sveri.ac.in
          </a>

          <a
           href="tel:9527747796"
          className="flex items-center gap-2 mt-4 text-gray-400 text-xs md:text-sm cursor-pointerfont-semibold curse">
            <Phone size={16} /> +91 9527747796
          </a>
           <a
           href="tel:8669233747"
          className="flex items-center gap-2 mt-4 text-gray-400 text-xs md:text-sm cursor-pointerfont-semibold curse">
                 <Phone size={16} /> +91 8669233747
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto mt-16 pt-10 border-gray-800/50 border-t w-full max-w-7xl text-center">
  
  <p className="font-bold text-gray-500 text-xs md:text-sm uppercase tracking-[0.4em]">
    Made with <span className="text-red-500 text-lg animate-pulse">❤️</span> by 
    <span className="ml-1 text-blue-400">Team Chakravyuh</span>
  </p>

  <p className="mt-3 text-[11px] text-gray-600 md:text-xs">
    © {new Date().getFullYear()} <span className="font-medium text-gray-400">Chakravyuh 2.0</span>. 
    All Rights Reserved.
  </p>

</div>


    </footer>
  );
}
