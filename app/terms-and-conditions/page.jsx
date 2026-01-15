export const metadata = {
  title: "Terms & Conditions",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="relative px-6 pt-28 pb-20 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-black/60 shadow-2xl backdrop-blur-xl p-6 sm:p-10 border border-white/10 rounded-2xl">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">Terms &amp; Conditions</h1>
          <p className="mt-2 text-white/70 text-sm">Last updated: 15 January 2026</p>

          <p className="mt-8 text-white/80 leading-relaxed">
            These Terms &amp; Conditions govern your participation in Chakravyuh 2.0. By registering and/or
            participating, you agree to comply with these terms.
          </p>

          <section className="mt-10">
            <h2 className="font-bold text-xl">About the Event</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Chakravyuh 2.0 is a student-organized hackathon conducted for educational and skill-development purposes.
              The event is managed by the Chakravyuh Hackathon Committee.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Eligibility</h2>
            <ul className="space-y-2 mt-4 text-white/80 list-disc list-inside">
              <li>Participants must be students enrolled in a recognized college/university.</li>
              <li>Team size and participation rules are as specified on the registration page and official documents.</li>
              <li>Valid college ID may be required for verification at the venue.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Code of Conduct</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Participants must maintain respectful behavior and follow the event’s Code of Conduct.
              Any form of harassment, cheating, plagiarism, or misconduct can result in disqualification.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Organizer Rights</h2>
            <ul className="space-y-2 mt-4 text-white/80 list-disc list-inside">
              <li>We may modify the event schedule, rules, prize distribution, or venue logistics if necessary.</li>
              <li>We may verify participant details and payment status to confirm entry.</li>
              <li>We may disqualify any participant/team for rule violations or misconduct.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Intellectual Property</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Unless otherwise stated, participants retain ownership of the intellectual property of the projects they
              build. Participants grant the organizers a non-exclusive right to showcase project titles, demos,
              screenshots, and descriptions for event reporting and promotional purposes.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Liability Limitation</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Participation is at your own risk. Organizers are not responsible for personal injury, loss, theft, or
              damage to equipment/property during the event, to the extent permitted by law.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Final Authority</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              All decisions by the organizers and judges regarding rules, eligibility, scoring, and results are final
              and binding.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
