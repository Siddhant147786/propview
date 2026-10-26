import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function change(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    if (name === "email") { setSent(false); setVerificationToken(""); setOtp(""); setMessage(""); }
  }
  async function run(action) {
    setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  function send(event) {
    if (!event.currentTarget.form.reportValidity()) return;
    run(async () => {
      const result = await api("/generateotp", { method: "POST", body: { email: values.email } });
      setSent(true); setVerificationToken(""); setOtp(""); setMessage(result.message);
    });
  }
  function verify() {
    run(async () => {
      const result = await api("/verifyotp", { method: "POST", body: { email: values.email, otp } });
      setVerificationToken(result.verificationToken); setMessage(result.message);
    });
  }
  function submit(event) {
    event.preventDefault();
    if (!verificationToken) { setError("Verify your email before creating an account."); return; }
    run(async () => {
      await api("/register", { method: "POST", body: { ...values, verificationToken } });
      navigate("/signin", { state: { message: "Account created. Please sign in." } });
    });
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-5 py-12">
    <div className="w-full max-w-md rounded-2xl border border-[#d9e0d8] bg-white p-8 text-[#1b3025]">
      <h1 className="text-3xl font-semibold">Create an account</h1>
      <form onSubmit={submit} className="mt-6">
        <fieldset disabled={busy} className="space-y-4">
          {[["name", "Full name", "text"], ["email", "Email", "email"], ["phone", "Phone (optional)", "tel"], ["password", "Password", "password"]].map(([name, label, type]) => <label key={name} className="block text-sm font-semibold">{label}
            <input name={name} type={type} value={values[name]} onChange={change} required={name !== "phone"} minLength={name === "password" ? 8 : name === "name" ? 2 : undefined} maxLength={name === "name" ? 100 : name === "phone" ? 20 : name === "email" ? 254 : undefined} autoComplete={name === "password" ? "new-password" : name === "phone" ? "tel" : name} className="mt-2 w-full rounded-xl border border-[#d9e0d8] p-3" />
          </label>)}
          <button type="button" onClick={send} className="w-full rounded-xl bg-[#164b38] p-3 text-white">{sent ? "Resend code" : "Send verification code"}</button>
          {sent && !verificationToken && <div className="space-y-3">
            <label className="block text-sm font-semibold">Email verification code<input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="mt-2 w-full rounded-xl border p-3 tracking-widest" /></label>
            <button type="button" onClick={verify} disabled={otp.length !== 6} className="rounded-xl border border-[#164b38] px-5 py-2 disabled:opacity-50">Verify email</button>
          </div>}
          {verificationToken && <button type="submit" className="w-full rounded-xl bg-[#164b38] p-3 text-white">Create account</button>}
        </fieldset>
      </form>
      {busy && <p role="status" className="mt-4">Please wait...</p>}
      {message && <p role="status" className="mt-4 text-sm text-[#164b38]">{message}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      <p className="mt-6 text-sm">Already registered? <Link to="/signin" className="underline">Sign in</Link></p>
    </div>
  </main>;
}
