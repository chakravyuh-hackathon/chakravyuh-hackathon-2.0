"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ReactTyped } from "react-typed";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
const faqData = [
  // --- REGISTRATION ---
  { 
    category: "Registration", 
    question: "🌐 Who can participate in Chakravyuh 2.0?", 
    answer: "Chakravyuh 2.0 is a 36-hour National Level Hackathon open to all university students enrolled in any academic discipline across India. Whether you are a beginner or an experienced developer, we welcome you to join the battle for brilliance." 
  },
  { 
    category: "Registration", 
    question: "🎫 Is there a registration fee?", 
    answer: "Yes, there is a fee of ₹1000 per team for IEEE Members and ₹1200 per team for Non-IEEE Members. If at least one member of your team is an active IEEE member, your entire team qualifies for the discounted rate 20% per Team." 
  },
  { 
    category: "Registration", 
    question: "🤝 What should be the team size?", 
    answer: "Victory is a team effort! You can participate in teams ranging from 2 to 4 members." 
  },
  { 
    category: "Registration", 
    question: "🌍 Are team members from other colleges allowed?", 
    answer: "Yes, Chakravyuh 2.0 welcomes participants from diverse backgrounds and even allows team members from different colleges to join forces." 
  },

  // --- PARTICIPATION ---
  { 
    category: "Participation", 
    question: "🤖 What if this is my first hackathon?", 
    answer: "Congratulations on considering your first hackathon! Chakravyuh 2.0 is a great opportunity for beginners, as we provide expert sessions and 24/7 guidance from mentors to help you execute your ideas." 
  },
  { 
    category: "Participation", 
    question: "🎒 What should I bring to the venue?", 
    answer: "You should bring your tech gear (laptop, chargers), a valid college ID, and an extension cord. For comfort during power naps, bring a chadar (thin blanket) and a small pillow." 
  },
  { 
    category: "Participation", 
    question: "🛠️ What if I am participating in the Hardware track?", 
    answer: "Hardware/IoT teams should bring their own microcontrollers (Arduino/ESP32), sensors, and tools like glue guns." 
  },
  { 
    category: "Participation", 
    question: "🕒 Can I start my project early?", 
    answer: "No. To keep the competition fair, all code and design work must be executed within the 36-hour window. You can brainstorm and research beforehand, but the building starts when the clock starts." 
  },
  { 
    category: "Participation", 
    question: "🚆 Will travel reimbursement be provided?", 
    answer: "No, Chakravyuh 2.0 does not offer travel reimbursement for participants in offline mode. Participants are responsible for their own travel expenses." 
  },

  // --- EVENT DETAILS ---
  { 
    category: "Event Details", 
    question: "📅 When and where is the hackathon taking place?", 
    answer: "The hackathon will be held from 09 to 11th March 2026 and is organized by SVERI's College of Engineering, Pandharpur." 
  },
  { 
    category: "Event Details", 
    question: "💡 What are the themes for this year?", 
    answer: "You can innovate across 9 diverse tracks: Tech Frontiers (Web Dev, AI, Cybersecurity, Fintech), Social Impact (Healthtech, Edtech, Environment), and Hardware & Creative (IoT, Open Innovation)." 
  },
  { 
    category: "Event Details", 
    question: "📊 What data sources should I use?", 
    answer: "You are encouraged to use publicly available open-source datasets from platforms like Kaggle and Project Vaani. Please avoid using any copyrighted datasets." 
  },
  { 
    category: "Event Details", 
    question: "🍕 Will food and internet be provided?", 
    answer: "Absolutely! We provide high-speed WiFi and full catering, including breakfast, lunch, dinner, midnight snacks, and plenty of energy drinks." 
  },
  { 
    category: "Event Details", 
    question: "😴 Can I sleep during the hackathon?", 
    answer: "Absolutely! Sleeping is optional, and we have designated quiet zones for power naps between your coding sessions." 
  },
  { 
    category: "Event Details", 
    question: "🆘 What if my code breaks at 3 AM?", 
    answer: "Git is your best friend! We also have mentors available 24/7 (who run on the same caffeine as you) to help debug your code." 
  },

  // --- PRIZES ---
  { 
    category: "Prizes", 
    question: "🏆 What can I win?", 
    answer: "Beyond the glory, we have a total prize pool of ₹1,00,000+, which includes cash prizes, special sponsored awards, and exclusive goodies/swag." 
  },
  { 
    category: "Prizes", 
    question: "🔍 How will my project be judged?", 
    answer: "Submissions are evaluated based on Technical Complexity, Innovation, Impact, and Design & UX, with each pillar accounting for 25% of the score." 
  },
  { 
    category: "Prizes", 
    question: "🚀 What will I get after attending?", 
    answer: "CHAKRAVYUH 2.0 offers a platform to engage in workshops, network with industry professionals, develop hands-on projects, and join a vibrant community of innovators." 
  },
  {  category: "Prizes", 
  question: "🎯 Who is eligible to win special category prizes?", 
  answer: "All registered teams are automatically considered for special category awards such as Best GenAI Project and Best Girls Team, provided their project aligns with the specific category criteria." 
},
{ 
  category: "Prizes", 
  question: "💡 Can a team win more than one prize?", 
  answer: "No. Each team is allowed to win only one prize in the event to ensure equal opportunity for all participating teams."
}

,
{ 
  category: "Prizes", 
  question: "📜 Will winners receive certificates and recognition?", 
  answer: "Yes, all winners will receive official certificates, trophies, and public recognition on CHAKRAVYUH 2.0’s digital platforms. Participants will also receive certificates of participation." 
},

{ 
  category: "Prizes", 
  question: "🏅 When and how will prizes be distributed?", 
  answer: "Prizes will be distributed during the closing ceremony of the hackathon. Cash prizes and special awards will be handed over directly to the winning teams, along with certificates and sponsor goodies." 
}

];

const categories = ["Registration", "Participation", "Event Details", "Prizes"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("Registration");
  const [openAccordion, setOpenAccordion] = useState(null);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const gridRef = useRef(null);
  const bubbleRef = useRef(null);

  // 🚀 Initial Entrance Animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      if (titleRef.current) {
        tl.fromTo(titleRef.current, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8 });
      }

      if (buttonContainerRef.current?.children?.length) {
        tl.fromTo(
          buttonContainerRef.current.children,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 },
          "-=0.4"
        );
      }

      const cards = gridRef.current?.querySelectorAll(".faq-card");
      if (cards?.length) {
        tl.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, "-=0.3");
      }

      if (bubbleRef.current) {
        tl.fromTo(bubbleRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" }, "-=0.2");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ✨ Animate on Category Change
  useEffect(() => {
    if (!gridRef.current) return;

    if (bubbleRef.current) {
      gsap.fromTo(bubbleRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" });
    }

    const cards = gridRef.current.querySelectorAll(".faq-card");
    if (cards.length) {
      gsap.fromTo(cards, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 });
    }
  }, [activeCategory]);

  const filteredFaqs = faqData.filter(faq => faq.category === activeCategory);

  return (
    <section ref={sectionRef} id="faq" className="relative p-4 md:p-8 min-h-screen overflow-hidden text-white">
      <div className="mb-12 text-center">
        <h2
  ref={titleRef}
  data-text="FAQ"
  className="before:top-1/2 before:left-1/2 z-10 before:z-[-1] before:absolute relative before:opacity-15 mb-12 pt-16 md:pt-20 font-black text-purple-500 before:text-white text-4xl sm:text-5xl before:text-5xl sm:before:text-6xl md:text-7xl md:before:text-8xl text-center uppercase before:content-[attr(data-text)] before:tracking-[0.22em] tracking-tight before:whitespace-nowrap before:-translate-x-1/2 before:-translate-y-1/2 before:pointer-events-none /* Background text sizes */"
>
  FAQ
</h2>
        <div ref={bubbleRef} className="h-8">
          <ReactTyped
            strings={["Secure Connection established.", "Mission Intel decoded."]}
            typeSpeed={50}
            backSpeed={30}
            loop
            className="font-mono text-gray-400 text-xs uppercase tracking-widest"
          />
        </div>
      </div>

      <div ref={buttonContainerRef} className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-xs font-bold border-2 transition-all ${
              activeCategory === cat ? "bg-purple-600 border-purple-400 text-white" : "bg-white/5 border-white/10 text-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="items-start gap-4 grid grid-cols-1 md:grid-cols-2 mx-auto max-w-6xl">
        {filteredFaqs.map((item, index) => (
          <div 
            key={index} 
            className="bg-slate-900/40 p-6 border border-white/10 rounded-2xl faq-card"
            onMouseEnter={() => setOpenAccordion(index)}
            onMouseLeave={() => setOpenAccordion(null)}
          >
            <h2 className="mb-2 font-bold text-lg">{item.question}</h2>
            {openAccordion === index && (
              <p className="text-gray-400 text-sm">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}