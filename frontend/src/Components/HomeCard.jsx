export default function HomeCard(props) {


  return (
    <>
      <div className="flex w-full gap-4 rounded-xl border border-[#d9e0d8] bg-white p-3">
        <div className="flex w-full gap-4 rounded-xl border border-[#d9e0d8] bg-white p-3">
          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="text-base font-semibold leading-6 text-[#1b3025]">
             {props.title}
            </h3>

            <p className="text-xs leading-4.5 text-[#59695f]">{props.address}</p>

            <p className="mt-2 text-lg font-semibold leading-6.5 text-[#164b38]">
             {props.price}
            </p>

            <p className="text-xs leading-4.5 text-[#59695f]">
              {props.details}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
