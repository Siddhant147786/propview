import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function ManualSearch() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState(0);
  const [propertyType, setPropertyType] = useState("Flat");
  const [purpose, setPurpose] = useState("Buy");

  function handleCity(event) {
    setCity(event.target.value);
  }

  function handleBudget(event) {
    setBudget(event.target.value);
  }
  function handlePropertyType(event) {
    setPropertyType(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const query = new URLSearchParams({
      city: city,
      budget: budget,
      propertyType: propertyType,
    });

    navigate("/searchhomes?query.toString()");
   
  }

  return (
    <>
      <form
        className="flex w-full flex-col gap-4 rounded-2xl border border-[#d9e0d8] bg-white p-5"
        onSubmit={handleSubmit}
      >
        <div>
          <button
            type="button"
            id="Buy"
            onClick={() => setPurpose("Buy")}
            className={`h-11 w-21 rounded-xl text-sm font-semibold leading-5 cursor-pointer ${
              purpose === "Buy" ? "bg-[#164b38] text-white" : "text-[#59695f]"
            }`}
          >
            Buy
          </button>

          <button
            type="button"
            id="Rent"
            onClick={() => setPurpose("Rent")}
            aria-pressed={purpose === "Rent"}
            className={`h-11 w-21 rounded-xl text-sm font-semibold leading-5 cursor-pointer ${
              purpose === "Rent" ? "bg-[#164b38] text-white" : "text-[#59695f]"
            }`}
          >
            Rent
          </button>
        </div>

        <div className="flex w-full items-end gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label
              className="text-sm font-semibold leading-5 text-[#1b3025]"
              htmlFor="city"
            >
              City
            </label>
            <input
              type="text"
              name="city"
              id="city"
              required
              value={city}
              placeholder="Enter city or locality"
              className="h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-base leading-6 text-[#1b3025]"
              onChange={handleCity}
            />
          </div>

          <div className="flex w-55 shrink-0 flex-col gap-2">
            <label
              htmlFor="budget"
              className="text-sm font-semibold leading-5 text-[#1b3025]"
            >
              Budget
            </label>
            <select
              name="budget"
              id="budget"
              required
              value={budget}
              className="h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-base leading-6 text-[#1b3025]"
              onChange={handleBudget}
            >
              <option value=""></option>
              <option value=""></option>
              <option value=""></option>
            </select>
          </div>

          <div className="flex w-55 shrink-0 flex-col gap-2">
            <label
              className="text-sm font-semibold leading-5 text-[#1b3025]"
              htmlFor="propertyType"
            >
              Property Type
            </label>
            <select
              name="propertyType"
              id="propertyType"
              value={propertyType}
              required
              className="h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-base leading-6 text-[#1b3025]"
              onChange={handlePropertyType}
            >
              <option value="Flat">Flat</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <button
            type="submit"
            className="flex h-12 w-54 shrink-0 items-center justify-center self-end rounded-xl bg-[#164b38] px-5 text-sm font-semibold leading-5 text-white cursor-pointer"
          >
            Search homes
          </button>
        </div>
        <p className="text-sm leading-5 text-[#59695f]">
          Popular areas: HSR Layout · Whitefield · Hebbal
        </p>
      </form>
    </>
  );
}
