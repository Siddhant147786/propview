export default function Footer() {
  return (
    <>
      <div className="flex items-start justify-between bg-[#faf8f3] px-20 py-6">
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold leading-6.5 text-[#164b38]">
            PropView
          </p>

          <p className="text-xs leading-4.5 text-[#59695f]">
            © 2026 PropView. All rights reserved.
          </p>
        </div>

        <nav className="pt-0.75">
          <ul className="flex items-center gap-6 text-sm leading-5 text-[#59695f]">
            <li>
              <a href="">About</a>
            </li>
            <li>
              <a href="">Help</a>
            </li>
            <li>
              <a href="">Privacy</a>
            </li>
            <li>
              <a href="">Terms</a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
