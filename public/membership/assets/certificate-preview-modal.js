(function () {
  function ensureModal() {
    if (document.getElementById("certificatePreviewModal")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      '<div aria-hidden="true" class="cert-preview-overlay" id="certificatePreviewModal">' +
        '<div class="cert-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="certPreviewTitle">' +
          '<div class="cert-preview-head">' +
            '<h3 id="certPreviewTitle">Policy Certificate Preview</h3>' +
            '<button aria-label="Close certificate preview" class="cert-preview-close" id="certPreviewClose" type="button">' +
              '<i class="bi bi-x-lg"></i>' +
            "</button>" +
          "</div>" +
          '<p class="cert-preview-meta" id="certPreviewMeta"></p>' +
          '<div class="cert-preview-frame-wrap">' +
            '<iframe class="cert-preview-frame" id="certPreviewFrame" title="Policy certificate PDF preview"></iframe>' +
          "</div>" +
          '<div class="cert-preview-actions">' +
            '<button class="cert-preview-done" id="certPreviewDone" type="button">Close</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );

    var overlay = document.getElementById("certificatePreviewModal");
    function close() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      var frame = document.getElementById("certPreviewFrame");
      if (frame) frame.removeAttribute("src");
      if (window.__certPreviewBlobUrl) {
        URL.revokeObjectURL(window.__certPreviewBlobUrl);
        window.__certPreviewBlobUrl = null;
      }
    }

    document.getElementById("certPreviewClose").addEventListener("click", close);
    document.getElementById("certPreviewDone").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
  }

  function openPdfBlob(blob, meta) {
    ensureModal();
    if (window.__certPreviewBlobUrl) URL.revokeObjectURL(window.__certPreviewBlobUrl);
    window.__certPreviewBlobUrl = URL.createObjectURL(blob);
    document.getElementById("certPreviewFrame").src = window.__certPreviewBlobUrl;
    document.getElementById("certPreviewMeta").textContent = meta || "";
    var overlay = document.getElementById("certificatePreviewModal");
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  window.AstikanCertificatePreview = { openPdfBlob: openPdfBlob };
})();