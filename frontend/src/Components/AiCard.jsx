export default function AiCard() {
  return (
    <>
      <div className="w-106 shrink-0 rounded-[20px] bg-[#eaf0e6] p-6">
        <h2 className="text-lg font-semibold leading-6.5 text-[#164b38]">
          Ask PropGuide
        </h2>
        <div className="mt-3 text-base leading-6 text-[#59695f]">
          <p>Not sure where to start?</p>
          <p>Ask your AI property companion.</p>
        </div>
        <textarea
          name="input"
          id="input"
          aria-label="Ask PropGuide a property question"
          defaultValue="2 BHK flats in Pune"
          className="mt-3 block h-16 w-full resize-none rounded-xl bg-white p-3 text-sm leading-5 text-[#1b3025]"
        ></textarea>

        <button type="button"  className="mt-3 flex h-12 w-30 items-center justify-center rounded-xl bg-[#164b38] text-sm font-semibold leading-5 text-white cursor-pointer"> ASK AI</button>
      </div>
    </>
  );
}
