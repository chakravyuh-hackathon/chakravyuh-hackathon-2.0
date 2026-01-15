export const metadata = {
  title: "Registration Fee & Pricing",
};

export default function PricingPage() {
  return (
    <main className="relative px-6 pt-28 pb-20 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-black/60 shadow-2xl backdrop-blur-xl p-6 sm:p-10 border border-white/10 rounded-2xl">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">Registration Fee &amp; Pricing</h1>
          <p className="mt-2 text-white/70 text-sm">Chakravyuh 2.0 | 12th to 14th March 2026 | SVERI COE, Pandharpur</p>

          <section className="mt-8">
            <h2 className="font-bold text-xl">Registration Fee (₹)</h2>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 mt-4">
              <div className="bg-white/5 p-5 border border-white/10 rounded-xl">
                <div className="text-white/70 text-sm">IEEE Member Rate</div>
                <div className="mt-1 font-black text-3xl">₹811.86</div>
                <div className="mt-2 text-white/70 text-sm">Applicable if eligibility conditions for IEEE discount are met.</div>
              </div>
              <div className="bg-white/5 p-5 border border-white/10 rounded-xl">
                <div className="text-white/70 text-sm">Non-IEEE Rate</div>
                <div className="mt-1 font-black text-3xl">₹1,013.86</div>
                <div className="mt-2 text-white/70 text-sm">Standard registration fee.</div>
              </div>
            </div>

            <p className="mt-6 text-white/80 leading-relaxed">
              <span className="font-semibold text-white">Registration fee is for event participation only.</span>
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">What Participants Get</h2>
            <ul className="space-y-2 mt-4 text-white/80 list-disc list-inside">
              <li>Access to the offline hackathon and event venue facilities.</li>
              <li>Participation and/or completion certificates (as applicable).</li>
              <li>Mentorship and guidance during the hackathon.</li>
              <li>Eligibility for prizes and recognition (subject to judging rules).</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Fee Categories</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              If at least one member of your team is an active IEEE member and provides required verification,
              the team may qualify for the IEEE member rate.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Register</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Proceed to registration here:
              <a href="/registration" className="ml-1 font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4">
                /registration
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
