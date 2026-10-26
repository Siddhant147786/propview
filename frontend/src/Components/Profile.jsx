import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "./Navbar";

export default function Profile() {
  const { user, signOut } = useContext(AuthContext);
  const [properties, setProperties] = useState(null);
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/properties/mine", { credentials: "include", signal: controller.signal });
        if (response.status === 401) { navigate("/signin", { replace: true }); return; }
        if (!response.ok) throw new Error("Unable to load your properties.");
        setProperties((await response.json()).properties);
      } catch (err) {
        if (err.name !== "AbortError") setError("Unable to load your properties. Please refresh to try again.");
      }
    }
    load();
    return () => controller.abort();
  }, [navigate]);

  async function logout() {
    setLeaving(true);
    try { await signOut(); navigate("/", { replace: true }); }
    catch { setError("Could not sign out. Please try again."); setLeaving(false); }
  }

  return <div className="min-h-screen bg-[#faf8f3] text-[#1b3025]">
    <Navbar />
    <main className="mx-auto max-w-5xl px-5 py-10">
      {location.state?.published && <p role="status" className="mb-6 rounded-xl bg-[#eaf0e6] p-4">Your property has been published.</p>}
      <section className="rounded-2xl border border-[#d9e0d8] bg-white p-6">
        <h1 className="text-3xl font-semibold">Your profile</h1>
        <dl className="my-6 grid gap-4 sm:grid-cols-3">
          <div><dt className="text-sm text-[#59695f]">Name</dt><dd>{user.name}</dd></div>
          <div><dt className="text-sm text-[#59695f]">Email</dt><dd className="break-all">{user.email}</dd></div>
          <div><dt className="text-sm text-[#59695f]">Phone</dt><dd>{user.phone || "Not provided"}</dd></div>
        </dl>
        <button type="button" disabled={leaving} onClick={logout} className="rounded-xl border border-[#164b38] px-5 py-2 disabled:opacity-50">{leaving ? "Signing out..." : "Sign out"}</button>
      </section>
      {error && <p role="alert" className="my-4 text-red-700">{error}</p>}
      <div className="my-8 flex items-center justify-between gap-4"><h2 className="text-2xl font-semibold">Your properties</h2><Link to="/listproperty" className="rounded-xl bg-[#164b38] px-4 py-3 text-white">List a property</Link></div>
      {!properties && !error && <p role="status">Loading your properties...</p>}
      {properties?.length === 0 && <p>You have not listed any properties yet.</p>}
      <div className="grid gap-6 sm:grid-cols-2">
        {properties?.map((property) => <article key={property._id} className="overflow-hidden rounded-2xl border border-[#d9e0d8] bg-white">
          {property.images?.[0] && <img src={property.images[0].url} alt={property.title} className="h-52 w-full object-cover" loading="lazy" />}
          <div className="p-5"><h3 className="text-lg font-semibold">{property.title}</h3><p className="mt-2 text-sm">{[property.address?.locality, property.address?.city].filter(Boolean).join(", ")}</p><p className="mt-3 font-semibold">₹{Number(property.price).toLocaleString("en-IN")}{property.listingType === "Rent" ? " / month" : ""}</p></div>
        </article>)}
      </div>
    </main>
  </div>;
}
