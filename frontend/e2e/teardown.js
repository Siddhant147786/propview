export default async function teardown() {
  const response = await fetch("http://127.0.0.1:3101/__test_cleanup", { method: "POST", headers: { "X-Test-Cleanup": "browser-tests" } });
  if (!response.ok) throw new Error("Could not clean the disposable browser-test database.");
}
