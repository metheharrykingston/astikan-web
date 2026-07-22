
(() => {
  const state = { all: [], filtered: [], search: '', category: 'all', sort: 'popular', page: 1, perPage: 12 };
  const tel = '+919990071792';
  const $ = (id) => document.getElementById(id);
  const formatRs = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const safe = (v) => String(v ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function categories() { return [...new Set(state.all.map(m => m.category).filter(Boolean))].sort(); }

  function initControls() {
    const categorySelect = $('medicineCategory');
    const chips = $('medicineCategoryChips');
    categories().forEach(cat => {
      const opt = document.createElement('option'); opt.value = cat; opt.textContent = cat; categorySelect.appendChild(opt);
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'med-category-chip'; btn.dataset.category = cat; btn.textContent = cat; chips.appendChild(btn);
    });
    chips.insertAdjacentHTML('afterbegin', '<button type="button" class="med-category-chip active" data-category="all">All</button>');

    $('medicineSearch').addEventListener('input', (e) => { state.search = e.target.value.trim().toLowerCase(); state.page = 1; apply(); });
    categorySelect.addEventListener('change', (e) => { setCategory(e.target.value); });
    $('medicineSort').addEventListener('change', (e) => { state.sort = e.target.value; state.page = 1; apply(); });
    $('medicinePerPage').addEventListener('change', (e) => { state.perPage = Number(e.target.value); state.page = 1; apply(); });
    $('clearMedicineFilters').addEventListener('click', () => {
      state.search = ''; state.category = 'all'; state.sort = 'popular'; state.page = 1;
      $('medicineSearch').value = ''; $('medicineCategory').value = 'all'; $('medicineSort').value = 'popular';
      apply();
    });
    chips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category]'); if (!btn) return;
      setCategory(btn.dataset.category);
    });
  }

  function setCategory(cat) {
    state.category = cat || 'all'; state.page = 1;
    $('medicineCategory').value = state.category;
    document.querySelectorAll('.med-category-chip').forEach(ch => ch.classList.toggle('active', ch.dataset.category === state.category));
    apply();
  }

  function apply() {
    const q = state.search;
    state.filtered = state.all.filter(m => {
      const inCategory = state.category === 'all' || m.category === state.category;
      const text = `${m.name} ${m.generic} ${m.brand} ${m.category} ${m.dosage}`.toLowerCase();
      return inCategory && (!q || text.includes(q));
    });
    if (state.sort === 'price-low') state.filtered.sort((a,b) => a.mrp - b.mrp);
    if (state.sort === 'price-high') state.filtered.sort((a,b) => b.mrp - a.mrp);
    if (state.sort === 'name') state.filtered.sort((a,b) => a.name.localeCompare(b.name));
    render();
  }

  function render() {
    const grid = $('medicineGrid');
    const total = state.filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / state.perPage));
    if (state.page > totalPages) state.page = totalPages;
    const start = (state.page - 1) * state.perPage;
    const items = state.filtered.slice(start, start + state.perPage);
    $('medicineResultsCount').textContent = total ? `Showing ${start + 1}-${Math.min(start + state.perPage, total)} of ${total} medicines` : 'No medicines found';
    grid.innerHTML = items.map(card).join('') || `<div class="col-12"><div class="medicine-card p-5 text-center"><i class="bi bi-search fs-1 text-muted"></i><h4 class="mt-3">No medicine matched</h4><p class="text-muted">Try another medicine name, brand, salt or category.</p></div></div>`;
    renderPagination(totalPages);
  }

  function card(m) {
    const sale = Math.max(1, Math.round(m.mrp - (m.mrp * (m.discount || 0) / 100)));
    const message = encodeURIComponent(`Hi Astikan, I want to book ${m.name} (${m.pack}). Please confirm availability and prescription requirement.`);
    return `<div class="col-xl-4 col-md-6">
      <article class="medicine-card h-100 p-3">
        <div class="d-flex gap-3 align-items-start flex-column flex-sm-row">
          <img src="${safe(m.image)}" alt="${safe(m.name)} medicine pack" loading="lazy">
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between gap-2 align-items-start mb-1">
              <h5 class="fw-bold mb-0">${safe(m.name)}</h5>
              <span class="badge rounded-pill rx-chip">Rx?</span>
            </div>
            <p class="small text-muted mb-1">${safe(m.generic)}</p>
            <p class="small mb-2"><span class="fw-semibold">${safe(m.brand)}</span> · ${safe(m.dosage)}</p>
            <div class="d-flex flex-wrap gap-2 mb-2">
              <span class="badge text-bg-light border">${safe(m.category)}</span>
              <span class="badge text-bg-light border">${safe(m.pack)}</span>
            </div>
            <p class="small text-muted mb-3">${safe(m.description)}</p>
            <div class="d-flex align-items-end justify-content-between gap-3">
              <div><small class="text-muted d-block">Display price</small><span class="fs-5 fw-bold">${formatRs(sale)}</span> <small class="text-muted text-decoration-line-through">${formatRs(m.mrp)}</small></div>
              <a class="call-book-btn py-2 px-3" href="tel:${tel}" onclick="sessionStorage.setItem('medicineBookingMessage','${message}')"><i class="bi bi-telephone-fill"></i> Call</a>
            </div>
          </div>
        </div>
      </article>
    </div>`;
  }

  function renderPagination(totalPages) {
    const pag = $('medicinePagination');
    if (totalPages <= 1) { pag.innerHTML = ''; return; }
    const buttons = [];
    const make = (label, page, disabled=false, active=false) => `<li class="page-item ${disabled?'disabled':''} ${active?'active':''}"><button class="page-link" data-page="${page}" type="button">${label}</button></li>`;
    buttons.push(make('‹', Math.max(1, state.page - 1), state.page === 1));
    const windowSize = 2;
    for (let p=1; p<=totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - state.page) <= windowSize) buttons.push(make(p, p, false, p === state.page));
      else if (p === state.page - windowSize - 1 || p === state.page + windowSize + 1) buttons.push('<li class="page-item disabled"><span class="page-link">…</span></li>');
    }
    buttons.push(make('›', Math.min(totalPages, state.page + 1), state.page === totalPages));
    pag.innerHTML = buttons.join('');
    pag.querySelectorAll('[data-page]').forEach(btn => btn.addEventListener('click', () => {
      const next = Number(btn.dataset.page); if (!next || next === state.page) return;
      state.page = next; render(); document.getElementById('medicine-catalogue').scrollIntoView({behavior:'smooth', block:'start'});
    }));
  }

  fetch('assets/medicines.json')
    .then(r => r.json())
    .then(data => { state.all = data; state.filtered = [...data]; initControls(); apply(); if (window.AOS) AOS.init({ once:true, offset:100, duration:350 }); })
    .catch(() => { $('medicineResultsCount').textContent = 'Could not load medicines.json'; });
})();
