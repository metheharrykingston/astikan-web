(function () {
  var continueEnrollment = window.openLoginModal;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function value(id, fallback) {
    var field = document.getElementById(id);
    if (!field) return fallback || "—";
    if (field.type === "file") {
      return field.files && field.files[0] ? field.files[0].name : "Not uploaded";
    }
    if (field.tagName === "SELECT") {
      return field.selectedIndex >= 0
        ? field.options[field.selectedIndex].text
        : fallback || "—";
    }
    return field.value || fallback || "—";
  }

  function mask(valueToMask, visible) {
    var clean = String(valueToMask || "").replace(/\s/g, "");
    if (!clean) return "—";
    return "•".repeat(Math.max(0, clean.length - visible)) + clean.slice(-visible);
  }

  function summaryRow(label, displayValue) {
    return (
      '<div class="enrollment-confirm-row">' +
        "<dt>" + escapeHtml(label) + "</dt>" +
        "<dd>" + escapeHtml(displayValue) + "</dd>" +
      "</div>"
    );
  }

  function summaryGroup(title, icon, rows) {
    return (
      '<section class="enrollment-confirm-group">' +
        '<h4><i class="bi ' + icon + '"></i>' + escapeHtml(title) + "</h4>" +
        "<dl>" + rows.join("") + "</dl>" +
      "</section>"
    );
  }

  function selectedDiseases() {
    var selected = [];
    document.querySelectorAll(".chip-check:checked").forEach(function (field) {
      var label = document.querySelector('label[for="' + field.id + '"]');
      if (label) selected.push(label.textContent.trim());
    });
    return selected.length ? selected.join(", ") : "None selected";
  }

  function familyMembers() {
    var members = [];
    document.querySelectorAll("#familyMembersList .family-member-card").forEach(function (card) {
      var fields = card.querySelectorAll("input, select");
      var details = [];
      fields.forEach(function (field) {
        var label = field.closest(".form-group")?.querySelector(".label")?.textContent.trim();
        var fieldValue = field.tagName === "SELECT"
          ? field.options[field.selectedIndex]?.text
          : field.value;
        if (label && fieldValue) details.push(label + ": " + fieldValue);
      });
      if (details.length) members.push(details.join(" · "));
    });
    return members.length ? members.join(" | ") : "No additional family members";
  }

  function buildSummary() {
    var plan = document.querySelector(".plan-title")?.textContent.trim() || "Membership Plan";
    var premium = document.querySelector(".plan-price .big")?.textContent.trim()
      || document.querySelector(".premium-amount")?.textContent.trim()
      || "—";
    var address = [
      value("fieldAddressLine1", ""),
      value("fieldAddressLine2", ""),
      value("fieldCity", ""),
      value("fieldState", ""),
      value("fieldPincode", ""),
      value("fieldCountry", "")
    ].filter(function (item) { return item && item !== "—"; }).join(", ");

    return (
      '<div class="enrollment-confirm-plan">' +
        '<div><span>Selected membership</span><strong>' + escapeHtml(plan) + "</strong></div>" +
        '<div class="enrollment-confirm-price"><span>Yearly premium</span><strong>' + escapeHtml(premium) + "</strong></div>" +
      "</div>" +
      '<div class="enrollment-confirm-grid">' +
        summaryGroup("Personal information", "bi-person-vcard", [
          summaryRow("Full name", value("fieldFullName")),
          summaryRow("Date of birth", value("dobInput")),
          summaryRow("Age", value("ageDisplay")),
          summaryRow("Gender", value("fieldGender")),
          summaryRow("Mobile", value("fieldMobile")),
          summaryRow("Email", value("fieldEmail")),
          summaryRow("Address", address || value("fieldAddress"))
        ]) +
        summaryGroup("KYC documents", "bi-shield-check", [
          summaryRow("Aadhaar", mask(value("fieldAadhaar", ""), 4)),
          summaryRow("PAN", mask(value("fieldPan", ""), 4)),
          summaryRow("Photograph", value("fieldPhoto")),
          summaryRow("Address proof", value("fieldAddressProof"))
        ]) +
        summaryGroup("Nominee", "bi-person-heart", [
          summaryRow("Name", value("fieldNomineeName")),
          summaryRow("Relationship", value("fieldNomineeRelation")),
          summaryRow("Date of birth", value("fieldNomineeDob")),
          summaryRow("Contact", value("fieldNomineeContact"))
        ]) +
        summaryGroup("Coverage and health", "bi-heart-pulse", [
          summaryRow("Family members", familyMembers()),
          summaryRow("Health conditions", selectedDiseases()),
          summaryRow("Height", value("fieldHeightFt") + " " + value("fieldHeightIn")),
          summaryRow("Weight", value("fieldWeight") + " kg"),
          summaryRow("BMI", value("bmiResult")),
          summaryRow("Past surgeries", value("fieldPastSurgeries")),
          summaryRow("Medication", value("fieldMedications")),
          summaryRow("Habits", value("fieldHabits")),
          summaryRow("Occupation", value("fieldOccupation"))
        ]) +
      "</div>"
    );
  }

  function ensureModal() {
    if (document.getElementById("enrollmentConfirmationModal")) return;
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div aria-hidden="true" class="enrollment-confirm-overlay" id="enrollmentConfirmationModal">' +
        '<div aria-labelledby="enrollmentConfirmationTitle" aria-modal="true" class="enrollment-confirm-dialog" role="dialog">' +
          '<header class="enrollment-confirm-head">' +
            '<div><span class="enrollment-confirm-eyebrow">CHECK BEFORE PAYMENT</span>' +
            '<h3 id="enrollmentConfirmationTitle">Confirm your enrollment details</h3>' +
            '<p>Please review the information below. You can edit anything before continuing.</p></div>' +
            '<button aria-label="Close confirmation" class="enrollment-confirm-close" type="button"><i class="bi bi-x-lg"></i></button>' +
          "</header>" +
          '<div class="enrollment-confirm-body" id="enrollmentConfirmationBody"></div>' +
          '<footer class="enrollment-confirm-actions">' +
            '<button class="enrollment-confirm-edit" type="button"><i class="bi bi-pencil"></i> Edit details</button>' +
            '<button class="enrollment-confirm-pay" type="button">Confirm &amp; continue <i class="bi bi-arrow-right"></i></button>' +
          "</footer>" +
        "</div>" +
      "</div>"
    );

    var overlay = document.getElementById("enrollmentConfirmationModal");
    var close = function () {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    overlay.querySelector(".enrollment-confirm-close").addEventListener("click", close);
    overlay.querySelector(".enrollment-confirm-edit").addEventListener("click", close);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) close();
    });
    overlay.querySelector(".enrollment-confirm-pay").addEventListener("click", function () {
      close();
      if (typeof continueEnrollment === "function") continueEnrollment();
    });
  }

  function openConfirmation() {
    if (typeof window.validateEnrollmentForm === "function") {
      var validation = window.validateEnrollmentForm();
      if (!validation.valid) return;
    }
    ensureModal();
    document.getElementById("enrollmentConfirmationBody").innerHTML = buildSummary();
    var overlay = document.getElementById("enrollmentConfirmationModal");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    overlay.querySelector(".enrollment-confirm-close").focus();
  }

  window.openLoginModal = openConfirmation;
})();
