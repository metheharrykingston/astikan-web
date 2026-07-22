(function () {
  var config = window.ASTIKAN_CONFIG || {};
  var supabaseConfig = config.supabase || {};
  var planBenefits = config.planBenefits || {};
  var planPrices = config.planPrices || {};

  var supabaseClient = null;
  if (supabaseConfig.url && supabaseConfig.anonKey) {
    supabaseClient = supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function formatDate(iso) {
    if (!iso) return "—";
    if (window.AstikanFormat) return window.AstikanFormat.formatIST(iso, false);
    try {
      return new Date(iso).toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch (e) {
      return iso;
    }
  }

  function formatCurrency(amount) {
    if (!amount) return "—";
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  function normalizePlanKey(plan) {
    return (plan || "").trim().toLowerCase();
  }

  function getPlanMeta(plan) {
    var key = normalizePlanKey(plan);
    return planBenefits[key] || null;
  }

  function enrollmentFields() {
    return window.AstikanEnrollmentFields || null;
  }

  function getDisplayName(enrollment, session) {
    var form = enrollment && enrollment.form_data ? enrollment.form_data : {};
    var helper = enrollmentFields();
    if (helper) return helper.memberName(form, session || {}, enrollment || {});
    return form.fieldFullName || form.full_name || form.name || (session && session.name) || enrollment.email || "Member";
  }

  function getMobile(enrollment) {
    var form = enrollment && enrollment.form_data ? enrollment.form_data : {};
    var helper = enrollmentFields();
    if (helper) {
      var mobile = helper.memberMobile(form, {});
      return mobile || "—";
    }
    return form.fieldMobile || form.mobile_number || form.mobile || "—";
  }

  function getEmail(enrollment, session) {
    var form = enrollment && enrollment.form_data ? enrollment.form_data : {};
    var helper = enrollmentFields();
    if (helper) {
      var email = helper.memberEmail(form, session || {}, enrollment || {});
      return email || "—";
    }
    return form.fieldEmail || form.email || enrollment.email || (session && session.email) || "—";
  }

  function crownHtml(tier) {
    var colors = {
      silver: "#e2e8f0",
      gold: "#fde68a",
      platinum: "#ddd6fe"
    };
    var color = colors[tier] || "#fff";
    return '<i class="bi bi-crown-fill" style="color:' + color + '"></i>';
  }

  function normalizeEnrollment(row) {
    if (!row) return row;
    var status = (row.payment_status || "pending").toLowerCase();

    // Only Cashfree-verified payments count as paid (must have order id + completion time).
    if (status === "paid" && (!row.payment_completed_at || !row.cashfree_order_id)) {
      row.payment_status = "pending";
      row.payment_completed_at = null;
    }

    if (status === "paid" && !row.payment_completed_at) {
      row.payment_status = "pending";
      row.payment_amount = null;
    }

    return row;
  }

  function isPaymentDone(enrollmentOrStatus) {
    if (!enrollmentOrStatus) return false;
    if (typeof enrollmentOrStatus === "string") {
      return false;
    }
    return enrollmentOrStatus.payment_status === "paid" &&
      Boolean(enrollmentOrStatus.payment_completed_at) &&
      Boolean(enrollmentOrStatus.cashfree_order_id);
  }

  function getPaymentDisplay(enrollment) {
    if (isPaymentDone(enrollment)) {
      return {
        label: "Paid",
        statusLabel: "Active",
        tone: "active",
        icon: "check-circle-fill"
      };
    }
    if ((enrollment.payment_status || "").toLowerCase() === "failed") {
      return {
        label: "Payment Failed",
        statusLabel: "Payment Failed",
        tone: "failed",
        icon: "x-circle-fill"
      };
    }
    return {
      label: "Payment Pending",
      statusLabel: "Payment Pending",
      tone: "pending",
      icon: "clock-fill"
    };
  }

  function renderStatusBadge(enrollment) {
    var display = getPaymentDisplay(enrollment);
    return '<span class="dash-status ' + display.tone + '">' +
      '<i class="bi bi-' + display.icon + '"></i> ' +
      display.statusLabel + "</span>";
  }

  function paymentPageUrl(enrollment) {
    return "membership-payment.html?plan=" + encodeURIComponent(enrollment.plan || "") +
      "&enrollmentId=" + encodeURIComponent(enrollment.id || "");
  }

  function renderPaymentBanner(enrollment) {
    var banner = document.getElementById("paymentPendingBanner");
    if (!banner) return;

    if (isPaymentDone(enrollment)) {
      banner.style.display = "none";
      banner.innerHTML = "";
      banner.className = "dash-payment-alert-wrap";
      return;
    }

    var display = getPaymentDisplay(enrollment);
    var isFailed = display.tone === "failed";
    var planMeta = getPlanMeta(enrollment.plan);
    var amount = enrollment.payment_amount ||
      (planMeta && planMeta.price) ||
      planPrices[normalizePlanKey(enrollment.plan)];
    var payUrl = paymentPageUrl(enrollment);
    var toneClass = isFailed ? "dash-payment-alert--failed" : "dash-payment-alert--pending";

    banner.className = "dash-payment-alert-wrap";
    banner.style.display = "block";
    banner.innerHTML =
      '<div class="dash-payment-alert ' + toneClass + '" role="alert">' +
        '<div class="dash-payment-alert-icon" aria-hidden="true">' +
          '<i class="bi bi-' + (isFailed ? "x-circle-fill" : "clock-fill") + '"></i>' +
        '</div>' +
        '<div class="dash-payment-alert-content">' +
          '<span class="dash-payment-alert-eyebrow">' + (isFailed ? "Payment issue" : "Action required") + '</span>' +
          '<h2 class="dash-payment-alert-title">' + (isFailed ? "Payment failed" : "Payment pending") + '</h2>' +
          '<p class="dash-payment-alert-desc">' +
            (isFailed
              ? "Your last Cashfree payment did not complete. Retry now to activate your membership benefits."
              : "Your enrollment is saved. Complete payment to activate your plan and unlock member services.") +
          '</p>' +
          '<div class="dash-payment-alert-meta">' +
            '<span><i class="bi bi-shield-check"></i> ' + (enrollment.plan || "Membership Plan") + '</span>' +
            (amount ? '<span><i class="bi bi-currency-rupee"></i> ' + formatCurrency(amount) + " due</span>" : "") +
            '<span><i class="bi bi-lock-fill"></i> Secure Cashfree checkout</span>' +
          '</div>' +
        '</div>' +
        '<div class="dash-payment-alert-actions">' +
          '<a class="dash-payment-alert-cta" href="' + payUrl + '">' +
            '<i class="bi bi-credit-card-2-front"></i> ' +
            (isFailed ? "Retry Payment" : "Complete Payment") +
          '</a>' +
          '<span class="dash-payment-alert-note">Plan stays inactive until payment succeeds</span>' +
        '</div>' +
      '</div>';
  }

  function resolveServiceHref(service) {
    if (window.MemberPortalRoutes && service.id) {
      return window.MemberPortalRoutes.portalEntryUrl(service.id);
    }
    if (window.MemberPortalRoutes) {
      return window.MemberPortalRoutes.resolveServiceHref(service.href);
    }
    return service.href;
  }

  function renderServiceCards(services, containerId, onlyClaims) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    for (var i = 0; i < services.length; i++) {
      var svc = services[i];
      if (Boolean(svc.claim) !== Boolean(onlyClaims)) continue;

      var card = document.createElement("a");
      card.className = "dash-service-card" + (svc.claim ? " claim" : "");
      card.href = resolveServiceHref(svc);

      card.innerHTML =
        '<div class="dash-service-icon"><i class="bi ' + svc.icon + '"></i></div>' +
        "<h4>" + svc.title + "</h4>" +
        "<p>" + svc.desc + "</p>" +
        '<span class="enroll-btn">' + (svc.claim ? "Submit Claim Request →" : "Browse & Request →") + "</span>";

      container.appendChild(card);
    }
  }

  function renderMemberDetails(enrollment) {
    var container = document.getElementById("memberDetailsList");
    if (!container) return;

    var helper = enrollmentFields();
    var form = (enrollment && enrollment.form_data) || {};
    var rows = helper ? helper.buildDetailRows(form) : [];

    if (!rows.length) {
      container.innerHTML = '<p class="text-muted mb-0">No enrollment details saved yet.</p>';
      return;
    }

    container.innerHTML = rows.map(function (row) {
      return (
        '<div class="dash-meta-row"><span>' + row.label + "</span><strong>" + row.value + "</strong></div>"
      );
    }).join("");
  }

  var DOCUMENT_SPECS = [
    { key: "photo", label: "Passport Photo", formKey: "fieldPhoto", accept: "image/*" },
    { key: "address_proof", label: "Address Proof", formKey: "fieldAddressProof", accept: "image/*,.pdf" }
  ];

  function renderDocumentActions(doc) {
    return (
      '<div class="dash-doc-actions">' +
      '<button class="dash-doc-btn dash-doc-btn-preview" data-preview-url="' + doc.signedUrl +
      '" data-preview-kind="' + doc.kind + '" data-preview-title="' + doc.label + '" type="button">' +
      '<i class="bi bi-eye"></i> Preview</button>' +
      '<a class="dash-doc-btn dash-doc-btn-download" href="' + doc.signedUrl +
      '" rel="noopener" target="_blank"><i class="bi bi-download"></i> Download</a>' +
      "</div>"
    );
  }

  function renderMissingDocumentActions(spec) {
    return (
      '<div class="dash-doc-actions">' +
      '<input accept="' + spec.accept + '" class="dash-doc-upload-input" data-doc-key="' + spec.key +
      '" hidden type="file"/>' +
      '<button class="dash-doc-btn dash-doc-btn-upload" data-doc-key="' + spec.key + '" type="button">' +
      '<i class="bi bi-cloud-upload"></i> Upload</button>' +
      "</div>"
    );
  }

  function wireDocumentPreviewButtons(container) {
    if (!container) return;
    container.querySelectorAll(".dash-doc-btn-preview").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!window.AstikanDocumentPreview) return;
        window.AstikanDocumentPreview.open({
          title: btn.getAttribute("data-preview-title") || "Document",
          url: btn.getAttribute("data-preview-url") || "",
          kind: btn.getAttribute("data-preview-kind") || "image",
        });
      });
    });
  }

  function wireDocumentUploadButtons(container, enrollment, session) {
    if (!container || !enrollment || !session || !session.uid) return;
    if (!window.AstikanEnrollmentDocuments || !window.AstikanEnrollmentDocuments.uploadDocumentFiles) return;

    container.querySelectorAll(".dash-doc-btn-upload").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-doc-key");
        var input = container.querySelector('.dash-doc-upload-input[data-doc-key="' + key + '"]');
        if (input) input.click();
      });
    });

    container.querySelectorAll(".dash-doc-upload-input").forEach(function (input) {
      input.addEventListener("change", async function () {
        if (!input.files || !input.files[0]) return;

        var key = input.getAttribute("data-doc-key");
        var row = input.closest(".dash-doc-row");
        var uploadBtn = row && row.querySelector('.dash-doc-btn-upload[data-doc-key="' + key + '"]');
        var originalHtml = uploadBtn ? uploadBtn.innerHTML : "";

        if (uploadBtn) {
          uploadBtn.disabled = true;
          uploadBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Uploading...';
        }

        try {
          await window.AstikanEnrollmentDocuments.uploadDocumentFiles(
            { uid: session.uid },
            enrollment.id,
            [{ key: key, name: input.files[0].name, file: input.files[0] }]
          );
          await renderMemberDocuments(enrollment, session);
        } catch (error) {
          if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = originalHtml;
          }
          alert(error.message || "Could not upload document. Please try again.");
        } finally {
          input.value = "";
        }
      });
    });
  }

  async function renderMemberDocuments(enrollment, session) {
    var container = document.getElementById("memberDocumentsList");
    if (!container) return;

    container.innerHTML = '<p class="text-muted mb-0">Loading documents...</p>';

    if (!enrollment || !enrollment.id) {
      container.innerHTML = '<p class="text-muted mb-0">No documents uploaded for this enrollment.</p>';
      return;
    }

    if (!window.AstikanEnrollmentDocuments || !window.AstikanEnrollmentDocuments.resolveEnrollmentDocuments) {
      container.innerHTML = '<p class="text-muted mb-0">Document preview is unavailable.</p>';
      return;
    }

    try {
      var result = await window.AstikanEnrollmentDocuments.resolveEnrollmentDocuments(enrollment.id);
      var documents = result.documents || {};
      var form = (enrollment && enrollment.form_data) || {};

      container.innerHTML = DOCUMENT_SPECS.map(function (spec) {
        var doc = documents[spec.key];
        if (doc) {
          return (
            '<div class="dash-doc-row">' +
            '<div class="dash-doc-info"><span class="dash-doc-label">' + doc.label +
            '</span><strong class="dash-doc-status">Uploaded</strong></div>' +
            renderDocumentActions(doc) +
            "</div>"
          );
        }

        var meta = helperFormatFileMeta(form[spec.formKey]);
        return (
          '<div class="dash-doc-row dash-doc-row-missing">' +
          '<div class="dash-doc-info"><span class="dash-doc-label">' + spec.label +
          '</span><strong class="dash-doc-status">Not saved yet — please upload again</strong>' +
          (meta ? '<small class="dash-doc-meta">Enrollment form: ' + meta + "</small>" : "") +
          "</div>" +
          renderMissingDocumentActions(spec) +
          "</div>"
        );
      }).join("");

      wireDocumentPreviewButtons(container);
      wireDocumentUploadButtons(container, enrollment, session);
    } catch (error) {
      container.innerHTML =
        '<p class="text-muted mb-0">Could not load documents. ' + (error.message || "Please try again.") + "</p>";
    }
  }

  function helperFormatFileMeta(value) {
    if (!value) return "";
    if (window.AstikanEnrollmentFields) return window.AstikanEnrollmentFields.formatValue(value);
    if (Array.isArray(value) && value[0] && value[0].name) return value[0].name;
    return String(value);
  }

  function renderBenefits(benefits) {
    var list = document.getElementById("benefitsList");
    if (!list) return;
    list.innerHTML = "";
    for (var i = 0; i < benefits.length; i++) {
      var li = document.createElement("li");
      li.innerHTML = '<i class="bi bi-check-circle-fill"></i><span>' + benefits[i] + "</span>";
      list.appendChild(li);
    }
  }

  function applyTheme(tier) {
    var hero = document.getElementById("heroSection");
    if (!hero) return;
    hero.classList.remove("silver-theme", "gold-theme", "platinum-theme");
    if (tier) hero.classList.add(tier + "-theme");
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value || "—";
  }

  function setAvatar(url) {
    var fallback = "assets/profile_img/default.avif";
    var src = url || fallback;
    ["headerAvatar", "sidebarAvatar"].forEach(function (id) {
      var img = document.getElementById(id);
      if (img) img.src = src;
    });
  }

  function showView(view) {
    document.getElementById("dashLoading").style.display = view === "loading" ? "block" : "none";
    document.getElementById("dashEmpty").style.display = view === "empty" ? "block" : "none";
    document.getElementById("dashContent").style.display = view === "content" ? "block" : "none";
  }

  async function fetchEnrollment(enrollmentId) {
    if (!supabaseClient || !enrollmentId) return null;
    var result = await supabaseClient
      .from("membership_enrollments")
      .select("*")
      .eq("id", enrollmentId)
      .maybeSingle();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  }

  async function resolveEnrollmentId(session) {
    var enrollmentId = enrollmentIdParam();
    if (enrollmentId) return enrollmentId;

    if (session && session.uid && window.AstikanEnrollmentStore) {
      var cached = await window.AstikanEnrollmentStore.restoreEnrollmentForUser(session);
      return cached && cached.enrollmentId;
    }

    return null;
  }

  async function reconcilePaymentStatus(enrollmentId) {
    if (!supabaseConfig.url || !supabaseConfig.anonKey || !enrollmentId) return;
    try {
      await fetch(supabaseConfig.url + "/functions/v1/membership-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + supabaseConfig.anonKey,
          apikey: supabaseConfig.anonKey
        },
        body: JSON.stringify({ action: "sync_status", enrollmentId: enrollmentId })
      });
    } catch (e) {
      console.warn("Payment status sync skipped:", e);
    }
  }

  function syncEnrollmentCache(enrollment) {
    try {
      var stored = readJson("astikanLastEnrollment") || {};
      var display = getPaymentDisplay(enrollment);
      stored.enrollmentId = enrollment.id;
      stored.plan = enrollment.plan || stored.plan;
      stored.amount = enrollment.payment_amount || stored.amount;
      stored.paymentStatus = isPaymentDone(enrollment)
        ? "paid"
        : (display.tone === "failed" ? "failed" : "pending");
      localStorage.setItem("astikanLastEnrollment", JSON.stringify(stored));
    } catch (e) {}
  }

  function setupCertificateActions(enrollment) {
    var wrap = document.getElementById("certificateActions");
    var btn = document.getElementById("resendCertificateBtn");
    var previewBtn = document.getElementById("previewCertificateBtn");
    if (!wrap || !btn) return;

    if (!isPaymentDone(enrollment)) {
      wrap.style.display = "none";
      return;
    }

    wrap.style.display = "flex";
    btn.innerHTML = enrollment.certificate_sent_at
      ? '<i class="bi bi-envelope-check"></i> Resend Policy Certificate'
      : '<i class="bi bi-envelope-check"></i> Email Policy Certificate';

    if (previewBtn) {
      previewBtn.onclick = async function () {
        if (!window.AstikanMembershipCertificate) {
          alert("Certificate service is not loaded.");
          return;
        }
        previewBtn.disabled = true;
        previewBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading preview...';
        var result = await window.AstikanMembershipCertificate.previewPolicyCertificate(enrollment.id);
        previewBtn.disabled = false;
        previewBtn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> View Certificate Preview';
        if (!result.ok || !result.data || !result.data.pdfBase64) {
          alert(result.error || "Could not load certificate preview.");
          return;
        }
        try {
          var binary = atob(result.data.pdfBase64);
          var bytes = new Uint8Array(binary.length);
          for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          var blob = new Blob([bytes], { type: "application/pdf" });
          var meta = (result.data.planLabel || "Policy Certificate") +
            (result.data.policyNumber ? " — " + result.data.policyNumber : "");
          if (window.AstikanCertificatePreview) {
            window.AstikanCertificatePreview.openPdfBlob(blob, meta);
          } else {
            window.open(URL.createObjectURL(blob), "_blank");
          }
        } catch (e) {
          alert("Could not open certificate preview.");
        }
      };
    }

    btn.onclick = async function () {
      if (!window.AstikanMembershipCertificate) {
        alert("Certificate service is not loaded.");
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending...';
      var result = await window.AstikanMembershipCertificate.sendPolicyCertificate(
        enrollment.id,
        Boolean(enrollment.certificate_sent_at)
      );
      btn.disabled = false;
      btn.innerHTML = enrollment.certificate_sent_at
        ? '<i class="bi bi-envelope-check"></i> Resend Policy Certificate'
        : '<i class="bi bi-envelope-check"></i> Email Policy Certificate';
      if (!result.ok) {
        alert(result.error || "Could not send certificate.");
        return;
      }
      alert("Policy certificate emailed to " + (result.data && result.data.emailedTo ? result.data.emailedTo : "your registered email") + ".");
      if (result.data && result.data.policyNumber) {
        setText("metaPolicyNumber", result.data.policyNumber);
        enrollment.policy_number = result.data.policyNumber;
      }
      var certEl = document.getElementById("metaCertificate");
      if (certEl && result.data) {
        certEl.textContent = "Sent to " + result.data.emailedTo + " on " + formatDate(new Date().toISOString());
      }
    };
  }

  function getDashView() {
    return document.body.getAttribute("data-dash-view") || "overview";
  }

  function enrollmentIdParam() {
    return getParam("enrollmentId") || (readJson("astikanLastEnrollment") || {}).enrollmentId || "";
  }

  function wireOverviewLinks(enrollmentId) {
    var suffix = enrollmentId ? "?enrollmentId=" + encodeURIComponent(enrollmentId) : "";
    var links = {
      linkPlanDetails: "member/plan-details.html" + suffix,
      linkEnrollServices: "member/enroll-services.html" + suffix,
      linkClaims: "member/claims.html" + suffix
    };
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = links[id];
    });
  }

  function populateCommon(enrollment, session, planMeta, tier, displayName) {
    var premium = isPaymentDone(enrollment)
      ? (enrollment.payment_amount || (planMeta && planMeta.price) || planPrices[normalizePlanKey(enrollment.plan)])
      : ((planMeta && planMeta.price) || planPrices[normalizePlanKey(enrollment.plan)]);

    applyTheme(tier);
    setAvatar(session && session.avatar);
    setText("headerName", displayName);
    setText("sidebarName", displayName);
    setText("sidebarPlan", enrollment.plan);
    setText("metaSince", formatDate(enrollment.created_at));
    setText("metaPlan", enrollment.plan);
    setText(
      "metaPlanId",
      window.AstikanFormat
        ? window.AstikanFormat.displayEnrollmentId(enrollment)
        : enrollment.enrollment_code || enrollment.id
    );
    setText("metaPremium", formatCurrency(premium));

    var paymentEl = document.getElementById("metaPayment");
    if (paymentEl) {
      var payDisplay = getPaymentDisplay(enrollment);
      paymentEl.innerHTML =
        '<span class="dash-status ' + payDisplay.tone + '">' +
        '<i class="bi bi-' + payDisplay.icon + '"></i> ' + payDisplay.label +
        "</span>";
    }

    var statusEl = document.getElementById("metaStatus");
    if (statusEl) statusEl.innerHTML = renderStatusBadge(enrollment);

    var policyNumber = enrollment.policy_number;
    if (!policyNumber && isPaymentDone(enrollment) && window.AstikanEnrollmentFields) {
      policyNumber = window.AstikanEnrollmentFields.buildPolicyNumber(enrollment.plan, enrollment);
    }
    setText("metaPolicyNumber", policyNumber || "—");

    var certEl = document.getElementById("metaCertificate");
    if (certEl) {
      if (!isPaymentDone(enrollment)) {
        certEl.textContent = "Available after payment";
      } else if (enrollment.certificate_sent_at) {
        certEl.textContent = "Sent to " + (enrollment.certificate_email || "your email") +
          " on " + formatDate(enrollment.certificate_sent_at);
      } else {
        certEl.innerHTML = '<span class="dash-status pending">Pending send</span>';
      }
    }

    syncEnrollmentCache(enrollment);
    renderPaymentBanner(enrollment);

    if (window.MemberPortalNav) {
      window.MemberPortalNav.populateIdentity();
    }
  }

  function populateDashboard(enrollment, session) {
    var view = getDashView();
    var planMeta = getPlanMeta(enrollment.plan);
    var tier = planMeta ? planMeta.tier : "silver";
    var displayName = getDisplayName(enrollment, session || {});

    populateCommon(enrollment, session, planMeta, tier, displayName);

    if (view === "overview") {
      setText("heroName", displayName);
      var heroDisplay = getPaymentDisplay(enrollment);
      setText(
        "heroTagline",
        isPaymentDone(enrollment)
          ? (planMeta ? planMeta.tagline : "Your health membership is active")
          : (heroDisplay.tone === "failed"
            ? "Payment failed — retry payment to activate your plan"
            : "Enrollment saved — payment pending, complete Cashfree payment to activate")
      );
      setText("planBadgeText", enrollment.plan);
      var crownEl = document.getElementById("planCrown");
      if (crownEl) crownEl.innerHTML = crownHtml(tier);
      setText("metaName", displayName);
      setText("metaEmail", getEmail(enrollment, session));
      setText("metaMobile", getMobile(enrollment));
      wireOverviewLinks(enrollment.id);
    }

    if (view === "plan-details" && planMeta) {
      setText("metaName", displayName);
      setText("metaEmail", getEmail(enrollment, session));
      setText("metaMobile", getMobile(enrollment));
      renderMemberDetails(enrollment);
      renderMemberDocuments(enrollment, session);
      renderBenefits(planMeta.benefits);
      setupCertificateActions(enrollment);
    }

    if (view === "enroll-services" && planMeta) {
      renderServiceCards(planMeta.services, "servicesGrid", false);
    }

    if (view === "claims" && planMeta) {
      renderServiceCards(planMeta.services, "claimsGrid", true);
    }

    showView("content");
  }

  function buildFallbackEnrollment(enrollmentId, stored, session) {
    return {
      id: enrollmentId,
      plan: stored.plan,
      uid: stored.uid,
      email: session && session.email,
      form_data: stored.formData || {},
      payment_status: "pending",
      payment_amount: null,
      payment_completed_at: null,
      created_at: new Date().toISOString()
    };
  }

  async function init() {
    var session = readJson("astikanMemberSession");
    var stored = readJson("astikanLastEnrollment");
    var enrollmentId = await resolveEnrollmentId(session);

    if (!enrollmentId) {
      if (window.MemberPortalNav) window.MemberPortalNav.populateIdentity();
      showView("empty");
      return;
    }

    try {
      await reconcilePaymentStatus(enrollmentId);
      var enrollment = await fetchEnrollment(enrollmentId);
      if (!enrollment) {
        if (stored && stored.plan) {
          enrollment = normalizeEnrollment(buildFallbackEnrollment(enrollmentId, stored, session));
        } else {
          showView("empty");
          return;
        }
      }
      populateDashboard(normalizeEnrollment(enrollment), session);
    } catch (error) {
      if (stored && stored.plan) {
        populateDashboard(normalizeEnrollment(buildFallbackEnrollment(enrollmentId, stored, session)), session);
      } else {
        showView("empty");
        console.error(error);
      }
    }
  }

  init();
})();