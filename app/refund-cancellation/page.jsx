export const metadata = {
  title: "Refund & Cancellation Policy",
};

export default function RefundCancellationPage() {
  return (
    <main className="relative px-6 pt-28 pb-20 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-black/60 shadow-2xl backdrop-blur-xl p-6 sm:p-10 border border-white/10 rounded-2xl">
          <h1 className="font-black text-3xl sm:text-4xl tracking-tight">Refund &amp; Cancellation Policy</h1>
          <p className="mt-2 text-white/70 text-sm">Last updated: 15 January 2026</p>

          <p className="mt-8 text-white/80 leading-relaxed">
            This policy outlines the rules for refunds and cancellations for Chakravyuh 2.0 registrations.
            By registering for the event, you agree to this policy.
          </p>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Registration Fee</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              The registration fee is <span className="font-semibold text-white">non-refundable</span> in general.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Eligible Refund Scenarios</h2>
            <ul className="space-y-2 mt-4 text-white/80 list-disc list-inside">
              <li>
                Event cancellation by the organizer (Chakravyuh Hackathon Committee).
              </li>
              <li>
                Duplicate payment (same participant/team paid more than once for the same registration).
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Refund Timeline</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              If a refund is approved, it will be processed within <span className="font-semibold text-white">5–10 working days</span>.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Refund Method</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Approved refunds will be issued to the <span className="font-semibold text-white">original payment source</span>
              (for example, the same card/bank account/UPI used during payment) via the payment gateway.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-bold text-xl">Contact for Refund Queries</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              For refund-related queries, email us at
              <a
                href="mailto:chakravyuh@coe.sveri.ac.in"
                className="ml-1 font-semibold text-purple-300 hover:text-purple-200 underline underline-offset-4"
              >
                chakravyuh@coe.sveri.ac.in
              </a>
              . Please include your registered email/phone number and payment reference/transaction ID.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
