import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { api } from "../lib/api";
export default function MessageInbox() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [busy, setBusy] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    let loading = false;
    async function refresh() {
      if (loading || document.hidden) return;
      loading = true;
      try {
        const result = await api(`/messages?page=${page}`, { signal: controller.signal });
        setData(result.conversations); setPages(result.pages); setError("");
      } catch (err) { if (err.name !== "AbortError") setError(err.message); }
      finally { loading = false; }
    }
    void refresh();
    const timer = setInterval(refresh, 15000);
    document.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", refresh); controller.abort(); };
  }, [version, page]);
  async function update(id, body) {
    setBusy(id); setError("");
    try { await api(`/messages/${id}`, { method: "PATCH", body }); setVersion((v) => v + 1); }
    catch (err) { setError(err.message); } finally { setBusy(""); }
  }
  async function reply(event, id) {
    event.preventDefault();
    const form = event.currentTarget;
    const message = new FormData(form).get("message");
    setBusy(id); setError("");
    try { await api(`/messages/${id}/replies`, { method: "POST", body: { message } }); form.reset(); setVersion((v) => v + 1); }
    catch (err) { setError(err.message); } finally { setBusy(""); }
  }
  return <section className="mt-10 space-y-4"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Messages</h2><button onClick={() => setVersion((v) => v + 1)} className="underline">Refresh messages</button></div>
    <p className="text-sm text-[#59695f]">Updates every 15 seconds while this page is visible. Conversations support up to 100 messages.</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}{!data && !error && <p>Loading conversations...</p>}{data?.length === 0 && <p>No messages yet. Contact an owner from a property page to start a conversation.</p>}
    {data?.map((conversation) => <article key={conversation._id} className="rounded-2xl border bg-white p-5">
      {conversation.unreadCount > 0 && <button disabled={Boolean(busy)} onClick={() => update(conversation._id, { readCount: conversation.messages.length })} className="mb-3 rounded-full bg-[#eaf0e6] px-3 py-1 text-sm">{conversation.unreadCount} unread · Mark read</button>}
      <h3 className="font-semibold">{conversation.property && !conversation.property.deletedAt ? <Link to={`/properties/${conversation.property._id}`} className="underline">{conversation.property.title}</Link> : "Removed property"}</h3>
      <p className="mt-1 text-sm">{conversation.owner?.name || "Owner"} · {conversation.requester?.name || "Buyer"}</p>
      <ol className="my-4 max-h-72 space-y-3 overflow-y-auto">{conversation.messages.map((item) => <li key={item._id} className="rounded-xl bg-[#faf8f3] p-3"><p className="text-xs text-[#59695f]">{String(item.sender) === String(user._id) ? "You" : "Other participant"} · {new Date(item.createdAt).toLocaleString()}</p><p className="mt-1 whitespace-pre-wrap">{item.body}</p></li>)}</ol>
      {conversation.status !== "closed" && conversation.messages.length < 100 ? <form onSubmit={(event) => reply(event, conversation._id)} className="flex gap-3"><label className="min-w-0 flex-1"><span className="sr-only">Reply</span><input name="message" required maxLength={2000} placeholder="Write a reply" className="w-full rounded-xl border p-3" /></label><button disabled={Boolean(busy)} className="rounded-xl bg-[#164b38] px-4 text-white disabled:opacity-50">{busy === conversation._id ? "Sending..." : "Reply"}</button></form> : <p>{conversation.status === "closed" ? "This conversation is closed." : "This conversation has reached its message limit."}</p>}
      <button disabled={Boolean(busy)} onClick={() => update(conversation._id, { status: conversation.status === "closed" ? "open" : "closed" })} className="mt-4 text-sm underline">{conversation.status === "closed" ? "Reopen conversation" : "Close conversation"}</button>
    </article>)}
    {data && <div className="flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl border px-4 py-2 disabled:opacity-40">Previous conversations</button><span>{page} / {pages}</span><button disabled={page >= pages} onClick={() => setPage((value) => value + 1)} className="rounded-xl border px-4 py-2 disabled:opacity-40">Next conversations</button></div>}
  </section>;
}
