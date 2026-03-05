"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HackathonSchedule() {
  const containerRef = useRef(null);
  const scheduleRef = useRef(null);
  const contentRef = useRef(null);
  const pathRef = useRef(null);
  const titleRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            tl.fromTo(titleRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" })
              .fromTo(scheduleRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 1, ease: "expo.out" }, "-=0.5")
              .fromTo(".timeline-item", { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }, "-=0.5");
            observer.unobserve(containerRef.current);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    gsap.to(".shine-line", {
      x: "400%",
      duration: 2.5,
      repeat: -1,
      ease: "none",
      repeatDelay: 0.5,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const schedule = scheduleRef.current;
    const content = contentRef.current;
    if (!schedule || !content) return;
    let currentY = 0;
    const onWheel = (e) => {
      if (!hovered || window.innerWidth < 640) return;
      e.preventDefault();
      const maxScroll = content.scrollHeight - schedule.clientHeight;
      currentY += e.deltaY;
      currentY = Math.max(0, Math.min(currentY, maxScroll));
      gsap.to(content, { y: -currentY, duration: 1.2, ease: "power4.out" });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [hovered]);

  const pluckString = () => {
    const path = pathRef.current;
    if (!path) return;
    const originalPath = "M50,0 C80,100 20,200 50,300 C80,400 20,500 50,600 C80,700 20,800 50,900 C80,1000 20,1100 50,1200";
    const pluckedPath = "M50,0 C120,100 -20,200 50,300 C120,400 -20,500 50,600 C120,700 -20,800 50,900 C120,1000 -20,1100 50,1200";
    const tl = gsap.timeline();
    tl.to(path, { attr: { d: pluckedPath }, duration: 0.1, ease: "power2.out" })
      .to(path, { attr: { d: originalPath }, duration: 1.5, ease: "elastic.out(1, 0.2)" });
  };

  const scheduleDays = [
    {
      day: "DAY 1 – LAUNCH DAY",
      events: [
        { time: "12:00 PM – 1:00 PM", activity: "Team Arrival, Registration & ID Verification\nResponsible: Hospitality + Registration + Security", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/4149/4149645.png" },
        { time: "1:00 PM", activity: "Problem Statement Release\nTechnical Team Sync", color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212634.png" },
        { time: "2:00 PM", activity: "Opening Ceremony\nResponsible Team: Core + Anchoring", color: "#ef4444", glow: "rgba(239, 68, 68, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212608.png" },
        { time: "4:00 PM", activity: "Hackathon Starts\nStart of Event", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/2992/2992377.png" },
        { time: "8:00 PM", activity: "Mentor Round 1\nMentors + Technical", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212623.png" },
        { time: "11:30 PM", activity: "Midnight Fun Session\nCore+Design", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3408/3408545.png" },
      ],
    },
    {
      day: "DAY 2 – BUILD, BOND & MID-JUDGING",
      events: [
        { time: "11:00 AM – 2:00 PM", activity: "Mid-Judging Round\nCore + Judges", color: "#10b981", glow: "rgba(16, 185, 129, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212619.png" },
        { time: "1:00 PM", activity: "Lunch (Included Meal 2)\nFood Team", color: "#ec4899", glow: "rgba(236, 72, 153, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/2737/2737034.png" },
        { time: "2:30 PM", activity: "Checkpoint Review\nCore + Judges", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/1067/1067561.png" },
        { time: "4:00 PM", activity: "Fun Activity\nCampaigning + Cultural", color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3069/3069172.png" },
        { time: "11:00 PM", activity: "Final Push Overnight\nAll Volunteers", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212623.png" },
      ],
    },
    {
      day: "DAY 3 – DEMO, JUDGING & CELEBRATION",
      events: [
        { time: "8:00 AM", activity: "Code Freeze\nTechnical - Submission Closed", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/2916/2916115.png" },
        { time: "8:00–9:00 AM", activity: "Submission & Setup\nTechnical + Participants", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/2906/2906274.png" },
        { time: "9:00–9:30 AM", activity: "Presentation Prep\nParticipants", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png" },
        { time: "9:30–12:30 AM", activity: "Final Judging (Top 100)\nJudges Panel", color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212619.png" },
        { time: "12:30–1:30 PM", activity: "Final Judging (Top 20)\nFinal Ranking Protocol", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png" },
        { time: "1:30 PM", activity: "Closing Ceremony\nAnchoring + Core", color: "#3b82f6", glow: "rgba(59, 130, 246, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/3212/3212608.png" },
        { time: "2:30 PM", activity: "Prize Distribution\nFinance + Core", color: "#10b981", glow: "rgba(16, 185, 129, 0.5)", img: "https://cdn-icons-png.flaticon.com/512/2618/2618254.png" },
      ],
    },
  ];

  return (
    <section id="time" ref={containerRef} className="relative flex flex-col items-center bg-transparent py-10 w-full min-h-screen overflow-hidden text-white select-none">
      
      {/* HEADER */}
      <div ref={titleRef} className="z-10 opacity-0 mb-10 px-4 text-center">
        <h2
          data-text="THE ORBIT"
          className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none"
        >
          THE ORBIT
        </h2>
        <div className="bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] mx-auto mt-2 w-24 h-[2px]"></div>
      </div>

      {/* OUTER DIV */}
      <div 
        ref={scheduleRef} 
        onMouseEnter={() => setHovered(true)} 
        onMouseLeave={() => setHovered(false)} 
        className="z-10 relative bg-black/40 opacity-0 shadow-2xl backdrop-blur-md p-2 sm:p-4 border-2 border-purple-500/50 w-[95vw] sm:w-[70vw] h-[55vh] sm:h-[65vh] sm:overflow-hidden overflow-y-auto origin-top scrollbar-hide"
      >
        <div ref={contentRef} className="relative flex flex-col items-center px-2 sm:px-4 pt-10 pb-40">
          
          {/* Animated String Background */}
          <div className="top-0 bottom-0 left-1/2 z-0 absolute w-32 h-full -translate-x-1/2" onMouseEnter={pluckString}>
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1200">
              <path ref={pathRef} d="M50,0 C80,100 20,200 50,300 C80,400 20,500 50,600 C80,700 20,800 50,900 C80,1000 20,1100 50,1200" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" fill="transparent" strokeDasharray="10,10" />
            </svg>
          </div>

          {scheduleDays.map((day, dIdx) => (
            <div key={dIdx} className="relative flex flex-col items-center opacity-0 mb-14 w-full timeline-item">
              <div className="z-20 bg-indigo-500/10 backdrop-blur-md mb-16 px-5 py-1.5 border border-indigo-500/30 rounded-full font-bold text-[11px] text-indigo-300 uppercase tracking-widest">
                {day.day}
              </div>

              {day.events.map((event, eIdx) => {
                const isLeft = eIdx % 2 === 0;
                return (
                  <div key={eIdx} className="group relative flex justify-center items-center opacity-0 mb-24 w-full timeline-item">
                    
                    {/* INFO CARDS - Adjusted width and text size */}
                    <div className={`w-[44%] sm:w-[42%] transition-all duration-500 group-hover:scale-105 absolute ${isLeft ? "right-[54%] text-right" : "left-[54%] text-left"}`}>
                      <div className="relative flex flex-col justify-center bg-slate-900/70 shadow-xl backdrop-blur-3xl p-2 sm:p-4 border border-white/10 rounded-xl min-h-[80px] overflow-hidden">
                        <div className="top-0 -left-full z-0 absolute bg-linear-to-r from-transparent via-white/10 to-transparent w-[50%] h-full skew-x-[-25deg] pointer-events-none shine-line"></div>
                        <div className="z-10 relative">
                          {/* Scaled text: text-[10px] on tiny mobile, sm:text-sm on larger screens */}
                          <p className="mb-0.5 sm:mb-1 font-black text-[10px] sm:text-sm" style={{ color: event.color }}>{event.time}</p>
                          <p className="font-bold text-[9px] text-white sm:text-xs uppercase line-clamp-2 leading-tight">
                            {event.activity.split("\n")[0]}
                          </p>
                          <p className="mt-1 sm:mt-2 font-mono text-[8px] text-gray-400 sm:text-[10px] leading-tight sm:leading-relaxed">
                            {event.activity.split("\n")[1]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CENTER ICON */}
                    <div className="z-10 relative flex justify-center items-center w-10 sm:w-14 h-10 sm:h-14">
                      <div className="relative bg-slate-800 shadow-xl border-2 border-white/20 rounded-full w-full h-full overflow-hidden animate-float" style={{ boxShadow: `0 0 15px ${event.glow}` }}>
                        <img src={event.img} className="p-2 w-full h-full object-contain" alt="icon" />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}