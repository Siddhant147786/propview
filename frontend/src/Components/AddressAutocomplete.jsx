import { useEffect, useRef, useState } from "react";
import { addressFromPlace, loadGooglePlaces } from "../lib/googlePlaces";

export default function AddressAutocomplete({ setValue }) {
  const host = useRef(null);
  const [message, setMessage] = useState("Loading address search...");

  useEffect(() => {
    let active = true;
    let widget;
    let selection = 0;
    async function select({ placePrediction }) {
      const current = ++selection;
      setMessage("Getting address details...");
      try {
        const place = placePrediction.toPlace();
        await place.fetchFields({ fields: ["id", "addressComponents", "formattedAddress", "location"] });
        if (!active || current !== selection) return;
        for (const [key, value] of Object.entries(addressFromPlace(place))) {
          setValue(`address.${key}`, value, { shouldDirty: true, shouldValidate: true });
        }
        setMessage("Address filled in. Please check the details and add your flat or unit number.");
      } catch {
        if (active && current === selection) setMessage("Could not get this address. Please enter the details below.");
      }
    }
    function unavailable() { if (active) setMessage("Address search is unavailable. Please enter your address below."); }
    loadGooglePlaces().then(({ PlaceAutocompleteElement }) => {
      if (!active) return;
      widget = new PlaceAutocompleteElement();
      widget.setAttribute("aria-label", "Search for your property address");
      widget.style.width = "100%";
      widget.addEventListener("gmp-select", select);
      widget.addEventListener("gmp-error", unavailable);
      host.current.appendChild(widget);
      setMessage("Search for your address, then select a suggestion.");
    }).catch(unavailable);
    return () => {
      active = false;
      widget?.removeEventListener("gmp-select", select);
      widget?.removeEventListener("gmp-error", unavailable);
      widget?.remove();
    };
  }, [setValue]);

  return <div className="mb-6">
    <p className="mb-2 text-sm font-semibold">Find your address</p>
    <div ref={host} onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }} />
    <p role="status" className="mt-2 text-sm text-[#59695f]">{message}</p>
  </div>;
}
