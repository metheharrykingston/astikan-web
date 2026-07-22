(function () {
  function getConfig() {
    return window.ASTIKAN_CONFIG || {};
  }

  function apiHeaders(supabaseConfig) {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + supabaseConfig.anonKey,
      apikey: supabaseConfig.anonKey
    };
  }

  async function callCertificateApi(body) {
    var config = getConfig();
    var supabaseConfig = config.supabase || {};
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { ok: false, error: "Missing Supabase config" };
    }

    try {
      var response = await fetch(supabaseConfig.url + "/functions/v1/send-policy-certificate", {
        method: "POST",
        headers: apiHeaders(supabaseConfig),
        body: JSON.stringify(body)
      });

      var result = {};
      try {
        result = await response.json();
      } catch (e) {
        result = {};
      }

      if (!response.ok) {
        if (response.status === 503 || result.code === "BOOT_ERROR") {
          return {
            ok: false,
            error:
              "Certificate service is not running on Supabase. " +
              "Redeploy: supabase functions deploy send-policy-certificate"
          };
        }
        return { ok: false, error: result.error || result.message || "Certificate request failed" };
      }

      return { ok: true, data: result };
    } catch (error) {
      return {
        ok: false,
        error:
          (error && error.message) ||
          "Could not reach certificate service. Deploy send-policy-certificate on Supabase."
      };
    }
  }

  async function sendPolicyCertificate(enrollmentId, resend) {
    if (!enrollmentId) {
      return { ok: false, error: "Missing enrollment ID" };
    }
    return callCertificateApi({ enrollmentId: enrollmentId, resend: Boolean(resend) });
  }

  async function previewPolicyCertificate(enrollmentId) {
    if (!enrollmentId) {
      return { ok: false, error: "Missing enrollment ID" };
    }
    return callCertificateApi({ enrollmentId: enrollmentId, preview: true });
  }

  window.AstikanMembershipCertificate = {
    sendPolicyCertificate: sendPolicyCertificate,
    previewPolicyCertificate: previewPolicyCertificate
  };
})();