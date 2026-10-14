import GoogleMap from "./GoogleMap";
import ExampleHomes from "./ExampleHomes";

export default function Map() {
  return (
    <section className="bg-[#faf8f3] px-20 pt-6 pb-12">
      <h2 className="text-3xl font-semibold leading-9.5 text-[#1b3025]">
        Explore Pune, one neighbourhood at a time.
      </h2>

      <p className="text-base leading-6 text-[#59695f]">
        See example price ranges on the map, then browse homes nearby.
      </p>

      <div className="mt-6 flex items-start gap-6">
        <div className="min-w-0 flex-1">
          <GoogleMap />
        </div>

        <div className="w-110 shrink-0">
          <ExampleHomes />
        </div>
      </div>
    </section>
  );
}
