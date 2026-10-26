import { Link } from "react-router-dom";
export default function HomeCard({ property }) {
  return <Link to={`/properties/${property._id}`} className="block overflow-hidden rounded-2xl border border-[#d9e0d8] bg-white text-[#1b3025] transition hover:shadow-md">
    {property.images?.[0] ? <img src={property.images[0].url} alt={property.title} loading="lazy" className="h-48 w-full object-cover" /> : <div className="flex h-48 items-center justify-center bg-[#eaf0e6]">No photo available</div>}
    <div className="p-5"><p className="text-xs text-[#59695f]">{property.listingType === "Rent" ? "For rent" : "For sale"} · {property.propertyType}</p><h3 className="mt-2 text-lg font-semibold">{property.title}</h3>
      <p className="mt-1 text-sm text-[#59695f]">{[property.address?.locality, property.address?.city].filter(Boolean).join(", ")}</p>
      <p className="my-3 text-xl font-semibold text-[#164b38]">₹{Number(property.price).toLocaleString("en-IN")}{property.listingType === "Rent" ? " / month" : ""}</p>
      <p className="text-sm">{property.bedrooms} bedrooms · {property.bathrooms} bathrooms · {property.builtUpArea} sq ft</p>
    </div>
  </Link>;
}
