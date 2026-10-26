import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthContext } from "../auth/AuthContext";
import { api } from "../lib/api";
import SupportInbox from "./SupportInbox";
export default function Contact() {
  const { user } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [refresh, setRefresh] = useState(0);
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; setBusy(true); setNotice("");
    try {
      const result = await api("/contact", { method: "POST", body: Object.fromEntries(new FormData(form)) });
      setNotice(`${result.message} Reference: ${result.reference}`); form.reset(); setRefresh((value) => value + 1);
    } catch (error) { setNotice(error.message); } finally { setBusy(false); }
  }
  return <div className="min-h-screen bg-[#faf8f3]"><Navbar /><main className="mx-auto max-w-2xl px-5 py-12"><h1 className="text-3xl font-semibold text-[#164b38]">Contact us</h1><p className="my-4">Send feedback or report a problem. Please do not include passwords, bank details or identity documents.</p>
    {!user ? <p><Link to="/signin" state={{ from: "/contact" }} className="underline">Sign in</Link> to submit an enquiry.</p> : <form onSubmit={submit}><fieldset disabled={busy} className="space-y-5"><label className="block">Subject<input required name="subject" minLength={3} maxLength={150} className="mt-2 w-full rounded-xl border bg-white p-3" /></label><label className="block">Message<textarea required name="message" minLength={10} maxLength={3000} className="mt-2 min-h-40 w-full rounded-xl border bg-white p-3" /></label><button className="rounded-xl bg-[#164b38] px-5 py-3 text-white">{busy ? "Saving..." : "Submit enquiry"}</button></fieldset></form>}
    {notice && <p role="status" className="mt-6">{notice}</p>}
    {user && <SupportInbox refresh={refresh} />}
  </main><Footer /></div>;
}
