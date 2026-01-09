"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  const mobileMenuRef = useRef(null);
  const mobileLinkRefs = useRef([]);

  const navLinks = [
    { name: "Home", target: "home" },
    { name: "About", target: "about" },
    { name: "Pricing", target: "price" },
    { name: "Tracks", target: "tracks" },
    { name: "Schedule", target: "time" },
    { name: "FAQ", target: "faq" },
    { name: "Venue", target: "venue" },
  ];

  /* ------------------------------------------------
     FORCE START FROM TOP ON RELOAD (CLEAR HASH)
  ------------------------------------------------ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const navEntry = performance.getEntriesByType("navigation")[0];

    if (navEntry?.type === "reload") {
      // Clear hash
      history.replaceState(null, "", window.location.pathname);
      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, []);

  /* ------------------------------------------------
     LOCK BODY SCROLL WHEN MOBILE MENU IS OPEN
  ------------------------------------------------ */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  /* ------------------------------------------------
     MOBILE MENU ANIMATION
  ------------------------------------------------ */
  useEffect(() => {
    const menu = mobileMenuRef.current;
    const links = mobileLinkRefs.current;

    if (!menu) return;

    if (open) {
      gsap.set(menu, { autoAlpha: 1 });

      const tl = gsap.timeline();
      tl.fromTo(
        menu,
        { xPercent: 100, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      ).fromTo(
        links,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.35 },
        "-=0.2"
      );
    } else {
      gsap.to(menu, {
        xPercent: 100,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => gsap.set(menu, { autoAlpha: 0 }),
      });
    }
  }, [open]);

  /* ------------------------------------------------
     SMOOTH SCROLL HANDLER (UNCHANGED)
  ------------------------------------------------ */
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;

    setOpen(false);

    gsap.to(window, {
      duration: 1.1,
      scrollTo: { y: section, offsetY: 80 },
      ease: "power4.inOut",
    });

    window.history.pushState(null, "", `#${id}`);
  };

  /* ------------------------------------------------
     NAVBAR SHOW / HIDE ON SCROLL
  ------------------------------------------------ */
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );

      const showAnim = gsap
        .from(navRef.current, { yPercent: -120, paused: true })
        .progress(1);

      ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
          self.direction === 1 ? showAnim.reverse() : showAnim.play();

          const scrolled = self.scroll() > 50;

          gsap.to(navRef.current, {
            backgroundColor: scrolled
              ? "rgba(0,0,0,0.35)"
              : "transparent",
            backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
            borderBottom: scrolled
              ? "1px solid rgba(255,255,255,0.08)"
              : "transparent",
            padding: scrolled ? "12px 0" : "24px 0",
            duration: 0.3,
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav ref={navRef} className="top-0 left-0 z-100 fixed w-full">
        <div className="flex justify-between items-center mx-auto px-6 max-w-[1400px]">
          <button onClick={() => scrollToSection("home")} className="z-102 relative">
            <img src="/Logo/LOGOOOOO.png" alt="Logo" className="h-15" />
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.target)}
                className="font-bold text-white/60 hover:text-white uppercase tracking-[0.2em] transition"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden z-102 relative text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        ref={mobileMenuRef}
        className="invisible z-101 fixed inset-0 flex flex-col justify-center items-center gap-6 bg-black/95 backdrop-blur-xl"
      >
        {navLinks.map((link, i) => (
          <button
            key={link.name}
            ref={(el) => (mobileLinkRefs.current[i] = el)}
            onClick={() => scrollToSection(link.target)}
            className="font-black text-white text-4xl uppercase tracking-widest"
          >
            {link.name}
          </button>
        ))}
      </div>
    </>
  );
}
