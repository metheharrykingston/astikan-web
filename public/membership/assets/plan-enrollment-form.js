(function () {
  var MIN_AGE = 18;
  var MAX_AGE = 65;
  var PINCODE_GITHUB =
    "https://github.com/saravanakumargn/All-India-Pincode-Directory";

  function $(id) {
    return document.getElementById(id);
  }

  function readJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function upgradeMaritalStatus() {
    var selects = document.querySelectorAll(".form-group select.select-field");
    for (var i = 0; i < selects.length; i++) {
      var label = selects[i].closest(".form-group")?.querySelector(".label");
      if (!label || label.textContent.toLowerCase().indexOf("marital") === -1) continue;
      selects[i].id = "fieldMaritalStatus";
      selects[i].innerHTML =
        '<option value="">Select status</option>' +
        '<option value="single">Single</option>' +
        '<option value="married">Married</option>' +
        '<option value="divorced">Divorced</option>' +
        '<option value="widowed">Widowed</option>' +
        '<option value="separated">Separated</option>';
      break;
    }
  }

  function upgradeAddressBlock() {
    var old = $("fieldAddress");
    if (!old || $("fieldAddressLine1")) return;

    var wrapper = document.createElement("div");
    wrapper.className = "address-block";
    wrapper.innerHTML =
      '<div class="form-row grid-2">' +
      '<div class="form-group"><label class="label" for="fieldAddressLine1">Address Line 1</label>' +
      '<input class="input-field" id="fieldAddressLine1" placeholder="House / Flat / Street" required type="text"/></div>' +
      '<div class="form-group"><label class="label" for="fieldAddressLine2">Address Line 2</label>' +
      '<input class="input-field" id="fieldAddressLine2" placeholder="Area / Landmark (optional)" type="text"/></div>' +
      "</div>" +
      '<div class="form-row grid-2">' +
      '<div class="form-group"><label class="label" for="fieldPincode">Pincode</label>' +
      '<input class="input-field" id="fieldPincode" inputmode="numeric" maxlength="6" placeholder="6-digit PIN" required type="text"/>' +
      '<small class="field-hint">Auto-fills city &amp; state from India Post directory (<a href="' +
      PINCODE_GITHUB +
      '" rel="noopener" target="_blank">GitHub dataset</a>)</small></div>' +
      '<div class="form-group"><label class="label" for="fieldCountry">Country</label>' +
      '<input class="input-field" id="fieldCountry" readonly required type="text" value="India"/></div>' +
      "</div>" +
      '<div class="form-row grid-2">' +
      '<div class="form-group"><label class="label" for="fieldState">State</label>' +
      '<select class="select-field" id="fieldState" required><option value="">Select state</option></select></div>' +
      '<div class="form-group"><label class="label" for="fieldCity">City / District</label>' +
      '<select class="select-field" id="fieldCity" required><option value="">Select city</option></select></div>' +
      "</div>" +
      '<input id="fieldAddress" type="hidden"/>';

    old.closest(".form-group").replaceWith(wrapper);
  }

  function upgradeMedicalFields() {
    var height = $("heightInput");
    var weight = $("weightInput");
    if (!height || $("fieldHeightFt")) return;

    var heightGroup = height.closest(".form-group");
    var weightGroup = weight.closest(".form-group");

    heightGroup.innerHTML =
      '<label class="label">Height</label>' +
      '<div class="measure-row">' +
      '<select class="select-field" id="fieldHeightFt" required><option value="">Ft</option></select>' +
      '<select class="select-field" id="fieldHeightIn" required><option value="">In</option></select>' +
      "</div>" +
      '<input id="heightInput" type="hidden"/>';

    weightGroup.innerHTML =
      '<label class="label" for="fieldWeight">Weight (kg)</label>' +
      '<select class="select-field" id="fieldWeight" required><option value="">Select weight</option></select>' +
      '<input id="weightInput" type="hidden"/>';

    var ft = $("fieldHeightFt");
    var inch = $("fieldHeightIn");
    var wt = $("fieldWeight");

    for (var f = 4; f <= 7; f++) {
      ft.innerHTML += '<option value="' + f + '">' + f + " ft</option>";
    }
    for (var i = 0; i <= 11; i++) {
      inch.innerHTML += '<option value="' + i + '">' + i + " in</option>";
    }
    for (var w = 30; w <= 200; w++) {
      wt.innerHTML += '<option value="' + w + '">' + w + " kg</option>";
    }

    var cards = document.querySelectorAll(".card");
    var medicalCard = null;
    for (var c = 0; c < cards.length; c++) {
      if (cards[c].textContent.indexOf("Medical History") !== -1) medicalCard = cards[c];
    }
    if (!medicalCard) return;

    var rows = medicalCard.querySelectorAll(".form-row.grid-2");
    for (var r = 0; r < rows.length; r++) {
      var labels = rows[r].querySelectorAll(".label");
      for (var l = 0; l < labels.length; l++) {
        var text = labels[l].textContent.toLowerCase();
        var group = labels[l].closest(".form-group");
        if (!group) continue;

        if (text.indexOf("past surger") !== -1) {
          group.innerHTML =
            '<label class="label" for="fieldPastSurgeries">Past Surgeries</label>' +
            '<select class="select-field" id="fieldPastSurgeries" required>' +
            '<option value="">Select</option><option value="none">None</option>' +
            '<option value="yes">Yes — had surgery</option></select>' +
            '<select class="select-field surgery-year-select" id="fieldSurgeryYear" style="display:none;margin-top:0.5rem;">' +
            '<option value="">Year of surgery</option></select>';
          var yearSelect = $("fieldSurgeryYear");
          var year = new Date().getFullYear();
          for (var y = year; y >= year - 40; y--) {
            yearSelect.innerHTML += '<option value="' + y + '">' + y + "</option>";
          }
        }

        if (text.indexOf("current medication") !== -1) {
          group.innerHTML =
            '<label class="label" for="fieldMedications">Current Medications</label>' +
            '<select class="select-field" id="fieldMedications" required>' +
            '<option value="">Select</option><option value="none">None</option>' +
            '<option value="bp">Blood pressure medicines</option>' +
            '<option value="diabetes">Diabetes medicines</option>' +
            '<option value="thyroid">Thyroid medicines</option>' +
            '<option value="cardiac">Heart / cardiac medicines</option>' +
            '<option value="other">Other regular medicines</option></select>';
        }

        if (text.indexOf("habits") !== -1) {
          group.innerHTML =
            '<label class="label" for="fieldHabits">Habits</label>' +
            '<select class="select-field" id="fieldHabits" required>' +
            '<option value="">Select</option>' +
            '<option value="none">Non-Smoker / Non-Drinker</option>' +
            '<option value="smoker">Smoker</option>' +
            '<option value="drinker">Consumer of Alcohol</option>' +
            '<option value="both">Both</option></select>';
        }

        if (text.indexOf("occupation") !== -1) {
          group.innerHTML =
            '<label class="label" for="fieldOccupation">Occupation</label>' +
            '<select class="select-field" id="fieldOccupation" required>' +
            '<option value="">Select</option>' +
            '<option value="low">Sedentary (Office Work)</option>' +
            '<option value="medium">Moderate (Field Work)</option>' +
            '<option value="high">High Risk (Mining, Construction, etc.)</option></select>';
        }
      }
    }
  }

  function upgradeAadhaarField() {
    var aadhaar = $("fieldAadhaar");
    if (!aadhaar || aadhaar.dataset.maskReady) return;
    aadhaar.dataset.maskReady = "1";
    aadhaar.setAttribute("placeholder", "e.g. 2345 6789 0123");
    aadhaar.setAttribute("maxlength", "14");
    aadhaar.removeAttribute("style");

    var hint = aadhaar.parentElement.querySelector("small");
    if (hint) {
      hint.className = "field-hint";
      hint.innerHTML = "Masked while typing — only last 4 digits stay visible after you leave the field.";
    }
  }

  function upgradePaymentSection() {
    var form = $("enrollmentForm");
    if (!form || $("privacyPolicyDeclaration")) return;

    var submitBtn = form.querySelector(".btn-primary");
    if (!submitBtn) return;
    submitBtn.id = "enrollmentSubmitBtn";
    submitBtn.disabled = false;
    submitBtn.classList.add("enrollment-submit-btn");

    var paymentCard = submitBtn.closest(".card");
    if (!paymentCard) return;

    var declarationCard = paymentCard.querySelector(".declaration-card");
    if (declarationCard) {
      declarationCard.classList.add("declaration-card-compact");
      declarationCard.style.marginTop = "1.25rem";
      declarationCard.style.marginBottom = "0.65rem";
      var gh = $("goodHealthDeclaration");
      if (gh) {
        var ghLabel = declarationCard.querySelector(".declaration-label");
        if (ghLabel) ghLabel.classList.add("declaration-label-compact");
      }
    }

    var privacy = document.createElement("div");
    privacy.className = "declaration-card declaration-card-compact privacy-declaration-card";
    privacy.innerHTML =
      '<label class="declaration-label declaration-label-compact" for="privacyPolicyDeclaration">' +
      '<input id="privacyPolicyDeclaration" name="privacy_policy_declaration" required type="checkbox"/>' +
      "<span>" +
      '<span class="declaration-title">Privacy Policy</span>' +
      '<p class="declaration-text">I agree to Astikan\'s <a href="/membership/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> and consent to secure processing of my personal &amp; health data for enrollment.</p>' +
      "</span></label>";

    var terms = paymentCard.querySelector("p");
    if (declarationCard) {
      declarationCard.insertAdjacentElement("afterend", privacy);
    }

    var bar = document.createElement("div");
    bar.className = "enrollment-submit-bar";
    bar.innerHTML =
      '<div class="enrollment-submit-inner">' +
      '<div class="enrollment-submit-meta">' +
      '<span class="enrollment-submit-label">Ready to enroll</span>' +
      '<span class="enrollment-submit-hint" id="enrollmentSubmitHint">Complete all required fields</span>' +
      "</div></div>";
    bar.querySelector(".enrollment-submit-inner").appendChild(submitBtn);
    paymentCard.appendChild(bar);

    if (terms) terms.classList.add("enrollment-terms-note");

    var coverageCard = form.querySelector(".coverage-grid")?.closest(".card");
    if (coverageCard) coverageCard.classList.add("coverage-card-compact");
  }

  function normalizeAadhaarDigits(value) {
    return (value || "").replace(/\D/g, "").slice(0, 12);
  }

  function formatAadhaarDisplay(digits, mask) {
    if (!digits) return "";
    var parts = [];
    if (mask && digits.length > 4) {
      var hidden = digits.slice(0, -4).replace(/\d/g, "X");
      var tail = digits.slice(-4);
      var combined = hidden + tail;
      for (var i = 0; i < combined.length; i += 4) {
        parts.push(combined.slice(i, i + 4));
      }
    } else {
      for (var j = 0; j < digits.length; j += 4) {
        parts.push(digits.slice(j, j + 4));
      }
    }
    return parts.join(" ");
  }

  function syncHeightWeightHidden() {
    var ft = parseInt($("fieldHeightFt")?.value || "", 10);
    var inch = parseInt($("fieldHeightIn")?.value || "", 10);
    var weight = parseInt($("fieldWeight")?.value || "", 10);
    var heightHidden = $("heightInput");
    var weightHidden = $("weightInput");
    var bmiResult = $("bmiResult");

    if (heightHidden && !isNaN(ft)) {
      var totalInches = ft * 12 + (isNaN(inch) ? 0 : inch);
      var cm = Math.round(totalInches * 2.54);
      heightHidden.value = cm > 0 ? String(cm) : "";
    }

    if (weightHidden && !isNaN(weight)) {
      weightHidden.value = String(weight);
    }

    if (bmiResult && heightHidden?.value && weightHidden?.value) {
      var hM = parseFloat(heightHidden.value) / 100;
      var wKg = parseFloat(weightHidden.value);
      if (hM > 0 && wKg > 0) {
        var bmi = (wKg / (hM * hM)).toFixed(1);
        bmiResult.value = bmi;
        if (bmi < 18.5) bmiResult.style.color = "#f59e0b";
        else if (bmi < 25) bmiResult.style.color = "#10b981";
        else bmiResult.style.color = "#ef4444";
      } else {
        bmiResult.value = "--";
        bmiResult.style.color = "var(--text-main)";
      }
    }
  }

  function syncAddressHidden() {
    var hidden = $("fieldAddress");
    if (!hidden) return;
    var parts = [
      $("fieldAddressLine1")?.value?.trim(),
      $("fieldAddressLine2")?.value?.trim(),
      $("fieldCity")?.value?.trim(),
      $("fieldState")?.value?.trim(),
      $("fieldPincode")?.value?.trim(),
      $("fieldCountry")?.value?.trim()
    ].filter(Boolean);
    hidden.value = parts.join(", ");
  }

  var pincodeCache = {};

  function fillStateCityOptions(stateName, cities) {
    var state = $("fieldState");
    var city = $("fieldCity");
    if (!state || !city) return;

    state.innerHTML = '<option value="">Select state</option>';
    if (stateName) {
      state.innerHTML += '<option selected value="' + stateName + '">' + stateName + "</option>";
    }

    city.innerHTML = '<option value="">Select city</option>';
    var unique = [];
    for (var i = 0; i < cities.length; i++) {
      if (unique.indexOf(cities[i]) === -1) unique.push(cities[i]);
    }
    unique.sort();
    for (var j = 0; j < unique.length; j++) {
      city.innerHTML += '<option value="' + unique[j] + '">' + unique[j] + "</option>";
    }
    if (unique.length === 1) city.value = unique[0];
  }

  async function lookupPincode(pin) {
    if (pincodeCache[pin]) return pincodeCache[pin];

    var result = { state: "", cities: [], country: "India", ok: false };

    try {
      var response = await fetch("https://api.postalpincode.in/pincode/" + pin);
      var data = await response.json();
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
        var offices = data[0].PostOffice;
        var cities = [];
        for (var i = 0; i < offices.length; i++) {
          if (offices[i].District) cities.push(offices[i].District);
          if (!result.state && offices[i].State) result.state = offices[i].State;
          if (offices[i].Country) result.country = offices[i].Country;
        }
        result.cities = cities;
        result.ok = true;
      }
    } catch (e) {}

    pincodeCache[pin] = result;
    return result;
  }

  function wirePincodeLookup() {
    var pin = $("fieldPincode");
    if (!pin || pin.dataset.wired) return;
    pin.dataset.wired = "1";

    var timer;
    function runLookup() {
      var value = (pin.value || "").replace(/\D/g, "");
      pin.value = value;
      if (value.length !== 6) return;

      pin.classList.add("is-loading");
      lookupPincode(value)
        .then(function (result) {
          pin.classList.remove("is-loading");
          if (!result.ok) return;
          fillStateCityOptions(result.state, result.cities);
          var country = $("fieldCountry");
          if (country) country.value = result.country || "India";
          syncAddressHidden();
        })
        .catch(function () {
          pin.classList.remove("is-loading");
        });
    }

    pin.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(runLookup, 350);
    });
    pin.addEventListener("blur", runLookup);
  }

  function wireAadhaarMasking() {
    var field = $("fieldAadhaar");
    if (!field || field.dataset.wired) return;
    field.dataset.wired = "1";

    field.addEventListener("input", function () {
      var digits = normalizeAadhaarDigits(field.value);
      field.dataset.raw = digits;
      field.value = formatAadhaarDisplay(digits, false);
    });

    field.addEventListener("focus", function () {
      var digits = field.dataset.raw || normalizeAadhaarDigits(field.value);
      field.value = formatAadhaarDisplay(digits, false);
    });

    field.addEventListener("blur", function () {
      var digits = field.dataset.raw || normalizeAadhaarDigits(field.value);
      field.dataset.raw = digits;
      field.value = formatAadhaarDisplay(digits, true);
    });
  }

  function wireSurgeryYearToggle() {
    var surgery = $("fieldPastSurgeries");
    var year = $("fieldSurgeryYear");
    if (!surgery || !year) return;

    surgery.addEventListener("change", function () {
      if (surgery.value === "yes") {
        year.style.display = "block";
        year.required = true;
      } else {
        year.style.display = "none";
        year.required = false;
        year.value = "";
      }
      updateSubmitState();
    });
  }

  function wireDiseaseNoneExclusive() {
    var none = $("d6");
    if (!none) return;
    var chips = document.querySelectorAll(".chip-check");
    none.addEventListener("change", function () {
      if (!none.checked) return;
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].id !== "d6") chips[i].checked = false;
      }
      updateSubmitState();
    });
    for (var j = 0; j < chips.length; j++) {
      if (chips[j].id === "d6") continue;
      chips[j].addEventListener("change", function () {
        if (this.checked) none.checked = false;
        updateSubmitState();
      });
    }
  }

  function updateSubmitState() {
    var btn = $("enrollmentSubmitBtn");
    var hint = $("enrollmentSubmitHint");
    if (!btn) return;

    var valid = false;
    var message = "Complete all required fields";

    if (typeof window.validateEnrollmentForm === "function") {
      var result = window.validateEnrollmentForm({ silent: true });
      valid = result.valid;
      if (!valid && result.message) message = result.message;
    }

    btn.disabled = false;
    btn.classList.toggle("enrollment-submit-btn--pending", !valid);
    btn.setAttribute("aria-disabled", valid ? "false" : "true");
    if (hint) {
      hint.textContent = valid ? "All set — proceed to pay" : message;
      hint.classList.toggle("enrollment-submit-hint--warn", !valid);
    }
  }

  function wireFormListeners() {
    var form = $("enrollmentForm");
    if (!form || form.dataset.enrollmentWired) return;
    form.dataset.enrollmentWired = "1";

    form.addEventListener(
      "input",
      function (e) {
        if (e.target.matches("#fieldHeightFt, #fieldHeightIn, #fieldWeight")) {
          syncHeightWeightHidden();
        }
        if (
          e.target.matches(
            "#fieldAddressLine1, #fieldAddressLine2, #fieldCity, #fieldState, #fieldPincode, #fieldCountry"
          )
        ) {
          syncAddressHidden();
        }
        updateSubmitState();
      },
      true
    );

    form.addEventListener(
      "change",
      function (e) {
        if (e.target.matches("#fieldHeightFt, #fieldHeightIn, #fieldWeight")) {
          syncHeightWeightHidden();
        }
        updateSubmitState();
      },
      true
    );

    form.querySelectorAll('input[type="file"]').forEach(function (fileInput) {
      fileInput.addEventListener("change", function () {
        updateSubmitState();
      });
    });

    if (typeof window.wireEnrollmentInlineValidation === "function") {
      window.wireEnrollmentInlineValidation(form);
    }

    updateSubmitState();
  }

  function compactPageStyles() {
    document.body.classList.add("enrollment-compact");
    document.documentElement.classList.add("plan-app-viewport");
  }

  function upgradeMobileMarkup() {
    var head = document.querySelector(".form-section > div");
    if (head && !head.classList.contains("enrollment-page-head")) {
      head.classList.add("enrollment-page-head");
    }

    var paymentCard = document.querySelector("#enrollmentSubmitBtn")?.closest(".card");
    if (paymentCard && !paymentCard.querySelector(".plan-premium-row")) {
      var priceWrap = paymentCard.querySelector("div[style*='justify-content:space-between']");
      if (priceWrap) {
        priceWrap.classList.add("plan-premium-row");
        var amount = priceWrap.querySelector("div[style*='font-size:2rem']");
        var meta = priceWrap.querySelector("div[style*='text-align:right']");
        if (amount) {
          amount.classList.add("premium-amount");
          var amtEl = amount.querySelector("div:last-child") || amount.children[1];
          if (amtEl) amtEl.classList.add("premium-amount");
        }
        if (meta) meta.classList.add("premium-meta");
      }
    }

    var sidebar = document.querySelector(".sticky-sidebar");
    if (sidebar) sidebar.classList.add("plan-sidebar-mobile");
  }

  function init() {
    compactPageStyles();
    upgradeMobileMarkup();
    upgradeMaritalStatus();
    upgradeAddressBlock();
    upgradeMedicalFields();
    upgradeAadhaarField();
    upgradePaymentSection();
    wirePincodeLookup();
    wireAadhaarMasking();
    wireSurgeryYearToggle();
    wireDiseaseNoneExclusive();
    wireFormListeners();

    window.calculateBMI = syncHeightWeightHidden;
    window.calculateAge = function () {
      var dobInput = $("dobInput");
      var ageDisplay = $("ageDisplay");
      if (!dobInput || !ageDisplay || !dobInput.value) return;
      var dob = new Date(dobInput.value);
      var today = new Date();
      var age = today.getFullYear() - dob.getFullYear();
      var m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      ageDisplay.value = age + " yrs";
      updateSubmitState();
    };

    var dob = $("dobInput");
    if (dob) {
      var maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - MIN_AGE);
      var minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - MAX_AGE);
      dob.setAttribute("max", maxDate.toISOString().slice(0, 10));
      dob.setAttribute("min", minDate.toISOString().slice(0, 10));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
