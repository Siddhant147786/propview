import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
export default function Neighbourhoods() {
  const [areas, setAreas] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    api("/properties/neighbourhoods", { signal: controller.signal }).then((data) => setAreas(data.areas)).catch((err) => { if (err.name !== "AbortError") setError(err.message); });
    return () => controller.abort();
  }, []);
  return <section id="neighbourhoods" className="rounded-2xl border border-[#d9e0d8] bg-white p-5">
    <h3 className="text-xl font-semibold">Neighbourhood asking prices</h3>
    <p className="mt-2 text-sm text-[#59695f]">Ranges from current PropView listings, not market valuations. Rent is shown per month.</p>
    {error && <p role="alert" className="mt-4">{error}</p>}{!areas && !error && <p className="mt-4">Loading neighbourhoods...</p>}
    {areas?.length === 0 && <p className="mt-4">Neighbourhood summaries will appear when properties are listed.</p>}
    <div className="mt-4 space-y-3">{areas?.map((area) => <Link key={JSON.stringify(area._id)} to={`/searchhomes?${new URLSearchParams({ city: area._id.locality || area._id.city, listingType: area._id.listingType })}`} className="block rounded-xl bg-[#faf8f3] p-4">
      <h4 className="font-semibold">{[area._id.locality, area._id.city].filter(Boolean).join(", ")}</h4>
      <p className="mt-1 text-sm">{area.count} {area._id.listingType === "Rent" ? "rental" : "sale"} listings · ₹{Number(area.minPrice).toLocaleString("en-IN")}–₹{Number(area.maxPrice).toLocaleString("en-IN")}{area._id.listingType === "Rent" ? " / month" : ""}</p>
    </Link>)}</div>
  </section>;
}
