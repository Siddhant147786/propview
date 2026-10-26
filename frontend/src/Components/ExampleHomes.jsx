import { useEffect, useState } from "react";
import { api } from "../lib/api";
import HomeCard from "./HomeCard";
export default function ExampleHomes() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    api("/properties?limit=3", { signal: controller.signal }).then(setData).catch((err) => { if (err.name !== "AbortError") setError(err.message); });
    return () => controller.abort();
  }, []);
  return <div className="space-y-4"><h2 className="text-2xl font-semibold">Recently listed homes</h2>{error && <p role="alert">{error}</p>}{!data && !error && <p>Loading listings...</p>}{data?.properties.length === 0 && <p>No properties have been listed yet.</p>}{data?.properties.map((property) => <HomeCard key={property._id} property={property} />)}</div>;
}
