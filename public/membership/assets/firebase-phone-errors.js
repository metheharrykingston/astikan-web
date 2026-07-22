(function () {
  var ERROR_MAP = {
    "auth/invalid-phone-number": "Invalid mobile number. Enter a valid 10-digit Indian number.",
    "auth/too-many-requests": "Too many OTP attempts. Please wait a few minutes and try again.",
    "auth/quota-exceeded": "SMS limit reached. Try again later or use Google sign-in.",
    "auth/captcha-check-failed": "reCAPTCHA check failed. Refresh the page and try again.",
    "auth/invalid-verification-code": "Incorrect OTP. Check the SMS and enter the latest code.",
    "auth/code-expired": "OTP expired. Tap Send OTP again to get a new code.",
    "auth/missing-verification-code": "Enter the 6-digit OTP from your SMS.",
    "auth/argument-error": "Phone verification could not start. Complete reCAPTCHA, enter a valid 10-digit mobile number, and try again.",
    "auth/invalid-verification-id": "OTP session expired. Tap Send OTP again.",
    "auth/invalid-app-credential": "Phone verification is temporarily unavailable. Use Google sign-in or try again shortly.",
    "auth/billing-not-enabled": "Phone OTP is not enabled on Firebase for this project. Use Google sign-in.",
    "auth/user-disabled": "This account is disabled. Contact care@astikan.com.",
    "auth/operation-not-allowed": "Phone sign-in is not enabled. Use Google sign-in.",
    "auth/network-request-failed": "Network error. Check internet connection and retry."
  };

  function message(error) {
    if (!error) return "Phone verification failed.";
    if (error.code && ERROR_MAP[error.code]) return ERROR_MAP[error.code];
    return error.message || "Phone verification failed.";
  }

  async function clearRecaptcha(verifier, containerId) {
    if (verifier && typeof verifier.clear === "function") {
      try {
        await verifier.clear();
      } catch (e) {}
    }
    var container = document.getElementById(containerId);
    if (container) container.innerHTML = "";
    return null;
  }

  async function createRecaptchaVerifier(containerId, options) {
    options = options || {};
    var container = document.getElementById(containerId);
    if (!container) {
      throw new Error("reCAPTCHA container not found.");
    }
    container.style.minHeight = options.size === "invisible" ? "0" : "78px";
    var verifier = new firebase.auth.RecaptchaVerifier(containerId, {
      size: options.size || "normal",
      callback: options.callback || function () {}
    });
    await verifier.render();
    return verifier;
  }

  function normalizeOtpCode(raw) {
    if (window.AstikanOtpAutofill && typeof window.AstikanOtpAutofill.extractCode === "function") {
      return window.AstikanOtpAutofill.extractCode(raw);
    }
    return String(raw || "").replace(/\D/g, "").slice(0, 6);
  }

  window.AstikanFirebasePhone = {
    message: message,
    clearRecaptcha: clearRecaptcha,
    createRecaptchaVerifier: createRecaptchaVerifier,
    normalizeOtpCode: normalizeOtpCode
  };
})();