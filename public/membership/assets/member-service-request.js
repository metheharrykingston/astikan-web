(function () {
  var params = new URLSearchParams(window.location.search);
  var serviceId = params.get("service") || "";
  var config = window.ASTIKAN_CONFIG || {};
  var supabaseConfig = config.supabase || {};

  var supabaseClient = null;
  if (supabaseConfig.url && supabaseConfig.anonKey) {
    supabaseClient = supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey);
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
    return window.MemberPortalRoutes
      ? window.MemberPortalRoutes.dashboardUrl()
      : "../membership-dashboard.html";
  }

  function setStatus(message, isError) {
    var el = document.getElementById("requestStatus");
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("is-error", Boolean(isError));
  }

  function resetSubmitButton(btn) {
    if (!btn) return;
    btn.innerHTML = '<i class="bi bi-send-fill" aria-hidden="true"></i><span>Submit Request</span>';
  }

  function pickForm(form, keys) {
    for (var i = 0; i < keys.length; i++) {
      var value = form && form[keys[i]];
      if (value !== undefined && value !== null && String(value).trim()) {
        return String(value).trim();
      }
    }
    return "";
  }

  function getMemberFields(session, stored, enrollment) {
    var form = (enrollment && enrollment.form_data) || {};
    return {
      name: pickForm(form, ["fieldFullName", "full_name", "name"]) || (session && session.name) || "",
      mobile: pickForm(form, ["fieldMobile", "mobile_number", "mobile"]) || (session && session.phone) || "",
      email: pickForm(form, ["fieldEmail", "email"]) || (enrollment && enrollment.email) || (session && session.email) || "",
      plan: (enrollment && enrollment.plan) || (stored && stored.plan) || "",
      uid: (enrollment && enrollment.uid) || (stored && stored.uid) || (session && session.uid) || "",
      enrollmentId: (enrollment && enrollment.id) || (stored && stored.enrollmentId) || ""
    };
  }

  async function fetchEnrollment(enrollmentId) {
    if (!supabaseClient || !enrollmentId) return null;
    var result = await supabaseClient
      .from("membership_enrollments")
      .select("id, uid, email, plan, form_data")
      .eq("id", enrollmentId)
      .maybeSingle();
    if (result.error) return null;
    return result.data;
  }

  function renderService(service) {
    document.title = service.title + " | Astikan Member Portal";
    document.body.setAttribute("data-member-page", service.page);

    var titleEl = document.getElementById("serviceTitle");
    var descEl = document.getElementById("serviceDesc");
    var iconEl = document.getElementById("serviceIcon");
    if (titleEl) titleEl.textContent = service.title;
    if (descEl) descEl.textContent = service.desc;
    if (iconEl) iconEl.innerHTML = '<i class="bi ' + service.icon + '"></i>';

    if (window.MemberPortalNav) {
      window.MemberPortalNav.populateIdentity();
    }
  }

  async function prefillForm(service) {
    var session = readJson("astikanMemberSession");
    var stored = readJson("astikanLastEnrollment");
    var enrollment = await fetchEnrollment(stored && stored.enrollmentId);
    var member = getMemberFields(session, stored, enrollment);

    document.getElementById("fieldServiceId").value = serviceId;
    document.getElementById("fieldEnrollmentId").value = member.enrollmentId;
    document.getElementById("fieldUid").value = member.uid;
    document.getElementById("fieldName").value = member.name;
    document.getElementById("fieldMobile").value = member.mobile;
    document.getElementById("fieldEmail").value = member.email;
    document.getElementById("fieldPlan").value = member.plan;

    var detailsField = document.getElementById("fieldDetails");
    if (detailsField) {
      var preset = params.get("details") || "";
      if (!preset && params.get("test")) {
        preset = "Lab test request: " + (params.get("name") || "") + " (" + params.get("test") + ")";
      }
      if (!preset && params.get("medicine")) {
        preset = "Medicine request: " + params.get("medicine");
      }
      if (preset && !detailsField.value.trim()) {
        detailsField.value = preset;
      }
    }
  }

  function buildRequestCode() {
    if (window.AstikanFormat) return window.AstikanFormat.buildRequestCode();
    return "AR-" + Date.now().toString(36).slice(-8).toUpperCase();
  }

  async function submitRequest(form) {
    if (!supabaseClient) {
      throw new Error("Database not configured. Add Supabase keys in astikan-config.js");
    }

    var payload = {
      request_code: buildRequestCode(),
      enrollment_id: form.enrollment_id.value || null,
      uid: form.uid.value || null,
      service_id: form.service_id.value,
      service_title: document.getElementById("serviceTitle").textContent,
      plan: form.plan.value || null,
      member_name: form.member_name.value || null,
      member_email: form.member_email.value || null,
      member_mobile: form.member_mobile.value || null,
      request_details: form.request_details.value.trim(),
      preferred_date: form.preferred_date.value || null,
      status: "submitted"
    };

    var result = await supabaseClient
      .from("member_service_requests")
      .insert(payload)
      .select("id, request_code, created_at")
      .single();

    if (result.error && /request_code/i.test(result.error.message || "")) {
      delete payload.request_code;
      result = await supabaseClient
        .from("member_service_requests")
        .insert(payload)
        .select("id, request_code, created_at")
        .single();
    }

    if (result.error) {
      throw new Error(result.error.message || "Could not submit request.");
    }
    return result.data;
  }

  function showSuccess(service, saved, emailNote) {
    document.getElementById("requestFormView").style.display = "none";
    document.getElementById("requestSuccessView").style.display = "block";
    var msg = document.getElementById("successMessage");
    var code = saved && saved.request_code ? saved.request_code : "";
    var submittedAt = "";
    if (saved && saved.created_at && window.AstikanFormat) {
      submittedAt = window.AstikanFormat.formatIST(saved.created_at);
    }
    if (msg) {
      msg.innerHTML =
        "Your " + service.title.toLowerCase() + " has been received." +
        (code ? " <strong>Request ID: " + code + "</strong>." : "") +
        (submittedAt ? " Submitted at " + submittedAt + " IST." : "") +
        " " +
        (service.responseNote || "Our care team will contact you on your registered mobile or email within 24–48 hours.") +
        (emailNote || "");
    }
  }

  async function init() {
    var service = window.MemberPortalRoutes && window.MemberPortalRoutes.getService(serviceId);
    if (!service) {
      window.location.href = dashboardUrl();
      return;
    }

    renderService(service);
    await prefillForm(service);

    var footnote = document.getElementById("requestFootnote");
    if (footnote) {
      footnote.textContent = service.responseNote ||
        "Our care team will contact you on your registered mobile or email within 24–48 hours.";
    }

    var back = document.getElementById("backToDashboard");
    var backBrowse = document.getElementById("backToBrowse");
    var successBack = document.getElementById("successDashboardLink");
    if (back) back.href = dashboardUrl();
    if (successBack) successBack.href = dashboardUrl();
    if (backBrowse && window.MemberPortalRoutes) {
      var browseHref = window.MemberPortalRoutes.browseUrl(serviceId);
      backBrowse.href = browseHref;
      backBrowse.style.display = params.get("details") || params.get("test") || params.get("medicine") ? "inline-flex" : "none";
    }

    var form = document.getElementById("serviceRequestForm");
    var btn = document.getElementById("submitRequestBtn");

    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (!form.request_details.value.trim()) {
          setStatus("Please describe your request.", true);
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span>Submitting...</span>';
        setStatus("Sending your request...");

        try {
          var saved = await submitRequest(form);
          var emailNote = "";

          if (window.AstikanServiceRequestEmail && saved && saved.id) {
            var emailResult = await window.AstikanServiceRequestEmail.notifyServiceRequest(saved.id);
            if (emailResult.ok) {
              emailNote = " Confirmation email sent to you and our care team.";
            }
          }

          showSuccess(service, saved, emailNote);
        } catch (error) {
          btn.disabled = false;
          resetSubmitButton(btn);
          setStatus(error.message || "Request could not be submitted.", true);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();