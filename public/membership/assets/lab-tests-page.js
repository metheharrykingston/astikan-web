(() => {
const state = {
tests: [],
filtered: [],
page: 1,
perPage: 12,
query: "",
category: "",
sample: "",
sort: "name-asc"
};

const els = {};
const rupee = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function $(id) {
return document.getElementById(id);
}

function safe(value) {
return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
}

function number(value) {
const n = Number(value);
return Number.isFinite(n) ? n : 0;
}

function formatTat(hours) {
const h = number(hours);
if (!h) return "Timing varies";
if (h < 24) return `${h} hrs`;
const days = Math.max(1, Math.round(h / 24));
return `${days} day${days > 1 ? "s" : ""}`;
}

function normalize(value) {
return String(value ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function uniqueSorted(values) {
return [...new Set(values.map(v => String(v || "").trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}


function card(test) {
const mrp = number(test.mrp);
const sp = number(test.sellingPrice || test.mrp);
const showMrp = mrp && sp && mrp > sp;
const save = showMrp ? mrp - sp : 0;
const params = new URLSearchParams({ test: test.code || "", name: test.name || "" });
return `<article class="lab-test-card">
<div class="lab-test-card-top">
<div class="lab-test-icon"><i class="fa-solid fa-flask-vial"></i></div>
<div>
<h2>${safe(test.name)}</h2>
<div class="lab-test-code">${safe(test.code)}</div>
</div>
</div>
<div class="lab-test-meta">
<span><i class="fa-solid fa-layer-group"></i>${safe(test.category || "Other")}</span>
<span><i class="fa-solid fa-droplet"></i>${safe(test.sampleType || "Sample")}</span>
<span><i class="fa-solid fa-clock"></i>${safe(formatTat(test.tatHours))}</span>
</div>
<p class="lab-test-detail">${safe(test.details || "Details will be confirmed during booking.")}</p>
<div class="lab-card-bottom">
<div class="lab-price-block">
<strong>${sp ? rupee.format(sp) : "Price on request"}</strong>
${showMrp ? `<del>${rupee.format(mrp)}</del><em>Save ${rupee.format(save)}</em>` : ""}
</div>
<div class="lab-card-actions">
<a href="book-test.html?${params.toString()}">Book</a>
<a href="tel:+919990071792">Call</a>
</div>
</div>
</article>`;
}

function buildFilters() {
const categories = uniqueSorted(state.tests.map(t => t.category));
const samples = uniqueSorted(state.tests.map(t => t.sampleType));
els.category.innerHTML = `<option value="">All Categories</option>` + categories.map(v => `<option value="${safe(v)}">${safe(v)}</option>`).join("");
els.sample.innerHTML = `<option value="">All Sample Types</option>` + samples.map(v => `<option value="${safe(v)}">${safe(v)}</option>`).join("");
els.totalTests.textContent = state.tests.length.toLocaleString("en-IN");
els.categoryCount.textContent = categories.length.toLocaleString("en-IN");
}

function filterTests() {
const q = normalize(state.query);
let items = state.tests.filter(test => {
const matchesCategory = !state.category || test.category === state.category;
const matchesSample = !state.sample || test.sampleType === state.sample;
if (!matchesCategory || !matchesSample) return false;
if (!q) return true;
const haystack = normalize([test.code, test.name, test.category, test.sampleType, test.details].join(" "));
return haystack.includes(q);
});
if (state.sort === "price-asc") items.sort((a, b) => number(a.sellingPrice || a.mrp) - number(b.sellingPrice || b.mrp));
else if (state.sort === "price-desc") items.sort((a, b) => number(b.sellingPrice || b.mrp) - number(a.sellingPrice || a.mrp));
else if (state.sort === "tat-asc") items.sort((a, b) => number(a.tatHours || 999999) - number(b.tatHours || 999999));
else items.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
state.filtered = items;
}

function renderPagination(totalPages) {
els.pagination.innerHTML = "";
if (totalPages <= 1) return;
const addButton = (label, page, disabled, active) => {
const btn = document.createElement("button");
btn.type = "button";
btn.innerHTML = label;
btn.disabled = disabled;
btn.className = active ? "active" : "";
btn.addEventListener("click", () => {
state.page = page;
render();
window.scrollTo({ top: document.getElementById("labTestsApp").offsetTop, behavior: "smooth" });
});
els.pagination.appendChild(btn);
};
addButton("<i class='fa-solid fa-chevron-left'></i>", Math.max(1, state.page - 1), state.page === 1, false);
const pages = [];
const total = totalPages;
for (let i = 1; i <= total; i++) {
if (i === 1 || i === total || Math.abs(i - state.page) <= 2) pages.push(i);
}
let last = 0;
pages.forEach(p => {
if (p - last > 1) {
const dots = document.createElement("span");
dots.textContent = "...";
els.pagination.appendChild(dots);
}
addButton(String(p), p, false, p === state.page);
last = p;
});
addButton("<i class='fa-solid fa-chevron-right'></i>", Math.min(totalPages, state.page + 1), state.page === totalPages, false);
}

function render() {
filterTests();
const total = state.filtered.length;
const totalPages = Math.max(1, Math.ceil(total / state.perPage));
if (state.page > totalPages) state.page = totalPages;
const start = (state.page - 1) * state.perPage;
const pageItems = state.filtered.slice(start, start + state.perPage);
els.grid.innerHTML = pageItems.map(card).join("");
els.empty.hidden = total !== 0;
els.visibleCount.textContent = total.toLocaleString("en-IN");
const from = total ? start + 1 : 0;
const to = Math.min(start + state.perPage, total);
els.resultText.textContent = total ? `Showing ${from.toLocaleString("en-IN")}–${to.toLocaleString("en-IN")} of ${total.toLocaleString("en-IN")} tests` : "No matching tests";
els.pageText.textContent = `Page ${state.page.toLocaleString("en-IN")} of ${totalPages.toLocaleString("en-IN")}`;
renderPagination(totalPages);
}

function bind() {
let typingTimer;
els.search.addEventListener("input", () => {
clearTimeout(typingTimer);
typingTimer = setTimeout(() => {
state.query = els.search.value.trim();
state.page = 1;
render();
}, 160);
});
els.category.addEventListener("change", () => {
state.category = els.category.value;
state.page = 1;
render();
});
els.sample.addEventListener("change", () => {
state.sample = els.sample.value;
state.page = 1;
render();
});
els.sort.addEventListener("change", () => {
state.sort = els.sort.value;
state.page = 1;
render();
});
els.perPage.addEventListener("change", () => {
state.perPage = Number(els.perPage.value) || 12;
state.page = 1;
render();
});
els.clear.addEventListener("click", () => {
els.search.value = "";
els.category.value = "";
els.sample.value = "";
els.sort.value = "name-asc";
els.perPage.value = "12";
state.query = "";
state.category = "";
state.sample = "";
state.sort = "name-asc";
state.perPage = 12;
state.page = 1;
render();
});
}

async function init() {
els.grid = $("labTestsGrid");
els.pagination = $("labPagination");
els.empty = $("labEmptyState");
els.search = $("labSearchInput");
els.category = $("labCategoryFilter");
els.sample = $("labSampleFilter");
els.sort = $("labSortSelect");
els.perPage = $("labPerPageSelect");
els.clear = $("labClearFilters");
els.resultText = $("labResultText");
els.pageText = $("labPageText");
els.totalTests = $("labTotalTests");
els.categoryCount = $("labCategoryCount");
els.visibleCount = $("labVisibleCount");
try {
const res = await fetch("assets/lab-tests.json", { cache: "no-store" });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
state.tests = Array.isArray(data) ? data : [];
buildFilters();
bind();
render();
} catch (error) {
els.resultText.textContent = "Could not load lab-tests.json";
els.grid.innerHTML = `<div class="lab-load-error">The local JSON file could not be loaded. Open this page through a local/static server instead of direct file mode.</div>`;
console.error(error);
}
}

document.addEventListener("DOMContentLoaded", init);
})();