(function () {
  var params = new URLSearchParams(window.location.search);
  var plan = params.get("plan") || "Membership Plan";
  var enrollmentId = params.get("enrollmentId") || "";
  var config = window.ASTIKAN_CONFIG || {};
  var supabaseConfig = config.supabase || {};
  var planPrices = config.planPrices || {};
  var amount = planPrices[plan.toLowerCase()] || 0;

  var planNameEl = document.getElementById("planName");
  var planAmountEl = document.getElementById("planAmount");
  var statusEl = document.getElementById("paymentStatus");
  var payButton = document.getElementById("payNowButton");

  if (planNameEl) planNameEl.textContent = plan;
  if (planAmountEl) planAmountEl.textContent = amount ? "₹" + amount.toLocaleString("en-IN") : "₹0";

  if (statusEl) {
    var stored = readJson("astikanLastEnrollment");
    var displayId = (stored && stored.enrollmentCode) || enrollmentId;
    statusEl.textContent = enrollmentId
      ? "Enrollment saved (ID: " + displayId + "). Pay via Cashfree to activate your plan."
      : "Enrollment details missing. Please start again from the plan page.";
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function dashboardUrl() {
    if (window.MemberPortalRoutes) {
      var url = window.MemberPortalRoutes.dashboardUrl();
      if (enrollmentId && url.indexOf("enrollmentId=") < 0) {
        url += (url.indexOf("?") >= 0 ? "&" : "?") + "enrollmentId=" + encodeURIComponent(enrollmentId);
      }
      return url;
    }
    if (!enrollmentId) return "membership-dashboard.html";
    return "membership-dashboard.html?enrollmentId=" + encodeURIComponent(enrollmentId);
  }

  function goToDashboardWithoutPayment() {
    if (!enrollmentId) {
      alert("Enrollment ID missing. Please start again from the plan page.");
      return;
    }
    window.location.href = dashboardUrl();
  }

  async function callPaymentFunction(action, payload) {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      throw new Error("Supabase is not configured.");
    }
    var response = await fetch(supabaseConfig.url + "/functions/v1/membership-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + supabaseConfig.anonKey,
        apikey: supabaseConfig.anonKey
      },
      body: JSON.stringify(Object.assign({ action: action }, payload))
    });
    var result = {};
    try {
      result = await response.json();
    } catch (e) {
      result = { error: "Invalid response from payment service" };
    }
    if (!response.ok || result.error) {
      throw new Error(result.error || "Payment service failed");
    }
    return result;
  }

  function startCashfreeCheckout(sessionId, orderId, mode) {
    if (!window.Cashfree) {
      throw new Error("Cashfree SDK not loaded.");
    }
    var cashfree = new window.Cashfree({ mode: mode || "production" });
    return cashfree.checkout({
      paymentSessionId: sessionId,
      redirectTarget: "_self"
    });
  }

  if (payButton) {
    payButton.textContent = "Pay with Cashfree";
    payButton.addEventListener("click", async function () {
      if (!enrollmentId) {
        alert("Enrollment ID missing. Please start again from the plan page.");
        return;
      }
      if (!amount) {
        alert("Invalid plan amount. Please start again from the plan page.");
        return;
      }

      payButton.disabled = true;
      payButton.textContent = "Opening Cashfree...";
      if (statusEl) statusEl.textContent = "Creating secure payment session...";

      try {
        var orderResult = await callPaymentFunction("create_order", {
          enrollmentId: enrollmentId,
          plan: plan,
          amount: amount
        });

        try {
          sessionStorage.setItem("astikanPendingPayment", JSON.stringify({
            enrollmentId: enrollmentId,
            orderId: orderResult.orderId,
            plan: plan
          }));
        } catch (e) {}

        if (statusEl) statusEl.textContent = "Redirecting to Cashfree payment gateway...";
        await startCashfreeCheckout(
          orderResult.paymentSessionId,
          orderResult.orderId,
          orderResult.cashfreeMode
        );
      } catch (error) {
        payButton.disabled = false;
        payButton.textContent = "Pay with Cashfree";
        if (statusEl) statusEl.textContent = error.message || "Could not start payment.";
        alert(error.message || "Could not start payment. Please try again.");
      }
    });
  }

  var dashboardLink = document.getElementById("goToDashboardLink");
  if (dashboardLink) {
    dashboardLink.addEventListener("click", function (e) {
      e.preventDefault();
      goToDashboardWithoutPayment();
    });
  }
})();