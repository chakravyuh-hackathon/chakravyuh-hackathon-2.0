"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Page() {
  const teamData = [
  {
    teamName: "Technical Team",
    members: [
      { name: "Manoj Kale", role: "", image: "/Technical%20Team/Manoj%20Kale.webp" },
      { name: "Mansi Kshirsagar", role: "", image: "/Technical%20Team/Mansi%20Kshirsagar.JPG" },
      { name: "Tejashri Nagane", role: "", image: "/Technical%20Team/Tejashri%20Nagane.jpg" }
    ]
  },
  {
    teamName: "Social Media",
    members: [
      { name: "Prathamesh Hatti", role: "", image: "/Social%20media/hatti.jpeg" },
      { name: "Siraj Sayyad", role: "", image: "/Social%20media/Siraj%20Sayyad.jpg" },
    ],
  },
  {
    teamName: "Design Team",
    members: [
      { name: "Mrudula Maske", role: "", image: "/Design%20Team/design2.jpg" },
      { name: "Ankita Jadhav", role: "", image: "/Design%20Team/design1.jpeg" },
      { name: "Meghnath Khatal", role: "", image: "/Design%20Team/Megh Khatal.jpg" },
    ],
  },
  {
    teamName: "Finance Team",
    members: [
      { name: "Vishal Koli", role: "", image: "/FinanceTeam/Vishal%20.jpeg" },
      { name: "Bhagyavan Saykar", role: "", image: "/FinanceTeam/saykar.jpg" },
      { name: "Rohan Bole", role: "", image: "/FinanceTeam/Rohan%20Bole.jpg" },
      { name: "Yogita Gajare", role: "", image: "/FinanceTeam/YOGITA%20GAJARE.jpeg" },
    ],
  },
  {
    teamName: "Hardware Team",
    members: [
      { name: "Abhijit Kshirsagar", role: "", image: "/Hardware/Abhijit%20Kshirsagar.jpeg" },
      { name: "Dnyaneshwar Gond", role: "", image: "/Hardware/Dnyaneshwar%20Gond.png" },
      { name: "Vijay Abhivant", role: "", image: "/Hardware/VIJAY%20ABHIVANT.jpg" },
    ],
  },
   {
  teamName: "Food Team",
  members: [
    { name: "Rohan Savale", role: "", image: "/Food/rohan.jpeg" },
    { name: "Ashutosh Barbole", role: "", image: "/Food/ashutoshmalape.jpeg" },
    { name: "Ashutosh Malape", role: "", image: "/Food/ashutoshbarbole.jpeg" },
  ],
},
  {
    teamName: "Swag Team",
    members: [
      { name: "Gayatri Chavan", role: "", image: "/Swag%20Team/Gayatri%20Chavan.jpg" },
      { name: "Vaibhavi Rakhunde", role: "", image: "/Swag%20Team/Vai.jpeg" },
      { name: "Pragati Pawar", role: "", image: "/Swag%20Team/Pragati.jpeg" },
      { name: "Kranti Chinchole", role: "", image: "/Swag%20Team/AA.jpeg" },
      { name: "Pranali Waghmode", role: "", image: "/Swag%20Team/PRANALI%20WAGHMODE.jpg" },
      { name: "Sanika Patil", role: "", image: "/Swag%20Team/Sanika%20Patil.jpeg" },
      { name: "Sanika Vyavahare", role: "", image: "/Swag%20Team/Sanika%20Vyavahare.png" },
      { name: "Izhan Kazi", role: "", image: "/Swag%20Team/Kazi.jpg" },
      { name: "Sandip Bennisu", role: "", image: "/Swag%20Team/Sandip.jpg" },
      { name: "Tejaswini Yadav", role: "", image: "/Swag%20Team/Tejaswini%20Yadav.jpg" },
    ],
  },
  {
    teamName: "Management Team",
    members: [
      { name: "Gauri Mane", role: "", image: "/Mangment%20Team/Gauri%20Mane.jpg" },
      { name: "Samruddhi Bhosale", role: "", image: "/Mangment%20Team/Samruddhi Bhosale.jpeg" },
      { name: "Mugdha Kore", role: "", image: "/Mangment%20Team/Mugdha%20kore.jpg" },
      { name: "Neha Lomate", role: "", image: "/Mangment%20Team/Neha%20Lomate.jpg" },
      { name: "Rutuja Havale", role: "", image: "/Mangment%20Team/RUTUJA%20HAVALE.jpg" },
      { name: "Sachi Mane", role: "", image: "/Mangment%20Team/Sachi%20Mane.jpg" },
      { name: "Sakshi Patil", role: "", image: "/Mangment%20Team/Sakshi%20Patil.jpg" },
      { name: "Shruti Ingale", role: "", image: "/Mangment%20Team/Shruti%20Ingale.png" },
      { name: "Snehal Rupanwar", role: "", image: "/Mangment%20Team/SNEHAL%20RUPANWAR.jpeg" },
      { name: "Sumit Yalmar", role: "", image: "/Mangment%20Team/sumit.jpeg" },
      { name: "Sushant Shete", role: "", image: "/Mangment%20Team/SUSHANT%20SHETE.png" },
      { name: "Gaytri Kale", role: "", image: "/Mangment%20Team/Gayatri Kale.jpeg" },
    ],
  },
  {
    teamName: "Security Team",
    members: [
      { name: "Laxman Birajdar", role: "", image: "/Security/Laxman%20Birajdar.jpg" },
      { name: "Manthan Mane", role: "", image: "/Security/Manth.jpeg" },
      { name: "Apeksha Randive", role: "", image: "/Security/AAAA.jpeg" },
      { name: "Bhavana Choudhari", role: "", image: "/Security/BHARAT%20BHAVANA.jpeg" },
      { name: "Damini Ingale", role: "", image: "/Security/Damini%20Ingale.jpg" },
      { name: "Krushna Pitale", role: "", image: "/Security/KRUSHNA%20PITALE.webp" },
      { name: "Pooja Dudhanikar", role: "", image: "/Security/Pooja%20Dudhanikar.jpg" },
      { name: "Samruddhi Satpute", role: "", image: "/Security/Samruddhi.jpg" },
      { name: "Sonali Khambale", role: "", image: "/Security/Sonali%20Khambale.jpg" },
      { name: "Srushti Kale", role: "", image: "/Security/SRUSHTI%20KALE.jpg" },
      
    ],
  },
  {
    teamName: "Regi. Team",
    members: [
      { name: "Rutuja Rajmane", role: "", image: "/Reg/Rutuja%20Rajmane.jpg" },
      // { name: "Supriya Kore", role: "", image: "/Reg/Supriya%20kore.jpg" },
      { name: "Vaibhavi Kumbhar", role: "", image: "/Reg/Vaibhavi%20Kumbhar.jpg" },
         { name: "Omkar Dhekane", role: "", image: "/Reg/OMKAR.jpeg" },
         { name: "Sakshi Farad", role: "", image: "/Reg/Sakshi Farad.jpeg" },
      { name: "Vaishnavi Metkari", role: "", image: "/Reg/Vaishnavi Metkari.jpeg" }

    ]
  },
  {
    teamName: "Stage Handle",
    members: [
      { name: "Sakshi Kadam", role: "", image: "/Stage%20Handle/sssS.jpeg" },
      { name: "Shraddha Salawade", role: "", image: "/Stage%20Handle/Shraddha%20Salawade.jpg" },
      { name: "Trupti Burugute", role: "", image: "/Stage%20Handle/TRUPTI%20BURGUTE.jpg" },
      { name: "Vaishnavi Patil", role: "", image: "/Stage%20Handle/Vaishnavi%20Patil.jpg" }
    ]
  },
  {
    teamName: "Volunteer Team",
    members: [
      { name: "Anjali Shikhare", role: "", image: "/Val/ANJALI%20SHIKHARE.jpg" },
      { name: "Nikita Kanherkar", role: "", image: "/Val/Nikita%20Kanherkar.jpeg" }
    ]
  }
];

  const marqueeRef = useRef(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const allItems = teamData.flatMap((team) => [
    { isTitle: true, name: team.teamName, teamName: team.teamName },
    ...team.members.map((m) => ({ ...m, teamName: team.teamName })),
  ]);

  const displayItems = [...allItems, ...allItems];

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;
    const scrollWidth = marquee.scrollWidth / 2;
    const anim = gsap.to(marquee, {
      x: -scrollWidth,
      duration: 60,
      ease: "linear",
      repeat: -1,
    });
    return () => anim.kill();
  }, []);

  return (
    <div className="py-16 select-none"> {/* Added select-none to the whole section */}
      
      <div className="md:hidden block mb-8 px-4 text-center">
        <h2 className="min-h-[32px] font-bold text-white text-2xl">
          {hoveredMember ? hoveredMember.name : "Our Teams"}
        </h2>
        <p className="text-purple-400 text-sm">
          {hoveredMember ? hoveredMember.teamName : "Meet our experts"}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative flex bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl w-full max-w-7xl h-[160px] sm:h-[190px] md:h-[220px] overflow-hidden">
          <div className="relative flex-1 overflow-hidden">
            <div className="top-0 right-0 z-10 absolute bg-linear-to-l from-gray-900 via-gray-900/80 to-transparent w-20 sm:w-28 md:w-32 h-full" />
            <div className="top-0 left-0 z-10 absolute bg-linear-to-r from-gray-900 via-gray-900/80 to-transparent w-20 sm:w-28 md:w-32 h-full" />

            <div
              ref={marqueeRef}
              className="flex items-center gap-6 sm:gap-8 md:gap-10 w-max h-full"
            >
              {displayItems.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center min-w-[110px] sm:min-w-[130px] md:min-w-[140px] cursor-default"
                  onMouseEnter={() => !item.isTitle && setHoveredMember(item)}
                  onMouseLeave={() => setHoveredMember(null)}
                  // Prevent Right Click
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-1 flex items-center justify-center transition-transform duration-300 hover:scale-110 ${
                      item.isTitle
                        ? "bg-white text-gray-900 shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                        : "bg-linear-to-br from-purple-400 to-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    }`}
                  >
                    {item.isTitle ? (
                      <span className="px-2 font-black text-[10px] sm:text-xs md:text-sm text-center uppercase leading-tight select-none">
                        {item.name}
                      </span>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.name}
                        // pointer-events-none prevents dragging and interacting with the image
                        className="border-2 border-black sm:border-4 rounded-full w-full h-full object-cover pointer-events-none select-none"
                        // Extra security for older browsers
                        onDragStart={(e) => e.preventDefault()}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden z-20 md:flex flex-col justify-center bg-gray-900 px-6 border-white/10 border-l w-[260px]">
            <h2 className="font-bold text-white text-2xl uppercase leading-tight">
              {hoveredMember ? hoveredMember.name : "Our Teams"}
            </h2>
            <p className="mt-1 text-purple-400 text-sm">
              {hoveredMember ? hoveredMember.role : "Hover photos for details"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}