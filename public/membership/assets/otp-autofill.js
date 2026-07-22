(function () {
  var activeSession = null;

  function extractOtpCode(value) {
    var digits = String(value || "").replace(/\D/g, "");
    var match = digits.match(/\d{6}/);
    return match ? match[0] : "";
  }

  function configureOtpInput(input) {
    if (!input) return;
    input.setAttribute("autocomplete", "one-time-code");
    input.setAttribute("inputmode", "numeric");
    input.setAttribute("pattern", "[0-9]*");
    input.setAttribute("maxlength", "6");
    input.type = "tel";
    input.setAttribute("aria-label", "One-time password");
  }

  function cleanupSession(session) {
    if (!session) return;
    if (session.abort) session.abort.abort();
    if (session.timeoutId) clearTimeout(session.timeoutId);
    if (session.onInput && session.input) {
      session.input.removeEventListener("input", session.onInput);
    }
  }

  function stop() {
    cleanupSession(activeSession);
    activeSession = null;
  }

  function applyCode(input, code, onFilled) {
    if (!input || !code) return;
    input.value = code;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    if (typeof onFilled === "function") onFilled(code);
  }

  function start(options) {
    stop();

    var input = options && options.input;
    if (!input) return;

    configureOtpInput(input);

    var session = {
      input: input,
      abort: new AbortController(),
      prevLen: 0,
      filled: false
    };
    activeSession = session;

    var timeoutMs = (options && options.timeoutMs) || 120000;
    session.timeoutId = setTimeout(function () {
      cleanupSession(session);
      if (activeSession === session) activeSession = null;
    }, timeoutMs);

    session.onInput = function () {
      var code = extractOtpCode(input.value);
      var len = code.length;
      var likelyAutofill = len === 6 && session.prevLen <= 1;
      session.prevLen = len;

      if (code && code !== input.value) {
        input.value = code;
      }

      if (code.length === 6 && likelyAutofill && !session.filled) {
        session.filled = true;
        if (typeof options.onFilled === "function") options.onFilled(code);
      }
    };
    input.addEventListener("input", session.onInput);

    if ("OTPCredential" in window && navigator.credentials && navigator.credentials.get) {
      navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: session.abort.signal
      }).then(function (cred) {
        if (!cred || activeSession !== session || session.filled) return;
        var code = extractOtpCode(cred.code);
        if (!code) return;
        session.filled = true;
        applyCode(input, code, options.onFilled);
      }).catch(function () {
        // Unsupported SMS format, timeout, or user dismissed prompt.
      });
    }

    window.setTimeout(function () {
      try {
        input.focus({ preventScroll: true });
      } catch (e) {
        input.focus();
      }
    }, 120);
  }

  window.AstikanOtpAutofill = {
    configure: configureOtpInput,
    start: start,
    stop: stop,
    extractCode: extractOtpCode
  };
})();