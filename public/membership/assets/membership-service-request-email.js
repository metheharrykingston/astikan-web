(function () {
  async function notifyServiceRequest(requestId) {
    var config = window.ASTIKAN_CONFIG || {};
    var supabaseConfig = config.supabase || {};
    if (!supabaseConfig.url || !supabaseConfig.anonKey || !requestId) {
      return { ok: false, error: "Missing config or request ID" };
    }

    try {
      var response = await fetch(supabaseConfig.url + "/functions/v1/send-service-request-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + supabaseConfig.anonKey,
          apikey: supabaseConfig.anonKey
        },
        body: JSON.stringify({ requestId: requestId })
      });

      var result = {};
      try {
        result = await response.json();
      } catch (e) {
        result = {};
      }

      if (!response.ok) {
        return { ok: false, error: result.error || "Email notification failed" };
      }

      return { ok: true, data: result };
    } catch (error) {
      return {
        ok: false,
        error: (error && error.message) || "Could not reach email service"
      };
    }
  }

  window.AstikanServiceRequestEmail = {
    notifyServiceRequest: notifyServiceRequest
  };
})();