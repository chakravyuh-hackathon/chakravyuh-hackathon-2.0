export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative px-6 pt-28 pb-20 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-black/60 shadow-2xl backdrop-blur-xl p-6 sm:p-10 border border-white/10 rounded-2xl">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-white/70 text-sm">Last updated: 15 January 2026</p>

          <p className="mt-8 text-white/80 leading-relaxed">
            This Privacy Policy explains how Chakravyuh 2.0 ("we", "our", "us") collects, uses, and
            protects participant information when you register for and participate in the hackathon.
          </p>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Information We Collect</h2>
            <div className="space-y-4 mt-4 text-white/80 leading-relaxed">
              <div>
                <h3 className="font-semibold text-white">Participant details</h3>
                <p className="mt-1">Name, email address, mobile number.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">College and team information</h3>
                <p className="mt-1">College/institution name, team name, team member details (where applicable).</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Payment information</h3>
                <p className="mt-1">
                  Payment transaction/order identifiers (e.g., transaction ID, order ID, payment status, and amount).
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Why We Collect This Information</h2>
            <ul className="space-y-2 mt-4 text-white/80 list-disc list-inside">
              <li>To process event registrations and manage participant/team entries.</li>
              <li>To communicate important updates (schedule, venue, announcements, verification).</li>
              <li>To verify identity and payment for entry confirmation.</li>
              <li>To improve participant experience and operational planning.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Data Sharing</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              We do not sell or rent your personal information. We do not share your data with third parties except
              where required to process payments through the payment gateway/service provider or where required by law.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Data Security</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              We follow reasonable security practices to protect participant data against unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100%
              secure.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Cookies</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Our website may use basic cookies or similar technologies to support essential functionality and improve
              site performance.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Contact</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              If you have any questions about this Privacy Policy, contact us at
              <a href="mailto:chakravyuh@coe.sveri.ac.in" className="ml-1 font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4">
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
