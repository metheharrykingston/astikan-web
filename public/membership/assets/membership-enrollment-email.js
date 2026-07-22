(function () {
  async function sendEnrollmentWelcomeEmail(enrollmentId, loginMethod) {
    var config = window.ASTIKAN_CONFIG || {};
    var supabaseConfig = config.supabase || {};
    if (!supabaseConfig.url || !supabaseConfig.anonKey || !enrollmentId) {
      return { ok: false, error: "Missing Supabase config or enrollment ID" };
    }

    try {
      var response = await fetch(supabaseConfig.url + "/functions/v1/send-enrollment-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + supabaseConfig.anonKey,
          apikey: supabaseConfig.anonKey
        },
        body: JSON.stringify({
          enrollmentId: enrollmentId,
          loginMethod: loginMethod || ""
        })
      });

      var result = {};
      try {
        result = await response.json();
      } catch (e) {
        result = { error: "Invalid response from email service" };
      }

      if (!response.ok) {
        return { ok: false, error: result.error || "Welcome email failed" };
      }

      return { ok: true, data: result };
    } catch (error) {
      return { ok: false, error: error.message || "Welcome email failed" };
    }
  }

  window.AstikanMembershipEnrollmentEmail = {
    sendEnrollmentWelcomeEmail: sendEnrollmentWelcomeEmail
  };
})();