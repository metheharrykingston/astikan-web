(function () {
  var SERVICES = {
    "lab-test": {
      page: "lab-tests",
      title: "Lab Test Request",
      browseTitle: "Lab Test Inventory",
      browseDesc: "Search tests, compare price & sample type, then request booking.",
      icon: "bi-eyedropper",
      desc: "Request a lab test under your membership plan.",
      claim: false,
      inventory: "lab-tests",
      dataUrl: "../assets/lab-tests.json"
    },
    "opd": {
      page: "find-doctors",
      title: "OPD Consultation Request",
      browseTitle: "OPD Consultation",
      browseDesc: "Request an OPD consultation. Our team will match you with a suitable doctor from the Astikan panel.",
      browsePoints: [
        "Share your symptoms or specialty needed in the request form.",
        "Our care team will contact you within a few minutes to coordinate your OPD slot.",
        "Member plan benefits apply as per your active membership."
      ],
      icon: "bi-hospital",
      desc: "Request an OPD consultation visit with our panel doctors.",
      responseNote: "Our care team will contact you within a few minutes on your registered mobile or email.",
      claim: false
    },
    "tele": {
      page: "teleconsultation",
      title: "Teleconsultation Request",
      browseTitle: "Teleconsultation",
      browseDesc: "Request a video consultation with a certified doctor under your membership.",
      browsePoints: [
        "Unlimited teleconsultation subject to fair-use under your plan.",
        "Submit preferred time and health concern in the request.",
        "Doctor link/details shared on your registered contact."
      ],
      icon: "bi-camera-video",
      desc: "Request a video consultation with a certified doctor.",
      claim: false
    },
    "medicine": {
      page: "medicine",
      title: "Medicine Delivery Request",
      browseTitle: "Medicine Inventory",
      browseDesc: "Browse available medicines and pricing, then submit a delivery request for our pharmacy team.",
      icon: "bi-capsule",
      desc: "Request medicine delivery with member discounts.",
      claim: false,
      inventory: "medicines",
      dataUrl: "../assets/medicines.json"
    },
    "healthpocket": {
      page: "healthpocket",
      title: "HealthPocket Card Request",
      browseTitle: "HealthPocket Card",
      browseDesc: "Request activation or support for your Rupay HealthPocket card.",
      icon: "bi-credit-card-2-front",
      desc: "Request activation or support for your Rupay HealthPocket card.",
      claim: false
    },
    "finance": {
      page: "finance",
      title: "Medical Finance Request",
      browseTitle: "Medical Finance",
      browseDesc: "Request medical credit or finance assistance under your membership.",
      icon: "bi-cash-stack",
      desc: "Request medical credit or finance assistance under your plan.",
      claim: false
    },
    "insurance": {
      page: "insurance",
      title: "Insurance Assistance Request",
      browseTitle: "Insurance Assistance",
      browseDesc: "Request help with policy, TPA, or insurance coordination.",
      icon: "bi-shield-check",
      desc: "Request help with policy, TPA, or insurance coordination.",
      claim: true
    },
    "accident": {
      page: "grievance",
      title: "Accidental Claim Request",
      browseTitle: "Accidental Claim",
      browseDesc: "Submit a request to file an accidental coverage claim.",
      icon: "bi-bandaid",
      desc: "Submit a request to file an accidental coverage claim.",
      claim: true
    },
    "ipd": {
      page: "ipd",
      title: "IPD Claim Request",
      browseTitle: "IPD Claim",
      browseDesc: "Submit a hospitalization (IPD) claim request under your plan.",
      icon: "bi-clipboard2-pulse",
      desc: "Submit a hospitalization (IPD) claim request.",
      claim: true
    },
    "ambulance": {
      page: "ambulance",
      title: "Ambulance Request",
      browseTitle: "Ambulance Support",
      browseDesc: "Request 24×7 ambulance or emergency transport support.",
      icon: "bi-truck",
      desc: "Request 24×7 ambulance or emergency transport support.",
      claim: false
    },
    "grievance": {
      page: "grievance",
      title: "Grievance Request",
      browseTitle: "Grievance",
      browseDesc: "Raise a grievance or complaint regarding your membership.",
      icon: "bi-chat-left-text",
      desc: "Raise a grievance or complaint regarding your membership.",
      claim: true
    },
    "contact": {
      page: "contact",
      title: "Contact Support Request",
      browseTitle: "Contact Support",
      browseDesc: "Send a support request to the Astikan member care team.",
      icon: "bi-telephone",
      desc: "Send a support request to the Astikan member care team.",
      claim: false
    }
  };

  var HREF_TO_SERVICE = {
    "lab-test.html": "lab-test",
    "find-doctors.html": "opd",
    "video-consultation.html": "tele",
    "medicine-delivery.html": "medicine",
    "https://healthpocket.in": "healthpocket",
    "medical-finance.html": "finance",
    "insurance-assistance.html": "insurance",
    "grevience-portal.html": "accident",
    "ambulance-emergency.html": "ambulance"
  };

  function isMemberFolder() {
    return /\/member(\/|$)/.test(window.location.pathname);
  }

  function enrollmentSuffix() {
    try {
      var id = new URLSearchParams(window.location.search).get("enrollmentId");
      if (!id) {
        var stored = JSON.parse(localStorage.getItem("astikanLastEnrollment") || "null");
        id = stored && stored.enrollmentId;
      }
      return id ? "&enrollmentId=" + encodeURIComponent(id) : "";
    } catch (e) {
      return "";
    }
  }

  function browseUrl(serviceId) {
    var base = isMemberFolder() ? "browse.html" : "member/browse.html";
    return base + "?service=" + encodeURIComponent(serviceId) + enrollmentSuffix();
  }

  function requestUrl(serviceId, extras) {
    var base = isMemberFolder() ? "request.html" : "member/request.html";
    var parts = ["service=" + encodeURIComponent(serviceId)];
    var suffix = enrollmentSuffix();
    if (suffix) parts.push(suffix.slice(1));

    extras = extras || {};
    if (extras.details) parts.push("details=" + encodeURIComponent(extras.details));
    if (extras.test) parts.push("test=" + encodeURIComponent(extras.test));
    if (extras.name) parts.push("name=" + encodeURIComponent(extras.name));
    if (extras.medicine) parts.push("medicine=" + encodeURIComponent(extras.medicine));

    return base + "?" + parts.join("&");
  }

  function portalEntryUrl(serviceId) {
    var service = SERVICES[serviceId];
    if (!service) return browseUrl(serviceId);
    if (service.claim) return requestUrl(serviceId);
    return browseUrl(serviceId);
  }

  window.MemberPortalRoutes = {
    SERVICES: SERVICES,

    getService: function (serviceId) {
      return SERVICES[serviceId] || null;
    },

    browseUrl: browseUrl,
    requestUrl: requestUrl,
    portalEntryUrl: portalEntryUrl,

    hrefToServiceId: function (href) {
      if (!href) return null;
      if (HREF_TO_SERVICE[href]) return HREF_TO_SERVICE[href];
      var file = href.split("/").pop().split("?")[0];
      return HREF_TO_SERVICE[file] || null;
    },

    resolveServiceHref: function (href) {
      var serviceId = this.hrefToServiceId(href);
      if (serviceId) return portalEntryUrl(serviceId);
      return href;
    },

    dashboardUrl: function () {
      if (window.MemberPortalNav) {
        return window.MemberPortalNav.dashboardHome();
      }
      return "membership-dashboard.html";
    }
  };
})();