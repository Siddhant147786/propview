import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ManualSearch({ initial = {} }) {
  const navigate = useNavigate();
  const [city, setCity] = useState(initial.city || "");
  const [budget, setBudget] = useState(initial.budget || "");
  const [propertyType, setPropertyType] = useState(initial.propertyType || "");
  const [purpose, setPurpose] = useState(initial.listingType || "Buy");
  const [bedrooms, setBedrooms] = useState(initial.bedrooms || "");
  function submit(event) {
    event.preventDefault();
    const query = new URLSearchParams({ listingType: purpose });
    if (city.trim()) query.set("city", city.trim());
    if (budget) query.set("budget", budget);
    if (propertyType) query.set("propertyType", propertyType);
    if (bedrooms !== "") query.set("bedrooms", bedrooms);
    navigate(`/searchhomes?${query}`);
  }
  return <form onSubmit={submit} className="rounded-2xl border border-[#d9e0d8] bg-white p-5">
    <div className="mb-5 flex gap-2">{["Buy", "Rent"].map((type) => <button key={type} type="button" aria-pressed={purpose === type} onClick={() => { setPurpose(type); setBudget(""); }} className={`rounded-xl px-6 py-3 ${purpose === type ? "bg-[#164b38] text-white" : "bg-[#eaf0e6] text-[#164b38]"}`}>{type}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="text-sm font-semibold">City or locality<input value={city} onChange={(e) => setCity(e.target.value)} maxLength={200} placeholder="Any location" className="mt-2 h-12 w-full rounded-xl border p-3" /></label>
      <label className="text-sm font-semibold">Maximum budget {purpose === "Rent" ? "(monthly)" : ""}<select value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-2 h-12 w-full rounded-xl border p-3"><option value="">Any budget</option>{(purpose === "Rent" ? [10000, 20000, 30000, 50000, 100000] : [2500000, 5000000, 7500000, 10000000, 20000000]).map((amount) => <option key={amount} value={amount}>₹{amount.toLocaleString("en-IN")}</option>)}</select></label>
      <label className="text-sm font-semibold">Property type<select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="mt-2 h-12 w-full rounded-xl border p-3"><option value="">Any type</option>{["Flat", "Villa", "Plot", "FarmHouse", "Other"].map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
      <label className="text-sm font-semibold">Bedrooms<select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} className="mt-2 h-12 w-full rounded-xl border p-3"><option value="">Any</option>{[0, 1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value === 0 ? "Studio / no bedrooms" : value}</option>)}</select></label>
      <button className="h-12 self-end rounded-xl bg-[#164b38] px-5 text-white">Search homes</button>
    </div>
  </form>;
}
