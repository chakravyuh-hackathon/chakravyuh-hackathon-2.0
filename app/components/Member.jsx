// "use client";

// import { useEffect, useRef } from "react";
// import gsap from "gsap";

// const organisers = [
//   { name: "Shripriya Karande", role: "Overall Lead", image: "/Head/Shree.jpg", linkedin: "https://www.linkedin.com/in/shripriya-karande-0a733a292" },
//     { name: "Shripriya Karande", role: "Overall Lead", image: "/Head/Shree.jpg", linkedin: "https://www.linkedin.com/in/shripriya-karande-0a733a292" },
//   { name: "Dipak Pawar", role: "Lead Organizer", image: "/Head/Dipak.png", linkedin: "http://www.linkedin.com/in/dipakpawar356" },
//   { name: "Onkar Bhosale", role: "Co-Lead Organizer", image: "/Head/Onkar.jpeg", linkedin: "https://www.linkedin.com/in/onkarbhosale-" },
//   { name: "Suraj Mali", role: "Technical Head", image: "/Head/suraj.jpeg", linkedin: "https://www.linkedin.com/in/suraj-s-mali/" },
//   { name: "Abhijit Birajdar", role: "Technical Head", image: "/Head/Abhijit.jpeg", linkedin: "https://www.linkedin.com/in/abhijeet-birajdar-8a3842358" },
//   { name: "Nishant Jadhav", role: "Design Head", image: "/Head/Nishu.jpeg", linkedin: "https://www.linkedin.com/in/nishant-jadhav007/" },
//    { name: "Sneha Bodake", role: "Design Head", image: "/Head/Sneha.jpeg", linkedin: "https://www.linkedin.com/in/sneha-bodake-a40024372/" },
//   { name: "Ranjeet Dhanawade", role: "Finance Head", image: "/Head/Ranj.jpg", linkedin: "https://www.linkedin.com/in/ranjeet-dhanawade-ab4ab428b" },
//   { name: "Adesh Dethe", role: "Finance Head", image: "/Head/Adu.jpg", linkedin: "https://www.linkedin.com/in/adesh-dethe-041782317/" },
//   { name: "Udayshankar Sakhare", role: "Social Media", image: "/Head/Uday.jpg", linkedin: "https://www.linkedin.com/in/udayshankar-sakhare/" },
//   { name: "Samarth Mote", role: "Food Head", image: "/Head/Sama.jpeg", linkedin: "....." },
//   { name: "Pranali Ingole ", role: "Swag Head", image: "/Head/Pranali.jpg", linkedin: "https://www.linkedin.com/in/pranalii-ingole" },
//   { name: "Shraddha Patil", role: "Treasurer", image: "/Head/Shradha.jpeg", linkedin: "https://www.linkedin.com/in/shraddha-patill" },
//   { name: "Sanchita Mhetre", role: "Hospitality Head", image: "/Head/Sanchita.jpg", linkedin: "https://www.linkedin.com/in/sanchita-mhetre-645781317" },
//   { name: "Sacchidanand Magar", role: "Campaigning Head", image: "/Head/Magar.jpg", linkedin: "https://www.linkedin.com/in/sacchidanand-magar" },
//   { name: "Shweta Dubal", role: "Office In-charge", image: "/Head/Shweta Dubal.jpeg", linkedin: "https://www.linkedin.com/in/shweta-dubal" },
// ];

// export default function Page() {
//   const cardsRef = useRef([]);
//   const gridRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
      
//       gsap.from(".page-title", {
//         opacity: 0,
//         y: -40,
//         scale: 0.9,
//         duration: 1.2,
//         ease: "power4.out",
//       });

//       cardsRef.current.forEach((card, i) => {
//         if (!card) return;
//         const img = card.querySelector(".profile-img");

//         gsap.set([card, img], {
//           willChange: "transform",
//           force3D: true,
//           transformPerspective: 1000,
//         });

        
//         gsap.from(card, {
//           opacity: 0,
//           scale: 0.8,
//           y: 50,
//           delay: i * 0.08,
//           duration: 0.8,
//           ease: "back.out(1.2)",
//         });

        
//         gsap.to(card, {
//           y: "random(-5, 5)",
//           duration: "random(3, 5)",
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//         });

    
//         card.addEventListener("mouseenter", () => {
//           gsap.to(img, { scale: 1.15, duration: 0.6, ease: "power2.out" });
//         });
//         card.addEventListener("mouseleave", () => {
//           gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
//         });
//       });
//     }, gridRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <section className="px-4 sm:px-6 py-20 min-h-screen overflow-hidden">
//       <div ref={gridRef} className="flex flex-col items-center">
//         <h2
//           data-text="ORGANISERS"
//           className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-10 mb-20 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none page-title"
//         >
//           ORGANISERS
//         </h2>

//         <div className="gap-8 sm:gap-12 grid grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
//           {organisers.map((member, i) => (
//             <div
//               key={i}
//               ref={(el) => (cardsRef.current[i] = el)}
//               className="group flex flex-col items-center text-center"
//             >
              
//               <div className="relative bg-linear-to-br from-purple-400 to-purple-800 shadow-[0_0_20px_rgba(168,85,247,0.3)] p-[2px] rounded-2xl w-32 sm:w-44 aspect-square overflow-hidden">
                
               
//                 <a 
//                   href={member.linkedin}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="z-20 absolute inset-0 flex justify-center items-center bg-purple-950/70 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300"
//                 >
//                   <div className="bg-purple-600 shadow-xl p-3 border border-purple-300 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
//                     </svg>
//                   </div>
//                 </a>

                
//                 <img
//                   src={member.image || "/default-avatar.png"}
//                   alt={member.name}
//                   className="rounded-[14px] w-full h-full object-cover select-none profile-img"
//                 />
//               </div>

              
//               <div className="mt-4">
//                 <h3 className="font-bold text-white text-sm sm:text-lg leading-tight">
//                   {member.name}
//                 </h3>
//                 <p className="opacity-80 mt-1 font-bold text-[10px] text-purple-400 sm:text-xs uppercase tracking-widest">
//                   {member.role}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }














"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const organisers = [
  { name: "Shripriya Karande", role: "Overall Lead", image: "/Head/Shree.jpg", linkedin: "https://www.linkedin.com/in/shripriya-karande-0a733a292" },
  { name: "Dipak Pawar", role: "Lead Organizer", image: "/Head/Dipak.png", linkedin: "http://www.linkedin.com/in/dipakpawar356" },
  { name: "Onkar Bhosale", role: "Co-Lead Organizer", image: "/Head/Onkar.jpeg", linkedin: "https://www.linkedin.com/in/onkarbhosale-" },
  { name: "Suraj Mali", role: "Technical Head", image: "/Head/suraj.jpeg", linkedin: "https://www.linkedin.com/in/suraj-s-mali/" },
  { name: "Abhijit Birajdar", role: "Technical Head", image: "/Head/Abhijit.jpeg", linkedin: "https://www.linkedin.com/in/abhijeet-birajdar-8a3842358" },
  { name: "Sneha Bodake", role: "Design Head", image: "/Head/Sneha.jpeg", linkedin: "https://www.linkedin.com/in/sneha-bodake-a40024372/" },
  { name: "Nishant Jadhav", role: "Design Head", image: "/Head/Nishu.jpeg", linkedin: "https://www.linkedin.com/in/nishant-jadhav007/" },
  { name: "Shweta Dubal", role: "Office In-charge", image: "/Head/Shweta Dubal.jpeg", linkedin: "https://www.linkedin.com/in/shweta-dubal" },
  { name: "Ranjeet Dhanawade", role: "Finance Head", image: "/Head/Ranj.jpg", linkedin: "https://www.linkedin.com/in/ranjeet-dhanawade-ab4ab428b" },
  { name: "Adesh Dethe", role: "Finance Head", image: "/Head/Adu.jpg", linkedin: "https://www.linkedin.com/in/adesh-dethe-041782317/" },
  { name: "Udayshankar Sakhare", role: "Social Media", image: "/Head/Uday.jpg", linkedin: "https://www.linkedin.com/in/udayshankar-sakhare/" },
  { name: "Samarth Mote", role: "Food Head", image: "/Head/Sama.jpeg", linkedin: "....." },
  { name: "Pranali Ingole ", role: "Swag Head", image: "/Head/Pranali.jpg", linkedin: "https://www.linkedin.com/in/pranalii-ingole" },
  { name: "Shraddha Patil", role: "Treasurer", image: "/Head/Shradha.jpeg", linkedin: "https://www.linkedin.com/in/shraddha-patill" },
  { name: "Sanchita Mhetre", role: "Hospitality Head", image: "/Head/Sanchita.jpg", linkedin: "https://www.linkedin.com/in/sanchita-mhetre-645781317" },
  { name: "Sacchidanand Magar", role: "Campaigning Head", image: "/Head/Magar.jpg", linkedin: "https://www.linkedin.com/in/sacchidanand-magar" },
  { name: "Prathamesh Virape ", role: "Operational Lead", image: "/Head/Prathamesh.jpg", linkedin: "https://www.linkedin.com/in/prathamesh-virape-0bb782317" },

];

export default function Page() {
  const cardsRef = useRef([]);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".page-title", {
        opacity: 0,
        y: -40,
        scale: 0.9,
        duration: 1.2,
        ease: "power4.out",
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const img = card.querySelector(".profile-img");

        gsap.set([card, img], {
          willChange: "transform",
          force3D: true,
          transformPerspective: 1000,
        });

        gsap.from(card, {
          opacity: 0,
          scale: 0.8,
          y: 50,
          delay: i * 0.08,
          duration: 0.8,
          ease: "back.out(1.2)",
        });

        gsap.to(card, {
          y: "random(-5, 5)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        card.addEventListener("mouseenter", () => {
          gsap.to(img, { scale: 1.15, duration: 0.6, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
        });
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="px-4 sm:px-6 py-20 min-h-screen overflow-hidden">
      <div ref={gridRef} className="flex flex-col items-center">
        <h2
          data-text="ORGANISERS"
          className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-10 mb-20 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none page-title"
        >
          ORGANISERS
        </h2>

        {/* GRID */}
        <div className="place-items-center gap-8 sm:gap-12 grid grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
          {organisers.map((member, i) => {
            const isLast = i === organisers.length - 1;
            const remainder = organisers.length % 4;

            return (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className={`group flex flex-col items-center text-center
                  ${isLast && remainder === 1 ? "lg:col-span-4" : ""}
                  ${isLast && remainder === 2 ? "lg:col-span-2 lg:col-start-2" : ""}
                `}
              >
                <div className="relative bg-linear-to-br from-purple-400 to-purple-800 shadow-[0_0_20px_rgba(168,85,247,0.3)] p-[2px] rounded-2xl w-32 sm:w-44 aspect-square overflow-hidden">
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="z-20 absolute inset-0 flex justify-center items-center bg-purple-950/70 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300"
                  >
                    <div className="bg-purple-600 shadow-xl p-3 border border-purple-300 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 ease-out">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </div>
                  </a>

                  <img
                    src={member.image || "/default-avatar.png"}
                    alt={member.name}
                    className="rounded-[14px] w-full h-full object-cover select-none profile-img"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-white text-sm sm:text-lg leading-tight">
                    {member.name}
                  </h3>
                  <p className="opacity-80 mt-1 font-bold text-[10px] text-purple-400 sm:text-xs uppercase tracking-widest">
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
