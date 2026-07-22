(function () {
  var params = new URLSearchParams(window.location.search);
  var serviceId = params.get("service") || "";
  var enrollmentQuery = params.get("enrollmentId") ? "?enrollmentId=" + encodeURIComponent(params.get("enrollmentId")) : "";

  var state = {
    service: null,
    items: [],
    filtered: [],
    page: 1,
    perPage: 12,
    query: "",
    category: "",
    sample: "",
    sort: "name-asc"
  };

  var rupee = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  function $(id) {
    return document.getElementById(id);
  }

  function safe(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function number(value) {
    var n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function normalize(value) {
    return String(value ?? "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  }

  function uniqueSorted(values) {
    var seen = {};
    var out = [];
    for (var i = 0; i < values.length; i++) {
      var v = String(values[i] || "").trim();
      if (!v || seen[v]) continue;
      seen[v] = true;
      out.push(v);
    }
    return out.sort(function (a, b) { return a.localeCompare(b); });
  }

  function dashboardUrl() {
    if (window.MemberPortalRoutes) {
      return window.MemberPortalRoutes.dashboardUrl();
    }
    return "../membership-dashboard.html" + enrollmentQuery;
  }

  function buildRequestUrl(details, extra) {
    if (!window.MemberPortalRoutes) return "request.html";
    var url = window.MemberPortalRoutes.requestUrl(serviceId, extra || {});
    if (details) {
      url += (url.indexOf("?") >= 0 ? "&" : "?") + "details=" + encodeURIComponent(details);
    }
    return url;
  }

  function formatTat(hours) {
    var h = number(hours);
    if (!h) return "Timing varies";
    if (h < 24) return h + " hrs";
    var days = Math.max(1, Math.round(h / 24));
    return days + " day" + (days > 1 ? "s" : "");
  }

  function renderHero(service, inventoryType) {
    var hero = $("browseHero");
    if (!hero) return;
    var desc = service.browseDesc || service.desc || "";
    if (inventoryType && desc.length > 90) {
      desc = "Search tests, compare price & sample type, then tap Request to book.";
    }
    var inventoryNote = inventoryType
      ? '<p class="member-browse-hint"><i class="bi bi-info-circle"></i> Pick a test → Request → our team confirms your booking.</p>'
      : "";
    hero.innerHTML =
      '<div class="member-browse-eyebrow"><i class="bi ' + service.icon + '"></i> Member Portal</div>' +
      "<h1>" + safe(service.browseTitle || service.title) + "</h1>" +
      (desc ? "<p>" + safe(desc) + "</p>" : "") +
      inventoryNote;
  }

  function renderLabControls() {
    var categories = uniqueSorted(state.items.map(function (t) { return t.category; }));
    var samples = uniqueSorted(state.items.map(function (t) { return t.sampleType; }));
    $("browseControls").style.display = "block";
    $("browseControls").innerHTML =
      '<div class="member-browse-filters">' +
        '<div class="member-browse-search">' +
          '<i class="bi bi-search"></i>' +
          '<input id="browseSearch" placeholder="Search tests by name, code, category..." type="search"/>' +
        "</div>" +
        '<select id="browseCategory"><option value="">All Categories</option>' +
          categories.map(function (c) { return '<option value="' + safe(c) + '">' + safe(c) + "</option>"; }).join("") +
        "</select>" +
        '<select id="browseSample"><option value="">All Sample Types</option>' +
          samples.map(function (s) { return '<option value="' + safe(s) + '">' + safe(s) + "</option>"; }).join("") +
        "</select>" +
        '<select id="browseSort">' +
          '<option value="name-asc">Name A-Z</option>' +
          '<option value="price-asc">Price Low-High</option>' +
          '<option value="price-desc">Price High-Low</option>' +
          '<option value="tat-asc">Fastest Reports</option>' +
        "</select>" +
        '<select id="browsePerPage">' +
          '<option value="12">12 / page</option>' +
          '<option value="24">24 / page</option>' +
          '<option value="48">48 / page</option>' +
        "</select>" +
        '<button id="browseClear" type="button">Clear</button>' +
      "</div>";

    $("browseSearch").addEventListener("input", function (e) {
      state.query = e.target.value.trim();
      state.page = 1;
      applyFilters();
    });
    $("browseCategory").addEventListener("change", function (e) {
      state.category = e.target.value;
      state.page = 1;
      applyFilters();
    });
    $("browseSample").addEventListener("change", function (e) {
      state.sample = e.target.value;
      state.page = 1;
      applyFilters();
    });
    $("browseSort").addEventListener("change", function (e) {
      state.sort = e.target.value;
      state.page = 1;
      applyFilters();
    });
    $("browsePerPage").addEventListener("change", function (e) {
      state.perPage = Number(e.target.value) || 12;
      state.page = 1;
      applyFilters();
    });
    $("browseClear").addEventListener("click", function () {
      state.query = "";
      state.category = "";
      state.sample = "";
      state.sort = "name-asc";
      state.page = 1;
      $("browseSearch").value = "";
      $("browseCategory").value = "";
      $("browseSample").value = "";
      $("browseSort").value = "name-asc";
      applyFilters();
    });
  }

  function renderMedicineControls() {
    var categories = uniqueSorted(state.items.map(function (m) { return m.category; }));
    $("browseControls").style.display = "block";
    $("browseControls").innerHTML =
      '<div class="member-browse-filters">' +
        '<div class="member-browse-search">' +
          '<i class="bi bi-search"></i>' +
          '<input id="browseSearch" placeholder="Search medicine, brand, salt..." type="search"/>' +
        "</div>" +
        '<select id="browseCategory"><option value="">All Categories</option>' +
          categories.map(function (c) { return '<option value="' + safe(c) + '">' + safe(c) + "</option>"; }).join("") +
        "</select>" +
        '<select id="browseSort">' +
          '<option value="name-asc">Name A-Z</option>' +
          '<option value="price-asc">Price Low-High</option>' +
          '<option value="price-desc">Price High-Low</option>' +
        "</select>" +
        '<select id="browsePerPage">' +
          '<option value="12">12 / page</option>' +
          '<option value="24">24 / page</option>' +
        "</select>" +
        '<button id="browseClear" type="button">Clear</button>' +
      "</div>";

    $("browseSearch").addEventListener("input", function (e) {
      state.query = e.target.value.trim();
      state.page = 1;
      applyFilters();
    });
    $("browseCategory").addEventListener("change", function (e) {
      state.category = e.target.value;
      state.page = 1;
      applyFilters();
    });
    $("browseSort").addEventListener("change", function (e) {
      state.sort = e.target.value;
      state.page = 1;
      applyFilters();
    });
    $("browsePerPage").addEventListener("change", function (e) {
      state.perPage = Number(e.target.value) || 12;
      state.page = 1;
      applyFilters();
    });
    $("browseClear").addEventListener("click", function () {
      state.query = "";
      state.category = "";
      state.sort = "name-asc";
      state.page = 1;
      $("browseSearch").value = "";
      $("browseCategory").value = "";
      $("browseSort").value = "name-asc";
      applyFilters();
    });
  }

  function filterItems() {
    var q = normalize(state.query);
    var inventory = state.service.inventory;

    state.filtered = state.items.filter(function (item) {
      if (inventory === "lab-tests") {
        if (state.category && item.category !== state.category) return false;
        if (state.sample && item.sampleType !== state.sample) return false;
        if (!q) return true;
        var hay = normalize([item.code, item.name, item.category, item.sampleType, item.details].join(" "));
        return hay.indexOf(q) >= 0;
      }
      if (inventory === "medicines") {
        if (state.category && item.category !== state.category) return false;
        if (!q) return true;
        var medHay = normalize([item.name, item.generic, item.brand, item.category, item.dosage].join(" "));
        return medHay.indexOf(q) >= 0;
      }
      return true;
    });

    if (state.sort === "price-asc") {
      state.filtered.sort(function (a, b) {
        return number(a.sellingPrice || a.mrp) - number(b.sellingPrice || b.mrp);
      });
    } else if (state.sort === "price-desc") {
      state.filtered.sort(function (a, b) {
        return number(b.sellingPrice || b.mrp) - number(a.sellingPrice || a.mrp);
      });
    } else if (state.sort === "tat-asc") {
      state.filtered.sort(function (a, b) {
        return number(a.tatHours || 999999) - number(b.tatHours || 999999);
      });
    } else {
      state.filtered.sort(function (a, b) {
        return String(a.name || "").localeCompare(String(b.name || ""));
      });
    }
  }

  function labCard(test) {
    var mrp = number(test.mrp);
    var sp = number(test.sellingPrice || test.mrp);
    var showMrp = mrp && sp && mrp > sp;
    var details =
      "Lab test request: " + test.name +
      " (" + (test.code || "no code") + "). Sample: " + (test.sampleType || "TBD") +
      ". Category: " + (test.category || "General") + ".";
    var reqUrl = buildRequestUrl(details, { test: test.code || "", name: test.name || "" });

    return (
      '<article class="member-browse-card">' +
        '<div class="member-browse-card-top">' +
          '<div class="member-browse-card-icon"><i class="fa-solid fa-flask-vial"></i></div>' +
          "<div>" +
            "<h3>" + safe(test.name) + "</h3>" +
            '<div class="member-browse-card-code">' + safe(test.code) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="member-browse-meta">' +
          '<span><i class="bi bi-layers"></i> ' + safe(test.category || "Other") + "</span>" +
          '<span><i class="bi bi-droplet"></i> ' + safe(test.sampleType || "Sample") + "</span>" +
          '<span><i class="bi bi-clock"></i> ' + safe(formatTat(test.tatHours)) + "</span>" +
        "</div>" +
        "<p>" + safe(test.details || "Details confirmed when our team contacts you.") + "</p>" +
        '<div class="member-browse-card-bottom">' +
          '<div class="member-browse-price">' +
            "<strong>" + (sp ? rupee.format(sp) : "Price on request") + "</strong>" +
            (showMrp ? "<del>" + rupee.format(mrp) + "</del>" : "") +
          "</div>" +
          '<a class="member-browse-request-btn" href="' + reqUrl + '"><i class="bi bi-send"></i> Request</a>' +
        "</div>" +
      "</article>"
    );
  }

  function medicineCard(med) {
    var sale = Math.max(1, Math.round(med.mrp - (med.mrp * (med.discount || 0) / 100)));
    var details =
      "Medicine request: " + med.name +
      " (" + (med.brand || "brand TBD") + ", " + (med.pack || "pack TBD") + "). " +
      (med.generic ? "Salt: " + med.generic + ". " : "");
    var reqUrl = buildRequestUrl(details, { medicine: med.name || "" });

    return (
      '<article class="member-browse-card">' +
        '<div class="member-browse-card-top">' +
          '<div class="member-browse-card-icon"><i class="bi bi-capsule"></i></div>' +
          "<div>" +
            "<h3>" + safe(med.name) + "</h3>" +
            '<div class="member-browse-card-code">' + safe(med.brand) + " · " + safe(med.dosage) + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="member-browse-meta">' +
          '<span>' + safe(med.category || "Medicine") + "</span>" +
          '<span>' + safe(med.pack || "") + "</span>" +
        "</div>" +
        "<p>" + safe(med.description || "Prescription requirement will be confirmed by our pharmacy team.") + "</p>" +
        '<div class="member-browse-card-bottom">' +
          '<div class="member-browse-price"><strong>' + rupee.format(sale) + "</strong></div>" +
          '<a class="member-browse-request-btn" href="' + reqUrl + '"><i class="bi bi-send"></i> Request</a>' +
        "</div>" +
      "</article>"
    );
  }

  function renderPagination(totalPages) {
    var pag = $("browsePagination");
    if (!pag) return;
    pag.innerHTML = "";
    if (totalPages <= 1) return;

    function addBtn(label, page, disabled, active) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.disabled = disabled;
      if (active) btn.className = "active";
      btn.addEventListener("click", function () {
        state.page = page;
        renderGrid();
      });
      pag.appendChild(btn);
    }

    addBtn("‹", Math.max(1, state.page - 1), state.page === 1, false);
    for (var p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - state.page) <= 2) {
        addBtn(String(p), p, false, p === state.page);
      }
    }
    addBtn("›", Math.min(totalPages, state.page + 1), state.page === totalPages, false);
  }

  function renderGrid() {
    filterItems();
    var total = state.filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / state.perPage));
    if (state.page > totalPages) state.page = totalPages;
    var start = (state.page - 1) * state.perPage;
    var slice = state.filtered.slice(start, start + state.perPage);

    $("browseResults").style.display = "block";
    $("browseResultLine").innerHTML =
      "<span>Showing " + (total ? start + 1 : 0) + "-" + Math.min(start + state.perPage, total) + " of " + total + "</span>" +
      "<span>Page " + state.page + " / " + totalPages + "</span>";

    if (!total) {
      $("browseGrid").innerHTML = "";
      $("browseEmpty").style.display = "block";
    } else {
      $("browseEmpty").style.display = "none";
      if (state.service.inventory === "lab-tests") {
        $("browseGrid").innerHTML = slice.map(labCard).join("");
      } else if (state.service.inventory === "medicines") {
        $("browseGrid").innerHTML = slice.map(medicineCard).join("");
      }
    }
    renderPagination(totalPages);
  }

  function applyFilters() {
    renderGrid();
  }

  function renderGenericBrowse(service) {
    $("browseGeneric").style.display = "block";
    var bullets = (service.browsePoints || [
      "Browse what is included under your membership plan.",
      "Submit a request and our care team will coordinate the service for you.",
      "You will be contacted on your registered mobile or email."
    ]).map(function (point) { return "<li>" + safe(point) + "</li>"; }).join("");

    $("browseGenericBody").innerHTML =
      "<h2 class=\"h4 mb-3\">" + safe(service.title) + "</h2>" +
      "<p class=\"text-muted\">" + safe(service.desc) + "</p>" +
      "<ul>" + bullets + "</ul>";

    $("browseGenericCta").href = buildRequestUrl("");
  }

  async function loadInventory(service) {
    if (!service.dataUrl) return;
    var response = await fetch(service.dataUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load inventory.");
    state.items = await response.json();
    if (service.inventory === "lab-tests") renderLabControls();
    if (service.inventory === "medicines") renderMedicineControls();
    renderGrid();
  }

  async function init() {
    var service = window.MemberPortalRoutes && window.MemberPortalRoutes.getService(serviceId);
    if (!service) {
      window.location.href = dashboardUrl();
      return;
    }

    state.service = service;
    document.title = (service.browseTitle || service.title) + " | Astikan Member Portal";
    document.body.setAttribute("data-member-page", service.page || serviceId);

    var back = $("backToDashboard");
    if (back) back.href = dashboardUrl();

    renderHero(service, service.inventory);

    if (window.MemberPortalNav) {
      window.MemberPortalNav.populateIdentity();
    }

    if (service.inventory) {
      try {
        await loadInventory(service);
      } catch (error) {
        $("browseResults").style.display = "block";
        $("browseResultLine").textContent = error.message || "Inventory could not be loaded.";
      }
      return;
    }

    renderGenericBrowse(service);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();