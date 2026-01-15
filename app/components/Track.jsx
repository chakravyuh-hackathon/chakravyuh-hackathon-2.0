"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Keeping the function name exactly as requested: Tracks
export default function Tracks() {
  const cardsRef = useRef([]);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const [flippedCards, setFlippedCards] = useState({});
  const timeoutsRef = useRef({});

  const tracks = [
    { Image: "https://s1.hackthespace.co/_next/image?url=%2Fimages%2Fastrohealth.png&w=1920&q=75", title: "Healthcare", info: "Innovative healthcare solutions using technology to improve diagnosis, treatment, and patient care." },
    { Image: "/Tracks/FFFFFFFFF-removebg-preview.png", title: "Finance", info: "Revolutionizing digital payments, blockchain, and decentralized finance to build secure economic systems." },
    { Image: "https://s1.hackthespace.co/_next/image?url=%2Fimages%2Fastrotech_nobg.png&w=1920&q=75", title: "Technology", info: "Cutting-edge software and hardware solutions to solve real-world challenges." },
    { Image: "https://s1.hackthespace.co/_next/image?url=%2Fimages%2Fastroaiml.png&w=1920&q=75", title: "AI / ML", info: "Artificial Intelligence and Machine Learning models for automation and smart decision-making." },
    { Image: "https://s1.hackthespace.co/_next/image?url=%2Fimages%2Fastroweb3.png&w=1920&q=75", title: "Web3", info: "Blockchain, decentralized apps, and next-generation internet technologies." },
    { Image: "https://s1.hackthespace.co/_next/image?url=%2Fimages%2Fastroopen.png&w=1920&q=75", title: "Open Innovation", info: "Creative and impactful ideas that don't fit into a single category." },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headerRef.current, ".description-box"], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(card,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        );

        gsap.to(card, {
          scale: 1.1,
          filter: "brightness(1.2)",
          duration: 0.3,
          scrollTrigger: {
            trigger: card,
            start: "top 20%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card || flippedCards[index]) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * 20;
    const rotateY = ((rect.width / 2 - x) / rect.width) * 20;

    gsap.to(card.querySelector(".card-inner"), {
      rotateX, rotateY, duration: 0.4, ease: "power2.out",
    });

    // Border Glow Animation: Start drawing the purple line
    gsap.to(card.querySelector(".glow-path"), {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = (index) => {
    if (flippedCards[index]) return;
    const card = cardsRef.current[index];
    
    gsap.to(card.querySelector(".card-inner"), {
      rotateX: 0, rotateY: 0, duration: 0.4, ease: "power2.out",
    });

    // Border Glow Animation: Retract the line
    gsap.to(card.querySelector(".glow-path"), {
      strokeDashoffset: 1200, 
      duration: 0.8,
      ease: "power1.inOut",
    });
  };

  const handleCardClick = (index) => {
    const isFlipped = !!flippedCards[index];
    if (timeoutsRef.current[index]) clearTimeout(timeoutsRef.current[index]);
    setFlippedCards((prev) => ({ ...prev, [index]: !isFlipped }));
    
    gsap.to(cardsRef.current[index].querySelector(".card-inner"), {
      rotateY: isFlipped ? 0 : 180, rotateX: 0, duration: 1, ease: "power3.inOut",
    });

    if (!isFlipped) {
      timeoutsRef.current[index] = setTimeout(() => {
        setFlippedCards((prev) => ({ ...prev, [index]: false }));
        gsap.to(cardsRef.current[index].querySelector(".card-inner"), {
          rotateY: 0, rotateX: 0, duration: 1, ease: "power3.inOut",
        });
      }, 5000);
    }
  };

  return (
    <section id="tracks" ref={sectionRef} className="flex flex-col items-center bg-transparent px-6 py-20 w-full min-h-screen overflow-hidden">
      <h2
        ref={headerRef}
        data-text="TRACKS"
        className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-10 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none select-none"
      >
        TRACKS
      </h2>


      <div className="gap-12 md:gap-16 lg:gap-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleCardClick(index)}
            className="relative w-[280px] h-[320px] cursor-pointer"
            style={{ perspective: "1500px" }}
          >
            {/* SVG Border Glow Layer */}
            <svg className="z-30 absolute inset-0 w-full h-full pointer-events-none" overflow="visible">
              <rect
                className="glow-path"
                x="0" y="0"
                width="100%" height="100%"
                rx="2rem"
                fill="none"
                stroke="rgba(168, 85, 247, 0.8)"
                strokeWidth="4"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                style={{ filter: "drop-shadow(0 0 10px rgba(168, 85, 247, 1))" }}
              />
            </svg>

            <div className="relative shadow-xl rounded-4xl w-full h-full transition-shadow duration-500 card-inner preserve-3d" style={{ transformStyle: "preserve-3d" }}>
              {/* FRONT */}
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-6 bg-white/5 backdrop-blur-xl p-4 border border-white/10 rounded-4xl" style={{ backfaceVisibility: "hidden" }}>
                <div className="relative w-32 sm:w-40 h-32 sm:h-40">
                  {/* --- UPDATED IMAGE TAG BELOW --- */}
                  <img 
                    src={item.Image} 
                    alt={item.title} 
                    draggable={false}
                    className="drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] w-full h-full object-contain pointer-events-none select-none" 
                  />
                  {/* ------------------------------- */}
                </div>
                <h3 className="font-bold text-white text-xl uppercase tracking-wide select-none">{item.title}</h3>
              </div>

              {/* BACK */}
              <div className="absolute inset-0 flex justify-center items-center bg-linear-to-br from-purple-900 to-black backdrop-blur-2xl px-8 border border-purple-500/40 rounded-4xl text-center" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                <p className="font-medium text-purple-50 text-sm sm:text-base italic leading-relaxed select-none">&quot;{item.info}&quot;</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`.preserve-3d { transform-style: preserve-3d; }`}</style>
    </section>
  );
}