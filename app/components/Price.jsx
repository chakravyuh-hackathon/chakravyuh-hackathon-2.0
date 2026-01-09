"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PrizeSection = () => {
  const containerRef = useRef(null);
  const leftSideRef = useRef(null);
  const gearRef = useRef(null);
  const progressRingRef = useRef(null); // New Ref for the "scan" ring
  const cardsRef = useRef([]);

  const prizes = [
    { rank: "WINNER", amount: "₹30,000", icon: "🥇" },
    { rank: "RUNNER UP", amount: "₹20,000", icon: "🥈" },
    { rank: "SECOND RUNNER UP", amount: "₹15,000", icon: "🥉" },
    { rank: "Best GenAI Project", amount: "₹8,000", icon: "🤖" },  
   { rank: "Best Girls Team", amount: "₹7,000", icon: "👩‍💻" }  

  ];

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      if (!isMobile) {
        // PIN LEFT SIDE
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: leftSideRef.current,
          anticipatePin: 1,
        });

        // ROTATION & UNIQUE PROGRESS RING
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 4,
          },
        });

        tl.to(gearRef.current, { rotate: 180, ease: "none" }, 0)
          // This animates the dashed stroke to "fill up" as you scroll
          .fromTo(progressRingRef.current, 
            { strokeDashoffset: 1200 }, 
            { strokeDashoffset: 0, ease: "none" }, 0
          );

        // 🔥 UNIQUE GLOW PULSE (Layered)
        gsap.to(gearRef.current, {
          filter: "drop-shadow(0 0 15px rgba(168,85,247,0.4)) drop-shadow(0 0 40px rgba(168,85,247,0.6))",
          opacity: 1,
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // 🔥 EXTRA GLOW ON SCROLL (Reactive)
        gsap.to(gearRef.current, {
          filter: "drop-shadow(0 0 25px rgba(192,132,252,0.6)) drop-shadow(0 0 60px rgba(168,85,247,0.8))",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });
      }

      // PRIZE CARDS
      cardsRef.current.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: 50 }, // Changed y to x for a unique side-entry
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="price" ref={containerRef} className="relative selection:bg-purple-900 w-full text-white">
      <div className="flex lg:flex-row flex-col min-h-screen">
        
        {/* LEFT SIDE */}
        <div
          ref={leftSideRef}
          className="hidden lg:flex justify-start items-center w-[45%] h-screen overflow-hidden pointer-events-none"
        >
          <div className="relative flex items-center h-full">
            
            {/* Frame */}
            <div className="flex flex-col justify-between items-end ml-[-8px] py-20 border-white/20 border-y-2 border-r-2 w-14 h-[75%]">
              <div className="bg-purple-500/5 mr-[-24px] border-2 border-purple-500/30 w-10 h-28" />
              <div className="bg-purple-500/5 mr-[-24px] border-2 border-purple-500/30 w-10 h-28" />
            </div>

            {/* 🔥 GLOWING ROTATING GEAR WITH PROGRESS RING */}
            <div
              ref={gearRef}
              className="relative opacity-70 ml-[-80px] w-[550px] h-[550px] transition-opacity duration-700"
            >
              <svg
                viewBox="0 0 400 400"
                className="fill-none stroke-current w-full h-full text-purple-400"
              >
                {/* Static Background Rings */}
                <circle cx="200" cy="200" r="190" strokeWidth="1" strokeDasharray="5 15" className="opacity-10" />
                <circle cx="200" cy="200" r="160" strokeWidth="0.5" className="opacity-20" />
                
                {/* Dynamic Progress Ring (The Unique Part) */}
                <circle 
                  ref={progressRingRef}
                  cx="200" cy="200" r="175" 
                  strokeWidth="2" 
                  strokeDasharray="1200" 
                  strokeDashoffset="1200"
                  className="opacity-60 text-purple-500"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />

                {/* Inner Gear Details */}
                <circle cx="200" cy="200" r="130" strokeWidth="1" className="opacity-40" />
                <line x1="200" y1="70" x2="200" y2="330" strokeWidth="0.5" className="opacity-20" />
                <line x1="70" y1="200" x2="330" y2="200" strokeWidth="0.5" className="opacity-20" />
                
                {/* Center Core */}
                <circle cx="200" cy="200" r="45" strokeWidth="3" className="text-purple-300" />
                <circle cx="200" cy="200" r="15" fill="currentColor" className="text-purple-500 animate-pulse" />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="z-10 px-6 sm:px-12 md:px-20 py-20 sm:py-28 w-full lg:w-[55%]">
          <h2

  data-text="MAIN PRIZE"
  className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-3xl sm:text-4xl before:text-4xl sm:before:text-5xl md:text-6xl md:before:text-7xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none /* Background text sizes - responsive */"
>
  MAIN PRIZE
</h2>






          <div className="flex flex-col gap-20 sm:gap-28">
            {prizes.map((prize, idx) => (
              <div
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="group flex items-center gap-6 pb-10 border-white/5 border-b"
              >
                <div className="text-5xl sm:text-6xl md:text-8xl group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
                  {prize.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-500 group-hover:text-purple-400 text-xl sm:text-2xl md:text-4xl italic uppercase transition-colors">
                    {prize.rank}
                  </h3>
                  <span className="font-black text-4xl sm:text-5xl md:text-8xl tracking-tight">
                    {prize.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[25vh]" />
        </div>
      </div>
    </section>
  );
};

export default PrizeSection;