(function () {
  function ensureModal() {
    if (document.getElementById("documentPreviewModal")) return;

    document.body.insertAdjacentHTML(
      "beforeend",
      '<div aria-hidden="true" class="doc-preview-overlay" id="documentPreviewModal">' +
        '<div class="doc-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="docPreviewTitle">' +
          '<div class="doc-preview-head">' +
            '<h3 id="docPreviewTitle">Document Preview</h3>' +
            '<button aria-label="Close document preview" class="doc-preview-close" id="docPreviewClose" type="button">' +
              '<i class="bi bi-x-lg"></i>' +
            "</button>" +
          "</div>" +
          '<div class="doc-preview-body" id="docPreviewBody"></div>' +
          '<div class="doc-preview-actions">' +
            '<a class="doc-preview-download" href="#" id="docPreviewDownload" rel="noopener" target="_blank">Download</a>' +
            '<button class="doc-preview-done" id="docPreviewDone" type="button">Close</button>' +
          "</div>" +
        "</div>" +
      "</div>"
    );

    var overlay = document.getElementById("documentPreviewModal");
    function close() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.getElementById("docPreviewBody").innerHTML = "";
      var download = document.getElementById("docPreviewDownload");
      if (download) download.setAttribute("href", "#");
    }

    document.getElementById("docPreviewClose").addEventListener("click", close);
    document.getElementById("docPreviewDone").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
  }

  function open(opts) {
    ensureModal();
    var title = document.getElementById("docPreviewTitle");
    var body = document.getElementById("docPreviewBody");
    var download = document.getElementById("docPreviewDownload");
    var overlay = document.getElementById("documentPreviewModal");

    title.textContent = opts.title || "Document Preview";
    download.href = opts.url || "#";

    if (opts.kind === "pdf") {
      body.innerHTML =
        '<iframe class="doc-preview-frame" src="' + opts.url + '" title="' + (opts.title || "Document") + '"></iframe>';
    } else {
      body.innerHTML =
        '<img alt="' + (opts.title || "Document") + '" class="doc-preview-image" src="' + opts.url + '"/>';
    }

    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  window.AstikanDocumentPreview = { open: open };
})();