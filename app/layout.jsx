import "./globals.css";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Rocket from "./components/Rocket";

export const metadata = {
  title: {
    default: "Chakravyuh Hackathon 2.0 | IEEE Student Hackathon in Maharashtra, India",
    template: "%s | Chakravyuh Hackathon 2.0",
  },

  description:
    "Chakravyuh Hackathon 2.0 is an IEEE student hackathon in Maharashtra, India, hosted by SVERI College, Pandharpur. Compete, innovate, and showcase engineering skills nationally.",

  keywords: [
    // Core Branding
    "Chakravyuh",
    "Chakravyuh Hackathon",
    "Chakravyuh 2.0",
    "Chakravyuh 2",
    "Chakravyuh Hackathon 2.0",

    // IEEE
    "IEEE Chakravyuh Hackathon",
    "IEEE Hackathon India",
    "IEEE Student Hackathon",

    // Location Targeting
    "Engineering Hackathon India",
    "Student Hackathon Maharashtra",
    "Pandharpur Hackathon",
    "Gopalpur Pandharpur",
    "Pandharpur Engineering College",
    "Pandharpur College",
    "Pandharpur Technical Fest",

    // SVERI College
    "SVERI",
    "SVERI College",
    "SVERI Pandharpur",
    "SVERI Hackathon",
    "SVERI Engineering College",
    "SVERI Technical Event",

    // Technical / College Keywords
    "National Level Hackathon",
    "Engineering Hackathon",
    "College Hackathon India",
    "Technical Fest India",
    "Innovation Hackathon",
    "Coding Competition India",
    "Student Tech Event",
    "Programming Hackathon",
    "Software Hackathon India",

    // Related Institutes
    "COEP",
    "College of Engineering Pune",
    "Pandharpur Engg College",
    "Pandharpur Engineering",
    "Technical College Pandharpur",

    // Social Media Search
    "Chakravyuh Hackathon YouTube",
    "Chakravyuh Hackathon Instagram",
    "Chakravyuh Hackathon LinkedIn",
    "SVERI Hackathon YouTube",
    "SVERI Hackathon Instagram",

    // General
    "Hackathon",
    "Engineering Students Hackathon",
    "Student Innovation Event",
    "Maharashtra Hackathon",
    "India Hackathon",
    "sveri","hackethon","sveri hackathon","gopalpur", "pandharpur","solapur","march","AIML","hack","sveri hackathon registration fee","sveri hackathon registration","pandharpur hackathon","pandharpur hackathon registration","pandharpur hackathon registration fee","pandharpur hackathon registration fee",
    "sveri college","sveri college pandharpur","sveri college gopalpur","sveri college solapur","sveri college march","sveri college AIML","sveri college hack","sveri college hackathon","sveri college hackathon registration","sveri college hackathon registration fee","sveri college hackathon registration fee","sveri college hackathon registration fee",
    "chakraviv","chakravi","chakravyuh","chakravyuh hackathon","chakravyuh hackathon registration","chakravyuh hackathon registration fee","chakravyuh hackathon registration fee","chakravyuh hackathon registration fee","chakravyuh hackathon registration fee","chakravyuh hackathon registration fee","chakravyuh hackathon registration fee",
    "chakravhu","Chakravyuh","Chakravuyh","Chakravuh","Chakraviyuh","Chakraviyu","Chakravyu","Chakravhyuh","Chakravhyu","Chakravhu","Chakravuu","Chakravuhh","Chakravhuh","Chakra vyuh","Chakra vyu","Chakra vyuha","Chakraviy","Chakravuy","Chakravih","Chakravuh Hackathon","Chakravuyh Hackathon","Chakraviyuh Hackathon","Chakravhyuh Hackathon","Chakravhyu Hackathon","Chakra vyuh Hackathon","Chakra vyu Hackathon","Chakravuh Hakaton","Chakravuy Hackathon","Chakraviy Hackathon","Chakravih Hackathon","Chakravuu Hackathon","Chakravhuh Hackathon","Chakravuh 2.0","Chakravuyh 2.0","Chakraviyuh 2.0","Chakravhyuh 2.0","Chakra vyuh 2.0","Chakravuh 2","Chakravuy 2","Chakraviy 2","Chakravih 2","Chakravuu 2.0","Chakravuh SVERI","Chakravuyh SVERI","Chakraviyuh Pandharpur","Chakravhyuh Pandharpur","Chakra vyuh Hackathon SVERI","Chakravuh Hackathon Pandharpur"

  ],

  authors: [{ name: "Team Chakravyuh" }],
  creator: "Chakravyuh Hackathon Committee",
  publisher: "Chakravyuh Hackathon (IEEE Student Branch, SVERI Pandharpur)",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "https://www.chakravyuh2.com/",
  },

  icons: {
    icon: "/Logo/LOGOOOOO.png",
    shortcut: "/Logo/LOGOOOOO.png",
    apple: "/Logo/LOGOOOOO.png",
  },

  openGraph: {
    title: "Chakravyuh Hackathon 2.0 | IEEE Student Hackathon in Maharashtra",
    description:
      "Chakravyuh Hackathon 2.0 is a national-level IEEE student hackathon hosted by SVERI College, Pandharpur, Maharashtra. Innovate, code, and compete.",
    url: "https://www.chakravyuh2.com/",
    siteName: "Chakravyuh Hackathon 2.0",
    images: [
      {
        url: "https://www.chakravyuh2.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chakravyuh Hackathon 2.0 Official Banner",
      },
    ],
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    site: "@ChakravyuhHack",
    title: "Chakravyuh Hackathon 2.0 | IEEE Student Hackathon in Maharashtra",
    description:
      "Join Chakravyuh Hackathon 2.0 at SVERI College, Pandharpur – an IEEE student hackathon in Maharashtra, India.",
    images: ["https://www.chakravyuh2.com/og-image.png"],
  },

  other: {
    // Geo Targeting
    "geo.region": "IN-MH",
    "geo.placename": "Pandharpur, Maharashtra, India",
    "geo.position": "17.6805;75.3300",
    "ICBM": "17.6805, 75.3300",
    "language": "en-IN",
    "charset": "UTF-8",

    // Social Media Profiles (for Google Knowledge Panel & search suggestions)
    "sameAs": [
      "https://www.youtube.com/@Chakravyuh-Hack",
      "https://www.instagram.com/chakravyuh_hack",
      "https://www.linkedin.com/company/chakravyuh-hackathon/"
    ],

    // Profile Discovery
    "profile:youtube": "https://www.youtube.com/@Chakravyuh-Hack",
    "profile:instagram": "https://www.instagram.com/chakravyuh_hack",
    "profile:linkedin": "https://www.linkedin.com/company/chakravyuh-hackathon/"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <Background />
        <Rocket />
        {children}
      </body>
    </html>
  );
}
