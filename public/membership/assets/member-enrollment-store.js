(function () {
  var supabaseClient = null;

  function getConfig() {
    return window.ASTIKAN_CONFIG || {};
  }

  function getSupabase() {
    if (supabaseClient) return supabaseClient;
    var cfg = getConfig().supabase || {};
    if (!cfg.url || !cfg.anonKey || cfg.anonKey.indexOf("PASTE_") === 0) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
    return supabaseClient;
  }

  function normalizePaymentStatus(row) {
    if (!row) return "pending";
    var status = (row.payment_status || "pending").toLowerCase();
    if (status === "paid" && (!row.payment_completed_at || !row.cashfree_order_id)) {
      return "pending";
    }
    return status;
  }

  function cacheEnrollmentRow(row) {
    if (!row || !row.id) return null;
    var cached = {
      enrollmentId: row.id,
      plan: row.plan || null,
      amount: row.payment_amount || null,
      uid: row.uid || null,
      paymentStatus: normalizePaymentStatus(row),
      formData: row.form_data || {}
    };
    try {
      localStorage.setItem("astikanLastEnrollment", JSON.stringify(cached));
    } catch (e) {}
    return cached;
  }

  async function fetchLatestEnrollmentByUid(uid) {
    var client = getSupabase();
    if (!client || !uid) return null;

    var result = await client
      .from("membership_enrollments")
      .select("id, uid, email, plan, form_data, document_urls, policy_number, certificate_sent_at, certificate_email, payment_status, payment_amount, payment_completed_at, cashfree_order_id, created_at, updated_at")
      .eq("uid", uid)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (result.error) {
      console.warn("Could not load enrollment for uid:", result.error.message);
      return null;
    }

    return result.data || null;
  }

  async function restoreEnrollmentForUser(user) {
    if (!user || !user.uid) return null;
    var row = await fetchLatestEnrollmentByUid(user.uid);
    return cacheEnrollmentRow(row);
  }

  window.AstikanEnrollmentStore = {
    getSupabase: getSupabase,
    fetchLatestEnrollmentByUid: fetchLatestEnrollmentByUid,
    cacheEnrollmentRow: cacheEnrollmentRow,
    restoreEnrollmentForUser: restoreEnrollmentForUser
  };
})();