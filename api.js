
const API_BASE = "https://yourapp.onrender.com/api";

export async function getJSON(url, opts = {}) {
  const res = await fetch(url, { ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
