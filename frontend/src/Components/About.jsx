import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function About() {
  return <div className="min-h-screen bg-[#faf8f3] text-[#1b3025]"><Navbar />
    <main className="mx-auto max-w-3xl space-y-8 px-5 py-12">
      <h1 className="text-4xl font-semibold text-[#164b38]">A clearer way to find your next home.</h1>
      <p className="text-lg leading-8">PropView brings property listings and neighbourhood asking prices together. Find homes for sale or rent, explore their locations, and speak directly with owners.</p>
      <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-semibold">For home seekers</h2><p className="my-4 leading-7">Search by city, budget, bedrooms and property type. Browse photos and amenities, then sign in to ask about availability or arrange a viewing.</p><Link to="/searchhomes" className="underline">Explore available homes</Link></section>
      <section className="rounded-2xl border bg-white p-6"><h2 className="text-2xl font-semibold">For property owners</h2><p className="my-4 leading-7">Publish your property with photos and an address. Update your listing from your profile and keep your conversations in one place.</p><Link to="/listproperty" className="underline">List a property</Link></section>
      <section><h2 className="text-2xl font-semibold">Information you can put in context</h2><p className="mt-4 leading-7">Neighbourhood ranges reflect asking prices from current listings. They are not independent valuations. Confirm availability and property details with the owner before making a decision. PropView does not collect booking deposits or property payments.</p></section>
      <Link to="/contact" className="inline-block rounded-xl bg-[#164b38] px-5 py-3 text-white">Contact support</Link>
    </main><Footer /></div>;
}
