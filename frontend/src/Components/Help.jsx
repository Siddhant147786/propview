import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Help() {
  return <div className="min-h-screen bg-[#faf8f3]"><Navbar /><main className="mx-auto max-w-3xl space-y-7 px-5 py-12"><h1 className="text-3xl font-semibold text-[#164b38]">How can we help?</h1>
    <section><h2 className="text-xl font-semibold">Finding a home</h2><p className="mt-2">Choose Buy or Rent, enter a city or locality, and set your budget. Open a listing to view photos and send the owner a message after signing in.</p><Link to="/searchhomes" className="underline">Browse properties</Link></section>
    <section><h2 className="text-xl font-semibold">Listing your property</h2><p className="mt-2">Sign in, select List Property, enter the address manually and upload 1–10 photos. Each JPG, PNG or WebP photo must be 5 MB or smaller. You can edit or remove listings from your profile.</p></section>
    <section><h2 className="text-xl font-semibold">Verification and password reset</h2><p className="mt-2">Email codes expire after 5 minutes. Wait a minute before requesting another. Check your spam folder. If a code reaches its attempt limit, request a new one.</p><Link to="/resetpassword" className="underline">Reset your password</Link></section>
    <section><h2 className="text-xl font-semibold">Messages and support</h2><p className="mt-2">Property conversations refresh automatically every 15 seconds while your profile is visible. Mark new messages as read, or close and reopen a conversation. Support responses appear under Your enquiries on the Contact page.</p><Link to="/contact" className="underline">Contact support</Link></section>
  </main><Footer /></div>;
}
