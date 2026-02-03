"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

// Defining the sponsor data to keep the JSX clean
const SPONSORS = [
  { id: 1, src: "/Spons Logo/Chandukaka Logo.png", alt: "Chandukaka Saraf" },
    { id: 2, src: "/Spons Logo/devfolio2.png", alt: "Devfolio" },
  { id: 3, src: "/Spons Logo/ethindia.png", alt: "Ethindia" },
];

function SponsorCard({ src, alt }) {
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
        delay: Math.random() * 2,
      }
    );
  }, []);

  return (
    <div className="group relative flex flex-col justify-center items-center bg-white/5 shadow-xl backdrop-blur-xl px-6 py-10 border border-white/10 hover:border-white/40 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 ease-out cursor-pointer">
      
      {/* REALISTIC SHINE LAYERS */}
      <div ref={shineWrap} className="absolute inset-0 rotate-12 pointer-events-none">
        <div className="top-0 left-0 absolute bg-linear-to-r from-transparent via-white/10 to-transparent blur-xl w-1/3 h-full" />
        <div className="top-0 left-8 absolute bg-linear-to-r from-transparent via-white/30 to-transparent blur-sm w-16 h-full" />
      </div>

      {/* IMAGE CONTAINER WITH GLOW */}
      <div className="relative flex justify-center w-full">
        <Image
          src={src}
          alt={alt}
          width={400}
          height={150}
          priority
          className="group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] group-hover:brightness-110 group-hover:saturate-125 w-[180px] sm:w-[220px] md:w-[260px] h-auto object-contain transition-all duration-500"
        />
      </div>
      
      {/* BOTTOM LABEL */}
      <p className="relative mt-6 font-bold text-white/40 group-hover:text-purple-400 text-xs uppercase tracking-[0.3em] transition-colors duration-300">
        Official Partner
      </p>

      {/* OPTIONAL: SUBTLE BACKGROUND GLOW ON HOVER */}
      <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-colors duration-500 pointer-events-none" />
    </div>
  );
}

function Page() {
  return (
    <section className="flex flex-col justify-start items-center bg-zinc-950 px-6 py-16 w-full min-h-screen overflow-hidden text-white">
      {/* DECORATIVE BACKGROUND GRADIENT */}
      <div className="top-[-10%] left-[-10%] absolute bg-purple-900/20 blur-[120px] rounded-full w-[40%] h-[40%] pointer-events-none" />
      
           <h2

        data-text="SPONSOR"

        className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none"

      >

        SPONSOR

      </h2>

      {/* Responsive Grid */}
      <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {SPONSORS.map((sponsor) => (
          <SponsorCard key={sponsor.id} src={sponsor.src} alt={sponsor.alt} />
        ))}
      </div>
    </section>
  );
}

export default Page;