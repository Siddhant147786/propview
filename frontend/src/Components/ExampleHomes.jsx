import HomeCard from "./HomeCard";

export default function ExampleHomes() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-semibold leading-8 text-[#1b3025]">
            Homes in Pune
          </h2>

          <p className="mt-1 text-xs leading-4.5 text-[#59695f]">
            Example listings for illustration.
          </p>
        </div>

        <HomeCard
          title="Sunrise Park"
          address="Baner, Pune"
          price="₹95 L"
          details="2 BHK · 980 sq ft"
        />

        <HomeCard
          title="The Courtyard"
          address="Wakad, Pune"
          price="₹1.15 Cr"
          details="3 BHK · 1,250 sq ft"
        />

        <HomeCard
          title="Lakeview Homes"
          address="Kharadi, Pune"
          price="₹1.35 Cr"
          details="3 BHK · 1,450 sq ft"
        />
      </div>
    </>
  );
}
