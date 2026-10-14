import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <>
      <nav className="flex h-20 items-center justify-between bg-[#faf8f3] px-20 text-sm font-semibold leading-5 text-[#59695f]">
        <div>
          <ul className="flex items-center gap-8">
            <li>
              <a href="" className="flex w-46 items-center gap-2">
                <img
                  src={logo}
                  alt=""
                  className="h-6 w-6 shrink-0"
                />
                <span className="text-2xl font-semibold leading-8 text-[#164b38]">
                  PropView
                </span>
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-[#164b38]"
              >
                Buy
              </a>
            </li>
            <li>
              <a
                href=""
              >
                Rent
              </a>
            </li>
            <li>
              <a
                href=""
              >
                Explore Areas
              </a>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex items-center gap-8 text-sm font-semibold leading-5">
            <li>
              <a
                href=""
                className="flex h-12 w-39 items-center justify-center rounded-xl border border-[#d9e0d8] bg-white text-[#164b38]"
              >
                List Property
              </a>
            </li>
            <li>
              <a href="" className="flex h-12 w-24 items-center justify-center rounded-xl bg-[#164b38] text-white">Sign in </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
