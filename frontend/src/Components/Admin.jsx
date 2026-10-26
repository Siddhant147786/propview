import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SupportInbox from "./SupportInbox";

export default function Admin() {
  const { user } = useContext(AuthContext);
  return <div className="min-h-screen bg-[#faf8f3] text-[#1b3025]"><Navbar /><main className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="text-3xl font-semibold">Support administration</h1>
    {user?.isAdmin ? <><p className="mt-3">Review enquiries and publish responses to the sender’s Contact page.</p><SupportInbox admin /></> : <p className="mt-4" role="alert">Administrator access is required. <Link to="/profile" className="underline">Return to your profile</Link></p>}
  </main><Footer /></div>;
}
