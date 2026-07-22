(function () {
  var otpTimer;

  function setAuthMethod(method) {
    var tabs = document.querySelectorAll(".auth-tab");
    var googlePanel = document.getElementById("authPanelGoogle");
    var phonePanel = document.getElementById("authPanelPhone");

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle("active", tabs[i].getAttribute("data-auth-method") === method);
    }
    if (googlePanel) googlePanel.classList.toggle("active", method === "google");
    if (phonePanel) phonePanel.classList.toggle("active", method === "phone");
    if (method === "google") resetPhoneStep();
    if (method === "phone" && typeof window.preparePhoneAuth === "function") {
      window.preparePhoneAuth();
    }
  }

  function resetPhoneStep() {
    if (window.AstikanOtpAutofill) window.AstikanOtpAutofill.stop();
    var step1 = document.getElementById("phoneStep1");
    var step2 = document.getElementById("phoneStep2");
    var otp = document.getElementById("authOtp");
    if (step1) step1.style.display = "block";
    if (step2) step2.style.display = "none";
    if (otp) otp.value = "";
    window.planConfirmationResult = null;
    window.planLastOtpPhone = null;
  }

  window.resetAuthModal = function () {
    setAuthMethod("google");
    resetPhoneStep();
    var phone = document.getElementById("authPhone");
    if (phone) phone.value = "";
    var status = document.getElementById("authStatus");
    if (status) {
      status.textContent = "";
      status.classList.remove("error");
      status.classList.remove("loading");
    }
  };

  window.resetPhoneOtpStep = function () {
    resetPhoneStep();
    if (typeof window.setAuthStatus === "function") {
      window.setAuthStatus("Enter your 10-digit mobile number — OTP sends automatically.");
    }
    var phone = document.getElementById("authPhone");
    if (phone) phone.focus();
  };

  window.showPhoneOtpStep = function () {
    var step1 = document.getElementById("phoneStep1");
    var step2 = document.getElementById("phoneStep2");
    var otp = document.getElementById("authOtp");
    if (step1) step1.style.display = "none";
    if (step2) step2.style.display = "block";
    if (window.AstikanOtpAutofill) window.AstikanOtpAutofill.configure(otp);
  };

  function scheduleAutoOtp(phoneValue) {
    clearTimeout(otpTimer);
    if (phoneValue.length !== 10) return;
    otpTimer = window.setTimeout(function () {
      if (typeof window.sendPhoneOtp === "function") window.sendPhoneOtp();
    }, 450);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var tabs = document.querySelectorAll(".auth-tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () {
        setAuthMethod(this.getAttribute("data-auth-method"));
        var status = document.getElementById("authStatus");
        if (status) {
          status.textContent = "";
          status.classList.remove("error");
          status.classList.remove("loading");
        }
      });
    }

    var phoneInput = document.getElementById("authPhone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
        scheduleAutoOtp(this.value);
      });
    }

    if (window.AstikanOtpAutofill) {
      window.AstikanOtpAutofill.configure(document.getElementById("authOtp"));
    }

    resetAuthModal();
  });
})();