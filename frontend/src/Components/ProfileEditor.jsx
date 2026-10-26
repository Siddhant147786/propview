import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { api } from "../lib/api";
export default function ProfileEditor() {
  const { user, signedIn } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const values = Object.fromEntries(new FormData(event.currentTarget));
      const result = await api("/me", { method: "PATCH", body: values });
      signedIn(result.user); setEditing(false); setMessage(result.message);
    } catch (err) { setMessage(err.message); } finally { setBusy(false); }
  }
  return <div className="my-4">{!editing ? <button onClick={() => setEditing(true)} className="underline">Edit name and phone</button> : <form onSubmit={save} className="my-4 space-y-3"><fieldset disabled={busy} className="space-y-3"><label className="block">Name<input name="name" defaultValue={user.name} required minLength={2} maxLength={100} className="ml-3 rounded-xl border p-2" /></label><label className="block">Phone<input name="phone" type="tel" defaultValue={user.phone || ""} maxLength={20} className="ml-3 rounded-xl border p-2" /></label><button className="rounded-xl bg-[#164b38] px-4 py-2 text-white">{busy ? "Saving..." : "Save profile"}</button><button type="button" onClick={() => setEditing(false)} className="ml-4 underline">Cancel</button></fieldset></form>}{message && <p role="status" className="mt-2">{message}</p>}</div>;
}
