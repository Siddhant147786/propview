export default function GoogleMap() {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#d9e0d8] bg-white">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold leading-6.5 text-[#1b3025]">
            Neighbourhood prices
          </h3>

          <span className="rounded-lg bg-[#eaf0e6] px-2 py-1 text-xs text-[#164b38]">
            Pune
          </span>
        </div>

        <div className="flex h-94 items-center justify-center bg-[#eaf0e6]">
          <p className="text-sm text-[#59695f]">Interactive map coming soon</p>
        </div>

        <h4 className="text-sm font-semibold leading-5 text-[#1b3025]">
          Example asking price ranges
        </h4>

        <div className="mt-2 flex flex-wrap gap-6 text-xs leading-5 text-[#59695f]">
          
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#c8ddbe]" />
            <span>Up to ₹90 L</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#e8d59e]" />
            <span>₹90 L – ₹1.30 Cr</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#dba99a]" />
            <span>Above ₹1.30 Cr</span>
          </div>

        </div>

        <p className="mt-2 text-xs leading-4.5 text-[#59695f]">
          Illustrative price ranges, not live market data.
        </p>
      </div>
    </>
  );
}
