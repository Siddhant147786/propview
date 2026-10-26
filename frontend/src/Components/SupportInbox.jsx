import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function SupportInbox({ admin = false, refresh = 0 }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api(`${admin ? "/admin/enquiries" : "/contact"}?${new URLSearchParams({ page, status })}`, { signal: controller.signal })
      .then((result) => { setData(result); setError(""); })
      .catch((err) => { if (err.name !== "AbortError") setError(err.message); });
    return () => controller.abort();
  }, [admin, page, status, refresh, revision]);
  async function save(event, id) {
    event.preventDefault(); setBusy(id); setError(""); setNotice("");
    try {
      const result = await api(`/admin/enquiries/${id}`, { method: "PATCH", body: Object.fromEntries(new FormData(event.currentTarget)) });
      setNotice(result.message); setRevision((value) => value + 1);
    } catch (err) { setError(err.message); } finally { setBusy(""); }
  }
  return <section className="mt-10 space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold">{admin ? "Support enquiries" : "Your enquiries"}</h2><button className="underline" onClick={() => setRevision((value) => value + 1)}>Refresh enquiries</button></div>
    <label className="block">Filter by status <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="ml-2 rounded-xl border bg-white p-2"><option value="">All</option><option value="new">New</option><option value="resolved">Resolved</option></select></label>
    {error && <p role="alert" className="text-red-700">{error}</p>}{notice && <p role="status">{notice}</p>}
    {!data && !error && <p role="status">Loading enquiries...</p>}
    {data?.enquiries.length === 0 && <p>No enquiries match this filter.</p>}
    {data?.enquiries.map((item) => <article key={item._id} className="space-y-3 rounded-2xl border bg-white p-5">
      <h3 className="text-lg font-semibold">{item.subject}</h3>
      <p className="text-sm text-[#59695f]">{item.status === "resolved" ? "Resolved" : "New"} · {new Date(item.createdAt).toLocaleString()}</p>
      {admin && <p>{item.user?.name || "Former user"} {item.user?.email && `(${item.user.email})`}</p>}
      <p className="whitespace-pre-wrap">{item.message}</p>
      {item.response && <div className="rounded-xl bg-[#eaf0e6] p-4"><p className="font-semibold">Support response</p><p className="mt-2 whitespace-pre-wrap">{item.response}</p></div>}
      {admin && <form key={`${item._id}-${item.updatedAt}`} onSubmit={(event) => save(event, item._id)}><fieldset disabled={Boolean(busy)} className="space-y-3">
        <label className="block">Response<textarea name="response" maxLength={3000} defaultValue={item.response} className="mt-2 min-h-28 w-full rounded-xl border p-3" /></label>
        <label className="block">Status <select name="status" defaultValue={item.status} className="ml-2 rounded-xl border p-2"><option value="new">New</option><option value="resolved">Resolved</option></select></label>
        <button className="rounded-xl bg-[#164b38] px-5 py-3 text-white disabled:opacity-50">{busy === item._id ? "Saving..." : "Save response"}</button>
      </fieldset></form>}
      <p className="break-all text-xs text-[#59695f]">Reference: {item._id}</p>
    </article>)}
    {data && <div className="flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous enquiries</button><span>{page} / {data.pages}</span><button disabled={page >= data.pages} onClick={() => setPage((value) => value + 1)} className="rounded-xl border px-4 py-2 disabled:opacity-40">Next enquiries</button></div>}
  </section>;
}
