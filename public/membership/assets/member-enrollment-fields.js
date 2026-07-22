(function () {
  var FIELD_LABELS = {
    fieldFullName: "Full Name",
    full_name: "Full Name",
    name: "Full Name",
    fieldEmail: "Email",
    email: "Email",
    fieldMobile: "Mobile",
    mobile_number: "Mobile",
    mobile: "Mobile",
    fieldGender: "Gender",
    gender: "Gender",
    dobInput: "Date of Birth",
    date_of_birth: "Date of Birth",
    ageDisplay: "Age",
    fieldAadhaar: "Aadhaar",
    fieldPan: "PAN",
    fieldAddress: "Address",
    fieldAddressLine1: "Address Line 1",
    fieldAddressLine2: "Address Line 2",
    fieldPincode: "Pincode",
    fieldCity: "City",
    fieldState: "State",
    fieldCountry: "Country",
    fieldHeightFt: "Height (ft)",
    fieldHeightIn: "Height (in)",
    fieldWeightKg: "Weight (kg)",
    bmiResult: "BMI",
    fieldNomineeName: "Nominee Name",
    fieldNomineeRelation: "Nominee Relation",
    fieldNomineeDob: "Nominee DOB",
    fieldNomineeContact: "Nominee Contact",
    fieldPolicyHolderRelation: "Policy Holder Relation",
    fieldMaritalStatus: "Marital Status"
  };

  var DISPLAY_ORDER = [
    "fieldFullName",
    "fieldEmail",
    "fieldMobile",
    "fieldGender",
    "dobInput",
    "ageDisplay",
    "fieldAadhaar",
    "fieldPan",
    "fieldAddressLine1",
    "fieldAddressLine2",
    "fieldCity",
    "fieldState",
    "fieldPincode",
    "fieldCountry",
    "fieldAddress",
    "fieldHeightFt",
    "fieldHeightIn",
    "fieldWeightKg",
    "bmiResult",
    "fieldNomineeName",
    "fieldNomineeRelation",
    "fieldNomineeContact",
    "fieldNomineeDob",
    "fieldPolicyHolderRelation",
    "fieldMaritalStatus"
  ];

  function pickForm(formData, keys) {
    if (!formData) return "";
    for (var i = 0; i < keys.length; i++) {
      var value = formData[keys[i]];
      if (value !== undefined && value !== null && String(value).trim()) {
        return String(value).trim();
      }
    }
    return "";
  }

  function formatValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
      if (!value.length) return "";
      if (value[0] && value[0].name) {
        return value.map(function (item) {
          return item.name + (item.size ? " (" + Math.round(item.size / 1024) + " KB)" : "");
        }).join(", ");
      }
      return value.join(", ");
    }
    return String(value).trim();
  }

  function memberName(formData, session, enrollment) {
    return (
      pickForm(formData, ["fieldFullName", "full_name", "name"]) ||
      (session && (session.name || session.email)) ||
      (enrollment && enrollment.email) ||
      "Member"
    );
  }

  function memberMobile(formData, session) {
    return (
      pickForm(formData, ["fieldMobile", "mobile_number", "mobile"]) ||
      (session && session.phone) ||
      ""
    );
  }

  function memberEmail(formData, session, enrollment) {
    return (
      pickForm(formData, ["fieldEmail", "email"]) ||
      (enrollment && enrollment.email) ||
      (session && session.email) ||
      ""
    );
  }

  function buildDetailRows(formData) {
    var rows = [];
    var seen = {};

    for (var i = 0; i < DISPLAY_ORDER.length; i++) {
      var key = DISPLAY_ORDER[i];
      var value = formatValue(formData && formData[key]);
      if (!value || seen[key]) continue;
      seen[key] = true;
      rows.push({
        key: key,
        label: FIELD_LABELS[key] || key,
        value: value
      });
    }

    if (formData) {
      Object.keys(formData).forEach(function (key) {
        if (seen[key]) return;
        if (key === "pageTitle" || key === "plan" || key === "conditions") return;
        if (key.indexOf("fieldPhoto") === 0 || key.indexOf("fieldAddressProof") === 0) return;
        var value = formatValue(formData[key]);
        if (!value) return;
        rows.push({
          key: key,
          label: FIELD_LABELS[key] || key.replace(/_/g, " "),
          value: value
        });
      });
    }

    return rows;
  }

  function buildPolicyNumber(plan, enrollmentOrId) {
    if (window.AstikanFormat && enrollmentOrId && typeof enrollmentOrId === "object") {
      return window.AstikanFormat.displayPolicyNumber(enrollmentOrId);
    }
    var code = String(enrollmentOrId || "").replace(/-/g, "").slice(0, 8).toUpperCase();
    if (window.AstikanFormat) {
      return window.AstikanFormat.planPolicyPrefix(plan) + "-" + code;
    }
    return "MEM-" + code;
  }

  window.AstikanEnrollmentFields = {
    pickForm: pickForm,
    memberName: memberName,
    memberMobile: memberMobile,
    memberEmail: memberEmail,
    buildDetailRows: buildDetailRows,
    buildPolicyNumber: buildPolicyNumber,
    formatValue: formatValue
  };
})();