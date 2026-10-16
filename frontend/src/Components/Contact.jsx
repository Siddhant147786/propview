import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[#164b38] sm:text-4xl">
          Contact us
        </h1>
        <p className="mt-4 text-base leading-7 text-[#59695f]">
          Have a question, feedback or an issue to report? We’d like to hear
          from you.
        </p>
        <div className="mt-8 divide-y divide-[#d9e0d8] border-y border-[#d9e0d8]">
          <div className="py-7">
            <h2 className="text-sm font-semibold text-[#1b3025]">
              General enquiries
            </h2>

            <p className="mt-1 text-base text-[#164b38]">
              hello@propview.example
            </p>
          </div>
          <div className="py-5">
            <h2 className="text-sm font-semibold text-[#1b3025]">
              Privacy enquiries
            </h2>
            <p className="mt-1 text-base text-[#164b38]">
              privacy@propview.example
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-base leading-7 text-[#59695f]">
          <p>
            For a website issue, include the page name and a short description
            of what happened. This helps us understand your enquiry.
          </p>

          <p>
            Please do not send passwords, Aadhaar or PAN numbers, bank details
            or property documents.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
