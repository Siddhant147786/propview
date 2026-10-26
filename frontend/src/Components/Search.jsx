import AiSearch from "./AiSearch";
import ManualSearch from "./ManualSearch";

export default function Search(){


    return (
        <>

            <div className="flex flex-col gap-6 bg-[#faf8f3] px-5 py-12 lg:px-20">
                <AiSearch/>
                <ManualSearch/>
            </div>

        </>
    );
}
