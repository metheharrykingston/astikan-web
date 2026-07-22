(function () {
  var config = window.ASTIKAN_CONFIG || {};
  var supabaseUrl = (config.supabase || {}).url || "";
  var anonKey = (config.supabase || {}).anonKey || "";
  var API = supabaseUrl ? supabaseUrl + "/functions/v1/admin-api" : "";

  function apiErrorMessage(result, response) {
    if (!result || typeof result !== "object") {
      return "Request failed (HTTP " + (response ? response.status : "?") + ")";
    }
    return result.error || result.message || result.msg ||
      (result.code ? String(result.code) : "") ||
      "Request failed (HTTP " + (response ? response.status : "?") + ")";
  }

  var TOKEN_KEY = "astikanAdminToken";
  var state = {
    table: "membership_enrollments",
    page: 1,
    pageSize: 25,
    search: "",
    columns: [],
    pk: "id",
    rows: [],
    total: 0,
    captchaToken: ""
  };

  var loginView = document.getElementById("loginView");
  var appView = document.getElementById("appView");
  var loginForm = document.getElementById("loginForm");
  var loginError = document.getElementById("loginError");
  var captchaQuestion = document.getElementById("captchaQuestion");
  var refreshCaptchaBtn = document.getElementById("refreshCaptchaBtn");
  var tableTitle = document.getElementById("tableTitle");
  var tableHead = document.getElementById("tableHead");
  var tableBody = document.getElementById("tableBody");
  var searchInput = document.getElementById("searchInput");
  var pagerInfo = document.getElementById("pagerInfo");
  var prevPageBtn = document.getElementById("prevPageBtn");
  var nextPageBtn = document.getElementById("nextPageBtn");
  var addRowBtn = document.getElementById("addRowBtn");
  var logoutBtn = document.getElementById("logoutBtn");
  var editModal = document.getElementById("editModal");
  var editForm = document.getElementById("editForm");
  var editModalTitle = document.getElementById("editModalTitle");
  var closeModalBtn = document.getElementById("closeModalBtn");
  var cancelEditBtn = document.getElementById("cancelEditBtn");

  var TABLE_LABELS = {
    users: "Users",
    membership_enrollments: "Membership Enrollments",
    member_service_requests: "Service Requests"
  };

  var JSON_FIELDS = { form_data: true, document_urls: true };

  function getToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setToken(token) {
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  function showLogin() {
    if (loginView) loginView.classList.remove("hidden");
    if (appView) appView.classList.add("hidden");
  }

  function showApp() {
    if (loginView) loginView.classList.add("hidden");
    if (appView) appView.classList.remove("hidden");
  }

  async function apiCall(payload, needsAuth) {
    if (!API) throw new Error("Supabase URL not configured in astikan-config.js");
    if (!anonKey || anonKey.indexOf("PASTE_") === 0) {
      throw new Error("Supabase anon key missing — check /assets/astikan-config.js");
    }
    var authToken = needsAuth ? getToken() : anonKey;
    if (needsAuth && !authToken) throw new Error("Session expired — please sign in again");

    var headers = {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: "Bearer " + authToken
    };
    var response = await fetch(API, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });
    var result = {};
    try {
      result = await response.json();
    } catch (e) {
      result = {};
    }
    if (!response.ok) {
      if (response.status === 401 && needsAuth) {
        setToken("");
        showLogin();
        loadCaptcha();
      }
      throw new Error(apiErrorMessage(result, response));
    }
    return result;
  }

  async function loadCaptcha() {
    if (!API || !anonKey) {
      if (captchaQuestion) captchaQuestion.textContent = "Config error";
      return;
    }
    try {
      var response = await fetch(API + "?action=captcha", {
        headers: { apikey: anonKey, Authorization: "Bearer " + anonKey }
      });
      var data = {};
      try { data = await response.json(); } catch (e) {}
      if (!response.ok) {
        throw new Error(apiErrorMessage(data, response));
      }
      state.captchaToken = data.token || "";
      if (captchaQuestion) captchaQuestion.textContent = data.question || "Captcha";
    } catch (e) {
      if (captchaQuestion) captchaQuestion.textContent = "Captcha unavailable";
      if (loginError) loginError.textContent = (e && e.message) || "Could not load captcha";
    }
  }

  function formatCell(col, value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") {
      var s = JSON.stringify(value);
      return s.length > 60 ? s.slice(0, 60) + "…" : s;
    }
    var str = String(value);
    var fmt = window.AstikanFormat;

    if (col === "created_at" || col === "updated_at") {
      return fmt ? fmt.formatIST(str) : str;
    }
    if (col === "member_name" && fmt) {
      return fmt.shortMemberName(str);
    }
    if ((col === "id" || col === "enrollment_id" || col === "uid") && fmt) {
      return fmt.shortId(str);
    }
    if (col === "request_code") return str;
    return str.length > 80 ? str.slice(0, 80) + "…" : str;
  }

  function renderTable() {
    if (tableTitle) {
      tableTitle.textContent = TABLE_LABELS[state.table] || state.table;
    }
    if (!tableHead || !tableBody) return;

    var displayCols = state.columns.slice(0, 10);
    tableHead.innerHTML = "<tr>" +
      displayCols.map(function (c) { return "<th>" + c + "</th>"; }).join("") +
      "<th>Actions</th></tr>";

    tableBody.innerHTML = state.rows.map(function (row) {
      var cells = displayCols.map(function (col) {
        var raw = row[col];
        var shown = formatCell(col, raw);
        var title = String(raw === null || raw === undefined ? "" : raw).replace(/'/g, "&#39;");
        return "<td title='" + title + "'>" + shown + "</td>";
      }).join("");
      var id = row[state.pk];
      return "<tr>" + cells +
        "<td class='admin-actions'>" +
        "<button class='admin-btn admin-btn-ghost admin-btn-sm' data-edit='" + id + "'>Edit</button>" +
        "<button class='admin-btn admin-btn-danger admin-btn-sm' data-delete='" + id + "'>Delete</button>" +
        "</td></tr>";
    }).join("");

    tableBody.querySelectorAll("[data-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openEditModal(btn.getAttribute("data-edit"));
      });
    });
    tableBody.querySelectorAll("[data-delete]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        deleteRow(btn.getAttribute("data-delete"));
      });
    });

    if (pagerInfo) {
      var from = state.total ? (state.page - 1) * state.pageSize + 1 : 0;
      var to = Math.min(state.page * state.pageSize, state.total);
      pagerInfo.textContent = "Showing " + from + "–" + to + " of " + state.total;
    }
    if (prevPageBtn) prevPageBtn.disabled = state.page <= 1;
    if (nextPageBtn) {
      nextPageBtn.disabled = state.page * state.pageSize >= state.total;
    }
  }

  async function loadRows() {
    var result = await apiCall({
      action: "list",
      table: state.table,
      page: state.page,
      pageSize: state.pageSize,
      search: state.search
    }, true);
    state.rows = result.rows || [];
    state.total = result.total || 0;
    state.columns = result.columns || [];
    state.pk = result.pk || "id";
    renderTable();
  }

  function openEditModal(id) {
    if (!editModal || !editForm) return;
    editModal.classList.remove("hidden");
    editForm.innerHTML = "";
    editForm.dataset.mode = id ? "edit" : "create";
    editForm.dataset.id = id || "";

    if (editModalTitle) {
      editModalTitle.textContent = id ? "Edit row" : "Add new row";
    }

    var fields = state.columns;
    if (!id) {
      buildFormFields(fields, {});
      return;
    }

    apiCall({ action: "get", table: state.table, id: id }, true).then(function (result) {
      buildFormFields(fields, result.row || {});
    }).catch(function (err) {
      alert(err.message);
      closeModal();
    });
  }

  function buildFormFields(columns, row) {
    if (!editForm) return;
    editForm.innerHTML = "";
    columns.forEach(function (col) {
      var wrap = document.createElement("div");
      wrap.className = "admin-field";
      var label = document.createElement("label");
      label.textContent = col;
      wrap.appendChild(label);

      var val = row[col];
      var isJson = JSON_FIELDS[col] || (typeof val === "object" && val !== null);

      if (isJson) {
        var ta = document.createElement("textarea");
        ta.name = col;
        ta.value = val ? JSON.stringify(val, null, 2) : "{}";
        if (col === state.pk && editForm.dataset.mode === "edit") ta.readOnly = true;
        wrap.appendChild(ta);
      } else {
        var input = document.createElement("input");
        input.name = col;
        input.value = val === null || val === undefined ? "" : String(val);
        if (col === state.pk && editForm.dataset.mode === "edit") input.readOnly = true;
        wrap.appendChild(input);
      }
      editForm.appendChild(wrap);
    });
  }

  function closeModal() {
    if (editModal) editModal.classList.add("hidden");
  }

  function collectFormRow() {
    var row = {};
    if (!editForm) return row;
    editForm.querySelectorAll("input, textarea").forEach(function (el) {
      row[el.name] = el.value;
    });
    return row;
  }

  async function saveRow() {
    var mode = editForm.dataset.mode;
    var id = editForm.dataset.id;
    var row = collectFormRow();
    try {
      if (mode === "create") {
        await apiCall({ action: "create", table: state.table, row: row }, true);
      } else {
        await apiCall({ action: "update", table: state.table, id: id, row: row }, true);
      }
      closeModal();
      await loadRows();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteRow(id) {
    if (!confirm("Delete this row permanently?")) return;
    try {
      await apiCall({ action: "delete", table: state.table, id: id }, true);
      await loadRows();
    } catch (err) {
      alert(err.message);
    }
  }

  function bindNav() {
    document.querySelectorAll("[data-table]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("[data-table]").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        state.table = btn.getAttribute("data-table");
        state.page = 1;
        loadRows();
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (loginError) loginError.textContent = "";
      try {
        var fd = new FormData(loginForm);
        if (!state.captchaToken) {
          throw new Error("Captcha not loaded — click ↻ and try again");
        }
        var captchaAnswer = String(fd.get("captcha") || "").trim();
        if (!captchaAnswer) {
          throw new Error("Enter the captcha answer");
        }
        var result = await apiCall({
          action: "login",
          username: String(fd.get("username") || "").trim(),
          password: String(fd.get("password") || ""),
          captchaToken: state.captchaToken,
          captchaAnswer: captchaAnswer
        }, false);
        setToken(result.token);
        showApp();
        await loadRows();
      } catch (err) {
        if (loginError) loginError.textContent = err.message;
        loadCaptcha();
      }
    });
  }

  if (refreshCaptchaBtn) refreshCaptchaBtn.addEventListener("click", loadCaptcha);
  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        state.search = searchInput.value.trim();
        state.page = 1;
        loadRows();
      }
    });
  }
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", function () {
      if (state.page > 1) { state.page -= 1; loadRows(); }
    });
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", function () {
      state.page += 1;
      loadRows();
    });
  }
  if (addRowBtn) addRowBtn.addEventListener("click", function () { openEditModal(null); });
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      setToken("");
      showLogin();
      loadCaptcha();
    });
  }
  if (editForm) {
    editForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveRow();
    });
  }
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeModal);

  bindNav();

  if (getToken()) {
    showApp();
    loadRows().catch(function () {
      setToken("");
      showLogin();
      loadCaptcha();
    });
  } else {
    showLogin();
    loadCaptcha();
  }
})();