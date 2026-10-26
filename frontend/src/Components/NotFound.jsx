import { Link } from "react-router-dom";
export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf8f3] px-5"><h1 className="text-3xl font-semibold">Page not found</h1><p>This address does not match a page on PropView.</p><Link to="/" className="rounded-xl bg-[#164b38] px-5 py-3 text-white">Back to home</Link></main>;
}
