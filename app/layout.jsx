import "./globals.css";
import Navbar from "./components/Navbar";
import Background from "./components/Background";
import Rocket from "./components/Rocket"


export const metadata = {
  title: "Chakravyuh 2.0",
  description: "Hackathon event platform",
  icons: {
    icon: "/Logo/LOGOOOOO.png",
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
