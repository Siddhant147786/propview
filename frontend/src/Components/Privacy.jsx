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
            budget and property type. Accounts store your name, email, optional
            phone number and a password hash. We store the listings, photos,
            property addresses, conversations and support enquiries you submit.
            Website requests may also
            include technical details such as an IP address, browser
            information, request URL and access time.
          </p>
        </section>
        <h2 className="text-xl font-semibold text-[#1b3025]">
          2. How we use information
        </h2>
        <p className="mt-3 text-base leading-7 text-[#59695f]">
          We use search details to process your request, messages to respond to
          your enquiry, and technical information to operate the website and
          investigate problems. We do not sell your personal information.
        </p>
        <h2 className="text-xl font-semibold text-[#1b3025]">
          3. Service providers
        </h2>
        <p className="mt-3 text-base leading-7 text-[#59695f]">
          The website uses Google Fonts to display its typeface. Loading these
          fonts sends a request to Google, which receives your IP address.
          Google Maps and Places process requests when you use address search or
          load a map. Property photos are stored and publicly delivered through
          Cloudinary. Listings are public; unit numbers are excluded from the
          public property detail response. Conversations are available to their
          participants, and support enquiries to their sender and support administrators.
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
            uses an HTTP-only session cookie to keep you signed in for up to 24
            hours. Search filters appear in the page URL. Removing a listing
            hides it from public browsing and schedules its photos for deletion;
            its database record and related conversations remain stored.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            5. Your choices
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            You can browse without submitting a search or sending an email. To
            ask about information you have shared, request a correction or
            deletion, or raise a privacy concern, use the Contact page.
            Please avoid sending sensitive documents or passwords.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[#1b3025]">
            6. Changes to this policy
          </h2>

          <p className="mt-3 text-base leading-7 text-[#59695f]">
            We will update this page when our information practices change. The
            current version was updated on 26 October 2026. You can also find
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
