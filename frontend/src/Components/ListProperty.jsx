import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AddressAutocomplete from "./AddressAutocomplete";

export default function ListProperty() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm({
    defaultValues: {
      furnishings: [],
      amenities: [],
    },
  });

  async function onSubmit(data) {
    setSubmitError("");
    const { images, ...propertyData } = data;
    const formData = new FormData();
    formData.append("propertyData", JSON.stringify(propertyData));
    for (const image of images) formData.append("images", image);
    try {
      const response = await fetch("/api/properties", {
        method: "POST", credentials: "include", body: formData,
      });
      if (response.status === 401) {
        navigate("/signin", { state: { from: "/listproperty" } });
        return;
      }
      const result = await response.json();
      if (!response.ok) { setSubmitError(result.message || "Could not publish the property."); return; }
      navigate("/profile", { replace: true, state: { published: true } });
    } catch {
      setSubmitError("Unable to confirm publication. Check your profile before trying again.");
    }
  }

  return (

     <div className="min-h-screen bg-[#faf8f3] text-[#1b3025]">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 border-b border-[#d9e0d8] px-5 py-5 sm:px-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-[#164b38] [&>span]:text-[#92a984]"
        >
          PropView<span>.</span>
        </Link>
        <Link
          to="/"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-[#59695f] transition hover:bg-[#eaf0e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164b38]"
        >
          Back to home ↗
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-9 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#647a5f]">
            A new home, a new beginning
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Tell us about your property.
          </h1>
          <p className="mt-4 text-base leading-7 text-[#59695f]">
            From the little details to the perfect location, help people picture
            their next home.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} onChange={(event) => {
          // Manual address edits invalidate coordinates from an earlier suggestion.
          if (["address.city", "address.state", "address.pincode", "address.locality", "address.addressLine", "address.buildingName"].includes(event.target.name)) {
            setValue("address.googlePlaceId", "");
            setValue("address.formattedAddress", "");
            setValue("address.latitude", null);
            setValue("address.longitude", null);
          }
        }}>
          <fieldset disabled={isSubmitting} className="min-w-0">
          <section
            className="mb-6 rounded-2xl border border-[#d9e0d8] bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="section-01"
          >
            <div className="mb-7 flex items-start gap-4 border-b border-[#edf0e9] pb-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e6] text-sm font-bold text-[#164b38]">
                01
              </span>
              <div>
                <h2 className="text-lg font-semibold" id="section-01">
                  The basics
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#59695f]">
                  Introduce your property and what makes it special.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="min-w-0 sm:col-span-2">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  {...register("title")}
                  id="title"
                  required
                  minLength={10}
                  maxLength={150}
                />
              </div>

              <div className="min-w-0 sm:col-span-2">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15 min-h-32 resize-y"
                  {...register("description")}
                  id="description"
                  rows={4}
                  minLength={10}
                  maxLength={5000}
                  placeholder="Describe the space and what makes it special."
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="listingType"
                >
                  Listing type
                </label>
                <select
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="listingType"
                  {...register("listingType")}
                >
                  <option value="Buy">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="propertyType"
                >
                  Property Type
                </label>
                <select
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="propertyType"
                  {...register("propertyType")}
                >
                  <option value="Flat">Flat</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="FarmHouse">Farmhouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </section>
          <section
            className="mb-6 rounded-2xl border border-[#d9e0d8] bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="section-02"
          >
            <div className="mb-7 flex items-start gap-4 border-b border-[#edf0e9] pb-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e6] text-sm font-bold text-[#164b38]">
                02
              </span>
              <div>
                <h2 className="text-lg font-semibold" id="section-02">
                  Space & layout
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#59695f]">
                  The dimensions and everyday details of your property.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="bedrooms"
                >
                  Bedrooms
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="bedrooms"
                  required
                  type="number"
                  min="0"
                  step="1"
                  {...register("bedrooms", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="bathrooms"
                >
                  Bathrooms
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="bathrooms"
                  required
                  type="number"
                  min="0"
                  step="1"
                  {...register("bathrooms", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="balconies"
                >
                  Balconies
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="balconies"
                  required
                  type="number"
                  min="0"
                  step="1"
                  {...register("balconies", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="builtUpArea"
                >
                  Built-up Area (sq ft)
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="builtUpArea"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  {...register("builtUpArea", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="floorNumber"
                >
                  Floor Number (0 = Ground Floor)
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="floorNumber"
                  required
                  type="number"
                  min="0"
                  step="1"
                  {...register("floorNumber", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="totalFloors"
                >
                  Total Floors Above Ground
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="totalFloors"
                  required
                  type="number"
                  min="0"
                  step="1"
                  {...register("totalFloors", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="propertyAge"
                >
                  Property Age (years)
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="propertyAge"
                  type="number"
                  min="0"
                  step="1"
                  {...register("propertyAge", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="facing"
                >
                  Facing Direction
                </label>
                <select
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="facing"
                  {...register("facing")}
                >
                  <option value="">Select direction</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="parking"
                >
                  Parking
                </label>
                <select
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="parking"
                  {...register("parking")}
                >
                  <option value="none">No parking</option>
                  <option value="two_wheeler">Two-wheeler parking</option>
                  <option value="four_wheeler">Four-wheeler parking</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          </section>
          <section
            className="mb-6 rounded-2xl border border-[#d9e0d8] bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="section-03"
          >
            <div className="mb-7 flex items-start gap-4 border-b border-[#edf0e9] pb-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e6] text-sm font-bold text-[#164b38]">
                03
              </span>
              <div>
                <h2 className="text-lg font-semibold" id="section-03">
                  Pricing
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#59695f]">
                  Make the cost of your property easy to understand.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="price"
                >
                  Price (₹ — total for sale, monthly for rent)
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="price"
                  required
                  type="number"
                  min="1"
                  step="1"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="maintenance"
                >
                  Monthly Maintenance (₹)
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="maintenance"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={0}
                  {...register("maintenance", { valueAsNumber: true })}
                />
              </div>
            </div>
          </section>
          <section
            className="mb-6 rounded-2xl border border-[#d9e0d8] bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="section-04"
          >
            <div className="mb-7 flex items-start gap-4 border-b border-[#edf0e9] pb-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e6] text-sm font-bold text-[#164b38]">
                04
              </span>
              <div>
                <h2 className="text-lg font-semibold" id="section-04">
                  Comforts & extras
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#59695f]">
                  Select everything included with your property.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <h3 className="col-span-full text-sm font-semibold">
                Furnishings included
              </h3>

              {["Bed", "Wardrobe", "Sofa", "Air conditioner"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[#d9e0d8] px-4 transition hover:border-[#9fb398] has-[:checked]:border-[#164b38] has-[:checked]:bg-[#edf4e9]"
                  >
                    <input
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[#164b38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164b38]"
                      id={`furnishing-${index}`}
                      type="checkbox"
                      value={item}
                      {...register("furnishings")}
                    />
                    <label
                      className="flex-1 cursor-pointer py-4 text-sm"
                      htmlFor={`furnishing-${index}`}
                    >
                      {item}
                    </label>
                  </div>
                ),
              )}

              <h3 className="col-span-full text-sm font-semibold">Amenities</h3>

              {["Lift", "Security", "Gym", "Swimming pool", "Power backup"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[#d9e0d8] px-4 transition hover:border-[#9fb398] has-[:checked]:border-[#164b38] has-[:checked]:bg-[#edf4e9]"
                  >
                    <input
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[#164b38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164b38]"
                      id={`amenity-${index}`}
                      type="checkbox"
                      value={item}
                      {...register("amenities")}
                    />
                    <label
                      className="flex-1 cursor-pointer py-4 text-sm"
                      htmlFor={`amenity-${index}`}
                    >
                      {item}
                    </label>
                  </div>
                ),
              )}
            </div>
          </section>
          <section
            className="mb-6 rounded-2xl border border-[#d9e0d8] bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="section-05"
          >
            <div className="mb-7 flex items-start gap-4 border-b border-[#edf0e9] pb-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e6] text-sm font-bold text-[#164b38]">
                05
              </span>
              <div>
                <h2 className="text-lg font-semibold" id="section-05">
                  The neighbourhood
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#59695f]">
                  Add the address and details that help people find your
                  property.
                </p>
              </div>
            </div>
            <AddressAutocomplete setValue={setValue} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="city"
                  required
                  type="text"
                  {...register("address.city")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="state"
                >
                  State
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="state"
                  required
                  type="text"
                  {...register("address.state")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="pincode"
                >
                  Pincode
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="pincode"
                  type="text"
                  inputMode="numeric"
                  {...register("address.pincode")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="buildingName"
                >
                  Building / Society Name
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="buildingName"
                  type="text"
                  {...register("address.buildingName")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="unitNumber"
                >
                  Flat / Unit Number
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="unitNumber"
                  type="text"
                  {...register("address.unitNumber")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="addressLine"
                >
                  Street / Road
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="addressLine"
                  type="text"
                  {...register("address.addressLine")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="locality"
                >
                  Locality / Area
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="locality"
                  type="text"
                  placeholder="For example, Baner"
                  {...register("address.locality")}
                />
              </div>

              <div className="min-w-0">
                <label
                  className="mb-2 block text-sm font-semibold"
                  htmlFor="landmark"
                >
                  Landmark (optional)
                </label>
                <input
                  className="w-full rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] outline-none transition placeholder:text-[#879187] hover:border-[#aabaaa] focus:border-[#164b38] focus:ring-2 focus:ring-[#164b38]/15"
                  id="landmark"
                  type="text"
                  placeholder="For example, near Central Park"
                  {...register("address.landmark")}
                />
              </div>
            </div>
          </section>
          <section
            className="mb-6 rounded-2xl border border-[#d9e0d8] bg-white p-5 shadow-sm sm:p-8"
            aria-labelledby="section-06"
          >
            <div className="mb-7 flex items-start gap-4 border-b border-[#edf0e9] pb-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf0e6] text-sm font-bold text-[#164b38]">
                06
              </span>
              <div>
                <h2 className="text-lg font-semibold" id="section-06">
                  Property photos
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#59695f]">
                  Help people picture your property with photos of the space.
                </p>
              </div>
            </div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="images">
              Select images
            </label>
            <input
              id="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              aria-describedby="images-help"
              className="w-full cursor-pointer rounded-xl border border-[#d9e0d8] bg-[#fdfefc] px-4 py-3 text-sm text-[#1b3025] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#eaf0e6] file:px-4 file:py-2 file:font-semibold file:text-[#164b38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#164b38]"
              {...register("images", {
                validate: (files) => {
                  if (!files?.length) return "Select at least one property photo.";
                  if (files.length > 10) return "Select no more than 10 photos.";
                  if (Array.from(files).some((file) => file.size > 5 * 1024 * 1024)) return "Each photo must be 5 MB or smaller.";
                  if (Array.from(files).some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) return "Choose JPG, PNG or WebP photos.";
                  return true;
                },
              })}
              aria-invalid={Boolean(errors.images)}
            />
            <p id="images-help" className="mt-2 text-sm text-[#59695f]">
              Choose 1–10 JPG, PNG or WebP images, up to 5 MB each.
            </p>
            {errors.images && <p role="alert" className="mt-2 text-sm text-red-700">{errors.images.message}</p>}
          </section>
          {submitError && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-800">{submitError}</p>}
          <div className="flex flex-col gap-5 rounded-2xl border border-[#d9e0d8] bg-[#eef2e9] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">All the details in place?</h2>
              <p className="mt-1 text-sm leading-6 text-[#59695f]">
                Take a moment to check your entries.
              </p>
            </div>
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-xl bg-[#164b38] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#103d2d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#164b38]"
            >
              {isSubmitting ? "Uploading and publishing..." : "Publish property"}{" "}
              <span className="ml-3" aria-hidden="true">
                →
              </span>
            </button>
          </div>
          </fieldset>
        </form>
        <p className="mt-8 text-center text-xs text-[#6b7c69]">
          PropView · Find a home. Know the neighbourhood.
        </p>
      </main>
    </div>
  );
}
