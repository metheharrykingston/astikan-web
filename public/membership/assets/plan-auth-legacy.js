(function () {
  var config = window.ASTIKAN_CONFIG || {};
  var firebaseConfig = config.firebase || {};
  var supabaseConfig = config.supabase || {};
  var planPrices = config.planPrices || {};

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  var auth = firebase.auth();
  var googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.addScope("profile");
  googleProvider.addScope("email");

  var supabaseClient = null;
  if (supabaseConfig.url && supabaseConfig.anonKey && supabaseConfig.anonKey.indexOf("PASTE_") !== 0) {
    supabaseClient = supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }

  function setAuthStatus(message, isError, isLoading) {
    var status = document.getElementById("authStatus");
    if (!status) return;
    if (isLoading) {
      status.innerHTML =
        '<span class="auth-status-loading"><span class="auth-spinner" aria-hidden="true"></span> ' +
        message +
        "</span>";
    } else {
      status.textContent = message;
    }
    status.classList.toggle("error", Boolean(isError));
    status.classList.toggle("loading", Boolean(isLoading));
  }

  window.setAuthStatus = setAuthStatus;

  function setAuthBusy(busy) {
    var modal = document.getElementById("loginModal");
    if (modal) modal.classList.toggle("auth-modal-busy", Boolean(busy));
    var googleBtn = modal && modal.querySelector(".btn-google");
    var verifyBtn = modal && modal.querySelector("#phoneStep2 .btn-primary");
    if (googleBtn) googleBtn.disabled = Boolean(busy);
    if (verifyBtn) verifyBtn.disabled = Boolean(busy);
  }

  function formatPhoneForFirebase(raw) {
    var digits = (raw || "").replace(/\D/g, "");
    if (digits.length === 12 && digits.indexOf("91") === 0) {
      digits = digits.slice(2);
    }
    if (digits.length === 11 && digits[0] === "0") {
      digits = digits.slice(1);
    }
    if (digits.length !== 10) {
      return null;
    }
    return "+91" + digits;
  }

  function normalizeKey(text, fallback) {
    return (text || fallback || "field")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  function getFieldKey(form, field, index) {
    var group = field.closest(".form-group");
    var labelText =
      (group && group.querySelector(".label") ? group.querySelector(".label").textContent.trim() : "") ||
      (form.querySelector('label[for="' + field.id + '"]') ? form.querySelector('label[for="' + field.id + '"]').textContent.trim() : "") ||
      field.getAttribute("placeholder") ||
      field.id ||
      "field_" + (index + 1);

    return field.name || field.id || normalizeKey(labelText, "field_" + (index + 1));
  }

  function buildFormData() {
    var form = document.getElementById("enrollmentForm");
    var planTitle = document.querySelector(".plan-title");
    var data = {
      pageTitle: document.title,
      plan: planTitle ? planTitle.textContent.trim() : "",
      conditions: []
    };

    if (!form) return data;

    var elements = form.querySelectorAll("input, select, textarea");
    for (var i = 0; i < elements.length; i++) {
      var field = elements[i];
      var type = (field.type || "").toLowerCase();
      if (type === "button" || type === "submit" || type === "reset" || type === "hidden") continue;
      var key = getFieldKey(form, field, i);

      if (type === "checkbox") {
        if (field.classList.contains("chip-check")) {
          if (field.checked) {
            var chipLabel = form.querySelector('label[for="' + field.id + '"]');
            if (chipLabel) data.conditions.push(chipLabel.textContent.trim());
          }
          continue;
        }
        data[key] = field.checked;
        continue;
      }

      if (type === "file") {
        var files = field.files || [];
        data[key] = [];
        for (var j = 0; j < files.length; j++) {
          data[key].push({
            name: files[j].name,
            size: files[j].size,
            type: files[j].type
          });
        }
        continue;
      }

      if (field.id === "fieldAadhaar" && field.dataset && field.dataset.raw) {
        data[key] = field.dataset.raw;
      } else {
        data[key] = field.value;
      }
    }

    return data;
  }

  function getPlanName() {
    var planTitle = document.querySelector(".plan-title");
    return planTitle ? planTitle.textContent.trim() : "Membership Plan";
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function buildEnrollmentCode() {
    if (window.AstikanFormat && window.AstikanFormat.generateEnrollmentCode) {
      return window.AstikanFormat.generateEnrollmentCode(8);
    }
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var code = "";
    for (var i = 0; i < 8; i += 1) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async function uploadEnrollmentDocuments(user, enrollmentId) {
    if (!user || !enrollmentId) return {};

    if (window.AstikanEnrollmentDocuments && window.AstikanEnrollmentDocuments.uploadEnrollmentDocuments) {
      return window.AstikanEnrollmentDocuments.uploadEnrollmentDocuments(user, enrollmentId);
    }

    return {};
  }

  async function saveToSupabase(user) {
    if (!supabaseClient) {
      throw new Error("Add Supabase anon key in assets/astikan-config.js");
    }

    var formData = buildFormData();
    var plan = getPlanName();
    var timestamp = nowIso();
    var enrollmentCode = buildEnrollmentCode();

    var userRow = {
      uid: user.uid,
      email: user.email || null,
      name: user.displayName || null,
      avatar: user.photoURL || null,
      provider: "firebase",
      last_login_at: timestamp,
      updated_at: timestamp
    };

    var userResult = await supabaseClient.from("users").upsert(userRow, { onConflict: "uid" });
    if (userResult.error) {
      var insertResult = await supabaseClient.from("users").insert(userRow);
      if (insertResult.error && insertResult.error.code !== "23505") {
        var updateResult = await supabaseClient.from("users").update({
          email: userRow.email,
          name: userRow.name,
          avatar: userRow.avatar,
          provider: userRow.provider,
          last_login_at: userRow.last_login_at,
          updated_at: userRow.updated_at
        }).eq("uid", userRow.uid);
        if (updateResult.error) {
          throw new Error(
            "Database permission error: " +
            (userResult.error.message || insertResult.error.message || "Could not save user profile.") +
            " — Open Supabase Dashboard → SQL Editor, paste and run the full contents of supabase/fix-rls.sql, then try Google login again."
          );
        }
      }
    }

    var enrollmentRow = {
      uid: user.uid,
      email: user.email || null,
      plan: plan,
      enrollment_code: enrollmentCode,
      source: window.location.href,
      page: window.location.pathname,
      form_data: formData,
      document_urls: {},
      payment_status: "pending",
      created_at: timestamp,
      updated_at: timestamp
    };

    var enrollmentResult = await supabaseClient
      .from("membership_enrollments")
      .insert(enrollmentRow)
      .select("id, enrollment_code")
      .single();

    if (enrollmentResult.error) {
      throw new Error(enrollmentResult.error.message || "Could not save enrollment.");
    }

    var enrollmentId = enrollmentResult.data.id;
    var documentUrls = await uploadEnrollmentDocuments(user, enrollmentId);
    var expectedDocs = 0;
    if (document.getElementById("fieldPhoto")?.files?.[0]) expectedDocs += 1;
    if (document.getElementById("fieldAddressProof")?.files?.[0]) expectedDocs += 1;
    if (expectedDocs && Object.keys(documentUrls).length < expectedDocs) {
      console.warn("Some enrollment documents could not be uploaded.");
    }

    return {
      enrollmentId: enrollmentId,
      enrollmentCode: enrollmentResult.data.enrollment_code || enrollmentCode,
      plan: plan,
      amount: planPrices[plan.toLowerCase()] || null,
      formData: formData,
      documentUrls: documentUrls
    };
  }

  function saveMemberSession(user, result) {
    try {
      localStorage.setItem("astikanMemberSession", JSON.stringify({
        uid: user.uid,
        email: user.email || null,
        name: user.displayName || null,
        avatar: user.photoURL || null
      }));
      localStorage.setItem("astikanLastEnrollment", JSON.stringify({
        enrollmentId: result.enrollmentId,
        enrollmentCode: result.enrollmentCode || null,
        plan: result.plan,
        amount: result.amount,
        uid: user.uid,
        paymentStatus: "pending",
        formData: result.formData || {}
      }));
    } catch (e) {}
  }

  function goToPaymentPage(result, user) {
    if (typeof window.closeLoginModal === "function") {
      window.closeLoginModal();
    }

    if (user) saveMemberSession(user, result);

    window.location.href = "membership-payment.html?plan=" + encodeURIComponent(result.plan) +
      "&enrollmentId=" + encodeURIComponent(result.enrollmentId);
  }

  window.astikanMemberAuthenticated = false;

  window.submitMembershipEnrollment = async function (user, loginMethod) {
    if (typeof window.validateEnrollmentForm === "function") {
      var validation = window.validateEnrollmentForm();
      if (!validation.valid) throw new Error(validation.message);
    }

    setAuthBusy(true);
    setAuthStatus("Saving your membership details...", false, true);
    var activeUser = user || auth.currentUser;
    if (!activeUser) throw new Error("Please sign in first.");
    var result = await saveToSupabase(activeUser);
    setAuthStatus("Saved! Sending confirmation email...", false, true);

    if (window.AstikanMembershipEnrollmentEmail) {
      var emailResult = await window.AstikanMembershipEnrollmentEmail.sendEnrollmentWelcomeEmail(
        result.enrollmentId,
        loginMethod || "Astikan login"
      );
      if (!emailResult.ok) {
        console.warn("Welcome email:", emailResult.error);
      }
    }

    setAuthStatus("Saved! Redirecting to payment...", false, true);
    goToPaymentPage(result, activeUser);
  };

  window.loginWithGoogle = async function () {
    try {
      setAuthBusy(true);
      setAuthStatus("Opening Google sign-in...", false, true);
      var result = await auth.signInWithPopup(googleProvider);
      window.astikanMemberAuthenticated = true;
      await window.submitMembershipEnrollment(result.user, "Google sign-in");
    } catch (error) {
      setAuthBusy(false);
      setAuthStatus(error.message || "Google sign-in failed.", true);
    }
  };

  async function ensurePlanRecaptcha() {
    if (window.planRecaptchaVerifier) return window.planRecaptchaVerifier;

    var phonePanel = document.getElementById("authPanelPhone");
    if (phonePanel) phonePanel.classList.add("active");

    if (window.AstikanFirebasePhone && window.AstikanFirebasePhone.createRecaptchaVerifier) {
      window.planRecaptchaVerifier = await window.AstikanFirebasePhone.createRecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" }
      );
      return window.planRecaptchaVerifier;
    }

    window.planRecaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
      callback: function () {}
    });
    await window.planRecaptchaVerifier.render();
    return window.planRecaptchaVerifier;
  }

  window.preparePhoneAuth = async function () {
    try {
      await ensurePlanRecaptcha();
    } catch (error) {
      console.warn("reCAPTCHA prepare failed:", error);
    }
  };

  window.sendPhoneOtp = async function () {
    if (window.planOtpSending) return;

    var phoneInput = document.getElementById("authPhone");
    var phone = formatPhoneForFirebase(phoneInput ? phoneInput.value : "");
    if (!phone) {
      setAuthStatus("Enter a valid 10-digit Indian mobile number.", true);
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (window.planConfirmationResult && window.planLastOtpPhone === phone) {
      if (typeof window.showPhoneOtpStep === "function") window.showPhoneOtpStep();
      setAuthStatus("OTP already sent to " + phone + ". Enter the code below.");
      return;
    }

    window.planOtpSending = true;
    setAuthBusy(true);
    setAuthStatus("Sending OTP to " + phone + "...", false, true);

    try {
      await ensurePlanRecaptcha();
      window.planConfirmationResult = await auth.signInWithPhoneNumber(phone, window.planRecaptchaVerifier);
      window.planLastOtpPhone = phone;
      if (typeof window.showPhoneOtpStep === "function") window.showPhoneOtpStep();
      setAuthStatus("OTP sent to " + phone + ". It should auto-fill when the SMS arrives.");
      if (window.AstikanOtpAutofill) {
        window.AstikanOtpAutofill.start({
          input: document.getElementById("authOtp"),
          onFilled: function () {
            setAuthStatus("OTP filled from SMS. Tap Verify & Continue.");
          }
        });
      }
    } catch (error) {
      window.planConfirmationResult = null;
      window.planLastOtpPhone = null;
      if (window.AstikanFirebasePhone) {
        if (error && (error.code === "auth/captcha-check-failed" || error.code === "auth/argument-error")) {
          window.planRecaptchaVerifier = await window.AstikanFirebasePhone.clearRecaptcha(
            window.planRecaptchaVerifier,
            "recaptcha-container"
          );
        }
        setAuthStatus(window.AstikanFirebasePhone.message(error), true);
      } else {
        setAuthStatus(error.message || "Unable to send OTP.", true);
        window.planRecaptchaVerifier = null;
      }
    } finally {
      window.planOtpSending = false;
      setAuthBusy(false);
    }
  };

  window.verifyPhoneOtp = async function () {
    if (window.planOtpVerifying) return;
    var otpInput = document.getElementById("authOtp");
    var otp = window.AstikanFirebasePhone
      ? window.AstikanFirebasePhone.normalizeOtpCode(otpInput ? otpInput.value : "")
      : (otpInput ? otpInput.value.replace(/\D/g, "") : "");
    if (!window.planConfirmationResult) {
      setAuthStatus("Please enter your mobile number to receive OTP.", true);
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setAuthStatus("Enter the 6-digit OTP from your SMS.", true);
      if (otpInput) otpInput.focus();
      return;
    }

    window.planOtpVerifying = true;
    setAuthBusy(true);
    setAuthStatus("Verifying OTP...", false, true);
    if (window.AstikanOtpAutofill) window.AstikanOtpAutofill.stop();

    try {
      var result = await window.planConfirmationResult.confirm(otp);
      window.astikanMemberAuthenticated = true;
      await window.submitMembershipEnrollment(result.user, "Mobile OTP");
    } catch (error) {
      setAuthBusy(false);
      setAuthStatus(
        window.AstikanFirebasePhone
          ? window.AstikanFirebasePhone.message(error)
          : (error.message || "Invalid OTP."),
        true
      );
    } finally {
      window.planOtpVerifying = false;
    }
  };

  auth.onAuthStateChanged(function (user) {
    window.astikanMemberAuthenticated = Boolean(user);
  });

})();