"use client";

import { useEffect, useRef, useState } from "react";
import { ReactTyped } from "react-typed";
import { ScrollText, UserPlus, Sparkles } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";

export default function Page() {
  const registerOverlayRef = useRef(null);
  const registerTextRef = useRef(null);
  const mainContentRef = useRef(null);

  const introOverlayRef = useRef(null);
  const introTextRef = useRef(null);
  const introGlowRef = useRef(null);
  const scanLineRef = useRef(null);

  const [isIntroDone, setIsIntroDone] = useState(false);

  /* ================= COUNTDOWN ================= */
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-03-08T00:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ================= INTRO ================= */
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setIsIntroDone(true) });

    tl.fromTo(introTextRef.current, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1 });
    tl.fromTo(introGlowRef.current, { scale: 0.6 }, { scale: 1.1, duration: 0.6 }, "-=0.5");
    tl.fromTo(scanLineRef.current, { x: "-120%" }, { x: "120%", duration: 0.8 }, "-=0.4");
    tl.to(introTextRef.current, { scale: 30, opacity: 0, duration: 1 });
    tl.to(introOverlayRef.current, { opacity: 0, pointerEvents: "none" }, "-=0.4");
  }, []);

  /* ================= MAIN CONTENT ================= */
  useEffect(() => {
    if (!isIntroDone) return;
    gsap.fromTo(
      mainContentRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.7 }
    );
  }, [isIntroDone]);

  /* ================= REGISTER BUTTON ================= */
  const animateIn = () => {
    gsap.to(registerOverlayRef.current, { width: "100%", duration: 0.35 });
    gsap.to(registerTextRef.current, { color: "#fff", duration: 0.3 });
  };

  const animateOut = () => {
    gsap.to(registerOverlayRef.current, { width: "0%", duration: 0.35 });
    gsap.to(registerTextRef.current, { color: "#9333ea", duration: 0.3 });
  };

  return (
    <section id="home" className="relative flex justify-center items-center w-full min-h-[100svh] overflow-hidden">

      {/* INTRO */}
      <div ref={introOverlayRef} className="z-[999] fixed inset-0 flex justify-center items-center bg-[#050510]">
        <div ref={introGlowRef} className="absolute bg-purple-500/20 blur-3xl rounded-full w-72 sm:w-[420px] h-72 sm:h-[420px]" />
        <div ref={scanLineRef} className="absolute bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] h-full skew-x-12" />
        <h1 ref={introTextRef} className="font-black text-white text-4xl sm:text-7xl text-center">
          CHAKRAVYUH <span className="bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400 text-transparent">2.0</span>
        </h1>
      </div>

      {/* MAIN */}
      <div
        ref={mainContentRef}
        className={`z-10 px-4 flex flex-col items-center gap-6 text-center max-w-4xl transition-opacity ${
          isIntroDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 border border-amber-500/30 rounded-full text-amber-400 text-xs">
          <Sparkles size={12} /> 36 Hours of Innovation
        </div>

        <h1 className="font-black text-white text-3xl sm:text-5xl md:text-7xl">
          CHAKRAVYUH <span className="bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400 text-transparent">2.0</span>
        </h1>

        <ReactTyped
          strings={["Last registration date: 8 March 2026", "Build | Battle | Break Limits"]}
          typeSpeed={50}
          backSpeed={30}
          loop
          className="text-blue-400 text-base sm:text-xl"
        />

        {/* COUNTDOWN */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="bg-white/5 px-4 py-2 border border-white/10 rounded-xl min-w-[70px]">
              <div className="font-bold text-white text-xl sm:text-3xl">
                {value.toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] text-gray-400 uppercase">{unit}</div>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex sm:flex-row flex-col gap-4 mt-4 w-full sm:w-auto">
  {/* 1. Rules Link - "Cosmic Glass" Style */}
  <a
    href="/Footer-PDF/CHAKRAVYUH 2.0-RULE BOOK.pdf"
    target="_blank"
    rel="noopener noreferrer"
    className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] backdrop-blur-xl px-8 py-3 border border-purple-500/40 hover:border-purple-400 rounded-full w-full sm:w-auto font-semibold text-purple-100 tracking-widest hover:scale-105 active:scale-95 transition-all duration-300"
  >
    <ScrollText size={18} className="text-purple-400" />
    BROCHURE
  </a>

  {/* 2. Register Button - "Nebula Pulse" Style */}
  <Link href="/registration">
    <button
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onTouchStart={animateIn}
      onTouchEnd={animateOut}
      className="group relative bg-[#050510] shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] border border-indigo-500/50 hover:border-indigo-400 rounded-xl w-full sm:w-64 h-14 overflow-hidden transition-all duration-500"
    >
    {/* Animated Filling Overlay */}
    <div 
      ref={registerOverlayRef} 
      className="left-0 absolute inset-y-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 opacity-90 w-0 transition-all duration-500" 
    />
    
    {/* Button Content */}
    <div className="z-10 relative flex justify-center items-center gap-3 h-full font-bold text-white text-xl tracking-tight">
      <UserPlus className="group-hover:animate-pulse" /> 
      <span ref={registerTextRef} className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
        REGISTER
      </span>
    </div>

    {/* Subtle Inner Glow Flare */}
    <div className="block top-0 z-5 absolute -inset-full bg-linear-to-r from-transparent via-white/10 to-transparent w-1/2 h-full -skew-x-12 group-hover:animate-[shimmer_2s_infinite] transform" />
  </button>
  </Link>
        </div>
      </div>
    </section>
  );
}
