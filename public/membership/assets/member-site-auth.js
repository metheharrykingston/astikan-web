(function () {
  var assetsReady = null;
  var firebaseReady = null;
  var siteRecaptchaVerifier = null;
  var siteConfirmationResult = null;

  function assetsBase() {
    var scripts = document.querySelectorAll('script[src*="member-site-auth.js"], script[src*="member-site-login.js"]');
    if (scripts.length) {
      return scripts[scripts.length - 1].src.replace(/[^/]+$/, "");
    }
    return "/membership/assets/";
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "1") return resolve();
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      var tag = document.createElement("script");
      tag.src = src;
      tag.onload = function () {
        tag.dataset.loaded = "1";
        resolve();
      };
      tag.onerror = reject;
      document.head.appendChild(tag);
    });
  }

  function ensureCss() {
    var href = assetsBase() + "member-site-auth.css";
    if (document.querySelector('link[href*="member-site-auth.css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  async function ensureAssets() {
    if (assetsReady) return assetsReady;
    assetsReady = (async function () {
      ensureCss();
      if (!window.ASTIKAN_CONFIG) {
        await loadScript(assetsBase() + "astikan-config.js");
      }
      if (!window.AstikanEnrollmentStore) {
        await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
        await loadScript(assetsBase() + "member-enrollment-store.js");
      }
      await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js");
      await loadScript(assetsBase() + "otp-autofill.js");
      await loadScript(assetsBase() + "firebase-phone-errors.js");
    })();
    return assetsReady;
  }

  async function ensureFirebase() {
    await ensureAssets();
    if (firebaseReady) return firebaseReady;

    firebaseReady = (async function () {
      var config = window.ASTIKAN_CONFIG && window.ASTIKAN_CONFIG.firebase;
      if (!config || !config.apiKey) {
        throw new Error("Firebase is not configured.");
      }
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      var auth = firebase.auth();
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      return { auth: auth, provider: provider };
    })();

    return firebaseReady;
  }

  function setAuthStatus(message, isError) {
    var status = document.getElementById("siteAuthStatus");
    if (!status) return;
    status.textContent = message || "";
    status.classList.toggle("error", Boolean(isError));
  }

  function setAuthMethod(method) {
    var tabs = document.querySelectorAll(".member-site-auth-tab");
    var googlePanel = document.getElementById("siteAuthPanelGoogle");
    var phonePanel = document.getElementById("siteAuthPanelPhone");

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].getAttribute("data-auth-method") === method);
    }
    if (googlePanel) googlePanel.classList.toggle("active", method === "google");
    if (phonePanel) phonePanel.classList.toggle("active", method === "phone");
    if (method === "google") resetPhoneStep();
  }

  function resetPhoneStep() {
    if (window.AstikanOtpAutofill) window.AstikanOtpAutofill.stop();
    var step1 = document.getElementById("sitePhoneStep1");
    var step2 = document.getElementById("sitePhoneStep2");
    var otp = document.getElementById("siteAuthOtp");
    if (step1) step1.style.display = "block";
    if (step2) step2.style.display = "none";
    if (otp) otp.value = "";
    siteConfirmationResult = null;
  }

  function resetAuthModal() {
    setAuthMethod("google");
    resetPhoneStep();
    var phone = document.getElementById("siteAuthPhone");
    if (phone) phone.value = "";
    setAuthStatus("");
    siteRecaptchaVerifier = null;
  }

  function formatPhoneForFirebase(raw) {
    var digits = (raw || "").replace(/\D/g, "");
    if (digits.length === 12 && digits.indexOf("91") === 0) digits = digits.slice(2);
    if (digits.length === 11 && digits[0] === "0") digits = digits.slice(1);
    if (digits.length !== 10) return null;
    return "+91" + digits;
  }

  function dashboardUrl() {
    var stored = null;
    try {
      stored = JSON.parse(localStorage.getItem("astikanLastEnrollment") || "null");
    } catch (e) {}
    var id = stored && stored.enrollmentId;
    return id
      ? "/membership/membership-dashboard.html?enrollmentId=" + encodeURIComponent(id)
      : "/membership/membership-dashboard.html";
  }

  async function completeSiteLogin(user, loginMethod) {
    if (window.astikanPersistMemberSession) {
      window.astikanPersistMemberSession(user);
    }

    if (window.AstikanEnrollmentStore) {
      await window.AstikanEnrollmentStore.restoreEnrollmentForUser(user);
    }

    closeMemberLoginModal();
    document.dispatchEvent(new CustomEvent("astikan-auth-changed", {
      detail: { method: loginMethod || "login" }
    }));

    if (window.astikanAfterMemberLogin) {
      await window.astikanAfterMemberLogin(user);
      return;
    }

    window.location.href = dashboardUrl();
  }

  function injectModal() {
    if (document.getElementById("memberSiteLoginModal")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      '<div class="member-site-login-overlay" id="memberSiteLoginModal" aria-hidden="true">' +
        '<div class="member-site-login-card" role="dialog" aria-modal="true" aria-labelledby="memberSiteLoginTitle">' +
          '<button class="member-site-login-close" id="memberSiteLoginClose" type="button" aria-label="Close">' +
            '<i class="bi bi-x-lg"></i>' +
          "</button>" +
          '<h3 class="member-site-login-title" id="memberSiteLoginTitle">Login to Astikan</h3>' +
          '<p class="member-site-login-desc">Choose how you want to verify your identity.</p>' +
          '<div class="member-site-auth-tabs">' +
            '<button class="member-site-auth-tab active" data-auth-method="google" type="button">' +
              '<i class="bi bi-google"></i> Google' +
            "</button>" +
            '<button class="member-site-auth-tab" data-auth-method="phone" type="button">' +
              '<i class="bi bi-phone"></i> Phone' +
            "</button>" +
          "</div>" +
          '<div class="member-site-auth-panel active" id="siteAuthPanelGoogle">' +
            '<p class="member-site-auth-panel-desc">Continue with your Google account.</p>' +
            '<button class="member-site-btn-google" id="siteGoogleLoginBtn" type="button">' +
              '<i class="bi bi-google" style="color:#DB4437;"></i> Continue with Google' +
            "</button>" +
          "</div>" +
          '<div class="member-site-auth-panel" id="siteAuthPanelPhone">' +
            '<p class="member-site-auth-panel-desc">We will send a one-time password to your mobile.</p>' +
            '<div id="sitePhoneStep1">' +
              '<div class="member-site-phone-wrap">' +
                '<span class="member-site-phone-prefix">+91</span>' +
                '<input class="member-site-input" id="siteAuthPhone" inputmode="numeric" maxlength="10" placeholder="98765 43210" type="tel"/>' +
              "</div>" +
              '<div id="siteRecaptchaContainer"></div>' +
              '<button class="member-site-btn-primary" id="siteSendOtpBtn" type="button">Send OTP</button>' +
            "</div>" +
            '<div id="sitePhoneStep2" style="display:none;">' +
              '<input autocomplete="one-time-code" class="member-site-input" id="siteAuthOtp" inputmode="numeric" maxlength="6" placeholder="6-digit OTP" type="tel" style="width:100%;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:0.5rem;"/>' +
              '<button class="member-site-btn-primary" id="siteVerifyOtpBtn" type="button">Verify &amp; Continue</button>' +
              '<button class="member-site-auth-link" id="siteResetPhoneBtn" type="button">Change phone number</button>' +
            "</div>" +
          "</div>" +
          '<p class="member-site-auth-status" id="siteAuthStatus"></p>' +
        "</div>" +
      "</div>"
    );

    var overlay = document.getElementById("memberSiteLoginModal");
    var closeBtn = document.getElementById("memberSiteLoginClose");

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeMemberLoginModal();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeMemberLoginModal);

    document.querySelectorAll(".member-site-auth-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        setAuthMethod(tab.getAttribute("data-auth-method"));
        setAuthStatus("");
      });
    });

    var phoneInput = document.getElementById("siteAuthPhone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
      });
    }

    document.getElementById("siteGoogleLoginBtn").addEventListener("click", siteLoginWithGoogle);
    document.getElementById("siteSendOtpBtn").addEventListener("click", siteSendPhoneOtp);
    document.getElementById("siteVerifyOtpBtn").addEventListener("click", siteVerifyPhoneOtp);
    document.getElementById("siteResetPhoneBtn").addEventListener("click", function () {
      resetPhoneStep();
      setAuthStatus("Enter your mobile number to receive OTP.");
    });
  }

  async function openMemberLoginModal() {
    try {
      await ensureAssets();
      injectModal();
      resetAuthModal();
      var overlay = document.getElementById("memberSiteLoginModal");
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } catch (error) {
      alert((error && error.message) || "Login could not be opened. Please refresh and try again.");
    }
  }

  function closeMemberLoginModal() {
    var overlay = document.getElementById("memberSiteLoginModal");
    if (!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    resetAuthModal();
  }

  async function siteLoginWithGoogle() {
    var btn = document.getElementById("siteGoogleLoginBtn");
    var original = btn ? btn.innerHTML : "";
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Signing in...';
    }

    try {
      setAuthStatus("Opening Google sign-in...");
      var fb = await ensureFirebase();
      var result = await fb.auth.signInWithPopup(fb.provider);
      await completeSiteLogin(result.user, "Google sign-in");
    } catch (error) {
      if (error && error.code !== "auth/popup-closed-by-user") {
        var host = window.location.hostname;
        if (error.code === "auth/unauthorized-domain") {
          setAuthStatus(
            "Firebase blocked domain: " + host + ". Add " + host + ", astikan.com and www.astikan.com in Firebase Authorized domains.",
            true
          );
        } else {
          setAuthStatus((error && error.message) || "Google sign-in failed.", true);
        }
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    }
  }

  async function siteSendPhoneOtp() {
    var phoneInput = document.getElementById("siteAuthPhone");
    var phone = formatPhoneForFirebase(phoneInput ? phoneInput.value : "");
    if (!phone) {
      setAuthStatus("Enter a valid 10-digit Indian mobile number.", true);
      return;
    }

    try {
      setAuthStatus("Sending OTP to " + phone + "...");
      var fb = await ensureFirebase();
      if (window.AstikanFirebasePhone) {
        siteRecaptchaVerifier = await window.AstikanFirebasePhone.clearRecaptcha(
          siteRecaptchaVerifier,
          "siteRecaptchaContainer"
        );
        siteRecaptchaVerifier = await window.AstikanFirebasePhone.createRecaptchaVerifier(
          "siteRecaptchaContainer",
          { size: "normal" }
        );
      } else if (!siteRecaptchaVerifier) {
        siteRecaptchaVerifier = new firebase.auth.RecaptchaVerifier("siteRecaptchaContainer", {
          size: "normal",
          callback: function () {}
        });
        await siteRecaptchaVerifier.render();
      }
      siteConfirmationResult = await fb.auth.signInWithPhoneNumber(phone, siteRecaptchaVerifier);
      document.getElementById("sitePhoneStep1").style.display = "none";
      document.getElementById("sitePhoneStep2").style.display = "block";
      setAuthStatus("OTP sent to " + phone + ". It should auto-fill when the SMS arrives.");
      if (window.AstikanOtpAutofill) {
        window.AstikanOtpAutofill.start({
          input: document.getElementById("siteAuthOtp"),
          onFilled: function () {
            setAuthStatus("OTP filled from SMS. Tap Verify & Continue.");
          }
        });
      }
    } catch (error) {
      if (window.AstikanFirebasePhone) {
        siteRecaptchaVerifier = await window.AstikanFirebasePhone.clearRecaptcha(
          siteRecaptchaVerifier,
          "siteRecaptchaContainer"
        );
        setAuthStatus(window.AstikanFirebasePhone.message(error), true);
      } else {
        setAuthStatus((error && error.message) || "Unable to send OTP.", true);
        siteRecaptchaVerifier = null;
      }
    }
  }

  async function siteVerifyPhoneOtp() {
    var otpInput = document.getElementById("siteAuthOtp");
    var otp = window.AstikanFirebasePhone
      ? window.AstikanFirebasePhone.normalizeOtpCode(otpInput ? otpInput.value : "")
      : (otpInput ? otpInput.value.replace(/\D/g, "") : "");
    if (!siteConfirmationResult) {
      setAuthStatus("Please tap Send OTP first.", true);
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setAuthStatus("Enter the 6-digit OTP from your SMS.", true);
      if (otpInput) otpInput.focus();
      return;
    }

    var btn = document.getElementById("siteVerifyOtpBtn");
    var original = btn ? btn.textContent : "";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Verifying...";
    }

    try {
      var result = await siteConfirmationResult.confirm(otp);
      await completeSiteLogin(result.user, "Mobile OTP");
    } catch (error) {
      setAuthStatus(
        window.AstikanFirebasePhone
          ? window.AstikanFirebasePhone.message(error)
          : ((error && error.message) || "Invalid OTP."),
        true
      );
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = original;
      }
    }
  }

  window.openMemberLoginModal = openMemberLoginModal;
  window.closeMemberLoginModal = closeMemberLoginModal;
})();
