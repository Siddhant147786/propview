import { useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const revision = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    const initialRevision = revision.current;
    async function loadSession() {
      try {
        const response = await fetch("/api/me", { credentials: "include", signal: controller.signal });
        if (initialRevision !== revision.current) return;
        if (response.status === 401) { setUser(null); return; }
        if (!response.ok) throw new Error("Unable to check your login. Please refresh the page.");
        const data = await response.json();
        if (initialRevision !== revision.current) return;
        setUser(data.user);
      } catch (err) {
        if (err.name !== "AbortError" && initialRevision === revision.current) setError("Unable to check your login. Please refresh the page.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadSession();
    return () => controller.abort();
  }, []);

  function signedIn(account) { revision.current += 1; setUser(account); setLoading(false); setError(""); }
  async function signOut() {
    const response = await fetch("/api/signout", { method: "POST", credentials: "include" });
    if (!response.ok) throw new Error("Could not sign out. Please try again.");
    revision.current += 1;
    setUser(null);
    setError("");
  }

  return <AuthContext.Provider value={{ user, loading, error, signedIn, signOut }}>{children}</AuthContext.Provider>;
}
