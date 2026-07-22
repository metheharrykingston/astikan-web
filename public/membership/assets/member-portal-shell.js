(function () {
  var params = new URLSearchParams(window.location.search);
  var src = params.get("src") || "";
  var pageTitle = params.get("title") || "Member Service";
  var activeIframe = null;

  function routes() {
    return window.MemberPortalRoutes || { PAGES: {}, normalizeFile: function () { return ""; }, getPageMeta: function () { return null; }, buildPortalUrl: function () { return null; } };
  }

  function normalizeFile(pathname) {
    return routes().normalizeFile(pathname);
  }

  function resolveTarget() {
    if (!src) return null;
    return src.charAt(0) === "/" ? src.slice(1) : src;
  }

  function portalLinkForFile(file, search, titleOverride) {
    if (!window.MemberPortalNav) return null;
    var meta = routes().getPageMeta(file);
    if (!meta) return null;
    var srcValue = file + (search || "");
    return window.MemberPortalNav.portalUrl(
      srcValue,
      meta.page,
      titleOverride || meta.title
    );
  }

  function stripPublicChrome(doc) {
    if (!doc) return;

    var style = doc.getElementById("member-portal-embed-style");
    if (!style) {
      style = doc.createElement("style");
      style.id = "member-portal-embed-style";
      style.textContent =
        "header.sticky-header," +
        "#offcanvasMenu," +
        ".custom-offcanvas," +
        ".emergency-btn," +
        ".menu-ellipsis," +
        ".navbar-toggler," +
        "footer.futrr," +
        ".futrr { display: none !important; }" +
        "body { padding-top: 0 !important; margin-top: 0 !important; }" +
        "html, body.member-portal-embed { overflow-x: hidden; }" +
        "body.member-portal-embed { background: #f8fafc; }";
      (doc.head || doc.documentElement).appendChild(style);
    }

    if (doc.body) {
      doc.body.classList.add("member-portal-embed");
    }
  }

  function injectNavigationBridge(doc) {
    if (!doc || doc.getElementById("member-portal-bridge-script")) return;

    var script = doc.createElement("script");
    script.id = "member-portal-bridge-script";
    script.textContent =
      "(function(){" +
        "if(window.self===window.top||window.__astikanPortalBridge)return;" +
        "window.__astikanPortalBridge=true;" +
        "function fileFromUrl(url){" +
          "try{var u=new URL(url,window.location.href);return u.pathname.split('/').pop().split('?')[0];}catch(e){return '';}" +
        "}" +
        "function notify(url){" +
          "try{" +
            "var u=new URL(url,window.location.href);" +
            "if(u.origin!==window.parent.location.origin)return false;" +
            "window.parent.postMessage({type:'astikan-portal-navigate',file:fileFromUrl(u.href),search:u.search||'',title:''},'*');" +
            "return true;" +
          "}catch(e){return false;}" +
        "}" +
        "document.addEventListener('click',function(e){" +
          "var a=e.target.closest('a[href]');" +
          "if(!a)return;" +
          "if(a.target==='_blank')return;" +
          "var href=a.getAttribute('href');" +
          "if(!href||href.indexOf('#')===0||href.indexOf('tel:')===0||href.indexOf('mailto:')===0)return;" +
          "if(notify(a.href))e.preventDefault();" +
        "},true);" +
        "var pushState=history.pushState;" +
        "history.pushState=function(){pushState.apply(history,arguments);window.parent.postMessage({type:'astikan-portal-iframe-nav'},'*');};" +
        "window.addEventListener('load',function(){window.parent.postMessage({type:'astikan-portal-iframe-nav'},'*');});" +
      "})();";
    (doc.head || doc.documentElement).appendChild(script);
  }

  function resizeIframe(iframe) {
    if (!iframe || !iframe.contentDocument) return;
    var doc = iframe.contentDocument;
    var height = Math.max(
      doc.body ? doc.body.scrollHeight : 0,
      doc.documentElement ? doc.documentElement.scrollHeight : 0,
      640
    );
    iframe.style.height = height + "px";
  }

  function updateToolbarTitle(title) {
    var toolbar = document.getElementById("memberPortalToolbar");
    if (!toolbar) return;
    var titleEl = toolbar.querySelector(".member-portal-title span");
    if (titleEl && title) titleEl.textContent = title;
    if (title) document.title = title + " | Astikan Member Portal";
  }

  function handleIframeLoad(iframe) {
    stripPublicChrome(iframe.contentDocument);
    injectNavigationBridge(iframe.contentDocument);
    resizeIframe(iframe);

    try {
      var file = normalizeFile(iframe.contentWindow.location.pathname);
      var meta = routes().getPageMeta(file);
      if (meta) updateToolbarTitle(meta.title);
    } catch (e) {}
  }

  function interceptIframeLinks(iframe) {
    var doc = iframe.contentDocument;
    if (!doc) return;

    doc.addEventListener("click", function (e) {
      var anchor = e.target.closest("a");
      if (!anchor || !anchor.href || anchor.target === "_blank") return;

      var url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch (err) {
        return;
      }

      if (url.origin !== window.location.origin) return;

      var file = normalizeFile(url.pathname);
      var wrapped = portalLinkForFile(file, url.search);
      if (!wrapped) return;

      e.preventDefault();
      window.location.href = wrapped;
    }, true);
  }

  function navigatePortal(file, search, title) {
    var wrapped = portalLinkForFile(file, search || "", title);
    if (!wrapped) return;
    window.location.href = wrapped;
  }

  function mountIframe(targetPath) {
    var container = document.getElementById("memberPortalContent");
    if (!container) return;

    var iframeSrc = "../" + targetPath;

    var iframe = document.createElement("iframe");
    iframe.className = "member-portal-frame";
    iframe.title = pageTitle;
    iframe.src = iframeSrc;
    iframe.setAttribute("loading", "eager");

    iframe.addEventListener("load", function () {
      handleIframeLoad(iframe);
      interceptIframeLinks(iframe);
    });

    activeIframe = iframe;
    container.innerHTML = "";
    container.appendChild(iframe);

    window.setTimeout(function () {
      resizeIframe(iframe);
    }, 600);
    window.setTimeout(function () {
      resizeIframe(iframe);
    }, 1800);
  }

  function renderToolbar() {
    var toolbar = document.getElementById("memberPortalToolbar");
    if (!toolbar || !window.MemberPortalNav) return;

    toolbar.innerHTML =
      '<div class="member-portal-toolbar-inner">' +
        '<a class="member-portal-back" href="' + routes().dashboardUrl() + '">' +
          '<i class="bi bi-arrow-left"></i> Dashboard' +
        "</a>" +
        '<div class="member-portal-title">' +
          '<i class="bi bi-shield-check"></i>' +
          "<span>" + pageTitle + "</span>" +
        "</div>" +
      "</div>";
  }

  window.addEventListener("message", function (event) {
    if (!event.data) return;
    if (activeIframe && event.source !== activeIframe.contentWindow) return;

    if (event.data.type === "astikan-portal-navigate") {
      var meta = routes().getPageMeta(event.data.file);
      navigatePortal(event.data.file, event.data.search, meta ? meta.title : "");
      return;
    }

    if (event.data.type === "astikan-portal-iframe-nav" && activeIframe) {
      handleIframeLoad(activeIframe);
    }
  });

  function init() {
    var target = resolveTarget();
    if (!target) {
      window.location.href = routes().dashboardUrl();
      return;
    }

    document.title = pageTitle + " | Astikan Member Portal";
    renderToolbar();
    mountIframe(target);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();