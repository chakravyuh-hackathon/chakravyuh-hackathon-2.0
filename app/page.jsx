import Home from "./components/Home";
import About from "./components/About";
import Journey from "./components/Journey";
import FAQ from "./components/FAQ";
import Price from "./components/Price";
import Time from "./components/Time";
import Track from "./components/Track";
import Venue from "./components/Venue";
import Member from "./components/Member";
import Member2 from "./components/Member1"
import Spons from "./components/Spons";
import Man from "./components/AstroCompanion";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div>
      <Home />

      <About />
      <Journey />
      <Price />
      <Track />
      <Time />
      <Spons />
      <Member />
      <Member2 />
      <FAQ />
      <Venue />
  
      <Man />
      <Footer />
    </div>
  );
}
