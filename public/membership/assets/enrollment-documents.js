(function () {
  var config = window.ASTIKAN_CONFIG || {};
  var supabaseConfig = config.supabase || {};

  function apiBase() {
    return (supabaseConfig.url || "").replace(/\/$/, "") + "/functions/v1/enrollment-documents";
  }

  function headers() {
    return {
      "Content-Type": "application/json",
      apikey: supabaseConfig.anonKey || "",
      Authorization: "Bearer " + (supabaseConfig.anonKey || ""),
    };
  }

  async function post(payload) {
    var response = await fetch(apiBase(), {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    var data = await response.json().catch(function () {
      return {};
    });
    if (!response.ok) {
      throw new Error(data.error || "Document request failed");
    }
    return data;
  }

  async function uploadDocumentFiles(user, enrollmentId, files) {
    if (!user || !enrollmentId || !files || !files.length) return {};

    var prepared = await post({
      action: "prepare-upload",
      enrollmentId: enrollmentId,
      uid: user.uid,
      files: files.map(function (item) {
        return { key: item.key, name: item.name || (item.file && item.file.name) || "document" };
      }),
    });

    var paths = {};
    for (var j = 0; j < files.length; j++) {
      var spec = files[j];
      var upload = prepared.uploads && prepared.uploads[spec.key];
      if (!upload || !spec.file) continue;

      var putResponse = await fetch(upload.signedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": spec.file.type || "application/octet-stream",
          "x-upsert": "true",
        },
        body: spec.file,
      });

      if (!putResponse.ok) {
        throw new Error("Upload failed for " + spec.key);
      }

      paths[spec.key] = upload.path;
    }

    if (!Object.keys(paths).length) return {};

    var confirmed = await post({
      action: "confirm-upload",
      enrollmentId: enrollmentId,
      uid: user.uid,
      paths: paths,
    });

    return confirmed;
  }

  async function uploadEnrollmentDocuments(user, enrollmentId) {
    if (!user || !enrollmentId) return {};

    var specs = [
      { inputId: "fieldPhoto", key: "photo" },
      { inputId: "fieldAddressProof", key: "address_proof" },
    ];

    var files = [];
    for (var i = 0; i < specs.length; i++) {
      var input = document.getElementById(specs[i].inputId);
      if (!input || !input.files || !input.files[0]) continue;
      files.push({
        key: specs[i].key,
        name: input.files[0].name,
        file: input.files[0],
      });
    }

    if (!files.length) return {};

    var confirmed = await uploadDocumentFiles(user, enrollmentId, files);
    return confirmed.document_urls || {};
  }

  async function resolveEnrollmentDocuments(enrollmentId) {
    return post({
      action: "resolve",
      enrollmentId: enrollmentId,
    });
  }

  window.AstikanEnrollmentDocuments = {
    uploadEnrollmentDocuments: uploadEnrollmentDocuments,
    uploadDocumentFiles: uploadDocumentFiles,
    resolveEnrollmentDocuments: resolveEnrollmentDocuments,
  };
})();