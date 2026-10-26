import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PropertyMap from "./PropertyMap";
export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [state, setState] = useState({ id: "", property: null, error: "" });
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    api(`/properties/${id}`, { signal: controller.signal }).then(({ property }) => setState({ id, property, error: "" })).catch((err) => {
      if (err.name !== "AbortError") setState({ id, property: null, error: err.message });
    });
    return () => controller.abort();
  }, [id]);
  async function send(event) {
    event.preventDefault(); setSending(true); setNotice("");
    try { const result = await api("/messages", { method: "POST", body: { propertyId: id, message } }); setNotice(result.message); setMessage(""); }
    catch (err) { setNotice(err.message); } finally { setSending(false); }
  }
  const property = state.id === id ? state.property : null;
  return <div className="min-h-screen bg-[#faf8f3] text-[#1b3025]"><Navbar /><main className="mx-auto max-w-5xl space-y-6 px-5 py-8">
    <Link to="/searchhomes" className="underline">Browse homes</Link>
    {state.id === id && state.error ? <p role="alert">{state.error}</p> : !property ? <p role="status">Loading property...</p> : <>
      <div><h1 className="text-3xl font-semibold">{property.title}</h1><p className="mt-2">{property.address?.locality}, {property.address?.city}, {property.address?.state}</p><p className="mt-3 text-2xl font-semibold text-[#164b38]">₹{Number(property.price).toLocaleString("en-IN")}{property.listingType === "Rent" ? " / month" : ""}</p></div>
      <div className="grid gap-4 sm:grid-cols-2">{property.images?.map((image) => <a key={image.publicId} href={image.url} target="_blank" rel="noreferrer"><img src={image.url} alt={property.title} className="h-72 w-full rounded-2xl object-cover" loading="lazy" /></a>)}</div>
      <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">About this property</h2><p className="mt-4 whitespace-pre-wrap">{property.description || "No description provided."}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">{[["Type", property.propertyType], ["Bedrooms", property.bedrooms], ["Bathrooms", property.bathrooms], ["Area", `${property.builtUpArea} sq ft`], ["Floor", `${property.floorNumber} of ${property.totalFloors}`], ["Balconies", property.balconies], ["Facing", property.facing || "Not specified"], ["Parking", property.parking?.replaceAll("_", " ")], ["Monthly maintenance", `₹${Number(property.maintenance || 0).toLocaleString("en-IN")}`]].map(([label, value]) => <div key={label}><dt className="text-sm text-[#59695f]">{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="mt-5">Amenities: {property.amenities?.join(", ") || "None listed"}</p><p className="mt-2">Furnishings: {property.furnishings?.join(", ") || "None listed"}</p>
      </section>
      <section className="rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Contact the owner</h2>
        {String(user?._id) === String(property.ownerId) ? <Link className="mt-4 inline-block underline" to={`/properties/${id}/edit`}>Edit your listing</Link> : !user ? <p className="mt-4"><Link to="/signin" state={{ from: `/properties/${id}` }} className="underline">Sign in</Link> to send the owner a message.</p> : <form onSubmit={send} className="mt-4 space-y-3"><label className="block">Your message<textarea required minLength={5} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border p-3" placeholder="Ask about availability or arrange a viewing." /></label><button disabled={sending} className="rounded-xl bg-[#164b38] px-5 py-3 text-white disabled:opacity-50">{sending ? "Sending..." : "Send message"}</button><p className="text-sm">Replies appear in your profile's Messages section.</p></form>}
        {notice && <p role="status" className="mt-4">{notice}</p>}
      </section>
      <details className="rounded-2xl border bg-white p-6"><summary className="cursor-pointer text-xl font-semibold">Property location</summary><PropertyLocation property={property} /></details>
    </>}
  </main><Footer /></div>;
}

function PropertyLocation({ property }) {
  const [visible, setVisible] = useState(false);
  return <div className="mt-4">{visible ? <PropertyMap properties={[property]} /> : <button onClick={() => setVisible(true)} className="rounded-xl border px-4 py-2">Load location map</button>}</div>;
}
