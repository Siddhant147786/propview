import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signedIn } = useContext(AuthContext);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
    const response = await fetch("/api/signin", {
      credentials: "include",
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // specify JSON format
      },
      body: JSON.stringify({
        email: email,
        password : password,
      }), // convert JS object to JSON string
    });
    
    const data = await response.json();

    if(response.ok){
      signedIn(data.user);
      const from = location.state?.from;
      const safePath = typeof from === "string" && /^\/(?:listproperty|profile|contact|admin|properties\/[a-f\d]{24}(?:\/edit)?)$/i.test(from);
      navigate(safePath ? from : "/", { replace: true });
    }else{
      setError(data.message || "Sign-in failed.");
    }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally { setPending(false); }
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[#d9e0d8] bg-white p-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-[#1b3025]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#59695f]">
            Sign in to continue your PropView Journey.
          </p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            {location.state?.message && <p role="status" className="text-sm text-[#164b38]">{location.state.message}</p>}
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-[#1b3025]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-[#1b3025] placeholder:text-[#59695f] focus:border-[#164b38] focus:outline-none focus:ring-2 focus:ring-[#164b38]/20"
                type="email"
                value={email}
                name="email"
                id="email"
                required
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-[#1b3025]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="h-12 w-full rounded-xl border border-[#d9e0d8] bg-white px-4 text-[#1b3025] placeholder:text-[#59695f] focus:border-[#164b38] focus:outline-none focus:ring-2 focus:ring-[#164b38]/20"
                type="password"
                id="password"
                name="password"
                value={password}
                required
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>
            <div className="text-right">
              <Link
                className="text-sm font-semibold text-[#164b38] hover:underline"
                to="/resetpassword"
              >
                Forgot Password
              </Link>
            </div>
            <div>
              <button
                className="h-12 w-full rounded-xl bg-[#164b38] text-sm font-semibold text-white transition-colors hover:bg-[#103d2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164b38] focus-visible:ring-offset-2"
                type="submit"
                disabled={pending}
              >
                {pending ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-[#59695f]">
            New to PropView?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#164b38] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
