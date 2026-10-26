import logo from "../assets/logo.png";
import {Link} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";


export default function Navbar() {
  const { user, loading } = useContext(AuthContext);
  return (
    <>
      <nav className="flex min-h-20 flex-wrap items-center justify-between gap-4 bg-[#faf8f3] px-5 py-4 text-sm font-semibold leading-5 text-[#59695f] lg:px-20">
        <div>
          <ul className="flex flex-wrap items-center gap-4 sm:gap-8">
            <li>
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logo}
                  alt=""
                  className="h-6 w-6 shrink-0"
                />
                <span className="text-2xl font-semibold leading-8 text-[#164b38]">
                  PropView
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/searchhomes?listingType=Buy"
                className="text-[#164b38]"
              >
                Buy
              </Link>
            </li>
            <li>
              <Link
                to="/searchhomes?listingType=Rent"
              >
                Rent
              </Link>
            </li>
            <li>
              <Link
                to="/#areas"
              >
                Explore Areas
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex items-center gap-8 text-sm font-semibold leading-5">
            {user?.isAdmin && <li><Link to="/admin" className="underline">Support admin</Link></li>}
            <li>
              <Link
                to="/listproperty"
                className="flex h-12 w-39 items-center justify-center rounded-xl border border-[#d9e0d8] bg-white text-[#164b38]"
              >
                List Property
              </Link>
            </li>
            <li>
              {loading ? <span role="status">Loading...</span> : (
                <Link to={user ? "/profile" : "/signin"} className="flex h-12 w-24 items-center justify-center rounded-xl bg-[#164b38] text-white">
                  {user ? "Profile" : "Sign in"}
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
