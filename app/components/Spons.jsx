"use client";

import React, { useEffect, useRef } from "react";
 import Image from "next/image";
import gsap from "gsap";

function Page() {
  const shineWrap = useRef(null);

  useEffect(() => {
    if (!shineWrap.current) return;

    gsap.fromTo(
      shineWrap.current,
      { xPercent: -150 },
      {
        xPercent: 150,
        duration: 3,
        repeat: -1,
        ease: "power2.inOut",
      }
    );
  }, []);

  return (
    <section className="flex flex-col justify-start items-center w-full min-h-screen text-white">
      <h2
        data-text="SPONSOR"
        className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none"
      >
        SPONSOR
      </h2>

      <div className="flex flex-1 justify-center items-center w-full">
        {/* Glass Card */}
        <div className="relative bg-white/10 shadow-2xl backdrop-blur-xl px-10 py-8 border border-white/20 rounded-xl overflow-hidden">
          
          {/* REALISTIC SHINE LAYERS */}
          <div
            ref={shineWrap}
            className="absolute inset-0 rotate-12 pointer-events-none"
          >
            {/* soft glow */}
            <div className="top-0 left-0 absolute bg-linear-to-r from-transparent via-white/15 to-transparent blur-xl w-1/3 h-full" />

            {/* sharp highlight */}
            <div className="top-0 left-8 absolute bg-linear-to-r from-transparent via-white/40 to-transparent blur-sm w-24 h-full" />

            {/* micro specular */}
            <div className="top-0 left-20 absolute bg-linear-to-r from-transparent via-white/70 to-transparent w-8 h-full" />
          </div>

          <div className="relative flex justify-center mb-6">
            <Image
              src="/Spons Logo/Chandukaka Logo.png"
              alt="Chandukaka Saraf"
              width={900}
              height={320}
              priority
              className="w-[260px] sm:w-[340px] md:w-[420px] h-auto object-contain"
            />
          </div>

          <p className="relative font-black text-white text-2xl sm:text-3xl tracking-wide">
            **
          </p>
        </div>
      </div>
    </section>
  );
}

export default Page;
