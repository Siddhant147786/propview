import AiCard from "./AiCard";

export default function AiSearch() {
  return (
    <>
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-1 flex-col min-w-0">
          <p className="text-sm font-semibold leading-5 text-[#164b38]">
            FIND PLACE IN INDIA
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[#164b38] sm:text-[56px]">
            Find a Home.
            <br />
            Know the Neighbourhood.
          </h1>

          <div className="mt-4 text-base leading-6 text-[#59695f]">
            <p>Search homes, compare asking prices and contact property owners.</p>
            <p>Simple way to find your next place.</p>
          </div>
        </div>
        <AiCard></AiCard>
      </div>
    </>
  );
}
