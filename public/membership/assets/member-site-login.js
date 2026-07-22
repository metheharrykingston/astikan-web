(function () {
  var authReady = null;

  function readJson(storage, key) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function assetsBase() {
    var scripts = document.querySelectorAll('script[src*="member-site-login.js"], script[src*="offcanvas-auth.js"]');
    if (scripts.length) {
      return scripts[scripts.length - 1].src.replace(/[^/]+$/, "");
    }
    return "/membership/assets/";
  }

  function ensureSiteAuth() {
    if (authReady) return authReady;
    if (typeof window.openMemberLoginModal === "function") {
      authReady = Promise.resolve();
      return authReady;
    }
    authReady = new Promise(function (resolve, reject) {
      var tag = document.createElement("script");
      tag.src = assetsBase() + "member-site-auth.js";
      tag.onload = function () { resolve(); };
      tag.onerror = reject;
      document.head.appendChild(tag);
    });
    return authReady;
  }

  function persistMemberSession(user) {
    var session = {
      uid: user.uid,
      email: user.email || null,
      name: user.displayName || null,
      avatar: user.photoURL || null,
      phone: user.phoneNumber || null
    };
    try {
      localStorage.setItem("astikanMemberSession", JSON.stringify(session));
      sessionStorage.setItem("astikan_logged_in", "true");
      sessionStorage.setItem("astikan_member_session", JSON.stringify(session));
    } catch (e) {}
    document.dispatchEvent(new CustomEvent("astikan-auth-changed"));
    return session;
  }

  async function openMemberLogin(button) {
    try {
      await ensureSiteAuth();
      if (button) button.disabled = true;
      await window.openMemberLoginModal();
    } catch (error) {
      alert((error && error.message) || "Login could not be opened. Please refresh and try again.");
    } finally {
      if (button) button.disabled = false;
    }
  }

  window.astikanMemberGoogleLogin = openMemberLogin;
  window.astikanPersistMemberSession = persistMemberSession;

  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".astikan-member-login-btn, .astikan-google-login-btn");
    if (!btn || btn.disabled) return;
    e.preventDefault();
    openMemberLogin(btn);
  });
})();
