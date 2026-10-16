import Footer from "./Footer";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[#164b38] sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-base leading-7 text-[#59695f]">
          This Privacy Policy explains how PropView handles information when you
          use our website or contact us.
        </p>
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            1. Information we receive
          </h2>
          <p className="mt-3 text-base leading-7 text-[#59695f]">
            When you submit a search, we receive your chosen city or locality,
            budget and property type. If you email us, we receive your email
            address and the information you include. Website requests may also
            include technical details such as an IP address, browser
            information, request URL and access time.
          </p>
        </section>
        <h2 className="text-xl font-semibold text-[#1b3025]">
          2. How we use information
        </h2>
        <p className="mt-3 text-base leading-7 text-[#59695f]">
          We use search details to process your request, messages to respond to
          your enquiry, and technicalinformation to operate the website and
          investigate problems. We do not sell your personal information.
        </p>
        <h2 className="text-xl font-semibold text-[#1b3025]">
          3. Service providers
        </h2>
        <p className="mt-3 text-base leading-7 text-[#59695f]">
          The website uses Google Fonts to display its typeface. Loading these
          fonts sends a request toGoogle, which receives your IP address.
          Hosting and email providers may process information needed to deliver
          their services. We may also disclose information when required by law.
        </p>
        <a
          href="https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html"
          className="mt-3 inline-block text-sm font-medium text-[#164b38] underline underline-offset-4"
        >
          Google Fonts privacy information
        </a>
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            4. Cookies and storage
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            PropView does not use advertising or analytics cookies. The website
            does not save your searchchoices in cookies or browser storage. We
            keep information only for as long as needed for the purpose
            described in this policy or to meet a legal obligation.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            5. Your choices
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            You can browse without submitting a search or sending an email. To
            ask about information you have shared, request a correction or
            deletion, or raise a privacy concern, contact
            privacy@propview.example. Requests are subject to applicable law.
            Please avoid sending sensitive documents or passwords.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            6. Changes to this policy
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            We will update this page when our information practices change. The
            last updated date identifies the latest version. You can also find
            our contact details on the Contact page.
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
