import Neighbourhoods from "./Neighbourhoods";
import ExampleHomes from "./ExampleHomes";

export default function Map() {
  return (
    <section id="areas" className="bg-[#faf8f3] px-5 pt-6 pb-12 lg:px-20">
      <h2 className="text-3xl font-semibold leading-9.5 text-[#1b3025]">
        Explore homes and neighbourhoods.
      </h2>

      <p className="text-base leading-6 text-[#59695f]">
        Compare asking prices from listed properties and browse available homes.
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <div className="min-w-0 flex-1">
          <Neighbourhoods />
        </div>

        <div className="min-w-0">
          <ExampleHomes />
        </div>
      </div>
    </section>
  );
}
