(function () {
  var PLAN_DOCS = {
    "silver plan": "Astikan_Silver_Plan_Policy_Details_Certificate.docx",
    "gold plan": "Astikan_Gold_Plan_Policy_Details_Certificate.docx",
    "platinum plan": "Astikan_Platinum_Plan_Policy_Details_Certificate.docx"
  };

  function siteBase() {
    var config = window.ASTIKAN_CONFIG || {};
    return (config.publicSiteUrl || window.location.origin).replace(/\/$/, "");
  }

  function detectPlanKey() {
    var title = document.querySelector(".plan-title");
    var text = title ? title.textContent.trim().toLowerCase() : "";
    if (text.indexOf("platinum") !== -1) return "platinum plan";
    if (text.indexOf("gold") !== -1) return "gold plan";
    if (text.indexOf("silver") !== -1) return "silver plan";
    return "silver plan";
  }

  function ensureModal() {
    if (document.getElementById("planPreviewModal")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      '<div aria-hidden="true" class="plan-preview-overlay" id="planPreviewModal">' +
        '<div class="plan-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="planPreviewTitle">' +
          '<div class="plan-preview-head">' +
            '<h3 id="planPreviewTitle">Plan Preview</h3>' +
            '<button aria-label="Close preview" class="plan-preview-close" id="planPreviewClose" type="button">' +
              '<i class="bi bi-x-lg"></i>' +
            "</button>" +
          "</div>" +
          '<p class="plan-preview-note">Official policy details document for this membership plan.</p>' +
          '<div class="plan-preview-frame-wrap">' +
            '<iframe class="plan-preview-frame" id="planPreviewFrame" title="Plan policy preview"></iframe>' +
          "</div>" +
          '<div class="plan-preview-actions">' +
            '<a class="plan-preview-download" href="#" id="planPreviewDownload" rel="noopener" target="_blank">Download document</a>' +
            '<button class="plan-preview-done" id="planPreviewDone" type="button">Close</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );

    var overlay = document.getElementById("planPreviewModal");
    function close() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      var frame = document.getElementById("planPreviewFrame");
      if (frame) frame.src = "about:blank";
    }

    document.getElementById("planPreviewClose").addEventListener("click", close);
    document.getElementById("planPreviewDone").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
  }

  function open(planKey) {
    ensureModal();
    var key = planKey || detectPlanKey();
    var file = PLAN_DOCS[key] || PLAN_DOCS["silver plan"];
    var docUrl = siteBase() + "/" + file;
    var viewer =
      "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(docUrl);

    document.getElementById("planPreviewTitle").textContent =
      (document.querySelector(".plan-title")?.textContent.trim() || "Plan") + " — Policy Preview";
    document.getElementById("planPreviewFrame").src = viewer;
    document.getElementById("planPreviewDownload").href = docUrl;

    var overlay = document.getElementById("planPreviewModal");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function wireButtons() {
    document.querySelectorAll("[data-plan-preview]").forEach(function (btn) {
      if (btn.dataset.previewWired) return;
      btn.dataset.previewWired = "1";
      btn.addEventListener("click", function () {
        open(btn.getAttribute("data-plan-preview") || detectPlanKey());
      });
    });
  }

  window.AstikanPlanPreview = { open: open, wireButtons: wireButtons };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireButtons);
  } else {
    wireButtons();
  }
})();