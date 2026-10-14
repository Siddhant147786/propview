import AiCard from "./AiCard";

export default function AiSearch() {
  return (
    <>
      <div className="flex items-start gap-12">
        <div className="flex flex-1 flex-col min-w-0">
          <p className="text-sm font-semibold leading-5 text-[#164b38]">
            FIND PLACE IN INDIA
          </p>
          <h1 className="mt-4 text-[56px] font-semibold leading-16 tracking-[-1.5px] text-[#164b38]">
            Find a Home.
            <br />
            Know the Neighbourhood.
          </h1>

          <div className="mt-4 text-base leading-6 text-[#59695f]">
            <p>Search homes, explore local prices and get help from AI</p>
            <p>Simple way to find your next place.</p>
          </div>
        </div>
        <AiCard></AiCard>
      </div>
    </>
  );
}
