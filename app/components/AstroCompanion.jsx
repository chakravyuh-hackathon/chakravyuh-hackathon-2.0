"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function GuideBubble() {
  const bubbleRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(0);

  const categoryMessages = [
    "Start your journey 🚀",
    "Explore our mission 🌟",
    "Follow the path 🚀",
    "Reach for the stars 🏆",
    "Track the events ⏳",
    "Choose your galaxy 🌌",
    "Our cosmic supporters 💫",
    "Meet the crew 👩‍🚀",
    "Get your answers 💡",
    "Find our launchpad 📍",
  ];

  // 🔹 SECTION OBSERVER
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = [...sections].indexOf(entry.target);
            if (index !== -1 && index < categoryMessages.length) {
              setActiveCategory(index);
            }
          }
        });
      },
      {
        threshold: 0.3, // 👈 better for mobile
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // 🔹 GSAP BUBBLE ANIMATION
  useEffect(() => {
    if (!bubbleRef.current) return;

    gsap.fromTo(
      bubbleRef.current,
      { scale: 0.6, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    );
  }, [activeCategory]);

  return (
    <div className="bottom-4 sm:bottom-8 left-4 sm:left-8 z-100 fixed">
      <div className="relative">

        {/* MESSAGE BUBBLE */}
        <div
          ref={bubbleRef}
          className="bottom-[115%] left-2 absolute bg-black/50 backdrop-blur-lg mb-3 px-3 sm:px-4 py-2 sm:py-3 border border-cyan-400/30 rounded-2xl rounded-bl-none w-[140px] sm:w-[180px]"
        >
          <p className="font-semibold text-[11px] text-white sm:text-[13px]">
            {categoryMessages[activeCategory]}
          </p>

          {/* Tail */}
          <div
            className="-bottom-2 left-0 absolute border-t-10 border-t-black/50 border-r-15 border-r-transparent w-0 h-0"
          />
        </div>

        {/* CORE ORB */}
        <div className="relative flex justify-center items-center w-14 sm:w-20 h-14 sm:h-20">
          <div className="absolute inset-0 border border-cyan-400/30 border-dashed rounded-full animate-spin" />

          <div className="flex justify-center items-center bg-linear-to-tr from-cyan-600 to-purple-600 rounded-full w-9 sm:w-12 h-9 sm:h-12 font-bold text-white">
            {activeCategory + 1}
          </div>
        </div>
      </div>
    </div>
  );
}
