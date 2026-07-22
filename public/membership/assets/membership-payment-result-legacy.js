(function () {
  var params = new URLSearchParams(window.location.search);
  var enrollmentId = params.get("enrollmentId") || "";
  var orderId = params.get("order_id") || params.get("orderId") || "";
  var config = window.ASTIKAN_CONFIG || {};
  var supabaseConfig = config.supabase || {};
  var planPrices = config.planPrices || {};

  var loadingBlock = document.getElementById("loadingBlock");
  var successBlock = document.getElementById("successBlock");
  var failedBlock = document.getElementById("failedBlock");
  var loadingMessage = document.getElementById("loadingMessage");
  var successAmount = document.getElementById("successAmount");
  var successPlan = document.getElementById("successPlan");
  var successMeta = document.getElementById("successMeta");
  var failedMeta = document.getElementById("failedMeta");
  var statusMessage = document.getElementById("statusMessage");

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function resolvePlan() {
    var fromUrl = params.get("plan");
    if (fromUrl) return fromUrl;
    var pending = readJson("astikanPendingPayment");
    if (pending && pending.plan) return pending.plan;
    var stored = readJson("astikanLastEnrollment");
    if (stored && stored.plan) return stored.plan;
    return "Membership Plan";
  }

  var plan = resolvePlan();
  var amount = planPrices[plan.toLowerCase()] || 0;

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

  function paymentRetryUrl() {
    if (!enrollmentId) return "index.html#memsec-section";
    return (
      "membership-payment.html?plan=" +
      encodeURIComponent(plan) +
      "&enrollmentId=" +
      encodeURIComponent(enrollmentId)
    );
  }

  function hideLoading() {
    if (loadingBlock) loadingBlock.style.display = "none";
  }

  function showLoading(message) {
    if (loadingBlock) loadingBlock.style.display = "block";
    if (successBlock) successBlock.style.display = "none";
    if (failedBlock) failedBlock.style.display = "none";
    if (loadingMessage && message) loadingMessage.textContent = message;
  }

  function buildMetaHtml() {
    var bits = [];
    if (plan) bits.push("<div><span>Plan:</span> <strong>" + plan + "</strong></div>");
    if (enrollmentId) {
      bits.push("<div><span>Enrollment ID:</span> <strong>" + enrollmentId + "</strong></div>");
    }
    if (orderId) bits.push("<div><span>Order ID:</span> <strong>" + orderId + "</strong></div>");
    return bits.join("");
  }

  function wireActionLinks() {
    var retryBtn = document.getElementById("retryPaymentBtn");
    var failedDash = document.getElementById("failedDashboardBtn");
    var successDash = document.getElementById("successDashboardBtn");

    if (retryBtn) retryBtn.href = paymentRetryUrl();
    if (failedDash) failedDash.href = dashboardUrl();
    if (successDash) {
      successDash.href = dashboardUrl();
      successDash.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = dashboardUrl();
      });
    }
  }

  function showFailed(message) {
    hideLoading();
    if (successBlock) successBlock.style.display = "none";
    if (failedBlock) failedBlock.style.display = "block";
    if (statusMessage) {
      statusMessage.textContent =
        message ||
        "Payment was cancelled or not completed. Your enrollment is still saved — try payment again from your dashboard.";
    }
    if (failedMeta) failedMeta.innerHTML = buildMetaHtml();
    wireActionLinks();
  }

  function showSuccess(certificateInfo) {
    hideLoading();
    if (successBlock) successBlock.style.display = "block";
    if (failedBlock) failedBlock.style.display = "none";
    if (successAmount) successAmount.textContent = amount ? "₹" + amount.toLocaleString("en-IN") : "₹0";
    if (successPlan) successPlan.textContent = plan;

    var certHtml = "";
    if (certificateInfo && certificateInfo.ok) {
      if (certificateInfo.emailedTo) {
        certHtml =
          "<div class='mt-2 text-success fw-semibold'>" +
          "<i class='bi bi-envelope-check'></i> Policy certificate emailed to " +
          certificateInfo.emailedTo +
          "</div>";
      } else if (certificateInfo.skipped) {
        certHtml =
          "<div class='mt-2 text-success fw-semibold'>" +
          "<i class='bi bi-envelope-check'></i> Policy certificate already sent to your registered email.</div>";
      }
    } else if (certificateInfo && certificateInfo.error) {
      certHtml =
        "<div class='mt-2 text-warning fw-semibold'>" +
        "Payment complete. Certificate email pending — use \"Email Policy Certificate\" on your dashboard.</div>";
    }

    if (successMeta) {
      successMeta.innerHTML =
        buildMetaHtml() +
        "<div class='mt-2 text-success fw-semibold'>Payment verified with Cashfree</div>" +
        certHtml;
    }
    wireActionLinks();
  }

  async function verifyPaymentWithServer() {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      throw new Error("Payment verification is temporarily unavailable. Please try again from your dashboard.");
    }
    if (!enrollmentId || !orderId) {
      throw new Error("Payment session ended without a completed transaction. You can retry payment from your dashboard.");
    }

    var response = await fetch(supabaseConfig.url + "/functions/v1/membership-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + supabaseConfig.anonKey,
        apikey: supabaseConfig.anonKey
      },
      body: JSON.stringify({
        action: "verify_payment",
        enrollmentId: enrollmentId,
        orderId: orderId
      })
    });

    var result = {};
    try {
      result = await response.json();
    } catch (e) {
      result = { error: "Could not read payment verification response." };
    }

    if (!response.ok || !result.ok || !result.paid) {
      throw new Error(result.error || "Cashfree did not confirm a successful payment for this order.");
    }
    return result;
  }

  async function emailPolicyCertificateFallback() {
    if (!window.AstikanMembershipCertificate || !enrollmentId) {
      return { ok: false, error: "Certificate service unavailable" };
    }
    return window.AstikanMembershipCertificate.sendPolicyCertificate(enrollmentId);
  }

  function updateStoredPaymentStatus(status) {
    try {
      var stored = readJson("astikanLastEnrollment");
      if (stored) {
        stored.paymentStatus = status;
        localStorage.setItem("astikanLastEnrollment", JSON.stringify(stored));
      }
    } catch (e) {}
  }

  async function init() {
    wireActionLinks();

    if (params.get("gateway") !== "cashfree") {
      showFailed("Invalid payment return link. Open your dashboard and use Complete Payment to try again.");
      return;
    }

    showLoading("Verifying your Cashfree payment...");

    try {
      var verifyResult = await verifyPaymentWithServer();
      var certificateInfo = verifyResult.certificate || null;

      if (!certificateInfo || !certificateInfo.ok) {
        var fallback = await emailPolicyCertificateFallback();
        if (fallback && fallback.ok && fallback.data) {
          certificateInfo = {
            ok: true,
            emailedTo: fallback.data.emailedTo,
            policyNumber: fallback.data.policyNumber
          };
        } else if (!certificateInfo) {
          certificateInfo = {
            ok: false,
            error: (fallback && fallback.error) || "Certificate email could not be sent automatically"
          };
        }
      }

      showSuccess(certificateInfo);
      updateStoredPaymentStatus("paid");

      try {
        sessionStorage.removeItem("astikanPendingPayment");
      } catch (e) {}

      setTimeout(function () {
        window.location.href = dashboardUrl();
      }, certificateInfo && certificateInfo.ok ? 3200 : 2400);
    } catch (error) {
      updateStoredPaymentStatus("failed");
      showFailed(error.message);
    }
  }

  init();
})();