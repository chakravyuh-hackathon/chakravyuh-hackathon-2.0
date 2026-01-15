"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StatNode = ({ title, subtitle, position }) => (
  <div className={`absolute flex items-center justify-center z-50 animate-reverse-spin ${position}`}>
    <div className="relative flex flex-col justify-center items-center py-1 sm:py-2 min-w-[90px] sm:min-w-[120px] md:min-w-[140px]">
      <div className="-z-10 absolute inset-0 flex flex-col justify-center items-center opacity-60">
        <div className="bg-zinc-800 blur-[1px] mb-px rounded-full w-[55%] h-[6px] sm:h-[8px]" />
        <div className="bg-zinc-700 blur-[1px] mb-px rounded-full w-[80%] h-[8px] sm:h-[10px]" />
        <div className="bg-zinc-600 blur-[1px] rounded-full w-full h-[10px] sm:h-[14px]" />
        <div className="bg-zinc-700 blur-[1px] mt-px rounded-full w-[75%] h-[8px] sm:h-[10px]" />
        <div className="bg-zinc-800 blur-[1px] mt-px rounded-full w-[50%] h-[6px] sm:h-[8px]" />
      </div>

      <div className="px-2 sm:px-3 text-center">
        <h2 className="font-bold text-white text-xl sm:text-2xl md:text-3xl leading-none">
          {title}
        </h2>
        <p className="mt-1 font-medium text-[9px] text-white sm:text-[11px] md:text-[13px] whitespace-nowrap">
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

const Journey = () => {
  const sectionRef = useRef(null);
  const orbitsRef = useRef([]);
  const titleRef = useRef(null); // ref for the heading

  useEffect(() => {
    // Timeline for orbits
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        toggleActions: "play none none none",
      },
    });

    // Animate orbits scale and opacity
    tl.fromTo(
      orbitsRef.current,
      { scale: 0.6, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.25,
      }
    );

    // Glow effect
    tl.to(
      orbitsRef.current,
      {
        boxShadow: "0 0 20px 2px rgba(168, 85, 247, 0.4)",
        borderColor: "rgba(168, 85, 247, 0.8)",
        duration: 0.5,
        stagger: 0.3,
        ease: "sine.inOut",
      },
      "-=0.5"
    );

    // 🌟 Animate the title properly
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 }, // start invisible, moved down
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%", // trigger when top of title hits 20% from top
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center items-center py-16 sm:py-20 w-full min-h-screen overflow-hidden"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="stars" />
      </div>

      {/* Heading */}
      <h2
        ref={titleRef}
        data-text="JOURNEY"
        className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none"
      >
        JOURNEY
      </h2>

      {/* Orbits */}
      <div className="relative w-[280px] sm:w-[520px] md:w-[750px] h-[280px] sm:h-[520px] md:h-[750px]">
        <div
          ref={(el) => (orbitsRef.current[0] = el)}
          className="absolute inset-0 border border-slate-400 rounded-full animate-spin-slow"
        >
          <StatNode title="20+" subtitle="Successful Events" position="top-[10%] left-[8%]" />
          <div
            ref={(el) => (orbitsRef.current[1] = el)}
            className="absolute inset-[14%] border border-slate-400 rounded-full"
          >
            <StatNode title="36+" subtitle="Hack Hours" position="bottom-[5%] right-[12%]" />
            <StatNode title="150+" subtitle="Projects" position="top-[-2%] right-[25%]" />
            <div
              ref={(el) => (orbitsRef.current[2] = el)}
              className="absolute inset-[18%] border border-slate-400 rounded-full"
            >
              <StatNode title="200+" subtitle="Avg. Footfall" position="bottom-[28%] left-[-12%]" />
              <StatNode title="700+" subtitle="Participants" position="top-[42%] right-[-12%]" />
              <div
                ref={(el) => (orbitsRef.current[3] = el)}
                className="absolute inset-[22%] flex justify-center items-center bg-radial-glow border-2 border-purple-900/40 rounded-full"
              >
                <div className="relative w-[45%] h-[45%] animate-reverse-spin">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-reverse-spin {
          animation: reverse-spin 30s linear infinite;
        }
        .bg-radial-glow {
          background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%);
        }
        .stars {
          width: 100%;
          height: 100%;
          background:
            radial-gradient(1px 1px at 20px 30px, #eee, transparent),
            radial-gradient(1px 1px at 100px 150px, #fff, transparent),
            radial-gradient(1.5px 1.5px at 200px 300px, #fff, transparent);
          background-size: 400px 400px;
          opacity: 0.2;
        }
      `}</style>
    </section>
  );
};

export default Journey;
