import {Link} from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-6 bg-[#faf8f3] px-5 py-6 lg:px-20">
        <div className="flex flex-col gap-3">
          <p className="text-lg font-semibold leading-6.5 text-[#164b38]">
            PropView
          </p>

          <p className="text-xs leading-4.5 text-[#59695f]">
            © 2026 PropView. All rights reserved.
          </p>
        </div>

        <nav className="pt-0.75">
          <ul className="flex flex-wrap items-center gap-6 text-sm leading-5 text-[#59695f]">
            <li><Link to="/contact">Contact</Link></li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/help">Help</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
