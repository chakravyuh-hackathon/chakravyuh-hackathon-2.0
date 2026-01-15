export const metadata = {
  title: "Contact Us",
};

export default function ContactUsPage() {
  return (
    <main className="relative px-6 pt-28 pb-20 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-black/60 shadow-2xl backdrop-blur-xl p-6 sm:p-10 border border-white/10 rounded-2xl">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">Contact Us</h1>
          <p className="mt-2 text-white/70 text-sm">Customer support &amp; grievance redressal</p>

          <section className="mt-8">
            <h2 className="font-bold text-xl">Official Email</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              <a
                href="mailto:chakravyuh@coe.sveri.ac.in"
                className="font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4"
              >
                chakravyuh@coe.sveri.ac.in
              </a>
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Phone</h2>
            <div className="space-y-2 mt-3 text-white/80">
              <p>
                <a href="tel:9527747796" className="hover:text-white underline underline-offset-4">
                  +91 9527747796
                </a>
              </p>
              <p>
                <a href="tel:8669233747" className="hover:text-white underline underline-offset-4">
                  +91 8669233747
                </a>
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Address / Venue</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              SVERI&apos;s College of Engineering (COE)<br />
              Pandharpur - 413304<br />
              Solapur District, Maharashtra, India
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Organizer</h2>
            <p className="mt-3 text-white/80 leading-relaxed">
              Chakravyuh Hackathon Committee (Student Organizers)
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
