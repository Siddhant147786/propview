import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function AiCard() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return <form onSubmit={(event) => { event.preventDefault(); navigate(`/searchhomes?${new URLSearchParams({ q: query.trim() })}`); }} className="w-full shrink-0 rounded-2xl bg-[#eaf0e6] p-6 lg:w-96">
    <h2 className="text-lg font-semibold text-[#164b38]">Quick property search</h2>
    <p className="mt-3 text-sm text-[#59695f]">Search by city, bedrooms and budget. Try “2 BHK flats in Pune under 80 lakh”.</p>
    <label className="mt-3 block text-sm">What are you looking for?<textarea required maxLength={200} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="2 BHK flats in Pune" className="mt-2 block h-20 w-full rounded-xl bg-white p-3" /></label>
    <button className="mt-3 rounded-xl bg-[#164b38] px-5 py-3 text-white">Search listings</button>
  </form>;
}
