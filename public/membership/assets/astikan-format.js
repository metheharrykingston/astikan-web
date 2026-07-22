(function () {
  var IST = "Asia/Kolkata";

  function formatIST(value, withTime) {
    if (!value) return "";
    try {
      var date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString("en-IN", {
        timeZone: IST,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: withTime === false ? undefined : "2-digit",
        minute: withTime === false ? undefined : "2-digit",
        hour12: withTime === false ? undefined : true
      });
    } catch (e) {
      return String(value);
    }
  }

  function shortMemberName(name) {
    var clean = String(name || "").trim();
    if (!clean) return "Member";
    var first = clean.split(/\s+/)[0] || clean;
    return first.length > 14 ? first.slice(0, 14) : first;
  }

  var CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  function shortId(value, prefix) {
    var raw = String(value || "").replace(/-/g, "").toUpperCase();
    if (!raw) return "";
    return (prefix || "") + raw.slice(0, 8);
  }

  function generateEnrollmentCode(length) {
    var size = length || 8;
    var code = "";
    for (var i = 0; i < size; i += 1) {
      code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
    }
    return code;
  }

  function displayEnrollmentId(enrollment) {
    if (!enrollment) return "";
    if (enrollment.enrollment_code) return enrollment.enrollment_code;
    return shortId(enrollment.id || "");
  }

  function planPolicyPrefix(plan) {
    var key = String(plan || "").trim().toLowerCase();
    if (key.indexOf("silver") !== -1) return "SIL";
    if (key.indexOf("gold") !== -1) return "GLD";
    if (key.indexOf("platinum") !== -1) return "PLT";
    return "MEM";
  }

  function displayPolicyNumber(enrollment) {
    if (!enrollment) return "";
    if (enrollment.policy_number) return enrollment.policy_number;
    var code = displayEnrollmentId(enrollment);
    if (!code) return "";
    return planPolicyPrefix(enrollment.plan) + "-" + code;
  }

  function buildRequestCode() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: IST,
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    var map = {};
    parts.forEach(function (part) {
      if (part.type !== "literal") map[part.type] = part.value;
    });
    var stamp = (map.year || "00") + (map.month || "00") + (map.day || "00");
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "AR-" + stamp + "-" + rand;
  }

  window.AstikanFormat = {
    formatIST: formatIST,
    shortMemberName: shortMemberName,
    shortId: shortId,
    generateEnrollmentCode: generateEnrollmentCode,
    displayEnrollmentId: displayEnrollmentId,
    displayPolicyNumber: displayPolicyNumber,
    planPolicyPrefix: planPolicyPrefix,
    buildRequestCode: buildRequestCode
  };
})();