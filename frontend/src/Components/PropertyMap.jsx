import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleLibrary } from "../lib/googlePlaces";

export default function PropertyMap({ properties }) {
  const host = useRef(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const located = useMemo(() => properties.filter(({ address }) => Number.isFinite(address?.latitude) && Number.isFinite(address?.longitude)), [properties]);
  useEffect(() => {
    if (!located.length || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY) return;
    let active = true;
    let map;
    let info;
    const markers = [];
    const listeners = [];
    const unavailable = () => { if (active) setError("The map is unavailable. You can still browse all the listings below."); };
    window.addEventListener("propview-map-error", unavailable);
    async function initialize() {
      try {
        const [{ Map, InfoWindow }, { AdvancedMarkerElement }, { LatLngBounds }] = await Promise.all([
          loadGoogleLibrary("maps"), loadGoogleLibrary("marker"), loadGoogleLibrary("core"),
        ]);
        if (!active) return;
        map = new Map(host.current, { center: { lat: located[0].address.latitude, lng: located[0].address.longitude }, zoom: 14, mapId: import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID", gestureHandling: "cooperative", streetViewControl: false, mapTypeControl: false });
        info = new InfoWindow();
        const bounds = new LatLngBounds();
        for (const property of located) {
          const position = { lat: property.address.latitude, lng: property.address.longitude };
          const marker = new AdvancedMarkerElement({ map, position, title: property.title });
          markers.push(marker); bounds.extend(position);
          listeners.push(marker.addListener("click", () => {
            const content = document.createElement("div");
            const link = document.createElement("a");
            link.href = `/properties/${property._id}`; link.textContent = property.title;
            link.style.textDecoration = "underline";
            const price = document.createElement("p");
            price.textContent = `₹${Number(property.price).toLocaleString("en-IN")}${property.listingType === "Rent" ? " / month" : ""}`;
            content.append(link, price); info.setContent(content); info.open({ map, anchor: marker });
          }));
        }
        if (located.length > 1) map.fitBounds(bounds, 40);
        setReady(true);
      } catch { unavailable(); }
    }
    void initialize();
    return () => {
      active = false; window.removeEventListener("propview-map-error", unavailable);
      listeners.forEach((listener) => listener.remove());
      markers.forEach((marker) => { marker.map = null; });
      info?.close();
    };
  }, [located]);
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) return <p>Map view is currently unavailable.</p>;
  if (!located.length) return <p>These listings do not have map coordinates yet. Addresses are available on each property page.</p>;
  return <section aria-label="Property locations" className="space-y-3">
    <p className="text-sm text-[#59695f]">Showing {located.length} of {properties.length} listings on this page. Locations are supplied by property owners.</p>
    {error ? <p role="alert">{error}</p> : !ready && <p role="status">Loading map...</p>}
    <div ref={host} className={`h-96 w-full rounded-2xl border ${error ? "hidden" : ""}`} />
  </section>;
}
