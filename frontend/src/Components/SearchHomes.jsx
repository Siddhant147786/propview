import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ManualSearch from "./ManualSearch";
import HomeCard from "./HomeCard";
import PropertyMap from "./PropertyMap";
export default function SearchHomes() {
  const [params, setParams] = useSearchParams();
  const query = params.toString();
  const [state, setState] = useState({ query: "", data: null, error: "" });
  const [mapVisible, setMapVisible] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    api(`/properties?${query}`, { signal: controller.signal }).then((data) => setState({ query, data, error: "" })).catch((error) => {
      if (error.name !== "AbortError") setState({ query, data: null, error: error.message });
    });
    return () => controller.abort();
  }, [query]);
  const current = state.query === query ? state : { data: null, error: "" };
  function change(key, value) { const next = new URLSearchParams(params); next.set(key, value); if (key !== "page") next.delete("page"); setParams(next); }
  return <div className="min-h-screen bg-[#faf8f3]"><Navbar /><main className="mx-auto max-w-6xl space-y-6 px-5 py-8">
    <h1 className="text-3xl font-semibold text-[#164b38]">Find your next home</h1>
    <ManualSearch key={query} initial={Object.fromEntries(params)} />
    {params.get("q") && <p>Search: {params.get("q")}</p>}
    <label className="flex items-center gap-3">Sort by<select value={params.get("sort") || "newest"} onChange={(e) => change("sort", e.target.value)} className="rounded-xl border bg-white p-2"><option value="newest">Newest</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option></select></label>
    {current.error ? <p role="alert" className="text-red-700">{current.error}</p> : !current.data ? <p role="status">Loading homes...</p> : <>
      <p>{current.data.total} properties found</p>
      {current.data.properties.length > 0 && <button aria-pressed={mapVisible} onClick={() => setMapVisible((value) => !value)} className="rounded-xl border bg-white px-4 py-2">{mapVisible ? "Hide map" : "Show map"}</button>}
      {mapVisible && <PropertyMap key={query} properties={current.data.properties} />}
      {!current.data.properties.length && <p>No homes match these filters. Try a different location or budget.</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{current.data.properties.map((property) => <HomeCard key={property._id} property={property} />)}</div>
      <div className="flex items-center justify-center gap-5"><button disabled={current.data.page <= 1} onClick={() => change("page", String(current.data.page - 1))} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {current.data.page} of {current.data.pages}</span><button disabled={current.data.page >= current.data.pages} onClick={() => change("page", String(current.data.page + 1))} className="rounded-xl border px-4 py-2 disabled:opacity-40">Next</button></div>
    </>}
  </main><Footer /></div>;
}
