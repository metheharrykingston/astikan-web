(function () {
  function quickLinks() {
    return [
      { id: "lab-tests", serviceId: "lab-test", label: "Lab Tests", icon: "bi-eyedropper" },
      { id: "find-doctors", serviceId: "opd", label: "OPD Consultation", icon: "bi-person-badge" },
      { id: "teleconsultation", serviceId: "tele", label: "Teleconsultation", icon: "bi-camera-video" },
      { id: "medicine", serviceId: "medicine", label: "Medicine Delivery", icon: "bi-capsule" },
      { id: "finance", serviceId: "finance", label: "Medical Finance", icon: "bi-cash-stack" },
      { id: "insurance", serviceId: "insurance", label: "Insurance Help", icon: "bi-shield-check" },
      { id: "ambulance", serviceId: "ambulance", label: "Ambulance", icon: "bi-truck" },
      { id: "grievance", serviceId: "grievance", label: "Grievance", icon: "bi-chat-left-text" },
      { id: "contact", serviceId: "contact", label: "Contact Support", icon: "bi-telephone" }
    ];
  }

  var DASHBOARD_LINKS = [
    { id: "dashboard", label: "Overview", icon: "bi-grid-1x2", rootPage: "membership-dashboard.html", memberPage: "../membership-dashboard.html" },
    { id: "plan-details", label: "Plan Details", icon: "bi-card-checklist", rootPage: "member/plan-details.html", memberPage: "plan-details.html" },
    { id: "enroll-services", label: "Enroll Services", icon: "bi-heart-pulse", rootPage: "member/enroll-services.html", memberPage: "enroll-services.html" },
    { id: "claims", label: "Claims", icon: "bi-file-earmark-medical", rootPage: "member/claims.html", memberPage: "claims.html" }
  ];

  function isMemberFolder() {
    return /\/member(\/|$)/.test(window.location.pathname);
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function enrollmentQuery() {
    var id = new URLSearchParams(window.location.search).get("enrollmentId");
    if (!id) {
      var stored = readJson("astikanLastEnrollment");
      id = stored && stored.enrollmentId;
    }
    return id ? "?enrollmentId=" + encodeURIComponent(id) : "";
  }

  function dashboardHome() {
    var base = isMemberFolder() ? "../membership-dashboard.html" : "membership-dashboard.html";
    return base + enrollmentQuery();
  }

  function serviceBrowseUrl(serviceId) {
    if (window.MemberPortalRoutes) {
      return window.MemberPortalRoutes.portalEntryUrl(serviceId);
    }
    return (isMemberFolder() ? "browse.html" : "member/browse.html") + "?service=" + encodeURIComponent(serviceId);
  }

  function dashboardPageUrl(link) {
    var base = isMemberFolder() ? link.memberPage : link.rootPage;
    return base + enrollmentQuery();
  }

  function serviceRequestUrl(serviceId, extras) {
    if (window.MemberPortalRoutes && typeof window.MemberPortalRoutes.requestUrl === "function") {
      return window.MemberPortalRoutes.requestUrl(serviceId, extras);
    }
    var base = isMemberFolder() ? "request.html" : "member/request.html";
    var parts = ["service=" + encodeURIComponent(serviceId || "")];
    var query = enrollmentQuery();
    if (query) parts.push(query.slice(1));
    return base + "?" + parts.join("&");
  }

  function getCurrentPage() {
    if (isMemberFolder()) {
      if (/\/browse\.html$/i.test(window.location.pathname)) {
        var browseService = new URLSearchParams(window.location.search).get("service");
        if (browseService) return browseService === "lab-test" ? "lab-tests" : browseService;
      }
      var serviceId = new URLSearchParams(window.location.search).get("service");
      if (serviceId && window.MemberPortalRoutes) {
        var svc = window.MemberPortalRoutes.getService(serviceId);
        if (svc) return svc.page;
      }
    }
    var bodyPage = document.body.getAttribute("data-member-page");
    if (bodyPage) return bodyPage;
    return "dashboard";
  }

  function shellExists() {
    return Boolean(document.getElementById("dashSidebar"));
  }

  function headerExists() {
    return Boolean(document.getElementById("dashHeader"));
  }

  function buildDashboardSection(currentPage) {
    var html = '<div class="dash-nav-section">Dashboard</div>';
    for (var i = 0; i < DASHBOARD_LINKS.length; i++) {
      var item = DASHBOARD_LINKS[i];
      var active = currentPage === item.id ? " active" : "";
      html +=
        '<a class="dash-nav-link' + active + '" href="' + dashboardPageUrl(item) + '">' +
        '<i class="bi ' + item.icon + '"></i> ' + item.label + "</a>";
    }
    return html;
  }

  function buildQuickLinksSection(currentPage) {
    var html = '<div class="dash-nav-section">Quick Links</div>';
    var links = quickLinks();
    for (var i = 0; i < links.length; i++) {
      var item = links[i];
      var active = currentPage === item.id ? " active" : "";
      html +=
        '<a class="dash-nav-link' + active + '" href="' + serviceBrowseUrl(item.serviceId) + '">' +
        '<i class="bi ' + item.icon + '"></i> ' + item.label + "</a>";
    }
    return html;
  }

  function buildAccountSection() {
    return (
      '<div class="dash-nav-section">Account</div>' +
      '<button class="dash-nav-link dash-signout-btn" id="dashSignOutBtn" type="button">' +
      '<i class="bi bi-box-arrow-right"></i> Sign Out</button>'
    );
  }

  function homeUrl() {
    return isMemberFolder() ? "../index.html" : "index.html";
  }

  function clearMemberSession() {
    try {
      localStorage.removeItem("astikanMemberSession");
      localStorage.removeItem("astikanLastEnrollment");
      sessionStorage.removeItem("astikan_logged_in");
      sessionStorage.removeItem("astikan_member_session");
    } catch (e) {}
  }

  function signOutMember() {
    clearMemberSession();
    var home = homeUrl();

    function redirectHome() {
      window.location.href = home;
    }

    var config = window.ASTIKAN_CONFIG && window.ASTIKAN_CONFIG.firebase;
    if (!config || !config.apiKey) {
      redirectHome();
      return;
    }

    if (window.firebase && firebase.auth) {
      firebase.auth().signOut().finally(redirectHome);
      return;
    }

    var appScript = document.createElement("script");
    appScript.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
    appScript.onload = function () {
      var authScript = document.createElement("script");
      authScript.src = "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
      authScript.onload = function () {
        try {
          if (!firebase.apps.length) firebase.initializeApp(config);
          firebase.auth().signOut().finally(redirectHome);
        } catch (e) {
          redirectHome();
        }
      };
      authScript.onerror = redirectHome;
      document.head.appendChild(authScript);
    };
    appScript.onerror = redirectHome;
    document.head.appendChild(appScript);
  }

  function buildHeaderHtml() {
    return (
      '<header class="dash-header" id="dashHeader">' +
        '<div class="dash-header-inner">' +
          '<a class="dash-brand" href="' + dashboardHome() + '">' +
            '<img alt="Astikan Health" src="' + (isMemberFolder() ? "../" : "") + 'logo.avif"/>' +
          "</a>" +
          '<div class="dash-header-actions">' +
            '<div class="dash-user-chip" id="headerUserChip">' +
              '<img alt="" id="headerAvatar" src="' + (isMemberFolder() ? "../" : "") + 'assets/profile_img/default.avif"/>' +
              '<strong id="headerName">Member</strong>' +
            "</div>" +
            '<button aria-controls="dashSidebar" aria-label="Open menu" class="dash-hamburger" data-bs-target="#dashSidebar" data-bs-toggle="offcanvas" type="button">' +
              '<i class="bi bi-list"></i>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</header>"
    );
  }

  function injectShell() {
    if (shellExists() && headerExists()) return;

    var shellHtml = "";
    if (!headerExists()) shellHtml += buildHeaderHtml();
    if (!shellExists()) {
      shellHtml +=
        '<div aria-hidden="true" class="dash-overlay-backdrop" id="dashBackdrop"></div>' +
        '<div aria-labelledby="dashSidebarLabel" class="offcanvas offcanvas-start dash-offcanvas" id="dashSidebar" tabindex="-1">' +
          '<div class="offcanvas-header">' +
            '<h5 class="offcanvas-title fw-bold" id="dashSidebarLabel">My Membership</h5>' +
            '<button aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas" type="button"></button>' +
          "</div>" +
          '<div class="offcanvas-body" id="dashSidebarNav"></div>' +
        "</div>";
    }

    if (shellHtml) document.body.insertAdjacentHTML("afterbegin", shellHtml);

    var nav = document.getElementById("dashSidebarNav");
    var currentPage = getCurrentPage();
    if (nav) {
      nav.innerHTML =
        '<div class="dash-sidebar-profile">' +
          '<img alt="" id="sidebarAvatar" src="' + (isMemberFolder() ? "../" : "") + 'assets/profile_img/default.avif"/>' +
          "<div>" +
            '<h6 id="sidebarName">Member</h6>' +
            '<small id="sidebarPlan">Astikan Member</small>' +
          "</div>" +
        "</div>" +
        buildDashboardSection(currentPage) +
        buildQuickLinksSection(currentPage) +
        buildAccountSection();
    }
  }

  function populateIdentity() {
    var session = readJson("astikanMemberSession");
    var stored = readJson("astikanLastEnrollment");
    var fallback = "assets/profile_img/default.avif";
    var avatar = (session && session.avatar) || fallback;
    var name = (session && (session.name || session.email)) || "Member";
    var plan = (stored && stored.plan) || (session && session.email) || "Astikan Member";

    if (isMemberFolder()) {
      if (avatar.indexOf("http") !== 0 && avatar.indexOf("../") !== 0) {
        avatar = "../" + avatar;
      }
    }

    ["headerAvatar", "sidebarAvatar"].forEach(function (id) {
      var img = document.getElementById(id);
      if (img) img.src = avatar;
    });

    var headerName = document.getElementById("headerName");
    if (headerName) headerName.textContent = name;

    var sidebarName = document.getElementById("sidebarName");
    if (sidebarName) sidebarName.textContent = name;

    var sidebarPlan = document.getElementById("sidebarPlan");
    if (sidebarPlan) sidebarPlan.textContent = plan;
  }

  function setupSignOut() {
    var btn = document.getElementById("dashSignOutBtn");
    if (!btn || btn.dataset.wired) return;
    btn.dataset.wired = "1";
    btn.addEventListener("click", function () {
      btn.disabled = true;
      var sidebar = document.getElementById("dashSidebar");
      if (sidebar && window.bootstrap) {
        var instance = bootstrap.Offcanvas.getInstance(sidebar);
        if (instance) instance.hide();
      }
      signOutMember();
    });
  }

  function setupSidebarBackdrop() {
    var sidebar = document.getElementById("dashSidebar");
    var backdrop = document.getElementById("dashBackdrop");
    if (!sidebar || !backdrop) return;

    sidebar.addEventListener("show.bs.offcanvas", function () {
      backdrop.classList.add("show");
    });
    sidebar.addEventListener("hidden.bs.offcanvas", function () {
      backdrop.classList.remove("show");
    });
    backdrop.addEventListener("click", function () {
      var instance = window.bootstrap && bootstrap.Offcanvas.getInstance(sidebar);
      if (instance) instance.hide();
    });
  }

  function init() {
    if (!document.body.classList.contains("dash-body")) return;
    injectShell();
    var brand = document.querySelector(".dash-brand");
    if (brand) brand.setAttribute("href", dashboardHome());
    populateIdentity();
    setupSignOut();
    setupSidebarBackdrop();
  }

  window.MemberPortalNav = {
    serviceRequestUrl: serviceRequestUrl,
    dashboardHome: dashboardHome,
    populateIdentity: populateIdentity,
    signOut: signOutMember,
    quickLinks: quickLinks,
    dashboardPageUrl: dashboardPageUrl
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();