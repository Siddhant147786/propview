export async function api(path, options = {}) {
  const headers = { ...options.headers };
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body !== "string") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }
  const response = await fetch(`/api${path}`, { credentials: "include", ...options, headers, body });
  let data;
  try { data = await response.json(); } catch (error) { if (error.name === "AbortError") throw error; throw new Error("The server returned an unexpected response.", { cause: error }); }
  if (!response.ok) {
    const error = new Error(data.message || "Request failed. Please try again.");
    error.status = response.status;
    throw error;
  }
  return data;
}
