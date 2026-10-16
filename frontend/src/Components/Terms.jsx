import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#1b3025]">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[#164b38] sm:text-4xl">
          Terms of Use
        </h1>

        <p className="mt-3 mb-8 text-sm text-[#59695f]">
          Last updated: 16 October 2026
        </p>

        <p className="text-base leading-7 text-[#59695f]">
          These terms explain the conditions for using PropView. Please
          read them alongside our{" "}
          <Link
            to="/privacy"
            className="text-[#164b38] underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            1. About the website
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            PropView provides property information to help you explore
            homes and neighbourhoods. Listings and prices marked as
            examples are illustrative and are not offers for sale or
            rent. PropView does not accept property bookings, deposits
            or payments.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            2. Property information
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            Property details may contain errors or become outdated.
            Verify ownership, availability, floor area, prices,
            approvals and other relevant documents independently.
            Check the relevant state RERA register where registration
            is required. Information on PropView is not legal,
            financial or investment advice.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            3. Acceptable use
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            Use the website lawfully. Do not impersonate others, share
            information you do not have permission to share, attempt
            unauthorised access, introduce malicious software or
            interfere with the website&apos;s operation.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            4. Content and external links
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            Website content, branding and third-party materials belong
            to their respective owners. Reuse is subject to permission,
            applicable licences and law. External websites have their
            own terms and privacy policies.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            5. Availability and legal rights
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            We may update or remove content and features. We do not
            guarantee uninterrupted access or the accuracy of every
            detail. Nothing in these terms excludes any right, remedy
            or liability that cannot be excluded under applicable
            Indian law.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            6. Questions and updates
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            For questions about these terms, contact
            hello@propview.example. Updates will appear on this page
            with a revised date. Our Privacy Policy explains how
            information is handled when you use the website or
            contact us.
          </p>

          <Link
            to="/contact"
            className="mt-3 inline-block text-sm font-medium text-[#164b38] underline underline-offset-4"
          >
            Contact us
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}