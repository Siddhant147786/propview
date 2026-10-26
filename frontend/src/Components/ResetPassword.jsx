import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { AuthContext } from "../auth/AuthContext";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { signedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const result = await api(sent ? "/reset-password" : "/forgot-password", { method: "POST", body: sent ? { email, otp, password } : { email } });
      if (sent) { signedIn(null); navigate("/signin", { state: { message: result.message } }); }
      else { setSent(true); setMessage(result.message); }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-5 py-12"><div className="w-full max-w-md rounded-2xl border bg-white p-8">
    <h1 className="text-2xl font-semibold text-[#164b38]">Reset your password</h1>
    <form onSubmit={submit} className="mt-6"><fieldset disabled={busy} className="space-y-4">
      <label className="block">Email<input required type="email" value={email} onChange={(e) => { setEmail(e.target.value); setSent(false); setMessage(""); setOtp(""); }} className="mt-2 w-full rounded-xl border p-3" /></label>
      {sent && <>
        <label className="block">Code from your email<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-2 w-full rounded-xl border p-3" /></label>
        <label className="block">New password<input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label>
      </>}
      <button className="w-full rounded-xl bg-[#164b38] p-3 text-white">{busy ? "Please wait..." : sent ? "Change password" : "Send reset code"}</button>
      {sent && <button type="button" onClick={() => { setSent(false); setOtp(""); setMessage(""); }} className="underline">Request another code</button>}
    </fieldset></form>
    {message && <p role="status" className="mt-4 text-sm">{message}</p>}{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    <Link to="/signin" className="mt-6 block underline">Back to sign in</Link>
  </div></main>;
}
