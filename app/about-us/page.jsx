export const metadata = {
  title: "About Us",
};

export default function AboutUsPage() {
  return (
    <main className="relative px-6 pt-28 pb-20 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-black/60 shadow-2xl backdrop-blur-xl p-6 sm:p-10 border border-white/10 rounded-2xl">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">About Us</h1>
          <p className="mt-2 text-white/70 text-sm">Chakravyuh 2.0</p>

          <section className="mt-8">
            <h2 className="font-bold text-xl">What is Chakravyuh 2.0?</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Chakravyuh 2.0 is a national-level student hackathon focused on innovation, learning, and hands-on
              engineering. The goal is to provide a platform for students to build solutions, collaborate, and receive
              mentorship.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Organized By</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Chakravyuh 2.0 is organized by the Chakravyuh Hackathon Committee at
              <span className="font-semibold text-white"> SVERI&apos;s College of Engineering (An Autonomous Institute)</span>,
              Pandharpur, Maharashtra, India (in association with the student body/IEEE Student Branch, where
              applicable).
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Purpose</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              The event is educational and non-commercial in nature, intended to promote learning, innovation, and
              community building among students.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Venue &amp; Dates</h2>
            <div className="space-y-3 mt-4 text-white/80 leading-relaxed">
              <p>
                <span className="font-semibold text-white">Venue:</span> SVERI&apos;s College of Engineering (COE),
                Pandharpur, Maharashtra
              </p>
              <p>
                <span className="font-semibold text-white">Dates:</span> 12th to 14th March 2026
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Contact</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              For official communication, email us at
              <a
                href="mailto:chakravyuh@coe.sveri.ac.in"
                className="ml-1 font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4"
              >
                chakravyuh@coe.sveri.ac.in
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
