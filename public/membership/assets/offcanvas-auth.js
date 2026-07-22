(function () {
  function readJson(storage, key) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function getMemberSession() {
    var local = readJson(localStorage, "astikanMemberSession");
    if (local && local.uid) return local;
    var session = readJson(sessionStorage, "astikan_member_session");
    if (session && session.uid) return session;
    return null;
  }

  function dashboardUrl() {
    var stored = readJson(localStorage, "astikanLastEnrollment");
    var id = stored && stored.enrollmentId;
    return id
      ? "/membership/membership-dashboard.html?enrollmentId=" + encodeURIComponent(id)
      : "/membership/membership-dashboard.html";
  }

  function closeOffcanvas() {
    var offcanvasEl = document.getElementById("offcanvasMenu");
    if (!offcanvasEl || !window.bootstrap) return;
    var instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (instance) instance.hide();
  }

  function startMemberLogin(button) {
    closeOffcanvas();
    if (typeof window.astikanMemberGoogleLogin === "function") {
      window.astikanMemberGoogleLogin(button);
      return;
    }
    if (typeof window.openMemberLoginModal === "function") {
      window.openMemberLoginModal();
      return;
    }
    alert("Login is loading. Please try again in a moment.");
  }

  function removeLegacyOffcanvasFooter(nav) {
    if (!nav) return;
    nav.querySelectorAll('a.btn-danger[href*="download-app"]').forEach(function (el) {
      el.remove();
    });
    nav.querySelectorAll(".user-profile-box").forEach(function (el) {
      el.remove();
    });
    var consult = nav.querySelector("#consultationBtn");
    if (consult) consult.remove();
  }

  function renderAuthSlot(slot) {
    var session = getMemberSession();
    slot.innerHTML = "";

    if (!session) {
      var loginBtn = document.createElement("button");
      loginBtn.type = "button";
      loginBtn.className = "btn offcanvas-login-btn w-100 astikan-member-login-btn";
      loginBtn.id = "offcanvasLoginBtn";
      loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i> Login';
      loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        startMemberLogin(loginBtn);
      });
      slot.appendChild(loginBtn);
      return;
    }

    var name = session.name || session.email || "Member";
    var avatar = session.avatar || "/membership/assets/profile_img/default.avif";
    if (avatar.indexOf("http") !== 0 && avatar.indexOf("/") !== 0) {
      avatar = "/" + avatar.replace(/^\.\//, "");
    }

    var profile = document.createElement("a");
    profile.className = "offcanvas-profile-card";
    profile.href = dashboardUrl();
    profile.innerHTML =
      '<img alt="" class="offcanvas-profile-avatar" src="' + avatar + '"/>' +
      '<div class="offcanvas-profile-text">' +
      '<strong>' + name + "</strong>" +
      "<small>View profile &amp; dashboard</small>" +
      "</div>" +
      '<i class="bi bi-chevron-right offcanvas-profile-arrow"></i>';
    slot.appendChild(profile);
  }

  function initOffcanvasAuth() {
    var offcanvas = document.getElementById("offcanvasMenu");
    if (!offcanvas) return;

    var body = offcanvas.querySelector(".offcanvas-body, .custom-offcanvas-body");
    if (!body) return;

    var nav = body.querySelector("nav");
    if (!nav) return;

    removeLegacyOffcanvasFooter(nav);

    var slot = nav.querySelector("#offcanvasAuthSlot");
    if (!slot) {
      slot = document.createElement("div");
      slot.id = "offcanvasAuthSlot";
      slot.className = "offcanvas-auth-slot mt-2";
      nav.appendChild(slot);
    }

    renderAuthSlot(slot);
  }

  window.initOffcanvasAuth = initOffcanvasAuth;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOffcanvasAuth);
  } else {
    initOffcanvasAuth();
  }

  document.addEventListener("astikan-auth-changed", initOffcanvasAuth);

  window.addEventListener("storage", function (e) {
    if (e.key === "astikanMemberSession" || e.key === "astikanLastEnrollment") {
      initOffcanvasAuth();
    }
  });
})();
