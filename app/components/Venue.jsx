"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Page() {
  const titleRef = useRef(null);
  const leftRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
      scrollTrigger: {
        trigger: titleRef.current,   // trigger when title comes into view
        start: "top 80%",            // when the top of the element hits 80% from top
      },
    });

    tl.from(titleRef.current, { opacity: 0, y: -40 })
      .from(leftRef.current, { opacity: 0, x: -80 }, "-=0.4")
      .from(mapRef.current, { opacity: 0, x: 80, scale: 0.9 }, "-=0.6");
  }, []);

  return (
    <section id="venue" className="relative flex items-center px-6 py-20 w-full min-h-screen overflow-hidden text-white">
      {/* STAR BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] opacity-20 bg-size-[22px_22px]" />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* TITLE */}
        <h2
          ref={titleRef}
          data-text="DESTINATION"
          className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none"
        >
          DESTINATION
        </h2>

        <div className="items-center gap-16 grid grid-cols-1 md:grid-cols-2">
          {/* LEFT CONTENT */}
          <div ref={leftRef} className="space-y-10 border-purple-500 border-r-2 md:text-left text-center">
            <div>
              <h2 className="mb-2 font-bold text-purple-400 text-2xl">Venue</h2>
              <p className="text-xl leading-relaxed">
                SVERI&apos;s College of Engineering  (An Autonomous Institute),<br />
                Pandharpur, Maharashtra
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-bold text-purple-400 text-2xl">Date and Time</h2>
              <p className="text-xl">
                12th to 14th March 2026 <br />
              </p>
            </div>

            <div>
              <h2 className="mb-2 font-bold text-purple-400 text-2xl">Extra Information</h2>
              <p className="mx-auto md:mx-0 max-w-xl text-gray-300 leading-relaxed">
                This is where innovation meets inspiration!  
                A 36-hour hackathon venue with ample space,  
                high-speed internet, and an energetic campus  
                atmosphere to unleash your inner hacker 🚀
              </p>
            </div>
          </div>

          {/* MAP */}
          <div
            ref={mapRef}
            className="shadow-2xl border border-white/10 rounded-2xl w-full h-[360px] md:h-[420px] overflow-hidden"
          >
            <iframe
              title="SVERI College Map"
              src="https://www.google.com/maps?q=SVERI%20College%20of%20Engineering%20Pandharpur&output=embed"
              className="border-0 w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
