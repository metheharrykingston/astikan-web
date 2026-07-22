(function () {
  var MIN_AGE = 18;
  var MAX_AGE = 65;

  var FIELD_IDS = {
    fullName: "fieldFullName",
    dob: "dobInput",
    gender: "fieldGender",
    maritalStatus: "fieldMaritalStatus",
    mobile: "fieldMobile",
    addressLine1: "fieldAddressLine1",
    addressLine2: "fieldAddressLine2",
    pincode: "fieldPincode",
    state: "fieldState",
    city: "fieldCity",
    country: "fieldCountry",
    address: "fieldAddress",
    email: "fieldEmail",
    aadhaar: "fieldAadhaar",
    pan: "fieldPan",
    photo: "fieldPhoto",
    addressProof: "fieldAddressProof",
    nomineeName: "fieldNomineeName",
    nomineeRelation: "fieldNomineeRelation",
    nomineeDob: "fieldNomineeDob",
    nomineeContact: "fieldNomineeContact",
    policyHolderRelation: "fieldPolicyHolderRelation",
    heightFt: "fieldHeightFt",
    heightIn: "fieldHeightIn",
    weight: "fieldWeight",
    habits: "fieldHabits",
    occupation: "fieldOccupation",
    pastSurgeries: "fieldPastSurgeries",
    surgeryYear: "fieldSurgeryYear",
    medications: "fieldMedications",
    declaration: "goodHealthDeclaration",
    privacy: "privacyPolicyDeclaration"
  };

  function $(id) {
    return id ? document.getElementById(id) : null;
  }

  function findFieldByLabel(form, labelText) {
    var groups = form.querySelectorAll(".form-group");
    for (var i = 0; i < groups.length; i++) {
      var label = groups[i].querySelector(".label");
      if (label && label.textContent.toLowerCase().indexOf(labelText.toLowerCase()) !== -1) {
        return groups[i].querySelector("input, select, textarea");
      }
    }
    return null;
  }

  function getField(form, key, labelFallback) {
    var id = FIELD_IDS[key];
    if (id) {
      var byId = $(id);
      if (byId) return byId;
    }
    return labelFallback ? findFieldByLabel(form, labelFallback) : null;
  }

  function normalizeAadhaar(value, field) {
    if (field && field.dataset && field.dataset.raw) {
      return field.dataset.raw.replace(/\D/g, "").slice(0, 12);
    }
    return (value || "").replace(/\D/g, "").slice(0, 12);
  }

  function normalizePan(value) {
    return (value || "").trim().toUpperCase();
  }

  function normalizeMobile(value) {
    var digits = (value || "").replace(/\D/g, "");
    if (digits.length === 12 && digits.indexOf("91") === 0) digits = digits.slice(2);
    if (digits.length === 11 && digits[0] === "0") digits = digits.slice(1);
    return digits;
  }

  function isValidFullName(value) {
    var name = (value || "").trim().replace(/\s+/g, " ");
    var parts = name.split(" ").filter(Boolean);
    if (parts.length < 2) return false;
    for (var i = 0; i < parts.length; i++) {
      if (!/^[A-Za-z][A-Za-z.'-]{0,}$/.test(parts[i])) return false;
    }
    return true;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value || "").trim());
  }

  function isValidMobile(value) {
    return /^\d{10}$/.test(normalizeMobile(value));
  }

  function isValidAadhaar(value, field) {
    return /^\d{12}$/.test(normalizeAadhaar(value, field));
  }

  function isValidPan(value) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(normalizePan(value));
  }

  function isValidPincode(value) {
    return /^\d{6}$/.test((value || "").replace(/\D/g, ""));
  }

  function getAgeFromDob(value) {
    if (!value) return null;
    var dob = new Date(value);
    if (isNaN(dob.getTime())) return null;
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  function isFutureDate(value) {
    if (!value) return false;
    var date = new Date(value);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }

  function isValidFile(field, options) {
    options = options || {};
    if (!field || !field.files || !field.files[0]) return false;
    var file = field.files[0];
    if (options.maxMb && file.size > options.maxMb * 1024 * 1024) return false;
    if (options.acceptImages && !/^image\//i.test(file.type)) return false;
    if (options.acceptDocs && !(/^image\//i.test(file.type) || file.type === "application/pdf")) return false;
    return true;
  }

  function hasDiseaseSelection(form) {
    var chips = form.querySelectorAll(".chip-check");
    for (var i = 0; i < chips.length; i++) {
      if (chips[i].checked) return true;
    }
    return false;
  }

  function clearFieldError(field) {
    if (!field) return;
    var highlight = resolveHighlightTarget(field);
    if (highlight) highlight.classList.remove("field-invalid");
    field.classList.remove("field-invalid");
    var group = field.closest(".form-group") || field.closest(".file-upload-wrapper")?.parentElement;
    if (!group) return;
    group.classList.remove("has-error");
    var err = group.querySelector(".field-error");
    if (err) err.remove();
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".field-invalid").forEach(function (el) {
      el.classList.remove("field-invalid");
    });
    form.querySelectorAll(".form-group.has-error").forEach(function (el) {
      el.classList.remove("has-error");
    });
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.remove();
    });
  }

  function resolveHighlightTarget(field) {
    if (!field) return null;
    if (field.classList && field.classList.contains("chip-check")) {
      return field.closest(".chips-container") || field;
    }
    if (field.type === "file") {
      return field.closest(".file-upload-wrapper") || field;
    }
    return field;
  }

  function markFieldError(field, message) {
    if (!field) return;
    var highlight = resolveHighlightTarget(field);
    if (highlight) highlight.classList.add("field-invalid");
    if (field !== highlight) field.classList.add("field-invalid");
    var group = field.closest(".form-group") || field.closest(".file-upload-wrapper")?.parentElement;
    if (!group) return;
    group.classList.add("has-error");
    var existing = group.querySelector(".field-error");
    if (existing) {
      existing.textContent = message;
      return;
    }
    var err = document.createElement("small");
    err.className = "field-error";
    err.textContent = message;
    group.appendChild(err);
  }

  function scrollToField(field) {
    if (!field || !field.scrollIntoView) return;
    field.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function isEmptyField(field) {
    if (!field) return true;
    if (field.type === "checkbox") return !field.checked;
    if (field.type === "file") return !field.files || !field.files[0];
    return !(field.value || "").trim();
  }

  function shouldNudgeOnBlur(form, field) {
    if (!form || !field) return false;
    if (form.dataset.submitAttempted === "1") return true;
    var highlight = resolveHighlightTarget(field);
    if ((highlight && highlight.classList.contains("field-invalid")) || field.classList.contains("field-invalid")) {
      return true;
    }
    return !isEmptyField(field);
  }

  function isFocusableEnrollmentField(field) {
    if (!field || field.disabled) return false;
    if (field.type === "hidden" || field.type === "checkbox" || field.type === "button") return false;
    if (field.offsetParent === null) {
      if (field.type !== "file") return false;
      var wrap = field.closest(".file-upload-wrapper");
      if (!wrap || wrap.offsetParent === null) return false;
    }
    if (field.id === "fieldSurgeryYear" && field.style.display === "none") return false;
    return true;
  }

  function getFocusableEnrollmentFields(form) {
    if (!form) return [];
    var nodes = form.querySelectorAll("input, select, textarea");
    var fields = [];
    for (var i = 0; i < nodes.length; i++) {
      if (isFocusableEnrollmentField(nodes[i])) fields.push(nodes[i]);
    }
    return fields;
  }

  function isEnrollmentFieldComplete(form, field) {
    if (!form || !field || isEmptyField(field)) return false;
    return !validateField(form, field, { allowEmpty: false });
  }

  function focusNextEnrollmentField(form, currentField) {
    if (!form || !currentField) return;
    var fields = getFocusableEnrollmentFields(form);
    var idx = fields.indexOf(currentField);
    if (idx < 0) return;

    for (var i = idx + 1; i < fields.length; i++) {
      var next = fields[i];
      if (!isEnrollmentFieldComplete(form, next)) {
        try {
          next.focus({ preventScroll: true });
        } catch (e) {
          next.focus();
        }
        return;
      }
    }
  }

  function maybeAdvanceAfterField(form, field) {
    if (!form || !field || !isEnrollmentFieldComplete(form, field)) return;
    window.setTimeout(function () {
      focusNextEnrollmentField(form, field);
    }, 80);
  }

  function maybeAdvanceOnInput(form, field) {
    if (!form || !field) return;
    var id = field.id;
    if (id === FIELD_IDS.mobile && isValidMobile(field.value)) {
      maybeAdvanceAfterField(form, field);
      return;
    }
    if (id === FIELD_IDS.pincode && isValidPincode(field.value)) {
      maybeAdvanceAfterField(form, field);
      return;
    }
    if (id === FIELD_IDS.aadhaar && isValidAadhaar(field.value, field)) {
      maybeAdvanceAfterField(form, field);
    }
  }

  function validateField(form, field, options) {
    options = options || {};
    if (!form || !field) return null;

    if (options.allowEmpty && isEmptyField(field)) {
      clearFieldError(field);
      return null;
    }

    var id = field.id;
    var errors = [];

    if (id === FIELD_IDS.fullName) {
      if (!isValidFullName(field.value)) {
        errors.push("Enter full name as per Aadhaar/PAN — first name and surname (at least 2 words).");
      }
    }

    if (id === FIELD_IDS.dob) {
      if (!field.value) errors.push("Date of birth is required.");
      else if (isFutureDate(field.value)) errors.push("Date of birth cannot be in the future.");
      else {
        var age = getAgeFromDob(field.value);
        if (age === null || age < MIN_AGE || age > MAX_AGE) {
          errors.push("Age must be between " + MIN_AGE + " and " + MAX_AGE + " years for enrollment.");
        }
      }
    }

    if (id === FIELD_IDS.gender && !field.value) errors.push("Please select gender.");
    if (id === FIELD_IDS.maritalStatus && !field.value) errors.push("Please select marital status.");

    if (id === FIELD_IDS.mobile) {
      if (!isValidMobile(field.value)) errors.push("Enter a valid 10-digit Indian mobile number.");
      else field.value = normalizeMobile(field.value);
    }

    if (id === FIELD_IDS.addressLine1 && !(field.value || "").trim()) {
      errors.push("Address line 1 is required.");
    }

    if (id === FIELD_IDS.pincode) {
      if (!isValidPincode(field.value)) errors.push("Enter a valid 6-digit pincode.");
    }

    if (id === FIELD_IDS.state && !field.value) errors.push("Select state (auto-filled from pincode).");
    if (id === FIELD_IDS.city && !field.value) errors.push("Select city / district.");

    if (id === FIELD_IDS.email) {
      if (!isValidEmail(field.value)) errors.push("Enter a valid email address.");
    }

    if (id === FIELD_IDS.aadhaar) {
      if (!isValidAadhaar(field.value, field)) errors.push("Aadhaar must be exactly 12 digits.");
      else field.dataset.raw = normalizeAadhaar(field.value, field);
    }

    if (id === FIELD_IDS.pan) {
      if (!isValidPan(field.value)) errors.push("PAN must be format ABCDE1234F.");
      else field.value = normalizePan(field.value);
    }

    if (id === FIELD_IDS.photo) {
      if (!isValidFile(field, { maxMb: 5, acceptImages: true })) {
        errors.push("Upload passport-size photograph (image, max 5MB).");
      }
    }

    if (id === FIELD_IDS.addressProof) {
      if (!isValidFile(field, { maxMb: 10, acceptDocs: true })) {
        errors.push("Upload address proof (image or PDF, max 10MB).");
      }
    }

    if (id === FIELD_IDS.nomineeName && !isValidFullName(field.value)) {
      errors.push("Enter nominee full name (first name and surname).");
    }

    if (id === FIELD_IDS.nomineeRelation && !field.value) errors.push("Select nominee relationship.");

    if (id === FIELD_IDS.nomineeDob) {
      if (!field.value) errors.push("Nominee date of birth is required.");
      else if (isFutureDate(field.value)) errors.push("Nominee date of birth cannot be in the future.");
    }

    if (id === FIELD_IDS.nomineeContact) {
      if (!isValidMobile(field.value)) errors.push("Enter valid nominee contact (10 digits).");
      else field.value = normalizeMobile(field.value);
    }

    if (id === FIELD_IDS.policyHolderRelation) {
      var samePolicy = $( "samePolicyHolder");
      if (samePolicy && !samePolicy.checked && !(field.value || "").trim()) {
        errors.push("Enter relationship with insured person.");
      }
    }

    if (id === FIELD_IDS.heightFt || id === FIELD_IDS.heightIn) {
      var ft = getField(form, "heightFt");
      var inch = getField(form, "heightIn");
      if (!ft?.value || inch?.value === "") errors.push("Select height in feet and inches.");
    }

    if (id === FIELD_IDS.weight && !field.value) errors.push("Select weight.");
    if (id === FIELD_IDS.habits && !field.value) errors.push("Select habits.");
    if (id === FIELD_IDS.occupation && !field.value) errors.push("Select occupation.");

    if (field.classList && field.classList.contains("chip-check") && !hasDiseaseSelection(form)) {
      errors.push("Select at least one pre-existing condition (or None).");
    }

    if (id === FIELD_IDS.pastSurgeries) {
      if (!field.value) errors.push("Select past surgery status.");
      else if (field.value === "yes") {
        var year = getField(form, "surgeryYear");
        if (!year || !year.value) errors.push("Select year of past surgery.");
      }
    }

    if (id === FIELD_IDS.surgeryYear) {
      var surgery = getField(form, "pastSurgeries");
      if (surgery && surgery.value === "yes" && !field.value) {
        errors.push("Select year of past surgery.");
      }
    }

    if (id === FIELD_IDS.medications && !field.value) errors.push("Select current medications.");

    if (id === FIELD_IDS.declaration && !field.checked) {
      errors.push("Please accept the Good Health Declaration.");
    }

    if (id === FIELD_IDS.privacy && !field.checked) {
      errors.push("Please accept the Privacy Policy.");
    }

    if (errors.length) {
      markFieldError(field, errors[0]);
      return errors[0];
    }

    clearFieldError(field);
    return null;
  }

  function validateFamilyMembers(form, errors) {
    var cards = form.querySelectorAll(".family-member-card");
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var nameInput = card.querySelector('input[placeholder="Name"], input.input-field[type="text"]');
      var dobInput = card.querySelector('input[type="date"]');
      var genderSelect = card.querySelector("select");

      if (nameInput && !isValidFullName(nameInput.value)) {
        errors.push({ field: nameInput, message: "Family member #" + (i + 2) + ": enter first and surname." });
      }
      if (dobInput && !dobInput.value) {
        errors.push({ field: dobInput, message: "Family member #" + (i + 2) + ": date of birth is required." });
      } else if (dobInput && dobInput.value && isFutureDate(dobInput.value)) {
        errors.push({ field: dobInput, message: "Family member #" + (i + 2) + ": invalid date of birth." });
      }
      if (genderSelect && !genderSelect.value) {
        errors.push({ field: genderSelect, message: "Family member #" + (i + 2) + ": select gender." });
      }
    }
  }

  function collectFormErrors(form) {
    var errors = [];
    var fullName = getField(form, "fullName", "full name");
    var dob = getField(form, "dob", "date of birth");
    var gender = getField(form, "gender", "gender");
    var marital = getField(form, "maritalStatus", "marital");
    var mobile = getField(form, "mobile", "mobile");
    var line1 = getField(form, "addressLine1", "address line 1");
    var pincode = getField(form, "pincode", "pincode");
    var state = getField(form, "state", "state");
    var city = getField(form, "city", "city");
    var address = getField(form, "address", "residential address");
    var email = getField(form, "email", "email");
    var aadhaar = getField(form, "aadhaar", "aadhaar");
    var pan = getField(form, "pan", "pan");
    var photo = getField(form, "photo", "photograph");
    var addressProof = getField(form, "addressProof", "address proof");
    var nomineeName = getField(form, "nomineeName", "nominee name");
    var nomineeRelation = getField(form, "nomineeRelation", "relationship");
    var nomineeDob = getField(form, "nomineeDob", "nominee dob");
    var nomineeContact = getField(form, "nomineeContact", "contact details");
    var declaration = getField(form, "declaration", "good health");
    var privacy = getField(form, "privacy");
    var samePolicy = $("samePolicyHolder");
    var policyRelation = getField(form, "policyHolderRelation", "relationship with insured");
    var heightFt = getField(form, "heightFt");
    var heightIn = getField(form, "heightIn");
    var weight = getField(form, "weight");
    var habits = getField(form, "habits", "habits");
    var occupation = getField(form, "occupation", "occupation");
    var pastSurgeries = getField(form, "pastSurgeries", "past surger");
    var surgeryYear = getField(form, "surgeryYear");
    var medications = getField(form, "medications", "current medication");

    function push(field, message) {
      errors.push({ field: field, message: message });
    }

    if (!fullName || !isValidFullName(fullName.value)) {
      push(fullName, "Enter full name as per Aadhaar/PAN — first name and surname (at least 2 words).");
    }

    if (!dob || !dob.value) push(dob, "Date of birth is required.");
    else if (isFutureDate(dob.value)) push(dob, "Date of birth cannot be in the future.");
    else {
      var age = getAgeFromDob(dob.value);
      if (age === null || age < MIN_AGE || age > MAX_AGE) {
        push(dob, "Age must be between " + MIN_AGE + " and " + MAX_AGE + " years for enrollment.");
      }
    }

    if (!gender || !gender.value) push(gender, "Please select gender.");
    if (!marital || !marital.value) push(marital, "Please select marital status.");
    if (!mobile || !isValidMobile(mobile.value)) push(mobile, "Enter a valid 10-digit Indian mobile number.");
    else mobile.value = normalizeMobile(mobile.value);

    if (line1) {
      if (!(line1.value || "").trim()) push(line1, "Address line 1 is required.");
      if (!pincode || !isValidPincode(pincode.value)) push(pincode, "Enter a valid 6-digit pincode.");
      if (!state || !state.value) push(state, "Select state (auto-filled from pincode).");
      if (!city || !city.value) push(city, "Select city / district.");
    } else if (!address || (address.value || "").trim().length < 10) {
      push(address, "Enter complete residential address.");
    } else if (!isValidPincode(address.value)) {
      push(address, "Address should include a valid 6-digit pincode.");
    }

    if (!email || !isValidEmail(email.value)) push(email, "Enter a valid email address.");

    if (!aadhaar || !isValidAadhaar(aadhaar.value, aadhaar)) push(aadhaar, "Aadhaar must be exactly 12 digits.");
    else aadhaar.dataset.raw = normalizeAadhaar(aadhaar.value, aadhaar);

    if (!pan || !isValidPan(pan.value)) push(pan, "PAN must be format ABCDE1234F.");
    else pan.value = normalizePan(pan.value);

    if (!isValidFile(photo, { maxMb: 5, acceptImages: true })) {
      push(photo, "Upload passport-size photograph (image, max 5MB).");
    }

    if (!isValidFile(addressProof, { maxMb: 10, acceptDocs: true })) {
      push(addressProof, "Upload address proof (image or PDF, max 10MB).");
    }

    if (!nomineeName || !isValidFullName(nomineeName.value)) push(nomineeName, "Enter nominee full name.");
    if (!nomineeRelation || !nomineeRelation.value) push(nomineeRelation, "Select nominee relationship.");
    if (!nomineeDob || !nomineeDob.value) push(nomineeDob, "Nominee date of birth is required.");
    else if (isFutureDate(nomineeDob.value)) push(nomineeDob, "Nominee DOB cannot be in the future.");
    if (!nomineeContact || !isValidMobile(nomineeContact.value)) push(nomineeContact, "Enter valid nominee contact.");
    else nomineeContact.value = normalizeMobile(nomineeContact.value);

    if (samePolicy && !samePolicy.checked && policyRelation && !(policyRelation.value || "").trim()) {
      push(policyRelation, "Enter relationship with insured person.");
    }

    if (!hasDiseaseSelection(form)) {
      var chipBox = form.querySelector(".chips-container");
      push(chipBox, "Select at least one pre-existing condition (or None).");
    }

    if (!heightFt?.value || heightIn?.value === "") push(heightFt, "Select height in feet and inches.");
    if (!weight || !weight.value) push(weight, "Select weight.");
    if (!habits || !habits.value) push(habits, "Select habits.");
    if (!occupation || !occupation.value) push(occupation, "Select occupation.");
    if (!pastSurgeries || !pastSurgeries.value) push(pastSurgeries, "Select past surgery status.");
    else if (pastSurgeries.value === "yes" && (!surgeryYear || !surgeryYear.value)) {
      push(surgeryYear, "Select year of past surgery.");
    }
    if (!medications || !medications.value) push(medications, "Select current medications.");

    if (!declaration || !declaration.checked) push(declaration, "Please accept the Good Health Declaration.");
    if (!privacy || !privacy.checked) push(privacy, "Please accept the Privacy Policy.");

    validateFamilyMembers(form, errors);
    return errors;
  }

  window.validateEnrollmentField = function (field, options) {
    var form = document.getElementById("enrollmentForm");
    if (!form || !field) return null;
    options = options || {};
    if (options.soft === undefined && !shouldNudgeOnBlur(form, field)) {
      options.allowEmpty = true;
    }
    return validateField(form, field, options);
  };

  window.validateEnrollmentForm = function (options) {
    options = options || {};
    var form = document.getElementById("enrollmentForm");
    if (!form) return { valid: true, message: "" };

    if (!options.silent) clearFieldErrors(form);

    var errors = collectFormErrors(form);

    if (!options.silent) {
      for (var j = 0; j < errors.length; j++) {
        markFieldError(errors[j].field, errors[j].message);
      }
      if (errors.length) {
        form.dataset.submitAttempted = "1";
        scrollToField(errors[0].field);
        if (errors[0].field && errors[0].field.focus) {
          errors[0].field.focus({ preventScroll: true });
        }
        return { valid: false, message: errors[0].message };
      }
    } else if (errors.length) {
      return { valid: false, message: errors[0].message };
    }

    return { valid: true, message: "" };
  };

  window.wireEnrollmentInlineValidation = function (form) {
    if (!form || form.dataset.inlineValidation) return;
    form.dataset.inlineValidation = "1";

    var selector =
      "input, select, textarea, .chip-check, #goodHealthDeclaration, #privacyPolicyDeclaration";

    form.addEventListener(
      "blur",
      function (e) {
        var target = e.target;
        if (!target.matches(selector)) return;
        validateField(form, target, {
          allowEmpty: !shouldNudgeOnBlur(form, target)
        });
        maybeAdvanceAfterField(form, target);
      },
      true
    );

    form.addEventListener(
      "change",
      function (e) {
        var target = e.target;
        if (!target.matches(selector)) return;
        validateField(form, target, {
          allowEmpty: !shouldNudgeOnBlur(form, target)
        });
        maybeAdvanceAfterField(form, target);
      },
      true
    );

    form.addEventListener(
      "input",
      function (e) {
        var target = e.target;
        if (!target.matches("input, textarea")) return;
        var highlight = resolveHighlightTarget(target);
        if (
          target.classList.contains("field-invalid") ||
          (highlight && highlight.classList.contains("field-invalid"))
        ) {
          validateField(form, target, { allowEmpty: false });
        }
        maybeAdvanceOnInput(form, target);
      },
      true
    );
  };

  window.focusNextEnrollmentField = focusNextEnrollmentField;

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("enrollmentForm");
    if (form) window.wireEnrollmentInlineValidation(form);
  });
})();