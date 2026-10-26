let loading;

export function loadGooglePlaces() {
  if (window.google?.maps?.importLibrary) return window.google.maps.importLibrary("places");
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!key) { reject(new Error("Address search is unavailable. Please enter your address below.")); return; }
      const script = document.createElement("script");
      const timer = window.setTimeout(() => fail(), 15000);
      function fail() {
        window.clearTimeout(timer);
        script.remove();
        delete window.propViewGoogleReady;
        reject(new Error("Address search could not load. Please enter your address below."));
      }
      window.propViewGoogleReady = () => {
        window.clearTimeout(timer);
        delete window.propViewGoogleReady;
        window.google.maps.importLibrary("places").then(resolve, reject);
      };
      const params = new URLSearchParams({ key, v: "weekly", loading: "async", callback: "propViewGoogleReady" });
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;
      script.onerror = fail;
      document.head.appendChild(script);
    }).catch((error) => { loading = undefined; throw error; });
  }
  return loading;
}

export function addressFromPlace(place) {
  const parts = place.addressComponents || [];
  const part = (type, short = false) => {
    const item = parts.find((component) => component.types.includes(type));
    return (short ? item?.shortText : item?.longText) || "";
  };
  return {
    googlePlaceId: place.id || "",
    formattedAddress: place.formattedAddress || "",
    countryCode: part("country", true),
    state: part("administrative_area_level_1"),
    city: part("locality") || part("postal_town") || part("administrative_area_level_3") || part("administrative_area_level_2"),
    locality: part("sublocality_level_1") || part("sublocality") || part("neighborhood"),
    pincode: part("postal_code"),
    buildingName: part("premise"),
    addressLine: [part("street_number"), part("route")].filter(Boolean).join(" "),
    latitude: place.location?.lat() ?? null,
    longitude: place.location?.lng() ?? null,
  };
}
