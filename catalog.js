
import { getJSON } from "./api.js";
const API = "https://yourapp.onrender.com/api/catalog";

async function loadFilters() {
  const [brands, cats] = await Promise.all([
    getJSON(`${API}/brands/`),
    getJSON(`${API}/categories/`)
  ]);
  const brandSel = document.getElementById("brand");
  brandSel.innerHTML = `<option value="">Brand</option>` + brands.map(b => `<option value="${b.id}">${b.name}</option>`).join("");
  const catSel = document.getElementById("category");
  catSel.innerHTML = `<option value="">Category</option>` + cats.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
}

async function loadCars() {
  const params = new URLSearchParams();
  const brand = document.getElementById("brand").value;
  const category = document.getElementById("category").value;
  const transmission = document.getElementById("transmission").value;
  const fuel = document.getElementById("fuel").value;
  const q = document.getElementById("search").value;

  if (brand) params.append("brand", brand);
  if (category) params.append("category", category);
  if (transmission) params.append("transmission", transmission);
  if (fuel) params.append("fuel", fuel);
  if (q) params.append("search", q);

  const data = await getJSON(`${API}/cars/?${params.toString()}`);
  const grid = document.getElementById("grid");
  grid.innerHTML = data.results.map(c => `
    car.html?slug=${c.slug}
      ${c.hero_image}
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">${c.brand.name} ${c.name}</h3>
          <span class="text-yellow-400 font-bold">GHS ${Number(c.price_per_day).toLocaleString()}</span>
        </div>
        <p class="text-sm text-neutral-400">${c.year} • ${c.transmission} • ${c.fuel} • ${c.seats} seats</p>
        ${c.featured ? '<span class="mt-2 inline-block text-xs px-2 py-1 rounded bg-yellow-500 text-black">Featured</span>' : ''}
      </div>
    </a>`).join("");
}

["brand","category","transmission","fuel","search"].forEach(id => {
  document.getElementById(id).addEventListener("change", loadCars);
  if (id === "search") document.getElementById(id).addEventListener("input", () => {
    clearTimeout(window.__t); window.__t = setTimeout(loadCars, 300);
  });
});

await loadFilters();
await loadCars();
