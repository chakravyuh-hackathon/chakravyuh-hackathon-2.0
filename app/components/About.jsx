"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const cardRef = useRef(null);
  const orbits = useRef([]);
  const cards = useRef([]);

  const [orbitSizes, setOrbitSizes] = useState([]);

  const BASE_DURATION = 40;
  const startAngles = [0, 90, 180, 270];
  const data = ["120+ Projects", "500+ Participants", "10+ Years", "36 Hours"];

  /* -------------------- Responsive Orbit Sizes -------------------- */
  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const size = Math.min(w, h);

      if (w < 640) setOrbitSizes([size * 0.7, size * 0.55, size * 0.4, size * 0.25]);
      else if (w < 1024) setOrbitSizes([400, 320, 240, 160]);
      else setOrbitSizes([520, 420, 320, 220]);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  /* -------------------- GSAP Animations -------------------- */
  useEffect(() => {
    if (!orbitSizes.length || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          once: true,
        },
      });

      /* ---- TITLE ANIMATION ---- */
      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power4.out",
        }
      );

      /* ---- CARD ANIMATION ---- */
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.6"
      );

      /* ---- ORBIT ROTATIONS ---- */
      orbitSizes.forEach((_, i) => {
        const orbit = orbits.current[i];
        const card = cards.current[i];
        if (!orbit || !card) return;

        const duration = BASE_DURATION - i * 6;

        gsap.set(orbit, { rotation: startAngles[i], opacity: 0, scale: 0.5 });
        gsap.set(card, { rotation: -startAngles[i] });

        tl.to(
          orbit,
          {
            opacity: 0.3,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.5"
        );

        gsap.to(orbit, {
          rotation: startAngles[i] + 360,
          duration,
          repeat: -1,
          ease: "linear",
        });

        gsap.to(card, {
          rotation: -(startAngles[i] + 360),
          duration,
          repeat: -1,
          ease: "linear",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [orbitSizes]);

  /* -------------------- Sparkle Rotation -------------------- */
  useEffect(() => {
    gsap.to(".sparkle-icon", {
      rotation: 360,
      repeat: -1,
      duration: 6,
      ease: "linear",
    });
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative flex flex-col justify-center items-center px-4 min-h-screen overflow-hidden text-white"
    >
      {/* -------------------- TITLE -------------------- */}
     <h2
  ref={titleRef}
  data-text="ABOUT"
  className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none /* Background text sizes */"
>
  ABOUT
</h2>



      {/* -------------------- CARD -------------------- */}
      <div
        ref={cardRef}
        style={{ opacity: 0 }}
        className="z-10 relative bg-white/5 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl p-8 md:p-16 border border-white/10 rounded-[40px] max-w-4xl text-center"
      >
        <div className="space-y-6 text-gray-300 text-sm md:text-lg md:text-center text-justify leading-relaxed">
  <p>
    Where passion meets purpose. Chakravyuh 2.0 is organized by a team of
    dedicated volunteers committed to building a strong and inclusive
    tech community.
  </p>

  <p>
    This 36-hour hackathon is designed to go beyond coding — encouraging
    learning, collaboration, and meaningful connections in a welcoming
    environment.
  </p>

  <p className="mt-6 font-semibold text-white text-base md:text-xl">
    More than a competition, Chakravyuh 2.0 is a place to connect and create together.
  </p>
</div>

        <div className="flex justify-center items-center gap-4 mt-10">
          <div className="bg-linear-to-r from-transparent to-[#B14BF4] w-12 h-px" />
          <Sparkles className="w-6 h-6 text-[#B14BF4] sparkle-icon" />
          <div className="bg-linear-to-l from-transparent to-[#B14BF4] w-12 h-px" />
        </div>
      </div>
    </section>
  );
}
